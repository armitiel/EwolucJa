# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
Kafelki odpowiedzi W JEDNEJ SCENIE — bez tla, z tym samym przedmiotem.

CO BYLO ZLE. Pierwszy komplet szedl dwadziescia cztery osobne wywolania
`images.generate`. Styl trzymal sie dobrze, ale KAZDY kafelek mial wlasne tlo
i wlasna wersje przedmiotu: skrzynia w czterech kafelkach jednego pytania byla
za kazdym razem inna — inny ksztalt wieka, inna kloadka, inny kat. Dziecko
porownuje wtedy obrazki, a nie czynnosci. Brief (`docs/TEST_OBRAZKOWY.md` §5)
mowi wprost: ta sama poza wyjsciowa, ta sama skala, ta sama liczba elementow.

JAK TO NAPRAWIAMY. Na pytanie przypada JEDEN obraz wzorcowy (`*-a`), a trzy
pozostale powstaja przez `images.edit` NA NIM: model dostaje gotowy kafelek
i polecenie zmiany samej czynnosci bohatera. Przedmiot zostaje ten sam, bo
fizycznie jest tym samym pikselem wejsciowym.

BEZ TLA. Kafelek siedzi na kremowym papierze karty, wiec kazde wlasne tlo
konkuruje z sasiadem i z karta. `background="transparent"` zdejmuje je
calkowicie — zostaje sam bohater z przedmiotem.

Uruchomienie:  python scripts\\kafelki-spojne.py skrzynia
               python scripts\\kafelki-spojne.py            (wszystkie pytania)
Klucz: backend/.env -> OPENAI_API_KEY
"""
import base64, io, os, pathlib, re, sys

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


# Prompty czynnosci z jedynego zrodla prawdy — tego samego, ktore opisuje
# kafelki w `quizObrazkowy.js`.
import importlib.util
_spec = importlib.util.spec_from_file_location("kafelki_onb", ROOT / "scripts" / "kafelki-onboarding.py")
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
KAFELKI, DNA, BOHATER = _mod.KAFELKI, _mod.DNA, _mod.BOHATER

# KLUCZOWE ELEMENTY kazdego pytania. To one maja byc IDENTYCZNE we wszystkich
# kafelkach — nie tylko skrzynia: lisek, strumyk, kredki, pudlo, tropy, woz.
# Ta lista trafia do polecenia edycji jako „nie ruszaj tego".
KLUCZOWE = {
    "skrzynia": "the fox cub and the closed wooden chest with its padlock",
    "strumyk": "the fox cub and the shallow stream with its stepping stones",
    "kredki":  "the fox cub, the spilled crayons and the open crayon box",
    "pudlo":   "the fox cub and the big cardboard box",
    "tropy":   "the fox cub and the line of animal paw prints",
    "woz":     "the fox cub and the small cart loaded with baskets",
    "kloda":   "the fox cub and the fallen log",
}

# Bez tla i bez sceny — kafelek siedzi na kremowym papierze karty.
BEZ_TLA = (f"{BOHATER} Isolated on a fully transparent background, no scenery, no ground, "
           "no grass, no sky, no shadow on the ground. The whole scene is centred in the frame "
           "with even margin on all sides, and fills most of it. Exactly the objects described "
           "and nothing else.")


def wzorzec(grupa, klucz):
    """Pierwszy kafelek pytania — jedyny generowany od zera."""
    odp = client.images.generate(
        model="gpt-image-1",
        prompt=f"{DNA}\n\n{KAFELKI[klucz]}\n\n{BEZ_TLA}",
        size="1024x1024", quality="high", background="transparent",
        output_format="png", n=1,
    )
    return base64.b64decode(odp.data[0].b64_json)


def wariant(baza_bajty, grupa, klucz):
    """Kolejny kafelek TEGO SAMEGO pytania — edycja na obrazie wzorcowym.

    Polecenie mowi dwie rzeczy naraz: co ma sie zmienic (czynnosc bohatera)
    i czego NIE WOLNO ruszyc (kluczowe elementy z `KLUCZOWE`). Bez drugiej
    polowy model przerysowuje przedmiot po swojemu i wracamy do punktu wyjscia.
    """
    plik = io.BytesIO(baza_bajty)
    plik.name = "wzorzec.png"
    polecenie = (
        f"Redraw this picture with ONE change: {KAFELKI[klucz]}\n\n"
        f"Keep {KLUCZOWE[grupa]} EXACTLY as in the source image — same design, same shape, "
        "same colours, same size, same position in the frame. Keep the identical art style, "
        "line weight, lighting and proportions. Change only what the fox cub is doing and, "
        "if the description requires it, add only the objects it names. "
        "Fully transparent background, no scenery, no ground, no shadow."
    )
    odp = client.images.edit(
        model="gpt-image-1",
        image=plik,
        prompt=polecenie,
        size="1024x1024",
        quality="high",
        background="transparent",
        n=1,
    )
    return base64.b64decode(odp.data[0].b64_json)


GRUPY = {g: [k for k in KAFELKI if k.rsplit("-", 1)[0] == g] for g in KLUCZOWE}

wybrane = [a for a in sys.argv[1:] if a in GRUPY] or list(GRUPY)
print(f"pytania do przerobienia: {len(wybrane)}", flush=True)

for grupa in wybrane:
    klucze = sorted(GRUPY[grupa])
    if not klucze:
        continue
    print(f"[{grupa}] wzorzec {klucze[0]}...", flush=True)
    baza = wzorzec(grupa, klucze[0])
    (WYJSCIE / f"{klucze[0]}.png").write_bytes(baza)
    print(f"  -> {klucze[0]}.png ({len(baza)//1024} kB)", flush=True)
    for k in klucze[1:]:
        print(f"[{grupa}] wariant {k}...", flush=True)
        try:
            dane = wariant(baza, grupa, k)
            (WYJSCIE / f"{k}.png").write_bytes(dane)
            print(f"  -> {k}.png ({len(dane)//1024} kB)", flush=True)
        except Exception as e:
            print(f"  !! {k}: {type(e).__name__} {e}", flush=True)

print("gotowe.")
