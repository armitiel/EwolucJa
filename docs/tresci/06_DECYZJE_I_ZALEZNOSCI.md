# 06 — Decyzje do podjęcia i zależności techniczne

> Scalenie notatek czterech zadań (`tmp/tresci-notatki-A/B/C/D.md`) i dwóch recenzji
> (`tmp/tresci-recenzja-weto.md`, `tmp/tresci-recenzja-glos.md`). Baza audytu: HEAD `596d4aa`;
> w trakcie pracy HEAD przesunął się na `da86ca2` (druga sesja), różnice odnotowane w sekcjach
> „uzgodnienie” każdego dokumentu (`02` §6, `03` §11, `04` §1.5, `05` §7) i tutaj w §4.13.
> Tylko opis — bez kodu. Numery linii liczone na `596d4aa`, chyba że zaznaczono inaczej.

Każda rekomendacja poniżej została **założona** w dokumentach `01`–`05` (prompt §9: „zakładasz
rekomendowaną odpowiedź”). Jeżeli autor zdecyduje inaczej, kolumna „gdzie użyte” mówi, co poprawić.

---

## 1. Pytania do autora z rekomendacją

### 1.1 Dziewięć pytań z sekcji 9 promptu

| # | pytanie | rekomendacja (założona) | alternatywa i jej koszt | gdzie użyte |
|---|---|---|---|---|
| 1 | Mapowanie sześciu profili na pięć osi — czy EM, ST, MD dostają własne osie? | **Nie.** DT→ciekawosc, KR→tworzenie, LD→odwaga, EM→wspolpraca, ST→wytrwalosc, MD→wytrwalosc (regulacja). Różnicę niosą `potrzeba` i `ksztalt` (podaruj / wytrzymaj / zauważ), nie oś. Koło zostaje pięciopolowe. Pełna tabela w §2. | Oś „spokój” dla MD: nowa tarcza koła (`public/assets/kolo/kolo-tarcza.png`, 5 pól po 72°), `TRAIT_LABELS` w `adventureState.js`, a zadania MD i tak są „wytrzymaj” z osi wytrwałości. | `03` §6.3, §7; `05` tabela zbiorcza; `04` §5 |
| 2 | Ile monet w tle i za co; jak odwrócić ekonomię, w której gwiazdki dają więcej niż real? | Monety zostają **cichym licznikiem w HUD**, zero w kwestiach postaci. Za zadanie w realu i hybrydę: stała kwota (25) dopisana **przy śladzie**, nie przy werdykcie; zauważenie Mentora nie zmienia kwoty, dokłada obiekt w świecie. Gwiazdki: 1 moneta zamiast 10 albo tylko odgłos i licznik gwiazdek. Pigułka „+N” zostaje wyłącznie w minigrach (za partię). | Zostawić dzisiejsze wartości (+5 za dowód `cycles.js:288`, 15–40 od Mentora `mentor.js:102`, 10 za gwiazdkę): działanie w realu jest tańsze niż klikanie — sprzeczne z §3 promptu. | `02` §2.3, §2.6; `03` §1.1; `05` §1.2; §4.6 tutaj |
| 3 | Co otwiera etapy 2–3 domku: materiał i nowy dzień, czy powrót z zadania w realu? | **Trzy warunki naraz:** nowy dzień, nowy materiał **i co najmniej jeden ślad** z zadania w realu albo hybrydy od ostatniego etapu. Bez trzeciego etap 2 jest drugą rundą rąbania. Ramka KR nie zależy od tej decyzji (barierka pomostu od etapu 1, ściana domku od etapu 2 — ten sam obiekt). | Sam materiał + nowy dzień (dzisiejszy `czyMoznaRozbudowac`, `hub/zadanieDrewna.js:290`, którego nikt nie woła; geometrii etapu 2 nie ma — `schronienie.js:308`). | `05` §1.2, karta KR; `02` §3.3 |
| 4 | Docelowy czas sesji 1–3 / 4–8 i co po końcu sesji? | 1–3 → **12 min** (zachód ok. 7 min), 4–8 → **15 min** (zachód 8,5 min jak dziś); `minutySesji` ustawia Mentor z panelu w zakresie 10–20, etap startowy daje wartość domyślną; zachód zawsze w ~57% sesji. Po podsumowaniu **planeta śpi**: chodzić można, Wizkor nie zleca, lisek nie zaprasza, chmurki wyłączone; **nowy dzień po przerwie ≥ 45 min**, nie po odświeżeniu strony. Bez „czas minął”. Nie skracać przed testem z dziećmi; W2 ma `limitMin: 8` (`wariant/stan.js`) — za mało na domek. | 8 min dla 1–3 (jak W2) — pierwsza sesja (gwiazdki + domek + część A hybrydy ≈ 8–10 min) się nie mieści. | `02` §3; `05` §5; §4.8 tutaj |
| 5 | Czy Mentor może wyłączyć zdjęcia w ogóle? | **Tak, jednym przełącznikiem na dziecko** („Ślad tylko wyborem i zdaniem”). Domyślnie zdjęcia **wyłączone dla 1–3**, włączone dla 4–8; MD (`swiatlo-w-oknie`) nigdy nie ma zdjęcia. Każde zadanie i każda hybryda działa bez zdjęcia z tą samą reakcją świata. **Do czasu toru obrazu W7 zdjęcia wyłączone globalnie** (dziś: blob publiczny, EXIF, brak uwierzytelnienia — §4.5). | Zdjęcia zawsze dostępne: dziś to publiczny adres z EXIF, bez retencji. | `03` pole `dowod`; `05` §1.2, W2; `06` §4.5 |
| 6 | Czy tryb demo z automatycznym „zauważeniem” zostaje i jak go oznaczyć? | Zostaje **tylko w demie bez Mentora** i **nie udaje osoby**: reakcja świata przychodzi od razu po śladzie (bez werdyktu), notatka „(tryb demo) Świat to zauważył.” i plakietka „demo” w panelu; „Mentor {zobaczył\|zobaczyła}” wyłącznie od prawdziwego Mentora. Gdy Mentor istnieje — `DEMO_SAM_ZATWIERDZA` (`zadanieWizkora.js:257–259`, `:374`) wyłączone. | Zostawić „ciche dobro” po 60 s: obietnica relacji, której nie ma (psycholog, `02` §4). | `02` §2.5, §3.4; `03` statusy; `05` W5 |
| 7 | Co z 276 zadaniami biblioteki Mentora? | (a) wyciąć 47 (`03` §3.2), (b) przepisać 29 (`03` §3.3), (c) migracja globalna skryptem: tokeny (228 bez tokenu), dwie drogi dowodu (22 tylko zdjęcie), wycięcie zdań z etykietą profilu (50), (d) **~30 najlepszych do formatu Wizkora** z polami `potrzeba/minimum/rozmowa/reakcja_swiata/etap` (kandydaci wymienieni w `tmp/tresci-notatki-B.md`, pkt 3), (e) reszta zostaje w panelu Mentora jako propozycje dla dorosłego. **Generator `/missions/generate` nie woła biblioteki dla dziecka, dopóki nie przejdzie migracji** (dziś `AppData` woła go przy każdym wczytaniu). | Zostawić całość dla dziecka: co drugie zadanie prowadzi liczebnikiem, 83% w formie męskiej, 18% z etykietą profilu (`03` §3.1). | `03` §3, §10 |
| 8 | Czy zadania biblioteki po zmianie tytułów 17.09 mogą wrócić do dziecka drugi raz? | **Nie powinny.** `pickSeedMission` (`cycles.js:84`) pomija po `title`; po zmianie tytułów wracają. Pomijać po `id`: dopisać `library_id` do `missions`, `choices_log` porównywać po `id`. | Zostawić po tytule: powtórki pod nowym tytułem, dziecko widzi to samo zadanie dwa razy. | `03` §1.1; §4.2 tutaj |
| 9 | Nazwa zapowiadanej minigry „Na Tropie” (dawniej „Trop Tropiciela”) | **Przyjąć „Na Tropie”**: krótka, bez cyfr, bez powtórzenia rdzenia, mieści się w toaście (≤ 28) i w karcie Wizkora; wpis w `misjeGier.js` jako nazwa własna z wielkiej litery. | Wrócić do „Trop Tropiciela”: powtórzony rdzeń, dłuższe o 7 znaków. | `02` §2.2 (`misjeGier.js`), `01` nazwy z kanonu |

