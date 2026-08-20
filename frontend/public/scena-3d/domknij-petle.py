#!/usr/bin/env python3
"""
domknij-petle.py — zszywa pętlę animacji w pliku .glb, bez wracania do Blendera.

Po co: klip, którego pierwsza i ostatnia poza się różnią, przy zapętleniu szarpie.
W `postac.glb` bieg miał 304,5° rozjazdu (najmocniej lewe przedramię, 52,7°),
a w źródłowym `adventurer.glb` ten sam bieg miał 133,2° — czyli pętla była
złamana już u źródła, a wypiekanie w miejscu ją pogłębiło.

Jak: ostatnie N klatek każdego kanału jest wmiksowywanych w pozę startową —
rotacje przez slerp z korektą półsfery, translacje liniowo. Ostatnia klatka staje
się dokładnie pozą pierwszą, wcześniejsze dochodzą do niej płynnie. Kosztuje to
N/24 sekundy końcówki klipu.

Użycie:
    python3 domknij-petle.py postac.glb NlaTrack 6
    python3 domknij-petle.py <plik.glb> <nazwa_klipu> [okno_klatek]

Skrypt zapisuje kopię `<plik>.oryginal`, jeśli jeszcze jej nie ma.
"""

import json
import math
import os
import struct
import sys


def wczytaj(sciezka):
    raw = open(sciezka, "rb").read()
    if raw[:4] != b"glTF":
        raise SystemExit("to nie jest plik GLB")
    off, js, bin_off, bin_len = 12, None, None, None
    while off < len(raw):
        ln, ty = struct.unpack_from("<II", raw, off)
        if ty == 0x4E4F534A:
            js = json.loads(raw[off + 8:off + 8 + ln].decode("utf-8"))
        elif ty == 0x004E4942:
            bin_off, bin_len = off + 8, ln
        off += 8 + ln
    return js, bytearray(raw[bin_off:bin_off + bin_len])


def zapisz(sciezka, js, buf):
    out = bytearray(b"glTF" + struct.pack("<II", 2, 0))
    jb = json.dumps(js, separators=(",", ":")).encode("utf-8")
    jb += b" " * ((4 - len(jb) % 4) % 4)
    out += struct.pack("<II", len(jb), 0x4E4F534A) + jb
    bb = bytes(buf) + b"\x00" * ((4 - len(buf) % 4) % 4)
    out += struct.pack("<II", len(bb), 0x004E4942) + bb
    struct.pack_into("<I", out, 8, len(out))
    open(sciezka, "wb").write(bytes(out))
    return len(out)


def slerp(a, b, w):
    b = list(b)
    dot = sum(a[c] * b[c] for c in range(4))
    if dot < 0:                      # ta sama rotacja, przeciwna półsfera
        b = [-x for x in b]
        dot = -dot
    dot = max(-1.0, min(1.0, dot))
    if dot > 0.9995:                 # praktycznie ta sama poza — lerp wystarczy
        out = [a[c] * (1 - w) + b[c] * w for c in range(4)]
    else:
        th = math.acos(dot)
        st = math.sin(th)
        s1, s2 = math.sin((1 - w) * th) / st, math.sin(w * th) / st
        out = [a[c] * s1 + b[c] * s2 for c in range(4)]
    n = math.sqrt(sum(x * x for x in out)) or 1.0
    return [x / n for x in out]


def rozjazd(js, buf, nazwa_klipu):
    """Suma różnic rotacji między pierwszą a ostatnią klatką — miara jakości pętli."""
    NUM = {"SCALAR": 1, "VEC3": 3, "VEC4": 4}
    anim = next(a for a in js["animations"] if a.get("name") == nazwa_klipu)
    N = max(js["accessors"][s["input"]]["count"] for s in anim["samplers"])
    suma, najgorsza = 0.0, (0.0, "")
    for ch in anim["channels"]:
        if ch["target"]["path"] != "rotation":
            continue
        s = anim["samplers"][ch["sampler"]]
        if js["accessors"][s["input"]]["count"] != N:
            continue
        a = js["accessors"][s["output"]]
        bv = js["bufferViews"][a["bufferView"]]
        o = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        n = NUM[a["type"]]
        v = struct.unpack_from("<" + "f" * (n * a["count"]), buf, o)
        q0, q1 = v[0:4], v[(N - 1) * 4:N * 4]
        dot = abs(sum(q0[k] * q1[k] for k in range(4)))
        e = math.degrees(2 * math.acos(min(1.0, dot)))
        suma += e
        nazwa = js["nodes"][ch["target"]["node"]].get("name", "?")
        if e > najgorsza[0]:
            najgorsza = (e, nazwa)
    return suma, najgorsza


def domknij(sciezka, nazwa_klipu, okno=6):
    js, buf = wczytaj(sciezka)
    if not os.path.exists(sciezka + ".oryginal"):
        open(sciezka + ".oryginal", "wb").write(open(sciezka, "rb").read())

    przed = rozjazd(js, buf, nazwa_klipu)
    anim = next(a for a in js["animations"] if a.get("name") == nazwa_klipu)
    N = max(js["accessors"][s["input"]]["count"] for s in anim["samplers"])
    NUM = {"SCALAR": 1, "VEC3": 3, "VEC4": 4}
    zmienione = 0

    for ch in anim["channels"]:
        sciezka_kanalu = ch["target"]["path"]
        if sciezka_kanalu not in ("rotation", "translation"):
            continue
        s = anim["samplers"][ch["sampler"]]
        if js["accessors"][s["input"]]["count"] != N:
            continue
        a = js["accessors"][s["output"]]
        bv = js["bufferViews"][a["bufferView"]]
        o = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        n, cnt = NUM[a["type"]], a["count"]
        vals = list(struct.unpack_from("<" + "f" * (n * cnt), buf, o))
        poza0 = vals[0:n]
        for k in range(okno):
            i = cnt - 1 - k
            w = (okno - k) / okno     # ostatnia klatka = dokładnie poza startowa
            seg = vals[i * n:(i + 1) * n]
            if sciezka_kanalu == "rotation":
                vals[i * n:(i + 1) * n] = slerp(seg, poza0, w)
            else:
                vals[i * n:(i + 1) * n] = [seg[c] * (1 - w) + poza0[c] * w for c in range(n)]
        struct.pack_into("<" + "f" * (n * cnt), buf, o, *vals)
        zmienione += 1

    po = rozjazd(js, buf, nazwa_klipu)
    rozmiar = zapisz(sciezka, js, buf)
    print(f"klip:        {nazwa_klipu}")
    print(f"kanalow:     {zmienione}, okno: {okno} klatek (~{okno / 24:.2f} s przy 24 fps)")
    print(f"rozjazd:     {przed[0]:.1f}° -> {po[0]:.1f}°  (najgorsza kosc po: {po[1][1]} {po[1][0]:.2f}°)")
    print(f"zapisano:    {sciezka} ({rozmiar} B), kopia: {sciezka}.oryginal")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    domknij(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 6)
