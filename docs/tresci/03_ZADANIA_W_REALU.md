# 03 — Zadania w realu: audyt, kryteria jakości, dopasowanie do profilu, nowe pierwsze zadania

> Agent B, sesja Fable, 17.09.2026. Stan repo: HEAD `596d4aa` (`v2-postgres-vercel`).
> Tylko odczyt kodu. Liczby pochodzą ze skryptów `tmp/tresci-skrypty/pomiar-B.py`
> i `tmp/tresci-skrypty/pomiar-B-balans.py` (zrzut biblioteki: `zrzut-biblioteki.mjs` →
> `biblioteka-mentora.json`). Cytaty z `plik:linia` w aktualnym stanie plików.
> Reguły nadrzędne: `docs/OPIS_PROJEKTU.md`, `docs/SWIAT_I_POSTACIE.md`, sekcje 3–4
> promptu (`tmp/PROMPT_FABLE.md`). Pytania do autora: `tmp/tresci-notatki-B.md`.

---

## 1. Stan i metoda

### 1.1 Jak dziś wybierane jest zadanie w realu (tor główny `/swiat`)

| krok | gdzie | co się dzieje |
|---|---|---|
| 1 | `frontend/src/hub/KoloFortuny.jsx:114` | `const idx = Math.floor(Math.random() * CECHY_KOLA.length)` — cecha losowana równomiernie z pięciu (`CECHY_KOLA`, `:41–47`). Profil z testu i etap szkolny nie wchodzą do losowania. |
| 2 | `frontend/src/hub/zadanieWizkora.js:146–157` | `zadanieDlaCechy(cecha)`: z zadań tej cechy odpada historia rozliczonych (`historiaZadan`, `:160`) i bieżące; z reszty `Math.random()`. Gdy wszystkie były — cecha wraca od nowa (`:155`). |
| 3 | `frontend/src/hub/panels/ZadaniePanel.jsx:380–395` | „Gdzie możesz to zrobić?” — wybór `miejsca` trzymany tylko w `useState` (`:37`), **nie jest zapisywany** ani wysyłany. |
| 4 | `ZadaniePanel.jsx:117–119`, `:81–87` | Wizkor czyta `cel` + `jak` głosem `las_decyzji` (TTS) — w tych polach nie może być cyfr. |
| 5 | `ZadaniePanel.jsx:314–331` | dowód: `accept="image/*"` + `capture="environment"`, pole tekstowe `maxLength={600}`, placeholder „Napisz, co zrobiłeś…” (forma męska, `:328`). |
| 6 | `zadanieWizkora.js:199–215` | `seedMission` (`adventure_ref: wizkor.<id>`) → `submitMissionProof`. |
| 7 | `backend/src/api/cycles.js:274–288` | przy wysłaniu: **+4 do `player.archetype`** (profil z testu, niezależnie od treści zadania), +2 do każdego kodu z `competency_focus`, **+5 monet**. |
| 8 | `backend/src/api/mentor.js:95–158` | `verify`: `decision: 'approve' | 'reject'`, monety 15–40 (`:102`), **+5 do `archetype`** (`:134–135`), wieść „+N ✦ za …” (`:154`). |
| 9 | `zadanieWizkora.js:257–259` | demo: po 60 s werdykt sam, notatka „Widziałem, co zrobiłeś. Właśnie tak wygląda ciche dobro.” |
| 10 | `zadanieWizkora.js:52–61` | etykiety stanów: „Mentor prosi o poprawkę”, „Sprawdzane”, „Nagroda czeka”, „Odbierz nagrodę” — Mentor jako sędzia, monety jako nagroda (sprzeczne z decyzją z 17.09). |

Tor `/w2` (`frontend/src/wariant/tresci.js`) ma fazy A→B, `mlodsi`/`starsi`, `slad` jako wybór z trzech opcji i `rozmowa` — to wzorzec, do którego dopasowany jest rozszerzony format w tym dokumencie.

Tor Mentora (`cycles.js:75–92`, `pickSeedMission`): zadania z biblioteki **tylko z profilu gracza** (`it.profile === profile`), pomijane po **tytule** (`:84`) — zadania, którym 17.09 zmieniono tytuły, mogą wrócić drugi raz.

### 1.2 Liczby bazy (pomiar)

| zbiór | plik | liczba |
|---|---|---:|
| zadania Wizkora (tor główny) | `frontend/src/hub/data/zadania-wizkora.v1.json` (ostatnia zmiana `558d8c5`, 23.08) | 10 (po 2 na cechę) |
| biblioteka Mentora, wszystkie wpisy | `frontend/src/data/mentorTaskLibrary.js` + `.additions.js` | 336 |
| — w tym `kind: task` | | **276** (DT 33 · EM 46 · ST 65 · KR 49 · LD 43 · MD 40) |
| — `hint` / `artifact` | | 30 / 30 |
| zadania W2 | `frontend/src/wariant/tresci.js` | 7 |
| bank z epok (do weta) | `docs/MOTYWY_Z_EPOK.md` §2 | 26 |

### 1.3 Weryfikacja faktów z sekcji 5.2 promptu

| fakt z promptu | stan 17.09 |
|---|---|
| Koło losuje równomiernie, profil nie wpływa | ✔ potwierdzone (`KoloFortuny.jsx:114`) |
| punkty do archetypu z testu | ✔ (`cycles.js:274–277`, `mentor.js:134–135`) |
| 10 zadań „idź i zrób”, `competency_focus` tylko MD/EM | ✔ (MD 6×, EM 6×; DT/ST/KR/LD 0×) |
| biblioteka 276, ~26% liczba w poleceniu | cyfra: 37 (13%); **cyfra lub liczebnik słowny: 155 (56%)** — liczebnik jest w co drugim zadaniu |
| 25 zadań czeka na kłótnię/smutek | słownik emocji: 11; zdania warunkowe „gdy/jeśli ktoś…”: 22 — razem ok. 25, potwierdzone |
| rówieśnik partnerem w 2 | rówieśnik nazwany w 11 (prawie zawsze „koleżanka albo mama”), jako **jedyny** partner: 2 (LD-016, LD-012) |
| etykietowanie „Śmiałek lubi” | **50 zadań (18%)** ma nazwę profilu w tekście |
| pole 600 znaków, blob public, EXIF, brak auth | ✔ (`ZadaniePanel.jsx:329`, `:133`; szczegóły w notatkach do 06) |
| werdykty wstępne (ramię-w-ramię, jeden-krok-dalej, …) | plik z 23.08, nic się nie zmieniło — werdykty zweryfikowane niżej, sekcja 2 |

Nowe względem promptu: **228 z 276 (83%)** zadań biblioteki ma czasownik w formie męskiej bez tokenu; tokeny `{m|ż}` ma 11. **22** wymagają zdjęcia jako jedynego dowodu. Cztery zadania EM (025, 031, 037, 044) mówią o „Świetliku”/„ćmie świetlnej” — postaci, której nie ma w kanonie.

---

## 2. Audyt dziesięciu zadań Wizkora

Osiem testów: **B** bezpieczeństwo · **W** wykluczenie · **G** godność · **Wk** wiek · **Wy** wykonalność · **P** polecenie · **Pw** powtarzalność · **WB** wartość well-being (jaką potrzebę karmi i co dziecko wynosi poza „zrobiłem”). ✔ przechodzi · ⚠ poprawka · ✖ wypada.

| id (cecha) | B | W | G | Wk | Wy | P | Pw | WB | werdykt | `potrzeba` |
|---|---|---|---|---|---|---|---|---|---|---|
| lowca-pytan (ciekawość) | ✔ | ⚠ | ✔ | ✔ | ⚠ | ⚠ | ✔ | ✔ | **poprawka** | kompetencja |
| zwiadowca-podworka (ciekawość) | ✔ | ✔ | ✔ | ✔ | ✔ | ⚠ | ✔ | ✔ | **poprawka** | uważność |
| cos-z-niczego (tworzenie) | ✔ | ⚠ | ⚠ | ✔ | ⚠ | ✖ | ✔ | ⚠ | **przepisać** | sprawczość |
| warsztat-wynalazcy (tworzenie) | ✔ | ⚠ | ✔ | ✔ | ⚠ | ⚠ | ✔ | ✔ | **poprawka** | sprawczość |
| ramie-w-ramie (współpraca) | ✔ | ⚠ | ✖ | ✔ | ⚠ | ✔ | ✔ | ✖ | **przepisać** | relacja |
| mistrz-instrukcji (współpraca) | ✔ | ⚠ | ✔ | ⚠ | ⚠ | ⚠ | ✔ | ✔ | **poprawka** | kompetencja |
| jeden-krok-dalej (odwaga) | ✔ | ⚠ | ✖ | ⚠ | ✔ | ⚠ | ✔ | ⚠ | **przepisać** | sprawczość |
| pierwszy-raz (odwaga) | ✔ | ⚠ | ⚠ | ✔ | ✔ | ✔ | ✔ | ⚠ | **poprawka** | autonomia |
| do-samego-konca (wytrwałość) | ⚠ | ⚠ | ⚠ | ✔ | ⚠ | ⚠ | ✔ | ✔ | **poprawka** | kompetencja |
| siedem-razy (wytrwałość) | ✔ | ⚠ | ✔ | ✔ | ⚠ | ✔ | ✔ | ✔ | **poprawka** | kompetencja |

Wspólne dla wszystkich dziesięciu (jedna poprawka globalna): brak tokenów rodzaju we wszystkich polach (`zauważyłeś`, `przerwałeś`, `Zapytałem`, `Zbudowałem`…); `competency_focus` kłamie (MD/EM zamiast cechy zadania); `nagroda: 25` w danych — po decyzji z 17.09 monety zostają w tle i nie pojawiają się w tekście, pole zostaje jako cichy licznik; żadne zadanie nie ma `minimum`, `etap`, `rozmowa` ani `reakcja_swiata`.

### 2.1 `lowca-pytan` — poprawka

Zdrowe jądro: ciekawość zamieniona w domknięcie („dowiedz się do końca”). **Polecenie:** `jak` ma dwa czasowniki („Wybierz… i znajdź”), `cel` też („Zapytaj… I dowiedz się”); zostawiamy zwrot akcji w celu, upraszczamy `jak`. **Wykluczenie:** miejsce `dom` („Zapytaj kogoś dorosłego o jego pracę”) zakłada dorosłego, który ma pracę i czas na opowieść — zamiast tego „Zapytaj kogoś w domu o coś z czasów, zanim się {urodziłeś|urodziłaś}”; `ksiazka` zakłada atlas w domu — dopisać „albo w bibliotece szkolnej”. `spacer` i `kuchnia` zdrowe. **Wykonalność:** „do końca” nie ma sufitu, gdy odpowiedź zależy od dorosłego → `minimum`. **WB:** kompetencja (wiem coś, czego nie wiedziałem) i autonomia (moje pytanie).

Gotowe zdania: `jak`: „Zadaj jedno pytanie, które Cię gryzie — komuś albo książce.” · `dowod`: „Napisz jedno zdanie, czego się {dowiedziałeś|dowiedziałaś}, albo zrób zdjęcie tego, co to wyjaśnia.” · `przyklad`: „{Zapytałem|Zapytałam} w domu, dlaczego niebo jest niebieskie. Już wiem!” · `minimum`: „Jedno pytanie zadane na głos. Odpowiedź może przyjść później — i tak się liczy.” · `rozmowa`: „Co w odpowiedzi było najbardziej zaskakujące?” · `competency_focus: ["DT"]` · `reakcja_swiata`: „obok Wizkora na polanie pojawia się nowy znak z lupą (mechanizm znaków istnieje: `hub/znakiMapy.js`; nowy wpis — koszt niski)”. · `warianty["1-3"]`: `cel` „Zapytaj dziś o coś, czego nie wiesz.\nI słuchaj do końca.” · `jak` „Zadaj jedno pytanie komuś w domu albo w świetlicy.” · `etap: "oba"`

### 2.2 `zwiadowca-podworka` — poprawka

Najlepsze zadanie z dziesięciu: ograniczenie sprawdzalne („trzy rzeczy”), zwrot akcji („jakbyś był tu pierwszy raz”), ślad o rzeczy. **Polecenie w miejscach:** `okno` („Popatrz przez pięć minut i policz, co się rusza”) zamienia zauważanie w liczenie i ma czas, którego siedmiolatek nie odmierzy → „Popatrz chwilę i wypatrz trzy rzeczy, które się ruszają.”; `park` („Znajdź trzy różne liście i porównaj je”) to inne zadanie → „Znajdź trzy rzeczy, których ostatnio tu nie było.”; `droga` — dopisać „po drodze”, żeby nie brzmiało jak samodzielne wyjście. Blok ratuje `dom` („trzy rzeczy starsze od Ciebie”) — zostaje. **WB:** uważność.

Gotowe zdania: `cel`: „Znajdź dziś trzy rzeczy,\nktórych nigdy nie {zauważyłeś|zauważyłaś}.” · `jak`: „Idź drogą, którą znasz na pamięć, i patrz tak, jakbyś {był|była} tu pierwszy raz.” · `przyklad`: „Nad naszą klatką jest gniazdo. Chodzę tędy codziennie i nigdy go nie {widziałem|widziałam}.” · `minimum`: „Jedna rzecz, na którą {spojrzałeś|spojrzałaś} pierwszy raz naprawdę — i tak się liczy.” · `rozmowa`: „Która z tych trzech rzeczy była tam najdłużej?” · `competency_focus: ["DT"]` · `reakcja_swiata`: „przy ścieżce na polanie wyrasta nowy grzyb (lista `grzyby` w `mapa.json`; wyrastanie w trakcie gry — koszt niski)”. · `warianty["1-3"]`: `cel` „Znajdź dziś trzy rzeczy,\nktórych jeszcze nie {widziałeś|widziałaś}.” · `jak` „Idź znaną drogą i patrz w górę i w dół.” · `etap: "oba"`

### 2.3 `cos-z-niczego` — przepisać

**Polecenie ✖:** „Zrób dziś coś własnymi rękami. Od początku do końca.” nie ma ograniczenia ani widocznego końca — dziecko nie wie, kiedy skończyło; `stol` („Narysuj coś, czego nikt jeszcze nie narysował”) to presja oryginalności, której nie da się sprawdzić, a da się „oblać” (`zadania-wizkora.v1.json:106`). **Wykonalność:** 20 minut „od początku do końca” bez określenia rzeczy. **Godność:** „po swojemu” w `jak` jest dobre, ale bez ograniczenia zostaje ocena. **WB:** sprawczość istnieje, ale rozmyta. Przepisane jako **„Trzy przedmioty”** (sekcja 8) — ograniczenie, które dziecko samo sprawdza.

### 2.4 `warsztat-wynalazcy` — poprawka

Zwrot akcji („czego nie ma w żadnym sklepie”) jest, tytuł nadaje rolę. **Wykluczenie:** `jak` zakłada „pudełko, sznurek, korki”; `dwor` („domek dla owadów z patyków”) zakłada dwór; `biurko` („Wymyśl grę planszową i narysuj planszę”) to inne, dwuczasownikowe zadanie na godzinę. **Polecenie:** „maszynę albo pojazd” — dwa cele. **WB:** sprawczość.

Gotowe zdania: `jak`: „Weź trzy rzeczy, które i tak miały iść do kosza, i zrób z nich jedną, która coś robi.” · `dowod`: „Zrób zdjęcie wynalazku albo napisz jedno zdanie, do czego służy.” · `przyklad`: „{Zrobiłem|Zrobiłam} z kartonu po mleku pojemnik na kredki. Stoi i się nie przewraca.” · `miejsca.biurko.opis` → „Zrób z kartki coś, co stoi samo.” · `miejsca.dwor` → `swietlica`: „Zbuduj coś z pudełek po grach, których nikt już nie używa.” · `minimum`: „Jedna rzecz połączona z drugą tak, że trzyma — i tak się liczy.” · `rozmowa`: „Co było najtrudniejsze do połączenia?” · `competency_focus: ["KR"]` · `reakcja_swiata`: „na pieńku po suchym drzewku (`sucheDrzewka` → pieniek po ścięciu, istnieje) pojawia się mały przedmiot liska — model claymorphism, koszt średni”. · `warianty["1-3"]`: `cel` „Zbuduj dziś coś z pudełka i sznurka.\nCoś, czego nie ma w sklepie.” · `jak` „Weź pudełko i połącz je z jedną rzeczą tak, żeby coś robiło.” · `etap: "oba"`

### 2.5 `ramie-w-ramie` — przepisać (werdykt z promptu potwierdzony)

**Godność ✖ / WB ✖:** to tablica obowiązków w kostiumie: „Posprzątajcie razem” (`:194`), „Zagrabcie liście albo umyjcie rower” (`:200`), „Nieś część siatek i pilnuj listy” (`:206`), „Ugotujcie coś razem” (`:188`), a `cel` mówi wprost „robotę” (`:173`). Dziecko wynosi „pomogłem w obowiązku”, nie „zobaczyłem, co daje wspólne działanie”. **Wykluczenie:** każde miejsce zakłada dorosłego z czasem, ochotą i (auto, ogród) majątkiem. Przepisane jako **„Na zmianę”** (sekcja 8) — współpraca bez słów i bez obowiązku, z rówieśnikiem jako pełnoprawnym partnerem.

### 2.6 `mistrz-instrukcji` — poprawka

Odwrócenie ról (dziecko uczy) to najlepszy tryb startu w bazie. **Wykonalność:** „aż druga osoba zrobi to sama” (`:216`) — zadanie da się oblać, gdy babcia nie zrobi → sufit: jedna próba drugiej osoby liczy się. **Wykluczenie:** `rodzenstwo` zakłada rodzeństwo, `dom` zakłada psa (`:248`), `dorosly` „czegoś z ekranu” (`:236`) wciąga ekran do zadania poza ekranem. **Wiek:** dla 1–3 „krok po kroku” trzeba podać przykład czynności (sznurek, samolot z kartki). **WB:** kompetencja (umiem tak, że mogę pokazać).

Gotowe zdania: `jak`: „Wybierz jedną rzecz, którą umiesz, i pokaż ją komuś krok po kroku.” · `cel`: „Naucz dziś kogoś czegoś,\nco umiesz zrobić {sam|sama}.” · `dowod`: „Napisz, czego i kogo {nauczyłeś|nauczyłaś}, albo zrób zdjęcie tego, co powstało.” · `przyklad`: „{Nauczyłem|Nauczyłam} Olę ze świetlicy wiązać buty. Za trzecim razem zrobiła to sama!” · `miejsca.dom` → `swietlica`: „Pokaż komuś młodszemu sztuczkę ze sznurkiem albo samolot z kartki.” · `miejsca.dorosly.opis` → „Naucz kogoś dorosłego gry, którą znasz z podwórka.” · `miejsca.rodzenstwo` → `mlodszy`: „Pokaż komuś młodszemu, jak coś działa.” · `minimum`: „Pokazane raz, choćby druga osoba tylko patrzyła — i tak się liczy.” · `rozmowa`: „Co było najtrudniejsze do wytłumaczenia?” · `competency_focus: ["EM","ST"]` · `reakcja_swiata`: „przy drabince domku na drzewie (etap 1, `ustawSchronienie`) wyrasta kwiat (`kwiaty.posadz` — istnieje)”. · `warianty["1-3"]`: `cel` „Pokaż dziś komuś, jak robisz jedną rzecz.\nKrok po kroku.” · `jak` „Wybierz sznurek, samolot z kartki albo sztuczkę i pokaż ją powoli.” · `etap: "oba"`

### 2.7 `jeden-krok-dalej` — przepisać (werdykt potwierdzony)

**Godność ✖:** `cel` „Zrób dziś coś, czego trochę się wstydzisz” (`:256`) robi ze wstydu temat zadania, `dowod` „co to było i jak się czułeś” (`:259`) to uczucia jako dowód, `miejsca.dom` „Powiedz na głos wierszyk albo zaśpiewaj przy rodzinie” (`:271`) i `stol` „Opowiedz wszystkim, co dziś było najlepsze” (`:289`) to występ przed publicznością — rodzic-4-8: dwunastolatek zamknie apkę. **Wiek:** dla 4–8 „zaproś kogoś do wspólnej zabawy” jest dziecinne. Zdrowe jądro (sklep z dorosłym obok, biblioteka) przechodzi do przepisanego **„Pierwsze słowo”** (sekcja 8).

