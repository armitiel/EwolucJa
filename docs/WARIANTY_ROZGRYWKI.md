# Warianty rozgrywki — jak badać drugi kierunek, nie ruszając pierwszego

Spisane 2026-09-11. Czytaj razem z `docs/KONCEPT_GRY.md` (co jest na ekranie)
i `docs/SYSTEMY_GRY.md` (jak to działa). Ten dokument nie proponuje żadnej
rozgrywki — opisuje **aparaturę**, w której da się ją zbadać bez ryzyka dla
tego, co już stoi.

Pytanie wyjściowe: *jak produkcyjnie badać równoległy kierunek z zachowaniem
wszystkiego, co mamy do momentu pojawienia się liska na planecie.*

---

## 0. Punkt zerowy — co zostało zamrożone

Przed czymkolwiek innym: **stan „lisek na planecie" istniał wyłącznie na
jednym dysku.** `git status` z 11.09.2026 pokazywał 76 plików poza repozytorium,
w tym CAŁE źródła sceny 3D (`frontend/scena-3d-src/`), dokumenty koncepcji
i `agents/prompts/` (backend czyta je przy starcie przez `readFileSync`).
Awaria dysku = utrata planety.

Zamrożone 11.09.2026:

| co | wartość |
|---|---|
| commit bazy | `11f01b7` |
| tag | `baza-lisek-na-planecie` (wypchnięty) |
| gałąź kopii | `baza/lisek-na-planecie` (wypchnięta, daje własny preview na Vercelu) |
| gałąź produkcyjna | `v2-postgres-vercel` — **nietknięta**, dalej na `48f09e0` |

Powrót do bazy z dowolnego miejsca: `git checkout baza-lisek-na-planecie`.

**Uwaga, która nie jest częścią tego planu, ale jest ważna:** produkcja stoi na
`48f09e0`, czyli na PŁASKIEJ mapie. Planeta-kula, tutoriale minigier i wspólna
chmurka komunikatu nigdy nie zostały wdrożone. Cokolwiek dalej robimy, „produkcja"
i „to, co widzę u siebie" to dziś dwie różne gry. Do decyzji osobno.

---

## 1. Gdzie przebiega linia cięcia

„Do momentu pojawienia się liska na planecie" to dobra linia, bo pokrywa się
z realnym szwem w kodzie. Poniżej niej jest **fundament** — działa tak samo
niezależnie od tego, co dziecko potem robi. Powyżej jest **pętla** — dziś
łańcuch Wizkora, jutro może coś innego.

### Fundament (wspólny, jeden egzemplarz dla obu trybów)

| warstwa | pliki | uwaga |
|---|---|---|
| wejście i konto | `pages/Landing`, `LoginByCode`, `LoginAsStudent`, `contexts/AppData.jsx` | gracz, sesja, `player.coins` z bazy |
| silnik 3D | `frontend/scena-3d-src/` → `public/scena-3d/scena3d*.js` | jeden bundle, `WERSJA_SCENY` w `components/Scena3D.jsx` |
| planeta i chodzenie | `scena-3d-src/src/planeta.js`, `app.js` | rzut na kulę, kroki po wielkim kole, kolizje |
| skóra HUD | `public/scena-3d/hud.css` | jedno źródło prawdy, współdzielone z podglądem `/scena-3d/` |
| minigry | `pages/MemoryGame.jsx`, `ChoinkaLaunchGame.jsx`, `BiegLiskaGame.jsx` | **już odpięte od huba** — patrz §4 |
| dźwięk, TTS, analityka, Sentry | `services/*` | bez zmian |
| backend i baza | `backend/`, `api/` | bez zmian |

### Pętla (to się rozgałęzia)

