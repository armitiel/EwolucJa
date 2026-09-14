# Test obrazkowy — profil startowy dziecka

Spisane 2026-09-14. Zastępuje tekstowy quiz v3 opisany w
`agents/world/quiz_osobowosci.md` §5 (tamten dokument zostaje jako źródło
punktacji i pierścienia sąsiedztwa). Implementacja: `backend/src/api/onboarding.js`
(`ONBOARDING_QUIZ`), `frontend/src/pages/Onboarding.jsx`, docelowo także ekran
„Poznajmy się” w torze `/w2` (`frontend/src/wariant/Wariant.jsx`, komponent
`Poznanie`).

---

> ## AKTUALIZACJA 14.09 (wieczór) — decyzje właściciela po obradach panelu
>
> Sekcję **§4 (sześć pytań)** zastępuje `docs/TEST_OBRAZKOWY_PANEL.md`.
> Reszta tego dokumentu (punktacja, pola profilu, weta) obowiązuje dalej.
> Implementacja treści: `backend/src/api/quizObrazkowy.js`.
>
> 1. **`MD` to Skupienie**, nie mediacja. Archetyp: **Spokojna Głowa**
>    (id `straznik_mostu` zostaje jako legacy). Etykieta radaru „Skupienie"
>    bez zmian — to archetyp dojechał do etykiety, nie odwrotnie.
> 2. **Pytamy o bohatera, nie o dziecko.** „Co robi twój bohater?" w każdym
>    poleceniu Wizkora.
> 3. **Format: trzy pytania → pierwsza mała czynność w świecie → trzy
>    pytania.** Pasek postępu znika; postęp widać w świecie — po każdym
>    wyborze na polanie przybywa jeden element.
> 4. **Etap szkolny wybiera dziecko na starcie**, jednym obrazkowym
>    pytaniem, z cichym trzecim wyjściem („nie wiem" → wersja
>    trzykafelkowa). Serwer filtruje komplet: `GET /onboarding/quiz?etap=1-3`.
> 5. **Klasy 1–3: więcej obrazka, mniej tekstu.** Ten sam komplet pytań, ale
>    podpis pod kafelkiem jest schowany — zostaje sam obrazek, a słowo
>    dziecko dostaje po dotknięciu (lektorem). Dla 4–8 podpis widoczny od razu.
> 6. **Lektor nie blokuje kafelków** i czyta wyłącznie pytanie. Podpisy
>    zostają nieme — efekt świeżości u 6–9-latków wchodziłby wprost w cechę
>    główną, a przy losowanej kolejności kafelków różnie dla każdego dziecka.

## 1. Decyzje, pod które to jest zaprojektowane

1. Zostaje **sześć typów**: `ST` Mądrość, `MD` Skupienie/łączenie,
   `EM` Życzliwość, `KR` Kreatywność, `DT` Ciekawość, `LD` Odwaga.
2. Odpowiedź = **ilustracja w stylu gry + podpis 2–4 słowa**. Pytanie czyta
   Wizkor (lektor). Podpis dziecko może usłyszeć po dotknięciu kafelka.
3. Test **nie jest diagnozą**. Wynik to punkt startowy, nie etykieta.
4. Wynik karmi dobór pierwszych zadań, nie ocenę dziecka.

## 2. Format

| | klasy 1–3 | klasy 4–8 |
|---|---|---|
| pytań | 6 | 6 |
| kafelków na pytanie | 3 | 4 |
| czas | ~2,5 min | ~3,5 min |
| lektor | czyta pytanie | czyta pytanie |

Czwarty kafelek w każdym pytaniu jest oznaczony `tylko-4-8` i dla młodszych
się nie pojawia. Sześć ukrytych kafelków pokrywa sześć różnych typów, więc
krótsza wersja zostaje zbalansowana.

**Dlaczego nie 8 pytań:** obecny `Onboarding.jsx` blokuje odpowiedzi do końca
narracji (`narrationDone`). Osiem pytań z TTS to ponad cztery minuty czekania
z nieaktywnymi przyciskami.

**Dlaczego nie 4 kafelki dla młodszych:** na ekranie 400 px czwarty kafelek
schodzi poniżej zgięcia i systematycznie dostaje mniej wyborów. To błąd
pozycji, nie preferencja.

