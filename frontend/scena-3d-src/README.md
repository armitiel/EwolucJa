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
| `src/swiat.js` | teren, nurt rzeki, most, latarnia, brama, drzewa, głazy, rośliny (InstancedMesh), plamy cienia |
| `src/chmury.js` | zmienne chmury 2.5D nadciągające od horyzontu w stronę widza |
| `src/motyle.js` | motyle latające wokół planety: dwa `InstancedMesh`, barwa w kolorze instancji, siadanie na kwiatach, płoszenie przez liska (niżej) |
| `src/znak.js` | klasa `Znak` — halo, krąg ze smugą, iskry, cykle absorb/gone/appear, wędrówka czarodzieja |
| `src/app.js` | `Aplikacja`: renderer, kamera, bohater (kalibracja stóp, run→walk), joystick/klawiatura/dotknięcie, gibanie drzew i kwiatów, kino, API |
| `src/postacie.js` | rejestr `SCENA3D_POSTACIE` (chłopiec, lis) |
| `src/ui.js` | CSS i szkielet HTML sceny |
| `src/index.js` | `utworzScena3D`, `zarejestrujElement`, `mostIframe`, `ZDARZENIA` |
| `src/autostart.js` | wejście `scena3d.js` (podgląd `/scena-3d/`) |
| `src/fasola.js` | Magiczna Fasola: ziarno (GLB), etapy podlewania, oczko wody, wspinaczka |
| `src/pnacze.js` | proceduralna roślina — **splot 4–5 osobnych pnączy** + grywalna wstęga (niżej) |
| `src/teren.js` | formy terenu (wzgórza, niecki) — jedna funkcja wysokości dla siatki i dla bohatera |
| `src/shader-terenu.js` | **proceduralna skóra planety** — plamy zieleni liczone w pikselu (niżej) |

Wszystko, co dawniej siedziało w skryptach-łatkach `narzedzia/*.py`
(czarodziej, nurt rzeki, gałęzie ścieżki, gibanie drzew, kwiaty, cień pod
nogi, znak-drzewo, próg domu, mrok w chatce, drzwi w kolizji, kino, smuga
kręgu), jest teraz zwykłym kodem w tych plikach. Skrypty zostały jako
historia — **nie uruchamiaj ich na nowym bundlu**.

### Chmury i dekoracje w2

Chmura składa się z 6–8 animowanych obłoków low-poly. Cztery chmury używają
łącznie jednego `InstancedMesh`; obłoki powoli zmieniają pozycję i proporcje,
przez co zmienia się cały obrys. Kamera jest ortograficzna, więc perspektywę
budują skala, rozsuwanie od punktu zbiegu i tor kończący się nad górną
krawędzią. Marsz bohatera przyspiesza nadejście chmur.

`mapa-w2.json` zawiera również stylizowane sosenki i drzewa liściaste z
fasetowanymi koronami. Skały mają trzy warianty: łamany monolit, niskie płyty
i gęste rumowisko. Wariant zmienia zarówno układ głównych brył, jak i liczbę
rozsypanych kamieni; duże skały mają ostre fasety, a tylko drobne kamienie są
łagodniejsze. Środek przy starcie bohatera pozostaje wolny, a obiekty mają
kolizje i cienie.

## Motyle — życie w powietrzu

