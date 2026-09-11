#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
rzeka-nurt.py — animowany nurt rzeki jako osobna wstega nad wypalonym korytem.

DLACZEGO TO W OGOLE TRZEBA DOKLADAC. W scenie NIE MA obiektu rzeki. Krzywe
z `mapa.json` ida tylko w dwa miejsca: do `canWalk()` (lisek nie wchodzi do
wody poza mostem) i do funkcji terenu, ktora maluje je na plotnie 1024x1024
razem z trawa i sciezka. Rzeka to zatem WYPALONE PIKSELE — nie ma siatki,
nie ma materialu, nie ma czego przewijac. Przemalowywanie plotna co klatke
i wysylanie go na GPU zabiloby telefon.

CO ROBI TA LATKA. Buduje wstege trojkatow z TYCH SAMYCH punktow, ktorych
uzywa kolizja, kladzie ja ~1 cm nad ziemia i przewija po niej powtarzalna
teksture smug. Wypalona rzeka zostaje pod spodem jako koryto — daje glebie,
ktorej sama wstega nie ma.

DWIE WARSTWY, nie jedna: druga przewija sie wolniej i faluje w bok. Roznica
predkosci robi wrazenie glebi bez ani jednego shadera.

SKRYPT JEST POWTARZALNY. Blok miedzy znacznikami jest przy kazdym uruchomieniu
podmieniany, wiec tym samym poleceniem stroi sie predkosc i krycie:

    python narzedzia/rzeka-nurt.py public/scena-3d/scena3d.js public/scena-3d/scena3d.esm.js
    python narzedzia/rzeka-nurt.py --predkosc 0.18 --krycie 0.56 public/scena-3d/*.js

NAZWY ZMINIFIKOWANE ROZNIA SIE MIEDZY PLIKAMI i skrypt NIE MOZE ich zakladac:
w scena3d.js punkty rzeki to `Mc`, a szerokosc `gf`; w scena3d.esm.js to
`Ml` i `pf`. Co gorsza `pf` ISTNIEJE takze w scena3d.js — znaczy tam
`latarnia.punktSciezki`. Skrypt z zakodowana nazwa podpialby wiec rzeke pod
numer punktu sciezki latarni i nic by nie krzyknal. Dlatego kazda nazwa jest
wylskiwana z literalu `globalThis.__SCENA3D_MAPA?.rzeka?...` osobno w kazdym
pliku.

PO URUCHOMIENIU podbij WERSJA_SCENY w frontend/src/components/Scena3D.jsx.
Pliki w public/ nie maja hasha w nazwie — bez tego przegladarka poda scene
z cache.

CZEGO NIE DA SIE SPRAWDZIC BEZGLOWO: samego plyniecia. Bezglowy Chromium
zatrzymuje petle renderowania po kilkunastu klatkach, wiec zegar nie idzie.
Bezglowo potwierdzisz tylko, ze wstega powstala i stoi we wlasciwym miejscu.
"""

import argparse
import re
import sys

POCZATEK = "/*NURT-RZEKI-START*/"
KONIEC = "/*NURT-RZEKI-KONIEC*/"


class Przerwij(Exception):
    pass


def jedyne(tekst, wzorzec, opis, plik):
    """Zwraca jedyne dopasowanie albo przerywa. Zero i wiecej niz jedno
    traktujemy tak samo: nie wiadomo, w co celujemy."""
    trafienia = list(re.finditer(wzorzec, tekst))
    if len(trafienia) != 1:
        raise Przerwij(
            f"{plik}: wzorzec „{opis}” trafil {len(trafienia)} razy, oczekiwano 1. "
            f"Bundle zostal przebudowany albo latka juz nie pasuje — nic nie zapisuje."
        )
    return trafienia[0]


