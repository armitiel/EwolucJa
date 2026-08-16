"""Pierwsze spotkanie ma byc szybkie i przewidywalne.

Dwie zmiany, obie o to samo: zeby dziecko trafilo na czarodzieja od razu,
a nie po kilku minutach biegania.

1. PRZY WCZYTANIU STOI TAM, GDZIE MOWI `pos`. Wczesniej juz na starcie
   losowal miejsce z listy, wiec przy pechowym losowaniu ladowal na drugim
   koncu mapy, tylem do bohatera. `pos` jest ustawione na punkt najblizszy
   miejscu startu lisa - pierwsze spotkanie jest wiec pewne. Losowanie
   zostaje, ale dopiero przy KOLEJNYCH powrotach.

2. PIERWSZY POWROT JEST KROTSZY. `respawnPierwszy` (sekundy) obowiazuje
   tylko raz - po pierwszym zniknieciu. Potem wchodzi zwykly `respawn`.
   Dziecko, ktore przegapilo pierwsze spotkanie, dostaje druga szanse
   szybko, a dalej rytm robi sie juz spokojny.

Uruchamiac RAZ - drugie wywolanie zglosi 0 trafien i przerwie.
"""
import re
import sys

ZMIANY = [
    ("start w miejscu z `pos`, bez losowania",
     r"i\.mixer\.clipAction\(t\.animations\[0\]\)\.play\(\)\),i\.przenies\(\),this\.scene\.add\(i\.root\)",
     "i.mixer.clipAction(t.animations[0]).play()),this.scene.add(i.root)"),

    ("krotszy pierwszy powrot",
     r"this\.phase\+=e,this\.phase>=\(this\.def\.respawn\?\?3\.2\)&&\(this\.przenies\(\),",
     "this.phase+=e,this.phase>=((this.powroty?this.def.respawn:this.def.respawnPierwszy??this.def.respawn)??3.2)&&(this.powroty=(this.powroty||0)+1,this.przenies(),"),
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
