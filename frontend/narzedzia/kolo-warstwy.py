"""
buduj-kolo — rozbicie ilustracji koła fortuny na warstwy UI.

WEJŚCIE:  narzedzia/zrodla/kolo-fortuny.png (ilustracja: rama + kliny + piasta
          + wskaźnik, przezroczyste tło)
WYJŚCIE:  public/assets/kolo/*.png — cztery warstwy na WSPÓLNYM płótnie
          1024×1024, ze środkiem koła dokładnie w środku płótna.

DLACZEGO WSPÓLNE PŁÓTNO. Każda warstwa jest tym samym kwadratem, więc w kodzie
kładzie się je jedna na drugiej (`position:absolute; inset:0`) i nic nie trzeba
pozycjonować. Obrót tarczy to `transform-origin: 50% 50%` — bez magicznych
liczb, bo środek koła leży w środku pliku.

DLACZEGO TARCZA JEST RYSOWANA, A NIE WYCINANA. Kliny w ilustracji mają
zmierzone 69,7–77,3 stopnia zamiast równych 72 (generator obrazu nie liczy
geometrii). Obrót o wielokrotność 72 stopni rozjeżdżałby się ze wskaźnikiem
o kilka stopni, a to widać. Rama, piasta i wskaźnik są czystą dekoracją i
zostają z ilustracji — geometria musi być policzona.
"""
import math, sys, pathlib
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ZRODLO = sys.argv[1] if len(sys.argv) > 1 else str(pathlib.Path(__file__).resolve().parent / "zrodla" / "kolo-fortuny.png")
WYJSCIE = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else pathlib.Path(__file__).resolve().parents[1] / "public" / "assets" / "kolo"
WYJSCIE.mkdir(parents=True, exist_ok=True)

BOK = 1024        # bok płótna wyjściowego
SS = 3            # nadpróbkowanie przy rysowaniu tarczy

# ── zmierzone w ilustracji (patrz README) ───────────────────────────────
CX, CY = 624.6, 644.2      # środek koła
R_DREWNO_ZEW = 574.0       # zewnętrzna krawędź drewnianej ramy
R_DREWNO_WEW = 517.0       # tam zaczynają się kliny
R_PIASTA = 128.0           # złota obręcz ze środka

KLINY = [
    ("ciekawosc",  (8, 159, 242)),
    ("tworzenie",  (142, 58, 213)),
    ("wspolpraca", (122, 183, 20)),
    ("odwaga",     (238, 51, 39)),
    ("wytrwalosc", (253, 156, 1)),
]
SZCZELINA_KOLOR = (253, 243, 214)
SZCZELINA_PX = 6.0          # szerokość jasnej szczeliny między klinami @1024


def gladko(x, a0, a1):
    t = np.clip((x - a0) / (a1 - a0), 0, 1)
    return t * t * (3 - 2 * t)


def wczytaj():
    im = Image.open(ZRODLO).convert("RGBA")
    return np.asarray(im).astype(float)


def maski(a):
    h, w = a.shape[:2]
    Y, X = np.mgrid[0:h, 0:w]
    R = np.hypot(X - CX, Y - CY)
    alfa = a[..., 3] > 10
    rgb = a[..., :3]
    dyst = np.min(np.stack([np.linalg.norm(rgb - np.array(k), axis=2) for _, k in KLINY]), axis=0)
    klin = dyst < 55

    # PIASTA: spójny obszar wokół środka, który nie jest klinem. Promień
    # docina „pajęcze nogi" — jasne szczeliny między klinami też nie są
    # klinem, więc bez tego wychodziłyby ze środka na zewnątrz.
    lab, _ = nd.label((R < 210) & alfa & ~klin)
    # Cięcie DOKŁADNIE na `R_PIASTA`, ani piksela dalej: zmierzone barwy klinów
    # sięgają w ilustracji aż do promienia 103/1024, więc luźniejszy promień
    # zostawiał wokół piasty kolorową obwódkę — widać ją w grze jako cienki
    # niebiesko-czerwony pierścień przy guziku.
    piasta = nd.binary_fill_holes(lab == lab[int(CY), int(CX)]) & (R < R_PIASTA - 4)
    piasta = nd.binary_fill_holes(nd.binary_dilation(piasta, np.ones((5, 5)))) & alfa & (R < R_PIASTA)

    # WSKAŹNIK: złoty komponent u góry + to, co wystaje poza koło tuż przy nim.
    zloto = (a[..., 0] > 205) & (a[..., 1] > 145) & (a[..., 2] < 150) & alfa & (Y < CY - 430) & (np.abs(X - CX) < 170)
    lab, n = nd.label(zloto)
    pola = nd.sum(zloto, lab, range(1, n + 1))
    sr = nd.center_of_mass(zloto, lab, range(1, n + 1))
    best = max((i for i in range(1, n + 1) if pola[i - 1] > 300),
               key=lambda i: pola[i - 1] - abs(sr[i - 1][1] - CX) * 20)
    w1 = nd.binary_fill_holes(lab == best)
    w1 = nd.binary_fill_holes(nd.binary_dilation(w1, np.ones((13, 13))))
    wskaznik = nd.binary_fill_holes((w1 | ((R > R_DREWNO_ZEW + 2) & (Y < CY - 400) & (np.abs(X - CX) < 95))) & alfa)
    return R, piasta, wskaznik