### 1.2 Pytania dodatkowe zebrane w pracy (numeracja ciągła)

| # | pytanie | rekomendacja (założona) | źródło |
|---|---|---|---|
| 10 | Rodzaj Mentora — „Mentor {zobaczył\|zobaczyła}” wymaga pola `gender` po stronie Mentora. | Dodać w profilu Mentora (rodzic / nauczyciel). Do tego czasu czas teraźniejszy: „Mentor już to widzi”. | A-4 |
| 11 | Statusy backendu `rejected` / `needs_followup` — czy dziecko ma je widzieć? | **Nie.** Mapować na `wyslane` („Ślad zostawiony”); Mentor dostaje pytanie do rozmowy (`rozmowa`) zamiast werdyktu. `wiadomosci.js:105–108` i `PytanieSpotkania.jsx` to martwy kod toru `/przygoda`. | A-7, B |
| 12 | Nazwa profilu na ekranie ujawnienia (`Onboarding.jsx:573`). | Zostaje **na tym jednym ekranie**, w formie z rodzajem (`nazwaArchetypuGracza`); poza nim nigdy — stopka `PoradaPanel.jsx:198–202` i `KoloFortuny` chip do usunięcia. | A-8, C-2 |
| 13 | Kamień jako materiał na domek (po `da86ca2`). | Etap 1 = **trzy stosy drewna** (stan kodu: `zadanieDrewna.js:77–78`, `glazy[0].doRozbicia: false`, `sucheDrzewka: []`); **kamień wraca dopiero przy etapie 2** (drabinka / komin). Jedno źródło: `KOSZT_ETAPU` w `schronienie.js:334` z `{klody: 3, kamyki: 6}` → `{stosy: 3}`. Kanon `SWIAT_I_POSTACIE.md` („suche drzewko i głaz”) do aktualizacji po decyzji; `02` ma wariant „trzy stosy”, `05` karta LD bierze kamyk spod głazu bez rozbijania. | D-8, spójność h |
| 14 | Ścinanie: każde drzewo czy tylko suche? | Kopia robocza (`kwestieWizkora.js:160–179`, `Swiat.jsx:1440`, `sucheDrzewka: []`) — każde; kanon i §3 promptu — tylko suche/powalone. **Rekomendacja: suche drzewko** (§3 promptu wygrywa z kodem); `02` §2.2 ma tę wersję jako główną, „zetnij drzewo” z kopii roboczej jako alternatywę; po decyzji `sucheDrzewka` w `mapa.json` do przywrócenia. | A, recenzent |
| 15 | Ramka KR — czy Mentor może cofnąć „Pokaż w domku”? | Tak; wraca symbol. Przycisk „Pokaż w domku” widoczny tylko przy zdjęciu, z dopiskiem „bez twarzy i bez okna”. Symbol od razu po śladzie, zdjęcie rysunku tylko po decyzji Mentora, wersja z symbolem równie dobra. | D-2 |
| 16 | Kto dostaje którą hybrydę i kiedy drugą? | Pierwsza wg `typStartowy()`; druga najwcześniej po tygodniu jako „dzikie pole” Koła; sześć hybryd = sześć tygodni. Dziecko nie wybiera z dwóch kart (łamie „jedno zadanie na moment”, dwa obiekty w scenie naraz). | D-4 |
| 17 | Czy otwarta hybryda blokuje minigry następnego dnia? | **Nie.** Następnego dnia bez śladu Wizkor przypomina hybrydę **i** zleca pierwszą grę (gra to warstwa ekranowa); Koło nie losuje, dopóki hybryda czeka. Twarda blokada karze dziecko, które nie miało jak zrobić części B (np. `lawka` bez gościa). | D-5 |
| 18 | Czy pierwsze trzy zadania z Koła są zawsze z pary profilu + najsłabsza oś, czy dziecko wybiera z dwóch kart? | Para profilu + oś o najniższym liczniku, bez wyboru z dwóch kart; koło losuje od zadania 4 z kolejki bez powtórek (`historiaZadan`). 22 zadania wystarczają na trzy tygodnie przy jednym dziennie. | B-8 |
| 19 | Zapis wyboru `miejsca`. | `ZadaniePanel.jsx:37` trzyma wybór w `useState` — przepada. Zapisać w `ewolucja.zadanie.wizkora` (`miejsce`) i wysłać w `submitMissionProof` jako `place_id`; Mentor widzi „gdzie”; `sygnaly` +1. | B-5 |
| 20 | `sygnaly` i punkty do archetypu. | `cycles.js:274–277` i `mentor.js:134–135` dopisują do `player.archetype` niezależnie od zadania — utrwala etykietę z testu. Dopisywać do `competency_focus` zadania i `potrzeba`, nigdy do `archetype`; profil przełącza się wg `TEST_OBRAZKOWY` §8 (≥ 6 punktów przez dwa tygodnie). | B-6 |
| 21 | Czy przepisane porady zachowują `id`? | **Tak.** `viewed_tips` trzyma `tip_id`; nowe id wyrzuciłoby stare wpisy z „Rad, które już znasz” (`poradaPoId()`, `PoradaPanel.jsx:102`). Koszt: analityka zlewa starą i nową treść — dodać pole `wersja` w zdarzeniu. | C-1 |
| 22 | Porady dla rodzica (189) — do panelu Mentora? | Dopiero po osobnym audycie; pięć porad MD dla rodzica (D06-S3, D10-S3, D19-S3, D24-S3, D28-S3) uczy „oddawania cudzych emocji”. | C-3 |
| 23 | Czy Mentor widzi porady dnia? | Nie widzi treści ani „zrobione”; co najwyżej zbiorczo „dziś porada z liskiem: oddech”, bez oceny. Porada nie jest zadaniem i nie ma dowodu. | C-4 |
| 24 | Ślad porady w świecie — `/w2` i `/swiat` tak samo? | Jedna metoda `ustawSladPorady()` w API sceny na obu torach; stan w `localStorage` z kluczem dnia do czasu trwałego stanu świata (§4.4). | C-5 |
| 25 | Myśli Wizkora o ciele — tryb rozkazujący? | **Nie.** W kopii roboczej drugiej sesji **11 z 16** myśli ma czasownik rozkazujący (na HEAD 6 z 16; zmienionych 7 wpisów, z nich 5 nowo rozkazujących — „Napij się / Weź / Zakręć / Uśmiechnij się”); Wizkor w trybie spokojnym daje jedną obserwację bez zlecenia (§3 promptu). Czasowniki idą do biblioteki liska jako `rodzaj: ruch`; „uśmiech w lustrze” wyciąć. | C-6 |
| 26 | Etap 1–3 / 4–8 — skąd go brać? | Z wyboru etapu na starcie (§3 promptu); do wdrożenia pola `etap` na graczu wszystko traktowane jak `oba`. Jeden model dla zadań, hybryd i porad: `etap` + `warianty["1-3"\|"4-8"]` (spójność f). | C-7, B, D |
| 27 | Ile porad na profil docelowo? | 90 (30 dni × 3 pory), żeby fallback nigdy nie wchodził; najpierw domknąć MD (południe, wieczór), KR (wieczór), LD (wieczór). Dziś: MD 30/0/0, KR 25/8/0, LD 21/9/3. | C-8 |
| 28 | Czy „Później” w Poradzie ma limit? | Nie; porada wraca w tej samej porze bez komunikatu. `PoradaPanel.jsx:171` „zajrzyj później” do zmiany. | C-9 |
| 29 | Ciekawostki. | ≤ 1 / tydzień / profil, wyłącznie przy poradzie z czynnością i po sprawdzeniu faktu (pszczoły, plastelina, żarówka w bazie są nieprawdziwe). W 65 nowych/przepisanych celowo zero. | C-10 |
| 30 | Zachód bez zadania w realu — co mówi Wizkor? | Mikro-zaproszenie „sprawdź, czy u ciebie za oknem też zachodzi” (blok, bez dorosłego); jeśli dziś porada albo hybryda już użyła okna (`rodzina: "okno"`, §6) — „Na dziś koniec zleceń. Polana poczeka.” | A-5, A-10 |
| 31 | Klucze głosu w Onboardingu. | `:364` (`dolina_selfie`) → Wizkor `las_decyzji`; `:749` (`gora_podsumowania`, ton `celebration`) → narratorka `calm` z nowym tekstem albo wyciąć ekran monet. | A-9 |

