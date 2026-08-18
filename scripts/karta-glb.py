"""
karta-glb.py — buduje `assets/karta.glb`: kartę z Pamięci Mędrca jako obiekt 3D.

Dlaczego rysowana w kodzie, a nie wyeksportowana z programu 3D: rewers karty
w grze to kilka kształtów rysowanych w SVG (fioletowy gradient, dwa złote
pierścienie, gwiazda). Tu powtarzamy DOKŁADNIE te same kolory i proporcje na
teksturze, więc karta na mapie i karta w grze to ten sam przedmiot, a nie dwa
podobne. Przy okazji plik waży kilkadziesiąt kB zamiast megabajta.

Geometria: pudełko 0,68 × 1,0 × 0,05 (24 wierzchołki, po jednym komplecie na
ścianę, żeby normalne były ostre). Przód i tył biorą całą teksturę, cztery
boki — jeden ciemny piksel z jej rogu. Bez przezroczystości: `alphaMode` inny
niż OPAQUE potrafił już w tej scenie narobić szkody, a zaokrąglenie rogów
widać i tak z tekstury.

Uruchomienie:  python scripts/karta-glb.py
"""
import json, math, pathlib, struct
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parents[1]
WYJSCIE = ROOT / "frontend" / "public" / "scena-3d" / "assets" / "karta.glb"

# ── Tekstura: rewers karty 1:1 jak w grze (MemCard) ──────────────────────────
SZER, WYS = 512, 768
ZLOTO = (255, 210, 105)


def gradient():
    """Fioletowy gradient 135° — #7A4DC2 → #4A2D80 (60%) → #291752."""
    im = Image.new("RGB", (SZER, WYS))
    px = im.load()
    # Rozjasnione o ~30% wzgledem rewersu z gry: w 3D karta stoi na jasnej
    # trawie i w oryginalnych kolorach czytala sie jak ciemna plama.
    stops = [(0.0, (154, 106, 226)), (0.6, (104, 66, 168)), (1.0, (62, 38, 116))]
    for y in range(WYS):
        for x in range(SZER):
            t = (x / SZER + y / WYS) / 2          # kierunek 135°
            for i in range(len(stops) - 1):
                a, ka = stops[i]
                b, kb = stops[i + 1]
                if a <= t <= b:
                    u = (t - a) / (b - a) if b > a else 0
                    px[x, y] = tuple(round(ka[k] + (kb[k] - ka[k]) * u) for k in range(3))
                    break
    return im


def gwiazda(rys, cx, cy, r_zew, r_wew, kolor, obrot=-math.pi / 2):
    punkty = []
    for i in range(10):
        r = r_zew if i % 2 == 0 else r_wew
        a = obrot + i * math.pi / 10 * 2
        punkty.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    rys.polygon(punkty, fill=kolor)


def tekstura():
    im = gradient()
    rys = ImageDraw.Draw(im, "RGBA")
    cx, cy = SZER / 2, WYS / 2

    # Rogi: karta ma być zaokrąglona, ale BEZ kanału alfa (przezroczystość
    # potrafiła już w tej scenie narobić szkody). Więc wszystko poza
    # zaokrąglonym prostokątem zalewamy niemal czernią — na tle trawy czyta się
    # to jak ścięty róg, a nie jak dziura.
    maska = Image.new("L", (SZER, WYS), 0)
    ImageDraw.Draw(maska).rounded_rectangle([0, 0, SZER - 1, WYS - 1], radius=54, fill=255)
    ciemne = Image.new("RGB", (SZER, WYS), (38, 24, 70))
    im = Image.composite(im, ciemne, maska)
    rys = ImageDraw.Draw(im, "RGBA")

    margines = 26
    rys.rounded_rectangle([2, 2, SZER - 3, WYS - 3], radius=54, outline=(48, 30, 88), width=margines)
    rys.rounded_rectangle([margines, margines, SZER - margines - 1, WYS - margines - 1],
                          radius=34, outline=(255, 255, 255, 40), width=3)

    # Dwa pierścienie — jak na rewersie w grze (drugi kreskowany).
    r1 = SZER * 0.36
    rys.ellipse([cx - r1, cy - r1, cx + r1, cy + r1], outline=ZLOTO + (205,), width=5)
    r2 = SZER * 0.26
    for i in range(28):
        if i % 2:
            continue
        a0, a1 = i * (360 / 28), i * (360 / 28) + 360 / 28
        rys.arc([cx - r2, cy - r2, cx + r2, cy + r2], a0, a1, fill=ZLOTO + (165,), width=5)

    gwiazda(rys, cx, cy, SZER * 0.20, SZER * 0.082, ZLOTO + (255,))

    # Dwie iskierki w rogach — ten sam detal, co na kafelku w grze.
    for (sx, sy, sr) in [(SZER * 0.20, WYS * 0.16, 13), (SZER * 0.80, WYS * 0.85, 10)]:
        gwiazda(rys, sx, sy, sr, sr * 0.38, (255, 231, 176, 190))
    return im


