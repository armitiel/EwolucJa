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