| warstwa | pliki | los w wariancie |
|---|---|---|
| kompozycja ekranu | `pages/Swiat.jsx` (2497 linii) | **nie dotykamy go wcale** — wariant dostaje własny plik |
| łańcuch zleceń | `hub/misjeGier.js`, `etapyMisji.js`, `puzzleGier.js`, `zadanieGwiazdek.js`, `zadanieWizkora.js` | do porzucenia lub przepisania |
| dok i panele | `hub/HubDock.jsx`, `hub/panels/*` | wariant komponuje własny zestaw |
| głosy i kwestie | `hub/kwestieWizkora.js`, `glosLiska.js`, `wskazowki.js` | nowa obsada = nowe pliki |
| dane świata | `public/scena-3d/mapa.json` | wariant dostaje **własny plik mapy** |

**Reguła, która trzyma to w całości:** zmiana w fundamencie musi być wstecznie
zgodna i domyślnie zachowywać się dokładnie jak dziś. Jeżeli wariant potrzebuje
czegoś od silnika, to wchodzi jako **dana w `mapa.json`** (sekcja `swiat.*`),
nie jako `if (tryb === "wariant")` w `app.js`. Silnik nie ma prawa wiedzieć,
który tryb go uruchomił.

---

## 2. Mechanizm: jedna gałąź, dwie trasy

Odrzucone: osobna gałąź `v3-wariant` na czas eksperymentu.

**Dlaczego nie.** Historia tego repo już to przerabiała — `v2-hybrid-rpg`
i `v2-design-ghibli` leżą martwe, bo gałąź z eksperymentem żyje tylko dopóki
nikt nie poprawia bazy. Przy pierwszej poprawce w scenie albo w HUD-zie masz
dwa miejsca do naprawienia i jedno z nich zawsze zostaje w tyle. Po miesiącu
scalenie kosztuje więcej niż napisanie wariantu od nowa.

**Jak zamiast tego.** Wariant mieszka na gałęzi produkcyjnej, pod własną trasą,
której nic nie linkuje:

```
/swiat      → pages/Swiat.jsx        (dzisiejsza gra, bez zmian)
/w2         → wariant/Wariant.jsx    (drugi kierunek, ładowany leniwie)
```

Co to daje:

- poprawka w scenie, HUD-zie albo minigrze wchodzi **raz** i działa w obu trybach;
- oba tryby idą w tym samym wdrożeniu, więc porównanie jest uczciwe — ta sama
  przeglądarka, ten sam telefon, ten sam dzień;
- dziecko nie trafi tam przypadkiem, bo żaden przycisk w grze tam nie prowadzi;
- wyłączenie eksperymentu to usunięcie jednej trasy, nie odkręcanie gałęzi.

Koszt paczki startowej: zero, jeżeli trasa idzie przez `leniwy()` — dokładnie
tak, jak dziś siedzi prototyp V1 na `/play` (`main.jsx`, `leniwyImport.js`).

**Kiedy JEDNAK gałąź.** Jeżeli wariant zacznie wymagać zmiany w samym silniku
sceny, której nie da się schować za daną w `mapa.json` — wtedy i tylko wtedy
gałąź, na krótko, z jasną datą scalenia.

### Bramka dostępu

`services/dev.js` ma już dokładnie potrzebną logikę: lokalnie zawsze, na
publikacji nigdy poza świadomym `?dev=1`, bez zapamiętywania. Trasa `/w2`
dostaje ten sam wzorzec — na produkcji otwiera się tylko z parametrem, który
trzeba wpisać z ręki. Testerzy dostają gotowy link, dzieci nie mają jak tam wejść.

`vercel.json` nie wymaga żadnej zmiany — reguła `"/(.*)" → /index.html` łapie
każdą nową trasę SPA.

---

## 3. Nowy świat — druga mapa, ten sam silnik

Dziś scena czyta mapę z jednego zaszytego adresu:

```js
// frontend/src/components/Scena3D.jsx:132
const odp = await fetch("/scena-3d/mapa.json", { cache: "no-cache" });
```

