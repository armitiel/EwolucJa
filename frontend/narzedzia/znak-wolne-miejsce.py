"""Znak z listy `pozycje` staje tylko tam, gdzie ma wokol siebie zapas.

Problem: losowe miejsca czarodzieja byly wpisane recznie i nie wiedzialy nic
o scenie - potrafil pojawic sie w choince, w scianie chatki albo na gwiazdce.

Rozwiazanie korzysta z kolizji, ktore scena juz ma. `canWalk(x,z)` odpowiada
na pytanie "czy bohater moze tu stanac" - sprawdza przeszkody (drzewa, chatka)
i rzeke. Testujemy wiec nie sam punkt, ale PIERSCIEN wokol niego: osiem
kierunkow w odleglosci `margines`. Jesli wszedzie da sie stanac, miejsce jest
naprawde puste, a nie tylko wolne w samym srodku.

Do tego minimalny odstep od innych znakow, zeby czarodziej nie przykrywal
zbieranej gwiazdki.

Gdy zaden kandydat nie przejdzie testu, margines jest luzowany (1.0 -> 0.6 ->
zero). Lepiej postawic go ciasno niz nie postawic wcale.

Uruchamiac RAZ - drugie wywolanie zglosi 0 trafien i przerwie.
"""
import re
import sys

METODA = (
    "miejsceWolne(x,z,m,pomin,w){"
    "if(!this.canWalk(x,z))return!1;"
    "for(let k=0;k<8;k++){let a=k/8*Math.PI*2;"
    "if(!this.canWalk(x+Math.cos(a)*m,z+Math.sin(a)*m))return!1}"
    "for(let q of w||[]){let d=q&&q.e;if(!d||d.id===pomin||!d.pos)continue;"
    "if(Math.hypot(x-d.pos[0],z-d.pos[1])<m)return!1}"
    "return!0}"
    "wolneMiejsca(e,w){"
    "let baza=(p)=>[p[0],this.groundHeightAt(p[0],p[1]),p[1]];"
    "for(let m of [e.margines??1.6,1,.6]){"
    "let ok=e.pozycje.filter(p=>this.miejsceWolne(p[0],p[1],m,e.id,w));"
    "if(ok.length)return ok.map(baza)}"
    "return e.pozycje.map(baza)}"
)

ZMIANY = [
    ("metoda miejsceWolne + wolneMiejsca",
     r"(async loadMarkers\(\)\{)",
     lambda m: METODA + m.group(1)),

    ("filtrowanie pozycji przy wczytaniu",
     r"e\.pozycje&&\(e\._pozycje=e\.pozycje\.map\(p=>\[p\[0\],this\.groundHeightAt\(p\[0\],p\[1\]\),p\[1\]\]\)\);",
     "e.pozycje&&(e._pozycje=this.wolneMiejsca(e,w));"),
]

bledy = 0
for sciezka in sys.argv[1:]:
    with open(sciezka, encoding="utf-8") as f:
        tresc = f.read()
    print("=== " + sciezka)
    for nazwa, wzor, zamiana in ZMIANY:
        ile = len(re.findall(wzor, tresc))
        if ile != 1:
            print("  BLAD  %s: trafien %d (oczekiwano 1)" % (nazwa, ile))
            bledy += 1
            continue
        tresc = re.sub(wzor, zamiana, tresc, count=1)
        print("  ok    " + nazwa)
    if bledy == 0:
        with open(sciezka, "w", encoding="utf-8") as f:
            f.write(tresc)

sys.exit(1 if bledy else 0)