## 3. Punktacja

Rozkład z pierścienia `ST–MD–EM–KR–DT–LD–ST` zostaje: główna **+3**, dwaj
sąsiedzi **+2**, dwie dalsze **+1**, przeciwieństwo **0** (razem 9 pkt na
odpowiedź).

Gotowe wiersze (kolejność `ST/MD/EM/KR/DT/LD`):

| główna | wiersz |
|---|---|
| ST | `3/2/1/0/1/2` |
| MD | `2/3/2/1/0/1` |
| EM | `1/2/3/2/1/0` |
| KR | `0/1/2/3/2/1` |
| DT | `1/0/1/2/3/2` |
| LD | `2/1/0/1/2/3` |

**Trzy zmiany względem dzisiejszej implementacji:**

1. **Typ wybieramy z licznika `main_picks`, nie z sumy punktów.** Pierścień
   skleja sąsiadów: dziecko, które trzy razy wybierze ST i trzy razy MD, ma
   remis z definicji, rozstrzygany tie-breakiem, a nie własnym wyborem.
   `main_picks[kod]` = ile razy dana cecha była „główną +3”. Suma `scores`
   zostaje **wyłącznie do radaru**.
2. **Kolejność kafelków losowa przy każdym renderze.** Punktacja siedzi przy
   `answer_id`, nie przy pozycji. Bez tego pierwszy slot wygrywa statystykę.
3. **Cichy kafelek „pokaż inne”** — przetasowanie kolejności, zero punktów.
   Dziecko, które nie chce wybierać, dziś klika cokolwiek i psuje wynik.

Testy z `quiz_osobowosci.md` §7 (Monte Carlo 13–20 %, pokrycie, brak zerowych
wierzchołków radaru) trzeba przeliczyć od nowa — zmiana z 8×4 na 6×4
unieważnia stare liczby. Skrypt: `backend/scripts/test-quiz-balance.mjs`.

**Do rozstrzygnięcia:** `MD` ma dziś dwie niezgodne definicje — radar mówi
„Skupienie”, archetyp to Strażnik Mostu (mediacja). Ilustracja może pokazać
jedno albo drugie. Rekomendacja: zostawić **mediację/łączenie** i zmienić
etykietę radaru na „Łączenie”.

## 4. Sześć pytań

Zapis punktów: `ST/MD/EM/KR/DT/LD`.

### Q1 — „Na polanie stoi zamknięta skrzynia. Co robisz?”

| podpis | ilustracja | główna | punkty | |
|---|---|---|---|---|
| *Oglądam kłódkę* | bohater kuca przy skrzyni i wodzi palcem po kłódce, obok trzy kamyki ułożone w rządku | ST | `3/2/1/0/1/2` | `tylko-4-8` |
| *To statek kosmiczny* | bohater siedzi okrakiem na skrzyni, nad nim chmurka-wyobrażenie: ta sama skrzynia jako rakieta | KR | `0/1/2/3/2/1` | |
| *Wołam przyjaciela* | bohater macha ręką do postaci stojącej dalej, drugą ręką wskazuje skrzynię | EM | `1/2/3/2/1/0` | |
| *Otwieram od razu* | bohater obiema rękami unosi wieko, ze środka bije złote światło na twarz | LD | `2/1/0/1/2/3` | |

### Q2 — „Przez ścieżkę płynie strumyk. Jak przejdziesz?”

| podpis | ilustracja | główna | punkty | |
|---|---|---|---|---|
| *Idę powoli i pewnie* | bohater stawia stopę na kamieniu, ręce rozłożone, wzrok na stopach | MD | `2/3/2/1/0/1` | `tylko-4-8` |
| *Sprawdzam patykiem* | bohater kuca na brzegu i zanurza patyk, mierząc głębokość | DT | `1/0/1/2/3/2` | |
| *Buduję kładkę* | bohater układa deskę i trzy kamienie w poprzek nurtu | KR | `0/1/2/3/2/1` | |
| *Skaczę pierwszy* | bohater w połowie skoku nad wodą, druga postać patrzy z brzegu | LD | `2/1/0/1/2/3` | |

