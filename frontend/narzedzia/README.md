# narzedzia — łatki na zbudowany moduł sceny

Scena 3D (`public/scena-3d/scena3d.js` i `scena3d.esm.js`) jest **zminifikowanym
bundlem**, a nie kodem źródłowym. Zmian nie da się w nim czytać z diffa, więc
każda wchodzi przez skrypt, który podmienia konkretne łańcuchy i **przerywa
pracę, jeśli wzorzec nie trafi dokładnie raz**. Skrypty są jedyną czytelną
dokumentacją tego, co siedzi w bundlu ponad oryginalny build.

Leżą tutaj, a nie w `public/`, bo wszystko z `public/` trafia do produkcji —
narzędzia deweloperskie nie mają po co jechać do przeglądarki dziecka.

Uruchamianie z katalogu `frontend`:

```bash
python3 narzedzia/czarodziej-lata-modul.py public/scena-3d/scena3d.js public/scena-3d/scena3d.esm.js
python3 narzedzia/czarodziej-strojenie.py public/scena-3d/scena3d.js public/scena-3d/scena3d.esm.js
```

| skrypt | co robi | powtarzalny |
|---|---|---|
| `czarodziej-lata-modul.py` | Dokłada czarodzieja: mikser animacji dla znaków, cykl znikania po czasie, losowe miejsce przy powrocie, własny promień zasięgu, dotknięcie raz na podejście, API `schowajZnak`. | **nie** — druga próba zgłosi 0 trafień i przerwie |
| `czarodziej-strojenie.py` | Podmienia całą definicję znaku czarodzieja (skala, jasność, lewitacja, rytm) i uzależnia promień uzbrojenia od definicji. | tak — nadpisuje poprzednie wartości |
| `cien-pod-nogi.py` | Przesuwa cień bohatera do przodu, w stronę patrzenia (`heading`), zamiast trzymać go pod środkiem modelu. | tak — wzorzec łapie też wartość już ustawioną, więc da się stroić |

Po każdej zmianie w bundlu **podbij `WERSJA_SCENY`** w
`src/components/Scena3D.jsx`. Pliki w `public/` nie mają hasha w nazwie, więc
bez tego przeglądarka poda z cache starą scenę. Numer ma tylko rosnąć.

## `przemaluj-piorko.py` — złota barwa piórka na mapie

Piórko (`public/scena-3d/assets/lisc.glb`, znak `leaf`) przychodziło
z generatora z beżowo-szarą teksturą — na mapie czytało się jako
„za delikatne", a misja obiecuje **złote** piórko. Skrypt mapuje luminancję
tekstury na rampę złota (cień → środek → światło), więc rysunek i cieniowanie
zostają, zmienia się wyłącznie barwa.

```bash
python narzedzia/przemaluj-piorko.py                    # przemaluj model
python narzedzia/przemaluj-piorko.py --podglad out.png  # tylko podgląd tekstury
python narzedzia/przemaluj-piorko.py --kontrast 1.3     # mocniejsze kontrasty
```

Dwie rzeczy, o które skrypt dba sam i o których łatwo zapomnieć przy ręcznej
podmianie:

* **format tekstury.** Model deklaruje WEBP przez `EXT_texture_webp` —
  wstawienie w to miejsce PNG-a zostawiłoby `mimeType` niezgodny z zawartością
  i tekstura nie wczytałaby się wcale.
* **offsety.** Nowy obrazek prawie nigdy nie ma tej samej długości, więc bufor
  składany jest od nowa (z wyrównaniem do 4 bajtów), a `bufferView` dostają
  przepisane offsety. Kopia oryginału ląduje obok, jako `.bak-przed-zlotem`.

Rozmiar i poświata piórka siedzą w `public/scena-3d/mapa.json` (znak `leaf`):
`scale`, `height`, `glow`, `ringColor`, `haloOpacity`, `haloScale`. Mapa jest
pobierana `no-cache`, więc zmiany w niej widać po odświeżeniu — ale sam
`.glb` idzie zwykłym cache'em przeglądarki i po przemalowaniu bywa potrzebne
twarde odświeżenie (Ctrl+Shift+R).

## `galezie-sciezki.py` — odnogi ścieżki w scenie 3D

