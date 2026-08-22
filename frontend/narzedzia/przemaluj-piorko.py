#!/usr/bin/env python3
"""
przemaluj-piorko — zlota barwa piorka w scenie 3D.

PO CO OSOBNE NARZEDZIE. Piorko przychodzi z generatora (Tripo) z jedna
tekstura baseColor i to ONA decyduje o kolorze na mapie. Mnozenie koloru
materialu w `mapa.json` (`barwa`) rozjasnia teksture, ale nie potrafi zrobic
zlota z bezowej szarosci — a taka wlasnie byla: dominanty #a89078 / #a8a890,
czyli „za delikatny" kolor, o ktorym mowi zgloszenie.

CO ROBI. Czyta luminancje kazdego piksela tekstury i mapuje ja na rampe
zlota (cien → srodek → swiatlo). Rysunek, cieniowanie i krawedzie zostaja
nietkniete — zmienia sie wylacznie barwa. Przezroczystosc (jesli jest)
przechodzi bez zmian.

DLACZEGO PRZEBUDOWUJE CALY BIN. Nowy PNG prawie nigdy nie ma tej samej
dlugosci co stary, wiec podmiana „w miejscu" rozjechalaby offsety wszystkich
bufferView za nim. Skladamy bufor od nowa, z wyrownaniem do 4 bajtow, i
przepisujemy offsety — to jedyna wersja, ktora nie psuje siatki.

Uzycie:
    python narzedzia/przemaluj-piorko.py                # domyslnie lisc.glb
    python narzedzia/przemaluj-piorko.py --podglad out.png   # sama tekstura
"""
import argparse, io, json, os, struct, sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Potrzebny Pillow:  pip install pillow")

DOMYSLNY = os.path.join("public", "scena-3d", "assets", "lisc.glb")

# Rampa zlota: cien / srodek / swiatlo. Srodek celowo blisko #f0b060 —
# to dominanta ikony 2D (`assets/piorka/piorko-zlote.png`), zeby piorko
# na mapie i piorko w plakietce misji byly tym samym przedmiotem.
CIEN = (86, 46, 12)
SRODEK = (226, 152, 52)
SWIATLO = (255, 236, 178)


def rampa(t):
    """t ∈ <0,1> → kolor. Dwa odcinki: cien→srodek, srodek→swiatlo."""
    if t < 0.5:
        u = t / 0.5
        a, b = CIEN, SRODEK
    else:
        u = (t - 0.5) / 0.5
        a, b = SRODEK, SWIATLO
    return tuple(round(a[i] + (b[i] - a[i]) * u) for i in range(3))


def przemaluj(bajty, kontrast=1.0):
    """Zwraca (bajty w TYM SAMYM formacie co wejscie, obraz do podgladu).

    Format ma znaczenie: piorko przychodzi jako WEBP zadeklarowany w glTF
    przez `EXT_texture_webp`. Zapisanie w to miejsce PNG-a zostawiloby model
    z mimeType, ktory nie zgadza sie z zawartoscia — i tekstura nie wczytalaby
    sie w ogole."""
    im = Image.open(io.BytesIO(bajty))
    format_zrodla = (im.format or "PNG").upper()
    alfa = im.getchannel("A") if im.mode in ("RGBA", "LA") else None
    lut = [rampa(min(1.0, max(0.0, ((i / 255) - 0.5) * kontrast + 0.5))) for i in range(256)]
    szare = im.convert("L")
    out = Image.new("RGB", im.size)
    out.putdata([lut[p] for p in szare.getdata()])
    if alfa is not None:
        out = out.convert("RGBA")
        out.putalpha(alfa)
    bufor = io.BytesIO()
    if format_zrodla == "WEBP":
        out.save(bufor, format="WEBP", quality=92, method=6)
    else:
        out.save(bufor, format=format_zrodla, optimize=True)
    return bufor.getvalue(), out


def wczytaj_glb(sciezka):
    b = open(sciezka, "rb").read()
    dl_json = struct.unpack("<I", b[12:16])[0]
    j = json.loads(b[20:20 + dl_json])
    p = 20 + dl_json
    dl_bin = struct.unpack("<I", b[p:p + 4])[0]
    return j, b[p + 8:p + 8 + dl_bin]


def zapisz_glb(sciezka, j, binarny):
    js = json.dumps(j, separators=(",", ":")).encode("utf-8")
    js += b" " * ((4 - len(js) % 4) % 4)
    binarny += b"\x00" * ((4 - len(binarny) % 4) % 4)
    calosc = (
        struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(binarny))
        + struct.pack("<II", len(js), 0x4E4F534A) + js
        + struct.pack("<II", len(binarny), 0x004E4942) + binarny
    )
    open(sciezka, "wb").write(calosc)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plik", default=DOMYSLNY)
    ap.add_argument("--kontrast", type=float, default=1.15)
    ap.add_argument("--podglad", default=None, help="zapisz sama teksture do PNG i nic nie zmieniaj")
    args = ap.parse_args()

    j, binarny = wczytaj_glb(args.plik)
    if not j.get("images"):
        sys.exit("Model nie ma tekstury — nie ma czego malowac.")
    idx = j["images"][0]["bufferView"]
    bv = j["bufferViews"][idx]
    start = bv.get("byteOffset", 0)
    stary = binarny[start:start + bv["byteLength"]]

    nowy, obraz = przemaluj(stary, args.kontrast)

    if args.podglad:
        obraz.save(args.podglad)
        print(f"podglad → {args.podglad}")
        return

    kopia = args.plik + ".bak-przed-zlotem"
    if not os.path.exists(kopia):
        open(kopia, "wb").write(open(args.plik, "rb").read())

    # Bufor od nowa: kazdy bufferView po kolei, wyrownany do 4 bajtow.
    kawalki, offset = [], 0
    for i, w in enumerate(j["bufferViews"]):
        dane = nowy if i == idx else binarny[w.get("byteOffset", 0):w.get("byteOffset", 0) + w["byteLength"]]
        w["byteOffset"] = offset
        w["byteLength"] = len(dane)
        kawalki.append(dane)
        pad = (4 - len(dane) % 4) % 4
        if pad:
            kawalki.append(b"\x00" * pad)
        offset += len(dane) + pad
    nowy_bin = b"".join(kawalki)
    j["buffers"][0]["byteLength"] = len(nowy_bin)

    zapisz_glb(args.plik, j, nowy_bin)
    print(f"przemalowane: {args.plik}  (tekstura {len(stary)} → {len(nowy)} B, kopia: {kopia})")


if __name__ == "__main__":
    main()
