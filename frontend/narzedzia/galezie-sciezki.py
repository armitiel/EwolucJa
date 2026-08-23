#!/usr/bin/env python3
"""
galezie-sciezki — odnogi ścieżki rysowane na trawie w scenie 3D.

PO CO. Scena zna dokładnie JEDNĄ ścieżkę: tablicę punktów w `mapa.json`,
z której maluje wstęgę na teksturze ziemi i po której chodzi bohater. Edytor
mapy potrafi teraz dokładać do niej gałęzie (`mapa.galezie`), ale bundle
sceny jest zminifikowany i nic o nich nie wie — bez tej łatki odnogi widać
tylko na planie w edytorze, a w grze trawa zostaje pusta.

CO WSTRZYKUJE. Zaraz po namalowaniu głównej ścieżki (obrys → wypełnienie →
płytki) ten sam zestaw kroków powtarza się dla każdej gałęzi z
`globalThis.__SCENA3D_MAPA.galezie[].sciezka` — tej samej wypalonej łamanej,
którą edytor zapisuje do pliku. `szerokosc` mnoży grubość wstęgi i płytek,
więc odnoga może być węższą dróżką niż trakt główny.

CZEGO NIE RUSZA. Trasa bohatera, latarnia i obrót mostu czytają wyłącznie
`sciezka`. Gałąź jest rysunkiem — nie zmienia chodzenia ani kolizji.

Uruchamiaj z katalogu `frontend/`:
    python narzedzia/galezie-sciezki.py
Łatka jest IDEMPOTENTNA: drugie uruchomienie nic nie zrobi.
Po niej podbij `WERSJA_SCENY` w `src/components/Scena3D.jsx` (cache-busting).
"""
import os, re, sys

PLIKI = ["public/scena-3d/scena3d.js", "public/scena-3d/scena3d.esm.js"]

# Kotwica: pierwsza instrukcja PO pętli układającej płytki głównej ścieżki.
KOTWICA = "t.globalAlpha=1;for(let m=0;m<46;m++){"

ZNACZNIK = "__SCENA3D_MAPA?.galezie"

# `Me` = wektor 2D silnika, `$s.lerp` = interpolacja, `i()/r()` = świat → piksel
# tekstury, `n` = pikseli na metr, `mn` = paleta, `c()` = losowanie z ziarna.
# Wszystkie są w zasięgu w miejscu wstrzyknięcia — dlatego łatka trafia
# dokładnie tutaj, a nie „gdzieś w pobliżu".
LATKA = (
    "(()=>{var G=globalThis.__SCENA3D_MAPA?.galezie;"
    "if(!Array.isArray(G))return;"
    "for(var gi=0;gi<G.length;gi++){"
    "var g=G[gi],P=g&&(g.sciezka||g.punkty);"
    "if(!P||P.length<2)continue;"
    "var sz=g.szerokosc||.75,u2=[];"
    "for(var a=0;a<P.length-1;a++)for(var b=0;b<1;b+=.08)"
    "u2.push(new Me($s.lerp(P[a][0],P[a+1][0],b),$s.lerp(P[a][1],P[a+1][1],b)));"
    "u2.push(new Me(P[P.length-1][0],P[P.length-1][1]));"
    "t.strokeStyle=mn.pathEdge,t.lineWidth=1.9*n*sz,t.lineJoin=\"round\",t.lineCap=\"round\","
    "t.beginPath(),u2.forEach((q,k)=>k?t.lineTo(i(q.x),r(q.y)):t.moveTo(i(q.x),r(q.y))),t.stroke(),"
    "t.strokeStyle=mn.path,t.lineWidth=1.55*n*sz,t.stroke();"
    "for(var m2=2;m2<u2.length-2;m2+=3){"
    "var q2=u2[m2],d2=u2[m2+1].clone().sub(u2[m2-1]).normalize();"
    "t.save(),t.translate(i(q2.x)+(c()-.5)*6,r(q2.y)+(c()-.5)*6),t.rotate(Math.atan2(d2.y,d2.x)),"
    "t.fillStyle=c()>.4?mn.pathSlab:\"#cfbd96\",t.globalAlpha=.85;"
    "var S2=(.55+c()*.25)*n*sz,E2=(.42+c()*.2)*n*sz;"
    "t.beginPath(),t.roundRect(-S2/2,-E2/2,S2,E2,5),t.fill(),t.restore()}}"
    "t.globalAlpha=1})();"
)


def main():
    zmienione = []
    for sciezka in PLIKI:
        if not os.path.exists(sciezka):
            sys.exit(f"Nie ma pliku {sciezka} — uruchom z katalogu frontend/")
        tresc = open(sciezka, encoding="utf-8").read()
        if ZNACZNIK in tresc:
            print(f"pomijam (już załatane): {sciezka}")
            continue
        if tresc.count(KOTWICA) != 1:
            sys.exit(f"{sciezka}: kotwica występuje {tresc.count(KOTWICA)}× — bundle się zmienił, "
                     "sprawdź kod malowania ścieżki przed dalszym łataniem.")
        kopia = sciezka + ".bak-przed-galeziami"
        if not os.path.exists(kopia):
            open(kopia, "w", encoding="utf-8").write(tresc)
        open(sciezka, "w", encoding="utf-8").write(tresc.replace(KOTWICA, LATKA + KOTWICA))
        zmienione.append(sciezka)
        print(f"załatane: {sciezka}  (kopia: {kopia})")

    if zmienione:
        print("\nPamiętaj o podbiciu WERSJA_SCENY w src/components/Scena3D.jsx")


if __name__ == "__main__":
    main()
