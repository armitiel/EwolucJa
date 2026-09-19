# -*- coding: utf-8 -*-
# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
dzwiek-kroki-woda.py — syntezuje petle „kroki w wodzie" — brodzenie w plytkiej wodzie.

RYTM JEST PRZEPISANY Z `footstep_scuff_run.mp3`, co do kroku: te same szesc
onsetow (0,135 / 0,457 / 0,782 / 1,117 / 1,421 / 1,773 s) i ta sama dlugosc
petli. Dzieki temu wejscie z trawy do wody zmienia BARWE, a nie tempo —
gdyby rytm skoczyl, ucho uslyszaloby bląd, a nie zmiane podloza.
"""
import numpy as np
from scipy.signal import butter, sosfilt
import wave

SR = 44100
DL = 2.05           # dlugosc pliku
KONIEC_PETLI = 1.89 # ta sama stala co w soundFx.js
ONSETY = [0.135, 0.457, 0.782, 1.117, 1.421, 1.773]

rng = np.random.default_rng(7)
n = int(DL * SR)
buf = np.zeros(n, dtype=np.float64)

def nisko(x, hi, rzad=4):
    return sosfilt(butter(rzad, hi, btype="low", fs=SR, output="sos"), x)

def dodaj(sig, t0):
    i = int(t0 * SR)
    k = min(len(sig), n - i)
    if k > 0: buf[i:i+k] += sig[:k]

def szum(dl):
    return rng.standard_normal(int(dl * SR))

def zanik(dl, tau, atak=0.003):
    t = np.arange(int(dl * SR)) / SR
    e = np.exp(-t / tau)
    a = int(atak * SR)
    if a > 1: e[:a] *= np.linspace(0, 1, a) ** 2
    return e

def kropla(f0, dl, amp):
    """Klasyczny „plink": sinus z szybkim PODJAZDEM czestotliwosci w gore.
       To ten podjazd slyszymy jako krople — sam zanik daje zwykly stuk."""
    t = np.arange(int(dl * SR)) / SR
    f = f0 * (1 + 1.25 * (t / dl) ** 0.55)
    faza = 2 * np.pi * np.cumsum(f) / SR
    return amp * np.sin(faza) * zanik(dl, dl * 0.32, 0.0012)

for nr, t0 in enumerate(ONSETY):
    ostatni = nr == len(ONSETY) - 1
    # Ostatni krok ma KROTSZY ogon, zeby wybrzmial przed 1,89 s — inaczej
    # koniec petli ucialby go w polowie i co obieg slychac by bylo trzask.
    mnoz = 0.62 if ostatni else 1.0
    war = 0.88 + 0.24 * rng.random()   # kazdy krok troche inny, inaczej brzmi jak maszyna

    # 1. PLUSK — szerokopasmowy rozbryzg, to jest glowny dzwiek
    dl = 0.20 * mnoz
    s = szum(dl)
    s = sosfilt(butter(4, [420 * war, 2600 * war], btype="band", fs=SR, output="sos"), s)
    dodaj(0.55 * war * s * zanik(dl, 0.034 * mnoz), t0)

    # 2. WYPARTA WODA — niski „lup", daje krokowi ciezar
    dl = 0.18 * mnoz
    s = nisko(szum(dl), 340)
    dodaj(0.95 * s * zanik(dl, 0.042 * mnoz, 0.005), t0 + 0.004)

    # 3. MGIELKA — wysoki rozprysk, sypie sie chwile po uderzeniu
    dl = 0.22 * mnoz
    s = sosfilt(butter(4, [3800, 9000], btype="band", fs=SR, output="sos"), szum(dl))
    dodaj(0.085 * war * s * zanik(dl, 0.055 * mnoz, 0.010), t0 + 0.012)

    # 4. KROPLE — 2–4 na krok, rozrzucone po uderzeniu
    for _ in range(rng.integers(2, 5)):
        dodaj(kropla(1100 + 1500 * rng.random(),
                     0.020 + 0.022 * rng.random(),
                     (0.06 + 0.07 * rng.random()) * mnoz),
              t0 + 0.035 + 0.20 * rng.random() * mnoz)

# Cichutka tafla miedzy krokami — bez niej kroki wisza w absolutnej ciszy
# i brzmia jak stukanie, a nie jak woda. Wygaszona do zera na obu koncach
# petli, zeby zapetlenie nie klikalo.
tafla = sosfilt(butter(2, [300, 2600], btype="band", fs=SR, output="sos"), szum(DL))
env = np.ones(n)
kraw = int(0.06 * SR)
env[:kraw] = np.linspace(0, 1, kraw)
kon = int(KONIEC_PETLI * SR)
env[kon - kraw:kon] = np.linspace(1, 0, kraw)
env[kon:] = 0
buf += 0.0035 * tafla * env

# GLOSNOSC DOPASOWANA DO PLIKU LADOWEGO, i to po RMS, nie po szczycie.
# `KROKI_GLOSNOSC` w `soundFx.js` jest dostrojone do tamtego nagrania, wiec
# woda musi wejsc w to samo miejsce skali — inaczej wejscie do jeziora
# podbija glosnosc gry. Szczyt zestrajac nie wolno: plusk ma ostrzejsze
# transjenty niz szuranie, wiec przy rownych szczytach bylby ciagle cichszy.
RMS_LADOWY = 0.0084   # zmierzone w footstep_scuff_run.mp3
buf *= RMS_LADOWY / np.sqrt(np.mean(buf ** 2))
szczyt = np.max(np.abs(buf))
if szczyt > 0.85: buf *= 0.85 / szczyt

# CICHE ZSZYCIE. Ogon ostatniego plusku siega poza koniec petli, a zapetlenie
# ucina go w pol drgania — slychac to jako trzask co obieg. 45 ms wygaszenia
# tuz przed `KONIEC_PETLI` jest na zanikajacym ogonie niesłyszalne, a zszycie
# robi sie ciche z obu stron.
zan = int(0.045 * SR)
buf[kon - zan:kon] *= np.linspace(1, 0, zan) ** 0.7
buf[kon:] = 0
buf[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))

x = np.clip(buf, -1, 1)
w = wave.open("woda.wav", "w")
w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((x * 32767).astype(np.int16).tobytes())
w.close()
print("zapisane woda.wav  %.3f s" % (len(x) / SR))

# Po wygenerowaniu:
#   ffmpeg -i woda.wav -codec:a libmp3lame -b:a 64k -ac 1 -ar 44100 \
#          ../frontend/public/woda-kroki.mp3 -y
#
# Zmierzone przy ostatnim przebiegu (obok pliku ladowego):
#   LAD   RMS 0,0084  szczyt 0,260  <300Hz 30%  300-4k 65%  >4k  5%
#   WODA  RMS 0,0080  szczyt 0,113  <300Hz 23%  300-4k 73%  >4k  5%
# Glosnosc zestrojona po RMS, nie po szczycie — `KROKI_GLOSNOSC` w
# `soundFx.js` jest dostrojone do pliku ladowego i woda ma wejsc w to samo
# miejsce skali, a plusk ma ostrzejsze transjenty niz szuranie.
