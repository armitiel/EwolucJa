"""
kafel-ikony.py — plytka 3D pod ikony minigier, rysowana proceduralnie.

Po co skryptem, a nie generatorem obrazu: ta plytka musi byc IDEALNIE
symetryczna i miec rogi w tym samym promieniu, co kafle w CSS. Model
generatywny za kazdym razem daje inne proporcje ramki i inny polysk, a tu
wszystkie piec gier stoi obok siebie i kazda roznica rzuca sie w oczy.

Warstwy, od dolu: cien pod plytka, zlota ramka z pionowym gradientem, ciemny
obrys (ten sam #3A2350, co w ikonach), kremowe pole z gradientem, polysk u gory
i miekki cien wewnetrzny u dolu.

Uruchomienie:  python scripts/kafel-ikony.py
Wynik:         frontend/public/assets/minigry/kafel.png
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
CEL = ROOT / "frontend" / "public" / "assets" / "minigry" / "kafel.png"
CEL.parent.mkdir(parents=True, exist_ok=True)

BOK = 512          # rysujemy duzo wiekszy i zmniejszamy - antyaliasing za darmo
MARGINES = 26
PROMIEN = 132


def gradient_pionowy(rozmiar, gora, dol):
    """Pasek gradientu jako obrazek — PIL nie ma gradientow z pudelka."""
    w, h = rozmiar
    g = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        g.putpixel((0, y), tuple(round(gora[i] + (dol[i] - gora[i]) * t) for i in range(3)))
    return g.resize((w, h), Image.BILINEAR)


def maska_plytki(inset, promien):
    m = Image.new("L", (BOK, BOK), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle(
        [MARGINES + inset, MARGINES + inset, BOK - MARGINES - inset, BOK - MARGINES - inset],
        radius=promien, fill=255,
    )
    return m


plytka = Image.new("RGBA", (BOK, BOK), (0, 0, 0, 0))

# 1. Cien pod plytka — przesuniety w dol, rozmyty.
cien = Image.new("RGBA", (BOK, BOK), (0, 0, 0, 0))
ImageDraw.Draw(cien).rounded_rectangle(
    [MARGINES, MARGINES + 16, BOK - MARGINES, BOK - MARGINES + 16],
    radius=PROMIEN, fill=(74, 48, 18, 120),
)
plytka.alpha_composite(cien.filter(ImageFilter.GaussianBlur(14)))

# 2. Ciemny obrys — jak w ikonach, zeby plytka byla z tej samej rodziny.
obrys = Image.new("RGBA", (BOK, BOK), (0, 0, 0, 0))
ImageDraw.Draw(obrys).rounded_rectangle(
    [MARGINES - 6, MARGINES - 6, BOK - MARGINES + 6, BOK - MARGINES + 6],
    radius=PROMIEN + 6, fill=(58, 35, 80, 255),
)
plytka.alpha_composite(obrys)

# 3. Zlota ramka.
ramka = gradient_pionowy((BOK, BOK), (255, 235, 160), (176, 118, 32)).convert("RGBA")
ramka.putalpha(maska_plytki(0, PROMIEN))
plytka.alpha_composite(ramka)

# 4. Kremowe pole.
POLE = 30
pole = gradient_pionowy((BOK, BOK), (255, 253, 244), (240, 224, 182)).convert("RGBA")
pole.putalpha(maska_plytki(POLE, PROMIEN - POLE + 8))
plytka.alpha_composite(pole)

# 5. Polysk: gladki pas od gornej krawedzi pola, gasnacy w polowie wysokosci.
#    Wczesniej byla tu rozmyta elipsa - jej krawedz przecinala plytke w poprzek
#    i wygladala jak usmiech, a nie jak swiatlo.
maska_pola = maska_plytki(POLE, PROMIEN - POLE + 8)
gora_pola = MARGINES + POLE
wys_pola = BOK - 2 * (MARGINES + POLE)
grad = Image.new("L", (1, BOK), 0)
for y in range(BOK):
    t_y = (y - gora_pola) / max(1, wys_pola * 0.52)
    grad.putpixel((0, y), 0 if t_y < 0 or t_y > 1 else round(120 * (1 - t_y) ** 1.6))
grad = grad.resize((BOK, BOK), Image.BILINEAR)
polysk = Image.new("RGBA", (BOK, BOK), (255, 255, 255, 0))
polysk.putalpha(Image.composite(grad, Image.new("L", (BOK, BOK), 0), maska_pola))
plytka.alpha_composite(polysk)

# 6. Cien wewnetrzny TYLKO u dolu - to on robi wrazenie wypuklosci. Pelna
#    obwodka wygladala jak druga ramka w srodku.
dol = Image.new("L", (1, BOK), 0)
for y in range(BOK):
    t_y = (y - (gora_pola + wys_pola * 0.55)) / max(1, wys_pola * 0.45)
    dol.putpixel((0, y), 0 if t_y < 0 else round(105 * min(1, t_y) ** 1.8))
dol = dol.resize((BOK, BOK), Image.BILINEAR)
wglebienie = Image.new("RGBA", (BOK, BOK), (150, 105, 40, 0))
wglebienie.putalpha(Image.composite(dol, Image.new("L", (BOK, BOK), 0), maska_pola))
plytka.alpha_composite(wglebienie.filter(ImageFilter.GaussianBlur(6)))

plytka = plytka.resize((236, 236), Image.LANCZOS)
# Bez kwantyzacji: na lagodnym gradiencie polysku 190 kolorow zostawialo
# widoczne poziome pasy. Plik i tak wazy kilkanascie kilobajtow.
plytka.save(CEL, optimize=True)
print(f"-> {CEL} ({CEL.stat().st_size // 1024} kB)")
