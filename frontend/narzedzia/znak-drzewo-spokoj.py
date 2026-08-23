#!/usr/bin/env python3
"""
znak-drzewo-spokoj — dwa parametry znaku, których bundle sceny nie miał.

PO CO. Znak „wysokiej sosny" (wejście do Lotu Liska) to jedyny znak, który
jest DUŻY: `scale` 5,6 wobec 1–1,9 u pozostałych. Animacja znaku jest jedna
dla wszystkich i przy tej skali przestaje działać:

  • oddech skali — znak rośnie o 8% na podejście bohatera i o 40% przy
    dotknięciu. Przy karcie to mrugnięcie, przy sośnie na pół ekranu — skok,
    który czyta się jak migotanie.
  • unoszenie — `bezUnoszenia` istnieje w bundlu (komentarz mówi wprost:
    „drzewo, ktore raz po raz odrywa sie od trawy, czyta sie jak blad"),
    ale mapa go dla tej sosny nie ustawiała.

CO WSTRZYKUJE:

  `oddechSkali`   — mnożnik obu składników oddechu skali (domyślnie 1).
                    0,25 znaczy: 2% na podejście zamiast 8%, 10% przy
                    dotknięciu zamiast 40%.
  `barwaMnoznik`  — hex mnożony przez WŁASNE kolory modelu, kanał po kanale.
                    `barwa` zamalowuje model jednym kolorem (pień razem
                    z igłami), a `jasnosc` to skalar — żadne z nich nie
                    potrafi przesunąć samego odcienia. Mnożnik potrafi:
                    zieleń zostaje zielenią, tylko cieplejszą albo chłodniejszą.

Uruchamiaj z katalogu `frontend/`:
    python narzedzia/znak-drzewo-spokoj.py
Łatka jest IDEMPOTENTNA. Po niej podbij `WERSJA_SCENY` w `Scena3D.jsx`.
"""
import os, sys

PLIKI = ["public/scena-3d/scena3d.js", "public/scena-3d/scena3d.esm.js"]
ZNACZNIK = "barwaMnoznik"

# ── kolor: mnożnik kanał po kanale, bez klasy Color ────────────────────────
# `h` to materiał, `e` to definicja znaku z mapy.
KOLOR_STARY = ("(e.barwa!=null?h.color.setHex(e.barwa).multiplyScalar(e.jasnosc??1.35):"
               "e.wlasneKolory?h.color.multiplyScalar(e.jasnosc??1):h.color.setScalar(e.jasnosc??1.35))")
KOLOR_NOWY = (KOLOR_STARY +
              ",e.barwaMnoznik!=null&&(h.color.r*=(e.barwaMnoznik>>16&255)/255,"
              "h.color.g*=(e.barwaMnoznik>>8&255)/255,h.color.b*=(e.barwaMnoznik&255)/255)")

# ── oddech skali: ten sam wzór, tylko z mnożnikiem z definicji ─────────────
# Zmienna licznika `punch` nazywa się w obu plikach inaczej (`c` / `l`).
def skala(licznik):
    stara = f"let h=Math.max(0,(1+.08*this.wake+.4*{licznik})*a);this.spin.scale.setScalar(h)"
    nowa = (f"let _os=this.def.oddechSkali??1,h=Math.max(0,(1+.08*this.wake*_os+.4*{licznik}*_os)*a);"
            "this.spin.scale.setScalar(h)")
    return stara, nowa


def main():
    zmienione = []
    for sciezka in PLIKI:
        if not os.path.exists(sciezka):
            sys.exit(f"Nie ma pliku {sciezka} — uruchom z katalogu frontend/")
        tresc = open(sciezka, encoding="utf-8").read()
        if ZNACZNIK in tresc:
            print(f"pomijam (już załatane): {sciezka}")
            continue
        if tresc.count(KOLOR_STARY) != 1:
            sys.exit(f"{sciezka}: kod koloru znaku wystąpił {tresc.count(KOLOR_STARY)}× — bundle się zmienił.")
        pasujace = [p for p in ("c", "l") if tresc.count(skala(p)[0]) == 1]
        if len(pasujace) != 1:
            sys.exit(f"{sciezka}: nie znalazłem jednoznacznie kodu oddechu skali (kandydaci: {pasujace}).")
        stara, nowa = skala(pasujace[0])

        kopia = sciezka + ".bak-przed-spokojem"
        if not os.path.exists(kopia):
            open(kopia, "w", encoding="utf-8").write(tresc)
        tresc = tresc.replace(KOLOR_STARY, KOLOR_NOWY).replace(stara, nowa)
        open(sciezka, "w", encoding="utf-8").write(tresc)
        zmienione.append(sciezka)
        print(f"załatane: {sciezka}  (kopia: {kopia})")

    if zmienione:
        print("\nPamiętaj o podbiciu WERSJA_SCENY w src/components/Scena3D.jsx")


if __name__ == "__main__":
    main()
