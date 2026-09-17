# Styl ilustracji postaci i ikon UI

> Opis tego, jak dziś wyglądają grafiki w grze: pop-upy Wizkora i liska, ikony
> HUD-u (widoczne i ukryte), ikony surowców oraz ikony we wskaźnikach nad światem
> (siekiera przy ścinaniu, domek nad placem budowy). Stan na 17.09.2026, spisany
> z plików w `frontend/public/`. Barwy w nawiasach są próbkami z tych plików
> (dominanty), nie tokenami UI.
>
> **Do czego służy ten plik:** do briefu i do oceny, czy nowa grafika pasuje do
> rodziny. **Do czego nie służy:** do promptu. Styl przekazujemy generatorowi
> OBRAZEM (referencją), nie słowami — patrz `docs/grafika.md` §2b i
> `docs/design-system/styl-ikon-3d.md`. Opis słowny wkładany do promptu daje
> płaską naklejkę albo napuchniętą plastelinę.

Kanon nazw i postaci: `docs/SWIAT_I_POSTACIE.md`.

---

## Rodziny w skrócie

| rodzina | gdzie | jednym zdaniem | obrys |
|---|---|---|---|
| **A. Postacie** | pop-upy Wizkora i liska, ekrany startu | renderowana kreskówka jak z gry mobilnej, popiersie wychylające się zza okna | gruby, w ciemnym odcieniu lokalnej barwy |
| **B. Ikony HUD** | dolny dok, liczniki, profil, muzyka, wiadomości | błyszczące „klejnotowe” ikony: złote ramy, nasycony kolor, mocny połysk | gruby, ciemnobrązowy |
| **C. Surowce** | licznik drewna, toasty z materiałem | rendery modeli low-poly prosto ze świata 3D, matowe fasetki | brak |
| **D. Wskaźniki w świecie** | siekiera nad liskiem, domek nad placem budowy | miękkie 3D (soft render), gładkie bryły, jedno miękkie światło | brak |
| **E. Symbole płaskie** | koło przeznaczenia | płaski wektor z grubym konturem, bez cieniowania | gruby, ciemnobrązowy |

Wspólne dla A, B, D: światło z góry-lewej, przezroczyste tło, czytelna sylwetka
przy 40 px, jeden akcent barwny, żadnego tekstu w obrazku.

---

## A. Ilustracje postaci (pop-upy)

**Pliki:** `wizPop.webp` (Wizkor z laską), `wizSprawdza.webp` (z lupą i zwojem),
`wizkor-super.webp` / `wizkor-super-koniec.webp` (gest pochwały, animacja
Higgsfield), `wizhead.svg` (sama głowa, chmurka myśli o ciele), `lisPop.webp`
(lisek). Wzorce do generatora: `docs/styl/wizkor.png`, `docs/styl/lisek.png`,
`docs/styl/wizkor-karty.png`.

### Rendering
- **Kreskówka renderowana, nie płaski wektor.** Gładkie, miękkie przejścia
  światłocienia na każdej plamie, bez tekstury i bez szumu. Bliżej ikony gry
  mobilnej niż ilustracji książkowej.
- **Gruby obrys całej sylwetki** i cieńsze linie wewnętrzne (fałdy, brwi, palce).
  Obrys **nie jest czarny** — to najciemniejszy odcień lokalnej barwy: śliwkowy
  granat przy fiolecie Wizkora (`#3B0B71`), czekoladowy brąz przy rudym liska
  (`#3F220E`).
- **Połysk punktowy** tylko na rzeczach, które mają błyszczeć: kryształ w lasce
  i na kapeluszu, źrenice (jeden biały błysk w każdym oku), złote okucia.
  Futro, broda i szata są satynowo-matowe.

### Proporcje i mimika
- **Chibi / „big head”:** głowa to mniej więcej połowa wysokości postaci.
- Duże, okrągłe, brązowe oczy z jednym białym błyskiem; mały nos-kulka;
  lekki rumieniec; otwarty, szeroki uśmiech. Wyraz: życzliwy, zaciekawiony,
  nigdy groźny ani sarkastyczny.
- Brwi grube i miękkie — to one niosą emocję (zdziwienie, uśmiech).

### Kadr
- **Popiersie ucięte płasko dolną krawędzią**; ręce lub łapy opierają się o tę
  krawędź, jakby postać wychylała się zza okna pop-upu. Dlatego w grze postać
  stoi NAD kremową kartą, a karta zasłania cięcie.
