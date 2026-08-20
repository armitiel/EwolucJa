# -*- coding: utf-8 -*-
"""
ilustracja-zadanie-sprawdzane.py — jak powstal `public/wizSprawdza.webp`.

Ekran "zadanie jest sprawdzane" mial klepsydre z zestawu ikon kreskowych
(`GameIcon name="hourglass"`). Klepsydra znaczy "czekaj" w kazdej aplikacji
swiata i wyglada jak element systemu, a nie jak kadr z gry, w ktorej dziecko
wlasnie cos zrobilo.

Ilustracje robimy img2img z `public/wizPop.webp` (patrz CLAUDE.md, sekcja
"Generowanie grafik"): styl bierze sie z gotowego rysunku Wizkora - grube
obrysy, polysk, paleta fiolet-zloto - zamiast byc zgadywany z opisu. Potem
leci `bria/background/remove`, bo ilustracja lezy na pergaminie i wlasne tlo
by go zaslonilo.

Uruchomienie (z katalogu repo, na maszynie autora - klucz siedzi w
`backend/.env` i nigdzie nie wyjezdza poza wywolanie fal.ai):

    python frontend/narzedzia/ilustracja-zadanie-sprawdzane.py

Skrypt NIE nadpisuje gotowego pliku bez pytania - kasowanie ilustracji, ktora
juz jest w grze, przez przypadkowe uruchomienie skryptu byloby zla zamiana.
"""
import io
import json
import os
import sys
import urllib.request

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WYJSCIE = os.path.join(REPO, "frontend", "public", "wizSprawdza.webp")

# Obraz wzorcowy musi byc DOSTEPNY PUBLICZNIE - fal.ai pobiera go po URL-u,
# wiec sciezka z dysku nic by nie dala. Produkcja serwuje `public/` jak jest.
WZOR = "https://ewolucja-azure.vercel.app/wizPop.webp"

PROMPT = (
    "the same chubby cartoon wizard character, deep purple robe and pointed hat with thick "
    "golden trim and golden stars, big white beard, glossy toy-like shading, very bold clean "
    "outlines, waist-up view, holding an unrolled golden parchment scroll in front of his chest "
    "and studying it through a large round golden magnifying glass, head tilted down toward the "
    "scroll, warm curious smile, tiny golden sparkles, vibrant violet and gold palette, "
    "2D cartoon children's book illustration, plain white background, centered"
)

NEGATYW = (
    "hourglass, clock, timer, loading spinner, text, letters, watermark, "
    "realistic, photographic, 3D render, dark, scary, blurry, deformed hands"
)

# strength - jedyne pokretlo, ktore tu naprawde decyduje:
#   0.62 i 0.78 oddaly wzor niemal bez zmian (Wizkor z laska, bez zwoju i lupy) -
#         img2img trzyma sie kompozycji mocniej, niz sugeruje liczba;
#   0.88  daje lupe i zwoj, a zostawia twarz, glancowany fiolet i zloto z wzoru;
#   0.95  rozjechalo sie na tyle, ze `bria` nie znalazla juz postaci i zwrocila
#         czarna plame.
STRENGTH = 0.88

def fal(sciezka, ciało, klucz):
    zadanie = urllib.request.Request(
        "https://fal.run/" + sciezka,
        data=json.dumps(ciało).encode("utf-8"),
        headers={"Authorization": "Key " + klucz, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(zadanie, timeout=300) as odp:
        return json.loads(odp.read().decode("utf-8"))


def klucz_z_env():
    sciezka = os.path.join(REPO, "backend", ".env")
    with io.open(sciezka, encoding="utf-8") as plik:
        for linia in plik:
            if linia.startswith("FAL_KEY="):
                return linia.split("=", 1)[1].strip()
    raise SystemExit("Brak FAL_KEY w backend/.env")


def main():
    if os.path.exists(WYJSCIE) and "--nadpisz" not in sys.argv:
        raise SystemExit(
            "%s juz istnieje. Uruchom z --nadpisz, jesli naprawde chcesz go zamienic." % WYJSCIE
        )

    klucz = klucz_z_env()

    print("[1/3] img2img z", WZOR)
    wynik = fal(
        "fal-ai/flux/dev/image-to-image",
        {
            "prompt": PROMPT,
            "image_url": WZOR,
            "image_size": "square_hd",
            "num_inference_steps": 32,
            "num_images": 1,
            "strength": STRENGTH,
            "enable_safety_checker": True,
        },
        klucz,
    )
    url = wynik["images"][0]["url"]

    print("[2/3] usuwanie tla")
    bez_tla = fal("fal-ai/bria/background/remove", {"image_url": url}, klucz)
    url = bez_tla["image"]["url"]

    print("[3/3] skalowanie do 512 i zapis webp")
    with urllib.request.urlopen(url, timeout=300) as odp:
        obraz = Image.open(io.BytesIO(odp.read())).convert("RGBA")
    obraz.thumbnail((512, 512), Image.LANCZOS)
    obraz.save(WYJSCIE, "WEBP", quality=88, method=6)
    print("zapisane:", WYJSCIE, obraz.size, os.path.getsize(WYJSCIE), "B")


if __name__ == "__main__":
    main()
