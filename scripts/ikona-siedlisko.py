# -*- coding: utf-8 -*-
# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
ikona-siedlisko.py — domek do znacznika placu budowy.

PO CO. Znacznik nad placem rysował dotąd szkic z dwóch kresek (dwa słupy
i skośna belka). Czytelny z bliska, ale z dwóch metrów to była plątanina
patyków. Ma go zastąpić domek w TYM SAMYM języku, co wskaźnik cięcia drzewa
(`_wskaznikPracy` w app.js): granatowa tarcza, jasny obrys, biała bryła
z grubym ciemnym konturem i jeden ciepły akcent.

Klucz: backend/.env -> OPENAI_API_KEY (CLAUDE.md: klucz zostaje na maszynie
autora, nie wyjeżdża do sandboxa).

Uruchomienie:  python scripts/ikona-siedlisko.py [ile]
Wynik:         frontend/public/scena-3d/assets/ikona-siedlisko-v<N>.png
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "scena-3d" / "assets"
WYJSCIE.mkdir(parents=True, exist_ok=True)


def klucz_api():
    v = os.environ.get("OPENAI_API_KEY", "")
    if v.strip().startswith("sk-proj-"):
        return v.strip().strip('"')
    t = (ROOT / "backend" / ".env").read_text("utf-8", "ignore")
    m = re.search(r'OPENAI_API_KEY\s*=\s*"?(sk-proj-[A-Za-z0-9_\-]+)', t)
    if m:
        return m.group(1)
    sys.exit("Brak klucza OpenAI w backend/.env.")


from openai import OpenAI
client = OpenAI(api_key=klucz_api())

# DNA stylu przepisane WPROST z `_wskaznikPracy`: te same barwy i ta sama
# zasada „jedna bryła, jeden gruby kontur", bo ikona ma stać obok tamtej
# i wyglądać na zrobioną tego samego dnia.
PROMPT = (
    "Flat vector game icon of a simple cozy wooden shelter hut, front view, "
    "one single chunky silhouette. "
    "Off-white walls (#F2F5F8) and a warm amber roof (#E8B84B), one small dark doorway. "
    "Every shape carries the SAME thick dark brown outline (#201608), about 6% of the icon width, "
    "rounded line caps and joins. "
    "Completely flat colours: no gradients, no shading, no texture, no highlights, no drop shadow. "
    "Centred, filling about 80% of a square frame, fully transparent background. "
    "Bold and readable when shrunk to 90 pixels. "
    "No text, no frame, no circle behind the house, no ground, no grass, no sky."
)

ile = int(sys.argv[1]) if len(sys.argv) > 1 else 3
print(f"Generuje {ile} wariant(ow) domku...")

odp = client.images.generate(
    model="gpt-image-1",
    prompt=PROMPT,
    size="1024x1024",
    background="transparent",
    n=ile,
)

for i, d in enumerate(odp.data, 1):
    plik = WYJSCIE / f"ikona-siedlisko-v{i}.png"
    plik.write_bytes(base64.b64decode(d.b64_json))
    print("zapisane:", plik.relative_to(ROOT), plik.stat().st_size // 1024, "KB")
