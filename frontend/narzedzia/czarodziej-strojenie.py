"""Strojenie znaku czarodzieja w zbudowanym module sceny.

Podmienia CALA definicje `{id:"czarodziej",...}` na nowa, wiec skrypt mozna
uruchamiac wielokrotnie - kolejne uruchomienie nadpisze poprzednie wartosci.
Osobno (i tez idempotentnie) uzaleznia PROMIEN UZBROJENIA znaku od definicji.

Dlaczego promien uzbrojenia: znak pyta raz na podejscie i uzbraja sie ponownie
dopiero, gdy bohater odejdzie odpowiednio daleko. Ta odleglosc byla w module
wpisana na sztywno (1,7), a czarodziej ma zasieg zagadania 1,9 - wiec miedzy
1,7 a 1,9 powstawal pas, w ktorym znak juz sie uzbroil, ale bohater wciaz byl
w zasiegu. Pytanie wracalo natychmiast po zamknieciu i nie dalo sie odejsc.
Uzbrojenie MUSI byc wyraznie wieksze od zasiegu - stad `zbrojenie:3.4`.
"""
import re
import sys

NOWA = (
    '{id:"czarodziej",file:"wizard",label:"Czarodziej",'
    'toast:"Czarodziej pojawi\\u0142 si\\u0119 w lesie",'
    # Miejsca NIE sa wpisane z palca - wyszly ze skanu mapy w prawdziwym
    # module: siatka co 0,5 jednostki, test `miejsceWolne` z marginesem 1,8,
    # a z 453 wolnych punktow wybor zachlanny tak, zeby dzielilo je co
    # najmniej 6 jednostek. Piec poprzednich, zgadywanych, nie przechodzilo
    # testu ANI JEDNO - czarodziej wchodzil w choinki i na gwiazdki.
    'pos:[-3,4],pozycje:[[-3,4],[-7,-8],[4,3.5],[4,-8],[.5,9]],'
    # scale = mnoznik wysokosci bazowej 0,55 jednostki -> 3.7 daje ~2 jednostki.
    # height = srodek modelu nad ziemia; polowa wysokosci to 1,02, wiec 1.3
    # unosi stopy ~37 cm nad trawe. Czarodziej LEWITUJE, nie stoi - dlatego
    # znika w gore (absorbLift), a nie zapadajac sie w ziemie.
    'scale:3.7,height:1.3,absorbLift:2.8,'
    'animuj:!0,bezObrotu:!0,obrotY:.484,'
    # zasieg = z jakiej odleglosci zagaduje; zbrojenie = jak daleko trzeba
    # odejsc, zeby zapytal ponownie. Zbrojenie musi byc WIEKSZE od zasiegu.
    # margines = ile wolnej przestrzeni musi miec wokol siebie w miejscu
    # pojawienia. Sprawdzany pierscieniem osmiu punktow przez `canWalk`
    # (patrz `znak-wolne-miejsce.py`), wiec obejmuje drzewa, chatke i rzeke,
    # a osobno trzyma odstep od innych znakow.
    # cykl = ile stoi, respawn = ile go nie ma, respawnPierwszy = ile go nie ma
    # PO PIERWSZYM zniknieciu (tylko raz). Dziecko, ktore przegapilo pierwsze
    # spotkanie, dostaje druga szanse szybko; dalej rytm robi sie spokojny.
    'absorb:!1,raz:!0,zasieg:1.9,zbrojenie:3.4,margines:1.8,'
    'cykl:35,respawn:60,respawnPierwszy:12,'
    # jasnosc mnozy kolor materialu - 1.6 wyciaga fiolet szaty z cienia lasu.
    'glow:12093672,ringColor:14268159,jasnosc:1.6,metalness:0,roughness:.85,'
    'haloOpacity:.2,haloScale:1.7,ringOpacity:.3,lightBase:0,iskry:38,iskrySila:1.9}'
)

ZMIANY = [
    ("definicja czarodzieja",
     r'\{id:"czarodziej".*?iskrySila:[\d.]+\}',
     lambda m: NOWA),
    ("promien uzbrojenia z definicji",
     r"n>1\.7&&\(this\.armed=!0\)",
     "n>(this.def.zbrojenie??1.7)&&(this.armed=!0)"),
]

bledy = 0
for sciezka in sys.argv[1:]:
    with open(sciezka, encoding="utf-8") as f:
        tresc = f.read()
    print("=== " + sciezka)
    for nazwa, wzor, zamiana in ZMIANY:
        ile = len(re.findall(wzor, tresc))
        if ile == 0 and nazwa.startswith("promien"):
            # juz zalatane wczesniejszym uruchomieniem - to nie jest blad
            if "this.def.zbrojenie" in tresc:
                print("  ok    " + nazwa + " (juz bylo)")
                continue
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