To **jedyna** zmiana w pliku wspólnym, jakiej wymaga cały ten plan:

```js
export default function Scena3D({ mapa = "/scena-3d/mapa.json", ... }) {
  ...
  const odp = await fetch(mapa, { cache: "no-cache" });
```

Domyślna wartość = dzisiejsze zachowanie, więc `Swiat.jsx` nie zauważa różnicy.
Wariant montuje `<Scena3D mapa="/scena-3d/mapa-w2.json" />`.

Co w praktyce znaczy „nowy świat" przy tym silniku:

- **inna sceneria** — `mapa-w2.json`: własny teren, budynki, znaki, ścieżka,
  rzeka, promień kuli (`swiat.promienKuli`), zasięg treści (`swiat.promienTresci`).
  Zero kodu — `scena-3d-src/src/mapa.js` czyta te pola z domyślnymi wartościami.
- **inna postać** — rejestr `scena-3d-src/src/postacie.js` (klipy lisa i chłopca
  już tam siedzą; dokładanie kolejnej to wpis, nie łatka).
- **inna skala** — planeta większa lub mniejsza, `swiat.tylkoMapa` decyduje,
  czy da się ją obejść dookoła.
- **edytor działa od razu** — `public/scena-3d/edytor.html` otwiera się bez
  builda i zapisuje `mapa.json`; drugą mapę buduje się myszą, nie w kodzie.

Czego silnik dziś NIE umie i co byłoby prawdziwą pracą: wnętrza, wiele planet
naraz, pogoda, pora dnia, NPC chodzący własną trasą. Warto wiedzieć przed
obiecaniem sobie czegokolwiek.

**Zasada pracy ze sceną** (`.claude/hooks/straznik-sceny.mjs` tego pilnuje):
bundla `public/scena-3d/scena3d*.js` się nie edytuje. Zmiana idzie w
`frontend/scena-3d-src/src/`, potem `cd frontend && node scena-3d-src/build.mjs`
**w cmd na Windowsie**, potem podbicie `WERSJA_SCENY` (dziś `48`).

---

## 4. Minigry — kontrakt osadzenia już istnieje

To najlepsza wiadomość w całym tym dokumencie. Wszystkie trzy gry mają
identyczną sygnaturę:

```js
export default function MemoryGame({ osadzona = false, poziom = null, onWyjscie })
export default function ChoinkaLaunchGame({ osadzona = false, poziom = null, onWyjscie })
export default function BiegLiskaGame({ osadzona = false, poziom = null, onWyjscie })
```

`osadzona` znaczy „renderuj się nad cudzym ekranem, bez własnego tła i bez
własnego wyjścia", `poziom` to trudność podana z zewnątrz, `onWyjscie` to jedyna
droga powrotna. Gry nie wiedzą nic o Wizkorze, o puzzlach ani o monetach —
nagrodę przyznaje ten, kto je osadził.

**Wniosek: wariant bierze wszystkie trzy gry za darmo.** Kopiuje wzorzec
z `Swiat.jsx:219` (mapa `id → leniwy(import)`) i osadza je we własnej logice.
Nie wolno przy tym zmieniać samych gier — jeżeli wariant potrzebuje od gry
czegoś innego, wchodzi to **nowym propsem z domyślną wartością**, nigdy
przerobieniem istniejącego zachowania.

Katalog `hub/data/minigry.v1.json` ma dziś sześć pozycji: trzy zbudowane
i trzy czekające z `trasa: null` (Echo Melodii, Trop Tropiciela, Zwój Znaków) —
gotowa lista do rozgrzebania, jeśli wariant ma stawiać minigry w centrum.

Przy dokładaniu **nowej** gry obowiązuje niezmiennie ośmiopunktowa checklista
z `docs/SYSTEMY_GRY.md` §6 — dwie listy (`GRY_W_HUBIE` i `GRY_OSADZONE`) muszą
iść w parze, bo rozjazd daje martwy kafelek bez żadnego błędu.

