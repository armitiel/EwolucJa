# EwolucJA — gra edukacyjna dla dzieci.
# © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
# Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
# Prawa autorskie należą do autora. Pełna nota: LICENSE.
"""
Tlo onboardingu W STYLU EKRANU STARTOWEGO (fal.ai, image-to-image).

DLACZEGO OD NOWA. Pierwsza wersja (`assety-onboarding.py`) szla blokiem DNA
z generatorow IKON: matowa glina, plaskie ksztalty, zero glebi. To jest jezyk
kafelkow i przedmiotow, a nie jezyk EKRANU WEJSCIA. Efekt czytal sie jak tlo
minigry: dziecko klikalo START w slonecznym, malarskim lesie i po sekundzie
ladowalo w innym swiecie.

Wzorcem jest `public/assets/wejscie/tlo-start-lis.webp` — ta sama ilustracja,
ktora dziecko oglada przez cala chwile przed kliknieciem. img2img bierze z niej
palete, swiatlo i sposob malowania listowia pewniej niz jakikolwiek opis.

Czego tu NIE ma: postaci (Wizkor stoi przed tlem jako osobna grafika), tekstu,
ramki. Dol kadru jest ciemniejszy i spokojny — tam siada kremowa karta i musi
miec sie od czego odbic.

Uruchomienie:  python scripts\\tlo-onboarding-fal.py
Klucz: backend/.env -> FAL_KEY
"""
import base64, json, pathlib, re, sys, time, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
WZORZEC = ROOT / "frontend" / "public" / "assets" / "wejscie" / "tlo-start-lis.webp"
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "onboarding"
WYJSCIE.mkdir(parents=True, exist_ok=True)


def klucz():
    t = (ROOT / "backend" / ".env").read_text("utf-8", "ignore")
    m = re.search(r"FAL_KEY\s*=\s*['\"]?([^\s'\"]+)", t)
    if not m:
        sys.exit("Brak FAL_KEY w backend/.env.")
    return m.group(1)


NAGLOWKI = {"Authorization": "Key " + klucz(), "Content-Type": "application/json"}


def wolaj(url, dane=None):
    req = urllib.request.Request(url, data=json.dumps(dane).encode() if dane else None, headers=NAGLOWKI)
    return json.loads(urllib.request.urlopen(req, timeout=120).read())


# Wspolne dla wszystkich wariantow. „Painterly storybook" zamiast „matte clay" —
# to jest roznica, ktora decyduje o tym, czy ekran nalezy do tej samej gry.
WSPOLNE = (
    "Painterly storybook children's book illustration, the same warm hand-painted style, "
    "palette and lighting as the reference: lush saturated greens, golden sunlight, soft "
    "light rays through the canopy, tiny floating sparkles, detailed foliage and mossy ground. "
    "NO characters, no animals, no people, no text, no letters, no frame, no user interface. "
    "Vertical composition. The lower third is in deeper green shade, calm and free of detail, "
    "so a card can sit on top of it."
)

WARIANTY = {
    "las-a": "A sunlit forest path curving away between tall birches and pines, seen from the "
             "middle of the trail. Golden light pours through the canopy from the upper right. "
             "Wildflowers and red-capped mushrooms along the edges. " + WSPOLNE,
    "las-b": "A quiet forest clearing ringed by tall trees, a shaft of golden light falling into "
             "the middle of the glade, soft moss and ferns underfoot, a few violet flowers. "
             "Late afternoon, warm and inviting. " + WSPOLNE,
    "las-c": "Deep inside the forest looking up the trail: big mossy trunks close on both sides "
             "framing the frame like an arch, the path lit warm gold in the distance, cool green "
             "shade in the foreground. Magical but calm. " + WSPOLNE,
}

# ── Planeta ──────────────────────────────────────────────────────────────
# Pomysl wlasciciela: tlem wejscia niech bedzie TO MIEJSCE, do ktorego dziecko
# za chwile trafi — mala planeta porosnieta lasami. Ekran startowy pokazuje
# liska w lesie, swiat 3D pokazuje zielona kule pod blekitnym niebem; tlo
# onboardingu ma byc mostem miedzy jednym a drugim, wiec bierze palete ze
# sceny 3D (nasycona zielen, biale oble chmury, slonce wysoko), a sposob
# malowania z ekranu startowego.
#
# Kadr: luk planety w dolnej polowie, otwarte niebo nad nim. Karta siada na
# granicy jednego i drugiego, a ciemniejsza gora nieba daje kremowemu papierowi
# od czego sie odbic.
PLANETA = (
    "Painterly storybook children's book illustration, warm hand-painted style with soft "
    "volumetric light, the same palette as a bright low-poly game world: saturated grass "
    "green, deep sky blue, rounded fluffy white clouds, golden sunlight. "
    "NO characters, no animals, no people, no text, no letters, no frame, no user interface. "
    "Vertical composition."
)

