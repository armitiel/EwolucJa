"""
Koło Przeznaczenia — elementy UI (gpt-image-1, przezroczyste tło).

CO TU JEST, A CZEGO NIE MA. Samo koło — rama, piasta, wskaźnik, tarcza —
NIE jest generowane. Rama, piasta i wskaźnik są wycięte z ilustracji
(`narzedzia/kolo-warstwy.py`), a tarcza rysowana kodem, bo pięć klinów musi
mieć dokładnie po 72 stopnie. Tutaj powstaje cała RESZTA ekranu: ikony
kategorii, tabliczki, przyciski, pieniek pod kołem, maskotka i tło.

Każdy element osobno i na przezroczystym tle — ekran składa się w CSS, więc
tabliczkę da się rozciągnąć pod dłuższy tytuł, a ikonę wymienić bez ruszania
reszty.

Uruchamiaj z katalogu głównego repo:
    python scripts/assety-kolo.py                # wszystko, czego brakuje
    python scripts/assety-kolo.py ikona-odwaga   # tylko wskazane
    python scripts/assety-kolo.py --nadpisz      # wygeneruj od nowa
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "kolo"
WYJSCIE.mkdir(parents=True, exist_ok=True)


def klucz():
    for z in ("OPENAI_API_KEY", "OPENAI_API"):
        v = os.environ.get(z, "")
        if v.strip() and not v.startswith("sk-ant-"):
            return v.strip().strip('"')
    for p in (ROOT / "backend" / ".env", ROOT / "tmp" / "openai.key"):
        if p.exists():
            for m in re.finditer(r'sk-[A-Za-z0-9_\-]{20,}', p.read_text("utf-8", "ignore")):
                if not m.group(0).startswith("sk-ant-"):
                    return m.group(0)
    sys.exit("Brak klucza OpenAI (OPENAI_API_KEY albo backend/.env).")


DNA = """STYLE: warm storybook game UI illustration, hand-painted cartoon look with clean thick darker outlines, soft cel shading and gentle inner glow. Cosy woodland fairy-tale mood: carved honey-brown wood, aged cream parchment, golden brass fittings, fresh green leaves. Light comes from the upper left. Rich saturated colours, chunky friendly shapes readable at small size. NO text, no letters, no numbers, no watermark, no signature, no drop shadow on the ground, no background scenery, no frame around the image.
PALETTE: wood brown #A45A1C and #6E3A10, gold #F5C21B and #E09A12, parchment cream #FBEFCB and #F0DCA6, leaf green #6FBB4E and #3F7A2B, deep ink brown #3A2109."""

IZOLACJA = "Isolated on a fully transparent background, centred, with a small even margin around it. Nothing else in the picture."

# DNA ikon jest OSOBNE i celowo surowsze od reszty ekranu. Tabliczka może być
# malowana i szczegółowa, bo ogląda się ją z bliska i przez sekundę. Ikona na
# klinie ma 40 px i jedno zadanie: zostać rozpoznaną, zanim koło się zatrzyma.
IKONA = """STYLE: flat game icon, extremely simplified, ONE object filling the frame, seen straight from the front. Bold chunky silhouette readable at 32 pixels. Thick even dark brown outline #3A2109 around the whole shape and around every inner part. At most THREE flat colours, no gradients, no shading, no texture, no highlights, no sparkles, no leaves, no shadow, no background. Big simple forms, generously rounded corners, no thin lines, no small details of any kind. Think road-sign clarity, not illustration.
PALETTE: warm cream #FBEFCB, warm gold #F5C21B, deep red #E0472F, leaf green #6FBB4E, sky blue #3AA6E8, outline deep brown #3A2109.

"""

