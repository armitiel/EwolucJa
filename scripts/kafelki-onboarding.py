# EwolucJA — gra edukacyjna dla dzieci.
# © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
# Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
# Prawa autorskie należą do autora. Pełna nota: LICENSE.
"""
Dwadziescia cztery ilustracje odpowiedzi w tescie profilu (gpt-image-1).

Zrodlo tresci: backend/src/api/quizObrazkowy.py -- to znaczy quizObrazkowy.js.
Zrodlo regul: docs/TEST_OBRAZKOWY.md sekcja 5 i docs/TEST_OBRAZKOWY_PANEL.md.

DLACZEGO TAK SZTYWNO. Test ma mierzyc WYBOR dziecka, a nie urode obrazka.
Jesli jeden kafelek w pytaniu ma zloto i iskry, a sasiedni jest szary
i spokojny, dziecko wybiera blask. Stad blok WSPOLNE, ktory w kazdym kafelku
trzyma to samo: te sama postac, ta sama skale w kadrze, to samo swiatlo,
to samo tlo i podobna liczbe elementow. Wszystko, co rozni kafelki, siedzi
w jednym zdaniu o czynnosci.

Panel wyciagnal dwie rzeczy, ktore lamaly to wczesniej i sa tu naprawione:
zlote swiatlo bijace ze skrzyni (pomiar blyszczenia, nie odwagi) oraz
kafelki MD narysowane jako bezruch -- Skupienie ma miec CICHA CZYNNOSC
Z WIDOCZNYM SKUTKIEM w tym samym kadrze.

Uruchomienie (Windows):  python scripts\\kafelki-onboarding.py
Da sie wygenerowac pojedyncze:  python scripts\\kafelki-onboarding.py skrzynia-a woz-d
Klucz API: backend/.env -> OPENAI_API_KEY
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


DNA = """STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic specular highlights, no glitter, no sparkles, no magic effects, no glowing light sources. Gentle volumetric shading, soft ambient occlusion in the creases. No text, no letters, no numbers, no watermark, no border, no frame, no user interface.
PALETTE: cream #FBF1D6, sand #F4E3B8, amber #F4C95D, dusk orange #E89A3D, fox orange #E8823C, ink violet #4e4d76, moss green #6E8C4A, deep forest #2E4436."""

# Bohater jest TEN SAM w kazdym kafelku - to jest ta postac, ktora dziecko
# prowadzi po planecie, a nie neutralna sylwetka. Opisany raz, doklejany
# wszedzie, zeby dwadziescia cztery obrazki nie rozjechaly sie na dwadziescia
# cztery lisy.
BOHATER = """The character is a small friendly fox cub made of matte clay: warm fox orange #E8823C fur, cream muzzle, chest and tail tip, a teal blue neckerchief, big round dark eyes, small rounded ears. Cute, chunky proportions, no clothes beyond the neckerchief."""

# Wszystko, co MUSI byc identyczne w kazdym kafelku pytania. Kazde odstepstwo
# tutaj zamienia test w konkurs pieknosci miedzy kafelkami.
WSPOLNE = f"""{BOHATER} Square frame. The fox cub occupies about one third of the frame height and is seen in full, roughly centred. Soft even daylight from the upper left, no strong shadows, no rim light. Background: the same quiet mossy clearing on a small planet, softly out of focus, moss green #6E8C4A and deep forest #2E4436, only two or three simple shapes in it. Three to five objects in the whole picture, no more. Calm and plain, nothing shiny, nothing glowing."""

KAFELKI = {
    # Q1 — zamknieta skrzynia. Skrzynia jest ta sama we wszystkich czterech.
    "skrzynia-a": "The fox cub crouches beside a closed wooden chest and traces the padlock with one paw, head tilted, looking closely at it.",
    "skrzynia-b": "The fox cub kneels at a closed wooden chest and drums on its lid with both front paws; two simple clay sound rings float just above the lid.",
    "skrzynia-c": "The fox cub stands with one paw resting on a closed wooden chest and waves back over its shoulder at a second small clay animal standing further away.",
    "skrzynia-d": "The fox cub lifts the heavy lid of a wooden chest with both front paws; a small puff of dust and one leaf rise from the gap. The inside of the chest is dark and empty.",

    # Q2 — strumyk. Wersja dla klas 1-3 (kloda) ma wlasne pliki: *-13.
    "strumyk-a": "The fox cub stands steadily on the middle stepping stone of a shallow stream, paws close to its body, already looking at the next stone ahead.",
    "strumyk-b": "The fox cub crouches on the bank of a shallow stream and dips a stick into the water to check how deep it is.",
    "strumyk-c": "The fox cub lays a flat plank and three stones across a shallow stream, building a little bridge.",
    "strumyk-d": "The fox cub is caught mid-leap over a shallow stream, body stretched out, alone in the frame.",

    # Q3 — rozsypane kredki. Druga postac ma SPOKOJNA mine i sama zbiera.
    "kredki-a": "The fox cub crouches beside a second small clay animal with a calm face and holds out one crayon to it; spilled crayons lie on the ground between them.",
    "kredki-b": "The fox cub gathers spilled crayons and lines them up in a neat rainbow row on the ground.",
    "kredki-c": "The fox cub kneels and places crayons back into an open box one at a time; two blurred clay animals run past in the background while the fox stays still.",
    "kredki-d": "The fox cub peers under a low wooden bench; two crayons lie in the shadow underneath.",
}