- Postać w 3/4 albo frontalnie, wyśrodkowana, przezroczyste tło.
- Rekwizyt (laska, lupa, zwój) wchodzi w kadr z boku i nie wychodzi poza obrys
  sylwetki bardziej niż o szerokość głowy.

### Paleta postaci
| postać | barwy (próbki) | akcent |
|---|---|---|
| **Wizkor** | fiolet szaty i kapelusza `#6B1BBA`, cień `#3B0B71`; broda i brwi kremowe `#F9EEDA`; cera brzoskwiniowa `#EFB46E` z cieniem `#CF7C4E`; laska brązowa, skręcona | złote lamówki i złote gwiazdki na szacie, lawendowy kryształ w złotej oprawie |
| **Lisek** | pomarańcz `#FC9017` / `#F68412`; pysk, brzuch i wnętrze uszu kremowe `#FDC66F`; łapy i końcówki uszu czekoladowe `#804517` | turkusowa chustka; wokół 4-ramienne złote iskierki (tylko przy radości) |

### Oprawa na ekranie
Kremowa karta z grubą złotą obwódką, fioletowa plakietka z imieniem postaci
(wersaliki, złote gwiazdki po bokach), czerwony okrągły przycisk zamknięcia,
zielone CTA z tokenów `--cta-*`. Animowany jest wyłącznie gest „super” Wizkora
przy pochwale — pozostałe pop-upy są statyczne.

### Czego unikać
Płaskiego wektora bez światłocienia (to rodzina E), czarnego konturu, realistycznego
futra i włosów, ostrych kątów, zmarszczek „starca”, więcej niż jednego rekwizytu,
tła za postacią.

---

## B. Ikony HUD

**Pliki:** `frontend/public/assets/hub-nav/*-simple.png` (256 px), `moneta.png`,
`iskra.png`, `/star.png` (192 px), `/music.png` (512 px).

### Rendering
- **Błyszczące, wypukłe ikony w stylu gier mobilnych.** Każda forma ma złotą
  ramę albo lamówkę (`#FDD040`, `#E09309`, cień złota `#9B700A`) i nasycone
  wnętrze.
- **Gruby ciemnobrązowy obrys** (`#331F01`–`#5D3E0D`) wokół całości — mocniejszy
  niż u postaci, bo ikona jest mała.
- **Mocny połysk:** jasna plama lub pasek u góry-lewej na każdej wypukłości
  (szkło lampionu, dymek, przyciski pada). Lekki wewnętrzny cień u dołu.
- Widok frontalny albo delikatne 3/4, obiekt wypełnia kadr z równym marginesem.
- Paleta wnętrz: zieleń butelkowa `#4B8A25`, turkus `#05B2A2`/`#1CCBB5`,
  czerwony i żółty tylko jako drobne akcenty (przyciski, płomień).

### Inwentarz
| ikona | plik | co przedstawia | na ekranie |
|---|---|---|---|
| Porada | `porada-simple.png` | zielony lampion w złotej oprawie z żółtym płomieniem | **widoczna** w doku |
| Profil | `/fox_avatar.png` | lisek w złotym medalionie na zielonym tle, uszy wychodzą poza pierścień | **widoczny**, lewy górny róg |
| Gwiazdki | `/star.png` | pięcioramienna złota gwiazda, brązowy obrys, połysk | **widoczny** licznik podczas zbierania |
| Monety | `moneta.png` | złota moneta w 3/4 z 4-ramienną gwiazdą i listkami | **widoczny** licznik z paskiem |
| Muzyka | `/music.png` | zielona szklista nuta (zatwierdzona 17.09.2026 — zostaje zielona) | **widoczna**, prawy górny róg |
| Minigry | `minigry-simple.png` | zielony pad w złotej ramie, żółty krzyżyk, zielony i czerwony przycisk | **ukryta** do pierwszej rozegranej gry |
| Rozmowy | `czat-simple.png` | turkusowy dymek z dwiema kropkami na złotej podstawce | **ukryta** |
| Zadania | `zadania-simple.png` | kremowa kartka w brązowej ramce z zielonym ptaszkiem | **ukryta** |
| Iskra | `iskra.png` | 4-ramienna złota gwiazda z turkusowym kryształem i zielonymi listkami | awatar w zwoju wiadomości |