Scena zna dokładnie jedną ścieżkę: tablicę punktów z `mapa.json`. Edytor mapy
potrafi teraz dokładać do niej gałęzie (`mapa.galezie`), ale zminifikowany
bundle nic o nich nie wie — bez tej łatki odnogi widać tylko na planie
w edytorze, a w grze trawa zostaje pusta.

```bash
python narzedzia/galezie-sciezki.py     # idempotentne, drugi raz nic nie zrobi
```

Łatka wstrzykuje się zaraz po namalowaniu głównej ścieżki i powtarza ten sam
zestaw kroków (obrys → wypełnienie → płytki) dla każdej gałęzi, mnożąc grubość
przez jej `szerokosc`. Trasa bohatera, latarnia i most czytają wyłącznie
`sciezka`, więc gałąź niczego w rozgrywce nie zmienia.

**Po każdej podmianie bundla trzeba ją nałożyć ponownie** i podbić
`WERSJA_SCENY` w `src/components/Scena3D.jsx`.

## `znak-drzewo-spokoj.py` — spokojna sosna Lotu Liska

Znak „wysokiej sosny" jest jedynym DUŻYM znakiem na mapie (`scale` 5,6 wobec
1–1,9 u reszty), a animacja znaku jest jedna dla wszystkich. Przy tej skali
przestaje działać: oddech skali (+8% na podejście bohatera, +40% przy
dotknięciu) czyta się jak migotanie, a delikatne unoszenie odrywa drzewo od
trawy. Łatka dokłada bundlowi dwa parametry definicji znaku:

| pole | co robi |
|---|---|
| `oddechSkali` | mnożnik obu składników oddechu skali (domyślnie 1). Sosna ma 0,25: +2% i +10% zamiast +8% i +40% |
| `barwaMnoznik` | hex mnożony przez WŁASNE kolory modelu, kanał po kanale |

`bezUnoszenia` bundle znał już wcześniej — brakowało go tylko w mapie.

Po co osobny mnożnik barwy: `barwa` zamalowuje model jednym kolorem (pień
razem z igłami), a `jasnosc` to skalar — żadne z nich nie przesuwa samego
odcienia. Mnożnik przesuwa: igły idą z matowego `#44896f` na świeższe
`#48a569`, wciąż zielone, ale odklejone od tła polany.

```bash
python narzedzia/znak-drzewo-spokoj.py     # idempotentne
```

**Po każdej podmianie bundla trzeba ją nałożyć ponownie** i podbić
`WERSJA_SCENY` w `src/components/Scena3D.jsx`.

## `znak-drzewo-bujanie.py` — dotknięcie sosny ją kołysze

Dotknięcie znaku odpalało jeden efekt dla wszystkich: `punch` rozdmuchiwał znak
o 40% i podnosił go. Przy karcie to sprężysty pyk, przy sośnie wielkości pół
ekranu — pompka. Drzewo, w które ktoś wbiegł, ma się zakołysać.

| pole | co robi |
|---|---|
| `bujanie` | amplituda kołysania w radianach. Sosna ma 0,21 → pierwsze wychylenie 8°, wygaszone po 1,9 s |
| `oddechDotyku` | osobny mnożnik skoku skali PRZY DOTKNIĘCIU (domyślnie tyle, co `oddechSkali`). Sosna ma 0 |

Kołysanie idzie po tłumionej sinusoidzie `bujanie · e^(−2,6t) · sin(9,2t)` —
ten sam kształt, co drgania drzew na mapie, tylko liczony wprost, bo znak nie
jest ich częścią.

**Oś kołysania jest u podstawy, nie w pasie.** Loader centruje model na środku
jego bryły, więc samo `rotation.z` obracałoby drzewo wokół połowy wysokości —
pień jeździłby po trawie tak samo jak czubek. Łatka dolicza przesunięcie
sprowadzające podstawę na miejsce: `x = −H·sin(kąt)`, `y = −H·(1−cos(kąt))`,
gdzie `H = 0,275 · scale`. Sprawdzone symulacją: czubek wychyla się o 0,43
jednostki, podstawa nie rusza się ani o tysięczną.

Przy okazji `bezUnoszenia` wycisza też PODSKOK przy dotknięciu — flaga mówi
„ten znak nie odrywa się od trawy" i dotknięcie nie jest wyjątkiem.

```bash
python narzedzia/znak-drzewo-spokoj.py     # najpierw (dokłada `oddechSkali`)
python narzedzia/znak-drzewo-bujanie.py    # potem; obie idempotentne
```