---

## 5. Piaskownica postępu — jak nie zepsuć prawdziwego dziecka

Stan gry nie jest w jednym miejscu. Źródłem prawdy jest **localStorage**
(`adventure/engine/adventureState.js`), API jest tylko synchronizacją w tle.
W `frontend/src` żyje dziś ok. 35 kluczy `ewolucja.*` — monety bonusowe,
gwiazdki, puzzle, misje gier, zadanie Wizkora, porady, nowości, wskazówki.
Każdy moduł trzyma własną stałą `KLUCZ`. Nie ma warstwy pośredniej.

Dlatego **nie przepisujemy tego pod wspólny prefiks.** Wariant ma własną pętlę,
więc ma własny stan:

- wszystko, co wariant zapisuje, idzie pod `ewolucja.w2.*` — jeden moduł
  `wariant/stan.js`, jedna stała prefiksu, zero kolizji z bazą;
- z bazy wariant **czyta** gracza (imię, awatar, `player.coins`) i tylko czyta;
- cechy: wariant liczy swoje u siebie. Dopisywanie do `state.traits` wspólnego
  stanu zmieniłoby profil dziecka w dzisiejszej grze — to jest właśnie ta jedna
  rzecz, której obiecaliśmy nie ruszyć.

Efekt: wejście na `/w2`, przeklikanie wariantu i wyjście zostawia dzisiejszą grę
w stanie nietkniętym. Reset piaskownicy = usunięcie kluczy z jednym prefiksem.

Cena tej decyzji, świadoma: nie sprawdzisz w ten sposób, jak wariant zachowuje
się dla dziecka, które w starej grze ma już 300 monet i trzy cechy. Jeśli to
będzie potrzebne, dokłada się osobno **import startowy** — jednorazowe skopiowanie
stanu bazy do piaskownicy przy pierwszym wejściu, nigdy w drugą stronę.

---

## 6. Warstwa dorosłego

Mentor i GM czytają dziś z bazy to, co zapisał backend (misje weryfikowane
przez dorosłego). Wariant, który proponuje inny sposób diagnozy cech, na czas
badania **nie dotyka tych tabel**. Raport z wariantu powstaje z piaskownicy
i pokazuje się na własnym ekranie (`/w2/mentor`), również za bramką.

Dopiero gdy wariant wygra, rozmawiamy o schemacie bazy. Migracja danych
eksperymentu do produkcyjnych tabel nigdy nie jest tania i nigdy nie jest
częścią eksperymentu.

---

## 7. Punkty w kodzie, które trzeba dotknąć

Pełna lista — nic poza tym:

| # | plik | zmiana | ryzyko |
|---|---|---|---|
| 1 | `frontend/src/main.jsx` | trasa `/w2` przez `leniwy()`, za bramką | żadne |
| 2 | `frontend/src/contexts/AppData.jsx:41` | `/w2` do `PROTECTED_PATHS` | **pominięcie = HUD bez gracza i 0 monet** (znana pułapka) |
| 3 | `frontend/src/contexts/AppData.jsx:44` | `/w2` do `ADVENTURE_PATHS` | bez tego backend podstawi Mentorowi obcą misję |
| 4 | `frontend/src/components/Scena3D.jsx:132` | prop `mapa` z domyślną wartością | żadne, jeśli domyślna = dziś |
| 5 | `frontend/public/scena-3d/mapa-w2.json` | nowy plik, robiony w edytorze | żadne |
| 6 | `frontend/src/wariant/` | nowy katalog: `Wariant.jsx`, `stan.js`, reszta | żadne |

Czego na tej liście NIE MA i być nie powinno: `pages/Swiat.jsx`, `hub/*`,
`scena-3d-src/src/*`, backend, baza.

---

## 8. Jak poznać, że wariant jest lepszy