ASSETY = {
    # ── ikony kategorii (na kliny koła) ──────────────────────────────────
    # PROSTOTA JEST TU FUNKCJĄ, NIE STYLEM. Pierwsza tura wyszła ładnie
    # (skrzynia z latarnią i zwiniętym śpiworem, paleta z pędzlem, listki,
    # iskierki), ale na klinie ma jakieś 40 px i cały ten detal zlewał się
    # w plamę. Ikona ma być rozpoznana w ćwierć sekundy, z odległości
    # wyciągniętej ręki — liczy się SYLWETKA, nie ilustracja.
    #
    # Stąd twarde ograniczenia w prompcie: jeden przedmiot, gruby ciemny
    # obrys, najwyżej trzy płaskie kolory, zero gradientów, zero dodatków
    # (listki, iskry, cienie). Kremowe wypełnienie plus ciemny obrys czyta
    # się tak samo dobrze na niebieskim, fioletowym, zielonym, czerwonym
    # i pomarańczowym klinie — a to jedyne pięć teł, jakie tu występują.
    "ikona-ciekawosc": ("1024x1024", IKONA + """The object is a magnifying glass tilted to the right: one big perfectly round lens with a thick rim and a short stubby handle. Lens glass pale cream, rim and handle warm gold, nothing inside the lens. """ + IZOLACJA),
    "ikona-tworzenie": ("1024x1024", IKONA + """The object is a painter's palette: one simple rounded blob shape with a round thumb hole near the lower left and exactly three big round dabs of paint on it (red, blue, green). No brush, no easel. Palette body warm cream. """ + IZOLACJA),
    "ikona-wspolpraca": ("1024x1024", IKONA + """The object is two animal paw prints pressed together in a high five, seen flat from the front: two simple rounded paw shapes, each a big pad with four round toes, tilted towards each other so they touch. One paw warm cream, the other warm gold. No heart, no arms, no fur detail. """ + IZOLACJA),
    "ikona-odwaga": ("1024x1024", IKONA + """The object is the head of a fox seen straight from the front: one bold rounded shape with two big triangular ears, a cream muzzle patch and two simple dot eyes. Face warm gold-orange, muzzle and inner ears cream. No wreath, no body, no whiskers, no glow. """ + IZOLACJA),
    "ikona-wytrwalosc": ("1024x1024", IKONA + """The object is a mountain peak with a flag on top: one bold triangular mountain with a cream snowy cap and a small simple pennant flag planted at the summit. Mountain body warm gold-brown, flag deep red. No clouds, no path, no extra peaks behind. """ + IZOLACJA),

    # ── tabliczki i przyciski ────────────────────────────────────────────
    "baner-tytul": ("1536x1024", """A wide horizontal signboard of aged cream parchment stretched on a carved honey-brown wooden frame, with gently curved top and bottom edges and small carved bosses at the corners. Fresh green leaves and a couple of small twigs grow over the upper-left and upper-right corners. The parchment surface is EMPTY — no writing of any kind. """ + IZOLACJA),
    "wstazka-podtytul": ("1536x1024", """A slim horizontal ribbon plaque of aged cream parchment with softly rounded ends and a thin golden edge line, a single small green leaf resting at each end. The surface is EMPTY — no writing of any kind. """ + IZOLACJA),
    "przycisk-cta": ("1536x1024", """A wide chunky pill-shaped game button made of fresh green enamel with a lighter green top highlight, a thick darker green rim and a soft golden inner outline, seen straight from the front. Two small green leaves tucked at the right end. The face of the button is EMPTY — no writing of any kind. """ + IZOLACJA),
    "przycisk-zamknij": ("1024x1024", """A round game button the size of a coin: a disc of aged cream parchment inside a carved honey-brown wooden ring with a thin golden inner line, seen straight from the front. The face is EMPTY — no symbol, no letters. """ + IZOLACJA),

    # ── scenografia ──────────────────────────────────────────────────────
    "kolo-podstawa": ("1536x1024", """A wide low stand for a fairground wheel: a broad flat tree stump of honey-brown wood with visible growth rings on top and rough bark at the sides, with two short carved wooden legs. A few small green leaves and acorns at its base. Seen straight from the front, slightly from above. """ + IZOLACJA),
    "lisek": ("1024x1536", """A friendly young fox cub sitting upright and smiling with its mouth open in delight, ginger-orange fur, big cream cheeks and chest, white tail tip, wearing a soft green neckerchief with a small golden acorn charm. Big warm dark eyes. Seen from the front in a gentle three-quarter view, full body including the tail curled beside it. """ + IZOLACJA),
    # UWAGA NA SRODEK KADRU: na tle stanie koło, więc wszystko, co ciekawe,
    # musi siedzieć przy krawędziach. Pierwsza wersja postawiła chatkę
    # dokładnie tam, gdzie potem stoi tarcza.
    "tlo-las": ("1024x1536", """A background plate for a game panel, portrait format: a sunlit fairy-tale forest seen through a soft haze. Tall mossy tree trunks and layers of green foliage along the LEFT and RIGHT edges, warm sunbeams falling from the upper left, small mushrooms, ferns and flowers along the BOTTOM edge, dappled light on a mossy forest floor. The whole picture is painted softly and clearly OUT OF FOCUS, like a photographic background at wide aperture. The MIDDLE of the frame is deliberately empty and quiet — just soft blurred green and golden light, no objects, no buildings, no animals, no path there. No transparency — a full painted background."""),
}

CEL = {k: (WYJSCIE / f"{k}.png") for k in ASSETY}


def main():
    argi = [a for a in sys.argv[1:] if not a.startswith("--")]
    nadpisz = "--nadpisz" in sys.argv
    wybor = argi or list(ASSETY)
    nieznane = [a for a in wybor if a not in ASSETY]
    if nieznane:
        sys.exit(f"Nie znam elementu: {', '.join(nieznane)}\nDostępne: {', '.join(ASSETY)}")

    from openai import OpenAI
    client = OpenAI(api_key=klucz())

    for nazwa in wybor:
        plik = CEL[nazwa]
        if plik.exists() and not nadpisz:
            print(f"pomijam (jest): {plik.name}")
            continue
        rozmiar, tresc = ASSETY[nazwa]
        przezroczyste = "transparent" in tresc
        print(f"generuję {nazwa} ({rozmiar})…", flush=True)
        # Ikony przynoszą własne DNA (`IKONA`) i NIE dostają malarskiego opisu
        # reszty ekranu — dwa sprzeczne style w jednym prompcie dają papkę.
        pelny = tresc if tresc.lstrip().startswith("STYLE:") else f"{DNA}\n\n{tresc}"
        odp = client.images.generate(
            model="gpt-image-1",
            prompt=pelny,
            size=rozmiar,
            quality="high",
            background="transparent" if przezroczyste else "opaque",
            output_format="png",
            n=1,
        )
        plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
        print(f"  -> {plik.relative_to(ROOT)}  ({plik.stat().st_size // 1024} kB)")


if __name__ == "__main__":
    main()