### Q3 — „Komuś rozsypało się pudełko kredek. Co robisz?”

| podpis | ilustracja | główna | punkty | |
|---|---|---|---|---|
| *Siadam obok* | bohater kuca przy zasmuconej postaci i podaje jej jedną kredkę | EM | `1/2/3/2/1/0` | |
| *Układam po kolorach* | bohater zbiera kredki i układa je w tęczowym rządku | ST | `3/2/1/0/1/2` | |
| *Trzymam pudełko* | bohater trzyma otwarte pudełko oburącz, druga postać wkłada kredki | MD | `2/3/2/1/0/1` | |
| *Szukam zgubionych* | bohater zagląda pod ławkę, w cieniu widać dwie kredki | DT | `1/0/1/2/3/2` | `tylko-4-8` |

### Q4 — „Dostajesz wielkie pudło. Co z nim zrobisz?”

| podpis | ilustracja | główna | punkty | |
|---|---|---|---|---|
| *Statek kosmiczny* | pomalowane pudło z okrągłym okienkiem i skrzydłami, bohater w środku | KR | `0/1/2/3/2/1` | |
| *Pracownia badacza* | pudło jako stolik z lupą, kamykami, liśćmi i słoikiem | DT | `1/0/1/2/3/2` | |
| *Domek dla misia* | pudło z wyciętym sercem, w środku kocyk i pluszak, z boku zagląda mniejsza postać | EM | `1/2/3/2/1/0` | `tylko-4-8` |
| *Tarcza i wieża* | z pudła wycięta tarcza i hełm, bohater stoi na kartonowej wieży | LD | `2/1/0/1/2/3` | |

### Q5 — „Na ziemi widzisz rząd tropów. Co robisz?”

| podpis | ilustracja | główna | punkty | |
|---|---|---|---|---|
| *Idę po śladach* | bohater pochylony idzie wzdłuż tropów, tropy znikają za krzakiem | DT | `1/0/1/2/3/2` | |
| *Rysuję mapę* | bohater patykiem rysuje na ziemi plan: tropy, drzewo, strzałka | ST | `3/2/1/0/1/2` | |
| *Robię własne ślady* | bohater odciska dłonie w błocie, układając z nich wzór-zwierzę | KR | `0/1/2/3/2/1` | `tylko-4-8` |
| *Stoję cicho* | bohater nieruchomo za krzakiem, z gałęzi wychyla się sarna | MD | `2/3/2/1/0/1` | |

### Q6 — „Ktoś nowy stoi sam obok bawiącej się grupy. Co robisz?”

| podpis | ilustracja | główna | punkty | |
|---|---|---|---|---|
| *Podaję mu piłkę* | bohater wyciąga piłkę do stojącej z boku postaci | EM | `1/2/3/2/1/0` | |
| *Wołam wszystkich* | bohater z uniesioną ręką macha do grupy, drugą prowadzi nową osobę | LD | `2/1/0/1/2/3` | `tylko-4-8` |
| *Dzielę na drużyny* | bohater rysuje na ziemi dwa kręgi i rozstawia w nich postacie | ST | `3/2/1/0/1/2` | |
| *Łączę dwie strony* | bohater trzyma za ręce po jednej postaci z dwóch grup, tworząc mostek | MD | `2/3/2/1/0/1` | |

**Bilans:** każdy typ jest „główną” 4 razy w 24 odpowiedziach; w wersji
3-kafelkowej 3 razy. Ukryte kafelki to kolejno ST · MD · DT · EM · KR · LD.

## 5. Brief graficzny — twarde wymagania

24 ilustracje (18 dla wersji młodszej to podzbiór). Generator:
`fal-ai/flux/dev/image-to-image` z `wizPop.webp` jako wzorcem stylu; pipeline
jak w `scripts/` (patrz `CLAUDE.md`, sekcja o generatorach).

Reguły, bez których test mierzy urodę obrazka, a nie wybór dziecka:

- **jeden styl, jedna paleta, jedno światło** we wszystkich kafelkach pytania;
- **ta sama poza wyjściowa bohatera** i ta sama skala postaci w kadrze;
- **ta sama liczba elementów** w kadrze (±1);
- żadnego złota, iskier, rakiet ani efektów na jednym kafelku, gdy sąsiedni
  jest szary i spokojny;
