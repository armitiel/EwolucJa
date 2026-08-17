"""
Assety ekranow wejscia (gpt-image-1, tlo przezroczyste).

Po co: na ekranie startowym i na logowaniu siedzialy systemowe emoji (klucz,
iskierka). Emoji rysuje system operacyjny - na kazdym telefonie wyglada inaczej
i nigdy nie pasuje do gliny, z ktorej zrobiona jest reszta gry.

Klucz jest tu bohaterem ekranu logowania i JEDNOCZESNIE ikonka w przycisku
"Mam juz kod", wiec musi byc czytelny i przy 24 px, i przy 120 px. Stad prosta
sylwetka i gruby, rowny obrys.

Uruchomienie (Windows):  python scripts\assety-wejscie.py
Klucz API: OPENAI_API_KEY / OPENAI_API / tmp/openai.key / ~/Desktop/api.txt
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "wejscie"
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

# Ten sam blok DNA, co przy piorkach - trzyma nowe pliki w jednej rodzinie
# z tym, co juz jest w grze.
DNA = """STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic specular highlights, no glitter. Gentle volumetric shading, soft ambient occlusion in the creases. Clean silhouette readable at 40 pixels. Light comes from the upper left. No text, no letters, no numbers, no watermark, no border, no frame, no ground shadow, no background elements.
PALETTE: cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4, amber #F4C95D, dusk orange #E89A3D, ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2, sky blue #B7E3FF."""

WSPOLNE = """Isolated on a fully transparent background, centred in frame with even margin on all sides. Matte clay material with a thin darker outline of even thickness around the whole silhouette."""

ASSETY = {
    "klucz-a": f"""A single ornate old key made of warm amber-gold clay #F4C95D deepening to dusk orange #E89A3D, standing upright with the bow (handle) at the top and the teeth at the bottom. The bow is a chunky rounded ring with a small four-pointed star opening cut through its centre. The shaft is smooth, slightly tapered, with one small round bead halfway down. The teeth are two simple chunky rectangular blocks. Friendly and storybook, not sharp, not realistic metal. {WSPOLNE}""",

    "klucz-b": f"""A single ornate old key made of warm amber-gold clay #F4C95D deepening to dusk orange #E89A3D, tilted about twenty degrees, bow (handle) at the upper left and teeth at the lower right. The bow is a chunky rounded trefoil shape with a soft violet #B886E8 clay ribbon tied around it, its two short ends curling gently. The shaft is smooth and slightly tapered, the teeth are two chunky rounded blocks. Friendly and storybook, not sharp, not realistic metal. {WSPOLNE}""",
}

for nazwa, tresc in ASSETY.items():
    print(f"generuje {nazwa}...", flush=True)
    odp = client.images.generate(
        model="gpt-image-1",
        prompt=f"{DNA}\n\n{tresc}",
        size="1024x1024",
        quality="high",
        background="transparent",
        output_format="png",
        n=1,
    )
    plik = WYJSCIE / f"{nazwa}.png"
    plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
    print(f"  -> {plik} ({plik.stat().st_size // 1024} kB)", flush=True)

print("gotowe.")
