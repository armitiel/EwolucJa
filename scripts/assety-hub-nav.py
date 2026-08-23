"""
Ikony doku huba (gpt-image-1, przezroczyste tło).

Dok ma cztery przyciski i jeden język plastyczny: pękata bryła, gruby
złoto-brązowy obrys, mocny połysk u góry, jeden nasycony kolor na obiekt.
Ikona ma 60 px na ekranie, więc liczy się sylwetka, nie detal — dokładnie
tak, jak przy ikonach koła.

Uruchamiaj z katalogu głównego repo:
    python scripts/assety-hub-nav.py                 # wszystko, czego brakuje
    python scripts/assety-hub-nav.py zadania-a       # tylko wskazane
    python scripts/assety-hub-nav.py --nadpisz
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "hub-nav"
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


# DNA spisane z istniejących czterech ikon doku (pad, dymek, koperta, latarnia).
DNA = """STYLE: chunky cartoon game UI icon, one object filling the frame, seen straight from the front. Thick even golden-brown outline around the whole shape and around every inner part. Glossy plastic-toy finish with a soft white highlight in the upper left and a gentle darker shading at the bottom. Rounded, generous forms with no thin lines and no small details. Bold silhouette readable at 40 pixels. No text, no letters, no numbers, no background, no ground shadow, no frame.
PALETTE: parchment cream #FBEFCB, warm gold #F2C24A, wood brown #A45A1C, deep brown outline #6E3A10, leaf green #62B34A, deep green #2F7A2E, sealing-wax red #D8402F."""

IZOLACJA = "Isolated on a fully transparent background, centred, with a small even margin around it. Nothing else in the picture."

ASSETY = {
    # Trzy propozycje ikony zakładki „Zadania" — wybór należy do właściciela.
    "zadania-a": """A single sheet of cream parchment with softly rounded corners and slightly wavy edges, seen straight from the front, with a big bold green checkmark drawn across it and two short horizontal marks above the checkmark standing in for writing. """ + IZOLACJA,
    "zadania-b": """A small wooden tablet: a cream parchment page held in a chunky wooden frame with rounded corners, seen straight from the front. On the page three short horizontal marks stand in for lines of writing, and the top one has a small green checkmark beside it. """ + IZOLACJA,
    "zadania-c": """A partly unrolled parchment scroll seen straight from the front: a cream page with a wooden rod rolled at the top and at the bottom, and a big bold green checkmark in the middle of the page. """ + IZOLACJA,
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
        print(f"generuje {nazwa}...", flush=True)
        odp = client.images.generate(
            model="gpt-image-1",
            prompt=f"{DNA}\n\n{ASSETY[nazwa]}",
            size="1024x1024",
            quality="high",
            background="transparent",
            output_format="png",
            n=1,
        )
        plik.write_bytes(base64.b64decode(odp.data[0].b64_json))
        print(f"  -> {plik.relative_to(ROOT)}  ({plik.stat().st_size // 1024} kB)")


if __name__ == "__main__":
    main()
