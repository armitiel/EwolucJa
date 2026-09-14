# Quiz Osobowości — stan faktyczny (v5, test obrazkowy)

> **Cel dokumentu:** referencja dla agentów. Opisuje quiz TAKI, JAKI DZIŚ DZIAŁA, żeby nikt nie projektował na podstawie nieaktualnego opisu.
>
> **Kod jest źródłem prawdy, nie ten plik.** Treść scen: [`backend/src/api/quizObrazkowy.js`](../../backend/src/api/quizObrazkowy.js). Mechanika i punktacja: [`backend/src/api/onboarding.js`](../../backend/src/api/onboarding.js). Decyzje projektowe: [`docs/TEST_OBRAZKOWY.md`](../../docs/TEST_OBRAZKOWY.md) i [`docs/TEST_OBRAZKOWY_PANEL.md`](../../docs/TEST_OBRAZKOWY_PANEL.md).
>
> **Historia:** ten dokument do 14.09.2026 opisywał wersję **v2** (5 pytań tekstowych × 3 odpowiedzi, punkty tylko dla 2 z 6 cech) wraz z audytem „zapadniętej gwiazdy" i propozycją v3, która nigdy nie weszła w tej postaci. Kod przeszedł przez v3 i v4 do **v5 — testu obrazkowego**. Stary opis jest w historii gita; nic z niego nie obowiązuje.

---

## 1. Mapowanie cecha ↔ kod profilu ↔ nazwa ↔ legacy slug

Radar w [`frontend/src/components/CharakterBohatera.jsx`](../../frontend/src/components/CharakterBohatera.jsx) pokazuje **6 cech**, 1:1 z kodami profilu.

| Cecha (radar) | Kolor | Kod | Nazwa dla dziecka (m / ż) | Legacy slug (baza, API) | Zwierzę |
|---|---|---|---|---|---|
| **Mądrość** | fiolet `#7A4DC2` | `ST` | Myśliciel / Myślicielka | `mistrz_map` | Sowa |
| **Odwaga** | pomarańcz `#E89A3D` | `LD` | Śmiałek / Śmiałka | `gwardzista_odwagi` | Lew |
| **Ciekawość** | zieleń `#5FA76F` | `DT` | Odkrywca / Odkrywczyni | `tropiciel_tajemnic` | Lis |
| **Skupienie** | błękit `#378ADD` | `MD` | Spokojna Głowa | `straznik_mostu` | Ośmiornica |
| **Życzliwość** | róż `#E4779C` | `EM` | Przyjaciel / Przyjaciółka | `zaklinacz_uczuc` | Żółw |
| **Kreatywność** | żółty `#EF9F27` | `KR` | Wynalazca / Wynalazczyni | `tkacz_snow` | Panda |