---

## 2. Mapowanie sześciu profili na pięć osi

| profil (klucz legacy) | nazwa dla dziecka (tylko ekran ujawnienia) | oś główna | oś druga | dlaczego | kształt pierwszych zadań |
|---|---|---|---|---|---|
| DT | Odkrywca | `ciekawosc` | `wytrwalosc` | „sprawdź do końca” domyka ciekawość | zauważ, porozmawiaj |
| KR | Wynalazca | `tworzenie` | `ciekawosc` | tworzenie zaczyna się od zauważonego braku | zrób, odważ się |
| LD | Śmiałek | `odwaga` | `wytrwalosc` | próba liczy się, bo się zaczęła → drugie podejście | odważ się, zrób |
| EM | Przyjaciel | `wspolpraca` | `odwaga` | gest dla kogoś wymaga pierwszego kroku | podaruj, wytrzymaj |
| ST | Myśliciel | `wytrwalosc` | `tworzenie` | plan → test → poprawka to wytrwałość z rękami | zrób, wytrzymaj |
| MD | Spokojna Głowa (Skupienie) | `wytrwalosc` (regulacja) | `ciekawosc` | cisza z końcem to wytrzymanie; zauważanie to ciekawość | wytrzymaj, zrób (wolno) |

Zasady: profil jest **kolejnością**, nie zbiorem — nie zamyka dostępu do żadnej osi; `pickSeedMission` bez filtra `profile ===`. Wewnętrzna warstwa `potrzeba` (kompetencja · sprawczość · uważność · relacja · autonomia · regulacja · ruch · troska) i `ksztalt` (zrób · zauważ · porozmawiaj · wytrzymaj · odważ się · podaruj) są dla projektantów i algorytmu, **nie dla dziecka**. Nazwa profilu pada tylko na ekranie ujawnienia (pkt 12). `agents/world/archetypes.md` mapuje MD na „wytrwalosc albo wspolpraca” — „wspolpraca” do wycięcia (MD = Skupienie, nie mediacja).

---

## 3. Rozbieżności w dokumentach, plikach agentów i skillach

Kolumna „co obowiązuje” = kanon `docs/SWIAT_I_POSTACIE.md`, `docs/OPIS_PROJEKTU.md` i §3 promptu.

### 3.1 Dokumenty w `docs/`

| plik | co mówi | co obowiązuje | co zrobić |
|---|---|---|---|
| `docs/PANEL_ZADAN.md` | „Mentor przyjmuje albo prosi o poprawkę → backend przyznaje monety”; format zadania bez `potrzeba/minimum/etap/rozmowa/reakcja_swiata`; §3 „Porada dnia” opisuje `KARTY_DNIA` z `poradaDnia.js` jako format | Mentor zauważa; pętla ślad → świat reaguje → Mentor zauważa → świat dokłada; żywe źródło porad to `dailyTipsData.js` | przepisać pętlę i format wg `03` §7 i `04` §4.1 |
| `docs/KONCEPT_GRY.md` | most, latarnia, brama, domek stoją na mapie; Mentor przyjmuje i prosi o poprawkę | most/brama/latarnia `ukryte` w `mapa.json`, `hut2` w `budynkiWylaczone` (14.09) | poprawić stan sceny i rolę Mentora |
| `docs/PLAN_DZIALANIA.md` §5 | sześć „pierwszych zadań hybrydowych” (Kartograf, Most, Ciepły ślad, Trzy części, Odkrywca, Pierwszy głos) z częścią A na Kompasie Cieni, Tarczy Słońca, puzzlu bramy; MD = mediator | obiektów nie ma; MD = Skupienie; sześć hybryd w `05` | zastąpić odwołaniem do `05` |
| `docs/PIERWSZA_PRZYGODA_ROBOCZA.md` (13.09) | mieszkaniec z dachem, most istniejący, „Kronika”; REAL-01 zestaw sześciu symboli | mieszkańca i `hut2` nie ma, most ukryty; REAL-01 przejęty przez `ramka-w-domku` | oznaczyć jako nieaktualny |
| `docs/PIERWSZA_MINUTA.md` | Kamienny Pąk, świetliki na `/w2`, misja „Obudź deszcz” | na `/swiat` nic z tego nie stoi; świetliki w `mapa-w2.json` `znakiWylaczone` | `05` bierze tylko bramę pory znaków; reszta do oznaczenia |
| `docs/ROZWOJ_GRY.md` §2 | „rzeczy do postawienia na planecie za monety” (ławka, druga latarnia, kwiaty) | te same obiekty stawia świat **po śladzie**, nie sklep | wybrać jedno: obiekty za działanie |
| `docs/porady-ux.md` | odzew od Wizkora („kto: wizkor”); „drzewo tygodnia” z liśćmi (2.4, 6/E4) | odzew mówi lisek; drzewo tygodnia = ukryty licznik (sprzeczne z `SYSTEMY_GRY.md` §0) | poprawić; listki „x z 7” w `PoradaKarty.jsx:194–203` usunąć |
| `docs/SWIAT_I_POSTACIE.md` | „suche drzewko i głaz” jako materiał | kod po `da86ca2`: trzy stosy z dowolnych drzew, głaz bez rozbijania | aktualizować po decyzji 13/14 |
| `tmp/teksty-mowione.json` (druga sesja) | `Onboarding.jsx:396` głos `dolina_selfie`; brak 7 przejść quizu (`:47–53`) | w kodzie `las_decyzji` (`:397`); przejścia czyta Wizkor | dopisać do skryptu `scripts/teksty-mowione.mjs` |