# ── Geometria pudełka ────────────────────────────────────────────────────────
SZ, WY, GR = 0.68 / 2, 1.0 / 2, 0.05 / 2
# UV boków celuje w ciemny róg tekstury (piksel ~(4,4)) — jeden kolor, zero pasków.
BOK = [(0.008, 0.008)] * 4
PELNE = [(0.0, 1.0), (1.0, 1.0), (1.0, 0.0), (0.0, 0.0)]

sciany = [
    # (normalna, cztery wierzchołki przeciwnie do ruchu wskazówek, uv)
    ((0, 0, 1), [(-SZ, -WY, GR), (SZ, -WY, GR), (SZ, WY, GR), (-SZ, WY, GR)], PELNE),
    ((0, 0, -1), [(SZ, -WY, -GR), (-SZ, -WY, -GR), (-SZ, WY, -GR), (SZ, WY, -GR)], PELNE),
    ((1, 0, 0), [(SZ, -WY, GR), (SZ, -WY, -GR), (SZ, WY, -GR), (SZ, WY, GR)], BOK),
    ((-1, 0, 0), [(-SZ, -WY, -GR), (-SZ, -WY, GR), (-SZ, WY, GR), (-SZ, WY, -GR)], BOK),
    ((0, 1, 0), [(-SZ, WY, GR), (SZ, WY, GR), (SZ, WY, -GR), (-SZ, WY, -GR)], BOK),
    ((0, -1, 0), [(-SZ, -WY, -GR), (SZ, -WY, -GR), (SZ, -WY, GR), (-SZ, -WY, GR)], BOK),
]

pozycje, normalne, uv, indeksy = [], [], [], []
for n, wierzcholki, uvs in sciany:
    baza = len(pozycje)
    for w, t in zip(wierzcholki, uvs):
        pozycje.append(w)
        normalne.append(n)
        uv.append(t)
    indeksy += [baza, baza + 1, baza + 2, baza, baza + 2, baza + 3]

bin_poz = b"".join(struct.pack("<3f", *p) for p in pozycje)
bin_norm = b"".join(struct.pack("<3f", *n) for n in normalne)
bin_uv = b"".join(struct.pack("<2f", *t) for t in uv)
bin_idx = b"".join(struct.pack("<H", i) for i in indeksy)

import io as _io
buf_png = _io.BytesIO()
tekstura().save(buf_png, "PNG", optimize=True)
png = buf_png.getvalue()


def wyrownaj(b, do=4):
    brak = (-len(b)) % do
    return b + b"\x00" * brak


czesci = [bin_poz, bin_norm, bin_uv, bin_idx, png]
bin_all, offsety = b"", []
for c in czesci:
    offsety.append(len(bin_all))
    bin_all = wyrownaj(bin_all + c)

gltf = {
    "asset": {"version": "2.0", "generator": "EwolucJA karta-glb.py"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "Karta"}],
    "meshes": [{"name": "Karta", "primitives": [{
        "attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2},
        "indices": 3, "material": 0}]}],
    "materials": [{
        "name": "RewersKarty",
        "pbrMetallicRoughness": {
            "baseColorTexture": {"index": 0},
            "metallicFactor": 0.0,
            "roughnessFactor": 0.85,
        },
        "doubleSided": True,
    }],
    "textures": [{"sampler": 0, "source": 0}],
    "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071}],
    "images": [{"bufferView": 4, "mimeType": "image/png"}],
    "accessors": [
        {"bufferView": 0, "componentType": 5126, "count": len(pozycje), "type": "VEC3",
         "min": [-SZ, -WY, -GR], "max": [SZ, WY, GR]},
        {"bufferView": 1, "componentType": 5126, "count": len(normalne), "type": "VEC3"},
        {"bufferView": 2, "componentType": 5126, "count": len(uv), "type": "VEC2"},
        {"bufferView": 3, "componentType": 5123, "count": len(indeksy), "type": "SCALAR"},
    ],
    "bufferViews": [
        {"buffer": 0, "byteOffset": offsety[0], "byteLength": len(bin_poz), "target": 34962},
        {"buffer": 0, "byteOffset": offsety[1], "byteLength": len(bin_norm), "target": 34962},
        {"buffer": 0, "byteOffset": offsety[2], "byteLength": len(bin_uv), "target": 34962},
        {"buffer": 0, "byteOffset": offsety[3], "byteLength": len(bin_idx), "target": 34963},
        {"buffer": 0, "byteOffset": offsety[4], "byteLength": len(png)},
    ],
    "buffers": [{"byteLength": len(bin_all)}],
}

json_bin = wyrownaj(json.dumps(gltf, separators=(",", ":")).encode("utf-8"), 4)
if len(json_bin) % 4:
    json_bin += b" " * (4 - len(json_bin) % 4)

glb = b"glTF" + struct.pack("<II", 2, 12 + 8 + len(json_bin) + 8 + len(bin_all))
glb += struct.pack("<II", len(json_bin), 0x4E4F534A) + json_bin
glb += struct.pack("<II", len(bin_all), 0x004E4942) + bin_all

WYJSCIE.parent.mkdir(parents=True, exist_ok=True)
WYJSCIE.write_bytes(glb)
print(f"{WYJSCIE.name}: {len(glb)//1024} kB, wierzcholkow {len(pozycje)}, trojkatow {len(indeksy)//3}")
