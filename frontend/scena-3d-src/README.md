# scena-3d-src — źródła sceny 3D (planeta)

Od 2026-09-09 scena 3D EwolucJA ma **kod źródłowy**. Koniec ery łatek na
zminifikowanym bundlu: zmiany robi się tutaj, a `build.mjs` generuje
`public/scena-3d/scena3d.esm.js` (dla Reacta) i `scena3d.js` (podgląd
`/scena-3d/`).

```bash
cd frontend
node scena-3d-src/build.mjs          # produkcja — minifikacja, ~640 kB
node scena-3d-src/build.mjs --dev    # bez minifikacji, mapa źródeł inline (4 MB)
node scena-3d-src/build.mjs --watch  # przebudowa przy każdej zmianie
```

`esbuild` i `three` biorą się z `frontend/node_modules` (już tam są).
Build uruchamiaj w **cmd na Windowsie** (esbuild ma binarkę per system;
w linuksowym VM Cowork'a windowsowa binarka nie wstanie).

**Po każdej przebudowie podbij `WERSJA_SCENY`** w `src/components/Scena3D.jsx` —
pliki w `public/` nie mają hasha, bez tego przeglądarka poda scenę z cache.

## Świat jest kulą — jak to działa

Decyzja z 2026-09-09: mapa to planeta („tiny planet"), kamera izometryczna jak
dawniej, kula obraca się pod liskiem na wszystkie strony, lisek ma mały
margines własnego ruchu po ekranie.

**Zasada nr 1: DANE i większość logiki są PŁASKIE, ale bohater chodzi po
sferze.** Mapa (`mapa.json`), edytor, ścieżka, most, pozycje znaków,
respawny — wszystko w układzie (x, z), jak przed planetą. Sam bohater ma
jednak stan sferyczny: normalną `hn` (punkt kuli) i styczną `hf` (przód);
krok to obrót po wielkim kole (`Planeta.przesunPoKuli`), kolizje z drzewami,
głazami, domem i rzeką liczone są odległością w 3D (`canWalkN`), a odległość
do znaku — po powierzchni (`Planeta.odleglosc`). Dzięki temu **planetę da się
obejść dookoła**, także przez antypod, gdzie płaskie rozwinięcie mapy się
zwija. Współrzędne mapy bohatera (`hp`) są pochodne (`aktualizujHp`) i służą
znakom, ścieżce, mostowi i API (`stan()`, `bohater:doszedl`).
Granicę chodzenia `swiat.promien` włącza się z powrotem flagą
`swiat.tylkoMapa: true` w `mapa.json` (domyślnie wyłączona).

**Rzut** (`src/planeta.js`): azymutalny równoodległościowy ze środka mapy.
Punkt w odległości `r` od środka trafia na kulę w odległości kątowej `r / R`
od bieguna, w tym samym azymucie. Odległości od środka są prawdziwe; odległości
styczne kurczą się mnożnikiem `sin(a)/a` (90° → 0,64; 140° → 0,37). Skraj
mapy widać zza horyzontu jako tło, więc to nie przeszkadza.

`Planeta` daje trzy operacje:

| metoda | co robi |
|---|---|
| `naKule(x, z, h)` | punkt mapy → wektor w układzie planety (h = wysokość nad ziemią) |
| `ramka(x, z)` | kwaternion „co tu jest górą, co przodem" (na biegunie identyczność) |
| `ustaw(obj, x, z, h, obrotY)` | stawia obiekt three.js na kuli — zamiennik dawnego `position.set(x, y, z); rotation.y = …` |
| `zKuli(v)` | odwrotność: punkt kuli → `{x, z, h}` (używa raycast dotknięcia) |
| `obrotPodPunkt(x, z)` | kwaternion planety, przy którym punkt (x, z) jest u góry i jego ramka pokrywa się z osiami świata |

**Obrót planety** (`app.js`, `tick`): jak kula śledząca (trackball) —
co klatkę liczymy najmniejszy obrót, który przenosi aktualną „górę" bohatera
na +Y świata (`setFromUnitVectors`), i `slerp`-ujemy kwaternion grupy świata
w tę stronę z tempem `TEMPO_OBROTU` (3,2/s). Opóźnienie to właśnie „mały
margines" — lisek odjeżdża trochę od środka, planeta go dogania. Trackball
nie skręca wokół pionu, więc nie ma osobliwości; ceną jest to, że po
pętli wokół planety „mapowa północ" może być obrócona (jak w Mario Galaxy).
Start jest ustawiany „północą do góry" (`obrotPodPunkt`), a
`korektaPolnocy()` powoli dokręca mapę z powrotem do północy (wolniej w
ruchu, szybciej w spoczynku; wygasa blisko antypodu, gdzie ramka mapy jest
osobliwa). Stałe: `KOREKTA_W_RUCHU`, `KOREKTA_W_SPOCZYNKU`.

**Bohater** jest dzieckiem grupy planety: `syncHero()` stawia go przez
`planeta.ustawN(hero, hn, hf, heroLift)`. Kierunek z joysticka (układ
kamery) przelicza `stycznaZeSwiata()` — cofa obrót planety i rzutuje na
płaszczyznę styczną w punkcie bohatera, więc „w górę ekranu" znaczy to samo
niezależnie od tego, gdzie na kuli stoi lisek. Obrót przodu: `obrocKu()`.

**Teren** (`swiat.js → zbudujTeren`): `SphereGeometry` z UV liczonymi
odwrotnym rzutem — ta sama płaska tekstura (trawa, rzeka, ścieżka, gałęzie),
co dawniej, owinięta na kulę. Poza `swiat.teren` tekstura przypina się do
brzegu (trawa). **Stała szerokość ścieżki i rzeki:** rzut ściska wymiary
styczne (sin(a)/a), więc `kreskaNaKuli` maluje każdy odcinek jako czworokąt
poszerzony w poprzek o odwrotność ściśnięcia (`poszerzenieNaKuli`), a łączniki
jako elipsy (koło na kuli = elipsa w płaskiej teksturze). Nurt rzeki: brzegi
wstęgi odsuwane od osi PO KULI o stałe `NURT.SZEROKOSC`. Zbieganie się
dalekich pętli rzeki przy antypodzie zostaje — to cecha rzutu; leczy je
tylko większy `promienKuli`.

**Promień kuli**: `mapa.json → swiat.promienKuli` (suwak w edytorze,
sekcja „Świat"). Domyślnie liczony tak, żeby `swiat.promien` (granica
chodzenia) zajmował ~100° od bieguna (≈ 8 przy promieniu 14). Do strojenia
bez zapisu: `/scena-3d/?kula=12`. Mniejsza liczba = mniejsza planeta.

**Kamera**: `ZOOM_DOMYSLNY` w `app.js` (0,8 — 1 to kadr pierwotnej płaskiej
sceny, mniej = dalej) i `KAMERA_PODNIESIENIE` (-2 — punkt patrzenia
względem wierzchołka kuli: ujemne podnosi planetę na ekranie, dodatnie
spycha ją w dół; strojenie na żywo: `globalThis.SCENA3D_KAMERA_PODNIESIENIE`
ustawione przed startem sceny). React nadpisuje przez `globalThis.SCENA3D_ZOOM`
(`ZOOM_DOMYSLNY` w `components/Scena3D.jsx`), podgląd przez `?zoom=`.

## Pliki

| plik | co |
|---|---|
| `src/planeta.js` | matematyka kuli (patrz wyżej) |
| `src/mapa.js` | czytanie `__SCENA3D_MAPA` + wartości zapasowe prototypu |
| `src/swiat.js` | teren, nurt rzeki, most, latarnia, brama, drzewa, głazy, kwiaty (InstancedMesh), plamy cienia |
| `src/znak.js` | klasa `Znak` — halo, krąg ze smugą, iskry, cykle absorb/gone/appear, wędrówka czarodzieja |
| `src/app.js` | `Aplikacja`: renderer, kamera, bohater (kalibracja stóp, run→walk), joystick/klawiatura/dotknięcie, gibanie drzew i kwiatów, kino, API |
| `src/postacie.js` | rejestr `SCENA3D_POSTACIE` (chłopiec, lis) |
| `src/ui.js` | CSS i szkielet HTML sceny |
| `src/index.js` | `utworzScena3D`, `zarejestrujElement`, `mostIframe`, `ZDARZENIA` |
| `src/autostart.js` | wejście `scena3d.js` (podgląd `/scena-3d/`) |

Wszystko, co dawniej siedziało w skryptach-łatkach `narzedzia/*.py`
(czarodziej, nurt rzeki, gałęzie ścieżki, gibanie drzew, kwiaty, cień pod
nogi, znak-drzewo, próg domu, mrok w chatce, drzwi w kolizji, kino, smuga
kręgu), jest teraz zwykłym kodem w tych plikach. Skrypty zostały jako
historia — **nie uruchamiaj ich na nowym bundlu**.

## Kontrakt z Reactem (nie zmieniaj bez sprawdzenia użyć)

- zdarzenia: `gotowa`, `minigra:start`, `znak:dotkniety`, `bohater:doszedl`,
  `latarnia:reakcja`, `pauza`, `wznowienie`, `zniszczona`, `blad`, `kino`
- metody: `pauza`, `wznow`, `ustawBohatera(x, z)` (układ mapy),
  `ustawSpokojnyRuch`, `ustawPowrotZnaku`, `pokazZnak`, `kino`, `kinoSkroc`,
  `stan`, `zniszcz`
- `_app` (instancja `Aplikacja`): `hub/znakiMapy.js` czyta `markers[]` →
  `id/state/phase/def.respawn/def.respawnPierwszy/setVisible`;
  `hub/krokiBohatera.js` czyta `current`, `actions`, `paused`, `destroyed`;
  `hub/DevRezyserka.jsx` czyta `markers[].mapa` ({x, z} w układzie mapy —
  dawniej `root.position`, które teraz jest punktem na kuli);
  `components/Scena3D.jsx` — `heroShadow` (już poprawiony u źródła,
  `userData.dopracowany`)
- globale wejściowe: `__SCENA3D_MAPA`, `SCENA3D_POSTAC`, `SCENA3D_ZOOM`,
  `SCENA3D_PROMIEN_KULI`, `__SCENA3D_ZASOBY` (tylko autostart)
- globale wyjściowe: `__POC` (debug: `pos()`, `setInput()`, `markers()`,
  `planeta()`…), `__SCENA` (API)

## Testy bezgłowe

Playwright + chromium ze swiftshaderem widzi stan po wczytaniu, pozycje,
geometrię. Pętla renderowania w bezgłowym Chromium staje po kilku klatkach,
więc ruch symuluje się ręcznie:

```js
const a = __POC.app; a._kino = null; a.clock.getDelta = () => 1/60;
__POC.setInput(0, 1); for (let i = 0; i < 150; i++) a.tick();
__POC.pos(); __POC.planeta();   // pozycja na mapie, kwaternion planety
```

Cykle czasowe (respawny, kino, nurt) — tylko w prawdziwej przeglądarce.

## Czego jeszcze nie ma / na później

- `podglad-offline.html` (wersja jednoplikowa z modelami w base64) pochodzi
  jeszcze z płaskiej sceny — do przegenerowania, gdy będzie potrzebna.
- Krzywizna w edytorze: plan 2D pokazuje mapę płaską; przy skraju (>90° od
  środka) rzeczy na kuli są bliżej siebie, niż sugeruje plan.
- Antypod (tył kuli) to gładka trawa — miejsce na drugą krainę.