### 2.8 `pierwszy-raz` — poprawka

**Godność/WB:** `stol` „Spróbuj potrawy, której zawsze odmawiasz” (`:312`) i `przyklad` „Spróbowałem oliwek. Dziwne, ale zjadłem trzy.” (`:301`) — jedzenie pod presją, temat diety wykluczony regułą; `dowod` „jak Ci się podobało” (`:300`) to ocena przeżycia. **Wykluczenie:** `dwor` „sport, którego nie znasz” zakłada sprzęt i towarzystwo. **WB:** autonomia (wybrałem nowość) — zostaje, gdy nowość jest neutralna.

Gotowe zdania: `dowod`: „Napisz jedno zdanie, co to było, albo zrób zdjęcie tej rzeczy.” · `przyklad`: „{Usiadłem|Usiadłam} przy stole na drugim krześle. Wszystko wygląda z tej strony inaczej.” · `miejsca.stol.opis` → „Usiądź przy stole inaczej niż zawsze — choćby na drugim krześle.” · `miejsca.dwor.opis` → „Spróbuj skoku albo rzutu, którego jeszcze nie {próbowałeś|próbowałaś}.” · `miejsca.pokoj` zostaje · `miejsca.ksiazka.opis` → „Otwórz książkę, po którą nigdy nie sięgasz, i obejrzyj jedną stronę.” · `minimum`: „Jedna rzecz zrobiona inaczej niż zawsze — i tak się liczy.” · `rozmowa`: „Co się okazało inne, niż się wydawało?” · `competency_focus: ["LD"]` · `reakcja_swiata`: „kwiat w nowym miejscu przy ścieżce, tam, gdzie lisek jeszcze nie był (`kwiaty.posadz`, istnieje)”. · `warianty["1-3"]`: `cel` „Zrób dziś jedną rzecz inaczej niż zawsze.\nPierwszy raz.” · `jak` „Wybierz jedną rzecz z listy miejsc i spróbuj naprawdę.” · `etap: "oba"`

### 2.9 `do-samego-konca` — poprawka

**Godność:** `jak` „nie wstawaj, aż będzie skończona” (`:340`) to presja i brak wersji na gorszy dzień. **Bezpieczeństwo/wykluczenie:** `dwor` „Dojedź rowerem trasę do samego końca” (`:372`) zakłada rower i samodzielne wyjście; `szafa` „Dokończ porządek” (`:366`) to obowiązek. **Polecenie:** „Dokończ” + „nie wstawaj” — dwa. **WB:** kompetencja (domknięcie) — dobra.

Gotowe zdania: `jak`: „Znajdź jedną zaczętą rzecz i rób ją, aż będzie skończona albo aż ktoś cię zawoła.” · `cel`: „Dokończ dziś coś, co kiedyś {przerwałeś|przerwałaś}.\nDo samego końca.” · `przyklad`: „{Dokończyłem|Dokończyłam} puzzle, które leżały od tygodnia.” · `miejsca.szafa` → `kartka`: „Dokończ rysunek albo samolot, który leży niedokończony.” · `miejsca.dwor.opis` → „Z kimś dorosłym dojdźcie do końca ścieżki, którą zwykle skracacie.” · `minimum`: „Rzecz posunięta o jeden krok dalej niż była — i tak się liczy.” · `rozmowa`: „Co było w tym ostatnim kawałku najtrudniejsze?” · `competency_focus: ["ST"]` · `reakcja_swiata`: „na placu budowy (`ustawPlacBudowy`, istnieje) pierścień „tu czegoś brakuje” gaśnie o jeden segment — koszt niski, jeśli pierścień da się rysować częściowo; inaczej: kwiat pod drabinką (istnieje)”. · `warianty["1-3"]`: `cel` „Dokończ dziś coś, co leży zaczęte.\nDo końca.” · `jak` „Weź puzzle albo rysunek, który leży, i rób go, aż ktoś cię zawoła.” · `etap: "oba"`

### 2.10 `siedem-razy` — poprawka (werdykt potwierdzony)

**Wykluczenie/wiek:** `biurko` „Napisz najtrudniejszą literę siedem razy” (`:407`) to praca domowa; `pokoj` „Zagraj tę samą melodię” (`:401`) zakłada instrument. **Wykonalność:** `dowod` „Nagraj albo opisz” (`:383`) — panel przyjmuje tylko obraz (`ZadaniePanel.jsx:317`). Jądro („aż policzysz do siedmiu”, „która próba była najlepsza”) jest dobre: sufit zamknięty, porażka wpisana. **WB:** kompetencja.

Gotowe zdania: `dowod`: „Napisz, która próba była najlepsza, albo zrób zdjęcie tego, co {ćwiczyłeś|ćwiczyłaś}.” · `przyklad`: „{Rzucałem|Rzucałam} skarpetką do kosza na pranie. Pierwszy raz pudło, siódmy wpadł!” · `miejsca.biurko.opis` → „Składaj samolot z kartki, aż poleci prosto.” · `miejsca.pokoj.opis` → „Rzucaj zwiniętą skarpetką do kosza na pranie.” · `minimum`: „Trzy próby zamiast siedmiu — i tak się liczy.” · `rozmowa`: „Co zmieniło się między pierwszą a siódmą próbą?” · `competency_focus: ["LD","ST"]` · `reakcja_swiata`: „kwiat przy choince (`kwiaty.posadz`, istnieje) — droga z kamieni należy do hybrydy LD z `05`”. · `warianty["1-3"]`: `cel` „Powtórz dziś jedną rzecz\nsiedem razy.” · `jak` „Rzucaj skarpetką do kosza i licz na palcach do siedmiu.” · `etap: "oba"`

---

## 3. Biblioteka Mentora (276 zadań `kind: task`)

### 3.1 Wzorce — tabela zbiorcza (`pomiar-B.py`)

| # | wzór | liczba | % | DT | EM | ST | KR | LD | MD |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | liczebnik (cyfra lub słowny) w tytule/treści | 155 | 56% | | | | | | |
| 1a | — w tym cyfra | 37 | 13% | 8 | 7 | 5 | 7 | 3 | 7 |
| 2 | „zbierz / znajdź / policz / wymień N” | 44 | 16% | 5 | 5 | 12 | 14 | 1 | 7 |
| 3 | rysowanie jako rdzeń | 39 | 14% | 3 | 6 | 12 | 12 | 3 | 3 |
| 4 | „zapytaj / poproś / opowiedz dorosłemu” | 9 | 3% | 2 | 1 | 0 | 2 | 4 | 0 |
| 5 | uczucia jako dowód („jak się czułeś”) | 6 | 2% | 1 | 0 | 1 | 1 | 1 | 2 |
| 6 | czeka na kłótnię / smutek / złość | 11 | 4% | 0 | 2 | 2 | 1 | 4 | 2 |
| 6a | zdanie warunkowe „gdy / jeśli ktoś…” | 22 | 8% | | | | | | |
| 7 | wiele dni / „jutro” / „przez tydzień / 30 dni” | 11 | 4% | 2 | 1 | 6 | 0 | 1 | 1 |
| 8 | zakłada zwierzaka / ogród / balkon / rodzeństwo | 14 | 5% | 0 | 6 | 0 | 7 | 1 | 0 |
| 9 | rówieśnik nazwany jako partner | 11 | 4% | 0 | 7 | 0 | 0 | 4 | 0 |
| 10 | ruch jako rdzeń | 16 | 6% | 1 | 4 | 6 | 1 | 3 | 1 |
| 11 | sen / przed snem | 8 | 3% | 0 | 2 | 4 | 1 | 0 | 1 |
| 12 | obowiązki domowe | 4 | 1% | 0 | 1 | 2 | 0 | 1 | 0 |
| 13 | afirmacja / zdanie o sobie | 17 | 6% | 0 | 3 | 4 | 7 | 1 | 2 |
| 14 | etykieta profilu w tekście („Myśliciel wie”, „Śmiałek”) | 50 | 18% | 3 | 5 | 26 | 0 | 16 | 0 |
| 15 | zdjęcie jako jedyny dowód | 22 | 8% | 2 | 3 | 8 | 8 | 0 | 1 |
| 16 | tokeny rodzaju obecne | 11 | 4% | 1 | 0 | 0 | 0 | 6 | 4 |
| 17 | forma męska bez tokenu | 228 | 83% | 20 | 41 | 58 | 33 | 41 | 35 |
| 18 | „musisz / powinieneś / pamiętaj” | 7 | 3% | 1 | 3 | 1 | 0 | 1 | 1 |
| 19 | zakup / druk / pieniądze | 6 | 2% | 0 | 1 | 3 | 0 | 1 | 1 |
| 20 | nóż / ogień / kuchenka (wszystkie „z dorosłym”) | 5 | 2% | 2 | 0 | 1 | 1 | 1 | 0 |

Interpretacja: co drugie zadanie prowadzi liczebnikiem, a nie odkryciem; rysowanie to główne narzędzie ST i KR; ruch to 6% całości (LD, profil „Odwaga”, ma 3 zadania ruchowe na 43); rówieśnik jako partner prawie nie istnieje (partnerem jest dorosły z domu); etykieta profilu jest w co czwartym zadaniu ST i co trzecim LD; forma męska bez tokenu jest normą (83%) — połowa odbiorców czyta o kimś innym.

### 3.2 Werdykt „wyciąć” — 47 zadań

| id | powód (jedno zdanie) |
|---|---|
| DT-TASK-019 | oglądanie twarzy obcych przechodniów — dla 4–8 obciach, dla 1–3 wpatrywanie się w obcych. |
| DT-TASK-031 | boso na dworze — szkło, niedopałki; bezpieczeństwo. |
| EM-TASK-001 | rozśmieszanie trzech domowników — praca emocjonalna za dorosłych, z liczbą. |
| EM-TASK-003 | „zapytaj, jak się czujesz… powiedz, że ją rozumiesz” — wymuszone zwierzenia obu stron, dziecko jako pocieszyciel. |
| EM-TASK-004 | mapa własnych uczuć jako zdjęcie dla dorosłego — uczucia jako dowód. |
| EM-TASK-008 | zakłada zwierzaka; maskotka jako „wersja gorsza” i infantylna dla 4–8. |
| EM-TASK-019 | „nikomu nie musisz pokazywać” + dowód „zdjęcie rysunku” emocji — sprzeczność, uczucia jako dowód. |
| EM-TASK-020 | skrypt intymności „dziękuję, że jesteś” + „zobacz, co się dzieje z jej oczami”. |
| EM-TASK-021 | „a tak naprawdę?” — dziecko wyciąga z dorosłych ukryte emocje. |
| EM-TASK-022 | przytulenie z bliskim jako zadanie — zakłada bezpieczny dom; dla części dzieci trafienie w czuły punkt. |
| EM-TASK-023 | afirmacja „jestem dobry, bo…” zamiast czynności; etykieta „Przyjaciel”. |
| EM-TASK-025 | „Świetlik” spoza kanonu, afirmacja bez czynności. |
| EM-TASK-031 | „Twoja ćma świetlna” — obiekt, którego nie ma; brak czynności. |
| EM-TASK-032 | „Twoja wrażliwość to nie słabość” — moralizowanie bez czynności, etykietuje. |
| EM-TASK-036 | „jesteś osobą, która przynosi uśmiech” — praca emocjonalna, duplikat EM-001. |
| EM-TASK-037 | „powtórz: jestem bezpieczna” — afirmacja, dla dziecka z niebezpiecznego domu szkodliwa. |
| EM-TASK-039 | pochwała samego siebie na zawołanie — afirmacja zamiast czynności. |
| EM-TASK-043 | „dziękuję, że jesteś dla mnie” do dorosłego — skrypt zwierzenia, zakłada bezpiecznego dorosłego. |
| EM-TASK-044 | wizualizacja „Świetlika” i obietnica „dzień będzie spokojny” — bez czynności, obietnica efektu. |
| ST-TASK-001 | plan poranka z „musisz” — obowiązki w kostiumie, przygotowanie na jutro. |
| ST-TASK-007 | lista zakupów — obowiązek domowy, zakupy. |
| ST-TASK-011 | „poproś dziecko, by narysowało” — tekst do rodzica, nie do dziecka. |
| ST-TASK-020 | „umyć się, ubrać, zjeść… odhacz” — tablica obowiązków. |
| ST-TASK-028 | trzy dania z deserem — zakłada obiad, którego w wielu domach nie ma; sygnał statusu. |
| ST-TASK-037 | „połowa miesięcznej wędrówki” — zakłada nieistniejący cykl 30 dni. |
| ST-TASK-039 | „lista TODO i trzy odhaczenia” — praca w przebraniu. |
| ST-TASK-052 | kompas w klatce piersiowej — wyobrażenie bez czynności. |
| ST-TASK-053 | rysunek jutrzejszego poranka (obudzenie, śniadanie, wyjście) — obowiązki na jutro. |
| ST-TASK-058 | mapa uczuć z kropką — uczucia jako dowód. |
| ST-TASK-059 | „powtórz to, czego się uczysz, trzy razy” — szkoła w przebraniu. |
| ST-TASK-060 | „licz od dwa do dwudziestu po dwa” — matematyka w przebraniu. |
| ST-TASK-062 | „posprzątaj biurko w czterech krokach” + morał o porządku w środku. |
| ST-TASK-063 | „zostały dwa dni wędrówki” — cykl 30 dni. |
| KR-TASK-046 | „otwórz skarbnicę” — ekran, którego nie ma. |
| LD-TASK-003 | „znajdź kogoś smutnego i powiedz: dasz radę” — czeka na cudzy smutek, praca emocjonalna. |
| LD-TASK-004 | „jestem Śmiałkiem, dam radę!” do lustra — etykieta, afirmacja, nagranie niemożliwe do wysłania. |
| LD-TASK-006 | wstać o dziesięć minut wcześniej — sen, przygotowanie na jutro, dla 1–3 budzi rodziców. |
| LD-TASK-008 | „powiedz dorosłemu, co cię martwi, zacznij od czuję, że…” — wymuszone zwierzenie do dorosłego. |
| LD-TASK-023 | „powiedz o strachu zaufanej osobie” — intymność wysyłana Mentorowi jako dowód. |
| LD-TASK-035 | „jeśli pokłócisz się… powiedz: chcę, żebyśmy się dogadali” — czeka na kłótnię, dziecko naprawia relacje. |
| LD-TASK-040 | „Posłuchaj, mały Śmiałku…” — etykieta i morał bez czynności. |
| LD-TASK-042 | „dasz radę” do lustra — afirmacja zamiast czynności. |
| LD-TASK-043 | „uczę się być odważny z troski, nie z pychy” — cykl 30 dni, gotowe zdanie do wygłoszenia. |
| MD-TASK-016 | „a Ty co czujesz?” — dziecko wyciąga uczucia z innych. |
| MD-TASK-025 | czeka, aż ktoś zwierzy się z czegoś trudnego — wyzwalacz, którego dziecko nie kontroluje. |
| MD-TASK-036 | „gdy ktoś się zdenerwuje, zostań spokojny” — dziecko reguluje dorosłych. |
| MD-TASK-040 | „przez te 30 dni” — cykl, którego nie ma. |

### 3.3 Werdykt „przepisać” — 29 zadań

| id | co zostaje, co się zmienia |
|---|---|
| DT-TASK-002 | pięć minut liczenia trzech kategorii i „zapisz liczby” → „Okno na minutę” z banku epok: jedna minuta, jedna rzecz, która się ruszała. |
| DT-TASK-007 | trzy dni pogody → jeden dzień: rano i po południu, co się zmieniło. |
| DT-TASK-032 | „jutro sprawdź” → „Tam i z powrotem” (bank epok): w drodze tam zapamiętaj, w drodze z powrotem sprawdź. |
| DT-TASK-033 | „czego nauczyłeś się w tym miesiącu” → naucz kogoś jednej sztuczki obserwacji z dzisiaj. |
| EM-TASK-007 | słoik przez trzy dni + „pokaż rodzinie” → jedna karteczka, jedna osoba, dziś, bez pokazu. |
| EM-TASK-012 | „ktoś wygląda inaczej… podejdź” (wyzwalacz) → gest dla kogoś, kto siedzi z boku; wersja „nikt nie siedzi z boku” liczy się. |
| EM-TASK-014 | gotowe zdanie „jestem szczęśliwa, że jesteś” → własne jedno zdanie o rzeczy, nie o uczuciu („dzięki za wczorajszą herbatę”). |
| EM-TASK-029 | czeka na smutek → „Obok” (bank epok): obok kogoś, kto jest sam, bez słów; minimum obok dorosłego, który coś robi w ciszy. |
| EM-TASK-034 | serce z napisem „twoje serce jest dobre” → dla 1–3 rysunek-prezent bez napisu o osobie; dla 4–8 wyciąć (obciach). |
| ST-TASK-018 | „od czego zacząć jutro” → „Pierwszy kamień”: jedna rzecz, którą zaczynasz dziś w ciągu minuty od decyzji. |
| ST-TASK-022 | „co jutro zrobisz inaczej” (refleksja na zawołanie) → „Drugie podejście”: wróć dziś do czegoś, co nie wyszło, zmień jedno. |
| ST-TASK-045 | plan sześćdziesięciu minut ruchu → ruch, nie plan: schody zamiast windy albo przystanek dalej pieszo z dorosłym. |
| ST-TASK-051 | „wróć jutro o tej porze” → „Połowa teraz”: połowa dziś, druga po obiedzie. |
| ST-TASK-057 | „co jutro przeniosę” → „co z dzisiaj zostawiam na miejscu, żeby jutro tam było” — rzecz, nie postanowienie. |
| ST-TASK-065 | „lepiej niż miesiąc temu” (porównanie z własnym wczoraj, cykl) → jedna rzecz, którą dziś umiesz pokazać komuś. |
| KR-TASK-005 | piosenka + „zaśpiewaj komuś” → piosenka na trzy linijki, dowodem tekst; śpiewanie tylko jeśli chcesz. |
| KR-TASK-010 | taniec, „niech ktoś zgadnie” → taniec-opowieść solo, dowodem trzy nazwy „kim byłem”. |
| KR-TASK-029 | „słowo na to, co czujesz” + dowód „z kim rozmawiałeś” → nowe słowo na dzisiejszą pogodę albo kolor za oknem. |
| KR-TASK-049 | „w tym miesiącu” → pokaż jedną rzecz zrobioną własnymi rękami w tym tygodniu. |
| LD-TASK-017 | „łącznie tyle, ile dasz radę” (bez sufitu) → jeden zamknięty ruch: schody na swoje piętro bez windy, dwa razy. |
| LD-TASK-020 | dziecko interweniuje, gdy ktoś mówi brzydko → zostaje tylko bezpieczna część: „powiedz dorosłemu, któremu ufasz”; wersja bez zdarzenia: nazwij jednego takiego dorosłego. |
| LD-TASK-021 | czeka na własny błąd + „Śmiałkowie… najsilniejsi” → „Naprawiacz”: napraw dziś jedną rzecz, którą ktoś (albo Ty) zepsuł — bez etykiety. |
| LD-TASK-022 | „Mały Śmiałku, nie musisz prowadzić” → bez etykiety: „Zacznij dziś od jednej cichej rzeczy, którą lubisz, i skończ ją.” |
| LD-TASK-025 | „Śmiałek dba o dorosłych” → pytanie o rzecz, nie o samopoczucie: „co dziś się zepsuło albo naprawiło w tym, co robisz?”. |
| LD-TASK-030 | wyzwalacz „jeśli ktoś namawia” → „Nie, dziękuję” (bank epok) z wersją „nikt nie namawiał — powiedz nie jednej rzeczy z rozpędu”. |
| LD-TASK-031 | czeka na wypadek → „Cichy ratunek”: zauważ, komu coś nie wychodzi, podejdź bez pytania; minimum bez zdarzenia. |
| LD-TASK-034 | „ja tak czuję, gdy…” (komunikat o emocjach na zawołanie) → prośba w dwóch częściach: „chcę…, bo…” — o rzecz, nie o uczucie. |
| MD-TASK-009 | trzydzieści klocków według instrukcji / puzzle, dowód tylko zdjęcie → „Jedna rzecz naraz”: jedna zaczęta rzecz do końca, dowód zdjęcie albo zdanie. |
| MD-TASK-026 | „gdy zrobi się nerwowo” (wyzwalacz) → krok w tył i długi wydech jako ćwiczenie na spokojnie, z wersją „nic się nie działo — i tak się liczy”. |

