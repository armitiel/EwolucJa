#!/usr/bin/env python3
"""
znak-drzewo-bujanie — dotknięcie sosny KOŁYSZE JĄ NA BOKI, zamiast pompować skalą.

PO CO. Dotknięcie znaku odpala jeden efekt dla wszystkich: `punch` rozdmuchuje
znak o 40% i podnosi go o kawałek. Przy karcie czy piórku to sprężysty pyk,
przy sośnie wielkości pół ekranu — pompka. Drzewo, w które ktoś wbiegł, ma się
zakołysać, a nie urosnąć.

CO WSTRZYKUJE:

  `bujanie`       — amplituda kołysania w RADIANACH (jak `obrotY`). Po dotknięciu
                    znak wychyla się na boki po tłumionej sinusoidzie:
                    tłumionej sinusoidzie (stałe niżej: `CZESTOTLIWOSC`,
                    `TLUMIENIE`). To ten sam kształt, co drgania drzew na mapie
                    (`_gibDrzew`), tylko liczony wprost, bo znak nie jest ich
                    częścią.
  `oddechDotyku`  — osobny mnożnik skoku skali PRZY DOTKNIĘCIU (domyślnie tyle,
                    co `oddechSkali`). Sosna ma 0: kołysze się i nic nie rośnie,
                    ale delikatny oddech na podejście bohatera zostaje.

Przy okazji `bezUnoszenia` zaczyna wyciszać także PODSKOK przy dotknięciu
(`punch² · 0,35`). Flaga mówi „ten znak nie odrywa się od trawy" i nie ma
powodu, żeby dotknięcie było wyjątkiem.

Wymaga wcześniejszego `znak-drzewo-spokoj.py` (dokłada `oddechSkali`).
Uruchamiaj z katalogu `frontend/`:
    python narzedzia/znak-drzewo-bujanie.py
Łatka jest IDEMPOTENTNA. Po niej podbij `WERSJA_SCENY` w `Scena3D.jsx`.
"""
import os, sys

PLIKI = ["public/scena-3d/scena3d.js", "public/scena-3d/scena3d.esm.js"]
ZNACZNIK = "bujanie"

# ── STROJENIE KOŁYSANIA ───────────────────────────────────────────────────
# Wzór: `bujanie · e^(−TLUMIENIE·t) · sin(CZESTOTLIWOSC·t)`.
#
# Pierwsza wersja miała 2,6 i 9,2 — drzewo wychylało się raz na 8°, wracało
# na 1,6° i po tym już tylko drgało. Wyglądało jak szarpnięcie, nie jak
# kołysanie. Teraz wolniej i słabiej tłumione: kolejne wychylenia to ok. 55%
# poprzedniego, więc widać PEŁNE wahnięcie w jedną i w drugą stronę.
#
#   szczyty przy `bujanie` = 0,19:  +8,0° (0,21 s) → −4,4° (0,63 s) → +2,4° (1,05 s)
#
# `KONIEC` ucina ogon, gdy wychylenie schodzi poniżej 2% amplitudy — dalej
# liczenie sinusa byłoby tylko pracą dla procesora.
CZESTOTLIWOSC = 7.5
TLUMIENIE = 1.5
KONIEC = 2.6

# 1. Start kołysania — w `touch()`, tuż po ustawieniu `punch`.
TOUCH_STARY = "this.punch=1,this.touches++"
TOUCH_NOWY = "this.punch=1,this.def.bujanie&&(this.buj=0),this.touches++"


# Minifikator nazywa te same zmienne inaczej w obu plikach: w `scena3d.js`
# uniesienie to `l`, a `punch²` to `c`; w wersji ESM na odwrót. Zamiast zgadywać,
# próbujemy obu kombinacji i przyjmujemy tę, która pasuje dokładnie raz.
KOMBINACJE = [("l", "c"), ("c", "l")]