def nazwy(tekst, plik):
    """Wszystko wylskiwane z literalow, nigdy z zakodowanych nazw."""
    n = {}
    n["punkty"] = jedyne(
        tekst,
        r"(\w+)=\(\(\)=>\{let \w+=globalThis\.__SCENA3D_MAPA\?\.rzeka\?\.krzywe",
        "tablica punktow rzeki", plik).group(1)
    m = jedyne(
        tekst,
        r"function (\w+)\(\)\{let (\w+)=document\.createElement\(\"canvas\"\);\2\.width=\2\.height=1024",
        "funkcja malujaca teren", plik)
    n["teren"] = m.group(1)
    # Kotwica MUSI wskazywac konkretnie funkcje terenu. Ogolne `X.add(Y());`
    # po pierwszym przebiegu trafia takze nasze wlasne `s.add(__rzekaNurt());`
    # i skrypt przestaje byc powtarzalny.
    n["grupa"] = jedyne(
        tekst,
        r"(\w+)\.add\(" + re.escape(n["teren"]) + r"\(\)\);",
        "dodanie terenu do sceny", plik).group(1)
    n["spokoj"] = jedyne(
        tekst,
        r"(\w+)=globalThis\.matchMedia\?\.\(\"\(prefers-reduced-motion: reduce\)\"\)\?\.matches\?\?!1,(\w+)=\1",
        "flaga spokojnego ruchu", plik).group(2)
    m = jedyne(
        tekst,
        r"new (\w+)\(new (\w+)\(s,s\),new (\w+)\(\{map:new (\w+)\(",
        "klasy Mesh/PlaneGeometry/MeshBasicMaterial/CanvasTexture", plik)
    n["Mesh"], n["Plane"], n["Basic"], n["CanvasTex"] = m.groups()
    n["dt"] = jedyne(
        tekst,
        r"this\._gibDrzew\((\w+)\);this\._gibKwiaty\(\1\);",
        "haczyk klatkowy w tick()", plik).group(1)
    return n


