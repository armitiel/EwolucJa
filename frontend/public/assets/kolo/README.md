# Koło Przeznaczenia — assety

Podgląd z działającym kręceniem: **`/kolo-podglad.html`** (przy `npm run dev`).

## Warstwy koła — wspólne płótno 1024×1024

Cztery pliki PNG, każdy tego samego rozmiaru, ze **środkiem koła dokładnie
w środku pliku**. W kodzie kładzie się je jedna na drugiej i nic nie trzeba
pozycjonować:

```css
.kolo{ position:relative; width:86%; aspect-ratio:1 }
.kolo > *{ position:absolute; inset:0; width:100%; height:100% }
```

| plik | rola | obraca się |
|---|---|---|
| `kolo-tarcza.png` | pięć klinów po 72°, dziura pod piastę | **TAK** |
| `kolo-piasta.png` | złota obręcz z drewnianym guzikiem | nie |
| `kolo-rama.png` | drewniana obręcz, leży NAD tarczą | nie |
| `kolo-wskaznik.png` | trójkąt z uszami na godzinie 12 | nie |

Kolejność w DOM: tarcza → piasta → rama → wskaźnik.

### Dlaczego tarcza jest rysowana, a nie wycięta z ilustracji

Kliny w ilustracji źródłowej mają zmierzone **69,7–77,3°** zamiast równych 72
(generator obrazu nie liczy geometrii). Obrót o wielokrotność 72° rozjeżdżałby
się ze wskaźnikiem o kilka stopni i to widać. Rama, piasta i wskaźnik są czystą
dekoracją, więc zostały z ilustracji; tarczę rysuje
`narzedzia/kolo-warstwy.py` — ten sam skrypt, który wycina resztę warstw
ze źródła w `narzedzia/zrodla/kolo-fortuny.png`.

### Geometria (w ułamku boku pliku)

| co | promień |
|---|---|
| zewnętrzna krawędź drewna | 44,2% |
| wewnętrzna krawędź drewna = brzeg tarczy | 39,8% |
| piasta | 9,9% |

## Losowanie

Klin `k` ma środek na `k · 72°` od góry, zgodnie z ruchem wskazówek
(kolejność: Ciekawość, Tworzenie, Współpraca, Odwaga, Wytrwałość).
Wynik losujemy **przed** animacją — animacja tylko go pokazuje:

```js
const k = losuj(0, 4);
const kat = 360 * obroty - k * 72 + rozrzut;   // rozrzut ±22°, mniej niż pół klina
```

Wyhamowanie: `cubic-bezier(.15,.65,.08,1)` przez 3,4 s (w grze; podgląd HTML
używa własnego, prostszego wyhamowania na `requestAnimationFrame`).

## Dźwięk i efekt wyniku

**Tyk koła jest syntezowany, nie z pliku** (`services/soundFx.js` → `tykKola`).
Dźwięk kręcącego się koła to nie próbka, tylko RYTM: kołek uderza o każdy
mijany klin, więc stuknięcia same zwalniają razem z tarczą. Pętla z pliku
musiałaby zmieniać tempo w locie i tak czy owak rozjechałaby się z animacją.
Barwa: krótki szum przez wąskie pasmo ~1,8 kHz — brzmi jak drewno, a koło
w grze jest drewniane.

Momenty tyknięć liczy `rozkladTykow` w `hub/KoloFortuny.jsx`. Koło jedzie na
przejściu CSS, więc nie ma kąta klatka po klatce — zamiast przerabiać animację
na `requestAnimationFrame` (i tracić płynność GPU), funkcja ODWRACA krzywą
`cubic-bezier` i dla każdej mijanej granicy pól liczy, w którym ułamku czasu
przejście osiągnie ten kąt. Wychodzi 28 tyknięć: pierwsze co 26 ms, ostatnie
co 793 ms, głośność od 1,0 do 0,12.

Po zatrzymaniu: `fx.dopamine` (ta sama nagroda, co na innych ekranach) plus
trzy krótkie animacje — rozbłysk z osi koła, dwanaście iskier lecących poza
obręcz i wskoczenie tytułu z ikoną wylosowanej cechy. Fajerwerk trafia do DOM
dopiero po zatrzymaniu, więc przez całe kręcenie nie ma ani jednej dodatkowej
animacji. Przy `prefers-reduced-motion` rozbłysk i iskry znikają całkiem.

## Etykiety klinów

Ikona i napis jadą **razem z tarczą**, więc leżą w obracanym pudełku. Każda
etykieta to cały kwadrat obrócony o kąt środka klina, z treścią przy górnej
krawędzi. Kliny w dolnej połowie (144° i 216°) dostają klasę `odwrocona`:
pudełko obraca się o dodatkowe 180°, a treść przechodzi na dolną krawędź —
wraca na ten sam klin, ale czyta się normalnie, i ikona nie staje na głowie.

## Reszta ekranu

| plik | rola |
|---|---|
| `baner-tytul.webp` | tabliczka nagłówka; pergamin w pliku: x 20–79%, y 31–74% |
| `wstazka-podtytul.webp` | wstążka pod tytułem; pergamin: x 23–77%, y 41–62% |
| `przycisk-cta.webp` | zielony przycisk |
| `przycisk-zamknij.webp` | okrągły przycisk ×; krążek pergaminu na 47% / 44% |
| `kolo-podstawa.webp` | pieniek pod kołem |
| `lisek.webp` | maskotka |
| `tlo-las.webp` | tło panelu (nieprzezroczyste, środek celowo pusty) |
| `ikona-*.webp` | pięć ikon kategorii |

## Ikony mają być czytelne, nie ładne

Pierwsza tura ikon wyszła jako pełne ilustracje: skrzynia z latarnią
i zwiniętym śpiworem, paleta z pędzlem, łapki z sercem, listki, iskierki.
Ładne — i nieczytelne, bo na klinie ikona ma jakieś 40 px i cały ten detal
zlewał się w plamę.

Ikony mają więc **własne DNA** w `scripts/assety-kolo.py` (stała `IKONA`),
osobne od malarskiego opisu reszty ekranu: jeden przedmiot, gruby ciemny obrys,
najwyżej trzy płaskie kolory, zero gradientów, cieni i dodatków. Kremowe
wypełnienie z ciemnym obrysem czyta się tak samo dobrze na wszystkich pięciu
klinach — a innych teł tu nie ma.

Sprawdzian jest jeden: zmniejsz ikonę do 40 px i połóż na kolorze klina.
Jeśli nie wiadomo, co to jest, jest za dużo szczegółów.

**Napisy są z HTML-a, nie z obrazków.** Tabliczki i przyciski wyszły z generatora
puste, więc tekst da się zmienić bez ruszania grafiki, a pola tekstowe są
wymierzone z assetów (liczby w tabeli wyżej).

## Skąd się to wzięło

```bash
python scripts/assety-kolo.py            # generuje elementy UI (gpt-image-1)
python frontend/narzedzia/kolo-warstwy.py   # rozcina koło na warstwy + rysuje tarczę
python frontend/narzedzia/kolo-porzadki.py  # przycina i skaluje: 25 MB → 0,8 MB
```

Pliki po generatorze mają 1024–1536 px i po 2 MB; `kolo-porzadki.py` przycina
je do faktycznej zawartości, skaluje do 2× rozmiaru wyświetlanego i zapisuje
jako WEBP (miękkie gradienty — PNG waży przy nich 5–10× więcej). Warstwy koła
zostają nietknięte, bo muszą mieć wspólne płótno.