Eksperyment bez kryterium kończy się tym, że wygrywa ten, którego się dłużej
robiło. Zanim powstanie pierwszy ekran, warto zapisać, na co patrzymy.
Propozycja trzech liczb, wszystkie dostępne z `services/analityka`:

1. **Czy dziecko wraca jutro.** Dziś jest na to jeden powód (porada dnia) —
   `docs/ROZWOJ_GRY.md` §6 nazywa to granicą numer sześć.
2. **Ile trwa pierwsza sesja i gdzie się urywa.** Dzisiejsza gra kończy się
   w jedno popołudnie.
3. **Ile dziecko robi rzeczy z własnej woli, a ile na zlecenie.** Dziś wszystko
   jest zlecone: łańcuch Wizkora ma cztery ogniwa i koniec.

Do tego jedna obserwacja, której żadna liczba nie zastąpi: posadzić dziecko
przy obu trasach tego samego dnia i patrzeć, przy której siedzi dłużej bez pytania
„co teraz".

---

## 9. Trzy wyjścia — każde tanie

- **Wariant wygrywa.** `/w2` przejmuje `/swiat`, stara pętla zostaje pod
  `/swiat-v1` albo znika. Fundamentu nikt nie ruszał, więc to zmiana tras,
  nie przepisywanie gry.
- **Wariant przegrywa.** Kasujemy trasę i katalog `wariant/`. Baza przez cały
  czas nie wiedziała o jego istnieniu.
- **Wariant wygrywa częściowo.** Najczęstszy przypadek i powód, dla którego
  minigry są osadzane, a nie kopiowane: dobre kawałki przenosi się pojedynczo,
  bo obie pętle stoją na tych samych klockach.

---

## 10. Czego nie robić (lekcje, które to repo już zapłaciło)

- **Nie zaczynać od lore.** `agents/world/*.md`, `project_instructions`
  i archiwalne dokumenty wciąż opisują sześć krain, Iskrę, quiz osobowości
  i sześć profili. Nic z tego nie jest w grze. Punkt wyjścia to
  `docs/KONCEPT_GRY.md` i ekran, nie dokument.
- **Nie „przy okazji" refaktorować `Swiat.jsx`.** 2497 linii z gęstymi
  komentarzami o tym, dlaczego coś jest właśnie tak. Dotknięcie go w trakcie
  eksperymentu zamienia dwa niezależne ryzyka w jedno wielkie.
- **Nie edytować bundla sceny.** Strażnik zablokuje, i słusznie.
- **Nie przenosić `agents/world/` ani `agents/prompts/`.** Backend czyta je
  po ścieżkach w stringach; przeniesienie daje ciche `ENOENT` i grę, która
  wstaje, tylko głupieje.
- **Nie ufać `git status` z mounta Linuksowego.** CRLF robi fałszywe „M".
  Status, diff, add, commit i push — wyłącznie gitem Windows.
- **Nie linkować `/w2` z huba „na chwilę, do pokazania".** Linki żyją dłużej
  niż intencje; dokładnie tak zostały po sobie `/mapa`, `/przygoda` i `/play`.

---

## 11. Kolejność pierwszych kroków

1. Zdecydować, co produkcja ma pokazywać — dziś jest na płaskiej mapie (§0).
2. Napisać jedną stronę: **co dziecko robi w wariancie przez pierwsze pięć minut**.
   Bez tego reszta jest budowaniem aparatury do niczego.
3. Postawić szkielet: trasa `/w2`, `PROTECTED_PATHS`, prop `mapa`, pusty
   `Wariant.jsx` ze sceną i HUD-em. Pół dnia, zero ryzyka.
4. Zrobić drugą mapę w edytorze — choćby jedną polanę, byle nie tę samą.
5. Osadzić jedną minigrę, żeby sprawdzić, że kontrakt z §4 trzyma w nowym miejscu.
6. Dopiero teraz budować pętlę.
