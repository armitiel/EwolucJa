"""
assety-splash.py — ilustracje na ekrany startowe minigier.

Inny styl niz reszta assetow: nie glina, tylko gruba kreska wektorowa — ta sama,
co w pop-upach zaproszen i w tlach. Powod jest prosty: ilustracja na splashu
walczy o uwage z calego ekranu, a matowa glina w tej skali robi sie mdla.
Szczegoly i drugi blok DNA: docs/grafika.md, rozdzial 2b.

Po generacji obowiazkowe odchudzenie (crop do alfy -> 560 px -> quantize),
opisane w docs/grafika.md rozdzial 4.

Uruchomienie (Windows):  python scripts\\assety-splash.py
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


def zapisz(nazwa, odp):
    plik = WYJSCIE / f"{nazwa}.png"
    plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
    print(f"  -> {plik} ({plik.stat().st_size // 1024} kB)", flush=True)


STYL = """STYLE: bold cartoon vector illustration for a children's fantasy game — the look of a hand-drawn storybook sticker, NOT clay, NOT 3D render. Every shape is enclosed by a thick, dark warm-brown #3A2350 outline of even weight. Flat saturated fills with crisp two-tone cel shading: one darker shade block for shadow, one lighter block for light, hard edges between them, plus a few sharp white specular highlights. Glossy, vivid and graphic. No soft airbrushed gradients, no matte clay texture, no photographic realism, no depth-of-field.
PALETTE: vivid violet #7A3FD0, deep violet #5C2FA8, light lilac #B886E8, amber gold #F4C95D, deep gold #E0A32E, cream #FBF1D6, warm white #FFFDF4, dark plum outline #3A2350.
No text, no letters, no numbers, no watermark, no border, no frame, no ground shadow, no background elements."""

SCENA = {
    "wizkor-karty": ("""A friendly cartoon wizard shown from the chest up, facing the viewer with a warm confident smile, holding up a neat fan of five playing cards in one hand.

The wizard: a kind round face with a big bushy cream-white beard and moustache, bright friendly eyes, bushy white eyebrows. He wears a tall pointed wizard hat in vivid violet #7A3FD0 with a wide amber gold #F4C95D band around its base and a few gold four-pointed stars scattered on it; the tip of the hat bends softly to one side. His robe is the same vivid violet with a gold trimmed collar and a round glossy amber gem clasp at the throat, catching a sharp white highlight.

The cards: five identical card backs fanned out like a hand of cards, each card a rounded rectangle of deep violet #5C2FA8 with a thin gold border and one bold amber gold four-pointed star in the centre. The fan is held clearly in front of his chest, tilted slightly, cards overlapping evenly.

Framing: bust portrait, the body cut off flat at the bottom edge of the frame, character centred with even margin at the sides, isolated on a fully transparent background. Nothing else in the picture — no table, no floor, no shadow, no sparkles beyond two or three tiny gold stars near the hat.""", "1024x1024", "transparent"),
}
for nazwa, (tresc, rozmiar, tlo) in SCENA.items():
    print(f"generuje {nazwa}...", flush=True)
    zapisz(nazwa, client.images.generate(
        model="gpt-image-1",
        prompt=f"{STYL}\n\n{tresc}",
        size=rozmiar, quality="high", background=tlo, output_format="png", n=1))

print("gotowe.")
