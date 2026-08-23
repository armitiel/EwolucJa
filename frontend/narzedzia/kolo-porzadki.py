"""
kolo-porzadki — przycięcie i zeskalowanie assetów Koła Przeznaczenia.

Generator oddaje pliki 1024–1536 px i po 2 MB każdy: 25 MB na jeden ekran,
z czego większość to przezroczysty margines. Ten skrypt przycina każdy plik do
faktycznej zawartości, skaluje do rozmiaru, w jakim element naprawdę jest
wyświetlany, i zapisuje z powrotem.

Rozmiary są dobrane z zapasem 2× względem wyświetlanego rozmiaru (ekrany
o wysokiej gęstości), a nie „na oko" — dlatego ikona ma 320 px, a nie 1024.

Uruchamiaj z katalogu frontend/:
    python narzedzia/kolo-porzadki.py
"""
import pathlib, sys
from PIL import Image

KAT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parents[1] / "public" / "assets" / "kolo"

# nazwa: (docelowa szerokość, docelowa wysokość) — None znaczy „policz z proporcji"
PLAN = {
    "ikona-ciekawosc":   (320, None),
    "ikona-tworzenie":   (320, None),
    "ikona-wspolpraca":  (320, None),
    "ikona-odwaga":      (320, None),
    "ikona-wytrwalosc":  (320, None),
    "baner-tytul":       (1000, None),
    "wstazka-podtytul":  (900, None),
    "przycisk-cta":      (720, None),
    "przycisk-zamknij":  (160, 160),
    "kolo-podstawa":     (760, None),
    "lisek":             (None, 520),
    "tlo-las":           (800, None),
}
# Warstwy koła zostają nietknięte: muszą mieć wspólne płótno 1024×1024
# ze środkiem koła w środku pliku, więc przycięcie by je rozjechało.
NIE_RUSZAJ = {"kolo-tarcza", "kolo-rama", "kolo-piasta", "kolo-wskaznik"}


def main():
    razem_przed = razem_po = 0
    for plik in sorted(KAT.glob("*.png")):
        nazwa = plik.stem
        if nazwa in NIE_RUSZAJ:
            print(f"{nazwa:20s} pomijam (warstwa koła)")
            continue
        if nazwa not in PLAN:
            print(f"{nazwa:20s} nie ma w planie — pomijam")
            continue
        przed = plik.stat().st_size
        im = Image.open(plik).convert("RGBA")
        bb = im.getbbox()
        if bb:
            im = im.crop(bb)
        w, h = PLAN[nazwa]
        if w is None:
            w = round(im.width * h / im.height)
        if h is None:
            h = round(im.height * w / im.width)
        im = im.resize((w, h), Image.LANCZOS)
        # WEBP, nie PNG: te ilustracje to miękkie gradienty i cieniowanie,
        # więc PNG zapisuje je piksel po pikselu i waży 5–10× więcej przy tej
        # samej jakości. Przezroczystość WEBP obsługuje bez straty kształtu.
        plik.unlink()
        plik = plik.with_suffix(".webp")
        if im.getchannel("A").getextrema()[0] == 255:
            im.convert("RGB").save(plik, "WEBP", quality=88, method=6)
        else:
            im.save(plik, "WEBP", quality=92, method=6, exact=False)
        po = plik.stat().st_size
        razem_przed += przed
        razem_po += po
        print(f"{nazwa:20s} {przed//1024:5d} kB → {po//1024:4d} kB   {im.size}  {plik.suffix}")
    print(f"\nrazem {razem_przed//1024} kB → {razem_po//1024} kB")


if __name__ == "__main__":
    main()
