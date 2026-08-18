"""
mapa-eksport.py — wyciaga AKTUALNA mape z bundla do `mapa.json`.

Zrodlem prawdy sa literaly w `scena3d.js.bak-przed-mapa` (kopia sprzed patcha
`mapa-hook.py`). Dzieki temu plik startowy mapy to dokladnie to, co dzis widzi
dziecko — edytor zaczyna od stanu gry, nie od pustego pola.

Tablice obiektow (budynki, znaki) sa zbyt duze, zeby przepisywac je recznie,
wiec czytamy je przez `node`: to zwykle literaly JS, wiec `JSON.stringify`
zamienia je na JSON bez zgadywania.
"""
import json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCENA = ROOT / "frontend" / "public" / "scena-3d"
ZRODLO = SCENA / "scena3d.js.bak-przed-mapa"
if not ZRODLO.exists():
    ZRODLO = SCENA / "scena3d.js"
WYJSCIE = SCENA / "mapa.json"
TMP = ROOT / "tmp"
TMP.mkdir(exist_ok=True)

s = ZRODLO.read_text("utf-8")


def literal(kotwica, poziomy=1):
    """poziomy=2 gdy kotwica siedzi w PODtablicy (np. drzewa: [[fabryka(...),x,z],...])."""
    i = s.find(kotwica)
    if i < 0:
        sys.exit(f"nie znalazlem: {kotwica}")
    while s[i] != "[":
        i -= 1
    for _ in range(poziomy - 1):
        if i > 0 and s[i - 1] == "[":
            i -= 1
    glebokosc, j, str_znak = 0, i, None
    while j < len(s):
        c = s[j]
        if str_znak:
            if c == "\\":
                j += 2
                continue
            if c == str_znak:
                str_znak = None
        elif c in "\"'`":
            str_znak = c
        elif c == "[":
            glebokosc += 1
        elif c == "]":
            glebokosc -= 1
            if glebokosc == 0:
                return s[i:j + 1]
        j += 1
    sys.exit("nie znalazlem konca literalu")


def przez_node(kod_literalu):
    plik = TMP / "_literal.mjs"
    plik.write_text("console.log(JSON.stringify(" + kod_literalu + "))", "utf-8")
    out = subprocess.run(["node", str(plik)], capture_output=True, text=True, shell=False)
    if out.returncode != 0:
        sys.exit("node: " + out.stderr[:400])
    return json.loads(out.stdout)


budynki = przez_node(literal('[{file:"hut2",pos:[-10.6,-4.4]'))
znaki = przez_node(literal('[{id:"czarodziej",file:"wizard"'))

# Sciezka: [new C(x,0,z), ...] -> [[x,z], ...]
sciezka_txt = literal("(-6.2,0,8.6)")
sciezka = [[float(x), float(z)] for x, z in re.findall(r"\(([-\d.]+),0,([-\d.]+)\)", sciezka_txt)]

# Drzewa: [[fabryka(skala), x, z], ...] — fabryka sosny wystepuje 3x, lisciasta 1x
drzewa_txt = literal("(1.3),-3.6,1.3],", poziomy=2)
pary = re.findall(r"\[([\w$]+)\(([\d.]+)\),([-\d.]+),([-\d.]+)\]", drzewa_txt)
fabryki = [p[0] for p in pary]
sosna = max(set(fabryki), key=fabryki.count)
drzewa = [{"typ": "sosna" if f == sosna else "lisciaste",
           "pos": [float(x), float(z)], "skala": float(sk)} for f, sk, x, z in pary]

glazy_txt = literal("[[-1.8,6.6,1.1],")
glazy = [{"pos": [float(a), float(b)], "skala": float(c)}
         for a, b, c in re.findall(r"\[([-\d.]+),([-\d.]+),([-\d.]+)\]", glazy_txt)]

mapa = {
    "wersja": 1,
    "opis": "Mapa swiata EwolucJA. Edytowana w /scena-3d/edytor.html.",
    "swiat": {"promien": 12.5, "teren": 36},
    "sciezka": sciezka,
    "latarnia": {"pos": [2.5, -1.2], "punktSciezki": 6},
    "rzeka": {
        "szerokosc": 1.5,
        "krzywe": [
            {"od": [-12, 3.5], "kontrola": [-6, 5.2], "do": [-3.2, 8.6], "kroki": 12},
            {"od": [-3.2, 8.6], "kontrola": [-2.2, 10.6], "do": [-4.5, 15.5], "kroki": 8},
        ],
    },
    "most": {"pos": [-4.7, 6.9]},
    "brama": {"pos": [0, -7.2]},
    "drzewa": drzewa,
    "glazy": glazy,
    "budynki": budynki,
    "znaki": znaki,
}

WYJSCIE.write_text(json.dumps(mapa, ensure_ascii=False, indent=2), "utf-8")
print(f"{WYJSCIE.name}: sciezka {len(sciezka)} pkt, drzewa {len(drzewa)}, "
      f"glazy {len(glazy)}, budynki {len(budynki)}, znaki {len(znaki)}")
