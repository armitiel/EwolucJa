"""
rewers-karty.py — rewers karty: spokojne tlo, jeden pierscien, jedna gwiazda.

Pierwsza wersja przyszla z generatora obrazu jako CALA karta 2:3, ze zlota
ramka przy krawedziach. W grze kafelek jest KWADRATOWY i przycina obrazek
`object-fit: cover`, wiec z tej ramki zostawaly dwa jasne pionowe pasy po
bokach — na planszy dziewieciu kart wygladalo to jak zebra.

Dlatego rewers rysujemy tutaj, i to w dwoch wersjach:
  rewers.png     512x512  — do gry (kafelek kwadratowy, rogi obcina CSS)
  rewers-3d.png  512x768  — tekstura karty stojacej na mapie (`karta.glb`),
                            tam rogi musza byc ciemne, bo model nie ma alfy.

Zasada: tlo ma byc TLEM. Zaden pas, zadna ramka, zadna iskierka — jeden
lagodny gradient, jeden cienki pierscien i gwiazda. Reszte roboty robi ksztalt
karty i cien pod nia.
"""
import math, pathlib
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
DO_GRY = ROOT / "frontend" / "public" / "assets" / "karty" / "rewers.png"
DO_3D = ROOT / "frontend" / "public" / "assets" / "karty" / "rewers-3d.png"

FIOLET_JASNY = (109, 70, 176)
FIOLET_CIEMNY = (54, 32, 104)
ZLOTO = (244, 201, 93)
ZLOTO_JASNE = (255, 226, 150)
ZLOTO_CIEMNE = (196, 138, 47)


def tlo(w, h):
    """Pionowy gradient z lekka poswiata w srodku — bez ukosow i pasow."""
    im = Image.new("RGB", (w, h))
    px = im.load()
    for y in range(h):
        t = y / max(1, h - 1)
        kol = tuple(round(FIOLET_JASNY[k] + (FIOLET_CIEMNY[k] - FIOLET_JASNY[k]) * t) for k in range(3))
        for x in range(w):
            px[x, y] = kol
    # Delikatna poswiata na srodku: karta ma „oddychac", nie swiecic.
    poswiata = Image.new("L", (w, h), 0)
    ImageDraw.Draw(poswiata).ellipse(
        [w * 0.08, h * 0.16, w * 0.92, h * 0.84], fill=64)
    poswiata = poswiata.filter(ImageFilter.GaussianBlur(w * 0.16))
    return Image.composite(Image.new("RGB", (w, h), (128, 92, 200)), im, poswiata)


def maska_gwiazdy(w, h, r_zew, r_wew):
    """Czteroramienna gwiazdka (jak ✦ w interfejsie), z zaokraglonymi ramionami."""
    m = Image.new("L", (w, h), 0)
    cx, cy = w / 2, h / 2
    punkty = []
    for i in range(8):
        r = r_zew if i % 2 == 0 else r_wew
        a = -math.pi / 2 + i * math.pi / 4
        punkty.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    ImageDraw.Draw(m).polygon(punkty, fill=255)
    # Rozmycie + prog zaokragla ostre wierzcholki — glina nie ma szpicow.
    m = m.filter(ImageFilter.GaussianBlur(r_zew * 0.09))
    return m.point(lambda v: 255 if v > 116 else 0)


def rewers(w, h, rogi_ciemne):
    im = tlo(w, h)
    rys = ImageDraw.Draw(im)
    cx, cy = w / 2, h / 2
    bok = min(w, h)

    # Jeden pierscien. Drugi (kreskowany) wypadl — to on robil najwiecej szumu.
    r = bok * 0.30
    rys.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ZLOTO, width=max(3, round(bok * 0.011)))

    # Gwiazda z cieniem pod spodem i jasniejsza gorna krawedzia: tyle „gliny",
    # ile potrzeba, zeby nie byla plaska naklejka.
    maska = maska_gwiazdy(w, h, bok * 0.185, bok * 0.072)
    cien = maska.filter(ImageFilter.GaussianBlur(bok * 0.012))
    im.paste(Image.new("RGB", (w, h), ZLOTO_CIEMNE), (0, round(bok * 0.012)), cien)
    im.paste(Image.new("RGB", (w, h), ZLOTO), (0, 0), maska)
    gora = maska.filter(ImageFilter.GaussianBlur(bok * 0.02))
    gora = Image.composite(gora, Image.new("L", (w, h), 0), maska)
    im.paste(Image.new("RGB", (w, h), ZLOTO_JASNE), (0, -round(bok * 0.008)),
             gora.point(lambda v: min(255, round(v * 0.55))))

    if rogi_ciemne:
        # Model 3D nie ma przezroczystosci, wiec zaokraglenie musi byc namalowane.
        maska_rogow = Image.new("L", (w, h), 0)
        ImageDraw.Draw(maska_rogow).rounded_rectangle([0, 0, w - 1, h - 1], radius=round(w * 0.09), fill=255)
        im = Image.composite(im, Image.new("RGB", (w, h), (30, 18, 56)), maska_rogow)
    return im


for plik, (w, h), rogi in ((DO_GRY, (512, 512), False), (DO_3D, (512, 768), True)):
    obraz = rewers(w, h, rogi)
    obraz.quantize(colors=96, method=Image.FASTOCTREE).save(plik, optimize=True)
    print(f"{plik.name}: {w}x{h}, {plik.stat().st_size // 1024} kB")