### 3.2 Pliki agentów `.claude/agents/` i `agents/world/`

| plik | co mówi | co zrobić |
|---|---|---|
| `projektant-zadan.md` | „Mentor przyjmuje → monety i wzmocnijCeche”, sekcja „Ekonomia”: monety są potwierdzeniem | potwierdzeniem jest obiekt w świecie; Mentor zauważa; monety w tle |
| `psycholog.md` | „Monety niczego nie kupią… dwudziestu pięciu monet”, nagroda ma potwierdzać | zgodne w duchu, ale zakłada monety w komunikacie; nagrodą jest zmiana świata |
| `narrator-gama.md`, `agents/world/archetypes.md` | „lisek odzywa się wyłącznie w Poradzie dnia i wskazówce do Minigier” | lisek dodatkowo **robi** ślad w scenie po poradzie (bez mowy, `04` §6) i daje jedną chmurkę zaproszenia przy obiekcie części A hybrydy (raz na sesję, `05`) — dopisać albo wykreślić |
| `agents/world/archetypes.md` | MD → „wytrwalosc albo wspolpraca” | „wspolpraca” wyciąć (§2) |

### 3.3 Skille konta (`panel-zadan-ewolucja`, `audyt-zadan-ewolucja`)

Nie znają kanonu 17.09: „nagroda to monety i wzrost cechy”, „dowód idzie do Mentora → monety”, Mentor jako odbiorca dowodu z werdyktem, brak pól `potrzeba/minimum/etap/rozmowa/reakcja_swiata`, brak standardu porady (`zapowiedz/odzew/krok/silnik/slad`), brak reguły „Mentor zauważa”. Do aktualizacji po przyjęciu `01`, `03` §7 i `04` §4.1 (przez `propose_skills`, nie ręcznie).

### 3.4 Kod, który przeczy kanonowi (do `02`/`03`/`04`, tu tylko spis)

| miejsce | problem |
|---|---|
| `cycles.js:32–39` `PROFILE_INTROS` | Wizkor w trzeciej osobie („Wizkor szepcze: …”), intro dobierane po profilu — etykieta pośrednia |
| `dailyTipsData.js:1–4` | nagłówek „porady-CIEKAWOSTKI dla 6 archetypow”, `category: "medrzec" \| "kraina"` — obie wycofane |
| `hub/data/porady.v1.json` | 31 karteczek nigdzie niewyświetlanych (tylko `poradaDnia()` z `poradaDnia.js:168`, nieużywane przez `PoradaPanel`) — usunąć albo scalić |
| `poradaZBiblioteki.js:16–20` | komentarz „każdy profil ma poradę na KAŻDY z 30 dni” — prawda tylko dla poranka |
| `misjeGier.js:113,123` | „pamięć jak sowa” — sowa jest zwierzęciem profilu ST i niczym więcej |
| `PoradaPanel.jsx:200` | „Porady dobrane dla Ciebie: Śmiałek” — etykieta profilu na ekranie |
| `Swiat.jsx:1362–1365`, `2015–2018` | `IKONA_MONETY` przy zadaniu gwiazdek zamiast `/star.png` |
| `HintPopup.jsx:18` | nie wycisza `/games/*`: „MENTOR ZATWIERDZIŁ / Świetna robota!” wskakuje w środku minigry |
| `PasekKolejnejMisji.jsx` | pasek wypełniający się w czasie = odliczanie (konstytucja §0.3) |
| `koniec-dnia.v1.json` | ściana, dach, kamień, studnia, wiadro, Fasola — na `/swiat` nie ma żadnego z tych obiektów; `:54` „Domek czeka na ciebie” (ciężar na dziecku wbrew `_zasady` pliku) |
| `Swiat.jsx:1172` (po `da86ca2`) | zapowiedź kolejnej misji mówi „wędrowcze” — zakazane w `01` |
| `Onboarding.jsx:396` (kopia robocza) | „Przygotowałam” (forma żeńska) w głosie `las_decyzji` (Wizkor) — mieszanie ról |

---

## 4. Zależności techniczne do wdrożenia (opis, bez kodu)

### 4.1 `odmienDlaGracza` w komponentach

`odmien()` z `frontend/src/services/rodzaj.js` działa dziś tylko w `PoradaPanel` i `HintPopup`. Każdy nowy tekst w `01`–`05` używa tokenów `{m|ż}`; bez przepuszczenia przez `odmien` wyjdą surowe. Do objęcia:

| komponent / moduł | pola |
|---|---|
| `PopupPostaci` | `tekst`, `tekstEkranu`; TTS (`powiedzPostacia`) musi dostać tekst **po** odmianie — dziś dostaje surowy `tekst` |
| `PodsumowanieDnia` | każdy krok |
| `Swiat.jsx` `pokazKomunikat` (toasty) | tytuł |
| `RewardScreen` | `title`, `subtitle`, `note` |
| `ZadaniePanel.jsx` | `def.cel`, `def.jak`, `def.dowod`, `def.przyklad` (`:359–360`, `:297`, `:335`), `slad.opcje[]`, statusy, placeholder, nagłówki; `czytajZadanie` (`:83`) przed TTS |
| `wiadomosci.js:153` (`szept`), `MessageScroll.jsx:237` | tekst |
| ekrany wyniku gier: `MemoryGame`, `ChoinkaLaunchGame`, `BiegLiskaGame`; `misjeGier.nagrodaEkran*` | tytuł, podtytuł |
| `Onboarding` | ekran ujawnienia: `PROFILE_INFO.name` → `nazwaArchetypuGracza` |
| lisek: `powiedzJakLisek` (odzew porady) | `odzew`, `zapowiedz` |