**Slugi są identyfikatorami, nie nazwami.** Siedzą w bazie starszych graczy, w `PROFILE_TO_ARCHETYPE`, w `MVP_AVAILABLE_ARCHETYPES` i w `LEGACY_TO_PROFILE` we froncie. **Nie zmieniamy ich.** Zmieniły się wyłącznie nazwy wyświetlane (14.09.2026, zestaw „krótka rola"); `MD` to dziś **Skupienie**, nie mediacja — i dlatego nazywa się Spokojna Głowa, a nie Strażnik Mostu.

Rodzaj gramatyczny obsługuje [`frontend/src/services/rodzaj.js`](../../frontend/src/services/rodzaj.js): kolejność to wybór z onboardingu → `player.gender` → końcówka imienia → rodzaj męski. Teksty niosą tokeny `{forma męska|forma żeńska}`, które rozwija `odmien()`. **Agent piszący nową treść dla dziecka pisze w tokenach**, nie w samym rodzaju męskim.

---

## 2. Format testu: v5 obrazkowy

- **6 scen** (`nq1`–`nq6`), **4 kafelki** każda → **24 odpowiedzi**.
- Kafelek to **ilustracja + podpis** (czasownik w 1. osobie, najwyżej trzy słowa). `text` jest tekstem dla lektora **na dotknięcie**, nie z automatu.
- Pytanie dotyczy **BOHATERA, nie dziecka**: „Co robi twój bohater?". Zdejmuje presję grzecznej odpowiedzi — dziecko, które w realu stoi z boku, może dać bohaterowi odwagę, której samo nie ma.
- **Dwa warianty wiekowe**, filtrowane PO STRONIE SERWERA (`GET /api/onboarding/quiz?etap=1-3` albo domyślne `4-8`):
  - `etap=1-3` — kafelki z flagą `tylko48` znikają → **3 kafelki na scenę**; scenki bez ładunku lęku (kłoda zamiast strumyka).
  - `etap=4-8` — 4 kafelki; pole `wariant48` podmienia kafelek tam, gdzie scenka dla młodszych czyta się jako dziecinna (kredki → piórnik).
- **Punktacji (`points`, `glowna`) endpoint NIE wysyła.** To jedyna rzecz, której dziecko nie zobaczy w zakładce sieciowej. `GET /quiz-debug` zwraca całość — tylko do pracy nad testem.

### Sceny

| # | Scena (4–8) | Wariant 1–3 | Kafelki (główna cecha) | Kafelek ukryty w 1–3 |
|---|---|---|---|---|
| nq1 | Zamknięta skrzynia na polanie | — | ST · KR · EM · LD | ST |
| nq2 | Strumyk w poprzek ścieżki | przewrócona kłoda | MD · DT · KR · LD | MD |
| nq3 | Rozsypany piórnik | rozsypane kredki | EM · ST · MD · DT | DT |
| nq4 | Wielkie pudło w prezencie | — | KR · DT · EM · LD | EM |
| nq5 | Ślady łapek na ziemi | — | DT · ST · KR · MD | KR |
| nq6 | Wóz utknął na ścieżce | krótsze zdanie | EM · LD · ST · MD | LD |

Każdy typ jest „główną" **dokładnie 4 razy w 24 odpowiedziach**, a wśród kafelków ukrywanych każdy typ znika **dokładnie raz** — dzięki temu wersja trzykafelkowa zostaje zbalansowana (3 „główne" na typ) i front nie ma jak tego po cichu zepsuć własnym filtrowaniem.

---

## 3. Punktacja: pierścień sąsiedztwa

**`ST — MD — EM — KR — DT — LD — ST`**

Dla odpowiedzi, której **główną** cechą jest X: X **+3**, dwaj sąsiedzi **+2**, dwie dalsze **+1**, przeciwieństwo **0**. Razem **9 punktów na odpowiedź**, więc żadna oś nie zostaje na zerze i radar nie zapada się w gwiazdę.

Przeciwieństwa funkcjonalne: **ST ↔ KR** (logika vs improwizacja), **MD ↔ LD** (rozwaga vs naprzód), **EM ↔ DT** (czuję vs analizuję).

Tabela `PKT` w [`quizObrazkowy.js`](../../backend/src/api/quizObrazkowy.js) jest zapisana wprost i nie jest wyliczana w locie — zmiana pierścienia to zmiana tych sześciu wierszy.

---

## 4. Ścieżka gracza: od odpowiedzi do typu

```
[6 scen × 4 (albo 3) kafelki]
        ↓
POST /api/onboarding/submit  { player_id, answers: [{question_id, answer_id}…], name?, etap_szkolny? }
        ↓
dla każdej odpowiedzi:
   main_picks[glowna]      += 1        ← licznik „ile razy ta cecha była +3"
   scores[cecha]           += punkty   ← pełna suma, karmi radar
   peripheral_sum[cecha]   += punkty 1 i 2
        ↓
pickArchetype(main_picks, { peripheral_sum: scores, firstAnswerPoints })
        ↓
player.archetype      = KOD profilu ("ST"), NIE slug
player.profil_glowny  = ten sam kod
player.profil_wsparcie= drugi typ wg main_picks
player.lifetime_scores += scores
        ↓
createCycle()  → pierwsza misja
```

**Kryterium główne to `main_picks`, nie suma punktów.** To jest różnica wobec wszystkich wcześniejszych wersji i łatwo ją przeoczyć: pierścień sąsiedztwa skleja sąsiadów w sumie punktów, więc gdyby typ zapadał z `scores`, remis zapadałby z definicji tabeli, a nie z wyboru dziecka. Suma punktów wchodzi dopiero jako pierwszy tie-break i jako karma dla radaru.

### Tie-break (trójstopniowy, deterministyczny)

1. **Szerokość profilu** — wygrywa cecha z wyższą pełną sumą punktów (`scores` podane jako `peripheral_sum`).
2. **Pierwsza intuicja** — cecha, która dostała +3 w `nq1`, o ile jest wśród remisujących.
3. **Kolejność wieku** — `DT > KR > EM > ST > LD > MD`. Powód: DT/KR/EM są najbardziej „wszechstronne" dla 6–8-latków, MD/LD niosą więcej obciążenia rolowego i niech wygrywają tylko wtedy, gdy są wyraźnie pierwsze.