### 3.4 Poprawki globalne (bez imiennej listy)

- **50 etykiet profilu** („Myśliciel wie”, „Śmiałek robi”, „Lupa Odkrywcy”, „Kreator”, „Empata”, „Strateg”, „Lider”) — zdanie z etykietą wyciąć w całości; treść zadania nie traci nic (np. ST-TASK-012 bez „Myśliciel wie, że nawet proste rzeczy mają mapę” jest tym samym zadaniem).
- **228 form męskich** — tokeny `{m|ż}` w `body` i `proof_hint`; `proof_hint` domyślny „Krótko opisz albo wyślij zdjęcie tego, co zrobiłeś.” występuje ok. 170 razy i wystarczy poprawić raz w skrypcie migracji.
- **22 dowody „tylko zdjęcie”** — dopisać drugą drogę „albo jedno zdanie”.
- Dowody „jak się czułeś” (MD-001, MD-006, DT-013, ST-031, KR-029, LD-038) — zamienić na rzecz: „ile razy”, „co się zmieniło”, „gdzie to było”.
- „Wizkor mówi:” w 16 zadaniach ST — Wizkor nie cytuje siebie w trzeciej osobie; usunąć wstęp albo przepisać w pierwszej osobie.
- Zadania z wieczorną refleksją na zawołanie (ST-014, ST-027, ST-031, ST-044, ST-061) — zostają dla 4–8 jako „porozmawiaj”, dla 1–3 filtr `etap` je pomija.

Zestawienie: **wyciąć 47 · przepisać 29 · poprawka globalna ~200 · zostaje bez zmian ok. 30** (te, które nie mają etykiety, mają token albo neutralną formę, dwie drogi dowodu i czynność z końcem — np. MD-TASK-013, MD-TASK-022, MD-TASK-027, KR-TASK-016, KR-TASK-024, DT-TASK-030, ST-TASK-042).

---

## 4. Balans bazy według `potrzeba` i pozostałych wymiarów

Pole `potrzeba` (jedna wartość na zadanie, ta, którą zadanie karmi najmocniej): `autonomia` (mój wybór, po swojemu) · `kompetencja` (umiem, sprawdziłem, domknąłem) · `relacja` (jestem z kimś, ktoś jest ze mną) · `regulacja` (spokój, oddech, czekanie) · `ruch` (ciało) · `uwaznosc` (zauważam) · `sprawczosc` (coś powstało, bo ja) · `troska` (o kogoś, o rzecz, o miejsce).

### 4.1 Dziesięć zadań Wizkora — klasyfikacja ręczna

| id | oś | potrzeba | kształt | solo / z kimś | dom / dwór | min |
|---|---|---|---|---|---|---:|
| lowca-pytan | ciekawość | kompetencja | porozmawiaj | z kimś (albo książka) | dom | 15 |
| zwiadowca-podworka | ciekawość | uważność | zauważ | solo | dwór (blok: dom) | 15 |
| cos-z-niczego | tworzenie | sprawczość | zrób | solo | dom | 20 |
| warsztat-wynalazcy | tworzenie | sprawczość | zrób | solo | dom | 20 |
| ramie-w-ramie | współpraca | relacja | zrób (z kimś) | z kimś | dom / dwór | 20 |
| mistrz-instrukcji | współpraca | kompetencja | porozmawiaj | z kimś | dom | 15 |
| jeden-krok-dalej | odwaga | sprawczość | odważ się | z kimś / widownia | dom / sklep | 10 |
| pierwszy-raz | odwaga | autonomia | odważ się | solo | dom | 10 |
| do-samego-konca | wytrwałość | kompetencja | wytrzymaj | solo | dom | 20 |
| siedem-razy | wytrwałość | kompetencja | wytrzymaj | solo | dom / dwór | 15 |

| wymiar | rozkład PRZED (10 zadań Wizkora) |
|---|---|
| potrzeba | kompetencja 4 · sprawczość 3 · uważność 1 · relacja 1 · autonomia 1 · **regulacja 0 · ruch 0 · troska 0** |
| oś | po 2 na oś (z założenia koła) |
| kształt | zrób 3 · porozmawiaj 2 · odważ się 2 · wytrzymaj 2 · zauważ 1 · **podaruj 0** |
| solo / z kimś | solo 6 · z kimś 4 |
| dom / dwór | dom 8 · dwór jako pełnoprawne miejsce 2 |
| minuty | 10 → 2 · 15 → 4 · 20 → 4 |
| tryb startu | inicjowanie 10 · odpowiadanie 0 · zaproszenie 0 · obserwowanie 0 (potwierdzone z `docs/ANALIZA_I_ROZGRYWKA.md` §3) |

### 4.2 Biblioteka Mentora — klasyfikacja słownikowa (`pomiar-B-balans.py`, n = 276)

Heurystyka: pierwszy pasujący wzorzec w ustalonej kolejności; margines błędu kilkanaście procent, ale proporcje są czytelne.

| potrzeba | liczba | % | | kształt | liczba | % |
|---|---:|---:|---|---|---:|---:|
| sprawczość | 78 | 28% | | zrób | 82 | 30% |
| uważność | 56 | 20% | | wytrzymaj | 51 | 18% |
| kompetencja | 41 | 15% | | odważ się | 39 | 14% |
| regulacja | 33 | 12% | | porozmawiaj | 36 | 13% |
| troska | 28 | 10% | | zauważ | 35 | 13% |
| relacja | 26 | 9% | | podaruj | 33 | 12% |
| ruch | 11 | 4% | | | | |
| autonomia | 3 | 1% | | | | |

| wymiar | rozkład |
|---|---|
| solo / z kimś | solo 158 (57%) · z kimś 118 (43%) — „z kimś” prawie zawsze znaczy „z dorosłym z domu” |
| dom / dwór | dom 240 (87%) · poza domem 36 (13%); klatka 0, autobus 0, świetlica 0 (zgodnie z `MOTYWY_Z_EPOK.md` §2) |
| czas (`estimated_minutes` liczone w `cycles.js:67` z `points_reward × 0,9`) | 22 min → 184 (67%) · 27 → 72 · 32 → 10 · 18 → 9 · 36 → 1 — **żadne nie ma 10 minut**, bo minuty są pochodną monet |
| oś (profil → najbliższa oś, `agents/world/archetypes.md`) | wytrwałość 105 (ST+MD) · tworzenie 49 · współpraca 46 · odwaga 43 · ciekawość 33 |

Wniosek dla doboru: baza jest przechylona na „zrób i pokaż” (sprawczość + zrób ≈ 30%), ruch i autonomia prawie nie istnieją, „troska” to głównie gesty słowne do dorosłych, a nie troska o rzecz czy miejsce. Regulacja (12%) siedzi prawie w całości w MD i ST — dziecko z profilem LD nigdy jej nie dostanie, bo `pickSeedMission` (`cycles.js:79–81`) losuje tylko z profilu.

---

## 5. Co znaczy „głupie zadanie” — mechanizmy i osiem kryteriów

### 5.1 Siedem mechanizmów (każdy z cytatem z repo)

**1. Pusty czasownik bez zwrotu akcji.** Czynność bez ograniczenia, którego dziecko samo nie sprawdzi — nie wie, kiedy skończyło, i nie ma czego opowiedzieć.
— „Zrób dziś coś własnymi rękami.\nOd początku do końca.” (`zadania-wizkora.v1.json:91`)
— „Zrób dziś coś, czego jeszcze nigdy nie robiłeś. Zaśpiewaj głośno, naucz się nowego słowa, spróbuj stanąć na jednej nodze…” (`mentorTaskLibrary.js`, LD-TASK-002)

**2. Liczba zamiast odkrycia.** Liczebnik udaje ograniczenie, ale zadaniem staje się liczenie, a nie to, co miało być zauważone. 155 z 276 zadań biblioteki prowadzi liczebnikiem.
— „Policz ile ptaków przeleci, ile aut przejedzie, ilu ludzi minie Twój dom. Zapisz trzy liczby” (DT-TASK-002)
— „Wypij szklankę wody dokładnie trzema łykami. Policz na głos.” (ST-TASK-038)

**3. Obowiązek w kostiumie.** Rzecz, o którą rodzic i tak prosi, z dopisanym tytułem misji. Dziecko wynosi „znowu sprzątanie”.
— „Posprzątajcie razem: jedno zbiera, drugie odkłada.” (`zadania-wizkora.v1.json:194`); „Nieś część siatek i pilnuj listy.” (`:206`)
— „Wieczorem narysuj plan jutrzejszego poranka: 5 rzeczy które musisz zrobić w kolejności. Mycie zębów, ubranie, śniadanie, plecak, buty.” (ST-TASK-001)

**4. Afirmacja zamiast czynności.** Zdanie do powtórzenia zamiast rzeczy do zrobienia; nie ma śladu, nie ma reakcji świata, a dla dziecka w trudnej sytuacji bywa kłamstwem.
— „Stań przed lustrem i powiedz głośno: „jestem Śmiałkiem, dam radę!" Powtórz 3 razy” (LD-TASK-004)
— „Połóż dłoń na poduszce i powtórz w głowie trzy razy: „jestem bezpieczna" / „jestem bezpieczny".” (EM-TASK-037)

**5. Uczucia jako dowód.** Ślad, który ma pokazać wnętrze dziecka dorosłemu, którego zna słabo — zamiast rzeczy, którą zrobiło.
— „Napisz Mentorowi, co to było i jak się czułeś, albo zrób zdjęcie.” (`zadania-wizkora.v1.json:259`)
— „Narysuj na kartce 4 buźki… Pod każdą napisz… co dziś sprawiło, że poczułeś to uczucie.” + „Zdjęcie mapy uczuć.” (EM-TASK-004)

**6. Zadanie czekające na kłótnię, smutek albo wypadek.** Wyzwalacz, którego dziecko nie kontroluje; w spokojny dzień zadania nie da się zrobić, w zły dzień robi z dziecka mediatora.
— „Jeśli pokłócisz się dziś z kimś, zamiast próbować „wygrać", spróbuj „naprawić".” (LD-TASK-035)
— „Gdy ktoś koło Ciebie się zdenerwuje, spróbuj zostać spokojna/spokojny.” (MD-TASK-036)

**7. Szkoła w przebraniu i brak konsekwencji w świecie.** Notatki, listy, powtórki, litery — a na końcu monety, nie zmiana świata, więc dziecko uczy się, że nagroda jest atrapą.
— „Napisz najtrudniejszą literę siedem razy.” (`zadania-wizkora.v1.json:407`); „Spójrz, co dziś zrobiłeś. Napisz krótką listę i odhacz trzy rzeczy.” (ST-TASK-039)
— „Mentor przyjął Twoje zadanie” + „+{stan.nagroda} monet” + „Odbieram nagrodę!” (`ZadaniePanel.jsx:246–251`) — jedyna konsekwencja działania w realu to licznik.

### 5.2 Osiem kryteriów jakości — każde z parą „przed → po” z bazy

| # | kryterium | przed (repo) | po |
|---|---|---|---|
| 1 | **Ograniczenie, które dziecko samo sprawdzi** (liczba rzeczy, zakaz, kolejność, brak — nie „jak najwięcej”) | „Zrób dziś coś własnymi rękami. Od początku do końca.” (`cos-z-niczego`) | „Weź trzy rzeczy, które do siebie nie pasują.\nZrób z nich jedną, która do czegoś służy.” (sekcja 8) |
| 2 | **Wynik nieznany z góry, ale bez możliwości oblania** | „Pokaż ją krok po kroku, aż druga osoba zrobi to sama.” (`mistrz-instrukcji`, `:216`) | „…pokaż ją komuś krok po kroku.” + `minimum`: „Pokazane raz, choćby druga osoba tylko patrzyła — i tak się liczy.” |
| 3 | **Nazwana potrzeba** (pole `potrzeba`; projektant wie, po co to jest) | `competency_focus: ["MD"]` przy zadaniu o ciekawości (`lowca-pytan`, `:17`) | `potrzeba: "kompetencja"`, `competency_focus: ["DT"]` |
| 4 | **Konkretna reakcja świata** związana z treścią | „+25 monet od Mentora” (`ZadaniePanel.jsx:200`) | „przy drabince domku na drzewie wyrasta kwiat” (`kwiaty.posadz`, istnieje) — po zadaniu „naucz kogoś” |
| 5 | **Ślad o rzeczy, nigdy o uczuciach** | „Napisz Mentorowi, co to było i jak się czułeś” (`:259`) | „Napisz, komu {powiedziałeś|powiedziałaś} pierwsze słowo — bez nazwiska — albo zrób zdjęcie miejsca, gdzie to było.” |
| 6 | **Wersja na gorszy dzień i miejsce w bloku** | `ramie-w-ramie`: kuchnia z dorosłym, pokój, ogród/rower, zakupy — zero ratunku (`:185–207`) | `na-zmiane`: świetlica/przerwa z rówieśnikiem, dywan, kuchnia, dwór; `minimum`: „Trzy rzeczy dołożone na zmianę — i tak się liczy.” |
| 7 | **Dwa progi wieku** (`etap`: 1–3 mniej tekstu i konkret, 4–8 bez infantylizmu i bez widowni) | „Powiedz na głos wierszyk albo zaśpiewaj przy rodzinie.” (`:271`) dla wszystkich | 1–3: „Powiedz „dzień dobry” sąsiadowi na klatce, zanim on powie.”; 4–8: „…komuś, kogo znasz tylko z widzenia, patrząc w oczy.” |
| 8 | **Pytanie do rozmowy dla Mentora** zamiast werdyktu | „Mentor prosi o poprawkę” / „Sprawdzane” (`zadanieWizkora.js:54,58`) | `rozmowa`: „Który szczegół zniknął, zanim {wróciłeś|wróciłaś}?” — Mentor zauważa i pyta, nie ocenia |

Kryteria 1, 2 i 5 rozstrzygają najwięcej: jeśli zadanie ma sprawdzalne ograniczenie, nie da się go oblać i ślad jest o rzeczy, to prawie zawsze przechodzi też testy godności i wieku.

---

## 6. Dopasowanie do profilu bez etykiety

### 6.1 Tabela — punkt wyjścia z promptu, potwierdzony i poprawiony

| profil | tryb startu | solo / z kimś | ciało | jak Wizkor ramuje | zmiana wobec promptu |
|---|---|---|---|---|---|
| DT Ciekawość | zagadka ze świata (obserwowanie → sprawdzenie) | solo; drugie zadanie w trybie **zaproszenia** („naucz mnie”) | obserwacja → sprawdzenie | „Nie wiem, co to. Sprawdzisz?” | dopisany drugi tryb, żeby DT nie było tylko patrzeniem |
| EM Życzliwość | ktoś lub coś w świecie czegoś potrzebuje (**odpowiadanie**) | z kimś, **bez widowni i bez słów**; partnerem może być rówieśnik | drobny gest, obecność | „Lisek coś zauważył… tego nie zrobię magią.” | potwierdzone; dopisane „rówieśnik jako partner”, bo baza ma go 2 na 276 |
| ST Mądrość | problem z ograniczeniem (**inicjowanie**) | solo | plan → test → poprawka | „Nie umiem tego policzyć.” | potwierdzone; ST dostaje też jedno zadanie o czekaniu (regulacja), bo „wytrwałość” w bazie to głównie plan |
| KR Kreatywność | brak do wypełnienia (**inicjowanie**) | solo | ręce | „Tu czegoś nie ma. Z czego to zrobić?” | dopisane: ograniczenie materiału zamiast „zrób cokolwiek”; „celowo brzydko” zdejmuje presję oryginalności |
| LD Odwaga | wyzwanie ruchowe **z wpisaną porażką** | solo | ruch | „Założę się, że nie da się…” | potwierdzone; drugi tryb: „drugie podejście” — próba liczy się, bo się zaczęła |
| MD Skupienie | cisza z wyraźnym końcem (**obserwowanie**) | solo | wyciszenie, powolny ruch | „Lisek nie może się zatrzymać… pokażesz mu, jak?” | poprawka: ramka o zasypianiu z promptu („Lisek nie może zasnąć”) zamieniona na zatrzymanie — sen wykluczony jako temat |

Zasada z `archetypes.md`: profil zmienia **wejście**, nie głos i nie świat. Wizkor mówi to samo zdanie o świecie każdemu dziecku; różni się to, od czego zaczyna się działanie i czy ktoś jest obok.

### 6.2 Zasady doboru (do wdrożenia zamiast `KoloFortuny.jsx:114` w pierwszym tygodniu)

1. **Profil kształtuje pierwsze dwa–trzy zadania.** Zadanie 1 i 2 z pary profilu (sekcja 7), zadanie 3 z osi o najniższym liczniku `sygnaly` (`docs/TEST_OBRAZKOWY.md` §9 pkt 4). Od zadania 4 losuje Koło.
2. **Sygnały z wyborów ważą więcej niż test.** Zapisywać wybór `miejsca` (`ZadaniePanel.jsx:37` dziś tylko w `useState`) jako `+1` do typu (podwórko/ruch → LD, stół/ręce → KR, z kimś → EM, cisza → MD, sprawdzenie → DT, plan → ST); zamknięte zadanie `+2` do jego `potrzeba`/osi, nie do profilu z testu.
3. **Jedno pole dzikie.** Koło zawsze ma jedno pole spoza dwóch najczęstszych osi dziecka; przy puli z sekcji 7 (22 zadania) losowanie idzie z kolejki bez powtórek (`ANALIZA_I_ROZGRYWKA.md` §5).
4. **Profil nigdy nie blokuje osi.** Filtr `profile ===` z `cycles.js:79–81` do zdjęcia; profil to **kolejność**, nie zbiór. Dziecko EM dostaje zadanie ruchowe w tygodniu drugim, dziecko LD zadanie o ciszy.
5. **Punkty nie idą do archetypu z testu.** `cycles.js:274–277` i `mentor.js:134–135` dopisują do `player.archetype` niezależnie od treści — do zamiany na `competency_focus` zadania (albo na `potrzeba`), inaczej test staje się samospełniającą się etykietą.
6. **Etykieta nie pada w tekście.** Ani nazwa profilu, ani „zadanie dobrane dla Odkrywcy”. Wizkor ramuje sytuacją w świecie („Nie wiem, co to”), nie cechą dziecka.
7. **Etap szkolny filtruje przed profilem.** `etap` zadania i `etap` miejsca (`"1-3" | "4-8" | "oba"`); dla 1–3 karta pokazuje `cel` + `przyklad`, `jak` czyta lektor.

### 6.3 Mapowanie sześciu profili na pięć osi (propozycja do `06`)

| profil | oś główna | oś druga | dlaczego |
|---|---|---|---|
| DT | ciekawosc | wytrwalosc | „sprawdź do końca” domyka ciekawość |
| KR | tworzenie | ciekawosc | tworzenie zaczyna się od braku, który trzeba zauważyć |
| LD | odwaga | wytrwalosc | próba, która liczy się, bo się zaczęła → drugie podejście |
| EM | wspolpraca | odwaga | gest dla kogoś wymaga pierwszego kroku |
| ST | wytrwalosc | tworzenie | plan → test → poprawka to wytrwałość z rękami |
| MD | wytrwalosc (regulacja) | ciekawosc | cisza z końcem to wytrzymanie; zauważanie to ciekawość |

Rekomendacja: **nie dodawać szóstej osi**. EM, ST i MD wchodzą pod istniejące osie różnym **kształtem** (podaruj / wytrzymaj / zauważ), a `potrzeba` niesie różnicę, której oś nie niesie. Koło zostaje pięciopolowe. Pełne uzasadnienie i alternatywa (oś „spokój”) w `tmp/tresci-notatki-B.md`.

---

## 7. Dwanaście nowych pierwszych zadań (po dwa na profil)

