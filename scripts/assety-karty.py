"""
assety-karty.py — grafika do Pamieci Medrca w stylu Sekretu pod puchem.

Karty mialy symbole rysowane kreska w SVG, a reszta gry jest z gliny. To samo
DNA promptu co przy piorkach, wiec nowe symbole staja obok tamtych obiektow bez
zgrzytu — i dlatego czesc symboli wcale sie nie generuje: zwoj, ksiezyc, grzyb
i piorko juz istnieja w `assets/piorka/` i szkoda je dublowac.

Uruchomienie (Windows):  python scripts\assety-karty.py
Klucz API: OPENAI_API_KEY / OPENAI_API / tmp/openai.key / ~/Desktop/api.txt
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "karty"
WYJSCIE.mkdir(parents=True, exist_ok=True)


def klucz_api():
    for z in ("OPENAI_API_KEY", "OPENAI_API"):
        v = os.environ.get(z)
        if v and v.strip() and not v.startswith("sk-ant-"):
            return v.strip().strip('"')
    for p in [ROOT / "tmp" / "openai.key",
              pathlib.Path(os.path.expanduser("~/Desktop/api.txt"))]:
        if p.exists():
            for m in re.finditer(r'sk-[A-Za-z0-9_\-]{20,}', p.read_text("utf-8", "ignore")):
                if not m.group(0).startswith("sk-ant-"):
                    return m.group(0)
    sys.exit("Brak klucza OpenAI.")


from openai import OpenAI
client = OpenAI(api_key=klucz_api())

DNA = """STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic specular highlights, no glitter. Gentle volumetric shading, soft ambient occlusion in the creases. Clean silhouette readable at 40 pixels. Light comes from the upper left. No text, no letters, no numbers, no watermark, no border, no frame, no ground shadow, no background elements.
PALETTE: cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4, amber #F4C95D, dusk orange #E89A3D, ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2, sky blue #B7E3FF, leaf green #5FA76F."""

WSPOLNE = """Isolated on a fully transparent background, centred in frame with even margin on all sides. Seen from the front, slightly above eye level. Compact chunky proportions, immediately recognisable from its silhouette alone. Matte clay with a thin darker outline of even thickness around the whole shape."""

SYMBOLE = {
    "krysztal": f"""A single upright crystal shard made of matte clay: a chunky six-sided gem with softly rounded edges and a blunt tip, deep violet #7A4DC2 at the base fading to soft violet #B886E8 at the top, with two lighter facets catching the light and a faint warm glow inside. Friendly and rounded, nothing sharp or dangerous. {WSPOLNE}""",

    "moneta": f"""A single thick round coin of matte clay seen almost face-on and tilted very slightly, warm amber #F4C95D with a dusk orange #E89A3D rounded rim, and one simple four-pointed star pressed into its face like a stamp. Chunky and toy-like, as if moulded by hand. {WSPOLNE}""",

    "sowa": f"""A small friendly clay owl sitting calmly: round soft body, big kind dark eyes with cream eye-rings, two small rounded ear tufts, a tiny amber #F4C95D beak, cream #FBF1D6 chest and warm sand #F4E3B8 wings folded at the sides. Sleepy and gentle, not cartoonishly surprised. {WSPOLNE}""",
}

REWERS = """A vertical playing card seen straight from the front, filling the whole frame edge to edge with softly rounded corners. The card is made of matte clay: deep violet #7A4DC2 surface deepening towards the corners, with a chunky amber-gold #F4C95D border rim pressed into the clay a little inside the edge. In the centre, one four-pointed star of warm amber-gold clay, raised from the surface, surrounded by two thin concentric gold rings. Two tiny gold sparkles in opposite corners. Perfectly symmetrical, calm, no text, no numbers, no suits, no face, no pattern other than described."""


def zapisz(nazwa, odp):
    plik = WYJSCIE / f"{nazwa}.png"
    plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
    print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)


for nazwa, tresc in SYMBOLE.items():
    print(f"generuje {nazwa}...", flush=True)
    zapisz(nazwa, client.images.generate(
        model="gpt-image-1", prompt=f"{DNA}\n\n{tresc}",
        size="1024x1024", quality="high", background="transparent",
        output_format="png", n=1))

print("generuje rewers...", flush=True)
zapisz("rewers", client.images.generate(
    model="gpt-image-1", prompt=f"{DNA}\n\n{REWERS}",
    size="1024x1536", quality="high", background="opaque",
    output_format="png", n=1))

print("gotowe.")


# ── Scena stolu: ujecie z gory, lis na dole ekranu, Wizkor na gorze ──────────
# Uwaga na kadr: to NIE sa portrety, tylko dwa pasy przyklejone do krawedzi
# ekranu. Dlatego prompty tak uporczywie powtarzaja "widok dokladnie z gory"
# i "postac ucieta krawedzia kadru" — model domyslnie ustawia bohatera na
# wprost, a wtedy wychodzi zdjecie legitymacyjne zamiast rak na stole.
GORA_DOL = """STRICT TOP-DOWN VIEW: the camera is directly above, looking straight down at a table. Flat, almost orthographic perspective — we see the tops of things, not their faces."""

SCENA = {
    "wizkor-gora": (f"""{GORA_DOL} A friendly old wizard sits at the FAR side of the table, seen from straight above. Visible: the top of his wide pointed hat in deep violet #4a2c77 with an amber #F4C95D band and a small gold star, the tip of his cream beard poking out below the hat brim, his violet-robed shoulders, and BOTH HANDS resting flat on the table, one to the left and one to the right, wide sleeves, palms down, fingers relaxed. The figure is CROPPED BY THE TOP EDGE of the frame — nothing below the forearms. Calm and warm, as if waiting for his turn. No table surface, no cards, no floor, no shadow: isolated on a fully transparent background, centred horizontally, wide and shallow composition.""", "1536x1024", "transparent"),

    "lis-dol": (f"""{GORA_DOL} A friendly young fox sits at the NEAR side of the table, seen from straight above. Visible: the top of his head with two pointed ginger ears with cream inner fur, the tip of his snout with a small dark nose pointing away from the viewer, his shoulders in a small cream scarf, and BOTH FRONT PAWS resting on the table, one to the left and one to the right. Ginger fur #E89A3D with a cream #FBF1D6 muzzle and chest. The figure is CROPPED BY THE BOTTOM EDGE of the frame — nothing below the shoulders. Curious and eager. No table surface, no cards, no floor, no shadow: isolated on a fully transparent background, centred horizontally, wide and shallow composition.""", "1536x1024", "transparent"),

    "stol": ("""STYLE: stylized 3D claymorphism, Pixar-like children's game art, matte clay, no gloss, no glitter, soft even lighting. STRICT TOP-DOWN VIEW of an empty wooden table surface, filling the entire frame: warm honey-brown clay planks running horizontally, soft rounded edges between the planks, gentle wood grain, a barely visible darker shading in the corners. Absolutely nothing on the table: no cards, no objects, no hands, no border, no frame, no text.""", "1024x1024", "opaque"),
}

for nazwa, (tresc, rozmiar, tlo) in SCENA.items():
    print(f"generuje {nazwa}...", flush=True)
    zapisz(nazwa, client.images.generate(
        model="gpt-image-1",
        prompt=(f"{DNA}\n\n{tresc}" if tlo == "transparent" else tresc),
        size=rozmiar, quality="high", background=tlo, output_format="png", n=1))

print("scena gotowa.")
