# Koncept gry — stan faktyczny

Spisane 2026-09-09 **z ekranów, nie z dokumentów projektowych**. Metoda: od
trasy `/` przez `main.jsx` do wszystkiego, do czego dziecko może dojść
dotknięciem. Co nie ma dojścia z interfejsu, nie jest częścią gry — nawet
jeśli ma trasę i plik.

Gdy zmieniasz to, co widać, zmień ten plik. Dokumenty koncepcyjne
(`agents/world/*.md`, `docs/dolina-na-poziomach.html`) opisują zamiary
i mogą się od tego pliku różnić — to on jest źródłem prawdy o tym, co jest.

---

## Wejście

**Landing** (`/`) — jeden przycisk START → `/swiat`. Stare adresy (`/world`,
`/map`, `/mapa`) przekierowują tam. Trasa `/onboarding` istnieje technicznie
(urządzenie bez gracza), ale onboarding jako element gry nie jest częścią
konceptu — póki co.

---

## Świat 3D — planeta

Od 2026-09-09 mapa jest **kulą** (`frontend/scena-3d-src/`). Kamera
izometryczna, planeta obraca się pod bohaterem, da się ją obejść dookoła.

**Co stoi na mapie** (`public/scena-3d/mapa.json`): jedna polana — ścieżka,
rzeka z nurtem i most, latarnia, brama, pięć drzew, trzy głazy, domek,
trzynaście kwiatków. Drzewa gibią się, kwiaty kłaniają, gdy bohater przebiega.

**Bohater:** chłopiec albo lisek (`SCENA3D_POSTACIE`), joystick / klawiatura.

**Znaki na mapie** (24): czarodziej, dziesięć gwiazdek, dziewięć kawałków
puzzli, trzy wejścia do gier (karty, drzewo lotu, bucik), drzwi domu.

### Kto się odzywa (cztery głosy, ElevenLabs)

| głos | rola | czego nie robi |
|---|---|---|
| narratorka | opowiada | nie zleca zadań |
| Wizkor (czarodziej na mapie) | zleca i rozlicza zadania | nie opowiada świata |
| lisek | zaprasza do wspólnej aktywności (porada dnia, wskazówka do gier) | nie zleca, nie opowiada |
| Mędrzec | jedna myśl o ciele, głosem dorosłego, rzadko | nie prowadzi fabuły |

### Co dziecko robi — cztery pętle

1. **Gwiazdki.** Wizkor zleca zebranie dziesięciu. Licznik przeżywa zamknięcie
   aplikacji. Nagroda: monety.
2. **Odkrywanie gry.** Wizkor zleca, kawałki obrazka rozsypują się po polanie,
   dziecko je zbiera i układa (2×2 albo 3×3) — gra ląduje w zakładce
   NA STAŁE i rusza od razu. Nagroda rozbita na dwie: za ułożenie i za partię.
   Trzy gry idą po kolei: Pamięć Mędrca → Lot Liska → Bieg Liska.
3. **Zadanie poza ekranem.** Z rozmowy z Wizkorem otwiera się **Koło
   Przeznaczenia** — losuje cechę, a do cechy dobierane jest zadanie, którego
   nie da się zrobić w grze; dowodem jest zdjęcie albo zdanie. Idzie do Mentora, Mentor
   przyjmuje lub prosi o poprawkę. Monety przyznaje backend.
4. **Porada dnia.** Karta na dziś (oddech z liskiem, zielony trop…) —
   mikroaktywność poza ekranem, deterministyczna w obrębie doby.

### Trzy minigry (osadzone nad hubem, każda z ekranem startowym i poziomami)

| id | tytuł | mechanika | tutorial |
|---|---|---|---|
| `pamiec-medrca` | Pamięć Mędrca | pary kart | jest |
| `lot-liska` | Lot Liska | naciągnij choinkę, traf w obręcze | **brak** |
| `bieg-liska` | Bieg Liska | licz w biegu, skacz po wynik | **brak** |

Katalog zapowiada trzy kolejne bez trasy (Echo Melodii, Trop Tropiciela,
Zwój Znaków).

### Dok — cztery ikony

| ikona | panel | co w środku |
|---|---|---|
| Minigry | biblioteka gier | kafle odkrytych gier, plakietka „nowe" |
| Rozmowy | czat | atrapa: forum, prywatne, mentor (`czat.mock.json`) |
| Zadania | zwój | wiadomości świata + Mentora; misje przygody wyłączone (`POKAZ_MISJE_PRZYGODY = false`) |
| Porada | karta dnia | wybór karty, lisek mówi, ekran oddechu |

Poza dokiem: **Profil** (kafel z imieniem — awatar, imię, monety, mocne
strony; nic więcej, decyzja 2026-08-20), **Dom** (drzwi na mapie → wnętrze
i panel „co już masz"), **plakietki** z liczbą nowości,
**chmurka wskazówki** celująca w ikonę doku, **Mędrzec** wychylający się
z jedną myślą.

### Nagrody

Monety (HUD, dwa źródła: baza + bonus lokalny), gwiazdki, ekran nagrody.
Ekwipunek awatara **nie jest** pokazywany w hubie (zdjęty 2026-08-20 —
pokazywał zera).

---

## Warstwa dorosłego

Mentor (`/mentor…`): klasy, pary, weryfikacja dowodów, podpowiedzi.
GM (`/gm`, `/invite-gm`, `/dolacz`). Logowanie ucznia kodem (`/uczen`,
`/odzyskaj`, `/witaj`). Pulpit deweloperski (`/dev`) i reżyserka w hubie.

**Uwaga:** `components/DevTools.jsx` renderuje przycisk „⚙️ DEV" w prawym
dolnym rogu dla każdego, także dziecka — nie jest bramkowany środowiskiem.

---

## Poza grą

Trasy bez dojścia z interfejsu — mają pliki, nie mają gry: prototyp V1
(`/play`, tylko z `/dev`), tor `/przygoda` (`POKAZ_MISJE_PRZYGODY = false`,
zdjęty z huba 2026-08-20), stara aplikacja zakładkowa (`TopBar`/`TabBar`
nie są renderowane w hubie). Nie opisywać ich jako części gry.

Żywe, choć wyglądają na stare: `adventure/engine/adventureState.js` (cechy,
`wzmocnijCeche`) i `adventure/engine/notifications.js` (skrzynka) — hub z nich
korzysta. `agents/world/*.md` i `agents/prompts/*` czyta backend przy starcie.

**Koszt uboczny:** `AppData` przy każdym wczytaniu woła `/missions/generate`
(Claude), a hub tej misji nigdzie nie pokazuje — płatne wywołanie za tekst,
którego nikt nie czyta.

---

## Co z tego wynika

Gra, która istnieje, to: **planeta, po której chodzi się, żeby zdobyć trzy
gry, zebrać gwiazdki i wykonać zadanie poza ekranem** — z Wizkorem jako
zleceniodawcą, liskiem jako towarzyszem i Mentorem po stronie dorosłego.
Pięć cech w profilu — Ciekawość, Tworzenie, Współpraca, Odwaga, Wytrwałość
(`TRAIT_LABELS`; kody EM/ST/KR/LD/DT/MD to warstwa legacy dla raportów Mentora) —
rośnie po zadaniach (`wzmocnijCeche`), ale nie decyduje
o tym, co dziecko dostaje — cechę zadania losuje Koło Przeznaczenia, a gry idą
dla wszystkich w tej samej kolejności.