def na_plotno(a, maska_f):
    """Wycina warstwę i przenosi ją na kwadratowe płótno ze środkiem koła w środku."""
    out = a.copy()
    out[..., 3] = out[..., 3] * maska_f
    im = Image.fromarray(np.clip(out, 0, 255).astype("uint8"))
    h, w = a.shape[:2]
    pol = int(math.ceil(max(CX, w - CX, CY, h - CY))) + 4
    plotno = Image.new("RGBA", (pol * 2, pol * 2), (0, 0, 0, 0))
    plotno.paste(im, (int(round(pol - CX)), int(round(pol - CY))))
    return plotno.resize((BOK, BOK), Image.LANCZOS), pol


def tarcza(skala):
    n = BOK * SS
    c = n / 2
    y, x = np.mgrid[0:n, 0:n].astype(float)
    dx, dy = x - c + .5, y - c + .5
    r = np.hypot(dx, dy)
    # 0° = pion w górę, rośnie zgodnie z ruchem wskazówek — tak samo liczy
    # obrót CSS, więc kod gry i grafika mówią jednym językiem.
    kat = np.degrees(np.arctan2(dx, -dy)) % 360

    rz = R_DREWNO_WEW * skala * SS
    # Dziura tarczy WYRAŹNIE mniejsza od piasty (16 px zapasu w jednostkach
    # ilustracji), żeby po zaokrągleniach nie prześwitywała szczelina.
    rw = (R_PIASTA - 16) * skala * SS
    krok = 360 / len(KLINY)
    # Środek klinu 0 patrzy prosto w górę: obrót o k·72° stawia k-ty klin
    # pod wskaźnikiem.
    idx = np.floor(((kat + krok / 2) % 360) / krok).astype(int)

    obraz = np.zeros((n, n, 4), float)
    for i, (_, kolor) in enumerate(KLINY):
        obraz[idx == i, :3] = kolor

    swiatlo = 0.93 + 0.14 * np.clip((-dx - dy) / (2 * rz) + .5, 0, 1)
    obrzeze = 1 - 0.10 * np.clip((r - rz * .78) / (rz * .22), 0, 1) ** 2
    polysk = 0.10 * np.exp(-(((dx / (rz * .62)) ** 2 + ((dy + rz * .42) / (rz * .30)) ** 2)))
    obraz[..., :3] = np.clip(obraz[..., :3] * (swiatlo * obrzeze)[..., None] + polysk[..., None] * 255, 0, 255)

    # Odległość do NAJBLIŻSZEJ granicy (samo `% krok` zeruje się w połowie
    # klinu i rysowało dodatkową kreskę przez środek).
    u = (kat + krok / 2) % krok
    odl = np.radians(np.minimum(u, krok - u)) * np.maximum(r, 1)
    obraz[odl < (SZCZELINA_PX * SS / 2), :3] = SZCZELINA_KOLOR
    obraz[..., 3] = np.where((r <= rz) & (r >= rw), 255, 0)
    return Image.fromarray(obraz.astype("uint8")).resize((BOK, BOK), Image.LANCZOS)


def main():
    a = wczytaj()
    R, piasta, wskaznik = maski(a)
    rama_m = np.where(wskaznik, 0.0, gladko(R, R_DREWNO_WEW - 1.5, R_DREWNO_WEW + 1.5)) * (1 - gladko(R, R_DREWNO_ZEW + 4, R_DREWNO_ZEW + 8))
    piasta_m = nd.gaussian_filter(piasta.astype(float), .7)
    wskaznik_m = nd.gaussian_filter(wskaznik.astype(float), .8)

    warstwy = {"kolo-rama": rama_m, "kolo-piasta": piasta_m, "kolo-wskaznik": wskaznik_m}
    pol = None
    for nazwa, m in warstwy.items():
        im, pol = na_plotno(a, m)
        im.save(WYJSCIE / f"{nazwa}.png")
        print(f"{nazwa+'.png':22s} {im.size}")

    skala = BOK / (2 * pol)
    t = tarcza(skala)
    t.save(WYJSCIE / "kolo-tarcza.png")
    print(f"{'kolo-tarcza.png':22s} {t.size}   (rysowana, 5 × 72°)")
    print(f"\nskala {skala:.4f} → promień drewna {R_DREWNO_ZEW*skala:.0f} px, "
          f"tarcza {R_DREWNO_WEW*skala:.0f} px, piasta {R_PIASTA*skala:.0f} px @ {BOK}")


if __name__ == "__main__":
    main()
