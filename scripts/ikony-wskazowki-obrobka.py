# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
Obróbka ikon z `gen-ikony-wskazowki.mjs` — krok po kroku ten sam, co przy
siekierze (`docs/design-system/styl-ikon-3d.md`, „Obróbka po generacji”):

 1. przycięcie do alfy, bo generator zostawia obiekt w losowym miejscu kadru;
 2. wyśrodkowanie na kwadracie z 6% marginesem — inaczej ikona siedzi krzywo
    w kółku chmurki i para lupa/puzelek „skacze” przy przejściu;
 3. skala do 256 px (chmurka rysuje ~72 px, licznik HUD 34 px — 256 z zapasem);
 4. PNG z optimize.

Uruchomienie: python scripts/ikony-wskazowki-obrobka.py
"""
from pathlib import Path
from PIL import Image

KORZEN = Path(__file__).resolve().parent.parent
MISTRZE = KORZEN / "docs" / "styl" / "rabanie"
PUBLIC = KORZEN / "frontend" / "public" / "assets"
ROZMIAR, MARGINES = 256, 0.06

# Ikony powstają jako para, ale MIESZKAJĄ tam, gdzie ich rodzina: lupa jest
# wyłącznie znakiem podpowiedzi, a puzelek stoi też w liczniku HUD i leci do
# niego przy zebraniu kawałka (`Swiat.jsx`), więc siedzi przy resztą puzzli.
PARY = [
    ("lupa-surowa.png", PUBLIC / "wskazowki" / "ikona-lupa.png"),
    ("puzzel-surowy.png", PUBLIC / "puzzle" / "ikona-puzzel.png"),
    ("stos-surowy.png", PUBLIC / "wskazowki" / "ikona-stos.png"),
    ("gwiazdka-surowa.png", PUBLIC / "wskazowki" / "ikona-gwiazdka.png"),
    ("zwoj-surowy.png", PUBLIC / "wskazowki" / "ikona-zwoj.png"),
    ("kamienie-surowe.png", PUBLIC / "wskazowki" / "ikona-kamienie.png"),
]

for zrodlo, cel in PARY:
    cel.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(MISTRZE / zrodlo).convert("RGBA")
    bbox = im.getbbox()
    if not bbox:
        raise SystemExit(f"{zrodlo}: pusta alfa — generacja nie wyszła")
    obiekt = im.crop(bbox)
    bok = max(obiekt.size)
    pole = int(bok * (1 + 2 * MARGINES))
    plotno = Image.new("RGBA", (pole, pole), (0, 0, 0, 0))
    plotno.paste(obiekt, ((pole - obiekt.width) // 2, (pole - obiekt.height) // 2), obiekt)
    plotno = plotno.resize((ROZMIAR, ROZMIAR), Image.LANCZOS)
    plotno.save(cel, optimize=True)
    print(f"{cel.name}: z {im.size[0]}x{im.size[1]} → obiekt {obiekt.size[0]}x{obiekt.size[1]} → {ROZMIAR} px → {cel.parent.name}/")
