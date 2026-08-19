# znak-karta-zamiast-medalu.py
#
# Podmienia WBUDOWANA w bundle definicje znaku: medal -> karty.
#
# Po co, skoro mapa siedzi w `mapa.json`: bo ten literal jest wartoscia zapasowa
# (`globalThis.__SCENA3D_MAPA?.znaki ?? [...]`) i jednoczesnie zrodlem, z ktorego
# `scripts/mapa-eksport.py` odtwarza mapa.json. Dopoki stoi w nim medal i nie ma
# karty, kazdy eksport - albo kazde uruchomienie bez mapy - cofa mape do stanu
# sprzed karty. Karta znikala z mapy juz dwa razy dokladnie z tego powodu.
#
# Medal byl znakiem martwym: nie prowadzil do zadnej gry, tylko znikal jak
# zbieractwo. Karta prowadzi do Pamieci Medrca.
#
# Skrypt jest IDEMPOTENTNY: drugie uruchomienie nic nie robi.
#
#   python frontend/narzedzia/znak-karta-zamiast-medalu.py
#   python frontend/narzedzia/znak-karta-zamiast-medalu.py --cofnij
import io, pathlib, re, sys

KORZEN = pathlib.Path(__file__).resolve().parents[1] / "public" / "scena-3d"
PLIKI = ["scena3d.js", "scena3d.esm.js"]
KOPIA = ".bak-przed-karta"

# Polskie znaki jako \u….. - dokladnie tak, jak zapisuje je reszta bundla.
KARTA = (
    '{id:"karty",file:"karta",label:"Pami\\u0119\\u0107 M\\u0119drca",'
    'toast:"Karty M\\u0119drca \\u2014 dobierz pary",pos:[3,2.6],scale:1.3,'
    "height:1.15,glow:8015298,ringColor:13148400,haloOpacity:.2,haloScale:1.2,"
    "ringOpacity:.22,lightBase:0,metalness:0,roughness:.85,jasnosc:1.7,"
    "absorb:!0,absorbLift:1.7,respawn:3.2}"
)
WZOR_MEDAL = re.compile(r'\{id:"medal",file:"medal".*?respawn:3\.2\}')


def cofnij():
    for nazwa in PLIKI:
        kopia = KORZEN / (nazwa + KOPIA)
        if not kopia.exists():
            print(f"{nazwa}: brak kopii {KOPIA} - pomijam")
            continue
        (KORZEN / nazwa).write_bytes(kopia.read_bytes())
        print(f"{nazwa}: przywrocone z {KOPIA}")


def zalataj():
    for nazwa in PLIKI:
        plik = KORZEN / nazwa
        tekst = io.open(plik, encoding="utf-8").read()

        if '{id:"karty"' in tekst and not WZOR_MEDAL.search(tekst):
            print(f"{nazwa}: juz zalatane")
            continue

        # Lambda, nie zwykly string: `re` interpretowaloby `ę` w tekscie
        # zastepczym jako sekwencje ucieczki i wywalalo sie na "bad escape".
        nowy, ile = WZOR_MEDAL.subn(lambda _: KARTA, tekst, count=1)
        if ile == 0:
            sys.exit(f"{nazwa}: nie znalazlem definicji medalu - bundle sie zmienil, sprawdz recznie")

        kopia = KORZEN / (nazwa + KOPIA)
        if not kopia.exists():
            kopia.write_bytes(plik.read_bytes())

        io.open(plik, "w", encoding="utf-8", newline="").write(nowy)
        print(f"{nazwa}: medal -> karty")

    print("\nPAMIETAJ: podbij WERSJA_SCENY w src/components/Scena3D.jsx,")
    print("bo pliki w public/ nie maja hasha i przegladarka poda stary bundle.")


if __name__ == "__main__":
    cofnij() if "--cofnij" in sys.argv else zalataj()
