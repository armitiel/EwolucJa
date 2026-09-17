# -*- coding: utf-8 -*-
# EwolucJA — gra edukacyjna dla dzieci.
# © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
# Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
# Prawa autorskie należą do autora. Pełna nota: LICENSE.
"""
obrob-ikone.py — domyka pipeline ikon 3D (patrz docs/design-system/styl-ikon-3d.md).

Model oddaje obrazek 1024x1024 z obiektem gdzies w srodku i przypadkowym
marginesem. Zeby dwie ikony stojace obok siebie mialy TE SAMA wage optyczna,
kazda przycinamy do wlasnej alfy, wysrodkowujemy na kwadracie i skalujemy do
tego samego boku. Bez tego drzewko potrafi byc o 20% wieksze od siekiery
tylko dlatego, ze model zostawil mniej powietrza.

Uruchomienie:
    python scripts/obrob-ikone.py <wejscie.png> <wyjscie.png> [bok] [margines]

    bok       - dlugosc boku kwadratu w px (domyslnie 256)
    margines  - ile procent boku zostaje jako powietrze (domyslnie 6)
"""
import pathlib
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]


def obrob(wejscie: pathlib.Path, wyjscie: pathlib.Path, bok: int = 256, margines: float = 6.0):
    im = Image.open(wejscie).convert("RGBA")
    bbox = im.getbbox()
    if not bbox:
        sys.exit("Obrazek jest calkowicie przezroczysty.")
    obiekt = im.crop(bbox)

    # Skalujemy tak, by DLUZSZY bok obiektu wypelnil kwadrat minus margines.
    pole = int(round(bok * (1 - 2 * margines / 100)))
    w, h = obiekt.size
    skala = pole / max(w, h)
    obiekt = obiekt.resize((max(1, round(w * skala)), max(1, round(h * skala))), Image.LANCZOS)

    plotno = Image.new("RGBA", (bok, bok), (0, 0, 0, 0))
    plotno.paste(obiekt, ((bok - obiekt.width) // 2, (bok - obiekt.height) // 2), obiekt)
    wyjscie.parent.mkdir(parents=True, exist_ok=True)
    plotno.save(wyjscie, "PNG", optimize=True)
    try:
        etykieta = wyjscie.resolve().relative_to(ROOT)
    except ValueError:
        etykieta = wyjscie
    print(
        f"OK {etykieta} "
        f"(zrodlo {im.size} -> obiekt {bbox} -> {bok}x{bok}, {wyjscie.stat().st_size // 1024} KB)"
    )


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    obrob(
        pathlib.Path(sys.argv[1]),
        pathlib.Path(sys.argv[2]),
        int(sys.argv[3]) if len(sys.argv) > 3 else 256,
        float(sys.argv[4]) if len(sys.argv) > 4 else 6.0,
    )
