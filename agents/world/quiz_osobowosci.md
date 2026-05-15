# Quiz Osobowości — pytania, ścieżka do profilu, punktacja cech

> **Cel dokumentu:** referencja dla agentów audytujących sensowność pytań, balans punktacji i mapowanie cecha → archetyp. Zmiana czegokolwiek tutaj powinna iść w parze ze zmianą w [`backend/src/api/onboarding.js`](../../backend/src/api/onboarding.js).

---

## 1. Mapowanie cecha ↔ kod profilu ↔ archetyp

Radar w [`frontend/src/components/CharakterBohatera.jsx`](../../frontend/src/components/CharakterBohatera.jsx) pokazuje **6 cech**. Każda cecha ma 1:1 powiązanie z kodem profilu i finalnym archetypem.

| Cecha (label radaru) | Kolor radaru | Kod profilu | Archetyp (legacy alias) | Skrót |
|---|---|---|---|---|
| **Mądrość** | fiolet `#7A4DC2` | `ST` | `mistrz_map` (Strateg) | MĄD |
| **Odwaga** | pomarańcz `#E89A3D` | `LD` | `gwardzista_odwagi` (Lider) | ODW |
| **Ciekawość** | zieleń `#5FA76F` | `DT` | `tropiciel_tajemnic` (Detektyw) | CIE |
| **Skupienie** | błękit `#378ADD` | `MD` | `straznik_mostu` (Mediator) | SKU |
| **Życzliwość** | róż `#E4779C` | `EM` | `zaklinacz_uczuc` (Empata) | ŻYC |
| **Kreatywność** | żółty `#EF9F27` | `KR` | `tkacz_snow` (Kreator) | KRE |