### 4.2 Pola danych

**Zadania Wizkora** — `zadania-wizkora.v1.json` → **v2**: `potrzeba`, `minimum`, `etap` (`oba` \| `1-3` \| `4-8`), `warianty["1-3"|"4-8"]` (nadpisują `cel/jak/przyklad/miejsca/rozmowa`), `rozmowa` (pytanie dla Mentora, nie zakłada wyniku), `rozmowa_minimum` (opcjonalne), `reakcja_swiata` (nazwa metody sceny + argumenty), `miejsce_reakcji`, `karta_wizkora`, `mentor_powiadomienie` („Zobacz, co {zrobił|zrobiła} {imie}…”), `profil_pierwszy`, `ksztalt`, `tryb_startu`, `rodzina`, `zastepuje`, `slad` (`opcje[3]`, `obrazki[3]`, `zdanie: bool`, `zdjecie: bool`, `podpowiedz`), `kwestie[]` (`glos`, `moment`, `wariant`, `tekst`, `tekstEkranu`); `nagroda` zostaje (cichy licznik). **Przepisane zadania mają nowe `id`** — stare w `historiaZadan()` nie mogą zmienić znaczenia. Hybrydy (`05` W1) używają tego samego schematu plus `czescA`, `most`, `reakcja`, `reakcjaMentor` (mapowanie pól w `05` §4).

**Porady dnia** — `dailyTipsData.js` → format `04` §4.1: dodać `etap` (+ `warianty`), `rodzaj`, `wejscie`, `tryb`, `gdzie`, `silnik`, `zapowiedz`, `krok`, `minimum`, `odzew`, `ciekawostka`, `slad`, `uzasadnienie`; usunąć `category`, `subcategory`, `icon`, `tone`, `time`, `profileName`, `cecha`; `audience: rodzic` do osobnego pliku. Migracja skryptem, **id bez zmian**. `porady-zdrowia.v1.json` dostaje pole `temat` (R7).

**Kwestie Wizkora** — każda kwestia **ma** `tekstEkranu` (brak: `kwestieWizkora.js:263, 285`; `misjeGier.js` pola `granie` i `wyplata` dla trzech gier); opcjonalne pole `1-3` / `4-8` (gdy brak — jedna wersja), dobór po etapie z `profilStartowy.js`.

**Koniec dnia** — `koniec-dnia.v1.json` → struktura `kroki[].warianty[stan]` czytana z realnego stanu gracza: `stanZadaniaWizkora()` (doZrobienia / czeka / doOdbioru / wyplacone), `stanDrewna()` (brak placu / plac / etap 1), dziennik dnia (`Swiat.jsx:2057, 1523, 1930`), znaczniki „ślad dziś” i „Mentor zauważył dziś/w nocy”. Usunąć zależność od `zadania-mockup-braki.v1.json`.

**Backend** — `missions`: `library_id`, `place_id`; `choices_log` po `id`; status `noticed` zamiast `verified/rejected` (bez `points`); `comment` → `rozmowa` jako podpowiedź dla Mentora; profil Mentora: `gender`; ustawienia na dziecko: `zdjecia: bool`, `minutySesji: 10–20`; gracz: `etap`, `swiat` (§4.4).

### 4.3 Kanał ślad → scena i API sceny

Dziś `/swiat` nie ma **żadnego** kanału (ANALIZA §3); `/w2` ma tylko `ustawSladyPrzygod` (`index.js:61`). Docelowo:

1. Po `wyslijDowod` (`hub/zadanieWizkora.js:217`) albo zapisie śladu hybrydy React woła metodę sceny z pola `reakcja` / `reakcja_swiata`, potem `pokazMiejsce` (a od `da86ca2` raczej `pokazZnakWKadrze(znak, opcje)`, `app.js:2483`), potem narratorka przez `mowaPostaci` i toast (tytuł ≤ 28).
2. Po „zauważam” Mentora (przy następnym wejściu) — `reakcjaMentor`: mały obiekt (kwiat w nowym wariancie koloru przy drabince dla zadań Koła; światło **tylko** dla MD).
3. Nowe metody publiczne w obiekcie `i` w `scena-3d-src/src/index.js` obok `ustawSchronienie`: `ulozKamienie(n)`, `ustawLampke(miejsce)`, `pokazUkryty("most"|"latarnia"|"brama")`, `ustawOczko({przejrzyste, lilie, kwiat})`, `ustawLawke({rzecz, kroliczek})`, `ustawRamke({symbol, tlo, obraz, mala})`, `pokazZnacznikBraku`, `posadzKwiat(pos, kolor)`, `dodajGrzyb(pos)`, `ulozKamyczki(lista)`, `dodajSwietlika(pos)`, `ustawSladPorady(slad, {kolor, bezAnimacji})`, docelowo `ustawFasole(etap, animuj)`.
4. **Każde nowe `this.emit` w `app.js` musi być w `ZDARZENIA` (`index.js:27–33`)**, inaczej React nigdy go nie dostanie; `kino` (`app.js:3171`) nadal tam nie ma.
5. Szczegóły sceny per hybryda (`05` §4, notatki D): most dodawany tylko przy budowie świata (`swiat.js:1843`) — potrzebna referencja i `s.add` na żądanie, po przeniesieniu `most.pos` sprawdzić `onBridge` (`app.js:1061`) i wysokość tafli (`fasola.js:342`); znaki na wysokości pomostu (EM, KR: `poziom` 2,6 × skala 1,45) — zasięg dotknięcia do sprawdzenia w przeglądarce; świetliki MD z `mapa-w2.json:1135–1218` z `pora: "noc"` i `lightBase: 0` (budżet świateł punktowych 3–4); `ustawPlacBudowy` schodzi przy `_etapSchronienia > 0` (`app.js:2897`) — znacznik braku hybryd to osobny sprite (wzorzec `_placIkona`, `app.js:2850`); `woda:nabrana` nie działa bez Fasoli (`app.js:3068`), mokre ślady działają dla każdego oczka (`app.js:1716`); głaz [19.31, −3.18] przy oczku wschodnim — sprawdzić kadr kładki ST i lilii DT w edytorze. Przed każdą przebudową sceny `WERSJA_SCENY` w `Scena3D.jsx` w górę.
6. Oś etapów `hub/etapyMisji.js`: cztery momenty `hybryda:trop / czeka / slad / zauwazone` między `schronienie:komplet` a `<gra>:brak`, `misja: -1` na `trop` i `czeka`; `powitanieCzarodzieja` czyta `stanHybrydy()` przed `stanMisji()`; `kwestiaZachodu` (`kwestieWizkora.js:100`) dostaje wariant dla otwartej hybrydy (dla MD kwestia zachodu **jest** mostem hybrydy).

### 4.4 Stan świata poza `localStorage`