### Oprawa w HUD-zie
- **Dok:** każda ikona (60 px) leży na okrągłym kafelku 68 px — kremowy gradient
  (`--hud-cream-top` → `--hud-cream-bottom` `#f1d997`), złota obwódka z gradientem
  (`--hud-gold-light` → `--hud-gold-deep`), twardy cień pod spodem i miękki
  rozmyty. Pod kafelkiem fioletowa pigułka z podpisem.
- **Liczniki:** kremowa pigułka ze złotą obwódką, ikona 34 px wychodzi lekko
  poza lewy brzeg, cyfry `Baloo 2` 900 w kolorze `--hud-ink`.
- Plakietki: czerwone kółko z liczbą albo zielona kropka.

### Rozjazdy wewnątrz rodziny (do decyzji)
- `zadania-simple.png` jest **płaska** (prawie bez połysku, cienkie linie) —
  najbliżej rodziny E; odstaje od padu i lampionu.

Nieużywane pliki tej rodziny: `muzyka-simple.png` (złota nuta) oraz
`profil-simple.png` i `profil.png` (portret chłopca — postać chłopca wyłączona
17.09.2026).

---

## C. Ikony surowców

**Pliki:** `/kloda.png`, `/kamyk.png`, `/stos-drewna.png` (128 px).

- **Rendery modeli ze świata 3D** — te same fasety low-poly, co drzewka i głazy
  na planecie. Matowe, bez obrysu, bez połysku, cieniowanie płaskie na fasetach.
- Barwy wygaszone i ziemiste: drewno `#57462E`–`#847147`, kamień
  `#74715E`–`#8A8671`.
- Celowo NIE są błyszczące: mówią „to jest ta rzecz, którą widzisz w świecie”.
  Stan w liczniku (jest / brak) robi CSS (krycie, odbarwienie), nie osobny obrazek.
- Nowy surowiec robimy tak samo: render modelu z tej samej sceny, to samo
  światło, przezroczyste tło — nie generujemy go.

---

## D. Ikony we wskaźnikach nad światem

**Pliki:** `frontend/public/scena-3d/assets/ikona-siekiera.png` (wskaźnik akcji,
nad liskiem przy ścinaniu), `ikona-siedlisko.png` (wskaźnik miejsca, nad placem
budowy — domek). Warianty próbne `ikona-siedlisko-3d.png`, `-alt.png`,
`-plaska.png` leżą obok, nieużywane. Wzorzec do generatora:
`docs/styl/rabanie/siekiera-styl.png`.

### Rendering
- **Miękkie 3D:** gładkie bryły z wyraźnymi, zaokrąglonymi fazami, jedno miękkie
  światło z góry-lewej, delikatne AO w zagięciach, **bez obrysu** i bez
  cel-shadingu. Rzut 3/4 z lekkiej góry, sylwetka czytelna przy ok. 80 px.
- **Siekiera:** chłodna, jasnoszara stal z jasną fazą ostrza (`#918C8D`,
  `#CBC7C2`), miodowo-pomarańczowy trzonek (`#C07A40`) — stal robi chłodny
  kontrast w ciepłym zestawie. Powierzchnia gładka, lekko satynowa.
- **Domek:** rdzawa dachówka w dużych łuskach (`#873314`, `#BF531F`), piaskowe
  ściany z delikatną fakturą tynku (`#EFBB7A`), łukowe drzwi z desek
  (`#A46D44`), komin. Powierzchnia matowa, zaokrąglona, lekko „ulepiona” — to
  jest **wariant claymorphism**, dozwolony (decyzja 17.09.2026, niżej).

### Oprawa — wspólne tło wskaźników
Oba wskaźniki to jedna rodzina (`app.js`, `_tloWskaznika`):
- nieprzezroczysty bezel `#211d16` z twardym obrysem `#140f09`;
- ciemna grafitowa tarcza z gradientem radialnym (`#4a4a53` → `#26262c`) i
  delikatnym połyskiem u góry;
- **wskaźnik akcji:** łuk postępu złoto→pomarańcz (`#ffdc4b` → `#ff8f1f`) z
  rozmytą poświatą, na ciemnym torze `#5a5326`;
- **wskaźnik miejsca:** pełna obwódka — wygaszone złoto, gdy materiał jeszcze
  się zbiera, pomarańcz, gdy wszystko leży na placu;