**Źródła prawdy:**
- `TRAITS[]` — [`frontend/src/components/CharakterBohatera.jsx:16-23`](../../frontend/src/components/CharakterBohatera.jsx#L16-L23)
- `PROFILE_TO_ARCHETYPE` — [`backend/src/api/onboarding.js:56-63`](../../backend/src/api/onboarding.js#L56-L63)

---

## 2. Ścieżka gracza: od odpowiedzi do archetypu

```
[5 pytań × 3 odpowiedzi]
        ↓
[gracz wybiera po jednej odpowiedzi]
        ↓
POST /api/onboarding/submit  { player_id, answers: [{question_id, answer_id}, …] }
        ↓
[backend sumuje punkty z każdej wybranej odpowiedzi]  → scores = { EM, ST, KR, LD, DT, MD }
        ↓
pickArchetype(scores)  — sortuje malejąco, bierze pierwszy dostępny w MVP_AVAILABLE_ARCHETYPES
        ↓
player.archetype = <kod profilu, np. "ST">   ← UWAGA: zapisujemy KOD, nie nazwę archetypu
player.lifetime_scores += scores              ← te wartości karmią radar
        ↓
createCycle()  — start pierwszej misji
```

**Newralgiczny szczegół:** `player.archetype` przechowuje **kod profilu** (`"ST"`), nie string typu `"mistrz_map"`. Pole `archetype` w odpowiedzi API jest aliasem dla `dominant_profile`. Komentarz w kodzie: [`backend/src/api/onboarding.js:125-127`](../../backend/src/api/onboarding.js#L125-L127).

---

## 3. Pytania (stan obecny v2)

> Każda odpowiedź daje **2 pkt głównej cesze + 1 pkt cesze drugorzędnej**. Pozostałe 4 cechy dostają **0 pkt**. To źródło problemu opisanego w §4.

### Q1 — Skrzynia w lesie
> *„Wracasz z lasu i widzisz tajemniczą skrzynię. Co robisz?"*

| # | Odpowiedź | Punkty |
|---|---|---|
| a | Spokojnie. Najpierw obejdę ją dookoła, sprawdzę zamek — dopiero wtedy zdecyduję. | **ST +2**, MD +1 |
| b | Coś tu się ukrywa! Szukam wokół śladów i wskazówek. | **DT +2**, KR +1 |
| c | Otwieram odważnie. Strach minie, ciekawość zostanie! | **LD +2**, EM +1 |

### Q2 — Smutny przyjaciel
> *„Twój najlepszy przyjaciel siedzi smutny w kącie. Co robisz?"*

| # | Odpowiedź | Punkty |
|---|---|---|
| a | Siadam obok i pytam: „co czujesz?" — czekam, aż się otworzy. | **EM +2**, DT +1 |
| b | Wymyślam głupkowate przebranie albo grę, żeby go rozśmieszyć. | **KR +2**, LD +1 |
| c | Mówię: „jutro znajdziemy coś fajnego" — i razem to planujemy. | **ST +2**, MD +1 |

### Q3 — Kłótnia w domu
> *„Dwie osoby w domu się kłócą. Co robisz?"*

| # | Odpowiedź | Punkty |
|---|---|---|
| a | Słucham każdej z osobna, szukam tego, co je łączy — i o tym mówię. | **MD +2**, EM +1 |
| b | Pytam każdą: „co się NAPRAWDĘ stało?" — chcę zrozumieć. | **DT +2**, ST +1 |
| c | Mówię: „STOP! Wymyśliłem coś, co robimy razem!" | **KR +2**, LD +1 |

### Q4 — Wielkie zadanie na tydzień
> *„Dostajesz tydzień na zrobienie czegoś wielkiego. Jak zaczynasz?"*

| # | Odpowiedź | Punkty |
|---|---|---|
| a | Wyciągam kartkę i planuję dzień po dniu, krok po kroku. | **ST +2**, DT +1 |
| b | Zbieram drużynę, rozdzielam role, ruszamy razem. | **LD +2**, MD +1 |
| c | Sprawdzam, czy nikt mi nie pomoże — razem szybciej i fajniej. | **EM +2**, KR +1 |

### Q5 — Nowa osoba w grupie
> *„W twojej grupie jest ktoś nowy, kto siedzi sam. Co robisz?"*

| # | Odpowiedź | Punkty |
|---|---|---|
| a | Podchodzę cicho, mówię: „cześć, lubisz tu?" — i słucham. | **EM +2**, ST +1 |
| b | Pytam, co lubi robić — szukam czegoś wspólnego. | **DT +2**, KR +1 |
| c | Łączę go z osobą, która ma podobne hobby — robię most. | **MD +2**, LD +1 |

### Suma maksymalnych punktów (gdyby ktoś mógł wybrać wszystkie odpowiedzi maksymalizujące daną cechę)
- DT, EM, ST → **max 8 pkt** każda
- KR, LD, MD → **max 7 pkt** każda

---

## 4. Diagnoza obecnego quizu (audyt 2026-05-15)

### Problem ogólny: punktacja nie zbuduje bogatego radaru
Każda odpowiedź daje punkty tylko **2 z 6 cech** (np. `ST:2, MD:1`). Pozostałe 4 cechy dostają 0. Po 5 pytaniach co najmniej 1-2 cechy zostają na 0 pkt → radar wygląda jak „zapadnięta gwiazda" zamiast pełnego heksagonu (referencyjny wykres ma rozkład 4-9 pkt na każdej z 6 osi).

**Przykład patologii:** gracz wybiera Q1a, Q2a, Q3a, Q4a, Q5a → punkty: ST=4, MD=3, EM=4, DT=1, KR=0, **LD=0**. Dwa „wcięte" wierzchołki radaru.

### Diagnoza per pytanie

| # | Werdykt | Powód |
|---|---|---|
| Q1 (Skrzynia w lesie) | **ZACHOWAĆ** | Dobry scenariusz przygodowy, sensownie różnicuje ST/DT/LD. Dopisać 4. opcję dla KR/MD. |
| Q2 (Smutny przyjaciel) | **ZACHOWAĆ** | OK, ale silnie pro-EM. Brak opcji „daj mu przestrzeń" (MD/ST). Dopisać 4. opcję. |
| Q3 (Kłótnia w domu) | **PRZEPISAĆ** | **Zbyt ciężkie dla 6-7-latków** — konflikt rodzinny może być źródłem niepokoju. Zmienić na konflikt rówieśniczy (np. dwoje znajomych chce różnych gier). |
| Q4 (Tydzień na wielkie zadanie) | **PRZEPISAĆ** | Jedyne nie-relacyjne, ale wszystkie 3 opcje zakładają pracę z innymi. Brakuje samodzielnej kreatywności (KR) i solo-eksploracji (DT). |
| Q5 (Nowa osoba w grupie) | **USUNĄĆ** | Dubluje temat Q2 (pomoc komuś w grupie). Zastąpić scenariuszem przygodowo-logicznym. |

### Wniosek strukturalny
**4/5 pytań to scenariusze relacyjne** → przegięcie w stronę EM/MD. Brakuje:
- pytań o świat fizyczny (eksploracja, ryzyko) → niedoreprezentowane LD/DT
- wyborów estetyczno-twórczych (samotne tworzenie) → niedoreprezentowane KR
- zagadek logicznych (bez kontekstu społecznego) → niedoreprezentowane ST/DT

---

## 5. Propozycja v3-final — 8 pytań × 4 opcje, rozproszona punktacja

### Format
- **8 pytań × 4 odpowiedzi** (24-32 sekundy uwagi 6-latka × 8 = ~4 min — w granicach rozsądku)
- Każda odpowiedź daje punkty **wszystkim 6 cechom** wg rozkładu `(3, 2, 2, 1, 1, 0)` = łącznie 9 pkt na odpowiedź
- Max osiągalny per cecha: **8 × 3 = 24 pkt**; realny rozkład gracza: **~6-20 pkt** → bogaty wielokąt bez zerowych wierzchołków
- Walidacja: każda cecha jest „główną +3" w ~5-6 odpowiedziach w całym quizie (3-4 razy globalnie + obecność w każdym pytaniu jako sąsiad/dalsza)

### Pierścień sąsiedztwa cech (FINAL)

**`ST — MD — EM — KR — DT — LD — ST`**

| Para | Logika sąsiedztwa |
|---|---|
| ST ↔ MD | planowanie ↔ rozważanie |
| MD ↔ EM | łączenie ↔ wczuwanie |
| EM ↔ KR | wrażliwość ↔ ekspresja (empata często rysuje uczucia) |
| KR ↔ DT | pomysłowość ↔ eksploracja („a co jeśli") |
| DT ↔ LD | dociekliwość ↔ akcja (detektyw wchodzi w jaskinię) |
| LD ↔ ST | inicjatywa ↔ strategia (lider planuje atak) |

**Przeciwieństwa funkcjonalne** (cecha „0 pkt" w odpowiedziach głównej):
- **ST ↔ KR** (logika vs improwizacja)
- **MD ↔ LD** (kompromis vs naprzód)
- **EM ↔ DT** (czuję vs analizuję)

> *Zmiana wzgl. v3-draft:* poprzedni pierścień `ST-DT-KR-LD-EM-MD` miał słaby link LD↔EM (przeciwieństwa funkcjonalne traktowane jako sąsiedzi). Nowy pierścień ma czyste, „uczebnikowe" osie temperamentów dziecięcych.

### Reguła rozkładu punktów dla odpowiedzi

Dla odpowiedzi której **główną cechą** jest X:
- **X (główna):** +3
- **2 sąsiedzi X w pierścieniu:** +2 każdy
- **2 dalsze cechy** (sąsiedzi sąsiadów): +1 każda
- **Przeciwieństwo X** (na drugim końcu pierścienia): 0

### 3 przykładowe pytania (gotowe do implementacji)

#### NQ1 — Znaleziony klucz
> *„Znajdujesz na strychu klucz. Chcesz sprawdzić, do czego pasuje. Co robisz?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Robię listę pomieszczeń w domu i sprawdzam jedno po drugim. | **3** | 2 | 1 | 0 | 1 | 2 |
| b | Wymyślam, że to klucz do magicznej krainy i rysuję mapę. | 0 | 1 | 2 | **3** | 2 | 1 |
| c | Pytam babcię, dziadka, sąsiadkę — może któreś z nich pamięta. | 1 | 2 | **3** | 2 | 1 | 0 |
| d | Idę natychmiast szukać zamka — sprawdzę każde drzwi i schowek. | 2 | 1 | 0 | 1 | 2 | **3** |

#### NQ2 — Koledze rozsypała się książka
> *„Koledze wypadła książka i wszystko się rozsypało, jest mu głupio. Co robisz?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Pomagam mu pozbierać książki, nic nie mówię. | 1 | 2 | **3** | 2 | 1 | 0 |
| b | Pytam: „pomóc Ci pozbierać? Co się rozsypało?" | 1 | 0 | 1 | 2 | **3** | 2 |
| c | Robię z tego nasz tajny żart, żeby śmiech zastąpił to „głupio". | 0 | 1 | 2 | **3** | 2 | 1 |
| d | Wstaję pierwszy/a i wołam: „pomagamy zbierać, kto ze mną?" | 2 | 1 | 0 | 1 | 2 | **3** |

#### NQ3 — Zaginiony kot sąsiadki *(NOWY scenariusz przygodowo-logiczny)*
> *„Sąsiadka zgubiła kota. Co robisz najpierw?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Rysuję plakat „Zaginął kot" i rozwieszam w okolicy. | 0 | 1 | 2 | **3** | 2 | 1 |
| b | Idę i pytam każdego sąsiada po kolei. | 2 | 1 | 0 | 1 | 2 | **3** |
| c | Zostaję z sąsiadką i pocieszam ją — kot wróci, koty wracają. | 1 | 2 | **3** | 2 | 1 | 0 |
| d | Pytam, gdzie ostatnio go widziała, gdzie kot najczęściej chodzi i co lubi, rysuję trasę. | 1 | 0 | 1 | 2 | **3** | 2 |

**Walidacja:** w każdym pytaniu suma punktów = 36 (4 odp × 9 pkt), każda cecha pojawia się jako „główna 3" dokładnie raz w pytaniu → idealny balans w obrębie pytania.

#### NQ4 — Pochwała na apelu
> *„Pani mówi przed całą klasą, że Twoja praca była najlepsza. Co robisz?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Robię gest zwycięstwa i krzyczę „JES!" — niech wszyscy poczują energię. | 2 | 1 | 0 | 1 | 2 | **3** |
| b | Robię w głowie listę: co dokładnie zadziałało, żeby powtórzyć to następnym razem. | **3** | 2 | 1 | 0 | 1 | 2 |
| c | Po lekcji rysuję kartkę z podziękowaniem dla pani — z serduszkami i ramką. | 0 | 1 | 2 | **3** | 2 | 1 |
| d | Po cichu mówię koledze obok: „pomogłeś mi z pomysłem — to też Twoja zasługa". | 2 | **3** | 2 | 1 | 0 | 1 |

#### NQ5 — Minuta na pomysł
> *„Twoja drużyna ma minutę, żeby wybrać, co robicie na konkursie. Co proponujesz?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Mówię: „robimy tak — kto się zgadza, ręka w górę". | 2 | 1 | 0 | 1 | 2 | **3** |
| b | „Kto ma najlepszy pomysł — mów teraz, każdy 10 sekund" — zbieram od wszystkich i łączę w jedno. | 2 | **3** | 2 | 1 | 0 | 1 |
| c | Robię w głowie szybkie sprawdzenie: co dobre, a co głupie w każdej opcji — wybieram lepszą. | **3** | 2 | 1 | 0 | 1 | 2 |
| d | „A co jeśli zrobimy to po naszemu?" — rzucam zupełnie świeży pomysł. | 0 | 1 | 2 | **3** | 2 | 1 |

#### NQ6 — Skrzynka na urodziny
> *„Dostajesz na urodziny dużą skrzynkę i możesz zrobić z niej, co tylko chcesz. Co to będzie?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Pracownia wynalazcy — kolorowa, z lampką, ze schowkami na pomysły. | 0 | 1 | 2 | **3** | 2 | 1 |
| b | Laboratorium do badania kamyków, liści i owadów — z lupą i notesem. | 1 | 0 | 1 | 2 | **3** | 2 |
| c | Pudełko-skarbiec: każda przegródka opisana, każdy drobiazg poukładany według rodzaju. | **3** | 2 | 1 | 0 | 1 | 2 |
| d | Apteczka do pocieszania — chusteczki, naklejki, karteczki z dobrym słowem dla kogoś smutnego. | 1 | 2 | **3** | 2 | 1 | 0 |

#### NQ7 — Powalone drzewo na drodze
> *„Idziesz z grupą przez las i nagle drogę tarasuje wielkie powalone drzewo. Co robisz?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Patrzę, jak duże jest drzewo, szukam gdzie pień jest najniższy, układam plan przejścia. | **3** | 2 | 1 | 0 | 1 | 2 |
| b | Idę wzdłuż pnia, sprawdzam gdzie jest najwęższy i czy ziemia się nie zapada. | 1 | 0 | 1 | 2 | **3** | 2 |
| c | Trzymam się blisko najmłodszego — przejdziemy razem. | 2 | **3** | 2 | 1 | 0 | 1 |
| d | Wymyślam plan: każdy szuka czegoś do oparcia — gałąź, kamień — pomagamy sobie przez drzewo. | 2 | **3** | 2 | 1 | 0 | 1 |

> *Uwaga: NQ7c i NQ7d obie mają główną MD — celowo, dla balansu (MD była niedoreprezentowana po NQ1-NQ6). Rozróżnia je akcent: c = troska o uczucia w grupie (MD↔EM), d = kooperacyjne planowanie (MD↔ST).*

#### NQ8 — Portfel na ławce
> *„Na ławce w parku leży portfel. W środku jest zdjęcie uśmiechniętej babci z wnukiem. Chcesz pomóc oddać go właścicielowi. Co robisz?"*

| # | Odpowiedź | ST | MD | EM | KR | DT | LD |
|---|---|---|---|---|---|---|---|
| a | Zanoszę portfel do najbliższego dorosłego, którego znam — niech pomoże znaleźć właściciela. | 2 | **3** | 2 | 1 | 0 | 1 |
| b | Sprawdzam, czy jest tam coś, co podpowie, kto to zgubił — imię, numer telefonu, adres. | 1 | 0 | 1 | 2 | **3** | 2 |
| c | Myślę o babci ze zdjęcia — pewnie się martwi. Idę spytać ludzi w parku, czy ktoś ją zna. | 1 | 2 | **3** | 2 | 1 | 0 |
| d | Spisuję na karteczce, co i kiedy znalazłem, i zostawiam ją obok portfela tak, żeby każdy zobaczył. | **3** | 2 | 1 | 0 | 1 | 2 |

### Bilans „głównej +3" w pełnym zestawie NQ1-NQ8

Po zastosowaniu poprawki w NQ7d (główna zmieniona z KR na MD):

| Cecha | Liczba „głównych" w 32 odpowiedziach |
|---|---|
| ST | 6 |
| MD | 5 |
| EM | 5 |
| KR | 6 |
| DT | 5 |
| LD | 5 |

Suma = 32 (8 pytań × 4 opcje). Wszystkie cechy w przedziale 5-6 → balans osiągnięty.

---

## 6. Logika `pickArchetype` + tie-break trójstopniowy

```js
// Zachowany kod główny:
function pickArchetype(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  // ... (jak obecnie)
}
```

### Reguła tie-break (zalecana — deterministyczna, audytowalna)

Gdy 2 lub więcej cech ma identyczną sumę punktów głównych, stosuj kolejno:

1. **Krok 1 — szerokość profilu:** wygrywa cecha z wyższą sumą wszystkich punktów +2 i +1 we wszystkich odpowiedziach (która była częściej wybierana jako pokrewna). Wymaga przechowywania pełnych score'ów per odpowiedź, nie tylko sumarycznych.
2. **Krok 2 — pierwsza intuicja:** wygrywa cecha, której gracz przyznał +3 w **pierwszym pytaniu**.
3. **Krok 3 — kolejność preferencji wieku:** ustalona lista `DT > KR > EM > ST > LD > MD`. Powód: DT/KR/EM to najbardziej „wszechstronne" archetypy startowe dla dzieci 6-8 lat (mniej obciążenia rolowego), MD/LD wymagają dojrzałości i niech wygrywają tylko gdy są wyraźnie pierwsze.

Reguła #3 jest deterministyczna i transparentna → można ją wytłumaczyć rodzicowi.

---

## 7. Walidacja przed merge

### Test Monte Carlo (`backend/test/quiz-balance.test.js`)
Wymóg: **10 000 losowych przebiegów** (każdy gracz wybiera odpowiedzi z rozkładem jednostajnym) → rozkład 6 finalnych archetypów powinien być w przedziale **13-20% każdy** (idealnie 16.6%).

Jeśli któryś archetyp <10% lub >25% → przepisać 1-2 odpowiedzi w pytaniach, gdzie ten archetyp jest najsłabiej/najsilniej reprezentowany jako „główny 3".

### Test pokrycia (audit balansu)
Dla każdego z 6 archetypów istnieje **przynajmniej jedna kombinacja 8 odpowiedzi**, która wybiera go jako dominującego (bez tie-break). Sprawdzić enumeracyjnie (4^8 = 65 536 kombinacji — wykonalne w <1s).

### Test rozkładu radaru
Dla 1000 losowych graczy: średnia minimalna wartość cechy w radarze > 4 pkt (no zero-wedge). Maksymalna wartość cechy ~ 12-18 pkt. Sprawdza, że radar zawsze wygląda na pełny heksagon.

---

## 7a. Status audytu

| Pytanie do audytu | Status | Notatka |
|---|---|---|
| Treść pytań — balans relacyjny vs eksploracja | ✅ rozwiązane | 4/5 obecnych to relacje → przepisać Q3, usunąć Q5, dodać NQ1/NQ3 (przygoda/logika) |
| Punktacja v3 — spójność sąsiedztw | ✅ rozwiązane | Pierścień zmieniony na `ST-MD-EM-KR-DT-LD-ST`; LD↔EM odrzucone jako para |
| Balans archetypów — Monte Carlo | ✅ zdefiniowane | Wymóg 13-20% każdy w 10k przebiegów (§7) |
| Tie-break — rozstrzyganie remisów | ✅ rozwiązane | Trójstopniowa reguła (§6): szerokość → pierwsza intuicja → kolejność wieku |
| Wpływ misji na `lifetime_scores` | ⏳ otwarte | Do następnego audytu — czy misje też powinny dawać rozkład 6-cech, czy zostają per-profil |
| Brakujące 5 pytań (do 8) | ✅ rozwiązane | NQ4-NQ8 zaprojektowane (pochwała, presja czasu, pusta skrzynka, most nad strumieniem, znaleziony portfel). Bilans „głównej +3" zweryfikowany: każda cecha 5-6 razy w 32 odpowiedziach |

---

## 8. Linki

- Backend: [`backend/src/api/onboarding.js`](../../backend/src/api/onboarding.js)
- Frontend onboarding UI: [`frontend/src/pages/Onboarding.jsx`](../../frontend/src/pages/Onboarding.jsx)
- Radar komponent: [`frontend/src/components/CharakterBohatera.jsx`](../../frontend/src/components/CharakterBohatera.jsx)
- Wskazówki rozwoju per profil: [`frontend/src/growthData.js`](../../frontend/src/growthData.js)
- Opis archetypów (świat narracyjny): [`agents/world/archetypes.md`](./archetypes.md)