def warianty(uniesienie, licznik):
    # 2. Podskok przy dotknięciu ucisza `bezUnoszenia`.
    podskok_stary = f"this.spin.position.y=(this.def.height??1.1)+{uniesienie}+{licznik}*.35+i"
    podskok_nowy = (f"this.spin.position.y=(this.def.height??1.1)+{uniesienie}+"
                    f"(this.def.bezUnoszenia?0:{licznik}*.35)+i")
    # 3. Skok skali przy dotknięciu dostaje własny mnożnik.
    skala_stara = f"(1+.08*this.wake*_os+.4*{licznik}*_os)"
    skala_nowa = f"(1+.08*this.wake*_os+.4*{licznik}*(this.def.oddechDotyku??_os))"
    # 4. Samo kołysanie — zaraz po ustawieniu skali znaku.
    # OŚ KOŁYSANIA JEST U PODSTAWY, NIE W POŁOWIE WYSOKOŚCI. Loader centruje
    # model na środku jego bryły (`t.position.sub(o)`), więc samo `rotation.z`
    # obracałoby drzewo wokół pasa — pień jeździłby na boki po trawie tak samo
    # jak czubek. Doliczamy więc przesunięcie, które sprowadza podstawę
    # z powrotem na miejsce: `x = −H·sin(kąt)`, `y = −H·(1−cos(kąt))`, gdzie
    # H to połowa wysokości modelu, czyli `0,275 · scale` (loader skaluje
    # bryłę do `0,55 · scale`).
    buj_stary = "this.spin.scale.setScalar(h)"
    buj_nowy = ("this.spin.scale.setScalar(h),this.def.bujanie!=null&&(this.buj!=null?"
                f"((this.buj+=e)>{KONIEC}?(this.buj=null,this.spin.rotation.z=0,this.spin.position.x=0):"
                f"(this._bk=this.def.bujanie*Math.exp(-{TLUMIENIE}*this.buj)*Math.sin({CZESTOTLIWOSC}*this.buj),"
                "this._bh=.275*(this.def.scale??1),"
                "this.spin.rotation.z=this._bk,"
                "this.spin.position.x=-this._bh*Math.sin(this._bk),"
                "this.spin.position.y-=this._bh*(1-Math.cos(this._bk))))"
                ":(this.spin.rotation.z=0,this.spin.position.x=0))")
    return [(podskok_stary, podskok_nowy), (skala_stara, skala_nowa), (buj_stary, buj_nowy)]


def main():
    zmienione = []
    for sciezka in PLIKI:
        if not os.path.exists(sciezka):
            sys.exit(f"Nie ma pliku {sciezka} — uruchom z katalogu frontend/")
        tresc = open(sciezka, encoding="utf-8").read()
        if ZNACZNIK in tresc:
            print(f"pomijam (już załatane): {sciezka}")
            continue
        if "oddechSkali" not in tresc:
            sys.exit(f"{sciezka}: brak `oddechSkali` — uruchom najpierw znak-drzewo-spokoj.py")
        if tresc.count(TOUCH_STARY) != 1:
            sys.exit(f"{sciezka}: `touch()` wystąpił {tresc.count(TOUCH_STARY)}× — bundle się zmienił.")

        pasujace = [k for k in KOMBINACJE if all(tresc.count(a) == 1 for a, _ in warianty(*k))]
        if len(pasujace) != 1:
            sys.exit(f"{sciezka}: nie rozpoznałem jednoznacznie kodu animacji (kandydaci: {pasujace}).")

        kopia = sciezka + ".bak-przed-bujaniem"
        if not os.path.exists(kopia):
            open(kopia, "w", encoding="utf-8").write(tresc)

        tresc = tresc.replace(TOUCH_STARY, TOUCH_NOWY)
        for stare, nowe in warianty(*pasujace[0]):
            tresc = tresc.replace(stare, nowe)
        open(sciezka, "w", encoding="utf-8").write(tresc)
        zmienione.append(sciezka)
        print(f"załatane: {sciezka}  (kopia: {kopia})")

    if zmienione:
        print("\nPamiętaj o podbiciu WERSJA_SCENY w src/components/Scena3D.jsx")


if __name__ == "__main__":
    main()
