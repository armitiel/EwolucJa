"""
Sekret pod puchem — trzy koncept arty (gpt-image-1).

Klucz bierze po kolei z: OPENAI_API_KEY, OPENAI_API, a na koncu z pliku
`tmp/.env.vercel` (`vercel env pull`), gdzie w tym projekcie nazywa sie
OPENAI_API. Wyniki laduja w `tmp/koncepty/`.

To NIE sa assety do gry - sluza do oceny kierunku: materialu piorka, gestosci
kopca i tego, czy poswiata spod spodu ciagnie oko. Stad `background="opaque"`
i pion jak ekran telefonu.
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "tmp" / "koncepty"
WYJSCIE.mkdir(parents=True, exist_ok=True)

def klucz():
    for zmienna in ("OPENAI_API_KEY", "OPENAI_API"):
        v = os.environ.get(zmienna)
        if v and v.strip():
            return v.strip().strip('"')
    # Plik podrzucony recznie - najprostsza droga, gdy zmienna na Vercelu jest
    # oznaczona jako Sensitive i `vercel env pull` oddaje pusta wartosc.
    reczny = ROOT / "tmp" / "openai.key"
    if reczny.exists():
        v = reczny.read_text(encoding="utf-8", errors="ignore").strip().strip('"')
        if v:
            return v
    plik = ROOT / "tmp" / ".env.vercel"
    if plik.exists():
        for linia in plik.read_text(encoding="utf-8", errors="ignore").splitlines():
            m = re.match(r'\s*OPENAI_API(?:_KEY)?\s*=\s*"?([^"\r\n]+)"?', linia)
            if m:
                return m.group(1).strip()
    sys.exit("Brak klucza OpenAI (OPENAI_API_KEY / OPENAI_API / tmp/.env.vercel).")

from openai import OpenAI
client = OpenAI(api_key=klucz())

DNA = """STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded forms, matte clay surface with subtle soft-touch texture, no gloss, no plastic specular highlights. Gentle volumetric shading, soft ambient occlusion in the creases. Clean silhouette readable at small size. Light comes from the upper left at a consistent angle. Warm, friendly, calm - nothing sharp, nothing scary. No text, no letters, no numbers, no watermark, no UI elements, no border frame.
PALETTE (use these exact colors): cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4, ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2, amber #F4C95D, dusk orange #E89A3D, leaf green #5FA76F, sky blue #B7E3FF."""

KONCEPTY = {
 "koncept-a-kopiec": """A vertical mobile game screen. The entire frame is covered with a deep drift of soft clay feathers piled on top of each other - hundreds of small rounded feathers in cream, sand and warm white, with a few in pale sky blue. The pile is uneven: denser and taller along the screen edges, slightly thinner in the middle, so the eye is drawn to the centre. Feathers vary in size - small, medium, large - and lie at many different angles. Each feather is a simple stylized shape with a soft central shaft line and a thin darker outline. Behind and above the pile, a calm gradient sky from light blue to warm sand. Nothing is visible underneath the feathers yet. Soft, cosy, inviting to touch.""",
 "koncept-b-szpara": """A vertical mobile game screen. A drift of soft clay feathers covers most of the frame, but a wide sweeping channel has been cleared through the middle, as if by a hand. Along the edges of the channel the feathers are pushed aside and piled up, some caught mid-air, gently tumbling and rotating. Through the cleared gap a warm golden glow shines up from underneath, and part of a hidden object is revealed inside that glow: the wing and beak of a small friendly clay bird. The rest of the bird is still buried. The light from below makes the surrounding feathers glow warm at their edges. Magical, calm, the moment just before recognition.""",
 "koncept-c-odsloniete": """A vertical mobile game screen at the moment of discovery. A single gust has lifted all the feathers at once - they fly upward and outward in a staggered wave, rotating, spreading across the frame, leaving the centre clear. In the centre, fully revealed and lit by a warm radial glow, sits a small friendly clay bird with big kind eyes, mid-hop, celebrating. Three or four feathers among the flying ones are golden and spin more slowly than the rest. Sparkles of warm light. Joyful but soft - a quiet celebration, not fireworks.""",
}

for nazwa, tresc in KONCEPTY.items():
    print(f"generuje {nazwa}...", flush=True)
    try:
        odp = client.images.generate(
            model="gpt-image-1",
            prompt=f"{DNA}\n\n{tresc}",
            size="1024x1536",
            quality="high",
            background="opaque",
            output_format="png",
            n=1,
        )
        plik = WYJSCIE / f"{nazwa}.png"
        plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
        print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)
    except Exception as e:
        print(f"  BLAD {nazwa}: {type(e).__name__}: {e}", flush=True)

print("gotowe.", flush=True)