Format: `zadania-wizkora.v1.json` rozszerzony o `potrzeba`, `minimum`, `etap` (`"oba"` + `warianty["1-3"|"4-8"]` z polami, które różnią się między etapami; w wariancie `miejsca` to mapa `id → opis` nadpisująca opis miejsca), `rozmowa`, `reakcja_swiata`, `miejsce_reakcji` (gdzie na planecie widać zmianę: pod drzewem · obok karty · przy choince · na pieńku · przy drabince · przy ścieżce — zgodne z tabelą haków dzielonych w `tmp/tresci-notatki-D.md`; hybrydy z `05` mają pierwszeństwo do obiektu, zadanie z Koła dostaje kwiat), `slad` (jak w kartach `05`: `opcje` — trzy krótkie wybory, `obrazki` — trzy nazwy obrazków dla 1–3, `zdanie: true`, `zdjecie` — czy zdjęcie w ogóle ma sens, `podpowiedz` przy aparacie; ślad bez zdjęcia jest zawsze możliwy wyborem, także dla 1–3; `dowod` zostaje jako nagłówek drugiego kroku), `karta_wizkora` (zlecenie na kartę ≤ 60 znaków, bez „musi”), `mentor_powiadomienie` („Zobacz, co {zrobił|zrobiła} {imie}: …”), a dla projektantów `profil_pierwszy`, `ksztalt`, `tryb_startu`, opcjonalnie `rodzina` (wyklucza powtórkę tej samej czynności z hybrydą). Model `etap` + `warianty` obowiązuje wszystkie 15 zadań (rozstrzygnięcie spójności f). `nagroda` zostaje jako cichy licznik w tle i **nie pada w żadnym tekście**. Pola czytane przez TTS (`cel`, `jak`, `szept`) bez cyfr; czasowniki przeszłe i przymiotniki o dziecku w tokenach `{m|ż}`; „ty/ci/cię” małą literą (jak `01`, `02`, `05`); `dowod` zawsze dwie drogi; `rozmowa` działa też przy śladzie „nie wyszło” i przy wersji minimum. Sprawdzone skryptem `tmp/tresci-skrypty/nowe-zadania-B.py` (**15/15 OK** po naniesieniu recenzji, §12). Pełny JSON: `tmp/tresci-skrypty/nowe-zadania-B.json`.

| # | id | profil | oś | potrzeba | kształt | tryb startu | solo / z kimś | min | miejsce reakcji |
|---|---|---|---|---|---|---|---|---:|---|
| 1 | `tam-i-z-powrotem` — Droga powrotna | DT | ciekawosc | uwaznosc | zauważ | obserwowanie | solo | 15 | przy ścieżce |
| 2 | `naucz-mnie` — Naucz mnie | DT | ciekawosc | kompetencja | porozmawiaj | zaproszenie | z kimś | 15 | obok karty |
| 3 | `tajny-pomocnik` — Tajny pomocnik | EM | wspolpraca | troska | podaruj | odpowiadanie | solo (dla kogoś) | 10 | pod drzewem |
| 4 | `obok` — Obok | EM | wspolpraca | relacja | wytrzymaj | odpowiadanie | z kimś | 10 | przy drabince |
| 5 | `kladka-z-kartki` — Budowniczy | ST | wytrwalosc | kompetencja | zrób | inicjowanie | solo | 15 | na pieńku (bez pieńka: przy drabince) |
| 6 | `minuta-w-glowie` — Zegar w głowie | ST | wytrwalosc | regulacja | wytrzymaj | inicjowanie | solo | 10 | przy choince |
| 7 | `wynalazca-z-kieszeni` — Majster | KR | tworzenie | sprawczosc | zrób | inicjowanie | solo | 10 | na pieńku (bez pieńka: przy drabince) |
| 8 | `celowo-brzydko` — Arcydzieło | KR | tworzenie | autonomia | odważ się | inicjowanie | solo | 10 | przy drabince |
| 9 | `skok-przez-skarpetki` — Skoczek | LD | odwaga | ruch | odważ się | inicjowanie | solo | 10 | przy choince |
| 10 | `drugie-podejscie` — Drugie podejście | LD | odwaga | kompetencja | zrób | inicjowanie | solo | 15 | przy ścieżce |
| 11 | `ostatni-dzwiek` — Ostatni dźwięk | MD | wytrwalosc | regulacja | wytrzymaj | obserwowanie | solo | 10 | przy ścieżce |
| 12 | `najwolniejszy-krok` — Najwolniejszy krok | MD | wytrwalosc | ruch | zrób | obserwowanie | solo | 10 | przy drabince |

### 7.1 `tam-i-z-powrotem` — Droga powrotna (DT · zauważ · obserwowanie · uważność)

Zagadka ze świata bez zagadki od Wizkora: ta sama droga dwa razy, a świat w międzyczasie się zmienił. Ograniczenie (trzy drobiazgi) dziecko sprawdza samo; wynik nieznany (co zniknie?), oblać się nie da. Wersja w mieszkaniu ratuje dzień bez wychodzenia.

