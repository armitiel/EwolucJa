# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
Tlo onboardingu W STYLU KART PORADY DNIA (gpt-image-1).

DLACZEGO TRZECIE PODEJSCIE. Pierwsze szlo blokiem DNA z generatorow IKON
(matowa glina) — czytalo sie jak tlo minigry. Drugie bylo malarskim lasem,
trzecie plaska planeta. Zadne nie nalezalo do rodziny, ktora w grze JUZ JEST
i ktora dziecko oglada codziennie: karty porady dnia
(`public/assets/porady/karta-*.png`).

CZYM SIE TEN STYL ROZNI. To nie jest plaska ilustracja ani matowa glina:
- ostre, wyraziste liscie NA PIERWSZYM PLANIE, z ciemnym obrysem, wchodzace
  w kadr z krawedzi i rogow — ramuja obraz;
- gleboka ostrosc: tlo mocno rozmyte, z rozswietlonym slonecem i poswiata;
- nasycona, cieplo oswietlona zielen, blekitne wzgorza i jeziorko w oddali;
- drobne iskry i pojedyncze liscie unoszace sie w powietrzu;
- polysk i miekki modelunek, a nie plaskie plamy koloru.

Czego tu NIE ma: postaci (Wizkor stoi przed tlem jako osobna grafika), tekstu,
ramki, interfejsu. Srodek kadru jest spokojny i rozmyty — tam siada karta.

Uruchomienie:  python scripts\\tlo-onboarding-porady.py
               python scripts\\tlo-onboarding-porady.py porady-b
Klucz: backend/.env -> OPENAI_API_KEY
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "onboarding"
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


STYL = """STYLE: polished cartoon illustration for a children's mobile game, the look of a warm animated-film key art. Crisp hand-drawn foreground elements with clean dark outlines and soft glossy shading, set against a heavily blurred, sunlit background with visible depth of field. Warm golden sunlight with a soft bloom, gentle light rays, tiny floating sparkles and a few single leaves drifting in the air. Rich saturated greens, warm yellow-green highlights, pale blue distance.
NO characters, no animals, no people, no houses, no text, no letters, no numbers, no watermark, no border, no frame, no user interface.
Vertical composition. The middle of the frame is soft, blurred and free of detail so a card can sit on top of it."""

WARIANTY = {
    "porady-a": """Looking out from under a big tree at the edge of a sunlit forest. Large crisp green leaves and a slice of thick brown trunk frame the upper left and the left edge of the frame, more leaves crowding in along the bottom corners. Beyond them a softly blurred green valley: rounded treetops, a small lake catching the light, pale blue hills far away. The sun sits high on the right with a warm bloom.""",

    "porady-b": """A sunlit forest glade seen through leaves. Crisp green foliage with clean outlines frames the top and both upper corners, hanging into the frame, and low bushes blur along the very bottom. Between them an open, heavily blurred meadow rolling away: golden grass, rounded trees, a glint of water, distant blue hills under a bright sky. Warm sun bloom near the top centre.""",

    "porady-c": """The green curve of a small forested world, seen from under a leafy branch. Crisp outlined leaves lean in from the top corners; below them the land bends away like a little planet, thick with softly blurred rounded treetops, a clearing and a small lake, with pale blue hills at the horizon. Bright warm sky with a soft sun bloom on the right.""",
}

wybrane = [a for a in sys.argv[1:] if a in WARIANTY] or list(WARIANTY)
print(f"do wygenerowania: {len(wybrane)}", flush=True)

for nazwa in wybrane:
    print(f"generuje {nazwa}...", flush=True)
    odp = client.images.generate(
        model="gpt-image-1",
        prompt=f"{STYL}\n\n{WARIANTY[nazwa]}",
        size="1024x1536",
        quality="high",
        output_format="png",
        n=1,
    )
    plik = WYJSCIE / f"tlo-{nazwa}.png"
    plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
    print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)

print("gotowe.")