Jeden obiekt `swiat` w rekordzie gracza (backend `players`, obok `lifetime_scores`): `kamienie: 0–6`, `lampka`, `swietliki`, `kladka`, `kladkaPorecz`, `oczko {przejrzyste, lilie, kwiat}`, `lawka {rzecz, kroliczek}`, `ramka {symbol, tlo, obraz, mala}`, `kwiaty[]`, `ukryte {most, latarnia, brama}`, `fasola`, `sladPorady {dzien, slad}`; odtwarzany po `gotowa` (wzorzec `oznaczZuzyte`/`oznaczDostarczone`, `Swiat.jsx:1981`). Bez tego dziecko na tablecie mamy i telefonie taty widzi dwa różne światy. Do czasu backendu: `localStorage` z tym samym kształtem; ślad porady z kluczem dnia, kasowany o `doba:sesja`.

### 4.5 Bezpieczny tor obrazu (W7)

Stan dziś (potwierdzony): `ZadaniePanel.jsx:133` `access: "public"` w Vercel Blob; brak retencji i usuwania; `handleUploadUrl` `${API_BASE}/uploads/handler` bez uwierzytelnienia tokenu; `GET /missions/:id` bez auth (`cycles.js:246`); EXIF (w tym GPS) niezdejmowany; pole tekstowe 600 znaków (`:329`); reguła „bez twarzy” tylko w dokumentacji. Do zrobienia, w tej kolejności:

1. **Miniatura w przeglądarce**: canvas → JPEG ≤ 1280 px dla dowodu, ≤ 512 px dla ramki KR, **bez EXIF**; oryginał nie opuszcza urządzenia.
2. **Magazyn prywatny** z podpisanymi adresami o krótkiej ważności; **retencja** (np. 30 dni) i usuwanie na żądanie Mentora; adres miniatury w `swiat.ramka.obraz` tylko po fladze `pokaz_w_domku` ustawionej przez Mentora (`mentor.js`).
3. **Zgoda opiekuna** na zdjęcia (przełącznik z pkt 5; domyślnie wyłączone dla 1–3, globalnie wyłączone do wdrożenia 1–2).
4. **Uwierzytelnienie** wgrywania i odczytu (token dziecka do wgrania, token Mentora do odczytu; `/missions/:id` za auth).
5. Ekran: podpowiedź przy aparacie „bez twarzy, bez okna, bez numeru domu”; `maxLength` 600 → **160** z placeholderem „Jedno zdanie o tym, co powstało”; domyślna forma śladu dla 1–3: wybór z trzech obrazków (wzorzec W2 `slad[]`), zdjęcie opcjonalne; `accept="image/*"` (`:317`) zostaje.

### 4.6 Ekonomia monet

| źródło | dziś | docelowo |
|---|---|---|
| dowód zadania w realu | +5 przy wysłaniu (`cycles.js:288`), 15–40 od Mentora (`mentor.js:102`), demo 25 lokalnie (`zadanieWizkora.js:374`) | 25 przy **śladzie**, 0 za zauważenie; zauważenie dokłada obiekt |
| hybryda | — | jak zadanie w realu |
| gwiazdki | 10 za gwiazdkę, ekran nagrody, pigułka „+N” | 1 albo 0 (odgłos + licznik gwiazdek); bez ekranu nagrody |
| minigry | pigułka „+N”, Wizkor mówi o monetach (`misjeGier.js:113/186/253`) | pigułka „+N” tylko za partię; Wizkor o monetach nie mówi; „Od Wizkora za misję” → „Za zdobycie gry” |
| kwestie postaci | 6 w głosie, 10 na ekranie wspominają monety/skarbiec | 0 |
| HUD | licznik | cichy licznik zostaje; sklepu nie ma (`ROZWOJ_GRY.md` §2 do zmiany) |

### 4.7 Mentor „Zauważam” i statusy zadania

`mentor.js:94–160` `approve/reject` + punkty → jeden status `noticed` bez punktów; `MentorClassDetail.jsx:845–893` jeden przycisk „Zauważam”, pytanie do rozmowy z karty (`rozmowa`), powiadomienie z tokenem rodzaju dziecka; dla KR dodatkowo „Pokaż w domku” przy zdjęciu (cofalne). Po stronie dziecka `OPIS_STANU` (`zadanieWizkora.js:52–61`): **Do zrobienia → Czeka — u ciebie → Ślad zostawiony** (podtytuł „Mentor już to widzi” tylko przy prawdziwym Mentorze) **→ Mentor {zobaczył|zobaczyła}**; „Zrobione” tylko jako nagłówek historii; `rejected`/`needs_followup` mapowane na „Ślad zostawiony”; przycisk odbioru → „Zobacz, co się zmieniło” z `pokazMiejsce`. CTA dowodu w `ZadaniePanel`: nagłówek „Pokaż, co {zrobiłeś|zrobiłaś}”, przycisk „Zostaw ślad”; „Mentor to zobaczy” tylko przy prawdziwym, niedemowym Mentorze (`02` §2.5, `05` W1). Wolne zdanie Mentora dla dziecka zastąpione wyborem z gotowych formuł bez oceny („Widziałem.” / „Widziałam.” / „Porozmawiamy o tym.” / „Ciekawe, jak to {zrobiłeś|zrobiłaś}.”). `HintPopup`: `/games` do `SILENT_POPUP_PATHS`, „MENTOR ZATWIERDZIŁ” → „MENTOR ZOBACZYŁ” (docelowo token). Tryb demo — pkt 6.

### 4.8 Sesja: czas, zachód, noc, podsumowanie, powrót

- `minutySesji` z konta (panel Mentora, 10–20) przekazywane do sceny przy starcie (`app.js` → `doba.js`), domyślna wartość per etap (12 / 15); zachód w ~57% sesji; nowy dzień po przerwie ≥ 45 min (znacznik czasu ostatniego końca sesji w `localStorage` i na koncie), nie po odświeżeniu.
- Zachód przy otwartym oknie (`Swiat.jsx:1885–1888`): zamiast `zachodZapowiedziany = true` bez pokazania — kolejka: pokazać przy najbliższym wolnym ekranie, dopóki `etapSesji` ∈ {zachod, noc}.
- Etap „noc”: dziś bez obsługi w hubie; jedno zdarzenie → cichy podpis narratorki nad HUD (nowy kanał: tekst + głos, bez pigułki i przycisku), wyłączenie zleceń i chmurek.
- Podsumowanie: `PodsumowanieDnia` czyta realny stan (§4.2 „Koniec dnia”), pięć kroków, bez liczb i terminów.
- Toast: `opis` niewidoczny — tytuł ≤ 28 (standard); ikona gwiazdki dla zadania gwiazdek.

### 4.9 Tryb spokojny Wizkora i porady — reguła R7 (wspólna dla `01`, `02`, `04`)

