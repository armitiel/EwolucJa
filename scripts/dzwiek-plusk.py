# -*- coding: utf-8 -*-
# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
dzwiek-plusk.py — syntezuje JEDNORAZOWY plusk: lisek dotyka wody.

CZYM SIE ROZNI OD `dzwiek-kroki-woda.py`. Tamten robi PETLE brodzenia: szesc
rownych, plytkich chlupniec, ktore maja sie nie wybijac, bo lecą bez konca.
Ten jest POJEDYNCZYM ZDARZENIEM i ma prawo byc wyrazisty: to moment, w ktorym
cos sie zmienia — lisek wchodzi z trawy w wode. Stad wiecej masy na dole,
dluzszy ogon kropel i ciche domkniecie tafli na koncu.

Warstwy sa te same, co w petli (ten sam slownik dzwieku, zeby oba pliki
brzmialy jak jedna gra), tylko inaczej wywazone:
  1. wyparta woda  — niski „lup", ciezar wejscia
  2. rozbryzg      — szerokopasmowy trzon plusku
  3. mgielka       — wysoki rozprysk, sypie sie chwile po uderzeniu
  4. krople        — 6-9 „plinkow", rozrzuconych po uderzeniu
  5. tafla         — cichy szum zamykajacej sie wody, gasnie do zera

GLOSNOSC PO RMS, NIE PO SZCZYCIE — ta sama zasada, co przy krokach. Wzorcem
jest `pickup.mp3` (RMS 0,0277), bo to sasiad z tej samej polki: dzwiek
jednorazowy grany przez `playFx` elementem <Audio>, a nie przez Web Audio.
Zestrajanie po szczycie dalo by plusk wyraznie cichszy, bo ma ostrzejsze
transjenty niz dzwiek podniesienia.

Wymaga: numpy, scipy, ffmpeg.
Uruchomienie:
    python scripts/dzwiek-plusk.py
    ffmpeg -i plusk.wav -codec:a libmp3lame -b:a 64k -ac 1 -ar 44100 \
           frontend/public/plusk.mp3 -y
"""
import numpy as np
from scipy.signal import butter, sosfilt
import wave

SR = 44100
DL = 0.85           # dlugosc pliku; ogon kropel gasnie przed koncem

rng = np.random.default_rng(11)
n = int(DL * SR)
buf = np.zeros(n, dtype=np.float64)


def nisko(x, hi, rzad=4):
    return sosfilt(butter(rzad, hi, btype="low", fs=SR, output="sos"), x)


def pasmo(x, lo, hi, rzad=4):
    return sosfilt(butter(rzad, [lo, hi], btype="band", fs=SR, output="sos"), x)


def dodaj(sig, t0):
    i = int(t0 * SR)
    k = min(len(sig), n - i)
    if k > 0:
        buf[i:i + k] += sig[:k]


def szum(dl):
    return rng.standard_normal(int(dl * SR))


def zanik(dl, tau, atak=0.003):
    t = np.arange(int(dl * SR)) / SR
    e = np.exp(-t / tau)
    a = int(atak * SR)
    if a > 1:
        e[:a] *= np.linspace(0, 1, a) ** 2
    return e


def kropla(f0, dl, amp):
    """„Plink": sinus z szybkim PODJAZDEM czestotliwosci w gore. To ten
       podjazd slyszymy jako krople — sam zanik daje zwykly stuk."""
    t = np.arange(int(dl * SR)) / SR
    f = f0 * (1 + 1.25 * (t / dl) ** 0.55)
    faza = 2 * np.pi * np.cumsum(f) / SR
    return amp * np.sin(faza) * zanik(dl, dl * 0.32, 0.0012)


T0 = 0.012   # uderzenie nie zaczyna sie w probce 0 — zostaje chwila ciszy

# 1. WYPARTA WODA — niski „lup". Dluzszy i mocniejszy niz w petli: to cale
#    zwierze wchodzi do wody, a nie sama lapa w biegu.
dl = 0.30
dodaj(1.15 * nisko(szum(dl), 300) * zanik(dl, 0.070, 0.006), T0 + 0.004)

# 2. ROZBRYZG — trzon plusku, szerokie pasmo.
dl = 0.34
dodaj(0.70 * pasmo(szum(dl), 380, 2800) * zanik(dl, 0.055), T0)

# 3. MGIELKA — wysoki rozprysk, wchodzi chwile po uderzeniu i sypie sie dluzej.
dl = 0.40
dodaj(0.14 * pasmo(szum(dl), 3600, 9500) * zanik(dl, 0.090, 0.012), T0 + 0.014)

# 4. KROPLE — 6-9 sztuk, rozrzuconych po uderzeniu. Im pozniej, tym ciszej:
#    woda uspokaja sie, a nie kapie rownym rytmem.
for _ in range(int(rng.integers(6, 10))):
    kiedy = 0.045 + 0.42 * rng.random() ** 0.8
    slabniecie = 1.0 - 0.55 * (kiedy / 0.47)
    dodaj(kropla(1000 + 1700 * rng.random(),
                 0.022 + 0.026 * rng.random(),
                 (0.09 + 0.08 * rng.random()) * slabniecie),
          T0 + kiedy)

# 5. TAFLA — cichy szum zamykajacej sie wody. Bez niego plusk konczy sie
#    w absolutnej ciszy i brzmi jak stuk w pudlo, a nie jak woda.
tafla = pasmo(szum(DL), 280, 2400)
env = np.exp(-np.arange(n) / SR / 0.26)
env[:int(0.010 * SR)] *= np.linspace(0, 1, int(0.010 * SR))
buf += 0.030 * tafla * env

# GLOSNOSC DO POZIOMU SASIADA Z POLKI (`pickup.mp3`), po RMS.
RMS_WZORZEC = 0.0277
buf *= RMS_WZORZEC / np.sqrt(np.mean(buf ** 2))
szczyt = np.max(np.abs(buf))
if szczyt > 0.85:
    buf *= 0.85 / szczyt

# Ciche domkniecie na obu koncach — zeby nie bylo trzasku na starcie i stopie.
buf[:int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
zan = int(0.060 * SR)
buf[-zan:] *= np.linspace(1, 0, zan) ** 0.7

x = np.clip(buf, -1, 1)
w = wave.open("plusk.wav", "w")
w.setnchannels(1)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes((x * 32767).astype(np.int16).tobytes())
w.close()
print("zapisane plusk.wav  %.3f s  RMS %.4f  szczyt %.3f"
      % (len(x) / SR, np.sqrt(np.mean(x ** 2)), np.max(np.abs(x))))
