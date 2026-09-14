# Plan działania — profil, test, pierwsze zadania, planeta

Spisane 2026-09-14 na podstawie kodu (nie dokumentów) przez trzy przejścia:
panel zadań + psycholog (test i zadania), `scena-3d` + świeże spojrzenie
(planeta), `strateg-produktu` + audyt kodu (koszt i ryzyka).

Nadrzędny dokument: `docs/OPIS_PROJEKTU.md`. Treść testu:
`docs/TEST_OBRAZKOWY.md`. Stan ekranów: `docs/KONCEPT_GRY.md`.

---

## 0. Cztery fakty, które zmieniają kolejność prac

Zanim cokolwiek zaprojektujemy na profilu, trzeba wiedzieć, że **system
sześciu typów dziś nie działa**, mimo że ma i quiz, i radar.

| # | fakt | dowód |
|---|---|---|
| 1 | **Quiz jest wyłączony.** Dziecko wchodzi prosto do `/swiat`, konto zakłada się po cichu na „Wędrowca”. Pełny quiz działa tylko pod `/onboarding?quiz=1`. | `frontend/src/pages/Onboarding.jsx:62` → `POMIN_ONBOARDING = true` |
| 2 | **Każde dziecko liczy się jako Detektyw.** Gdy `archetype` jest pusty, backend leci na twardy fallback `"DT"` — cały dorobek każdego gracza podbija jedną oś. Radar Mentora dziś kłamie. | `backend/src/api/cycles.js:274`, `backend/src/api/mentor.js:134` |
| 3 | **`competency_focus` w zadaniach to śmieć.** Wszystkie 10 zadań ma `MD` albo `EM`, niezwiązane z treścią („Łowca pytań” → `MD`). To pole nie jest martwe: `cycles.js:277` dolicza z niego +2 do `lifetime_scores`. | `frontend/src/hub/data/zadania-wizkora.v1.json` |
| 4 | **Tor `/w2` żyje i robi już całą pętlę z opisu projektu**: poznanie dziecka, trop, przygotowanie w grze, „odkładam ekran”, ślad, Mentor zauważa, powrót, ślady na polanie, fasola rośnie od `etapWzrostu`. Ma też **limit sesji 8 minut**. | `frontend/src/main.jsx:88`, `frontend/src/wariant/{Wariant.jsx,stan.js,tresci.js}` |

Fakt 4 jest najważniejszy: **nie budujemy nowego toru, tylko dokładamy profil
i planetę do tego, co już działa.** Fakty 1–3 są tanie do naprawy i bez nich
każdy pomiar profilu jest fikcją.

Cena decyzji „sześć typów”: w szóstce **nie ma osi wytrwałości**. Rozlewa się
między `MD` (powtarzanie, skupienie) a `ST` (domknięcie planu). To trzeba
przyjąć świadomie — albo dopisać siódmy typ, czego nie rekomenduję.

---

## 1. Etap 0 — fundament (pół dnia, największy zwrot)

| krok | plik | co zrobić |
|---|---|---|
| 0.1 | `frontend/src/hub/data/zadania-wizkora.v1.json` | poprawić `competency_focus` wg mapowania z §2 |
| 0.2 | `backend/src/api/cycles.js:274`, `mentor.js:134` | usunąć fallback `"DT"` — bez profilu nie dopisujemy nic, zamiast dopisywać do losowej osi |
| 0.3 | `backend/src/api/cycles.js:63` (`seedMission`) | walidacja kodu typu: `400` zamiast cichego ignorowania. Dziś wpisanie `"ciekawosc"` daje grę, która wygląda dobrze i nie liczy nic |
| 0.4 | `frontend/src/hub/panels/ProfilPanel.jsx` | „Mocne strony” czytają `lifetime_scores` (6 typów), nie `state.traits` (5 cech) |

Po tym etapie radar Mentora pokazuje prawdę i można w ogóle mierzyć, czy
profil działa.

---

## 2. Mapowanie 5 cech → 6 typów

`TRAIT_TO_LEGACY` w `adventureState.js:18` jest stratne (`wspolpraca` skleja
`EM` i `MD`, `wytrwalosc` idzie na `ST`). Poniżej mapowanie ręczne.

