"""
Tlo onboardingu: MALA PLANETA POROSNIETA LASAMI, w trzech porach doby.

DLACZEGO PLANETA (pomysl wlasciciela). Ekran wejscia ma pokazywac MIEJSCE,
do ktorego dziecko za chwile trafi, a nie przypadkowy las. Swiat 3D to zielona
kula pod blekitnym niebem — tlo testu jest mostem miedzy ekranem startowym
(malarska ilustracja z liskiem) a ta kula.

DLACZEGO TRZY PORY. Swiat 3D ma wlasny cykl dnia i nocy (`cyklDnia` w mapie),
wiec wejscie do niego nie moze byc zawsze w samo poludnie. Onboarding wybiera
plik po zegarze dziecka — patrz `porA_doby()` w `hub/profilStartowy.js`.

Czego tu NIE ma: postaci (Wizkor stoi przed tlem jako osobna grafika), tekstu,
ramki, interfejsu. Gora kadru jest ciemniejsza i spokojna — tam siada kremowa
karta i musi miec sie od czego odbic.

Uruchomienie (Windows):  python scripts\\tlo-planeta.py
                         python scripts\\tlo-planeta.py planeta-noc
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


# STYL. Most miedzy dwoma jezykami, ktore juz sa w grze: sposob malowania
# z ekranu startowego (malarska ilustracja ksiazkowa, glebia, promienie),
# a bryly i paleta ze sceny 3D (oble korony drzew, nasycona zielen, biale
# pekate chmury). Nie „matowa glina" — to jezyk ikon i kafelkow, i wlasnie
# dlatego pierwsza wersja tla czytala sie jak tlo minigry.
STYL = """Painterly storybook children's book illustration with soft volumetric light and gentle depth. Rounded, chunky shapes: ball-shaped treetops, soft cone pines, smooth hills — the geometry of a friendly low-poly game world, but hand-painted rather than flat-shaded. Saturated grass green, warm light, rounded fluffy clouds.
NO characters, no animals, no people, no houses, no roads, no text, no letters, no numbers, no watermark, no frame, no user interface, no vignette.
Vertical composition. The planet's curve sits low in the frame; the upper half is open sky and stays calm and free of detail, so a card can sit on top of it."""

WSPOLNE = """A small round planet densely overgrown with forest, seen from just above its horizon: the green curve of the globe crosses the lower third of the frame, covered with rounded treetops, pine groves, meadows and small flowering bushes along the edge. The curvature is clearly visible — this is a little world, not a landscape."""

PORY = {
    "planeta-dzien": f"""{WSPOLNE} Bright midday: a deep blue sky that grows richer toward the top of the frame, a few rounded white clouds, warm sunlight falling from the upper left, crisp green foliage.""",

    "planeta-zmierzch": f"""{WSPOLNE} Golden hour: the sky graduates from warm amber just above the horizon through soft rose to a deep blue at the top of the frame. Long warm light rakes across the treetops from the left, the forest in deeper green. A few clouds lit from below.""",

    "planeta-noc": f"""{WSPOLNE} Night: a deep navy blue sky filling the upper half, dusted with small stars and a soft glow low on the horizon. The forest reads in deep cool greens and blues, moonlight silvering the tops of the trees. Calm and safe, never dark or frightening.""",
}

wybrane = [a for a in sys.argv[1:] if a in PORY] or list(PORY)
print(f"do wygenerowania: {len(wybrane)}", flush=True)

for nazwa in wybrane:
    print(f"generuje {nazwa}...", flush=True)
    odp = client.images.generate(
        model="gpt-image-1",
        prompt=f"{STYL}\n\n{PORY[nazwa]}",
        size="1024x1536",
        quality="high",
        output_format="png",
        n=1,
    )
    plik = WYJSCIE / f"{nazwa}.png"
    plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
    print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)

print("gotowe.")
