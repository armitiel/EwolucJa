# -*- coding: utf-8 -*-
# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
dzwiek-plusk.py — przerabia NAGRANIE plusku na plik dla przegladarki.

HISTORIA. Do 19.09 ten skrypt SYNTEZOWAL plusk (warstwy szumu, jak
`dzwiek-kroki-woda.py`). Wlasciciel dostarczyl wlasne nagranie, wiec skrypt
robi teraz to, co faktycznie tworzy plik lezacy na produkcji. Syntezy nie ma
sensu trzymac obok: zmylalaby, bo to nie ona daje dzwiek slyszalny w grze.

CO ROBI I DLACZEGO:

  1. MONO. Plusk jest zrodlem punktowym, gra nie ma panoramy — drugi kanal
     to czysty koszt transferu.
  2. PRZYCIECIE CISZY. Oryginal mial 0,39 s ciszy na koncu; przy dzwieku
     jednorazowym to tylko waga pliku.
  3. GLOSNOSC PO RMS, NIE PO SZCZYCIE — ta sama zasada, co przy krokach.
     Wzorcem jest `pickup.mp3`, bo to sasiad z tej samej polki: dzwiek
     jednorazowy grany przez `playFx` elementem <Audio>. Oryginal mial RMS
     0,0995 i SZCZYT 1,46, czyli master pchniety ponad zero — wpuszczony tak
     do gry przebijalby wszystko inne i trzeszczal na glosniku tabletu.
  4. 64 kbps. Te same ustawienia, co reszta biblioteki dzwiekow.

Efekt ostatniego przebiegu:  48,4 kB / 2,00 s  ->  13,3 kB / 1,64 s

Zrodlo trzymamy POZA `frontend/public/`, zeby nie jechalo do przegladarki
kazdego dziecka — patrz `docs/dzwiek/`.

Wymaga: numpy, ffmpeg.
Uruchomienie:
    python scripts/dzwiek-plusk.py docs/dzwiek/water-splash-zrodlo.mp3 ^
           frontend/public/plusk.mp3
"""
import os
import subprocess
import sys
import wave

import numpy as np

SR = 44100
PROG_CISZY = 10 ** (-50 / 20)   # -50 dBFS: ponizej tego to juz szum tla
RMS_WZORZEC = 0.0277            # zmierzone w pickup.mp3
SZCZYT_MAX = 0.9                # zapas do zera, zeby mp3 nie przesterowalo


def wczytaj(sciezka):
    raw = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", sciezka, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True,
    ).stdout
    if not raw:
        sys.exit(f"Nie udalo sie odczytac {sciezka} (jest ffmpeg?)")
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def obrob(x):
    glosne = np.abs(x) > PROG_CISZY
    if not glosne.any():
        sys.exit("Nagranie jest cichsze niz prog — nie ma czego przycinac.")
    i0 = int(np.argmax(glosne))
    i1 = len(x) - int(np.argmax(glosne[::-1]))
    # Zostawiamy 5 ms przed i 30 ms za trescia: atak plusku jest stromy,
    # a ogon ma dokad wybrzmiec.
    x = x[max(0, i0 - int(0.005 * SR)): min(len(x), i1 + int(0.030 * SR))].copy()

    x *= RMS_WZORZEC / np.sqrt(np.mean(x ** 2))
    szczyt = np.abs(x).max()
    if szczyt > SZCZYT_MAX:
        x *= SZCZYT_MAX / szczyt

    # Domkniecie krawedzi — bez tego przy starcie i stopie slychac trzask.
    a = int(0.003 * SR)
    x[:a] *= np.linspace(0, 1, a)
    z = int(0.020 * SR)
    x[-z:] *= np.linspace(1, 0, z) ** 0.7
    return np.clip(x, -1, 1)


def zapisz(x, wyjscie):
    tmp = wyjscie + ".wav"
    w = wave.open(tmp, "w")
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes())
    w.close()
    subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", tmp, "-codec:a", "libmp3lame",
         "-b:a", "64k", "-ac", "1", "-ar", str(SR), wyjscie, "-y"],
        check=True,
    )
    os.remove(tmp)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    zrodlo, wyjscie = sys.argv[1], sys.argv[2]
    przed = os.path.getsize(zrodlo)
    x = obrob(wczytaj(zrodlo))
    zapisz(x, wyjscie)
    print(f"{zrodlo} ({przed / 1024:.1f} kB)  ->  {wyjscie} "
          f"({os.path.getsize(wyjscie) / 1024:.1f} kB, {len(x) / SR:.2f} s, "
          f"RMS {np.sqrt(np.mean(x ** 2)):.4f}, szczyt {np.abs(x).max():.3f})")