| zadanie | cecha dziś | typ | pewność |
|---|---|---|---|
| `lowca-pytan` | ciekawosc | **DT** | jednoznaczne |
| `zwiadowca-podworka` | ciekawosc | **DT** | jednoznaczne |
| `cos-z-niczego` | tworzenie | **KR** | jednoznaczne |
| `warsztat-wynalazcy` | tworzenie | **KR** | jednoznaczne |
| `jeden-krok-dalej` | odwaga | **LD** | jednoznaczne |
| `pierwszy-raz` | odwaga | **LD** | jednoznaczne |
| `ramie-w-ramie` | wspolpraca | **EM** (druga: MD) | do decyzji |
| `mistrz-instrukcji` | wspolpraca | **MD** (druga: ST) | do decyzji |
| `siedem-razy` | wytrwalosc | **MD** (druga: ST) | do decyzji |
| `do-samego-konca` | wytrwalosc | **ST** (druga: MD) | do decyzji |

Rozkład po mapowaniu: DT 2 · KR 2 · LD 2 · MD 2 · EM 1 · ST 1. **Trzeba
dopisać po jednym zadaniu dla EM i ST**, żeby każdy typ miał dwa — robota dla
`/panel-zadan`, nie dla kodu.

To samo dotyczy siedmiu przygód w `frontend/src/wariant/tresci.js` (pole `os`)
— przepisać na typy przy okazji etapu 3.

---

## 3. Etap 1 — test obrazkowy

Pełna specyfikacja i treść sześciu pytań: **`docs/TEST_OBRAZKOWY.md`**.
Skrót kroków:

1. **Decyzja o miejscu testu.** Rekomendacja: test trafia do ekranu
   „Poznajmy się” w `/w2` (`Wariant.jsx` → `Poznanie`), który dziś ma dwa
   pytania tekstowe o preferencje na pięciu osiach. To jedno miejsce zamiast
   dwóch i od razu spina profil z przygodami.
2. **Dane pytań** — `ONBOARDING_QUIZ` w `backend/src/api/onboarding.js`
   przepisać na 6 pytań × 4 odpowiedzi + flaga `tylko-4-8`.
3. **Punktacja** — dopisać `main_picks`, losować kolejność kafelków, dodać
   cichy kafelek „pokaż inne”.
4. **Grafika** — 24 ilustracje wg briefu z §5 dokumentu testu. To jest
   najdłuższy element etapu i jedyny, który kosztuje kredyty.
5. **Balans** — przeliczyć Monte Carlo w `backend/scripts/test-quiz-balance.mjs`
   (stare liczby były dla 8×4).
6. **Włączenie** — `POMIN_ONBOARDING = false` albo równoważnik w `/w2`.

---

## 4. Etap 2 — profil ucznia

Pola w `players`, co widzi dziecko, co widzi Mentor i mechanizm douczania
z realnych wyborów: `docs/TEST_OBRAZKOWY.md` §6–§8.

**Migracja bazy nie jest potrzebna.** `scores` i `lifetime_scores` już są
sześcioosiowe (`backend/src/database/db.js:36,43`), `archetype` trzyma kod
typu, a warstwa tłumacząca starsze nazwy istnieje (`Onboarding.jsx:28`).
Pięcioosiowy `state.traits` leży w localStorage i w `adventure_state` —
wystarczy przestać go wyświetlać, kolumna zostaje (trzyma też `grants`,
`color`, `unlocked`).

Jedyna dziura w danych: gracze bez `archetype` mają dorobek doliczony do DT.
Jednorazowy SQL przeliczający profil z `lifetime_scores` — dopiero gdy quiz
wróci.

---

## 5. Etap 3 — pierwsze zadania i Koło Przeznaczenia

### Koło

Najtańsza wersja, która robi dokładnie to, o co chodzi: **zostawić pięć pól
i zmienić ich znaczenie** — koło losuje *rodzaj wyzwania*, a konkretne
zadanie dobiera się z typu dziecka. Grafika (`kolo-tarcza.png`, pięć klinów
po 72°) zostaje nietknięta; kod jest parametryczny
(`KoloFortuny.jsx:41-49`), więc szóste pole jest możliwe później.

Przerysowanie tarczy na sześć klinów to **jedyna pozycja w tym planie liczona
w dniach, a dziecko nie odróżni pięciu pól od sześciu.** Odkładamy.

**Jedno pole zostaje dzikie** — zadanie spoza typu. Bez tego nieśmiałe dziecko
nigdy nie dostanie zadania na odwagę.

### Pierwsze zadanie dla każdego typu

Format pól: `docs/PANEL_ZADAN.md`. Każde w wersji hybrydowej: część w grze →
część w realu → prosty ślad.

