# -*- coding: utf-8 -*-
# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
ikony-obrys.py — nadaje ikonom UI wspólny styl: obrys w kolorze wypełnienia
i kadr bez przezroczystego marginesu.

DLACZEGO OBRYS. Wzorcem jest `/star.png` — jedyna ikona, która czytała się
z odległości. Pomiar jej krawędzi (profil jasności wzdłuż odległości od
konturu) pokazał, że to nie zasługa kształtu, tylko ciemnego rantu:

    1–5 px od krawędzi   RGB ≈ (163, 89, 2)    V 0,64   S 0,99
    od 8 px w głąb       RGB ≈ (249, 208, 34)  V 0,97   S 0,86

czyli pas o szerokości ~2,9 % rozmiaru ikony, w tym samym odcieniu, ale
z jasnością pomnożoną przez ~0,65 i nasyceniem dobitym do maksimum.
Pozostałe ikony UI miały wyłącznie miękki cień renderu — na kremowym kaflu
HUD rozmywały się w tle. Ten skrypt dokłada im ten sam rant.

DLACZEGO KADR. Drugi pomiar: w `ikona-puzzel.png` widoczny kształt zajmował
170×154 px płótna 256×256, czyli 66 % szerokości i 60 % wysokości. Przy
`width: 31px; object-fit: contain` dawało to 19,9 px realnego puzzla obok
31 px gwiazdki z tego samego kafla. Ikona nie była za mała stylami — była
za mała w pliku. Reszta zestawu miała ten margines w przedziale 58–75 %,
każda inaczej, więc żaden jeden numer w CSS nie mógł ich zrównać.
Po przycięciu do zawartości jeden rozmiar w CSS = jeden rozmiar optyczny.

OBRYS RYSUJEMY NA ZEWNĄTRZ kształtu, nie przemalowujemy krawędzi grafiki:
render 3D ma na obrzeżu własne cieniowanie, a przyciemnienie go po raz drugi
zjadałoby detal. Kolor rantu bierzemy z NAJBLIŻSZEGO piksela wnętrza (a nie
z wygładzonej krawędzi), dzięki czemu ikona wielobarwna — jak lupa: drewniana
rączka i szklana soczewka — dostaje kontur, który idzie za lokalnym kolorem.

Użycie:
    python scripts/ikony-obrys.py frontend/public/assets/wskazowki/ikona-lupa.png ...
    (plik nadpisywany w miejscu; `--do KATALOG` zapisuje obok)
"""
import argparse
import os

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt

GRUBOSC = 0.042       # szerokość obrysu jako ułamek dłuższego boku kształtu
MARGINES = 0.02       # oddech wokół gotowej ikony (ułamek boku płótna)
V_OBRYSU = 0.58       # jasność rantu względem wypełnienia
S_WZMOCNIENIE = 1.12  # nasycenie rantu: x1,12 ...
S_DODATEK = 0.06      # ... i jeszcze odrobinę w górę
PROG_KSZTALTU = 0.55  # alfa, od której piksel liczy się jako „ciało" ikony


def przyciemnij(rgb):
    """Ten sam odcień, niższa jasność, mocniejsze nasycenie — jak rant gwiazdki."""
    mx = rgb.max(-1, keepdims=True)
    mn = rgb.min(-1, keepdims=True)
    nasycenie = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0)
    cel_s = np.clip(nasycenie * S_WZMOCNIENIE + S_DODATEK, 0, 1)

    baza = rgb * V_OBRYSU
    mx2 = baza.max(-1, keepdims=True)
    mn2 = baza.min(-1, keepdims=True)
    docelowe_mn = mx2 * (1 - cel_s)
    zakres = np.maximum(mx2 - mn2, 1e-6)
    return np.clip(mx2 - (mx2 - baza) * (mx2 - docelowe_mn) / zakres, 0, 1)


def obrysuj(sciezka, wynik, grubosc=GRUBOSC, przytnij=True):
    im = Image.open(sciezka).convert("RGBA")
    a = np.array(im).astype(np.float64) / 255.0
    rgb, alfa = a[..., :3], a[..., 3]
    ksztalt = alfa > PROG_KSZTALTU

    ys, xs = np.nonzero(alfa > 0.03)
    bok = max(xs.max() - xs.min() + 1, ys.max() - ys.min() + 1)
    r = grubosc * bok

    # Źródło koloru: wnętrze kształtu, żeby nie zassać przyciemnionej krawędzi.
    rdzen = ksztalt & (distance_transform_edt(ksztalt) >= max(2.0, r * 0.7))
    if rdzen.sum() < 0.05 * ksztalt.sum():
        rdzen = ksztalt

    do_rdzenia, skad = distance_transform_edt(~rdzen, return_indices=True)
    kolor = przyciemnij(rgb[skad[0], skad[1]])

    # Cienkie elementy (rączka lupy, wstążka zwoju) nie mają własnego rdzenia —
    # tam rdzeń bywa po drugiej stronie ikony, więc bierzemy najbliższy piksel ciała.
    _, skad_ciala = distance_transform_edt(~ksztalt, return_indices=True)
    daleko = do_rdzenia > r + 4
    kolor[daleko] = przyciemnij(rgb[skad_ciala[0], skad_ciala[1]])[daleko]

    na_zewnatrz = distance_transform_edt(~ksztalt)
    krycie = np.clip((r - na_zewnatrz) / 1.25 + 0.5, 0, 1)  # ostatni piksel wygładzony
    krycie[ksztalt] = 0

    wynikowa_alfa = alfa + krycie * (1 - alfa)
    bezpieczna = np.maximum(wynikowa_alfa, 1e-6)[..., None]
    wynikowy_rgb = (rgb * alfa[..., None]
                    + kolor * (krycie * (1 - alfa))[..., None]) / bezpieczna

    plotno = np.dstack([np.clip(wynikowy_rgb, 0, 1), np.clip(wynikowa_alfa, 0, 1)])
    im2 = Image.fromarray((plotno * 255 + 0.5).astype(np.uint8), "RGBA")

    if przytnij:
        al = np.array(im2)[..., 3]
        ys, xs = np.nonzero(al > 6)
        szer, wys = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
        # Kwadrat, nie ciasny prostokąt: reguły CSS ustawiają width == height,
        # więc płótno o proporcji 1:1 znaczy „dłuższy bok wypełnia kafelek".
        bok2 = int(round(max(szer, wys) * (1 + 2 * MARGINES)))
        srx, sry = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
        kadr = Image.new("RGBA", (bok2, bok2), (0, 0, 0, 0))
        kadr.alpha_composite(im2, (int(round(bok2 / 2 - srx)), int(round(bok2 / 2 - sry))))
        im2 = kadr

    im2.save(wynik, optimize=True)
    return im2


def main():
    p = argparse.ArgumentParser(description="Obrys i kadr dla ikon UI EwolucJI.")
    p.add_argument("pliki", nargs="+")
    p.add_argument("--do", dest="katalog", default=None,
                   help="katalog wyjściowy; domyślnie nadpisujemy w miejscu")
    p.add_argument("--grubosc", type=float, default=GRUBOSC)
    p.add_argument("--bez-kadru", action="store_true")
    a = p.parse_args()

    for sciezka in a.pliki:
        wynik = (os.path.join(a.katalog, os.path.basename(sciezka))
                 if a.katalog else sciezka)
        przed = Image.open(sciezka).size
        im = obrysuj(sciezka, wynik, a.grubosc, not a.bez_kadru)
        print("%-24s %sx%s -> %sx%s" % (os.path.basename(sciezka), *przed, *im.size))


if __name__ == "__main__":
    main()