Reguła 3 jest jawna i da się ją wytłumaczyć rodzicowi.

---

## 5. Co quiz zapisuje na graczu

| Pole | Co znaczy |
|---|---|
| `archetype` | **kod profilu** (`"ST"`), nie slug. Pole `archetype` w odpowiedzi API jest aliasem `dominant_profile` — historyczny bałagan nazewniczy, nie dwa różne byty. |
| `profil_glowny` | to samo, pod docelową nazwą |
| `profil_wsparcie` | drugi typ wg `main_picks` — dobiera trzecie zadanie, żeby profil nie zamykał dziecka w koleinie |
| `profil_zrodlo` | `"quiz"` — odróżnia wynik testu od profilu douczonego później z realnych wyborów |
| `profil_aktualizacja` | znacznik czasu ostatniej zmiany typu |
| `main_picks` | licznik „główna +3" per cecha — podstawa wyboru typu i późniejszych audytów |
| `lifetime_scores` | narastająca suma punktów; **to karmi radar**, nie sam quiz |
| `sygnaly` | startuje od zera, rośnie poza quizem (realne wybory dziecka) |
| `etap_szkolny` | `"1-3"` albo `"4-8"` |
| `onboarding_answers` | log `{question_id, answer_id, points_awarded}` |
| `coins` | 50 startowych, tylko jeśli gracz nie miał monet |
| `current_chapter` | `"wezwanie_kroniki"` |

---

## 6. Czego NIE robimy

- **Nie zmieniamy slugów** (`tropiciel_tajemnic`…). To identyfikatory w bazie.
- **Nie nazywamy quizu diagnozą.** To profil preferencji do dobrania pierwszych doświadczeń, nie orzeczenie. Nigdzie nie piszemy dziecku „jesteś takim człowiekiem".
- **Nie pytamy o dziecko wprost** — pytamy o bohatera.
- **Nie wysyłamy punktacji do klienta.**
- **Nie dokładamy scen bez sprawdzenia bilansu**: każdy typ musi zostać „główną" tyle samo razy, a każdy kafelek `tylko48` musi zabierać inny typ.
- **Nie piszemy nowych treści w samym rodzaju męskim** — tokeny `{m|ż}`.

---

## 7. Otwarte

- Wpływ misji na `lifetime_scores` — czy misje też powinny dawać rozkład 6-cechowy, czy zostają per-profil. Nierozstrzygnięte.
- Reguły zmiany typu z `sygnaly` (sekcja 8 `TEST_OBRAZKOWY.md`) — zaprojektowane, jeszcze nie w kodzie.
- Rodzaj gramatyczny w bazie: onboarding zapisuje wybór lokalnie (`ewolucja.profil.rodzaj`), backend nie ma kolumny. Dopóki jej nie ma, raport dla nauczyciela wychodzi w rodzaju męskim.
- Testy bilansu (Monte Carlo na 10 000 przebiegów, test pokrycia, test rozkładu radaru) są opisane, ale nie ma ich w `backend/test/`.

---

## 8. Linki

- Treść scen: [`backend/src/api/quizObrazkowy.js`](../../backend/src/api/quizObrazkowy.js)
- Mechanika: [`backend/src/api/onboarding.js`](../../backend/src/api/onboarding.js)
- Decyzje i panel: [`docs/TEST_OBRAZKOWY.md`](../../docs/TEST_OBRAZKOWY.md), [`docs/TEST_OBRAZKOWY_PANEL.md`](../../docs/TEST_OBRAZKOWY_PANEL.md)
- Front onboardingu: [`frontend/src/pages/Onboarding.jsx`](../../frontend/src/pages/Onboarding.jsx)
- Radar: [`frontend/src/components/CharakterBohatera.jsx`](../../frontend/src/components/CharakterBohatera.jsx)
- Rodzaj gramatyczny: [`frontend/src/services/rodzaj.js`](../../frontend/src/services/rodzaj.js)
- Nazwy par (dwie najmocniejsze cechy): [`frontend/src/data/paryProfili.js`](../../frontend/src/data/paryProfili.js)
- Opis archetypów (świat narracyjny): [`agents/world/archetypes.md`](./archetypes.md)
