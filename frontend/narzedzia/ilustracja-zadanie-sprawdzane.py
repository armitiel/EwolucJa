# -*- coding: utf-8 -*-
"""
ilustracja-zadanie-sprawdzane.py — jak powstal `public/wizSprawdza.webp`.

Ekran "zadanie jest sprawdzane" mial klepsydre z zestawu ikon kreskowych
(`GameIcon name="hourglass"`). Klepsydra znaczy "czekaj" w kazdej aplikacji
swiata i wyglada jak element systemu, a nie jak kadr z gry.

CZEGO NIE UDALO SIE UZYC. Wlasciwa sciezka dla ilustracji pop-upowych jest
opisana w `docs/grafika.md`, rozdzial 2b: `scripts/styl-ilustracja.py` puszcza
`gpt-image-1` przez `images.edit` z referencjami z `docs/styl/*.png`, wiec styl
idzie do modelu obrazkiem, a nie slowami. Na tej maszynie ta droga jest dzis
zamknieta - konto OpenAI zwraca 429 `credit_balance_exhausted` (klucz jest
poprawny, brakuje srodkow; patrz CLAUDE.md, "ChatGPT Plus != API"). Gdy konto
zostanie doladowane, generuj tamtym skryptem, nie tym.

CO ZADZIALALO ZAMIAST TEGO. `fal-ai/flux-pro/kontext` - model EDYCJI, nie
generacji. Dostaje gotowa ilustracje Wizkora (`wizTip.webp`) i polecenie
zmieniajace WYLACZNIE to, co trzyma w rekach. Twarz, obrys, fiolet, zlota lamowka
i gwiazdki zostaja z pliku, bo model ich nie przerysowuje.

To jest roznica, ktora kosztowala pierwsze podejscie: `flux/dev/image-to-image`
(zalecany w CLAUDE.md do "w stylu istniejacej grafiki") przepisuje CALY obraz
z szumu i pilnuje tylko podobienstwa. Przy strength 0.62-0.78 oddawal wzor bez
zmian, przy 0.88 dokladal lupe, ale gubil lamowke i rysy twarzy, a przy 0.95
rozjezdzal sie tak, ze usuwanie tla zwracalo czarna plame. Do PODMIANY REKWIZYTU
w gotowej postaci bierz kontext; img2img zostaw do rzeczy, ktorych jeszcze nie ma.

Kadr i odchudzanie idzie wedlug `docs/grafika.md` (rozdzial 4): przyciecie do
alfy JAKO PIERWSZE, potem skalowanie, potem zapis. 560 px i webp q82 daje 60 kB,
czyli mniej niz 70 kB z tabeli dla "postac w scenie".

Uruchomienie (z katalogu repo, na maszynie autora - `FAL_KEY` siedzi
w `backend/.env` i nigdzie nie wyjezdza poza wywolanie fal.ai):

    python frontend/narzedzia/ilustracja-zadanie-sprawdzane.py [--nadpisz]

Bez `--nadpisz` skrypt nie rusza gotowego pliku: kasowanie ilustracji, ktora
juz jest w grze, przez przypadkowe uruchomienie byloby zla zamiana.
"""
import io
import json
import os
import sys
import urllib.error
import urllib.request

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WYJSCIE = os.path.join(REPO, "frontend", "public", "wizSprawdza.webp")

# Wzorzec musi byc DOSTEPNY PUBLICZNIE - fal.ai pobiera go po URL-u, wiec
# sciezka z dysku nic by nie dala. Produkcja serwuje `public/` jak jest.
# `wizTip.webp` (Wizkor z uniesionym palcem) jest lepszym wzorem niz `wizPop`:
# ma juz uniesiona reke, wiec model ma gdzie wlozyc lupe.
WZOR = "https://ewolucja-azure.vercel.app/wizTip.webp"

# Polecenie mowi najpierw, CO MA ZOSTAC (bo to jest cel), potem co zmienic.
# "Change only what he holds" jest tu cala robota - bez tego model poprawia
# przy okazji twarz i lamowke.
POLECENIE = (
    "Keep this exact character, art style, thick dark outlines, purple and gold colours, "
    "gold stars on the robe, shading and glossy highlights. Plain flat white background, nothing "
    "behind him, no bokeh, no sparkles, no text. Whole hat and both shoulders inside the frame with "
    "a small margin, nothing cropped at the sides. "
    "Change only what he holds: one hand raised holding a round magnifying glass with "
    "a golden rim, the other hand holding an unrolled cream parchment scroll in front of his chest. "
    "He tilts his head down and looks at the scroll through the magnifying glass, curious and warm."
)

SZEROKOSC = 560
JAKOSC = 82


def klucz_z_env():
    sciezka = os.path.join(REPO, "backend", ".env")
    with io.open(sciezka, encoding="utf-8") as plik:
        for linia in plik:
            if linia.startswith("FAL_KEY="):
                return linia.split("=", 1)[1].strip()
    raise SystemExit("Brak FAL_KEY w backend/.env")


def fal(sciezka, ciało, klucz):
    zadanie = urllib.request.Request(
        "https://fal.run/" + sciezka,
        data=json.dumps(ciało).encode("utf-8"),
        headers={"Authorization": "Key " + klucz, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(zadanie, timeout=600) as odp:
            return json.loads(odp.read().decode("utf-8"))
    except urllib.error.HTTPError as blad:
        raise SystemExit("fal.ai %s: %s" % (blad.code, blad.read().decode("utf-8", "ignore")[:400]))


def main():
    if os.path.exists(WYJSCIE) and "--nadpisz" not in sys.argv:
        raise SystemExit(
            "%s juz istnieje. Uruchom z --nadpisz, jesli naprawde chcesz go zamienic." % WYJSCIE
        )

    klucz = klucz_z_env()

    print("[1/3] kontext (edycja) na wzorze", WZOR)
    wynik = fal(
        "fal-ai/flux-pro/kontext",
        {
            "prompt": POLECENIE,
            "image_url": WZOR,
            "guidance_scale": 3.5,
            "num_images": 1,
            "output_format": "png",
            "safety_tolerance": "2",
        },
        klucz,
    )
    url = wynik["images"][0]["url"]

    # Kontext nie umie w przezroczystosc - stad osobny przebieg. Dlatego
    # polecenie prosi o PLASKIE BIALE tlo: bokeh z pierwszego podejscia
    # zostawial po sobie ciemna otoczke na wlosach brody.
    print("[2/3] usuwanie tla")
    url = fal("fal-ai/bria/background/remove", {"image_url": url}, klucz)["image"]["url"]

    print("[3/3] przyciecie do alfy, %s px, webp q%s" % (SZEROKOSC, JAKOSC))
    with urllib.request.urlopen(url, timeout=300) as odp:
        obraz = Image.open(io.BytesIO(odp.read())).convert("RGBA")
    obraz = obraz.crop(obraz.getbbox())
    obraz = obraz.resize((SZEROKOSC, round(obraz.height * SZEROKOSC / obraz.width)), Image.LANCZOS)
    obraz.save(WYJSCIE, "WEBP", quality=JAKOSC, method=6)
    print("zapisane:", WYJSCIE, obraz.size, os.path.getsize(WYJSCIE) // 1024, "kB")


if __name__ == "__main__":
    main()