| typ | id | tytuł | cel (2 linie) | dowód | min |
|---|---|---|---|---|---|
| **ST** | `mapa-jednej-drogi` | Kartograf | Narysuj drogę, którą znasz na pamięć. / Zaznacz trzy rzeczy, których nikt nie rysuje. | zdjęcie mapy albo opowiedz, co zaznaczyłeś | 15 |
| **MD** | `dwie-strony-jednej-rzeczy` | Most | Znajdź rzecz, którą dwie osoby widzą inaczej. / Powtórz każdej, co powiedziała druga. | obie odpowiedzi albo zdjęcie dwóch rysunków | 10 |
| **EM** | `cieplo-bez-slow` | Ciepły ślad | Zrób komuś coś dobrego tak, / żeby nie wiedział, że to ty. | zdjęcie tego, co zostawiłeś, albo jedno zdanie | 10 |
| **KR** | `stworz-z-trzech` | Trzy części | Weź trzy rzeczy, które do siebie nie pasują. / Zrób z nich jedną. | zdjęcie albo powiedz, do czego służy | 20 |
| **DT** | `trop-w-domu` | Odkrywca | Znajdź w domu rzecz starszą od ciebie. / Dowiedz się, skąd się wzięła. | zdjęcie znaleziska albo jego historia | 15 |
| **LD** | `pierwszy-glos` | Pierwszy głos | Zaproponuj coś, zanim zrobi to ktoś inny. / Jeden raz dzisiaj. | co zaproponowałeś albo zdjęcie efektu | 10 |

Część w grze (Część A) dla każdego: ST — Wizkor pokazuje mapę polany z jednym
znakiem; MD — most rozświetla się dopiero z dwóch stron; EM — lisek dostaje
ten sam ślad na polanie; KR — dziecko składa trójelementowy puzzel bramy;
DT — Kompas Cieni wskazuje kierunek; LD — Tarcza Słońca zapala się po
zleceniu.

**Kolejność pierwszych trzech zadań:** zadanie typu → zadanie sąsiada
w pierścieniu → zadanie z typu o najniższym liczniku `sygnaly`. Trzecie jest
już douczone realnymi wyborami, nie testem.

**Zmiana w danych:** do wpisu zadania dopisać pole `profil` (kod typu) obok
`cecha`, żeby stara logika nie padła w trakcie przejścia.

---

## 6. Etap 4 — planeta: co widać i co jest do odkrycia

Liczby przeliczone dla **rzeczywistej mapy W2**: `promienKuli = 8.5`, słońce
nad środkiem, `r = 0,1484 · θ`. **Uwaga: `docs/PIERWSZA_MINUTA.md` liczy
wszystko dla R = 11 i startu θ = 35° — te kąty są nieaktualne.**

### Co dziś naprawdę stoi na W2

Doba (okrążenie 38,7 s marszem, 15,6 s biegiem), cienie rzucane, teren
fasetowany, 4 chmury, zasiew kwiatów za liskiem, 7 drzew, 8 głazów,
96 kwiatów, Magiczna Fasola (5 etapów, pnącze, wstęga do wspinaczki, emituje
`swiat:dalej`), oczko wody. **Znaków na mapie: zero** — ścieżka, rzeka, most,
brama, latarnia i budynki są puste. Trzy świetliki leżą w `znakiWylaczone`
z pozycjami policzonymi dla R = 11 — trzeci wylądowałby za antypodem.

### Pierwsze 30 sekund — kierunek bez tekstu

Start: `[0, 6.72]` → **θ = 45°**. Słońce z boku, cień długi i skierowany na
zewnątrz. Reguła, której dziecko nie musi nazwać: *idź pod cień — dojdziesz
do fasoli; idź za cieniem — wejdziesz w noc.*

Zasięg widoczności na kuli R = 8,5: obiekt wysoki na 3 j. widać z 61° łuku,
fasola-gigant (9 j.) z 80°, ziarno (0,45 j.) z 37°.

Z tego dwa wnioski:

1. **Fasola (θ 29°, 16° od startu) jest widoczna od pierwszej klatki** nawet
   jako ziarno — grządka to jedyna nie-zielona plama w kadrze. Ona ciągnie
   wzrok i ona jest celem.
2. **Oczko wody (θ 75°) nie jest widoczne ze startu** — 62° łuku, tafla ma
   zerową wysokość. Dziecko nie ma jak zgadnąć, że woda istnieje. **To
   najpoważniejsza dziura w dzisiejszej pierwszej minucie.** Tania naprawa:
   jeden obiekt wysokości 2,5–3 j. przy θ ≈ 68° (Kamienny Pąk — model już
   jest w silniku, nieużywany — albo samotna sosna w skali 1,6).