WARIANTY.update({
    "planeta-a": "A small round planet covered in dense forests, meadows and little groves, seen "
                 "from just above its horizon so its green curve fills the lower half of the frame. "
                 "Above it an open deep blue sky, deeper at the top, with a few rounded white "
                 "clouds and warm sunlight from the upper left. Tiny trees and flowering bushes "
                 "along the curve. " + PLANETA,
    "planeta-b": "A tiny forested planet floating in the middle of the frame, a green globe wrapped "
                 "in pine forests, clearings and a small blue lake, with a few clouds drifting "
                 "around it. Deep blue sky behind, golden light from the upper left, faint stars "
                 "higher up. Soft and inviting, like a world seen from space in a picture book. " + PLANETA,
    "planeta-c": "The green curve of a small planet across the lower third of the frame, thickly "
                 "overgrown with forest: rounded treetops, meadows and flowers along the horizon. "
                 "Above, a wide deep blue sky with rounded white clouds and warm golden light "
                 "spilling over the curve from the upper left. " + PLANETA,
})


def generuj(nazwa, tresc, strength=0.62):
    dane = base64.b64encode(WZORZEC.read_bytes()).decode()
    zlecenie = wolaj("https://queue.fal.run/fal-ai/flux/dev/image-to-image", {
        "prompt": tresc,
        "image_url": f"data:image/webp;base64,{dane}",
        "strength": strength,
        "num_inference_steps": 40,
        "guidance_scale": 3.5,
        "num_images": 1,
    })
    for _ in range(90):
        time.sleep(2)
        st = wolaj(zlecenie["status_url"])
        if st.get("status") == "COMPLETED":
            break
        if st.get("status") == "FAILED":
            raise RuntimeError(f"{nazwa}: FAILED")
    else:
        raise TimeoutError(f"{nazwa}: brak odpowiedzi")
    wynik = wolaj(zlecenie["response_url"])
    plik = WYJSCIE / f"tlo-{nazwa}.png"
    plik.write_bytes(urllib.request.urlopen(wynik["images"][0]["url"], timeout=120).read())
    return plik


if "--tekst" not in sys.argv:
    wybrane = [a for a in sys.argv[1:] if a in WARIANTY] or list(WARIANTY)
    for nazwa in wybrane:
        print(f"generuje tlo-{nazwa} (z wzorca)...", flush=True)
        try:
            p = generuj(nazwa, WARIANTY[nazwa])
            print(f"  -> {p.name} ({p.stat().st_size // 1024} kB)", flush=True)
        except Exception as e:
            print(f"  !! {nazwa}: {type(e).__name__} {e}", flush=True)
    print("gotowe.")


# ── Bez wzorca ───────────────────────────────────────────────────────────
# img2img przy sile 0,62 wiernie oddaje palete i sposob malowania, ale NIE
# usuwa bohatera: lisek jest glownym tematem obrazu zrodlowego, wiec przy tej
# sile zostaje w kadrze mimo „NO characters" w opisie. Podniesienie sily do
# 0,9 usuwa go kosztem stylu. Dlatego tlo robimy tekstem — styl niesie sam
# opis (ta sama rodzina malarska, co ekran startowy), a pusty las jest wtedy
# naprawde pusty.
def generuj_tekstem(nazwa, tresc):
    zlecenie = wolaj("https://queue.fal.run/fal-ai/flux/dev", {
        "prompt": tresc,
        "image_size": {"width": 896, "height": 1344},
        "num_inference_steps": 40,
        "guidance_scale": 3.5,
        "num_images": 1,
    })
    for _ in range(90):
        time.sleep(2)
        st = wolaj(zlecenie["status_url"])
        if st.get("status") == "COMPLETED":
            break
        if st.get("status") == "FAILED":
            raise RuntimeError(f"{nazwa}: FAILED")
    else:
        raise TimeoutError(f"{nazwa}: brak odpowiedzi")
    wynik = wolaj(zlecenie["response_url"])
    plik = WYJSCIE / f"tlo-{nazwa}.png"
    plik.write_bytes(urllib.request.urlopen(wynik["images"][0]["url"], timeout=120).read())
    return plik


if "--tekst" in sys.argv:
    for nazwa in [n for n in WARIANTY if f"--{n}" in sys.argv] or list(WARIANTY):
        print(f"generuje tlo-{nazwa} (tekstem)...", flush=True)
        try:
            p = generuj_tekstem(nazwa + "-t", WARIANTY[nazwa])
            print(f"  -> {p.name} ({p.stat().st_size // 1024} kB)", flush=True)
        except Exception as e:
            print(f"  !! {nazwa}: {type(e).__name__} {e}", flush=True)
    print("gotowe.")