- ikona zawsze w pełni kryjąca (stan niesie kolor obwódki, nie przezroczystość),
  sprite 1,05 jednostki, płótno 256 px.

Pełna specyfikacja pierścienia: `docs/design-system/wskaznik-scinania.md`.

---

### Ta sama rodzina w interfejsie: chmurka mówiąca obrazkami

`frontend/public/assets/wskazowki/ikona-lupa.png` (szukaj) i
`frontend/public/assets/puzzle/ikona-puzzel.png` (czego) — para z
17.09.2026, wygenerowana jedną komendą z referencji siekiery
(`scripts/gen-ikony-wskazowki.mjs`). Pokazują się NA PRZEMIAN w chmurce
podpowiedzi `puzzle-szukaj` (`hub/wskazowki.js`), zanim dziecko znajdzie
pierwszy kawałek. Puzelek zastąpił płaski `assets/puzzle/kawalek-v2.svg`
wszędzie, gdzie stał: licznik HUD, lot kawałka do licznika, okno postaci.

To jedyne miejsce, gdzie rodzina D wchodzi w interfejs — i wchodzi celowo:
wskaźniki nad światem i ta chmurka mówią to samo („zrób to"), a ikona 3D
czyta się w kółku lepiej niż płaski symbol.

## E. Symbole płaskie

**Pliki:** `frontend/public/assets/kolo/ikona-*.webp` (koło przeznaczenia).
Płaski wektor: jedna barwa wypełnienia (np. żółta lupa), gruby ciemnobrązowy
kontur, zero cieniowania i połysku. Działa na kolorowych polach koła, ale nie
miesza się z rodziną B — nie przenosimy tych symboli do HUD-u.

---

## Znaki 3D na mapie (skróty do gier)

To nie są obrazki, tylko modele w scenie (`public/scena-3d/assets/*.glb`)
z poświatą (halo) i pierścieniem na ziemi: **karta** (`karta.glb`) prowadzi do
Gry na Pamięć, **gwiazdka** (`gwiazda.glb`) do zbierania, **czarodziej**
(`wizard.glb`) to Wizkor na polanie. Styl modeli jest ten sam co świata:
uproszczone bryły, ciepłe barwy, bez obrysu. Etykiety i komunikaty znaków żyją
w `mapa.json`.

---

## Claymorphism — jeden z dostępnych stylów

Decyzja autora z 17.09.2026: **claymorphism zostaje jako jeden ze stylów, których
możemy używać.** Nie jest stylem wiodącym postaci ani HUD-u.

- **Gdzie pasuje:** drobne przedmioty wewnątrz gry (pionki, symbole kart,
  rekwizyty w minigrach) i ikony miejsc w świecie — tak jak domek nad placem.
- **Gdzie nie:** postacie (rodzina A) i ikony HUD (rodzina B); w jednej rodzinie
  nie mieszamy gliny z połyskiem — siekiera i domek leżą obok siebie, więc przy
  następnych ikonach wskaźników trzymamy się jednego z nich i dopisujemy
  wybrany wzorzec do `docs/styl/rabanie/`.
- **Jak generować:** blok DNA z `docs/grafika.md` §2 (tam jest opis materiału
  i paleta) albo referencja z gotowego assetu w tym stylu.

---

## Jak dodać nową grafikę do rodziny

| rodzina | droga | referencja |
|---|---|---|
| A. Postać | `scripts/styl-ilustracja.py` (images.edit), prompt mówi tylko CO jest na obrazku | `docs/styl/wizkor.png`, `lisek.png` |
| B. Ikona HUD | images.edit z 2–3 ikonami z `hub-nav/` jako referencją, prompt tylko o obiekcie; potem kafelek i obrys robi CSS | `porada-simple.png`, `minigry-simple.png`, `moneta.png` (proponowany katalog wzorców: `docs/styl/hud/`) |
| C. Surowiec | render modelu ze sceny, bez generatora | model `.glb` z `public/scena-3d/assets/` |
| D. Wskaźnik | `docs/design-system/styl-ikon-3d.md` | `docs/styl/rabanie/siekiera-styl.png` |
| E. Symbol płaski | rysunek wektorowy albo kod | istniejące `assets/kolo/ikona-*.webp` |

Zawsze: przyciąć do alfy, wyśrodkować, zmniejszyć (256 px ikony, 560 px postacie),
odchudzić wg `docs/grafika.md` §4, sprawdzić czytelność przy docelowym rozmiarze.