- czytelność bez tekstu: dorosły, któremu zakryjesz podpis, ma powiedzieć,
  co bohater robi;
- kadr kwadratowy, bohater zajmuje ok. 1/3 wysokości, tło rozpoznawalne jako
  planeta EwolucJI.

## 6. Wynik testu — co dziecko widzi, czego nie

**Dziecko widzi:** awatar, nazwę bohatera, tagline, pełny heksagon radaru
(`CharakterBohatera.jsx`, stała skala `maxScore = 50`, więc quiz wypełnia
30–50 % — to dobra decyzja, zostaje) i jedno zdanie: *„tak zaczynasz — to się
będzie zmieniać”*.

**Dziecko nie widzi:** liczb jako werdyktu, swojej najsłabszej cechy, słowa
„osobowość”, porównania z innymi, logu odpowiedzi.

**Mentor widzi:** typ główny i wspierający, radar, liczbę zamkniętych zadań
w rozbiciu na typy, ostatnie ślady, datę testu — i zdanie wprost: *to nie jest
diagnoza, to dobór pierwszych zadań*. **Nie widzi surowych odpowiedzi
z testu** — to jedyna rzecz, którą dziecko powiedziało samo o sobie, i nie
jest materiałem do rozmowy wychowawczej.

## 7. Pola profilu

Do tabeli `players` (obok istniejących `archetype`, `archetype_assigned_at`,
`onboarding_answers`, `lifetime_scores`):

| pole | co trzyma |
|---|---|
| `profil_glowny` | kod typu z `main_picks` |
| `profil_wsparcie` | drugi w kolejności |
| `main_picks` | 6 liczników „główna +3” |
| `profil_zrodlo` | `"quiz"` albo `"wybory"` |
| `profil_aktualizacja` | data ostatniej zmiany |
| `sygnaly` | 6 liczników z realnych wyborów dziecka |

## 8. Douczanie profilu — najtaniej, bez nowego backendu

Trzy liczniki dopisywane do `sygnaly`:

- zamknięte zadanie Wizkora → `+2` dla typu zadania (dane są:
  `historiaZadan()` w `zadanieWizkora.js`);
- wybrane **miejsce** w panelu zadania → `+1` (podwórko → LD, stół → KR,
  z kimś → EM);
- pierwsza otwarta minigra w sesji → `+1`.

Zapis tą samą drogą co `monety.js` (localStorage), do bazy przy okazji
istniejącego `verify` — bez nowej końcówki.

**Reguła zmiany typu:** profil przełącza się dopiero, gdy inny kod prowadzi
w `sygnaly` o ≥6 punktów przez dwa tygodnie. Narracyjnie brzmi to „obudziła
się w tobie nowa strona”, nigdy „poprawiamy wynik testu”.

## 9. Weta i ryzyka

1. **Obrazek etykietuje mocniej niż tekst.** Weto na: awatar przypisany raz
   na zawsze. Ekran wyniku mówi „tak zaczynasz”, a douczanie z §8 musi być
   widoczne — po miesiącu radar wygląda inaczej.
2. **Estetyka zastępuje wybór.** Obejście: brief z §5 jako wymóg, nie
   preferencja.
3. **Wolniejsze czytanie = gorszy wynik.** Lektor czyta *tylko pytanie*;
   podpisy dziecko dostaje po dotknięciu kafelka, nie w jednym wywodzie.
4. **Profilowanie zamyka dziecko w koleinie.** Weto na regułę „typ → tylko
   jego zadania”. Trzecie zadanie zawsze z typu o najniższym liczniku, a Koło
   zachowuje jedno pole dzikie.
5. **Wynik jako materiał dla dorosłego.** Panel Mentora pokazuje profil
   wyłącznie jako podpowiedź doboru zadań, z tym samym zdaniem o braku
   diagnozy.
6. **Q3 i Q6 dotykają sytuacji społecznych.** Są w granicach, bo dziecko jest
   w nich **sprawcze**, nie jest tym stojącym z boku. Pytanie w drugą stronę
   („stoisz sam, co robisz”) — weto.