KAFELKI.update({
    # Q4 — wielkie pudlo. Cztery rozne uzycia TEGO SAMEGO kartonu.
    "pudlo-a": "The fox cub sits inside a big cardboard box painted like a rocket, with a round window cut in the side and two flat cardboard fins taped on.",
    "pudlo-b": "A big cardboard box stands on its side like a little table; the fox cub leans over it and looks at a pebble through a magnifying glass, with a few leaves and a jar beside it.",
    "pudlo-c": "A big cardboard box lies on its side as a den with two cushions and a small lantern inside; the fox cub stands at the opening and gestures for a second small clay animal to come in.",
    "pudlo-d": "The fox cub sits on a flattened cardboard sheet, sliding halfway down a short grassy slope.",

    # Q5 — slady lapek. Sarna w MD musi byc BLISKO i duza, inaczej zwiazek
    # "zamarlem -> podeszla" nie dociera.
    "tropy-a": "The fox cub walks bent forward along a line of small animal paw prints in the earth; the prints disappear behind a bush.",
    "tropy-b": "The fox cub draws a plan in the soil with a stick: the paw prints, a tree and an arrow.",
    "tropy-c": "The fox cub hops through soft mud beside a line of animal paw prints, leaving a second row of its own prints alongside.",
    "tropy-d": "The fox cub stands completely still behind a low bush; a young deer is right beside it, close and large in the frame, reaching out for a leaf.",

    # Q6 — utkniety woz. Cztery role, kazda tak samo potrzebna: zadna nie jest
    # ladniejsza moralnie od pozostalych.
    "woz-a": "The fox cub steps into the place of a tired clay animal resting on its knees and takes hold of the rope pulling a small cart loaded with baskets.",
    "woz-b": "The fox cub already has its shoulder against the side of a small cart loaded with baskets, pushing; two other clay animals are only just gathering behind it.",
    "woz-c": "The fox cub points a paw to show a clay animal where to stand along a rope; two more animals stand in an even line beside the cart.",
    "woz-d": "The fox cub crouches at the wheel of a stuck cart, completely still, staring at a stone wedged under it; the other clay animals stand frozen in the background.",

    # Warianty dla klas 1-3: strumyk zamieniony na przewrocona klode. U mlodszych
    # woda niesie realny ladunek leku, a lek zmienia wybor na "bezpieczny"
    # niezaleznie od preferencji (werdykt socjologa).
    "kloda-a": "The fox cub stands steadily halfway along a fallen log lying across a path, paws close to its body, already looking at the far end.",
    "kloda-b": "The fox cub crouches beside a fallen log lying across a path and pokes it with a stick to see if it moves.",
    "kloda-c": "The fox cub lays a flat plank and three stones beside a fallen log, making an easier way around it.",
    "kloda-d": "The fox cub is caught mid-leap over a fallen log, body stretched out, alone in the frame.",
})

def prompt(nazwa):
    """Pelny prompt jednego kafelka. Wyciagniety, bo ten sam tekst wola
    `kafelki-fal.py` — dwie kopie opisow rozjechalyby sie przy pierwszej
    poprawce, a wtedy kafelki z dwoch generatorow przestalyby do siebie
    pasowac."""
    return f"{DNA}\n\n{KAFELKI[nazwa]}\n\n{WSPOLNE}"


def main():
    wybrane = [a for a in sys.argv[1:] if a in KAFELKI] or list(KAFELKI)
    print(f"do wygenerowania: {len(wybrane)}", flush=True)
    for nazwa in wybrane:
        plik = WYJSCIE / f"{nazwa}.png"
        if plik.exists() and nazwa not in sys.argv[1:]:
            print(f"pomijam {nazwa} (juz jest)", flush=True)
            continue
        print(f"generuje {nazwa}...", flush=True)
        odp = client.images.generate(
            model="gpt-image-1",
            prompt=prompt(nazwa),
            size="1024x1024",
            quality="high",
            output_format="png",
            n=1,
        )
        plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
        print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)
    print("gotowe.")


# Import nie moze generowac: `kafelki-fal.py` siega tu po same prompty.
if __name__ == "__main__":
    main()
