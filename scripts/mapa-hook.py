"""
mapa-hook.py — otwiera zminifikowany bundle sceny 3D na dane z `mapa.json`.

Dlaczego tak: modul `public/scena-3d/scena3d.js` jest DOSTARCZONY JAKO BUNDLE,
zrodel nie ma w repo. Cala geometria mapy — sciezka, rzeka, most, brama,
drzewa, glazy, budynki i znaki — siedzi w nim w literalach. Zeby dalo sie ja
edytowac z zewnatrz (a wiec zeby edytor mapy mial w ogole sens), kazdy z tych
literalow opakowujemy w odczyt z `globalThis.__SCENA3D_MAPA` z ORYGINALEM JAKO
WARTOSCIA DOMYSLNA. Bez pliku mapy scena wyglada dokladnie tak jak dzis.

Patch idzie po TRESCI literalow, nie po nazwach zmiennych: `scena3d.js`
i `scena3d.esm.js` to ten sam kod z innym minifikatorem nazw, wiec kazdy wzorzec
lapie nazwy w grupach i wstawia je z powrotem.

Uruchomienie:  python scripts/mapa-hook.py [--cofnij]
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCENA = ROOT / "frontend" / "public" / "scena-3d"
PLIKI = ["scena3d.js", "scena3d.esm.js"]
KOPIA = ".bak-przed-mapa"

M = "globalThis.__SCENA3D_MAPA"

RZEKA_FALLBACK = ('[{od:[-12,3.5],kontrola:[-6,5.2],do:[-3.2,8.6],kroki:12},'
                  '{od:[-3.2,8.6],kontrola:[-2.2,10.6],do:[-4.5,15.5],kroki:8}]')


def nawiasy(s, i, otw="[", zam="]"):
    """Zwraca indeks ZA domykajacym nawiasem literalu zaczynajacego sie na i."""
    assert s[i] == otw, f"oczekiwano {otw} na {i}, jest {s[i]!r}"
    glebokosc, j, w_stringu, znak = 0, i, None, None
    while j < len(s):
        c = s[j]
        if w_stringu:
            if c == "\\":
                j += 2
                continue
            if c == w_stringu:
                w_stringu = None
        elif c in "\"'`":
            w_stringu = c
        elif c == otw:
            glebokosc += 1
        elif c == zam:
            glebokosc -= 1
            if glebokosc == 0:
                return j + 1
        j += 1
    raise SystemExit("nie znalazlem konca literalu")


def jedno(s, wzor, opis):
    trafienia = list(re.finditer(wzor, s))
    if len(trafienia) != 1:
        raise SystemExit(f"[{opis}] oczekiwano 1 trafienia, jest {len(trafienia)}")
    return trafienia[0]


def opakuj_tablice(s, kotwica, opis, buduj):
    """Znajduje literal tablicowy zaczynajacy sie od `kotwica` i podmienia go
    na wynik `buduj(oryginal)`."""
    i = s.find(kotwica)
    if i < 0 or s.find(kotwica, i + 1) >= 0:
        raise SystemExit(f"[{opis}] kotwica niejednoznaczna")
    while s[i] != "[":
        i -= 1
    koniec = nawiasy(s, i)
    orig = s[i:koniec]
    return s[:i] + buduj(orig) + s[koniec:]


def patch(s, nazwa_pliku):
    # ── 1. SCIEZKA (9 punktow Vector3) ───────────────────────────────────────
    m = jedno(s, r"=\[new ([A-Za-z_$][\w$]*)\(-6\.2,0,8\.6\)", "sciezka")
    V3 = m.group(1)
    i = m.end(0) - len(f"new {V3}(-6.2,0,8.6)") - 1     # indeks '['
    koniec = nawiasy(s, i)
    orig = s[i:koniec]
    s = s[:i] + (f"({M}?.sciezka?{M}.sciezka.map(p=>new {V3}(p[0],0,p[1])):{orig})") + s[koniec:]

    # ── 2. LATARNIA + punkt sciezki + PROMIEN SWIATA ─────────────────────────
    m = jedno(s, r"([\w$]+)=new ([\w$]+)\(2\.5,0,-1\.2\),([\w$]+)=6,([\w$]+)=12\.5", "latarnia")
    ln, V3b, pf, mf = m.groups()
    s = (s[:m.start()]
         + f"{ln}=new {V3b}({M}?.latarnia?.pos?.[0]??2.5,0,{M}?.latarnia?.pos?.[1]??-1.2),"
           f"{pf}=({M}?.latarnia?.punktSciezki??6),"
           f"{mf}=({M}?.swiat?.promien??12.5)"
         + s[m.end():])

    # ── 3. RZEKA: szerokosc + polilinia z krzywych Beziera ───────────────────
    m = jedno(s, r"([\w$]+)=1\.5,([\w$]+)=\(\(\)=>\{", "rzeka")
    gf, mc = m.group(1), m.group(2)
    start_iife = m.end() - len("(()=>{")
    koniec = nawiasy(s, start_iife, "(", ")")          # domyka "(()=>{...})"
    while s[koniec] != ")":                            # dojedz za wywolanie "()"
        koniec += 1
    koniec += 1
    orig = s[start_iife:koniec]
    V2 = re.search(r"new ([\w$]+)\(n,i\)", orig)
    V2 = V2.group(1) if V2 else re.search(r"new ([\w$]+)\(", orig).group(1)
    nowa = (f"(()=>{{let K={M}?.rzeka?.krzywe||{RZEKA_FALLBACK},"
            f"B=(a,b,c,t)=>new {V2}((1-t)*(1-t)*a[0]+2*(1-t)*t*b[0]+t*t*c[0],"
            f"(1-t)*(1-t)*a[1]+2*(1-t)*t*b[1]+t*t*c[1]),o=[];"
            f"return K.forEach((k,ki)=>{{let n=k.kroki||12;"
            f"for(let i=(ki?1:0);i<=n;i++)o.push(B(k.od,k.kontrola,k.do,i/n))}}),o}})()")
    s = s[:m.start()] + f"{gf}=({M}?.rzeka?.szerokosc??1.5),{mc}={nowa}" + s[koniec:]

    # ── 4. ROZMIAR TERENU ────────────────────────────────────────────────────
    m = jedno(s, r"([\w$]+)=36;function", "teren")
    s = s[:m.start()] + f"{m.group(1)}=({M}?.swiat?.teren??36);function" + s[m.end():]

    # ── 5. MOST ──────────────────────────────────────────────────────────────
    m = jedno(s, r"\.position\.set\(-4\.7,0,6\.9\)", "most")
    s = (s[:m.start()]
         + f".position.set({M}?.most?.pos?.[0]??-4.7,0,{M}?.most?.pos?.[1]??6.9)"
         + s[m.end():])

    # ── 6. BRAMA (pozycja + dwa slupy jako blokery) ──────────────────────────
    BX, BZ = f"({M}?.brama?.pos?.[0]??0)", f"({M}?.brama?.pos?.[1]??-7.2)"
    m = jedno(s, r"\.position\.set\(0,0,-7\.2\)", "brama")
    s = s[:m.start()] + f".position.set({BX},0,{BZ})" + s[m.end():]
    m = jedno(s, r"\{x:-1\.3,z:-7\.2,r:\.55\},\{x:1\.3,z:-7\.2,r:\.55\}", "brama-blokery")
    s = (s[:m.start()]
         + f"{{x:{BX}-1.3,z:{BZ},r:.55}},{{x:{BX}+1.3,z:{BZ},r:.55}}"
         + s[m.end():])

    # ── 7. DRZEWA ────────────────────────────────────────────────────────────
    m = jedno(s, r"\[\[([\w$]+)\(1\.3\),-3\.6,1\.3\],", "drzewa")
    SOSNA = m.group(1)
    i = m.start()
    koniec = nawiasy(s, i)
    orig = s[i:koniec]
    fabryki = [f for f in re.findall(r"\[([\w$]+)\(", orig) if f != SOSNA]
    LISCIASTE = fabryki[0] if fabryki else SOSNA
    s = (s[:i]
         + (f"({M}?.drzewa?{M}.drzewa.map(d=>[(d.typ===\"lisciaste\"?{LISCIASTE}:{SOSNA})"
            f"(d.skala??1),d.pos[0],d.pos[1],d.obrot]):{orig})")
         + s[koniec:])

    # ── 8. GLAZY ─────────────────────────────────────────────────────────────
    s = opakuj_tablice(
        s, "[[-1.8,6.6,1.1],", "glazy",
        lambda orig: f"({M}?.glazy?{M}.glazy.map(g=>[g.pos[0],g.pos[1],g.skala??1,g.obrot]):{orig})")


    # ── 8b. OBROT DRZEW I GLAZOW ─────────────────────────────────────────────
    # Silnik stawial drzewo bez obrotu, a glaz krecil wzorem z jego X. Teraz
    # czwarty element krotki (jesli jest) wygrywa — dzieki temu edytor moze
    # obracac kazda bryle, a przy braku danych wszystko wyglada jak wczesniej.
    m = jedno(s, (r"for\(let\[([\w$]+),([\w$]+),([\w$]+)\]of ([\w$]+)\)\{\1\.position\.set\(\2,0,\3\),"
                  r"([\w$]+)\.add\(\1\),([\w$]+)\.push\(\{x:\2,z:\3,r:\.75\}\)"), "drzewa-obrot")
    a1, a2, a3, a4, a5, a6 = m.groups()
    s = (s[:m.start()]
         + (f"for(let[{a1},{a2},{a3},_ro]of {a4}){{{a1}.position.set({a2},0,{a3}),"
            f"_ro!=null&&({a1}.rotation.y=_ro),{a5}.add({a1}),{a6}.push({{x:{a2},z:{a3},r:.75}})")
         + s[m.end():])

    m = jedno(s, (r"for\(let\[([\w$]+),([\w$]+),([\w$]+)\]of ([\w$]+)\)\{let ([\w$]+)=([\w$]+)\(\3\);"
                  r"\5\.position\.set\(\1,0,\2\),\5\.rotation\.y=\1\*2\.1,"), "glazy-obrot")
    b1, b2, b3, b4, b5, b6 = m.groups()
    s = (s[:m.start()]
         + (f"for(let[{b1},{b2},{b3},_ro]of {b4}){{let {b5}={b6}({b3});"
            f"{b5}.position.set({b1},0,{b2}),{b5}.rotation.y=(_ro!=null?_ro:{b1}*2.1),")
         + s[m.end():])

    # ── 9. BUDYNKI ───────────────────────────────────────────────────────────
    s = opakuj_tablice(s, '[{file:"hut2",pos:[-10.6,-4.4]', "budynki",
                       lambda orig: f"({M}?.budynki??{orig})")

    # ── 10. ZNAKI (markery minigier) ─────────────────────────────────────────
    s = opakuj_tablice(s, '[{id:"czarodziej",file:"wizard"', "znaki",
                       lambda orig: f"({M}?.znaki??{orig})")

    # ── 11. RZEKA NA TEKSTURZE TERENU (glowna wstega) ────────────────────────
    m = jedno(s, (r"([\w$]+)\.beginPath\(\),\1\.moveTo\(([\w$]+)\(-12\),([\w$]+)\(3\.5\)\),"
                  r"\1\.quadraticCurveTo\(\2\(-6\),\3\(5\.2\),\2\(-3\.2\),\3\(8\.6\)\),"
                  r"\1\.quadraticCurveTo\(\2\(-2\.2\),\3\(10\.6\),\2\(-4\.5\),\3\(15\.5\)\),"
                  r"\1\.stroke\(\)"), "rzeka-tekstura")
    T, I, R = m.groups()
    s = (s[:m.start()]
         + (f"(()=>{{let K={M}?.rzeka?.krzywe||{RZEKA_FALLBACK};"
            f"{T}.beginPath();{T}.moveTo({I}(K[0].od[0]),{R}(K[0].od[1]));"
            f"for(let k of K){T}.quadraticCurveTo({I}(k.kontrola[0]),{R}(k.kontrola[1]),"
            f"{I}(k.do[0]),{R}(k.do[1]));{T}.stroke()}})()")
         + s[m.end():])

    # ── 12. POLYSKI NA WODZIE (trzy przesuniete kopie wstegi) ────────────────
    m = jedno(s, (r"for\(let ([\w$]+) of\[-\.7,\.2,\.8\]\)([\w$]+)\.beginPath\(\),"
                  r"\2\.moveTo\(([\w$]+)\(-12\),([\w$]+)\(3\.5\+\1\)\),"
                  r"\2\.quadraticCurveTo\(\3\(-6\),\4\(5\.2\+\1\),\3\(-3\.4\+\1\*\.4\),\4\(8\.4\+\1\)\),"
                  r"\2\.stroke\(\)"), "rzeka-polyski")
    P, T2, I2, R2 = m.groups()
    s = (s[:m.start()]
         + (f"for(let {P} of[-.7,.2,.8]){{let K={M}?.rzeka?.krzywe||{RZEKA_FALLBACK};"
            f"{T2}.beginPath();{T2}.moveTo({I2}(K[0].od[0]),{R2}(K[0].od[1]+{P}));"
            f"for(let k of K){T2}.quadraticCurveTo({I2}(k.kontrola[0]),{R2}(k.kontrola[1]+{P}),"
            f"{I2}(k.do[0]),{R2}(k.do[1]+{P}));{T2}.stroke()}}")
         + s[m.end():])

    return s


def main():
    cofnij = "--cofnij" in sys.argv
    for nazwa in PLIKI:
        plik = SCENA / nazwa
        kopia = SCENA / (nazwa + KOPIA)
        if cofnij:
            if kopia.exists():
                shutil.copyfile(kopia, plik)
                print(f"{nazwa}: przywrocone z kopii")
            else:
                print(f"{nazwa}: brak kopii, pomijam")
            continue

        tresc = plik.read_text("utf-8")
        if "__SCENA3D_MAPA" in tresc:
            print(f"{nazwa}: juz podpiete, pomijam (--cofnij zdejmuje patch)")
            continue
        if not kopia.exists():
            shutil.copyfile(plik, kopia)
        nowa = patch(tresc, nazwa)
        plik.write_text(nowa, "utf-8")
        print(f"{nazwa}: podpiete (+{len(nowa)-len(tresc)} znakow)")


if __name__ == "__main__":
    main()