`PodpowiedzMedrca.jsx`: `PIERWSZA` 75 s → **240 s**, `KOLEJNA` → 300 s, `MAX_NA_SESJE` 3 → **2**, blokada gdy `etapSesji` ≠ „dzien” i gdy od ostatniego okna Wizkora < 120 s; **3 min ciszy po odzewie liska**; pole `temat` w `porady-zdrowia.v1.json` i pomijanie tematów kolidujących z `rodzaj` dzisiejszej porady; `wskazowki.js` `porada-dnia`: `maksNaSesje` 3 → 1, `poCzasie` 75 s → 90 s. Myśli Wizkora bez czasowników rozkazujących (pkt 25).

### 4.10 Porady dnia — silniki, odzew, ślad, kontrola

- **Pora**: jedna definicja `poraTeraz` (trzy wartości); `EkranOddechu` mapuje `TEMPO` z pięciu pór na trzy; fallback w `swiezaPorada()` (`poradaZBiblioteki.js:88–94`) → „najbliższy dzień o tej samej porze”, nie „inna pora tego dnia”.
- **Silniki**: flaga `POKAZ_KARTY_AKTYWNOSCI` (`PoradaPanel.jsx:40`) → karta biblioteki dostaje „Zrób to ze mną” → silnik z pola `silnik` (`EkranOddechu`, `PoradaAkcja/Trop`, `PoradaAkcja/Ruch`); dopisać `cisza` i `napiecie`; silnik `fazy` (dawne „odliczanie”) **bez sekund i cyfr na ekranie** — fazę przełącza dotknięcie albo koniec wydechu, więc `EkranOddechu` musi emitować sygnał „koniec wydechu”, a `PoradaAkcja/Ruch` (zegar 5 s + cyfra) idzie do przebudowy; `KARTY_DNIA` i `porady.v1.json` znikają jako osobne pule; listki z 7 dni usunąć; stopka z profilem usunąć.
- **Odzew**: po „Zrobione” / końcu silnika lisek mówi `odzew` przez `powiedzJakLisek` (po `odmien`); przy `gdzie: dzien` — przy następnym wejściu tego dnia.
- **Ślad w świecie** (`04` §6.1): `ustawSladPorady(slad, {kolor, bezAnimacji})` + gałęzie w `app.js`: puls skali, tłumienie sprężyn `_gibKwiaty/_gibDrzew`, `Chmury.C.tempo`, `Swiatlo` zakotwiczone w punkcie mapy (`swiatlo-dnia`), `kwiaty.posadz(x,z,kolor)`, `kropla-swiatla` nad oczkiem, `kamyczek-przy-drabince` (ozdobny, poza `oznaczDostarczone`; kotwica = drabinka pomostu, przy etapie 0 obok placu), `MokreSlady` bez wysychania do zmierzchu, „ścisz świat” w `Doba` bez `przewin`. **Żadnego światła w oknie ani nocnego** — to hybryda MD.
- **`viewed_tips`**: backend trzyma pierwsze obejrzenie na zawsze; po przepisaniu pod tym samym id historia pokaże nowy tytuł (pkt 21); nowe zdarzenie `porada_wykonana` (id, rodzaj, gdzie, wersja) bez liczby na ekranie.
- **Skrypt kontrolny w CI** (z `tmp/tresci-skrypty/sprawdz-nowe-C.py`): limity pól, brak cyfr i ukośników w TTS, tokeny przy „-łeś/-łaś”, słowa zakazane, zgodność `pora` ze slotem, ≤ 1 ciekawostka / 7 dni / profil, reguła „ciało co 3 dni” — uruchamiany na `dailyTipsData.js` przy każdej zmianie. Dziś zgłasza luki „ciało co 3 dni”: DT 10–14, 28–29; EM 2–4, 14–17, 26; ST 4–5, 14, 20–22, 26–28; KR 1–10, 14–15, 26–30; LD 14, 27; MD 24–25.

### 4.11 Domek, etapy, Fasola

- `schronienie.js:308` `ETAPY = [etap1]`, `ETAPY_DOCELOWO = 3`, `KOSZT_ETAPU` jeden wpis (`:334`); `czyMoznaRozbudowac` nikt nie woła. Etapy 2–3 wymagają geometrii, kotwicy na ścianie dla ramki i ławki (dziś `schronienie-kotwica`, `app.js:2684`) bez zmiany zapisu, i bramki z pkt 3.
- `ustawFasole(n)` nie istnieje; Fasola tylko w `mapa-w2.json` i `Fasola.podlej()` (`fasola.js`), bez zapisu. Gdy wejdzie na `/swiat`: etap = liczba zauważonych śladów (`wariant/stan.js` `etapWzrostu`), zapis w `swiat.fasola`. Hybrydy jej nie używają.
- Pierwsze zadania Koła: funkcja `pierwszeZadania(profil, sygnaly)` przed `KoloFortuny` (para profilu + najsłabsza oś); filtr etapu w `zadanieDlaCechy`; dla 1–3 karta pokazuje `cel` + `przyklad`, `jak` czyta lektor.

### 4.12 Analityka (dziś zero zdarzeń z pętli zadania — ANALIZA §3)

`zadanie.zlecone` · `miejsce.wybrane` · `hybryda.otwarta` · `czescA.wybor` · `most.odlozony` · `slad.zostawiony` · `swiat.zareagowal` · `mentor.zauwazyl` · `powrot.po.sladzie` · `porada_wykonana` · `porada_dnia_pokazana` (+ `wersja`). Miary sukcesu z `OPIS_PROJEKTU.md` (rozpoczęte działania poza ekranem, powroty po działaniu, zauważenia Mentora) nie są dziś mierzalne.

### 4.13 Pliki drugiej sesji — kolizje (stan na 17.09 wieczór)

Niezacommitowane w chwili audytu (część weszła w `da86ca2`): `backend/src/services/ttsService.js`, `frontend/src/services/tts.js`, `ttsPlayer.js` (mechanizm pauzy), `dailyTipsData.js` (105 wpisów, 34 dla dziecka), `zadania-wizkora.v1.json` (2 zadania), `porady-zdrowia.v1.json` (7), `koniec-dnia.v1.json`, `poradaDnia.js`, `misjeGier.js`, `Onboarding.jsx`, `mapa.json`, nowy `scripts/teksty-mowione.mjs`, `tmp/poprawki-tekstow.json`, `tmp/runda1-do-naniesienia.json`. Reguły:

1. **Nie uruchamiać `scripts/migrate-tips-to-tasks.mjs`** ani niczego, co regeneruje `dailyTipsData.js` — 130 zmian zniknie bez śladu w diffie. Najpierw zacommitować kopię roboczą jako krok pośredni, potem jedna migracja formatu wg `04` §4.1.
2. Po przeliczeniu na kopii: werdykty `04` HEAD 29/52/64/53 → kopia 29/58/61/50; szkodliwe 40 → 37; 1 regres (ST-D12-S2-LUKA cyfry w TTS), 1 nowy brak tokenu (LD-D09-S3), 1 nowe „pamiętaj” (LD-D10-S1); 14 tytułów EM nadal bez ogonków.
3. Myśli Wizkora: 11 z 16 w trybie rozkazującym (HEAD 6) — 5 nowo przepisanych cofnąć do obserwacji, resztę przepisać wg `01` (pkt 25).
4. Linie w `02`–`05` liczone na `596d4aa`; mapowanie na `da86ca2` w `05` §7.1 i `02` §6.