def blok(n, a):
    """Kod wstrzykiwany. Zadnych nowych klas three.js po nazwie — BufferAttribute
    bierzemy z instancji geometrii, bo jego zminifikowana nazwa jest nie do
    odroznienia od dziesiatek innych jednoliterowych."""
    return f"""{POCZATEK}
/* NURT RZEKI (dopisane po bundlu, patrz narzedzia/rzeka-nurt.py). Wstega
   trojkatow z tych samych punktow, ktore sluza kolizji, polozona nad
   wypalona w teksturze terenu rzeka. Animacja to przewijanie UV — jedno
   mnozenie na klatke, zero shaderow, dwa wywolania rysowania. */
var __RZ={{PREDKOSC:{a.predkosc},SZEROKOSC:{a.szerokosc},KRYCIE:{a.krycie},SKALA:{a.skala},WYSOKOSC:{a.wysokosc}}};
function __rzekaTekstura(faza){{
  var c=document.createElement("canvas");c.width=96;c.height=256;
  var x=c.getContext("2d");x.clearRect(0,0,96,256);x.lineCap="round";
  /* Czytelne poprzeczne fale. Wczesniejsze losowe kreski mialy alfa 0.05-0.18
     i ginely na tle szerokich, statycznych pasow wypalonych w terenie. */
  for(var i=0;i<9;i++){{
    var y=16+i*28+((i+faza)%2)*5,a=.42+(i%3)*.09;
    var g=x.createLinearGradient(4,0,92,0);
    g.addColorStop(0,"rgba(255,255,255,0)");
    g.addColorStop(.18,"rgba(255,255,255,"+(a*.72).toFixed(3)+")");
    g.addColorStop(.5,"rgba(255,255,255,"+a.toFixed(3)+")");
    g.addColorStop(.82,"rgba(255,255,255,"+(a*.72).toFixed(3)+")");
    g.addColorStop(1,"rgba(255,255,255,0)");
    x.strokeStyle=g;x.lineWidth=2.5+(i%3)*.7;
    x.beginPath();x.moveTo(5,y);x.bezierCurveTo(25,y-5-faza,62,y+5,91,y-1);x.stroke();
  }}
  /* Drobne blyski pomiedzy falami dodaja wodzie zycia bez szumu wizualnego. */
  x.strokeStyle="rgba(255,255,255,.48)";x.lineWidth=1.8;
  for(var j=0;j<8;j++){{
    var yy=29+j*28+faza*7,xx=14+(j%4)*15;
    x.beginPath();x.moveTo(xx,yy);x.quadraticCurveTo(xx+8,yy-3,xx+17,yy);x.stroke();
  }}
  return c;
}}
function __rzekaNurt(){{
  var pusty=function(){{return new {n['Mesh']}(new {n['Plane']}(.001,.001),new {n['Basic']}({{visible:!1}}));}};
  try{{
    var P={n['punkty']};
    if(!P||P.length<2)return pusty();
    var g=new {n['Plane']}(1,1),BA=g.attributes.position.constructor;
    var poz=[],uv=[],idx=[],dl=0,HW=__RZ.SZEROKOSC;
    for(var i=0;i<P.length;i++){{
      var p=P[i],q=P[Math.min(i+1,P.length-1)],r=P[Math.max(i-1,0)];
      var dx=q.x-r.x,dy=q.y-r.y,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
      if(i>0)dl+=Math.hypot(p.x-P[i-1].x,p.y-P[i-1].y);
      var v=dl*__RZ.SKALA;
      poz.push(p.x+nx*HW,0,p.y+ny*HW,p.x-nx*HW,0,p.y-ny*HW);
      uv.push(0,v,1,v);
    }}
    for(var j=0;j<P.length-1;j++){{var b=j*2;idx.push(b,b+1,b+2,b+1,b+3,b+2);}}
    g.setAttribute("position",new BA(new Float32Array(poz),3));
    g.setAttribute("uv",new BA(new Float32Array(uv),2));
    g.deleteAttribute("normal");
    g.setIndex(idx);
    g.computeBoundingSphere();
    var t1=new {n['CanvasTex']}(__rzekaTekstura(0)),t2=new {n['CanvasTex']}(__rzekaTekstura(1));
    /* 1000 to RepeatWrapping. Stala liczbowa zamiast nazwy — w zminifikowanym
       bundlu nazwy stalych i tak nie ma. */
    t1.wrapS=t1.wrapT=1e3;t2.wrapS=t2.wrapT=1e3;t2.repeat.set(1,1.35);t2.offset.y=.37;
    /* side:2 to DoubleSide — wstega lezy plasko, a tak nie trzeba zgadywac
       kolejnosci wierzcholkow. */
    var m1=new {n['Basic']}({{map:t1,transparent:!0,depthWrite:!1,side:2,opacity:__RZ.KRYCIE}});
    var m2=new {n['Basic']}({{map:t2,transparent:!0,depthWrite:!1,side:2,opacity:__RZ.KRYCIE*.68}});
    var s1=new {n['Mesh']}(g,m1);s1.position.y=__RZ.WYSOKOSC;s1.renderOrder=1;s1.frustumCulled=!1;
    var s2=new {n['Mesh']}(g,m2);s2.position.y=.002;s2.renderOrder=2;s2.frustumCulled=!1;
    s1.add(s2);
    globalThis.__nurtRzeki={{a:t1,b:t2,v:__RZ.PREDKOSC}};
    return s1;
  }}catch(e){{
    /* Swiat ma dzialac takze wtedy, gdy cos tu pojdzie nie tak — bez rzeki,
       ale bez pustej mapy. Ta sama zasada, co w znakiMapy.js. */
    console.warn("[nurt rzeki] pominiety:",e);
    return pusty();
  }}
}}
function __rzekaTik(dt){{
  var n=globalThis.__nurtRzeki;
  if(!n||{n['spokoj']})return;
  /* Modulo trzyma offset w [0,1). Bez tego po kilkudziesieciu minutach
     liczba rosnie na tyle, ze float traci precyzje i woda zaczyna skakac. */
  n.a.offset.y=(n.a.offset.y-dt*n.v)%1;
  n.b.offset.y=(n.b.offset.y-dt*n.v*.48)%1;
  n.b.offset.x=Math.sin(Date.now()*18e-5)*.045;
}}
{KONIEC}"""