```json
{
  "id": "tam-i-z-powrotem",
  "profil_pierwszy": "DT",
  "cecha": "ciekawosc",
  "potrzeba": "uwaznosc",
  "ksztalt": "zauważ",
  "tryb_startu": "obserwowanie",
  "tytul": "Droga powrotna",
  "cel": "W drodze tam zapamiętaj trzy drobiazgi.\nW drodze z powrotem sprawdź, czy wciąż są.",
  "szept": "Czy wciąż są.",
  "jak": "Wybierz trzy drobiazgi po drodze — plamę, naklejkę, patyk — i odszukaj je, wracając.",
  "dowod": "Zrób zdjęcie drobiazgu, który został, albo napisz, który zniknął.",
  "przyklad": "Kreda na chodniku jest, patyk jest, kartonu przy śmietniku już nie ma.",
  "minimum": "Jeden drobiazg zapamiętany i sprawdzony — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "1-3": {
      "cel": "Zapamiętaj po drodze trzy rzeczy.\nWracając, sprawdź, czy są."
    },
    "4-8": {
      "miejsca": {
        "klatka": "Od drzwi mieszkania do drzwi bloku i z powrotem."
      }
    }
  },
  "rozmowa": "Czy któryś drobiazg zniknął, zanim {wróciłeś|wróciłaś}?",
  "reakcja_swiata": "wzdłuż ścieżki na polanie pojawiają się trzy kamyczki-znaczniki — model `kamyczki` istnieje; ułożenie przy ścieżce: do zbudowania, koszt niski (bez kolizji z drogą kamieni LD z `05`, jeśli leżą w innym miejscu)",
  "nagroda": 25,
  "minuty": 15,
  "competency_focus": [
    "DT"
  ],
  "miejsca": [
    {
      "id": "szkola",
      "emoji": "🎒",
      "nazwa": "Do szkoły",
      "opis": "Po drodze do szkoły i z powrotem — a jeśli to za długo, weź klatkę albo mieszkanie."
    },
    {
      "id": "klatka",
      "emoji": "🚪",
      "nazwa": "Na klatce",
      "opis": "Od drzwi mieszkania do drzwi bloku i z powrotem, gdy dorosły jest obok."
    },
    {
      "id": "sklep",
      "emoji": "🛒",
      "nazwa": "Do sklepu",
      "opis": "Z dorosłym: trzy rzeczy w drodze tam, sprawdzenie w drodze z powrotem."
    },
    {
      "id": "mieszkanie",
      "emoji": "🏠",
      "nazwa": "W mieszkaniu",
      "opis": "Z pokoju do kuchni okrężną drogą i z powrotem, gdy dziś nigdzie nie wychodzisz."
    }
  ],
  "miejsce_reakcji": "przy ścieżce",
  "karta_wizkora": "Coś po drodze się zmienia, gdy nie patrzysz. Sprawdzisz?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {sprawdzał|sprawdzała} po drodze, co zostało, a co zniknęło.",
  "slad": {
    "opcje": [
      "Wszystko zostało",
      "Coś zniknęło",
      "Coś nowego przybyło"
    ],
    "obrazki": [
      "trzy-rzeczy",
      "puste-miejsce",
      "nowa-rzecz"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie drobiazgu, bez ludzi i bez numeru domu"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot akcji jest: „czy wciąż są” — droga tam to tylko przygotowanie, misja zaczyna się w drodze z powrotem. | — |
| `swieze-spojrzenie` | tryb obserwowanie, ślad zamiast efektu (to, co zniknęło) — pierwszy taki w torze głównym. | — |
| `rodzic-1-3` | dla 1–3 między „tam” a „z powrotem” jest sześć godzin lekcji — `szkola.opis` odsyła do klatki albo mieszkania; klatka tylko z dorosłym obok. | `warianty.1-3.cel`, `szkola.opis`, `klatka.opis` + `warianty.4-8.miejsca` |
| `rodzic-4-8` | nie ma widowni, nie ma zdjęcia z twarzą; jest coś do opowiedzenia („karton zniknął”). Zrobi. | — |
| `pedagog` | 1–3: trzy konkrety w pamięci to próg górny, ale wykonalny; jeden czasownik na etap. 4–8 bez zmian. | — |
| `psycholog` | zdrowe; brak dowodu nie jest porażką — „zniknął” to też wynik. | — |
| `socjolog` | działa na klatce w bloku i w drodze do szkoły; miejsce w mieszkaniu nie jest gorsze, bo mieszkanie też się zmienia. | dodane miejsce `mieszkanie` |
| `copywriter` | tytuł „Droga powrotna” (bez „Tropiciela” — nazwa wycofana z kanonu); misja zaczyna się w drodze z powrotem; szept z drugiej linii. | tytuł |
| `narrator-gama` | Wizkor mówi to jako trop, nie polecenie: „Coś po drodze się zmienia, kiedy nie patrzysz. Sprawdzisz?”; tokeny w `rozmowa`; zero cyfr. | — |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.2 `naucz-mnie` — Naucz mnie (DT · porozmawiaj · zaproszenie · kompetencja)

Tryb zaproszenia, którego w bazie nie ma: dziecko prosi, żeby ktoś je nauczył, i dowodzi, że umie. Ciekawość skierowana na ludzi, a nie na rzeczy. Rówieśnik i telefon do babci są pełnoprawnymi miejscami.

```json
{
  "id": "naucz-mnie",
  "profil_pierwszy": "DT",
  "cecha": "ciekawosc",
  "potrzeba": "kompetencja",
  "ksztalt": "porozmawiaj",
  "tryb_startu": "zaproszenie",
  "tytul": "Naucz mnie",
  "cel": "Poproś kogoś, żeby nauczył cię jednej rzeczy.\nPotem zrób ją {sam|sama}.",
  "szept": "Potem {sam|sama}.",
  "jak": "Wybierz kogoś, kto umie coś, czego ty nie umiesz, i powiedz: naucz mnie.",
  "dowod": "Zrób zdjęcie tego, co {zrobiłeś|zrobiłaś} po nauce, albo napisz, czego się {nauczyłeś|nauczyłaś}.",
  "przyklad": "Pani ze świetlicy nauczyła mnie składać żabkę z papieru. Moja skacze krzywo, ale skacze.",
  "minimum": "Jedno „naucz mnie” powiedziane na głos — nawet gdy nauka będzie kiedy indziej, i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "4-8": {
      "jak": "Wybierz kogoś, kto umie coś, czego nie umiesz, i poproś o jedną lekcję — może to być ktoś z klasy."
    }
  },
  "rozmowa": "Kogo o to {poprosiłeś|poprosiłaś} i jak poszło?",
  "reakcja_swiata": "obok karty Gry na Pamięć (obiekt `karty` w `mapa.json`) wyrasta kwiat — `kwiaty.posadz`, istnieje",
  "nagroda": 25,
  "minuty": 15,
  "competency_focus": [
    "DT",
    "EM"
  ],
  "miejsca": [
    {
      "id": "swietlica",
      "emoji": "🧶",
      "nazwa": "W świetlicy",
      "opis": "Poproś kogoś starszego o sztuczkę z kartką albo sznurkiem."
    },
    {
      "id": "dom",
      "emoji": "🔧",
      "nazwa": "W domu",
      "opis": "Poproś kogoś w domu, żeby pokazał ci jedną rzecz z kuchni albo z szuflady z narzędziami."
    },
    {
      "id": "telefon",
      "emoji": "📞",
      "nazwa": "Przez telefon",
      "opis": "Poproś kogoś, kto mieszka daleko — nauczyć da się też słowami."
    },
    {
      "id": "przerwa",
      "emoji": "🏫",
      "nazwa": "Na przerwie",
      "opis": "Poproś kogoś z klasy o sztuczkę, której nikt inny nie umie."
    }
  ],
  "miejsce_reakcji": "obok karty",
  "karta_wizkora": "Tego nie umiem. Ty możesz się nauczyć — od kogo?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {poprosił|poprosiła} kogoś: naucz mnie.",
  "slad": {
    "opcje": [
      "Ktoś mnie nauczył i {zrobiłem|zrobiłam} to",
      "{Poprosiłem|Poprosiłam}, nauka będzie później",
      "{Nauczyłem|Nauczyłam} się sam"
    ],
    "obrazki": [
      "dwie-osoby",
      "dymek-prosba",
      "rece"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie tego, co powstało — bez osoby"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „potem zrób {sam|sama}” — bez tego byłaby rozmowa; z tym jest kompetencja. | — |
| `swieze-spojrzenie` | tryb zaproszenia — jedyny w torze głównym; odwrotność `mistrz-instrukcji`, dobra para. | — |
| `rodzic-1-3` | pięć minut dorosłego przy garach albo telefon do kogoś daleko — wykonalne w środę. | — |
| `rodzic-4-8` | „naucz mnie” do kolegi z klasy jest OK, do rodzica to koszt — wariant 4–8 mówi wprost o kimś z klasy. | `warianty.4-8.jak` |
| `pedagog` | tytuł „Uczeń” brzmiał jak szkoła → „Naucz mnie”; jeden czasownik: poproś. | tytuł |
| `psycholog` | zdrowe; `minimum` zdejmuje ryzyko odmowy; `rozmowa` działa też, gdy nauka będzie kiedy indziej. | `rozmowa` → „Kogo o to {poprosiłeś|poprosiłaś} i jak poszło?” |
| `socjolog` | „babcia” jako norma i „tylko on” w rodzaju męskim — wycięte (recenzja). | `telefon.opis`, `przerwa.opis` |
| `copywriter` | `cel` skrócony do dwóch linii ≤ 50; szept z tokenem „Potem {sam|sama}.”. | `cel` |
| `narrator-gama` | karta: „Tego nie umiem. Ty możesz się nauczyć — od kogo?” (46) — trop, nie polecenie; zero cyfr. | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.3 `tajny-pomocnik` — Tajny pomocnik (EM · podaruj · odpowiadanie · troska)

Ktoś czegoś potrzebuje, a gest jest bez widowni i bez słów — dokładnie kształt EM. Ograniczenie („nikt nie wie”) jest zabawne i sprawdzalne. Troska o rzecz, nie praca emocjonalna: nikt nie musi się ucieszyć.

```json
{
  "id": "tajny-pomocnik",
  "profil_pierwszy": "EM",
  "cecha": "wspolpraca",
  "potrzeba": "troska",
  "ksztalt": "podaruj",
  "tryb_startu": "odpowiadanie",
  "tytul": "Tajny pomocnik",
  "cel": "Zrób dziś coś pomocnego, zanim ktoś poprosi.\nTak, żeby nikt nie wiedział, że to ty.",
  "szept": "Nikt nie wie.",
  "jak": "Wybierz jedną drobną rzecz — kubek, buty, krzesło — i załatw ją po cichu.",
  "dowod": "Napisz jedno zdanie albo zrób zdjęcie tej rzeczy — Mentor nikomu nie zdradzi.",
  "przyklad": "Kubki po śniadaniu umyte i odstawione. Nikt nie wie, kto.",
  "minimum": "Jedna rzecz odłożona na miejsce, o której nikt nie wie — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "4-8": {
      "przyklad": "Kabel od ładowarki w kuchni rozplątany. Nikt nie wie, kto.",
      "miejsca": {
        "klatka": "Podnieś ulotkę spod skrzynek i wyrzuć, zanim ktoś zobaczy."
      }
    }
  },
  "rozmowa": "Czy ktoś zauważył, że coś się zmieniło?",
  "reakcja_swiata": "pod wielkim drzewem wyrasta kwiat (`kwiaty.posadz`, istnieje); po zauważeniu przez Mentora — kwiat w nowym wariancie koloru przy drabince pomostu (jednolity dodatek, R9 w `01`)",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "EM"
  ],
  "miejsca": [
    {
      "id": "dom",
      "emoji": "🏠",
      "nazwa": "W domu",
      "opis": "Zrób jedną rzecz, która komuś ułatwi wieczór: kubek, buty, krzesło."
    },
    {
      "id": "swietlica",
      "emoji": "🎲",
      "nazwa": "W świetlicy",
      "opis": "Odłóż grę, którą ktoś zostawił rozłożoną."
    },
    {
      "id": "klasa",
      "emoji": "✏️",
      "nazwa": "W klasie",
      "opis": "Podłóż komuś kredkę, której szuka, gdy nie patrzy."
    },
    {
      "id": "klatka",
      "emoji": "📬",
      "nazwa": "Na klatce",
      "opis": "Podnieś ulotkę spod skrzynek i wyrzuć, zanim ktoś zobaczy — gdy dorosły jest obok."
    }
  ],
  "miejsce_reakcji": "pod drzewem",
  "karta_wizkora": "Komuś czegoś brakuje. Magią nie załatwię. Ty — po cichu.",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {zrobił|zrobiła} coś po cichu, żeby nikt nie wiedział, że to {on|ona}.",
  "slad": {
    "opcje": [
      "Nikt nie zauważył",
      "Ktoś zauważył, nie wie kto",
      "Ktoś odgadł"
    ],
    "obrazki": [
      "cicho",
      "znak-zapytania",
      "oko"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie rzeczy, nie osoby"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: tajność — bez niej to EM-TASK-005 (obowiązek). | — |
| `swieze-spojrzenie` | instrukcja-partytura „załatw po cichu”; ślad w czasie (zanim ktoś zauważy). | — |
| `rodzic-1-3` | zero kosztu; ale „zdjęcie, zanim ktoś zauważy” moim telefonem psuje sekret — dowód przepisany. | `dowod` |
| `rodzic-4-8` | sekret zamiast wstydu; przykład 4–8 z kablem w kuchni, bez rodzeństwa. | `warianty.4-8.przyklad` |
| `pedagog` | 1–3 potrzebuje przykładu rzeczy — jest w `jak` (kubek, buty, krzesło). | — |
| `psycholog` | `dom` „rzecz, o którą zwykle ktoś cię prosi” to obowiązek w kostiumie — przepisane na „coś, co komuś ułatwi wieczór”. | `dom.opis` |
| `socjolog` | skrypt płci (siostra, mama) w przykładzie wycięty; klatka dla 1–3 tylko z dorosłym obok. | `przyklad`, `klatka.opis` + `warianty.4-8.miejsca` |
| `copywriter` | „Mentor nikomu nie zdradzi” w dowodzie — jedyne miejsce, gdzie Mentor pada z nazwy, i tu ma sens. | — |
| `narrator-gama` | karta: „Komuś czegoś brakuje. Magią nie załatwię. Ty — po cichu.” (54). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.4 `obok` — Obok (EM · wytrzymaj · odpowiadanie · relacja)

Obecność bez słów jako pełnoprawne działanie — **po wecie**: tylko przy osobach znajomych (z klasy, ze świetlicy, z podwórka, z domu), „rób swoje” zamiast milczącej sceny, `minimum` bez założeń (kuchnia albo autobus), `przyklad` bez obiecanego efektu. Nie czeka na cudzy smutek — „sam” to stan, nie kryzys. Ślad jest o miejscu, nigdy o osobie.

```json
{
  "id": "obok",
  "profil_pierwszy": "EM",
  "cecha": "wspolpraca",
  "potrzeba": "relacja",
  "ksztalt": "wytrzymaj",
  "tryb_startu": "odpowiadanie",
  "tytul": "Obok",
  "cel": "Usiądź dziś obok kogoś znajomego, kto jest sam.\nNic nie mów. Rób swoje.",
  "szept": "Rób swoje.",
  "jak": "Znajdź kogoś, kogo znasz, gdy siedzi z boku, i zostań obok przez chwilę — bez rozmowy i bez pytań.",
  "dowod": "Napisz, gdzie to było, albo zrób zdjęcie tego miejsca — bez ludzi.",
  "przyklad": "Na przerwie Kuba siedział sam na schodach. {Usiadłem|Usiadłam} obok z kanapką. Nic nie mówiliśmy.",
  "minimum": "Chwila obok kogoś bez rozmowy — w kuchni albo w autobusie. I tak się liczy.",
  "etap": "oba",
  "warianty": {
    "1-3": {
      "cel": "Usiądź obok kogoś, kogo znasz, gdy siedzi sam.\nNic nie mów."
    },
    "4-8": {
      "jak": "Usiądź obok kogoś, kto siedzi z boku, i rób swoje — bez rozmowy i bez pytań.",
      "przyklad": "Na przerwie Kuba siedział sam na schodach. {Usiadłem|Usiadłam} obok z kanapką. Nic nie mówiliśmy."
    }
  },
  "rozmowa": "Co robiła ta osoba, kiedy siedzieliście obok siebie?",
  "reakcja_swiata": "przy drabince domku na drzewie wyrastają dwa kwiaty obok siebie (`kwiaty.posadz`, istnieje); ławka na pomoście należy do hybrydy EM z `05`",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "EM",
    "MD"
  ],
  "miejsca": [
    {
      "id": "przerwa",
      "emoji": "🏫",
      "nazwa": "Na przerwie",
      "opis": "Usiądź przy kimś z klasy, kto siedzi sam na ławce albo na schodach."
    },
    {
      "id": "swietlica",
      "emoji": "🪑",
      "nazwa": "W świetlicy",
      "opis": "Usiądź przy stole, przy którym ktoś znajomy siedzi sam."
    },
    {
      "id": "dom",
      "emoji": "📖",
      "nazwa": "W domu",
      "opis": "Usiądź obok dorosłego, który coś robi w ciszy — czyta, gotuje, naprawia."
    },
    {
      "id": "podworko",
      "emoji": "🌳",
      "nazwa": "Na podwórku",
      "opis": "Przy kimś, kogo znasz z podwórka, gdy siedzi z boku — z dorosłym w zasięgu wzroku."
    }
  ],
  "miejsce_reakcji": "przy drabince",
  "karta_wizkora": "Ktoś siedzi z boku. Być obok — tego za ciebie nie zrobię.",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {był|była} obok kogoś bez słów.",
  "slad": {
    "opcje": [
      "{Byłem|Byłam} obok, bez słów",
      "Krótko, potem ktoś zagadał",
      "Dziś nikogo z boku"
    ],
    "obrazki": [
      "dwa-krzesla",
      "dymek",
      "puste-krzeslo"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "tylko miejsce, bez ludzi"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „nic nie mów, rób swoje” — ograniczenie, które dziecko czuje w każdej sekundzie. | — |
| `swieze-spojrzenie` | jedyny kształt bez czasownika-czynności w bazie; zostaje. | — |
| `rodzic-1-3` | wersja domowa działa przy mnie w kuchni; wariant 1–3 mówi „kogo znasz”. | `warianty.1-3.cel` |
| `rodzic-4-8` | milczące siadanie przy koledze to scena — „rób swoje” w `jak` i przykład z kanapką bez obiecanego efektu. | `warianty.4-8.jak`, `przyklad` |
| `pedagog` | „przez chwilę” bez liczby minut — dobrze; 1–3 potrafi. | — |
| `psycholog + socjolog (WETO)` | `podworko` sadzało dziecko obok obcego dorosłego, 1–3 nie odróżniało znajomego od obcego, `minimum` zakładało dom i radio — WETO zdjęte po przepisaniu: tylko znajomi, dorosły w zasięgu wzroku, minimum w kuchni albo autobusie. | `cel`, `jak`, wszystkie `miejsca`, `minimum` |
| `psycholog` | po zmianach zdrowe: nie ma pracy emocjonalnej, `rozmowa` pyta o czynność osoby, nie o jej stan. | — |
| `copywriter` | tytuł jednosłowny; szept „Rób swoje.”. | `szept` |
| `narrator-gama` | karta: „Ktoś siedzi z boku. Być obok — tego za ciebie nie zrobię.” (54). | `karta_wizkora` |

Rozstrzygnięcie: WETO `psycholog` + `socjolog` zdjęte po przepisaniu (tylko osoby znajome, „rób swoje”, minimum bez założeń); ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.5 `kladka-z-kartki` — Budowniczy (ST · zrób · inicjowanie · kompetencja)

Problem z ograniczeniem i test: ta sama kartka, ten sam ciężarek, dwa kształty. Wynik nieznany, ale każdy wynik jest odkryciem — oblać się nie da. Plan → test → poprawka w piętnaście minut przy biurku.

```json
{
  "id": "kladka-z-kartki",
  "profil_pierwszy": "ST",
  "cecha": "wytrwalosc",
  "potrzeba": "kompetencja",
  "ksztalt": "zrób",
  "tryb_startu": "inicjowanie",
  "tytul": "Budowniczy",
  "cel": "Zbuduj z kartki kładkę między dwiema książkami.\nSprawdź, ile udźwignie płaska, a ile złożona.",
  "szept": "Ile udźwignie.",
  "jak": "Połóż płaską kartkę między książkami, obciąż gumką, potem złóż kartkę w harmonijkę i sprawdź to samo.",
  "dowod": "Zrób zdjęcie kładki, która wygrała, albo napisz, która utrzymała więcej.",
  "przyklad": "Płaska zapadła się od razu. Harmonijka utrzymała gumkę, temperówkę i pół piórnika.",
  "minimum": "Jedna kładka sprawdzona jednym ciężarkiem — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "1-3": {
      "cel": "Połóż kartkę na dwóch książkach, na niej gumkę.\nPotem złóż kartkę jak wachlarz i sprawdź."
    }
  },
  "rozmowa": "Co najcięższego utrzymała kładka?",
  "reakcja_swiata": "kwiat przy pieńku po ściętym drzewie (`kwiaty.posadz`, istnieje); gdy nic nie ścięto — kwiat przy drabince. Ukryty `most` należy do hybrydy ST `kladka-nad-oczkiem` z `05` (pierwszeństwo); to zadanie zostaje w puli dla dzieci, które hybrydy ST nie robiły — pole `rodzina: \"kladka\"` wyklucza powtórkę; tekst części B czytany z `05` (jedno źródło)",
  "nagroda": 25,
  "minuty": 15,
  "competency_focus": [
    "ST",
    "KR"
  ],
  "miejsca": [
    {
      "id": "biurko",
      "emoji": "📚",
      "nazwa": "Przy biurku",
      "opis": "Weź dwie książki, kartkę z zeszytu i gumkę."
    },
    {
      "id": "swietlica",
      "emoji": "🎲",
      "nazwa": "W świetlicy",
      "opis": "Weź dwa pudełka od gier zamiast książek."
    },
    {
      "id": "kuchnia",
      "emoji": "☕",
      "nazwa": "W kuchni",
      "opis": "Weź dwa kubki, serwetkę i łyżeczkę jako ciężarek."
    },
    {
      "id": "lawka",
      "emoji": "🪑",
      "nazwa": "Na ławce",
      "opis": "Na ławce: dwa piórniki i kartka."
    }
  ],
  "rodzina": "kladka",
  "miejsce_reakcji": "na pieńku (bez pieńka: przy drabince)",
  "karta_wizkora": "Nie umiem policzyć, która kartka utrzyma więcej. Sprawdzisz?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {sprawdzał|sprawdzała}, która kładka z kartki utrzyma więcej.",
  "slad": {
    "opcje": [
      "Złożona trzymała więcej",
      "Obie podobnie",
      "Płaska trzymała więcej"
    ],
    "obrazki": [
      "wachlarz",
      "rowno",
      "plaska"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie kładki z ciężarkiem"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: płaska kontra złożona z tym samym ciężarkiem — bez porównania to „zbuduj most”. | — |
| `swieze-spojrzenie` | skala: most na dwie książki; dubel z hybrydą ST — rozstrzygnięte: `05` ma pierwszeństwo, tu `rodzina: kladka`. | `rodzina`, `reakcja_swiata` |
| `rodzic-1-3` | kartka, dwie książki, gumka — jest; wariant 1–3 w dwóch krótkich zdaniach. | `warianty.1-3.cel` |
| `rodzic-4-8` | eksperyment, o którym można powiedzieć w klasie; zrobi sam. | — |
| `pedagog` | „harmonijka” nieznana w 1–3 → „jak wachlarz”; `rozmowa` z lekcji fizyki → „Co najcięższego utrzymała kładka?”; kolano nie jest płaskie → ławka. | `warianty.1-3.cel`, `rozmowa`, `lawka.opis` |
| `psycholog` | zdrowe; każdy wynik jest odkryciem, `minimum` jedna kładka. | — |
| `socjolog` | ławka w szkole i świetlica — nie zakłada biurka w domu. | — |
| `copywriter` | „Budowniczy” (rola) zamiast „Kładka z kartki”. | tytuł |
| `narrator-gama` | karta: „Nie umiem policzyć, która kartka utrzyma więcej. Sprawdzisz?” (58). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.6 `minuta-w-glowie` — Zegar w głowie (ST · wytrzymaj · inicjowanie · regulacja)

Regulacja podana jako problem do rozwiązania, a nie jako „uspokój się”: dziecko mierzy czas w głowie, sprawdza, poprawia. Dwie próby z jedną zmianą to cały schemat ST. Zero materiałów.

```json
{
  "id": "minuta-w-glowie",
  "profil_pierwszy": "ST",
  "cecha": "wytrwalosc",
  "potrzeba": "regulacja",
  "ksztalt": "wytrzymaj",
  "tryb_startu": "inicjowanie",
  "tytul": "Zegar w głowie",
  "cel": "Zgadnij, ile trwa minuta, bez patrzenia na zegar.\nPotem spróbuj drugi raz — inaczej.",
  "szept": "Drugi raz inaczej.",
  "jak": "Zamknij oczy, otwórz, gdy myślisz, że minęła minuta, i sprawdź na zegarze.",
  "dowod": "Napisz, o ile się {pomyliłeś|pomyliłaś} za pierwszym i za drugim razem, albo zrób zdjęcie zegara.",
  "przyklad": "Za pierwszym razem czterdzieści sekund. Za drugim {liczyłem|liczyłam} oddechy i wyszło prawie równo.",
  "minimum": "Jedna próba, jeden wynik — i tak się liczy.",
  "etap": "oba",
  "rozmowa": "Jak {liczyłeś|liczyłaś} minutę w głowie?",
  "reakcja_swiata": "przy choince kamyczki układają się w krąg jak zegar słoneczny — model `kamyczki` istnieje; układ: do zbudowania, koszt niski",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "ST",
    "MD"
  ],
  "miejsca": [
    {
      "id": "kuchnia",
      "emoji": "⏲️",
      "nazwa": "W kuchni",
      "opis": "Zegar na piekarniku albo na ścianie."
    },
    {
      "id": "przystanek",
      "emoji": "🚌",
      "nazwa": "Na przystanku",
      "opis": "Tablica z czasem odjazdu, z dorosłym obok."
    },
    {
      "id": "swietlica",
      "emoji": "🕰️",
      "nazwa": "W świetlicy",
      "opis": "Zegar na ścianie, w kącie, gdy inni grają."
    },
    {
      "id": "kolejka",
      "emoji": "🏥",
      "nazwa": "W kolejce",
      "opis": "U lekarza albo w sklepie: zegar na ścianie, zamiast telefonu."
    }
  ],
  "warianty": {
    "1-3": {
      "cel": "Zgadnij, kiedy minie minuta, bez zegara.\nKtoś powie: za wcześnie czy za późno.",
      "dowod": "Napisz, czy twoja minuta była krótsza, czy dłuższa, albo zrób zdjęcie zegara.",
      "jak": "Zamknij oczy i powiedz „już”, gdy myślisz, że minęła minuta."
    }
  },
  "miejsce_reakcji": "przy choince",
  "karta_wizkora": "Czas umiem zatrzymać. Zmierzyć bez zegara — nie. A ty?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {mierzył|mierzyła} minutę bez zegara.",
  "slad": {
    "opcje": [
      "Moja minuta była krótsza",
      "Prawie równo",
      "Moja minuta była dłuższa"
    ],
    "obrazki": [
      "zegar-mniej",
      "zegar-rowno",
      "zegar-wiecej"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie zegara"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „drugi raz inaczej” — poprawka po teście. | — |
| `swieze-spojrzenie` | ślad zamiast efektu: krótsza czy dłuższa; nie ma „wygrałeś”. | — |
| `rodzic-1-3` | dwie próby ze mną i stoperem w środku kolacji — nie; wariant 1–3: jedna próba, „za wcześnie czy za późno”. | `warianty.1-3`, `kuchnia.opis` |
| `rodzic-4-8` | zrobi w kolejce u lekarza zamiast na telefonie; bez wstydu. | — |
| `pedagog` | siedmiolatek nie odczyta sekund i nie policzy różnicy; „pomyliłeś” nazywa wynik pomyłką → dowód 1–3 „krótsza czy dłuższa”. | `warianty.1-3.dowod` |
| `psycholog` | zdrowe; `rozmowa` „Jak {liczyłeś|liczyłaś} minutę w głowie?” działa przy jednej próbie. | `rozmowa` |
| `socjolog` | zegar jest wszędzie: piekarnik, świetlica, przystanek; nie zakłada zegarka. | — |
| `copywriter` | „Zegar w głowie” — rola-przedmiot; szept z drugiej linii. | — |
| `narrator-gama` | karta: „Czas umiem zatrzymać. Zmierzyć bez zegara — nie. A ty?” (52). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.7 `wynalazca-z-kieszeni` — Majster (KR · zrób · inicjowanie · sprawczość)

Brak do wypełnienia z ograniczeniem materiału: jedna rzecz, trzy użycia, jedno pokazane. Zero przygotowań — działa w autobusie. Ręce, nie kartka.

```json
{
  "id": "wynalazca-z-kieszeni",
  "profil_pierwszy": "KR",
  "cecha": "tworzenie",
  "potrzeba": "sprawczosc",
  "ksztalt": "zrób",
  "tryb_startu": "inicjowanie",
  "tytul": "Majster",
  "cel": "Weź jedną rzecz, którą masz przy sobie.\nWymyśl jej trzy nowe użycia i jedno pokaż.",
  "szept": "Jedno pokaż.",
  "jak": "Wybierz przedmiot z kieszeni albo plecaka i sprawdź, czym jeszcze może być.",
  "dowod": "Zrób zdjęcie rzeczy w nowej roli albo napisz trzy pomysły w jednym zdaniu.",
  "przyklad": "Gumka do włosów: zakładka, obrączka na dwa palce i miarka do ciastek. Zakładka działa.",
  "minimum": "Jedno nowe użycie, pokazane raz — i tak się liczy.",
  "etap": "oba",
  "rozmowa": "Czym jeszcze mogłaby być ta rzecz?",
  "reakcja_swiata": "drobny przedmiot liska na pieńku po ściętym drzewie (pieniek istnieje po ścięciu; model przedmiotu: do zbudowania, koszt średni); bez ścięcia albo do czasu modelu — kwiat przy drabince (istnieje)",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "KR"
  ],
  "miejsca": [
    {
      "id": "plecak",
      "emoji": "🎒",
      "nazwa": "Z plecaka",
      "opis": "Weź bilet, klucz albo gumkę."
    },
    {
      "id": "swietlica",
      "emoji": "✏️",
      "nazwa": "W świetlicy",
      "opis": "Weź coś z piórnika."
    },
    {
      "id": "kuchnia",
      "emoji": "🥄",
      "nazwa": "W kuchni",
      "opis": "Weź łyżkę albo klamerkę."
    },
    {
      "id": "autobus",
      "emoji": "🚌",
      "nazwa": "W autobusie",
      "opis": "Na kolanie: to, co masz w kieszeni."
    }
  ],
  "warianty": {
    "1-3": {
      "cel": "Weź jedną rzecz z kieszeni.\nWymyśl, czym jeszcze może być, i pokaż."
    }
  },
  "miejsce_reakcji": "na pieńku (bez pieńka: przy drabince)",
  "karta_wizkora": "Tu czegoś brakuje. Może to z kieszeni potrafi więcej?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {wymyślił|wymyśliła} nowe użycie jednej rzeczy.",
  "slad": {
    "opcje": [
      "Nowe użycie zadziałało",
      "Zadziałało trochę",
      "Tylko pomysł"
    ],
    "obrazki": [
      "rzecz-w-roli",
      "polowa",
      "dymek"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie rzeczy w nowej roli"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „jedno pokaż” — pomysł musi zadziałać, nie tylko brzmieć. | — |
| `swieze-spojrzenie` | ograniczenie: jedna rzecz zamiast pudła materiałów — naprawia `warsztat-wynalazcy`. | — |
| `rodzic-1-3` | gumka do włosów przy stole, bez mojej pomocy; wariant 1–3 bez „trzech użyć”. | `warianty.1-3.cel` |
| `rodzic-4-8` | dobre na autobus; tytuł „Wynalazca” pokrywał się z nazwą profilu. | tytuł → „Majster” |
| `pedagog` | 1–3: trzy użycia to próg górny, `minimum` jedno. | — |
| `psycholog` | zdrowe; `rozmowa` „Czym jeszcze mogłaby być ta rzecz?” nie zakłada, że coś zadziałało. | `rozmowa` |
| `socjolog` | nie zakłada żadnego materiału poza kieszenią. | — |
| `copywriter` | tytuł „Majster” — rola bez etykiety profilu. | tytuł |
| `narrator-gama` | karta: „Tu czegoś brakuje. Może to z kieszeni potrafi więcej?” (53); reakcja z warunkiem „pieniek istnieje”. | `karta_wizkora`, `reakcja_swiata` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.8 `celowo-brzydko` — Arcydzieło (KR · odważ się · inicjowanie · autonomia)

Twórcza odwaga bez presji oryginalności i z zamkniętym sufitem: „trzy rzeczy nie tak” dziecko samo policzy, a podpis wymyślonym znakiem (nie imieniem — zdjęcie idzie do Mentora) to akt autonomii. Naprawia `cos-z-niczego` („czego nikt jeszcze nie narysował”).

```json
{
  "id": "celowo-brzydko",
  "profil_pierwszy": "KR",
  "cecha": "tworzenie",
  "potrzeba": "autonomia",
  "ksztalt": "odważ się",
  "tryb_startu": "inicjowanie",
  "tytul": "Arcydzieło",
  "cel": "Narysuj coś i zrób w tym trzy rzeczy nie tak.\nPotem podpisz to z dumą.",
  "szept": "Trzy rzeczy nie tak.",
  "jak": "Rysuj tak, żeby trzy rzeczy nie pasowały, i podpisz wymyślonym znakiem.",
  "dowod": "Zrób zdjęcie rysunku albo napisz, co jest w nim nie tak.",
  "przyklad": "Pies z pięcioma nogami pod fioletowym niebem. Podpis: gwiazdka.",
  "minimum": "Jedna rzecz nie tak i podpis-znaczek — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "4-8": {
      "przyklad": "Nasz blok z kominem na dole i oknami w chmurach. Podpis: błyskawica."
    }
  },
  "rozmowa": "Która z rzeczy nie tak była najtrudniejsza do narysowania?",
  "reakcja_swiata": "kwiat w nowym wariancie koloru przy drabince (`kwiaty[].wariant` 0–4, istnieje); ramka na barierce należy do hybrydy KR `ramka-w-domku` z `05`",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "KR",
    "LD"
  ],
  "miejsca": [
    {
      "id": "stol",
      "emoji": "🖍️",
      "nazwa": "Przy stole",
      "opis": "Zostaw na stole, podpisane znakiem, żeby ktoś znalazł."
    },
    {
      "id": "swietlica",
      "emoji": "🎨",
      "nazwa": "W świetlicy",
      "opis": "Rysujcie to samo, każdy jak najbrzydziej — bez wygranych."
    },
    {
      "id": "zeszyt",
      "emoji": "📓",
      "nazwa": "W zeszycie",
      "opis": "Narysuj na ostatniej stronie zeszytu."
    },
    {
      "id": "autobus",
      "emoji": "🚌",
      "nazwa": "W autobusie",
      "opis": "Narysuj na kolanie, długopisem."
    }
  ],
  "miejsce_reakcji": "przy drabince",
  "karta_wizkora": "Wszyscy chcą ładnie. Założę się, że nie tak jest trudniej.",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {narysował|narysowała} coś celowo brzydko i {podpisał|podpisała}.",
  "slad": {
    "opcje": [
      "Trzy rzeczy nie tak",
      "Więcej niż trzy",
      "Jedna, i tak się liczy"
    ],
    "obrazki": [
      "trzy-krzywe",
      "duzo-krzywych",
      "jedna-krzywa"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie rysunku bez imienia"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | „jak najbrzydziej” był otwartym sufitem → „trzy rzeczy nie tak” (recenzja końcowa); zwrot: podpis z dumą. | `cel`, `jak` |
| `swieze-spojrzenie` | celowe odwrócenie normy; w świetlicy bez wygranych. | — |
| `rodzic-1-3` | kredka i kartka, koszt zero; „każde rysuje” było niezrozumiałe → „każdy jak najbrzydziej”. | `swietlica.opis` |
| `rodzic-4-8` | lodówka jest dla małych, „obok ładnych” to porównanie, autoportret robi z wyglądu temat → stół, blok z kominem. | `stol.opis`, `warianty.4-8.przyklad` |
| `pedagog` | zero słownictwa oceniającego; „trzy rzeczy nie tak” dziecko samo policzy. | — |
| `psycholog` | zdrowe; zdejmuje lęk przed „źle”. | — |
| `socjolog` | podpis imieniem na zdjęciu łamał regułę prywatności → podpis wymyślonym znakiem, zdjęcie bez imienia. | `jak`, `dowod`, `przyklad`, `slad.podpowiedz` |
| `copywriter` | „Arcydzieło” jako tytuł ironiczny zostaje; szept „Trzy rzeczy nie tak.”. | `szept` |
| `narrator-gama` | karta: „Wszyscy chcą ładnie. Założę się, że nie tak jest trudniej.” — „założę się” jako trop (rekomendacja recenzji, decyzja do `01`). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.9 `skok-przez-skarpetki` — Skoczek (LD · odważ się · inicjowanie · ruch)

Wyzwanie ruchowe z wpisaną porażką: zadanie kończy się dopiero, gdy raz nie wyjdzie, więc porażka jest metą, nie błędem. Ruch w bloku, bez sprzętu. Sufit zamknięty przez własne ciało.

```json
{
  "id": "skok-przez-skarpetki",
  "profil_pierwszy": "LD",
  "cecha": "odwaga",
  "potrzeba": "ruch",
  "ksztalt": "odważ się",
  "tryb_startu": "inicjowanie",
  "tytul": "Skoczek",
  "cel": "Dwie skarpetki na podłodze. Przeskocz między nimi.\nRozsuwaj, aż raz nie wyjdzie.",
  "szept": "Aż raz nie wyjdzie.",
  "jak": "Skacz obunóż z miejsca, boso albo w butach, i po każdym skoku odsuń skarpetkę o jedną stopę.",
  "dowod": "Zrób zdjęcie skarpetek w ostatnim odstępie albo napisz, ile skoków się udało.",
  "przyklad": "Siedem skoków wyszło, ósmy nie. Odstęp: sześć moich stóp.",
  "minimum": "Trzy skoki i jeden odstęp — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "1-3": {
      "cel": "Połóż dwie skarpetki i przeskocz między nimi.\nRozsuń je i skocz jeszcze raz."
    }
  },
  "rozmowa": "Przy którym odstępie {przestałeś|przestałaś} być {pewny|pewna}, że wyjdzie?",
  "reakcja_swiata": "kwiat przy choince (`kwiaty.posadz`, istnieje); droga z kamieni należy do hybrydy LD `kamienie-kroki` z `05`",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "LD"
  ],
  "miejsca": [
    {
      "id": "pokoj",
      "emoji": "🧦",
      "nazwa": "W pokoju",
      "opis": "Na dywanie, z dala od stołu; w bloku wieczorem ląduj cicho, na palcach."
    },
    {
      "id": "korytarz",
      "emoji": "🚪",
      "nazwa": "W przedpokoju",
      "opis": "Na wolnym kawałku podłogi, drzwi zamknięte."
    },
    {
      "id": "podworko",
      "emoji": "🌳",
      "nazwa": "Na podwórku",
      "opis": "Dwa patyki zamiast skarpetek, z dorosłym w zasięgu wzroku."
    },
    {
      "id": "swietlica",
      "emoji": "🏫",
      "nazwa": "W świetlicy",
      "opis": "Dwa woreczki gimnastyczne, gdy jest miejsce."
    }
  ],
  "miejsce_reakcji": "przy choince",
  "karta_wizkora": "Założę się, że skok ma swój koniec. Sprawdź, gdzie.",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {sprawdzał|sprawdzała}, gdzie kończy się skok.",
  "slad": {
    "opcje": [
      "Wyszło kilka skoków",
      "Wyszło dużo skoków",
      "Trzy skoki, i tak się liczy"
    ],
    "obrazki": [
      "skarpetki-blisko",
      "skarpetki-daleko",
      "trzy-skoki"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie skarpetek na podłodze"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „aż raz nie wyjdzie” — koniec zdefiniowany przez porażkę; pierwszy taki w bazie. | — |
| `swieze-spojrzenie` | ślad: ostatni odstęp w stopach — dobry dowód bez zdjęcia. | — |
| `rodzic-1-3` | na dywanie, boso albo w butach (nie w skarpetkach na panelach); wariant 1–3 bez „aż raz nie wyjdzie”. | `jak`, `warianty.1-3.cel` |
| `rodzic-4-8` | zrobi, gdy nikt nie patrzy; skarpetki zamiast sprzętu to test, nie obciach. | — |
| `pedagog` | 1–3 potrafi; liczenie skoków dopiero w dowodzie. | — |
| `psycholog` | porażka wpisana i nazwana — zdrowe, nie ma „przegrałeś”. | — |
| `socjolog` | skoki o dwudziestej w bloku to sąsiad pod spodem → „ląduj cicho, na palcach”; podwórko z dorosłym w zasięgu wzroku. | `pokoj.opis` |
| `copywriter` | `cel` skrócony: „Dwie skarpetki na podłodze. Przeskocz między nimi.” | `cel` |
| `narrator-gama` | karta: „Założę się, że skok ma swój koniec. Sprawdź, gdzie.” (51); reakcja: kwiat przy choince (kamienie należą do hybrydy LD). | `karta_wizkora`, `reakcja_swiata` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.10 `drugie-podejscie` — Drugie podejście (LD · zrób · inicjowanie · kompetencja)

Odwaga jako powrót do porażki, nie skok w nowe: „próba liczy się, bo się zaczęła”. Jedna zmiana zamiast „staraj się bardziej” — praktyka, nie etykieta growth mindset.

```json
{
  "id": "drugie-podejscie",
  "profil_pierwszy": "LD",
  "cecha": "odwaga",
  "potrzeba": "kompetencja",
  "ksztalt": "zrób",
  "tryb_startu": "inicjowanie",
  "tytul": "Drugie podejście",
  "cel": "Wróć do czegoś, co ci ostatnio nie wyszło.\nSpróbuj raz jeszcze — inaczej niż wtedy.",
  "szept": "Inaczej niż wtedy.",
  "jak": "Wybierz jedną rzecz, która wtedy się nie udała, i zmień w niej jedno.",
  "dowod": "Zrób zdjęcie drugiej próby albo napisz, co {zmieniłeś|zmieniłaś}.",
  "przyklad": "Wieża z klocków znowu. Tym razem szeroka podstawa. Stoi.",
  "minimum": "Druga próba zaczęta, choćby nie skończona — i tak się liczy.",
  "etap": "oba",
  "rozmowa": "Co {zmieniłeś|zmieniłaś} za drugim razem?",
  "reakcja_swiata": "ukryta brama (`mapa.json` `brama.ukryta: true`, model istnieje) pokazuje się przy ścieżce — `pokazUkryty`, koszt niski, bez kolizji z `05`; po zauważeniu przez Mentora: kwiat w nowym wariancie koloru przy drabince",
  "nagroda": 25,
  "minuty": 15,
  "competency_focus": [
    "LD",
    "ST"
  ],
  "miejsca": [
    {
      "id": "klocki",
      "emoji": "🧱",
      "nazwa": "Na dywanie",
      "opis": "Budowla, która się przewróciła — zmień podstawę."
    },
    {
      "id": "zeszyt",
      "emoji": "✏️",
      "nazwa": "W zeszycie",
      "opis": "Samolot z kartki, który nie poleciał — inne skrzydło."
    },
    {
      "id": "sznurowki",
      "emoji": "👟",
      "nazwa": "Przy butach",
      "opis": "Kokardka, która się rozwiązuje — inny sposób wiązania."
    },
    {
      "id": "podworko",
      "emoji": "🏀",
      "nazwa": "Na podwórku",
      "opis": "Rzut do kosza albo kozłowanie — zmień jedną rzecz w ruchu."
    }
  ],
  "warianty": {
    "4-8": {
      "przyklad": "Rzut do kosza jeszcze raz. Tym razem łokieć wyżej. Wpadł drugi."
    }
  },
  "miejsce_reakcji": "przy ścieżce",
  "karta_wizkora": "Coś nie wyszło. Drugi raz — inaczej. Magią tego nie zrobię.",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {wrócił|wróciła} do czegoś, co nie wyszło, i {zmienił|zmieniła} jedno.",
  "slad": {
    "opcje": [
      "Tym razem wyszło",
      "Inaczej, jeszcze nie do końca",
      "{Zacząłem|Zaczęłam} drugi raz"
    ],
    "obrazki": [
      "stoi",
      "w-polowie",
      "start"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie drugiej próby"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „inaczej niż wtedy” — bez tego to powtórka. | — |
| `swieze-spojrzenie` | rytuał powrotu w jednym dniu; w bazie „nie wyszło” kończy zadanie. | — |
| `rodzic-1-3` | kokardka albo wieża — mam w domu; zero mojego czasu. | — |
| `rodzic-4-8` | „litera, która nie wyszła” brzmi jak szkoła → samolot z kartki; rzut do kosza z jedną zmianą. | `zeszyt.opis`, `warianty.4-8.przyklad` |
| `pedagog` | „zmień jedno” wymaga przykładu — jest w `miejsca`. | — |
| `psycholog` | „rzecz, którą rzuciłeś” nazywało dziecko tym, które rzuca → „która wtedy się nie udała”; nie porównuje z wczoraj. | `jak` |
| `socjolog` | nie zakłada sprzętu; podwórko jedno z czterech. | — |
| `copywriter` | tytuł zostaje — jest rolą sytuacji. | — |
| `narrator-gama` | „Ktoś musi spróbować…” miało „musi” → karta: „Coś nie wyszło. Drugi raz — inaczej. Magią tego nie zrobię.” (58). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.11 `ostatni-dzwiek` — Ostatni dźwięk (MD · wytrzymaj · obserwowanie · regulacja)

Cisza z wyraźnym końcem: dźwięk sam mówi, kiedy koniec. Trzy powtórzenia coraz ciszej to regulacja przez uwagę, nie przez „uspokój się”. Bez oddechu-na-cztery, który 4–8 uważa za dziecinny.

```json
{
  "id": "ostatni-dzwiek",
  "profil_pierwszy": "MD",
  "cecha": "wytrwalosc",
  "potrzeba": "regulacja",
  "ksztalt": "wytrzymaj",
  "tryb_startu": "obserwowanie",
  "tytul": "Ostatni dźwięk",
  "cel": "Stuknij łyżeczką w szklankę. Słuchaj, aż zniknie.\nPotem trzy razy, każdy ciszej.",
  "szept": "Za każdym ciszej.",
  "jak": "Nie ruszaj się, dopóki dźwięk całkiem nie ucichnie.",
  "dowod": "Napisz, które stuknięcie brzmiało najdłużej, albo zrób zdjęcie szklanki.",
  "przyklad": "Najdłużej brzmiało to najcichsze. {Myślałem|Myślałam}, że będzie odwrotnie.",
  "minimum": "Jedno stuknięcie wysłuchane do końca — i tak się liczy.",
  "etap": "oba",
  "rozmowa": "Co jeszcze było słychać, kiedy dźwięk już zniknął?",
  "reakcja_swiata": "ukryta latarnia przy ścieżce (`mapa.json` `latarnia.ukryta: true`, model istnieje) zapala się o zmierzchu — `pokazUkryty`, koszt niski; lampka na pomoście z hybrydy MD to inna instancja — pilnować budżetu świateł (3–4)",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "MD"
  ],
  "miejsca": [
    {
      "id": "kuchnia",
      "emoji": "🥄",
      "nazwa": "W kuchni",
      "opis": "Szklanka i łyżeczka na stole."
    },
    {
      "id": "swietlica",
      "emoji": "☕",
      "nazwa": "W świetlicy",
      "opis": "Kubek i ołówek w cichym kącie, gdy inni już wyszli."
    },
    {
      "id": "klatka",
      "emoji": "🔑",
      "nazwa": "Na klatce",
      "opis": "Stuknij kluczem w barierkę i słuchaj echa, gdy dorosły jest obok."
    },
    {
      "id": "pokoj",
      "emoji": "🔔",
      "nazwa": "W pokoju",
      "opis": "Dzwonek roweru albo klucze — cokolwiek, co brzmi."
    }
  ],
  "warianty": {
    "4-8": {
      "przyklad": "Klucz o barierkę na klatce. Trzecie, najcichsze, niosło się najdłużej.",
      "miejsca": {
        "klatka": "Stuknij kluczem w barierkę i słuchaj echa."
      }
    }
  },
  "miejsce_reakcji": "przy ścieżce",
  "karta_wizkora": "Dźwięk sam wie, kiedy się kończy. Dosłuchasz go do końca?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {słuchał|słuchała} dźwięku, aż ucichł.",
  "slad": {
    "opcje": [
      "Najdłużej brzmiał najcichszy",
      "Najdłużej brzmiał najgłośniejszy",
      "Jedno stuknięcie, i tak się liczy"
    ],
    "obrazki": [
      "fala-mala",
      "fala-duza",
      "jedna-fala"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie szklanki albo klucza"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „każdy ciszej” — bez tego jedno stuknięcie. | — |
| `swieze-spojrzenie` | instrukcja Fluxusu; dowód „które brzmiało najdłużej” to ślad, nie efekt. | — |
| `rodzic-1-3` | szklanka i łyżeczka — tak; klatka tylko z dorosłym obok. | `klatka.opis` + `warianty.4-8.miejsca` |
| `rodzic-4-8` | bardziej eksperyment niż relaks; klucz o barierkę — dobre; przykład 4–8 dopisany. | `warianty.4-8.przyklad` |
| `pedagog` | dźwięk kubka nie wybrzmi w hałasie świetlicy — zadanie bez końca → „w cichym kącie, gdy inni już wyszli”. | `swietlica.opis` |
| `psycholog` | zdrowe; nie obiecuje efektu („uspokoisz się”). | — |
| `socjolog` | klatka i świetlica — bez zakładania cichego domu. | — |
| `copywriter` | `cel` 100 zn. → „Stuknij łyżeczką w szklankę. Słuchaj, aż zniknie.\nPotem trzy razy, każdy ciszej.”; tytuł bez „Strażnika ciszy” (nazwa wycofana). | `cel`, tytuł |
| `narrator-gama` | nie tryb spokojny (ten mówi tylko o ciele i nie zleca, R7) → zwykłe zlecenie: „Dźwięk sam wie, kiedy się kończy. Dosłuchasz go do końca?” (55). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 7.12 `najwolniejszy-krok` — Najwolniejszy krok (MD · zrób · obserwowanie · ruch)

Skupienie przez ciało: najwolniejsza droga to ruch, którego nie da się zrobić bez uwagi. Widoczny koniec (okno), ograniczenie sprawdzalne (stopa dopiero, gdy druga stoi). Działa w pokoju i na korytarzu bloku.

```json
{
  "id": "najwolniejszy-krok",
  "profil_pierwszy": "MD",
  "cecha": "wytrwalosc",
  "potrzeba": "ruch",
  "ksztalt": "zrób",
  "tryb_startu": "obserwowanie",
  "tytul": "Najwolniejszy krok",
  "cel": "Przejdź od drzwi do okna najwolniej, jak potrafisz.\nStopę stawiaj dopiero, gdy druga stoi pewnie.",
  "szept": "Dopiero, gdy stoi.",
  "jak": "Idź tak wolno, żeby nikt nie był pewien, czy się ruszasz.",
  "dowod": "Napisz, ile kroków zajęła droga, albo zrób zdjęcie miejsca, gdzie {skończyłeś|skończyłaś}.",
  "przyklad": "Z drzwi do okna czternaście kroków. Zwykle robię to w trzy.",
  "minimum": "Pięć najwolniejszych kroków — i tak się liczy.",
  "etap": "oba",
  "rozmowa": "Co {zauważyłeś|zauważyłaś} po drodze, czego zwykle nie widać?",
  "reakcja_swiata": "kwiat przy pomoście domku na drzewie (`kwiaty.posadz`, istnieje); świetlik przy domku należy do hybrydy MD `swiatlo-w-oknie` z `05`",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "MD",
    "LD"
  ],
  "miejsca": [
    {
      "id": "pokoj",
      "emoji": "🚶",
      "nazwa": "W pokoju",
      "opis": "Od drzwi do okna."
    },
    {
      "id": "korytarz",
      "emoji": "🏢",
      "nazwa": "Na korytarzu",
      "opis": "Od wejścia do końca korytarza w bloku, gdy dorosły jest obok."
    },
    {
      "id": "swietlica",
      "emoji": "🪑",
      "nazwa": "W świetlicy",
      "opis": "Od drzwi do swojego krzesła, gdy dookoła jest ruch."
    },
    {
      "id": "podworko",
      "emoji": "🌳",
      "nazwa": "Na podwórku",
      "opis": "Od ławki do drzewa, z dorosłym w zasięgu wzroku."
    }
  ],
  "warianty": {
    "4-8": {
      "miejsca": {
        "swietlica": "W pokoju przy zamkniętych drzwiach, od drzwi do okna.",
        "korytarz": "Na korytarzu w bloku, gdy jest pusty."
      }
    }
  },
  "miejsce_reakcji": "przy drabince",
  "karta_wizkora": "Lisek nie umie zwolnić. Pokażesz mu najwolniejszy krok?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {przeszedł|przeszedła} pokój najwolniej, jak się da.",
  "slad": {
    "opcje": [
      "Dużo kroków",
      "Kilka kroków",
      "Pięć najwolniejszych"
    ],
    "obrazki": [
      "slady-duzo",
      "slady-kilka",
      "piec-sladow"
    ],
    "zdanie": true,
    "zdjecie": false,
    "podpowiedz": "bez zdjęcia — ślad to wybór albo zdanie"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: warunek stawiania stopy — bez niego „idź wolno” nie ma końca. | — |
| `swieze-spojrzenie` | skala: najwolniejsza droga; ruch, który nie jest wysiłkiem — brakowało. | — |
| `rodzic-1-3` | zrobi w przedpokoju; korytarz bloku tylko z dorosłym obok. | `korytarz.opis` + `warianty.4-8.miejsca` |
| `rodzic-4-8` | „ktoś, kto patrzy” zakładał widza, świetlica w ruchu to występ → „żeby nikt nie był pewien”, pokój przy zamkniętych drzwiach. | `jak`, `warianty.4-8.miejsca` |
| `pedagog` | liczenie kroków dopiero w dowodzie; 1–3 potrafi. | — |
| `psycholog` | zdrowe. | — |
| `socjolog` | podwórko z dorosłym w zasięgu wzroku; korytarz bloku jako pełnoprawne miejsce (4–8). | — |
| `copywriter` | „Najwolniejszy krok” zamiast „Ślimak” (infantylne dla 4–8); ślad bez zdjęcia — chodzi o ruch. | tytuł, `slad.zdjecie: false` |
| `narrator-gama` | karta: „Lisek nie umie zwolnić. Pokażesz mu najwolniejszy krok?” (55); reakcja: kwiat przy pomoście (świetlik należy do hybrydy MD). | `karta_wizkora`, `reakcja_swiata` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

---

## 8. Przepisane zadania Wizkora (werdykt „przepisać” z sekcji 2)

Trzy zadania z werdyktem „przepisać” dostają nowe `id` (stare `id` w `historiaZadan()` w localStorage graczy nie mogą zostać nadpisane inną treścią) i pole `zastepuje`.

### 8.1 `trzy-przedmioty` — Trzy przedmioty (zamiast `cos-z-niczego` · KR/tworzenie · zrób · sprawczość)

To samo jądro (własnymi rękami), ale z ograniczeniem materiału i wymaganiem funkcji („do czegoś służy”), więc dziecko samo wie, kiedy skończyło, i nie ma presji oryginalności.

```json
{
  "id": "trzy-przedmioty",
  "zastepuje": "cos-z-niczego",
  "cecha": "tworzenie",
  "potrzeba": "sprawczosc",
  "ksztalt": "zrób",
  "tryb_startu": "inicjowanie",
  "tytul": "Trzy przedmioty",
  "cel": "Weź trzy rzeczy, które do siebie nie pasują.\nZrób z nich jedną, która do czegoś służy.",
  "szept": "Do czegoś służy.",
  "jak": "Połóż trzy rzeczy obok siebie i połącz je tak, żeby trzymały się razem.",
  "dowod": "Zrób zdjęcie tego, co powstało, albo napisz, do czego to jest.",
  "przyklad": "Kubek, sznurek i klamerka. Wyszedł dzwonek na drzwi. Dzwoni cicho.",
  "minimum": "Dwie rzeczy połączone tak, że trzymają — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "1-3": {
      "cel": "Weź trzy rzeczy, które do siebie nie pasują.\nZrób z nich jedną nową rzecz."
    }
  },
  "rozmowa": "Która rzecz była najtrudniejsza do połączenia?",
  "reakcja_swiata": "drobny przedmiot liska na pieńku po ściętym drzewie (do zbudowania, koszt średni; warunek: pieniek istnieje); bez ścięcia albo do czasu modelu — kwiat przy drabince (istnieje)",
  "nagroda": 25,
  "minuty": 15,
  "competency_focus": [
    "KR"
  ],
  "miejsca": [
    {
      "id": "kuchnia",
      "emoji": "🥄",
      "nazwa": "W kuchni",
      "opis": "Weź łyżkę, gumkę i pudełko po herbacie."
    },
    {
      "id": "piornik",
      "emoji": "✏️",
      "nazwa": "Z piórnika",
      "opis": "Weź gumkę, spinacz i temperówkę."
    },
    {
      "id": "plecak",
      "emoji": "🎒",
      "nazwa": "Z plecaka",
      "opis": "Weź to, co masz na dnie plecaka."
    },
    {
      "id": "swietlica",
      "emoji": "🎲",
      "nazwa": "W świetlicy",
      "opis": "Weź trzy rzeczy z pudła z klockami i grami."
    }
  ],
  "miejsce_reakcji": "na pieńku (bez pieńka: przy drabince)",
  "karta_wizkora": "Mam pomysł, ale sam go nie zbuduję. Z czego to zrobić?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {połączył|połączyła} trzy rzeczy w jedną.",
  "slad": {
    "opcje": [
      "Do czegoś służy",
      "Trzyma się razem",
      "Dwie rzeczy, i tak się liczy"
    ],
    "obrazki": [
      "rzecz-dziala",
      "rzecz-trzyma",
      "dwie-rzeczy"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie tego, co powstało"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „do czegoś służy” — funkcja jako sprawdzian, zamiast „od początku do końca”. | — |
| `swieze-spojrzenie` | ograniczenie zamiast wolności (marzec, kraina 7). | — |
| `rodzic-1-3` | trzy rzeczy z kuchni, zero przygotowań; wariant 1–3 „jedną nową rzecz”. | `warianty.1-3.cel` |
| `rodzic-4-8` | z piórnika w szkole — zrobi. | — |
| `pedagog` | „patrz, aż zobaczysz” nie miało końca → „połącz je tak, żeby trzymały się razem”. | `jak` |
| `psycholog` | zdrowe; `rozmowa` o rzeczy („która była najtrudniejsza do połączenia”) działa przy dwóch rzeczach. | `rozmowa` |
| `socjolog` | nie zakłada klocków ani kartonu materiałów. | — |
| `copywriter` | szept z drugiej linii; `cel` ≤ 50 na linię. | — |
| `narrator-gama` | karta: „Mam pomysł, ale sam go nie zbuduję. Z czego to zrobić?” (54). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 8.2 `na-zmiane` — Na zmianę (zamiast `ramie-w-ramie` · EM/współpraca · zrób z kimś · relacja)

Współpraca bez obowiązku i bez słów: reguła „na zmianę” jest sprawdzalna, rówieśnik jest pełnoprawnym partnerem, a materiał kończy zadanie. Zastępuje mycie auta i grabienie.

```json
{
  "id": "na-zmiane",
  "zastepuje": "ramie-w-ramie",
  "cecha": "wspolpraca",
  "potrzeba": "relacja",
  "ksztalt": "zrób",
  "tryb_startu": "zaproszenie",
  "tytul": "Na zmianę",
  "cel": "Zbudujcie coś we dwoje, po jednym elemencie.\nBez jednego słowa.",
  "szept": "Bez słowa.",
  "jak": "Zaproś kogoś i umówcie się na migi: ja jeden klocek, ty jeden, aż skończy się materiał.",
  "dowod": "Zrób zdjęcie tego, co powstało we dwoje, albo napisz, z kim to {zbudowałeś|zbudowałaś}.",
  "przyklad": "Z Olą z ławki: wieża z gumek i temperówek. Nie mówiliśmy nic, a stoi.",
  "minimum": "Zaproszenie powiedziane na głos, choćby nikt dziś nie miał czasu — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "4-8": {
      "przyklad": "Z Kubą z ławki: rysunek na jednej kartce, kreska na zmianę, bez gadania. Wyszedł statek z kotem."
    }
  },
  "rozmowa": "Kogo {zaprosiłeś|zaprosiłaś} i jak poszło bez słów?",
  "reakcja_swiata": "przy drabince domku na drzewie wyrastają dwa kwiaty obok siebie (`kwiaty.posadz`, istnieje); po zauważeniu przez Mentora — kwiat w nowym wariancie koloru przy drabince (jednolity dodatek, R9 w `01`)",
  "nagroda": 25,
  "minuty": 15,
  "competency_focus": [
    "EM",
    "KR"
  ],
  "miejsca": [
    {
      "id": "swietlica",
      "emoji": "🎲",
      "nazwa": "W świetlicy",
      "opis": "Wieża z klocków albo z pudełek po grach, klocek na zmianę."
    },
    {
      "id": "lawka",
      "emoji": "✏️",
      "nazwa": "Na ławce",
      "opis": "Rysunek na jednej kartce, kreska na zmianę."
    },
    {
      "id": "dywan",
      "emoji": "🧱",
      "nazwa": "Na dywanie",
      "opis": "Budowla z klocków albo z poduszek z kimś z domu."
    },
    {
      "id": "dwor",
      "emoji": "🍂",
      "nazwa": "Na dworze",
      "opis": "Stos z kamyków albo patyków, po jednym na zmianę, z dorosłym w zasięgu wzroku."
    }
  ],
  "miejsce_reakcji": "przy drabince",
  "karta_wizkora": "W pojedynkę się nie da. Podobno da się bez słów.",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {budował|budowała} coś z kimś na zmianę, bez słów.",
  "slad": {
    "opcje": [
      "Zbudowaliśmy bez słów",
      "Zbudowaliśmy, ale gadaliśmy",
      "{Zaprosiłem|Zaprosiłam}, nikt nie miał czasu"
    ],
    "obrazki": [
      "dwie-rece-wieza",
      "dymki",
      "dymek-zaproszenie"
    ],
    "zdanie": true,
    "zdjecie": true,
    "podpowiedz": "zdjęcie budowli, bez ludzi"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „bez jednego słowa” — bez tego wspólne budowanie; z tym gra. | — |
| `swieze-spojrzenie` | ograniczenie + zaproszenie; rówieśnik jako partner, czego w bazie prawie nie ma (2 na 276). | — |
| `rodzic-1-3` | z młodszym dzieckiem na dywanie — rozwiązuje wieczór; dwór z dorosłym w zasięgu wzroku. | `dwor.opis` |
| `rodzic-4-8` | z kolegą na ławce, kreska na zmianę — zrobi; przykład 4–8 bez brata. | `warianty.4-8.przyklad` |
| `pedagog` | „na migi” w `jak` wystarczy; jeden czasownik: zbudujcie. | — |
| `psycholog` | `minimum` wymagało partnera → „zaproszenie powiedziane na głos, choćby nikt nie miał czasu”; `rozmowa` „kogo {zaprosiłeś|zaprosiłaś} i jak poszło”. | `minimum`, `rozmowa` |
| `socjolog` | świetlica i ławka — nie zakłada rodzeństwa ani dorosłego z czasem. | — |
| `copywriter` | `cel` 60 → „Zbudujcie coś we dwoje, po jednym elemencie.\nBez jednego słowa.” | `cel` |
| `narrator-gama` | karta: „W pojedynkę się nie da. Podobno da się bez słów.” (48). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

### 8.3 `pierwsze-slowo` — Pierwsze słowo (zamiast `jeden-krok-dalej` · LD/odwaga · odważ się · sprawczość)

Jądro `jeden-krok-dalej` (mały krok, sklep z dorosłym, biblioteka) bez wstydu jako tematu i bez dowodu o uczuciach. „Znany z widzenia” to nie obcy; dla 1–3 z dorosłym obok.

```json
{
  "id": "pierwsze-slowo",
  "zastepuje": "jeden-krok-dalej",
  "cecha": "odwaga",
  "potrzeba": "sprawczosc",
  "ksztalt": "odważ się",
  "tryb_startu": "inicjowanie",
  "tytul": "Pierwsze słowo",
  "cel": "Powiedz „dzień dobry” albo „cześć”, zanim usłyszysz.\nKomuś, kogo znasz tylko z widzenia.",
  "szept": "Zanim usłyszysz.",
  "jak": "Wybierz sąsiada, panią z szatni albo kogoś z klasy i przywitaj się na głos.",
  "dowod": "Napisz, kto to był — bez nazwiska — albo zrób zdjęcie miejsca, gdzie to było.",
  "przyklad": "Pan z trzeciego piętra, na klatce. Zdziwił się i powiedział „dzień dobry”.",
  "minimum": "„Dzień dobry” powiedziane w myślach do kogoś, kogo mijasz — i tak się liczy.",
  "etap": "oba",
  "warianty": {
    "1-3": {
      "jak": "Przywitaj się {pierwszy|pierwsza} z sąsiadem albo panią w szkole, gdy dorosły jest obok."
    },
    "4-8": {
      "miejsca": {
        "klatka": "Sąsiad, którego mijasz codziennie."
      }
    }
  },
  "rozmowa": "Komu {powiedziałeś|powiedziałaś} — albo {chciałeś|chciałaś} powiedzieć — pierwsze słowo?",
  "reakcja_swiata": "na polanie obok Wizkora pojawia się nowy znak na mapie — mechanizm `hub/znakiMapy.js` istnieje, nowy wpis: koszt niski, bez kolizji z `05` (DT używa znaku `prog` przy oczku)",
  "nagroda": 25,
  "minuty": 10,
  "competency_focus": [
    "LD",
    "EM"
  ],
  "miejsca": [
    {
      "id": "klatka",
      "emoji": "🏢",
      "nazwa": "Na klatce",
      "opis": "Sąsiad, którego mijasz codziennie — gdy dorosły jest obok."
    },
    {
      "id": "szkola",
      "emoji": "🏫",
      "nazwa": "W szkole",
      "opis": "Pani z szatni albo ze stołówki."
    },
    {
      "id": "klasa",
      "emoji": "🎒",
      "nazwa": "W klasie",
      "opis": "Ktoś, z kim jeszcze nie było rozmowy."
    },
    {
      "id": "dom",
      "emoji": "🏠",
      "nazwa": "W domu",
      "opis": "Ktoś, kto właśnie wrócił — zanim on powie pierwszy."
    }
  ],
  "miejsce_reakcji": "przy ścieżce",
  "karta_wizkora": "Ktoś mówi pierwszy. Czarodziej nie może — a ty?",
  "mentor_powiadomienie": "Zobacz, co {zrobił|zrobiła} {imie}: {powiedział|powiedziała} pierwsze słowo, zanim {usłyszał|usłyszała}.",
  "slad": {
    "opcje": [
      "Odpowiedział pierwszy raz",
      "Zdziwił się",
      "{Powiedziałem|Powiedziałam} w myślach"
    ],
    "obrazki": [
      "dymek-dwa",
      "znak-zapytania",
      "dymek-cichy"
    ],
    "zdanie": true,
    "zdjecie": false,
    "podpowiedz": "bez zdjęcia — chodzi o ludzi"
  }
}
```

| specjalista | werdykt | co zmieniono |
|---|---|---|
| `projektant-zadan` | zwrot: „zanim usłyszysz” — kolejność jako ograniczenie. | — |
| `swieze-spojrzenie` | inicjowanie w czystej postaci; ślad to reakcja drugiej osoby, nie własne uczucie. | — |
| `rodzic-1-3` | „w windzie” z sąsiadem — nie; „na klatce, gdy dorosły jest obok”; wariant 1–3 z tokenem „{pierwszy|pierwsza}”. | `przyklad`, `klatka.opis`, `warianty.1-3.jak` |
| `rodzic-4-8` | pani z szatni, ktoś z klasy — bez teatru; klatka bez dorosłego w wariancie 4–8. | `warianty.4-8.miejsca` |
| `pedagog` | jeden czasownik: powiedz. | — |
| `psycholog` | „patrząc w oczy” kosztowało część dzieci więcej niż samo „dzień dobry” → wycięte; `minimum` bez założenia kogoś w domu. | `jak`, `minimum` |
| `socjolog` | „znany z widzenia” to nie obcy — sąsiad z klatki, pani z szatni; nigdy obcy na ulicy; etykieta etapu w opisie miejsca zamieniona na wariant. | `miejsca` |
| `copywriter` | tytuł „Pierwsze słowo”; ślad bez zdjęcia (chodzi o ludzi). | `slad.zdjecie: false` |
| `narrator-gama` | „Ktoś musi powiedzieć pierwszy” miało „musi” → karta: „Ktoś mówi pierwszy. Czarodziej nie może — a ty?” (46). | `karta_wizkora` |

Rozstrzygnięcie: weta (`psycholog`, `socjolog`) bez zastrzeżeń po zmianach; ostatnie przejście `narrator-gama` — `karta_wizkora` w JSON (≤ 60 zn.) do dopisania w `kwestieWizkora.js` przy wdrożeniu; poprawki z recenzji panelu (§12) i recenzji końcowej (§13) naniesione.

Pozostałe siedem zadań z werdyktem „poprawka” dostaje gotowe zdania i `warianty["1-3"]` w sekcji 2 (2.1, 2.2, 2.4, 2.6, 2.8, 2.9, 2.10) oraz te same nowe pola (`potrzeba`, `minimum`, `rozmowa`, `reakcja_swiata`, `miejsce_reakcji`, `karta_wizkora`, `mentor_powiadomienie`, `slad`, `etap: "oba"` + `warianty`).

---

## 9. Odrzucone szkice (runda panelu)

| szkic | profil / kształt | kto odrzucił | powód |
|---|---|---|---|
| **Lisek nie może zasnąć** — wieczorem policz oddechy, aż zaśniesz | MD · wytrzymaj | `psycholog`, `rodzic-1-3` | obietnica efektu („i zaśniesz”), temat snu wykluczony regułą, wieczór to czas, którego rodzic nie ma. |
| **Nie, dziękuję** — gdy ktoś namawia, powiedz „nie” bez tłumaczenia | LD · odważ się | `psycholog` (weto) | wyzwalacz spoza kontroli dziecka; w wersji „powiedz nie jednej rzeczy z rozpędu” traci sens; jako zadanie pierwsze za trudne — zostaje w bibliotece (przepisany LD-030) na później. |
| **Dwa dlaczego** — gdy dwie osoby chcą czego innego, zapytaj każdą „dlaczego” | EM · porozmawiaj | `psycholog` (weto) | dziecko jako mediator sporu — praca emocjonalna za dorosłych, nawet bez rozstrzygania. |
| **Ręka w górze** — zadaj na lekcji pytanie, które wydaje się głupie | LD · odważ się | `rodzic-4-8`, `socjolog` | widownia klasy i słowo „głupie” w poleceniu; dla 1–3 lekcja nie jest miejscem misji; zostaje w banku na tydzień drugi, nie jako pierwsze zadanie. |
| **Schody zamiast windy** — dwa razy na swoje piętro | LD · ruch | `socjolog` | domy bez windy i parter wypadają; „przystanek dalej pieszo” wymaga dorosłego — brak miejsca ratunkowego, które nie jest gorsze. |
| **Co jest na dnie miski** — zgadnij, co pływa, sprawdź | DT · zauważ | `projektant-zadan` | pokrywa się z hybrydą DT w `05` (oczko wodne); jako zadanie pierwsze dubluje reakcję świata. |
| **Portret z zamkniętymi oczami osoby naprzeciwko** | KR · zrób | `rodzic-4-8`, `socjolog` | zakłada osobę naprzeciwko przy stole i publiczność; „rysunek na ślepo” solo został wchłonięty przez `celowo-brzydko`. |
| **Echo** — wysłuchaj kogoś minutę, powtórz najważniejsze | EM · porozmawiaj | `rodzic-4-8`, `pedagog` | „powtórz, co usłyszałeś” brzmi jak sprawdzian ze słuchania; dla 4–8 obciach przy rodzicu; zostaje jako przepisany EM-013/MD-004 w bibliotece. |
| **Boczna ścieżka** — idź dziś inną drogą | DT · zauważ | `socjolog` (weto) | dla 1–3 „inna droga do szkoły” to samodzielne odejście od trasy; wersja domowa (do kuchni przez pokój) jest gorsza, nie równa. |

---

## 10. Balans bazy PO dopisaniu (10 Wizkora → 7 poprawionych + 3 przepisane + 12 nowych = 22)

| wymiar | PRZED (10) | PO (22) |
|---|---|---|
| **potrzeba** | kompetencja 4 · sprawczość 3 · uważność 1 · relacja 1 · autonomia 1 · regulacja 0 · ruch 0 · troska 0 | kompetencja 7 · sprawczość 4 · regulacja 2 · ruch 2 · uważność 2 · relacja 2 · autonomia 2 · troska 1 |
| **oś** | po 2 | ciekawość 4 · tworzenie 4 · współpraca 4 · odwaga 4 · wytrwałość 6 |
| **kształt** | zrób 3 · porozmawiaj 2 · odważ się 2 · wytrzymaj 2 · zauważ 1 · podaruj 0 | zrób 7 · wytrzymaj 5 · odważ się 4 · porozmawiaj 3 · zauważ 2 · podaruj 1 |
| **tryb startu** | inicjowanie 10 | inicjowanie 15 · obserwowanie 3 · odpowiadanie 2 · zaproszenie 2 |
| **solo / z kimś** | 6 / 4 | 16 / 6 (w tym rówieśnik jako pełnoprawny partner w którymś `miejscu`: 6, było 1) |
| **dom / dwór jako pełnoprawne miejsce** | dom 8 · dwór 2 | dom 12 · dwór/klatka/świetlica/droga 10; miejsce w bloku bez ogrodu i zwierzaka: 22/22 (było 4/10 wg `ANALIZA_I_ROZGRYWKA.md` §3) |
| **minuty** | 10 → 2 · 15 → 4 · 20 → 4 | 10 → 10 · 15 → 10 · 20 → 2 |
| **dwie drogi dowodu bez uczuć** | 8/10 | 22/22 |
| **`minimum`, `rozmowa`, `reakcja_swiata`, `etap`** | 0/10 | 22/22 |
| **reakcja świata: istnieje w scenie / do zbudowania niski / średni** | — | po uzgodnieniu z `05` (haki dzielone): istnieje (kwiat) 11 / do zbudowania niski 8 (kamyczki ×2, grzyb, znak ×2, brama, latarnia, plac) / średni 3 (przedmiot na pieńku ×3, z zastępczym kwiatem) — dodatek po zauważeniu przez Mentora zawsze ten sam: kwiat w nowym wariancie koloru przy drabince pomostu (R9) |
| **dobre pierwsze zadanie na profil** | DT 1 · KR słabe · MD częściowe · LD, EM, ST 0 | po 2 na każdy profil |

Czego nadal brakuje (do tygodnia drugiego, z banku `MOTYWY_Z_EPOK.md` §2 po wecie): kształt **podaruj** ma jedno zadanie (dojdą „Wybierz ty” i przepisany „Cichy ratunek”); **troska o miejsce**, nie o osobę (kawałek klatki, parapet) — zero; **sygnał ze świata** („gdy zacznie padać”) — zero; zadanie z dorosłym **przez telefon** jest tylko jako miejsce w `naucz-mnie`. Liczba 22 wystarcza na trzy tygodnie przy jednym zadaniu dziennie bez powtórki — dalej potrzebna jest migracja najlepszych ~30 zadań biblioteki Mentora do formatu Wizkora (rekomendacja w `tmp/tresci-notatki-B.md`).

---

## 11. Uzgodnienie z kopią roboczą

Bazą audytu (sekcje 1–10) jest **HEAD `596d4aa`**. W chwili spisania tej sekcji druga sesja ma w kopii roboczej **niezacommitowaną** zmianę w `frontend/src/hub/data/zadania-wizkora.v1.json` (`git diff`, 17.09), dotyczącą dwóch zadań. Pliku nie ruszałem.

| zadanie | co zmieniono w kopii roboczej | mój werdykt z sekcji 2 | status | nowa treść a osiem testów |
|---|---|---|---|---|
| `jeden-krok-dalej` | `cel`: „Zrób dziś coś, czego trochę się wstydzisz.\nJeden mały krok.” → „Spróbuj dziś zrobić coś, czego trochę się obawiasz — ale tylko jeśli jest bezpieczne.” (jedna linia, bez `\n`); `jak`: „Wybierz coś bezpiecznego, co odkładasz, i po prostu to zrób.” → „Wybierz jeden mały krok i sprawdź, jak się z nim czujesz.” | **przepisać** (2.7) → `pierwsze-slowo` (8.3) | **nadal obowiązuje** | **Godność ✖:** „wstydzisz” zniknęło, ale `jak` wprowadza „sprawdź, jak się z nim czujesz”, a `dowod` nadal „jak się czułeś” (`:259`) — uczucia jako treść i dowód. **Polecenie ✖:** `cel` stracił drugą linię (zwrot akcji), „ale tylko jeśli jest bezpieczne” to zastrzeżenie dla dorosłego, nie ograniczenie dla dziecka; `cel` ma 84 znaki (limit ~2×40). **Wykluczenie ⚠:** `miejsca` bez zmian — występ przy rodzinie (`:271`), „opowiedz wszystkim” (`:289`). Bezpieczeństwo, wiek, wykonalność, powtarzalność bez zmian (✔/⚠ jak w 2.7). **WB ⚠:** „obawiasz” zamiast „wstydzisz” to krok w dobrą stronę, ale zadanie dalej robi z lęku temat, a nie z czynu. |
| `do-samego-konca` | `cel`: „Dokończ dziś coś, co kiedyś przerwałeś.\nDo samego końca.” → „Dokończ dziś coś, co kiedyś przerwałeś.” (druga linia usunięta); `jak`: „Znajdź jedną zaczętą rzecz i nie wstawaj, aż będzie skończona.” → „Wybierz jedną zaczętą rzecz i poświęć jej chwilę, żeby zrobić kolejny krok — a jeśli dasz radę, doprowadź ją do końca.” | **poprawka** (2.9) | **częściowo naprawione** | **Godność ✔:** presja „nie wstawaj, aż…” usunięta — to była główna uwaga. **Polecenie ⚠:** `jak` ma teraz trzy czasowniki (wybierz, poświęć, doprowadź) i 112 znaków — instrukcja dłuższa niż zadanie; `cel` bez drugiej linii, więc zwrot akcji („do samego końca”) został tylko w `szept`. **Wykonalność ⚠:** „jeśli dasz radę” działa jak wersja minimum, ale bez „i tak się liczy” — moje `minimum` z 2.9 nadal potrzebne. **Wykluczenie/bezpieczeństwo ⚠:** `miejsca` bez zmian — rower „do samego końca” (`:372`) i porządek w szafie (`:366`). Tokeny rodzaju nadal brak (`przerwałeś`). WB ✔ (kompetencja). |

Wniosek: zmiana w kopii roboczej idzie w tym samym kierunku co audyt (zdjęcie presji i wstydu), ale w `jeden-krok-dalej` przenosi problem z `cel` do `jak` i `dowod`, a w obu zadaniach usuwa dwuliniowy `cel` — format z `docs/PANEL_ZADAN.md` (linia druga = zwrot akcji) przestaje być spełniony. Rekomendacja: przyjąć gotowe zdania z 2.9 dla `do-samego-konca` (zachowując usunięcie „nie wstawaj”) i zastąpić `jeden-krok-dalej` zadaniem `pierwsze-slowo` (8.3). Jeśli zmiana z kopii roboczej zostanie zacommitowana przed wdrożeniem tego dokumentu, numery linii w sekcji 2 dla tych dwóch zadań (`:256–259`, `:338–340`) przestają być aktualne; treść werdyktów nie.

---

## 12. Naniesione recenzje

Źródła: `tmp/tresci-recenzja-weto.md` (panel: 1 WETO, 13 poprawek, 21 uwag do `03`) i `tmp/tresci-recenzja-glos.md` (copywriter / narrator-gama: 6 poprawek, 5 uwag + rozstrzygnięcia spójności c, d, f). Po naniesieniu: walidator `nowe-zadania-B.py` **15/15 OK** (dodane testy: `karta_wizkora` ≤ 60 bez cyfr i „musi”, linie `cel` ≤ 60, obecność `warianty` / `rozmowa` / `minimum` / `miejsce_reakcji` / `mentor_powiadomienie`, tokeny i cyfry także w wariantach).

| wpis | wprowadzono / odrzucono | dlaczego |
|---|---|---|
| weto §2.1 `lowca-pytan` socjolog (tata, „urodziłeś”) | wprowadzono | przykład bez rodzica jako normy, token rodzaju. |
| weto §2.1 pedagog (`rozmowa` „które pytanie”) | wprowadzono | jedno pytanie w zadaniu → „Co w odpowiedzi było najbardziej zaskakujące?”. |
| weto §2.4 `warsztat-wynalazcy` socjolog (karmnik, gramatyka) | wprowadzono | przykład bez balkonu; „których nikt już nie używa”. |
| weto §2.6 `mistrz-instrukcji` socjolog (siostra) | wprowadzono | przykład ze świetlicy zamiast rodzeństwa. |
| weto §2.8 `pierwszy-raz` psycholog (`rozmowa` bez tokenu) | wprowadzono | „Co się okazało inne, niż się wydawało?”; dodatkowo przykład „na miejscu babci” → „na drugim krześle”. |
| weto §2.8 pedagog (strona do przeczytania, miejsce przy stole) | wprowadzono | „obejrzyj jedną stronę”, „inaczej niż zawsze — choćby na drugim krześle”. |
| weto §2.9 `do-samego-konca` psycholog (`rozmowa` = przesłuchanie) | wprowadzono | „Co było w tym ostatnim kawałku najtrudniejsze?”. |
| weto §2.9 socjolog (kolacja) | wprowadzono | „aż ktoś cię zawoła”. |
| weto §2.10 `siedem-razy` rodzic-1-3 (kosz do koszykówki) | wprowadzono | przykład ze skarpetką i koszem na pranie. |
| weto §7.1 pedagog (szkoła za długo dla 1–3) | wprowadzono | `szkola.opis` z odesłaniem do klatki albo mieszkania. |
| weto §7.1 rodzic-1-3 (klatka samemu) | wprowadzono | „gdy ktoś w domu wie, że idziesz”. |
| weto §7.1 psycholog (`rozmowa` zakłada zniknięcie) | wprowadzono | „Czy któryś drobiazg zniknął…?”. |
| weto §7.2 socjolog (babcia, „tylko on”) | wprowadzono | „kogoś, kto mieszka daleko”; „której nikt inny nie umie”. |
| weto §7.3 socjolog (skrypt płci: siostra, mama, brat) | wprowadzono (wersja weto) | „Kubki po śniadaniu umyte i odstawione. Nikt nie wie, kto.” + 4–8 „kabel w kuchni”; wersja z recenzji głosu („w zmywarce”) odrzucona — zmywarka to założenie. |
| weto §7.3 psycholog (`dom` = obowiązek w kostiumie) | wprowadzono | „Zrób jedną rzecz, która komuś ułatwi wieczór”. |
| weto §7.3 rodzic-1-3 (`dowod` „zanim ktoś zauważy”) | wprowadzono | „Napisz jedno zdanie albo zrób zdjęcie tej rzeczy — Mentor nikomu nie zdradzi.” |
| **weto §7.4 `obok` psycholog + socjolog (WETO: obcy na ławce, 1–3 nie odróżnia)** | **wprowadzono — zadanie przepisane, nie zastąpione** | `cel` „obok kogoś znajomego”, `jak` „kogo znasz… bez rozmowy i bez pytań”, `podworko` tylko znajomi z podwórka z dorosłym w zasięgu wzroku, `przerwa`/`swietlica` „ktoś z klasy / ktoś znajomy”, wariant 1–3 „kogo znasz”. Kształt „wytrzymaj” dla EM zostaje. |
| weto §7.4 rodzic-4-8 (scena na oczach klasy, obietnica efektu) | wprowadzono | „rób swoje” w `jak` i w wariancie 4–8; `przyklad` bez „potem poszedł grać”; szept „Rób swoje.”. |
| weto §7.4 psycholog (`minimum` zakłada dom i radio) | wprowadzono | „Chwila obok kogoś bez rozmowy — w kuchni albo w autobusie.” |
| weto §7.5 pedagog (`1-3.cel` za długi, „harmonijka”) | wprowadzono | „…na niej gumkę.\nPotem złóż kartkę jak wachlarz i sprawdź.” |
| weto §7.5 pedagog (`rozmowa` z lekcji fizyki, kolano) | wprowadzono ze zmianą | „Co leżało na kładce, kiedy się poddała?” zakłada, że się poddała → „Co najcięższego utrzymała kładka?” (działa przy minimum); `lawka` „Na ławce: dwa piórniki i kartka.” |
| weto §7.6 pedagog + rodzic-1-3 (sekundy, „pomyłka”, stoper) | wprowadzono (wariant 1–3, nie `etap: 4-8`) | `warianty.1-3`: `cel` „Ktoś powie: za wcześnie czy za późno”, `jak` „powiedz już”, `dowod` „krótsza czy dłuższa”; `kuchnia.opis` bez dorosłego ze stoperem; `rozmowa` „Jak {liczyłeś|liczyłaś} minutę w głowie?” (bez założenia drugiej próby). |
| weto §7.8 rodzic-4-8 (lodówka, autoportret) | wprowadzono | „Zostaw na stole, podpisane, żeby ktoś znalazł.”; 4–8 „Nasz blok z kominem na dole…”. |
| weto §7.8 pedagog („każde” niezrozumiałe) | wprowadzono | „Rysujcie to samo, każdy jak najbrzydziej — bez wygranych.” |
| weto §7.9 socjolog (sąsiad pod spodem) | wprowadzono | „w bloku wieczorem ląduj cicho, na palcach”. |
| weto §7.10 psycholog + rodzic-4-8 („rzuciłeś”, litera) | wprowadzono | `jak` „która wtedy się nie udała”; `zeszyt` → samolot z kartki. |
| weto §7.11 pedagog (dźwięk w hałasie) | wprowadzono | „w cichym kącie, gdy inni już wyszli”. |
| weto §7.12 rodzic-4-8 (widz, korytarz jako występ) | wprowadzono | `jak` „żeby nikt nie był pewien”; `warianty.4-8.miejsca` świetlica → pokój przy zamkniętych drzwiach, korytarz „gdy jest pusty”. |
| weto §8.1 pedagog („patrz, aż zobaczysz”, „nową co”) | wprowadzono | „połącz je tak, żeby trzymały się razem”; 1–3 „jedną nową rzecz”. |
| weto §8.2 psycholog (`minimum` wymaga partnera) | wprowadzono | „Zaproszenie powiedziane na głos, choćby nikt dziś nie miał czasu”. |
| weto §8.2 socjolog (brat, dwór bez dorosłego) | wprowadzono | „Z Kubą z ławki…”; dwór „z dorosłym w zasięgu wzroku”. |
| weto §8.3 psycholog („patrząc w oczy”, `minimum` w domu) | wprowadzono | `jak` bez „w oczy”; `minimum` „w myślach do kogoś, kogo mijasz”. |
| weto §8.3 rodzic-1-3 (winda) | wprowadzono | „na klatce” zamiast „w windzie”. |
| głos 1 (8 kart Wizkora > 60 zn.) | wprowadzono | nowe pole `karta_wizkora` przy każdym z 15 zadań, wszystkie ≤ 60 (walidator); teksty z recenzji przyjęte, dwa skrócone jeszcze raz (`tajny-pomocnik` 54, `drugie-podejscie` 58). |
| głos 2 (`ostatni-dzwiek` w trybie spokojnym) | wprowadzono | zwykłe zlecenie: „Dźwięk sam wie, kiedy się kończy. Dosłuchasz go do końca?”; wiersz `narrator-gama` w tabeli werdyktów poprawiony. |
| głos 3 (`pierwsze-slowo` 1–3 „pierwszy” bez tokenu) | wprowadzono | „{pierwszy|pierwsza}”. |
| głos 4 („musi” w kartach `drugie-podejscie`, `pierwsze-slowo`) | wprowadzono | „Coś nie wyszło. Drugi raz — inaczej. Magią tego nie zrobię.” / „Ktoś mówi pierwszy. Czarodziej nie może — a ty?”. |
| głos 5 (`cel` > 2×~40) | wprowadzono dla 4 wskazanych | `ostatni-dzwiek`, `na-zmiane`, `naucz-mnie`, `skok-przez-skarpetki` skrócone; `najwolniejszy-krok` (51/47) i `pierwsze-slowo` (52) zostają — mieszczą się w dwóch wierszach karty (walidator: twardy limit 60 na linię). |
| głos 6 (kamyczki „z rozbitego głazu”, pieniek po suchym drzewku) | wprowadzono | „model `kamyczki` istnieje”; przedmiot na pieńku z warunkiem „pieniek istnieje po ścięciu, inaczej kwiat przy drabince” (7.7, 8.1). |
| głos 7 („Ci/Cię/Ty” wielką literą) | wprowadzono w JSON | małe litery w 15 zadaniach (poza początkiem zdania); decyzja dla `zadania-wizkora.v1.json` do `06`. |
| głos 8 (`tajny-pomocnik` dwa przykłady z rodziną) | wprowadzono (przykłady z weto) | patrz wyżej. |
| głos 9 („założę się” w kartach LD/KR) | odrzucono (bez zmiany) | rekomendacja recenzenta: dozwolone jako trop, nie ocena — zostaje w `skok-przez-skarpetki` i `celowo-brzydko`; decyzja do `01` §3. |
| głos 10 (`klatka` „gdy jesteś w młodszych klasach” — etykieta etapu) | wprowadzono | `warianty.1-3.miejsca.klatka` zamiast zdania warunkowego; bazowy opis bez warunku. |
| głos 11 (`kladka` 1–3 dwa zdania w linii, dubel z `05`) | wprowadzono | linia z jednym zdaniem; `rodzina: "kladka"`, tekst części B czytany z `05`. |
| spójność c (haki dzielone: `kladka` → most, +3 wiersze) | wprowadzono | reakcja `kladka-z-kartki` → kwiat przy pieńku (bez pieńka: przy drabince); `skok` → kwiat przy choince; `celowo-brzydko` → kwiat w nowym wariancie; `obok` → dwa kwiaty; `najwolniejszy-krok` → kwiat przy pomoście; brama, przedmiot na pieńku i nowy znak opisane jako „bez kolizji” z warunkami; pole `miejsce_reakcji` przy każdym zadaniu i w tabeli §7. |
| spójność d (kładka w trzech miejscach) | wprowadzono | `05` ma pierwszeństwo; `kladka-z-kartki` zostaje w puli z `rodzina`; `papierowy-most` (W2) do wycofania — zapisane w `reakcja_swiata` i w notatkach. |
| spójność f (`etap` + `warianty` dla wszystkich) | wprowadzono | każde z 15 zadań ma `etap: "oba"` i `warianty` (co najmniej jeden wariant 1–3 albo 4–8); dodane `mentor_powiadomienie` (wzorzec z `05`). |
| dodatkowo (koordynator): pytania Mentora nie zakładają wyniku | wprowadzono | przejrzane wszystkie 15 + 7 z §2: zmienione `naucz-mnie`, `minuta-w-glowie`, `wynalazca-z-kieszeni`, `trzy-przedmioty`, `na-zmiane`, `pierwsze-slowo`, `kladka-z-kartki`, `tam-i-z-powrotem`, `do-samego-konca`, `lowca-pytan`, `pierwszy-raz`. |

Bilans: **48 wpisów — 47 wprowadzono (4 ze zmianą względem gotowego tekstu), 1 odrzucono** (głos 9, zgodnie z rekomendacją samego recenzenta). WETO na `obok` zdjęte przez przepisanie, nie przez zastąpienie: EM zachowuje kształt „wytrzymaj”.

---

## 13. Recenzja końcowa (§8 promptu) — naniesione

| # | co | zmiana |
|---|---|---|
| 1 (blokujące) | tabele werdyktów §7.2–§7.12 i §8.1–§8.3 były kopią tabeli `tam-i-z-powrotem` (błąd skryptu regenerującego §7) | 14 własnych tabel panelu (9 głosów każda) odtworzonych z realnych werdyktów rundy i §12; zdanie „Rozstrzygnięcie” z wetem przy każdym zadaniu. |
| 2 | `klatka`/`korytarz` przy `etap: oba` wysyłały sześciolatka samego poza mieszkanie (`tam-i-z-powrotem`, `tajny-pomocnik`, `ostatni-dzwiek`, `najwolniejszy-krok`) | jeden wzorzec dla wszystkich pięciu zadań z klatką (także `pierwsze-slowo`): opis bazowy „…, gdy dorosły jest obok”, `warianty["4-8"].miejsca` bez tego warunku. |
| 3 | pole `slad` | każde z 15 zadań ma `slad: {opcje[3], obrazki[3], zdanie, zdjecie, podpowiedz}`; `zdjecie: false` w `najwolniejszy-krok` i `pierwsze-slowo` (ruch / ludzie); opcje z tokenami rodzaju; walidator sprawdza komplet. |
| 4 | siedem zadań „poprawka” bez wariantów | `warianty["1-3"].cel` + `jak` dopisane w §2 przy każdym (2.1, 2.2, 2.4, 2.6, 2.8, 2.9, 2.10). |
| 5 | tokeny nie o dziecku („nikt nie {wiedział|wiedziała}”, „dźwięk {zniknął|zniknąła}”) | „żeby nikt nie wiedział, że to {on|ona}”, „aż ucichł”; walidator odrzuca token po „nikt / dźwięk / kładka / rzecz / ktoś / nic / osoba”. |
| 6 | `celowo-brzydko`: otwarty sufit i podpis imieniem na zdjęciu | „trzy rzeczy nie tak” (`cel`, `jak`, `szept`, `slad`), podpis wymyślonym znakiem, zdjęcie bez imienia (`dowod`, `slad.podpowiedz`), przykłady „Podpis: gwiazdka / błyskawica”. |
| 7 | LD-TASK-025 „w twojej pracy” | „w tym, co robisz?” (bez założenia dorosłego z pracą i bez rodzaju). |
| 8 | dodatek po zauważeniu („drugi kwiat obok”, „trzeci”) | ujednolicone z R9 (`01`) i `05`: kwiat w nowym wariancie koloru przy drabince pomostu — w `tajny-pomocnik`, `na-zmiane` i w tabeli §10 (wiersz „reakcja”). |

Walidator `tmp/tresci-skrypty/nowe-zadania-B.py` po zmianach: **15/15 OK** (rozszerzony o `slad` i o tokeny przy rzeczownikach). Nic z listy nie uznano za niesłuszne.
