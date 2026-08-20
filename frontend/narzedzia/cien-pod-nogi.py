#!/usr/bin/env python3
"""cien-pod-nogi — przesuwa cień bohatera lekko DO PRZODU, w stronę, w którą patrzy.

DLACZEGO. Cień siedział dokładnie pod środkiem postaci (`hero.position`), a
środek modelu wypada mniej więcej w biodrach. Lisek stoi pochylony do przodu
i chodzi „nosem naprzód", więc cień pod biodrami czyta się jak wycofany za
postać — optycznie wygląda, jakby bohater wisiał odrobinę przed swoim cieniem.
Przesunięcie o kilkanaście centymetrów świata w kierunku patrzenia sadza cień
pod nogami i wrażenie znika.

JAK. Kierunek bierzemy z `this.heading` — tego samego kąta, którym scena obraca
bohatera (`hero.rotation.y = heading`, a `heading = atan2(dx, dz)`). Wektor
„przód" to więc (sin heading, cos heading), a nie żadna stała oś: cień jedzie
za obrotem, także wtedy, gdy postać kręci się w miejscu.

Skrypt jest POWTARZALNY — wzorzec łapie zarówno oryginalne wywołanie, jak i
już przesunięte, więc wartość da się stroić bez przywracania bundla.

Uruchamianie z katalogu `frontend`:
    python3 narzedzia/cien-pod-nogi.py public/scena-3d/scena3d.js public/scena-3d/scena3d.esm.js
    python3 narzedzia/cien-pod-nogi.py --przod 0.24 public/scena-3d/*.js

Po zmianie podbij `WERSJA_SCENY` w `src/components/Scena3D.jsx`.
"""
import argparse
import re
import sys

# Ile jednostek świata do przodu. Bohater ma skalę 1.75, a plama cienia ~1.3
# jednostki szerokości, więc 0.18 to około jedna siódma cienia — widać, że
# usiadł pod nogami, ale nie odkleja się od postaci.
PRZOD_DOMYSLNY = 0.18

WZORZEC = re.compile(
    r"this\.heroShadow\.position\.set\(\s*hx[^,]*,\s*gy\+\.02\s*,\s*hz[^)]*\)"
)


def nowe_wywolanie(przod: float) -> str:
    p = f"{przod:g}"
    return (
        "this.heroShadow.position.set("
        f"hx+Math.sin(this.heading)*{p},gy+.02,hz+Math.cos(this.heading)*{p})"
    )


def zalataj(sciezka: str, przod: float) -> bool:
    with open(sciezka, encoding="utf-8") as f:
        tresc = f.read()

    trafienia = WZORZEC.findall(tresc)
    if len(trafienia) != 1:
        print(f"[BLAD] {sciezka}: wzorzec trafil {len(trafienia)} razy, oczekiwano 1")
        return False

    nowa = WZORZEC.sub(nowe_wywolanie(przod), tresc)
    if nowa == tresc:
        print(f"[=] {sciezka}: juz ma te wartosc")
        return True

    with open(sciezka, "w", encoding="utf-8", newline="") as f:
        f.write(nowa)
    print(f"[OK] {sciezka}: cien przesuniety o {przod:g} do przodu")
    return True


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("pliki", nargs="+", help="bundle sceny (scena3d.js, scena3d.esm.js)")
    p.add_argument("--przod", type=float, default=PRZOD_DOMYSLNY,
                   help=f"ile jednostek swiata do przodu (domyslnie {PRZOD_DOMYSLNY})")
    a = p.parse_args()

    ok = True
    for sciezka in a.pliki:
        ok = zalataj(sciezka, a.przod) and ok
    if ok:
        print("\nPamietaj o podbiciu WERSJA_SCENY w src/components/Scena3D.jsx")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