def zalataj(sciezka, a):
    with open(sciezka, "r", encoding="utf-8", errors="strict") as f:
        t = f.read()
    plik = sciezka.split("/")[-1].split("\\")[-1]
    n = nazwy(t, plik)
    nowy_blok = blok(n, a)
    krotko = f"{plik}: punkty={n['punkty']} szer.grupa={n['grupa']} teren={n['teren']} spokoj={n['spokoj']}"

    if POCZATEK in t:
        i, j = t.index(POCZATEK), t.index(KONIEC) + len(KONIEC)
        t = t[:i] + nowy_blok + t[j:]
        tryb = "przestrojone"
    else:
        kotwica = f"function {n['teren']}()"
        t = t.replace(kotwica, nowy_blok + kotwica, 1)
        tryb = "wstawione"

    dodanie = f"{n['grupa']}.add({n['teren']}());"
    if "__rzekaNurt()" not in t.replace(nowy_blok, ""):
        t = t.replace(dodanie, dodanie + f"{n['grupa']}.add(__rzekaNurt());", 1)

    haczyk = f"this._gibDrzew({n['dt']});this._gibKwiaty({n['dt']});"
    if "__rzekaTik(" not in t.replace(nowy_blok, ""):
        t = t.replace(haczyk, haczyk + f"__rzekaTik({n['dt']});", 1)

    for co in ("__rzekaNurt()", "__rzekaTik("):
        ile = t.replace(nowy_blok, "").count(co)
        if ile != 1:
            raise Przerwij(f"{plik}: „{co}” wystepuje {ile} razy poza blokiem, oczekiwano 1.")

    with open(sciezka, "w", encoding="utf-8", newline="") as f:
        f.write(t)
    print(f"  {tryb}: {krotko}")


def main():
    p = argparse.ArgumentParser(description="Animowany nurt rzeki w scenie 3D.")
    p.add_argument("pliki", nargs="+", help="scena3d.js i scena3d.esm.js — OBA")
    p.add_argument("--predkosc", type=float, default=0.18,
                   help="ile tekstury na sekunde; 0.08 leniwy strumien, 0.24 wartki (domyslnie 0.18)")
    p.add_argument("--szerokosc", type=float, default=0.9,
                   help="polowa szerokosci wstegi w metrach swiata. 0.9 kryje wypalona rzeke "
                        "(pociagnieta pedzlem 1.9 jednostki); kolizja blokuje dalej, bo liczy 1.5 od osi")
    p.add_argument("--krycie", type=float, default=0.56, help="krycie gornej warstwy (domyslnie 0.56)")
    p.add_argument("--skala", type=float, default=0.55,
                   help="ile kafli tekstury na metr dlugosci rzeki (domyslnie 0.55)")
    p.add_argument("--wysokosc", type=float, default=0.012,
                   help="ile nad ziemia. 0.012 miesci sie pod plamka cienia bohatera (0.02)")
    a = p.parse_args()

    if len(a.pliki) < 2:
        print("UWAGA: podano jeden plik. Bundle sa DWA (scena3d.js i scena3d.esm.js) "
              "i zmiana w jednym zostawia gre w polowie naprawiona.", file=sys.stderr)

    try:
        for s in a.pliki:
            zalataj(s, a)
    except Przerwij as e:
        print(f"PRZERWANE — {e}", file=sys.stderr)
        sys.exit(1)

    print("\nGotowe. Teraz podbij WERSJA_SCENY w frontend/src/components/Scena3D.jsx,")
    print("inaczej przegladarka poda stara scene z cache.")


if __name__ == "__main__":
    main()
