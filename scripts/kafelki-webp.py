# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
PNG -> WEBP dla ilustracji onboardingu.

Po co: gpt-image-1 oddaje kafelki po 1,7 MB. Dwadziescia osiem sztuk to 48 MB
do pobrania na ekranie, ktory dziecko oglada przez dwie minuty. Kafelek ma
w ukladzie najwyzej ~120 px szerokosci (siatka na telefonie), wiec 512 px
starcza z zapasem na ekrany o podwojnej gestosci.

PNG-i ZOSTAJA na dysku jako zrodlo - nie sa w `public/` linkowane, ale pozwalaja
wygenerowac inny rozmiar bez placenia drugi raz za obrazek. Do repo ida tylko
webp (patrz .gitignore, jesli PNG maja tam nie wchodzic).

Uruchomienie (Windows):  python scripts\\kafelki-webp.py
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
KAT = ROOT / "frontend" / "public" / "assets" / "onboarding"

# Tla sa duze i pelnoekranowe, kafelki male i kwadratowe - inny rozmiar,
# ta sama jakosc.
ROZMIARY = {"tlo": 1024, "kafel": 512}

razem_przed = razem_po = 0
for png in sorted(KAT.glob("*.png")):
    rodzaj = "tlo" if png.stem.startswith("tlo-") else "kafel"
    bok = ROZMIARY[rodzaj]
    im = Image.open(png).convert("RGB")
    if im.width > bok:
        im = im.resize((bok, round(im.height * bok / im.width)), Image.LANCZOS)
    webp = png.with_suffix(".webp")
    im.save(webp, "WEBP", quality=82, method=6)
    razem_przed += png.stat().st_size
    razem_po += webp.stat().st_size
    print(f"{png.name:16} {png.stat().st_size//1024:>5} kB -> {webp.name:17} {webp.stat().st_size//1024:>4} kB  {im.size}")

print(f"\nrazem: {razem_przed//1024//1024} MB -> {razem_po//1024} kB")