### Punkty do odkrycia

**(A) Z dzisiejszego silnika, sam wpis w `mapa-w2.json`:**

| # | co | θ / pos | z daleka | po dojściu |
|---|---|---|---|---|
| 1 | **Kamienny Pąk** | 62° / `[8.4, 2.9]` | ciemna sylwetka 3 j., jedyna rzecz bez ruchu | `reagujeNaSwiatlo` — mruga wg liczby kul, przy komplecie otwiera się |
| 2–4 | **Świetliki I–III** | 100° / 115° / 130° | punkciki światła tylko nocą | `zbiera:"swiatlo"` → kula przy biodrze, ogon jaśnieje |
| 5 | **Kopiec widokowy** | 20° / `[-2.4, 1.7]` | łagodne wybrzuszenie | z góry widać fasolę i granicę nocy naraz |
| 6 | **Nora Króliczka** | 40° / `[-5.0, 3.6]` | mały ruch w trawie | NPC wędrujący po `pozycje` + `cykl`; `kroliczek.glb` już jest |
| 7 | **Chatka** | 55° / `[-7.2, 3.5]` | dach nad horyzontem, nocą świeci | próg → panel „co już masz”; `hut2.glb` już jest |
| 8 | **Krąg głazów** | 50° / `[6.0, -4.2]` | pięć brył w kole | miejsce zadania „obserwuj / nasłuchuj” — **wymaga wyjścia poza ekran** |
| 9 | **Zagajnik za horyzontem** | 120° / `[-5.5, 16.9]` | korony zza krawędzi | nocny cel, kontrapunkt polany |

**(B) Jeden nowy model:** dzwon / muszla nasłuchu (θ 88°, na granicy światła —
świat sam daje sygnał do zadania), gniazdo darów przy oczku (θ 70° — tu ląduje
ślad z zadania poza ekranem).

**(C) Nowa mechanika:** czoło zieleni rozchodzące się od Pąka, chmura
i deszcz podlewający fasolę bez chodzenia do wody, wejście do W3 na szczycie
fasoli (`swiat:dalej` już jest emitowane, `mapa-w3.json` to pusty placeholder).

**Pas użyteczny kończy się na r = 19,2 (θ ≈ 130°)** — dalej rzut ściska rzeczy
w wachlarz, a za r = 26,7 wracają na drugą stronę planety.

### Pięć tanich dowodów, że realne działanie coś zmieniło

1. **Fasola rośnie o etap za każde zauważone zadanie** — `Fasola.podlej()`
   i `etapWzrostu(stan)` już istnieją i są spięte w `/w2`. Sylwetka rośnie
   z 0,45 do 9 j., czyli widać ją z 37° zamiast z 80° łuku: planeta dosłownie
   robi się widoczna z drugiej strony.
2. **Kwiaty wokół startu** — `scena.ustawSladyPrzygod(n)` gotowe i używane
   w `Wariant.jsx`; pięć kwiatów na przygodę. Po pięciu powrotach polana
   startowa jest inna niż pierwszego dnia.
3. **Krąg wokół Pąka zmienia barwę** — jedna forma terenu z rosnącym
   promieniem, popiół → zieleń, shader zamiast nowych siatek.
4. **Zapala się kolejne światło** wzdłuż drogi do fasoli — wracając po zmroku
   dziecko widzi szereg latarni, których wcześniej nie było. **Limit: 3–4
   światła punktowe naraz**, reszta jako sprite'y poświaty.
5. **Jedno drzewo więcej za każdy zamknięty wątek** — `drzewa[]` to czysta
   dana; po miesiącu jest las tam, gdzie była trawa.

### Typ osobowości a planeta — bez rozbijania sceny

`Scena3D.jsx` ma prop `przygotujMape(surowe)` wołany po fetchu, przed
przekazaniem mapy do silnika. To cały potrzebny hak. W `mapa-w2.json` dodać
sekcję `profile`, gdzie klucz to kod typu, a wartość to fragmenty tych samych
tablic, które mapa już ma (`drzewa`, `kwiaty`, `glazy`, `znaki`,
`formyTerenu`). `przygotujMape` skleja: `mapa[klucz] = [...mapa[klucz],
...profile[kod][klucz]]`.

Zero `if (profil === …)` w scenie, jeden bundle, sześć obsad rekwizytów: przy
chatce rośnie inna roślina, Wizkor stawia inny pierwszy obiekt, na kopcu leży
inny głaz.