`mapa.swiat.motyle` (liczba albo `{ ile, … }` z kluczami jak w `MOTYLE`
w `src/motyle.js`; brak wpisu = brak motyli, suwak jest w edytorze w sekcji
„Niebo, teren, kamera"). `/swiat` ma siedem — decyzja właściciela
2026-09-17: „mniej motyli, niech sobie śmigają wokół planety".

**Jak zbudowane.** Dwa `InstancedMesh` na wszystkie motyle: skrzydła (dwa na
motyla, jedna geometria — drugie to pierwsze w lustrze, skala −x) i tułowie.
Skrzydło to płaski wachlarz fasetek z barwą w wierzchołkach (ciemny brzeg,
kremowa plamka jaśniejsza od tła — wartości > 1 w atrybucie `color`),
a barwę całego motyla niesie `instanceColor`; Lambert mnoży jedno z drugim.
Zero tekstur, dwa rysunki na klatkę niezależnie od liczby motyli.
`frustumCulled = false`, bo kula obwiedni instancji nie zna ich pozycji.

**Gdzie żyją.** W grupie planety, w układzie mapy (x, z) + wysokość, na kulę
przez `naKule`/`ramka` jak wszystko inne. Pułap lotu liczy się z analitycznej
formy terenu (`formy.h`, tanio co klatkę), siadanie na ziemi — z miernika
siatki (`wysokoscGruntuSiatki`, raz na lądowanie), a kwiatek daje swoją
wysokość sam (`k.grunt + (k.h + 0,045)·skala`, patrz `odswiez` w `swiat.js`).
Zasięg: `0,9·promienTresci` (~115° od bieguna) — motyl znika za horyzontem
i wraca z drugiej strony.

**Zachowanie** (`aktualizuj(dt, hp, stanDoby, spokojnie)` z pętli `tick`):

- cel: 30 % kwiat z trzech najbliższych wolnych, 20 % punkt koło liska
  (dzięki temu w kadrze zwykle są dwa–trzy; nie bliżej niż `omijanie` + 0,6),
  reszta — daleki punkt gdziekolwiek w zasięgu (≥ 5 jednostek);
- lot: skręt do celu + meandrowanie sumą sinusów (losowanie co klatkę drga,
  sinusy falują), rytm „seria uderzeń (0,9–2 s) → szybowanie (0,4–1,1 s)"
  z odpowiednio wznoszeniem i opadaniem, średnio raz na `petlaCo` (22 s)
  pełna pętla; omija pnie z `blockers` i liska (`omijanie`);
- skrzydła: 2,6–3,6 Hz w locie (celowo wolno — prawdziwe 8–12 Hz to na
  ekranie drganie), od −17° do 80°; szybując rozłożone, na kwiatku złożone
  z „oddechem" 0,7 Hz;
- kwiatek: zejście z hamowaniem, lądowanie 0,55 s, odpoczynek 3–8 s, odlot;
  kwiat zajęty przez innego motyla i kwiat pod nosem liska (`ploszenie` +
  0,4) odpadają — bez tego motyl wpadał w pętlę siadania i zrywania się;
  przy siadaniu i odlocie kwiatek dostaje pchnięcie w `k.gib` (sprężynę
  liczy `_gibKwiaty` w app.js);
- LISEK („jak lisek jest blisko, motyl odlatuje" — właściciel, 2026-09-17):
  siedzący zrywa się, gdy lisek podejdzie bliżej niż `ploszenie` (2,4);
  lecący bliżej niż `omijanie` (2,2) wchodzi w UCIECZKĘ — co klatkę kurs OD
  liska, prędkość `max(predkoscUcieczki 2,2; 1,2 × tempo liska)` (biegnące
  dziecko go nie dogoni, idące tym bardziej), pułap +0,7, trzepot ×1,5, bez
  szybowania i pętli; trwa `ucieczkaCzas` (1,6 s) od ostatniego zbliżenia,
  a następny cel nie może być koło liska (`unikajLiska`). Tempo liska liczy
  się z przebytej drogi `hp`, jak w `dymki.js`;
- noc (`Doba.stan.noc > 0,5`): każdy nowy cel to najbliższy wolny kwiat albo
  trawa obok (nie staw — `formy.niecka`), odpoczynek nie odlicza; budzi tylko
  lisek, i to na chwilę;
- `prefers-reduced-motion`: pół tempa ruchu i trzepotu.

Motyle są częścią świata, nie zasobem: nic tu się nie zbiera i nic nie liczy,
czy dziecko je goni (`docs/OPIS_PROJEKTU.md`). `stan().motyle` i
`__POC.motyle()` dają `{ ile, lataja, siedza, uciekaja, noc }`.

**Test bezgłowy:** logika jest czystą matematyką na `Planeta`, więc chodzi
w Node bez WebGL — `new Motyle(new Group(), planeta, { ziarno, kwiaty:
{ lista }, … })` i tysiące `aktualizuj(1/60, hp, stan)`; sprawdzaj brak NaN,
zasięg, wysokości, liczbę lądowań. Sam wygląd — tylko w przeglądarce.

## Skóra planety — proceduralne plamy zieleni

`swiat.terenKanciasty` (liczba = gęstość podziału dwudziestościanu) buduje
kulę BEZ tekstury i bez `vertexColors`. Kolor liczy się w **pikselu**:
`shader-terenu.js` wchodzi w `MeshLambertMaterial` przez `onBeforeCompile`
i podmienia samo albedo.

Dlaczego nie `ShaderMaterial`: `doba.js` mnoży `ziemia.material.color`
(dzień → zorza → noc) i dodaje `emissive`, a przy `swiat.cienie` teren musi
mieć pełny łańcuch `shadowmap`/`fog`/`lights`. W Lambercie to wszystko jest
za darmo, a `diffuseColor.rgb *= barwa` zachowuje mnożnik doby dokładnie
tak, jak działał na `vColor`.

Wzór to value-noise 3D na hashu (bez tekstur, cztery oktawy), liczony
z **lokalnego** kierunku na kuli — plama jest przybita do planety i kręci
się razem z nią. Trzy warstwy: wielka plama (dwa tony zieleni), średnia
(szarozielone przetarcia) i drobna (kremowe rozjaśnienia, skupione tam,
gdzie zezwala warstwa średnia). Geometria niesie jeden atrybut —
`wysForma` — i z niego shader robi suchy wierzchołek wzgórza oraz piaskowy
brzeg i błotniste dno niecki. Zmiana palety NIE wymaga przebudowy siatki.

**Progi w shaderze są ciasne i przesunięte w dół, i tak ma być.** Szum
wartościowy skupia się wokół 0,5 (zmierzone na 20 tys. próbek: mediana
0,50, 90. centyl 0,65, maksimum ~0,87), więc „naturalny" próg 0,6–0,95
nie zapala się prawie nigdy. Zanim podniesiesz próg, zmierz rozkład.

Powierzchnia jest **gładka**. Geometria dwudziestościanu jest
nieindeksowana, więc `computeVertexNormals()` dałoby normalną na ściankę
(czyli fasety, choćby materiał prosił o gładkie cieniowanie) —
`gladkieNormalne()` w `swiat.js` skleja je ręcznie po kluczu wierzchołka
(kierunek SPRZED rozrzutu, ten sam dla wszystkich kopii).
`swiat.terenFasety: true` wraca do ścianek; wzór zostaje ten sam.

Pokrętła — `mapa.swiat.terenShader`, domyślne wartości w
`STROJENIE_TERENU`:

| klucz | co | domyślnie |
|---|---|---|
| `moc` | **jak głośno**: 0 = jednolita zieleń, 1 = pełny wzór | 0,5 |
| `skala` | ile plam na obwód kuli (większe = drobniejsze) | 4 |
| `ziarno` | przesunięcie szumu — ten sam kod, inny świat | 0 |
| `kontrast` | rozjazd między jasną a ciemną zielenią | 1,0 |
| `szalwia` | siła szarozielonych przetarć | 0,45 |
| `piasek` | siła kremowych rozjaśnień | 0,35 |
| `wzgorza` | o ile wierzchołki wzgórz idą ku jasnej | 0,45 |
| `glebia` | przy jakiej głębokości niecki kolor jest już dnem | 0,1 |

`moc` to pokrętło od „za bardzo rzuca się w oczy" — zaczynaj zawsze od
niego, a nie od palety. Ścisza wzór ku barwie `baza`; **brzeg oczka jest
poza ściszaniem**, bo piasek nad wodą to informacja, nie ozdoba.

Paleta — `mapa.swiat.terenBarwy`: `baza` (spokojna zieleń), `jasna`,
`ciemna`, `szalwia`, `brzeg` (piasek), `dno`. Strojenie na żywo, bez przebudowy:
`__POC.app.ziemia.material.userData.uniformyTerenu.uSkalaTeren.value = 9`.

## Magiczna Fasola — jak zbudowane jest pnącze

Roślina **nie jest jednym pniem**, który rośnie w górę. To 4–5 **osobnych
pnączy**, każde z własnym splajnem, które pojawiają się kolejno i oplatają
wspólną oś. Widok z góry w kolejnych etapach: 1 → 2 → 3 → 4–5 okręgów na
pierścieniu, którego promień lekko rośnie wraz z dojrzewaniem.

| pojęcie | gdzie | uwagi |
|---|---|---|
| `SZABLON` | `pnacze.js` | tabela pnączy: `t0` (wysokość wyrastania), `start` (przy jakim `u` rusza), `g` (grubość), `om` (mnożnik obrotów), `sciezkowa` |
| `punkt(p, t)` | `pnacze.js` | splajn: oś + `cos/sin(kąt) · promienSplotu` + niski szum |
| `promienOd` | `pnacze.js` | promień z falowaniem w innej fazie dla każdego pnącza — stąd przeplot i widoczne bruzdy |
| `ustawWzrost(u)` | `pnacze.js` | `u ∈ [0,1]`; tanie: `setDrawRange` + czubki + macierze ozdób |
| `_przelicz(u)` | `pnacze.js` | przeliczenie wierzchołków — **tylko** przy zmianie kroku dojrzałości (`PNACZE.krokiDojrzalosci`, domyślnie 14 razy na całe rośnięcie), bufory alokowane raz |

**Etap 0–1 — ziarno i kiełek.** Etap 0 to ziarno (model GLB) **wkopane w kopczyk**
ziemi: czasza + wianuszek grudek (`kopczyk()` w `fasola.js`), kopiec rośnie razem
z rośliną. Etap 1 to sama łodyżka — JEDNO pnącze, cienkie (mnożnik dojrzałości
`0,15 + 0,85·u^0,8`), z **dwoma liścieniami na czubku** (`kielek()` w `_ozdoby`,
naprzeciw siebie, bez obrotu blaszki). Splot rusza dopiero od etapu 2 — progi
`start` w `SZABLON` to 0 / 0,16 / 0,30 / 0,45 / 0,62.

**Wysokość = `u · H` co do metra.** Pnącze rosnące od ziemi ma front wzrostu
liniowy w `u`; boczne ruszają później i doganiają (`front = lok^0,72`). Gdyby
front głównego pnącza też był wygładzany, etapy z mapy nie zgadzałyby się
z rzeczywistą wysokością rośliny.

**Ścieżka (ostatni etap).** Nie ma doklejonego mostu: jedno pnącze
(`sciezkowa`) zmienia przekrój z koła w szeroką wstęgę (`_przekroj`, superelipsa),
odchyla się na zewnątrz splotu i zagęszcza obroty. Front spłaszczenia wędruje
od dołu do góry razem ze wzrostem. Liczbę zwojów wylicza `skokSciezki`
(pionowy odstęp między zwojami w szerokościach wstęgi) — za gęsto i zwoje
zasłaniają splot, za rzadko i podejście robi się strome. Odstępy NIE są równe:
kąt ścieżki liczy się z tablicy całki `_tempo(t)` (`_przeliczSkret`), która
zagęszcza zwoje ku górze (pień się zwęża) i faluje dwiema częstotliwościami —
równe odstępy dawały efekt wiertła.

**Zbieżność ku czubkowi.** Jedna funkcja `stozek(t)` (od `PNACZE.szczyt = 0,68`
w górę) skaluje promień splotu, grubość pnączy, szerokość wstęgi, amplitudę
szumu i wielkość ozdób — na czubku zostaje 6 %, więc pnącza schodzą do szpica
zamiast urywać się płasko. Szum trzeba było nią objąć osobno: bez tego cienkie
końcówki rozjeżdżały się na boki zamiast się zbiegać.

**Osadzenie w ziemi.** Pnącza rosnące od ziemi mają `t0 < 0` (zaczynają pod
powierzchnią) i NABIEG korzeniowy — u dołu grubieją o 85 %, proporcjonalnie do
dojrzałości (kiełek nabiegów nie ma). Pnącze wychodzące z innej łodygi zachowuje
odwrotne zachowanie: zaczyna cienko.

**Kolejność wierzchołków w rurze.** `idx.push(a, d, b, b, d, c)` — NIE `(a, b, d,
b, c, d)`. Odwrotna kolejność wywraca całą rurę na lewą stronę: normalne patrzą
do środka, światło pada „od spodu", a przy `FrontSide` widać wnętrze rury —
roślina wygląda, jakby miała dziury. Sprawdzian liczbowy: dla każdego trójkąta
iloczyn wektorowy krawędzi ma mieć DODATNI rzut na kierunek od osi pierścienia.
Ten błąd siedział jeszcze w pierwotnym `_rura` i przez długi czas nie rzucał się
w oczy przy wąskich rurkach.

**Kamera przy fasoli** (`app.js`, stałe `KAMERA_FASOLA_*`). Domyślne ujęcie
patrzy na planetę z ~52° — dziewięciometrowe pnącze widać z niego „od czubka"
(pionowa oś skraca się o `cos 52° ≈ 0,62`). Gdy lisek podchodzi do wyrośniętej
fasoli albo po niej wchodzi, kamera płynnie schodzi do ~27°, podnosi cel o 45 %
wysokości rośliny (maks. 5,5) i odjeżdża o 22 %, żeby czubek zmieścił się
w kadrze. Azymut zostaje bez zmian, więc `camRight`/`camFwd` — kierunki
sterowania — się nie przekręcają. Wyłącznik: `mapa.fasola.kamera: false`.

Uwaga koncepcyjna: **przesunięcie rośliny po mapie tego nie naprawia**. Planeta
obraca się pod bohaterem, więc wszystko obok niego stoi na szczycie kuli
i kamera widzi to pod tym samym kątem — zmienić trzeba kamerę, nie pozycję.

**Wspinaczka liczy się w ramce rośliny.** `W = n·(R + h) + kier·r`, dopiero
wynik idzie na kulę. Dawniej lisek szedł łukiem po powierzchni na odległość `r`
i dopiero potem był podnoszony o `h`, czyli ramka rośliny zaginała się razem
z kulą; przy wąskiej spirali różnicy nie było widać, przy szerokiej wstędze
(`r ≈ 1,9`) lisek odklejał się od ścieżki o ponad metr.

**Kolizja jest osobna od grafiki.** `kolizja(probek)` daje oś wstęgi
(punkty + wektor w bok + normalną) i szerokość; `siatkaKolizji()` — niską
siatkę do fizyki; `przeszkodaSplotu()` — łańcuch odcinków oś–promień na
centralny splot. Liście, kwiaty i wąsy nie biorą udziału w kolizji.
Wspinaczka lisa (`fasola.sciezka(u)` → `{kat, r, h}`) idzie po **górnej
powierzchni** wstęgi, a nie po abstrakcyjnej spirali obok łodygi.

**Koszt.** Cała dorosła roślina to ok. 15 rysunków (5 rur + czubki +
3 InstancedMesh liści + kwiaty + wąsy) i ~8,6 tys. trójkątów rur.
Liczba segmentów wzdłuż krzywej idzie z widocznej długości; ścieżka dostaje
ich najwięcej, wąsy najmniej.

**Dane z mapy** (`mapa.fasola.pnacze`): `pnacza` (ile pnączy, 2–5; `pedy`
działa dalej jako `pnacza = pedy + 1`), `obroty`, `grubosc` (promień CAŁEGO
splotu u podstawy), `szerokosc` (wstęgi), `ziarno`.

**Test wizualny (obowiązkowy po każdej zmianie kształtu).** Wyłącz ozdoby —
`pnacze.pokazOzdoby(false)` — i sprawdź, czy roślina dalej czyta się jako
kilka pnączy oplatających się wzajemnie. Jeśli wygląda jak jeden walec albo
jak krzak, struktura jest zepsuta. Najszybciej:

```
node scena-3d-src/test/buduj-podglad.mjs      # bundluje test/podglad-pnacza.js
# serwuj scena-3d-src/test/ i otwórz podglad-pnacza.html
```

Podgląd ma suwak wzrostu, przełącznik ozdób, widok z góry i licznik rysunków
oraz trójkątów (`pnacze.stan()`). Bundla podglądu nie commitujemy.

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


### Zasiew za bohaterem

`mapa.swiat.zasiew: true` włącza roślinny ślad (włączony w `mapa-w2.json`).
Co 0,70 jednostki rzeczywistego marszu nowa roślinka pojawia się 0,55 jednostki
za bohaterem, lekko na przemian po lewej i prawej. Na postoju, podczas
przestawiania bohatera i ujęć filmowych zasiew nie postępuje. Korzeń trafia
w siatkę ziemi. Po 0,10 s opóźnienia wzrost trwa 0,84 s: spłaszczenie,
wyciągnięcie do 135% wysokości, squash i małe odbicie. Szerokość i wysokość
zmieniają się osobno;
tryb ograniczonego ruchu ustawia od razu docelowy rozmiar.

Około 45% zasiewów to większe, nieregularne płaty trawy. Pojedyncze źdźbło
jest fasetowanym, lekko zagiętym liściem zwężającym się ku czubkowi. Zasiew
losuje 11–18 liści oraz jeden z czterech układów złożonych z 1–4 połączonych
kęp. Liście różnią się wysokością, szerokością, kierunkiem i jednym z trzech
odcieni zieleni. Pozostałe zasiewy to różnokolorowe kwiatki.

Pula mieści 256 nowych roślin, poza roślinami zapisanymi w mapie. Po jej
zapełnieniu można ponownie wykorzystać tylko roślinę ze śladu oddaloną o ponad
9 jednostek od zasiewu. Blisko istniejących roślin (0,32 jednostki) zasiew
jest pomijany. Geometrie i 13 InstancedMesh pozostają wspólne i stałe.
Zasiew jest tymczasowy: przeładowanie sceny przywraca mapę.

Sterowanie integracji: `scena.ustawZasiew(false)` / `scena.ustawZasiew(true)`.
`scena.stan().zasiew` zwraca `wlaczony`, `zasiane`, `rosnace`, `limit`,
`trawy` i `kwiaty`.
