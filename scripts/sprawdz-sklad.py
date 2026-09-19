# -*- coding: utf-8 -*-
"""
sprawdz-sklad.py — kontrola, czy dostarczone stosy MIESZCZA SIE W KREGU placu.

Pierscien aktywnosci ma promien 1.02*s (`ustawPlacBudowy`, `rPier`), a stosy
kladzie `_polozNaPlacu`. Te dwie liczby zyja w roznych miejscach app.js, wiec
latwo je rozjechac - ten skrypt liczy najdalszy stos i mowi wprost, czy jego
krawedz zostaje wewnatrz pierscienia.

Uruchomienie:  python scripts/sprawdz-sklad.py
"""
import math

S = 1.45        # schronienie.skala z mapa.json
OBROT = -0.25   # schronienie.obrot
# Polowa szerokosci stosu. Skala idzie OD DRZEWA (`_zarejestrujDrzewa`:
# skalaStosu = skalaDrzewa * 1.2, potem * 0.7 w `_polozNaPlacu`), wiec
# sprawdzamy DWA przypadki: zwykle drzewo i najwieksze na mapie.
BRYLY = {"zwykle drzewo": 0.45, "najwieksze drzewo": 0.55}

R_PIERSCIENIA = 1.02 * S

KIER = OBROT + math.pi
ODSUN = 0.36 * S
ROZSTAW = 0.52 * S
POPRZEK = KIER + math.pi / 2


def odleglosci():
    for nr in range(3):
        dx = ODSUN * math.cos(KIER) + (nr - 1) * ROZSTAW * math.cos(POPRZEK)
        dz = -ODSUN * math.sin(KIER) - (nr - 1) * ROZSTAW * math.sin(POPRZEK)
        yield nr, math.hypot(dx, dz)


print(f"promien pierscienia: {R_PIERSCIENIA:.3f}\n")
zle = 0
for nazwa, r in BRYLY.items():
    print(f"{nazwa} (polowa stosu {r}):")
    najdalej = 0.0
    for nr, d in odleglosci():
        krawedz = d + r
        najdalej = max(najdalej, krawedz)
        ok = krawedz < R_PIERSCIENIA
        zle += 0 if ok else 1
        print(f"  stos {nr}: srodek {d:.3f}, krawedz {krawedz:.3f}, "
              f"{'W KREGU' if ok else 'POZA KREGIEM'}")
    print(f"  zapas do pierscienia: {R_PIERSCIENIA - najdalej:.3f}\n")

stare = 1.25 * S + 0.45
print(f"przed zmiana (luk 1.25*s, zwykle drzewo): krawedz {stare:.3f} -> "
      f"{'W KREGU' if stare < R_PIERSCIENIA else 'POZA KREGIEM'}")
raise SystemExit(1 if zle else 0)