---

## 7. Kolejność i koszt

| # | co | koszt | dlaczego teraz |
|---|---|---|---|
| 1 | Etap 0 — fundament (§1) | **pół dnia** | bez tego każdy pomiar profilu jest fikcją |
| 2 | Mapowanie zadań + 2 nowe (EM, ST) (§2) | **dzień** (panel zadań) | dane, nie kod; odblokowuje dobór pod typ |
| 3 | Obiekt przy oczku wody (§6) | **godzina** | największa dziura w pierwszej minucie, jeden wpis w JSON |
| 4 | Test obrazkowy — dane i logika (§3.1–3.3, 3.5) | **1–2 dni** | działa ze stubami grafik |
| 5 | 24 ilustracje | **kilka dni + kredyty** | najdłuższe, może iść równolegle z 4 |
| 6 | Profil: pola, douczanie, ekran wyniku (§4) | **1–2 dni** | domyka pętlę „test → zadania → wybory → test” |
| 7 | Koło dobiera pod typ, pięć pól (§5) | **dzień** | mechanika bez nowej grafiki |
| 8 | Punkty na planecie z grupy (A) (§6) | **1–2 dni** | wpisy w `mapa-w2.json`, modele już są |
| 9 | `profile` w mapie + `przygotujMape` (§6) | **dzień** | profil widać w świecie, nie tylko w panelu |
| 10 | Grupa (B) i (C) — nowe modele i mechaniki | **tygodnie** | dopiero po teście z dzieckiem |

**Tydzień, który daje najwięcej:** 1 + 2 + 3 + 7. Po nim koło dobiera zadania
pod typ, radar mówi prawdę, a pierwsza minuta ma cel widoczny z miejsca
startu — bez ani jednej nowej ilustracji.

---

## 8. Ryzyka dla produkcji (`v2-postgres-vercel`, auto-deploy)

1. **Ucięcie dużego pliku przy zapisie przez mount.** `zadania-wizkora.v1.json`
   i `Swiat.jsx` (2350+ linii) to dokładnie te rozmiary. Ucięty JSON wywala
   build Vite, czyli **całą grę**. Po każdej edycji: `wc -l` kontra
   `git show HEAD:<plik> | wc -l`, `node -e "JSON.parse(...)"`, `tail -3` przed
   `git add`.
2. **Usunięcie `TRAIT_LABELS` / `TRAIT_TO_LEGACY` z `adventureState.js`.**
   Importują je `ProfilPanel`, `Profile`, `DevRezyserka`, `useAdventure`.
   Brakujący eksport w Vite to **biały ekran**, nie ostrzeżenie, i nie łapie
   go `node --check` (JSX). Wygaszać przez pozostawienie eksportów jako
   warstwy zgodności; `npm run build` lokalnie przed pushem.
3. **Cichy rozjazd kodów.** `cycles.js:277` i `mentor.js:134` przyjmują
   wyłącznie `{EM,ST,KR,LD,DT,MD}`; kod spoza listy jest **ignorowany bez
   błędu w Sentry**. Stąd walidacja w kroku 0.3.
4. **Strażnik sceny.** `.claude/hooks/straznik-sceny.mjs` blokuje edycję
   `public/scena-3d/scena3d*.js` — źródła są w `frontend/scena-3d-src/src/`,
   build: `cd frontend && node scena-3d-src/build.mjs`, potem podbij
   `WERSJA_SCENY` (dziś `75`).
5. **Czasu nie sprawdzisz bezgłowo.** Bezgłowy Chromium zatrzymuje pętlę po
   kilkunastu klatkach — doba, respawny i wzrost fasoli tylko w prawdziwej
   przeglądarce (`/scena-3d/?mapa=w2`, `?kula=N` do strojenia skali).

---

## 9. Co decyduje autorka, zanim ruszymy

1. **Miejsce testu:** ekran „Poznajmy się” w `/w2` (rekomendacja) czy osobny
   `/onboarding` dla obu torów?
2. **Etykieta `MD`:** „Skupienie” czy „Łączenie”? Dziś radar mówi jedno,
   archetyp drugie, a ilustracja może pokazać tylko jedno.
3. **Cztery zadania z niejednoznacznym mapowaniem** (§2) — Twoja decyzja albo
   przejście panelu zadań.
4. **Wytrwałość** znika jako osobna oś. Przyjmujemy, czy szukamy dla niej
   miejsca?
5. **Kredyty na 24 ilustracje** — zanim ruszy krok 5, mówimy ile.
