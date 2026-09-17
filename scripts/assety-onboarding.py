# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
Tlo ekranu onboardingu (gpt-image-1).

Po co: test profilu stal na tym samym jasnym gradiencie nieba, co reszta
ekranow tekstowych. Kremowa karta na kremowym tle nie ma sie od czego odbic -
a to jest pierwsze, co dziecko widzi po STARCIE, wiec ma wygladac jak wejscie
do swiata, a nie jak formularz. Ciemniejszy kadr daje karcie kontrast
i osadza Wizkora w lesie, zamiast zostawiac go w prozni.

Czego tu NIE ma: postaci (Wizkor stoi przed tlem jako osobna grafika), tekstu,
ramki. Dol kadru jest celowo spokojny - tam siada karta.

Uruchomienie (Windows):  python scripts\\assety-onboarding.py
Klucz API: backend/.env -> OPENAI_API_KEY
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "onboarding"
WYJSCIE.mkdir(parents=True, exist_ok=True)


def klucz_api():
    for z in ("OPENAI_API_KEY", "OPENAI_API"):
        v = os.environ.get(z)
        if v and v.strip().startswith("sk-proj-"):
            return v.strip().strip('"')
    t = (ROOT / "backend" / ".env").read_text("utf-8", "ignore")
    m = re.search(r'OPENAI_API_KEY\s*=\s*"?(sk-proj-[A-Za-z0-9_\-]+)', t)
    if m:
        return m.group(1)
    sys.exit("Brak klucza OpenAI w backend/.env.")


from openai import OpenAI
client = OpenAI(api_key=klucz_api())

# Ten sam blok DNA, co przy kluczu i piorkach - trzyma nowe pliki w jednej
# rodzinie z tym, co juz jest w grze. Rozni sie jedna rzecza: to jest SCENA,
# a nie wyciety przedmiot, wiec znika "isolated on transparent background"
# i wraca glebia.
DNA = """STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic specular highlights, no glitter. Gentle volumetric shading, soft ambient occlusion in the creases. Painterly depth with a soft blurred background. No text, no letters, no numbers, no watermark, no border, no frame, no user interface.
PALETTE: cream #FBF1D6, sand #F4E3B8, amber #F4C95D, dusk orange #E89A3D, ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2, moss green #6E8C4A, deep forest #2E4436, night blue #24304F."""

WSPOLNE = """No characters, no creatures, no people. The lower third of the frame is calm, softly out of focus and free of detail, so a card can sit on top of it. Vertical composition, the most interesting shapes in the upper half."""

ASSETY = {
    "tlo-a": f"""A forest clearing at dusk, seen from low down among the grass. The sky above is a deep evening gradient from night blue #24304F at the top through soft violet #B886E8 to a warm amber #F4C95D glow just above the treeline. Rounded clay pine trees in deep forest green #2E4436 stand in silhouette along both sides of the frame, leaving the middle open. A soft mossy hill in moss green #6E8C4A rolls across the lower half. A few tiny warm fireflies drift in the middle distance. Calm, safe and inviting, never dark or scary. {WSPOLNE}""",

    "tlo-b": f"""A quiet forest glade in the blue hour, seen from ground level. The sky is a deep gradient from night blue #24304F down to deep violet #7A4DC2 and a narrow band of dusk orange #E89A3D at the horizon. Big rounded clay trees in deep forest green #2E4436 frame the left and right edges, their canopies meeting near the top corners like an arch. Between them a soft path of warm sand #F4E3B8 leads into the distance and loses focus. Low mossy mounds and a few rounded clay stones in the foreground, softly blurred. Warm, storybook, gently lit, never dark or scary. {WSPOLNE}""",
}

for nazwa, tresc in ASSETY.items():
    print(f"generuje {nazwa}...", flush=True)
    odp = client.images.generate(
        model="gpt-image-1",
        prompt=f"{DNA}\n\n{tresc}",
        size="1024x1536",
        quality="high",
        output_format="png",
        n=1,
    )
    plik = WYJSCIE / f"{nazwa}.png"
    plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
    print(f"  -> {plik} ({plik.stat().st_size // 1024} kB)", flush=True)

print("gotowe.")