---

## 5. Haki dzielone między `03` (zadania w realu) i `05` (hybrydy)

Zasada (rozstrzygnięcie c/d recenzji): **hybryda ma pierwszeństwo do obiektu**; zadanie w realu, które używa tego samego haka, dostaje „kwiat” (`kwiaty.posadz`) w miejscu opisanym niżej.

| hak w scenie | hybryda (`05`) | zadanie w realu (`03`) → co dostaje zamiast |
|---|---|---|
| ukryty `most` | `kladka-nad-oczkiem` (ST) | `kladka-z-kartki` §7.5 → kwiat przy pieńku (bez pieńka: przy drabince); `papierowy-most` (W2 `wariant/tresci.js:26`) → wycofać |
| pierwszy kamień-krok / droga z kamieni | `kamienie-kroki` (LD) | `skok-przez-skarpetki` §7.9 → kwiat przy choince |
| ramka na barierce pomostu | `ramka-w-domku` (KR) | `celowo-brzydko` §7.8 → kwiat w nowym kolorze przy drabince |
| ławka / drugie miejsce na pomoście | `lawka-dla-goscia` (EM) | `obok` §7.4 → dwa kwiaty obok siebie przy drabince |
| świetlik przy domku | `swiatlo-w-oknie` (MD, po zauważeniu) | `najwolniejszy-krok` §7.12 → kwiat przy pomoście |
| ukryta `latarnia` przy ścieżce | — (MD używa nowej instancji `latarnia()` na pomoście) | `ostatni-dzwiek` §7.11 → latarnia; pilnować budżetu świateł |
| kamyczki-znaczniki przy ścieżce / krąg jak zegar | — | `tam-i-z-powrotem` §7.1, `minuta-w-glowie` §7.6 — bez kolizji, jeśli poza drogą drzewo → oczko zachodnie; opis „z rozbitego głazu” poprawić (rozbijania nie ma, model `kamyczki` jest) |
| znak `prog` (dno oczka) | `co-jest-na-dnie` (DT) | żadne zadanie `03` — bez kolizji |
| ukryta `brama` (`brama.ukryta: true`, model `swiat.js:1328`) | — | `drugie-podejscie` §7.10 → `pokazUkryty("brama")` (ta sama metoda co most) |
| „przedmiot liska na pieńku” | — | `wynalazca-z-kieszeni` §7.7, `trzy-przedmioty` §8.1 → pieniek istnieje tylko po ścięciu; bez pieńka — kwiat przy drabince; model przedmiotu do zbudowania (średni) |
| nowy znak na mapie | — | `pierwsze-slowo` §8.3 → wpis w `mapa.json` + `schowajZnakZMapy` do czasu śladu |
| „świetlik” — jedna definicja | MD po zauważeniu: trzy nocne znaki (`pora: "noc"`, bez światła punktowego) | `04` §6.1 „kula światła do końca doby” = `swiatlo-dnia` (inna rzecz) |
| dodatek po zauważeniu Mentora (zadania Koła) | — | kwiat w nowym wariancie koloru przy drabince; **światło tylko dla MD** |

---

## 6. Rejestr rodzin (jedno doświadczenie w wielu miejscach → pole `rodzina`)

| `rodzina` | członkowie | kto pierwszy | reguła |
|---|---|---|---|
| `kladka` | `kladka-nad-oczkiem` (`05`), `kladka-z-kartki` (`03` §7.5), `papierowy-most` (W2) | hybryda | po jednym wykonaniu kolejka pomija resztę; jedno źródło tekstu części B (`05`) |
| `okno` | zachód bez zadania (`02` §3.1), `swiatlo-w-oknie` (`05` MD), porady DT-D11-S3 / ST-D17-S3 (`04`) | porada albo hybryda dnia | zachód bez zadania sprawdza, czy okno było dziś użyte — wtedy „Na dziś koniec zleceń. Polana poczeka.” |
| `cisza-dzwiek` | `ostatni-dzwiek` (`03` §7.11), porady `rodzaj: wyciszenie` z dźwiękiem | zadanie | porada z dźwiękiem nie wchodzi w dniu zadania |
| `po-cichu` | `tajny-pomocnik` (`03` §7.3), porada EM-D16-S1 (`04`) | zadanie | porada nie wchodzi w dniu zadania z tej samej rodziny (pole `rodzina` w poradzie, `04` §4.1) |
| `drugie-uzycie` | `wynalazca-z-kieszeni` (`03` §7.7), porada KR-D10-S1 (`04`) | zadanie | jw. |
| `swiatla` | `swiatlo-w-oknie` (MD), `ostatni-dzwiek` (latarnia) | hybryda | budżet świateł punktowych 3–4 |

---

## 7. Proponowana kolejność wdrożenia (od najtańszego i najpilniejszego)

| krok | co | dlaczego teraz | dokument |
|---|---|---|---|
| 0 | **Wyciąć 37 szkodliwych porad z produkcji** (najpierw 7 z listy alarmowej `00` / `04` §2) — podmiana treści pod tym samym id | dziś czyta je dziecku lisek | `04` §2, §7 |
| 1 | `odmien` w komponentach (§4.1) + `tekstEkranu` dla wszystkich kwestii | warunek dla każdego nowego tekstu | `02`, `01` |
| 2 | Kwestie z `02` §2–§3 (zachód / noc / koniec / powrót) + statusy zadania (§4.7) + R7 (§4.9) | najwięcej widocznych zmian za najmniej kodu | `02`, `01` |
| 3 | `zadania-wizkora` v2 z 22 zadaniami z `03` + `pierwszeZadania` + pomijanie po `id` | pierwsze zadanie dobre dla każdego profilu | `03` |
| 4 | Migracja `dailyTipsData.js` do formatu `04` §4.1 (po zacommitowaniu kopii roboczej), skrypt CI | 65 nowych/przepisanych porad | `04` |
| 5 | Część wspólna hybryd W1–W6 + `kamienie-kroki` (LD) | testuje cały kanał ślad → scena → Mentor | `05` §4 |
| 6 | `swiatlo-w-oknie`, `kladka-nad-oczkiem` (dane + małe metody), potem `co-jest-na-dnie` | koszt niski | `05` |
| 7 | Stan świata na koncie (§4.4), analityka (§4.12) | dwa urządzenia = jeden świat; miary sukcesu | — |
| 8 | `lawka-dla-goscia`, `ramka-w-domku` (symbol) po pierwszym teście z dziećmi | nowe bryły na pomoście | `05` |
| 9 | Tor obrazu W7 (§4.5), dopiero potem włączenie zdjęć | bezpieczeństwo | — |
| 10 | Biblioteka Mentora: wyciąć 47, przepisać 29, migracja, ~30 do Wizkora | tydzień czwarty i dalej | `03` §3 |
