"""
Sekret pod puchem — assety do gry (gpt-image-1, tlo przezroczyste).

Poprawka wzgledem pierwszej tury: model rozumial "feather" jako LISC (symetryczny,
z zylkowaniem, zabkowany brzeg). Dlatego prompt nie nazywa juz ksztaltu z nazwy,
tylko go OPISUJE: asymetryczny wachlarz, jedna miekka stosina przesunieta z osi,
puszysty nierowny brzeg, zero zylek.

Sylwetek na kafelki NIE generujemy - robimy je lokalnie z kanalu alfa obiektu.
Dzieki temu maja identyczne kadrowanie co wersja kolorowa (a to warunek, zeby
dziecko polaczylo kafelek z tym, co odslonilo).
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "piorka"
WYJSCIE.mkdir(parents=True, exist_ok=True)

def klucz():
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
client = OpenAI(api_key=klucz())

DNA = """STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic specular highlights, no glitter. Gentle volumetric shading, soft ambient occlusion in the creases. Clean silhouette readable at 40 pixels. Light comes from the upper left. No text, no letters, no numbers, no watermark, no border, no frame, no ground shadow, no background elements.
PALETTE: cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4, amber #F4C95D, dusk orange #E89A3D, ink violet #4e4d76, sky blue #B7E3FF."""

# UWAGA: slowo "feather" ciagnie model w strone liscia, wiec ksztalt opisujemy
# wprost i wprost zakazujemy cech liscia.
PIORO_BAZA = """A single soft bird's down plume lying flat, seen from directly above, isolated on a fully transparent background, centred with even margin. Shape: an asymmetric rounded fan, wider on one side than the other, narrow at the quill end and softly rounded at the tip. One slender curved shaft runs off-centre along its length. The edges are downy, soft and slightly irregular, with a few loose wispy strands separating near the tip. IMPORTANT: this is NOT a leaf — no symmetrical vein pattern, no branching veins, no serrated or toothed edge, no stem, no plant. Matte clay material with a thin darker outline of even thickness around the whole silhouette."""

ASSETY = {
 "piorko-krem":   PIORO_BAZA + " Colour: cream #FBF1D6 with a slightly deeper sand shaft. Broad and generously rounded.",
 "piorko-piasek": PIORO_BAZA + " Colour: sand #F4E3B8 with a warm darker shaft. Slimmer and longer, with a gentle S-curve.",
 "piorko-biel":   PIORO_BAZA + " Colour: warm white #FFFDF4 with a pale grey shaft. Short, wide and very fluffy, the downiest of the set.",
 "piorko-blekit": PIORO_BAZA + " Colour: pale sky blue #B7E3FF with a soft grey-blue shaft. Medium length, slightly pointed at the tip.",
 "piorko-zlote":  PIORO_BAZA + " Colour: warm amber gold #F4C95D deepening to dusk orange #E89A3D along the shaft, with a faint inner glow - still matte clay, no metallic shine. Medium length, elegant, gently curved.",

 "ukryty-ptak": """A small friendly clay bird with a round chubby body, big kind dark eyes and a tiny amber beak, sitting calmly, seen from the front in a slight three-quarter view. Sky blue #B7E3FF body with a cream #FBF1D6 belly. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-klucz": """An old ornate key made of warm amber-gold clay #F4C95D, with a round decorated bow at the top and simple chunky teeth at the bottom, standing upright, seen from the front. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-lis": """The head of a friendly young fox with big green eyes, ginger-orange fur and a cream muzzle and cheeks, facing forward, ears up. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-muszla": """A spiral seashell in cream #FBF1D6 and sand #F4E3B8 tones with soft rounded ridges, seen from the side. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-ksiezyc": """A crescent moon of pale cream clay with a gently smiling sleepy face and closed eyes, seen from the front. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-zwoj": """A rolled paper scroll of cream clay tied with a soft violet #B886E8 ribbon, slightly open at one end, lying at a gentle angle. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-dzwonek": """A small round hand bell of warm amber-gold clay #F4C95D with a simple handle on top, seen from the front. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-grzyb": """A friendly toadstool mushroom with a rounded dusk-orange #E89A3D cap with cream spots and a chubby cream stem, seen from the front. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
 "ukryty-serce": """A plump rounded heart of soft violet #B886E8 clay with a gentle highlight, seen from the front. Compact chunky proportions, big soft shapes, immediately recognisable from its silhouette alone. Isolated on a fully transparent background, centred with even margin.""",
}

for nazwa, tresc in ASSETY.items():
    plik = WYJSCIE / f"{nazwa}.png"
    if plik.exists():
        print(f"pomijam {nazwa} (jest)", flush=True); continue
    print(f"generuje {nazwa}...", flush=True)
    try:
        odp = client.images.generate(
            model="gpt-image-1",
            prompt=f"{DNA}\n\n{tresc}",
            size="1024x1024",
            quality="high",
            background="transparent",
            output_format="png",
            n=1,
        )
        plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
        print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)
    except Exception as e:
        print(f"  BLAD {nazwa}: {type(e).__name__}: {e}", flush=True)

print("gotowe.", flush=True)
