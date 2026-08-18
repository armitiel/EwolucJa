"""
styl-ilustracja.py — nowa ilustracja w stylu pop-upow, bez opisywania stylu.

gpt-image-1 nie ma seeda ani ID stylu. Jedyne, co da sie "zapisac", to
referencje: `docs/styl/*.png` to nasze wzorce, ktore ida do modelu razem z
kazdym promptem (images.edit). Dzieki temu prompt mowi WYLACZNIE, co jest na
obrazku — stylu nie opisujemy ani slowem, bo proba opisania go slowami dala
plaska naklejke wektorowa (patrz docs/grafika.md, rozdzial 2b).

Referencje sa zmniejszone do 512 px celowo: pelnowymiarowe pliki potrafily
wisiec przy uploadzie kilkanascie minut i nic nie zwrocic.

Uruchomienie (Windows):
  python scripts\\styl-ilustracja.py lisek-piorko "Ten sam lisek trzyma oburacz
  jedno duze zlote pioro przed soba, patrzy na nie z zachwytem."

Wynik ladauje w tmp/gen/<nazwa>.png (surowy) i tmp/gen/<nazwa>-gotowy.png
(przyciety do alfy, 560 px, skwantyzowany — gotowy do repo).
Klucz API: OPENAI_API_KEY / OPENAI_API / tmp/openai.key / ~/Desktop/api.txt
"""
import base64, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "assets" / "karty"
WYJSCIE.mkdir(parents=True, exist_ok=True)


def klucz_api():
    """Pliki przed zmiennymi srodowiskowymi.

    W zmiennej uzytkownika na Windowsie siedzi stary, uniewazniony klucz.
    Skrypt odpalony przez `cmd` dostawal go i konczyl sie 401, a odpalony
    inaczej — nie. Plik jest zrodlem prawdy, env tylko awaryjnie.
    """
    for p in [ROOT / "tmp" / "openai.key",
              pathlib.Path(os.path.expanduser("~/Desktop/api.txt"))]:
        if p.exists():
            for m in re.finditer(r'sk-[A-Za-z0-9_\-]{20,}', p.read_text("utf-8", "ignore")):
                if not m.group(0).startswith("sk-ant-"):
                    return m.group(0)
    for z in ("OPENAI_API_KEY", "OPENAI_API"):
        v = os.environ.get(z)
        if v and v.strip() and not v.startswith("sk-ant-"):
            return v.strip().strip('"')
    sys.exit("Brak klucza OpenAI.")


from openai import OpenAI
client = OpenAI(api_key=klucz_api())


REFERENCJE = sorted((ROOT / "docs" / "styl").glob("*.png"))
WYJSCIE = ROOT / "tmp" / "gen"
WYJSCIE.mkdir(parents=True, exist_ok=True)

# Prompt mowi o kadrze i o tresci. O stylu ma nie mowic nic poza jednym
# zdaniem, ktore odsyla do zalacznikow — reszte model widzi sam.
RAMA = """The attached images are the existing characters of this game. Draw the new picture so that it belongs to that same set: same character designs, same rendering, same colours, same outlines, same lighting — as if the same artist drew one more picture for the same game.

WHAT TO DRAW: {opis}

FRAMING: bust portrait, cut off flat at the bottom edge of the frame, character centred with even margin at the sides, isolated on a fully transparent background. No table, no floor, no ground shadow, no text, no letters, no frame, no background elements."""


def odchudz(zrodlo, cel, szerokosc=560, kolory=180):
    from PIL import Image
    im = Image.open(zrodlo).convert("RGBA")
    im = im.crop(im.getbbox())
    w, h = im.size
    im = im.resize((szerokosc, round(h * szerokosc / w)), Image.LANCZOS)
    im.quantize(colors=kolory, method=Image.FASTOCTREE).save(cel, optimize=True)
    return im.size


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit("uzycie: python scripts/styl-ilustracja.py <nazwa> \"<opis>\"")
    nazwa, opis = sys.argv[1], sys.argv[2]
    print(f"referencje: {[p.name for p in REFERENCJE]}", flush=True)
    odp = client.images.edit(
        model="gpt-image-1",
        image=[open(p, "rb") for p in REFERENCJE],
        prompt=RAMA.format(opis=opis),
        size="1024x1024",
        quality="high",
        background="transparent",
        n=1,
    )
    surowy = WYJSCIE / f"{nazwa}.png"
    surowy.write_bytes(base64.b64decode(odp.data[0].b64_json))
    gotowy = WYJSCIE / f"{nazwa}-gotowy.png"
    rozmiar = odchudz(surowy, gotowy)
    print(f"  -> {surowy} ({surowy.stat().st_size // 1024} kB)")
    print(f"  -> {gotowy} {rozmiar} ({gotowy.stat().st_size // 1024} kB)")
