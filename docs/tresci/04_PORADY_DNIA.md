# 04 — Porady dnia: audyt, standard, mechanizmy profili, ślad w świecie, przepisane treści

> Zadanie C z `tmp/PROMPT_FABLE.md`. Stan repo: gałąź `v2-postgres-vercel`, HEAD `596d4aa` (17.09.2026, po commicie `2d04959` „Kanon świata”). Wszystkie liczby pochodzą ze skryptów `tmp/tresci-skrypty/pomiar-C.py` (audyt) i `sprawdz-nowe-C.py` (nowe treści); cytaty z `plik:linia` w aktualnym stanie plików. Pytania do autora i zależności techniczne są w `tmp/tresci-notatki-C.md` (do scalenia w `06_DECYZJE_I_ZALEZNOSCI.md`).

> **⚠ Kolizja z drzewem roboczym.** Druga sesja ma w `frontend/src/dailyTipsData.js` niezacommitowane zmiany w 105 wpisach (34 dla dziecka), w `hub/data/porady-zdrowia.v1.json` (7 myśli) i `hub/poradaDnia.js` (1 zapowiedź). Ten dokument audytuje **HEAD `596d4aa`** i uzgadnia różnice w §1.5. **Nie uruchamiać `scripts/migrate-tips-to-tasks.mjs`** ani innego skryptu regenerującego `dailyTipsData.js` — nadpisze te zmiany. Nikt z panelu C nie modyfikował tych trzech plików.

## 1. Stan i metoda

### 1.1 Co dziś widzi i słyszy dziecko

Zakładka **Porada** w `/swiat` (`frontend/src/hub/panels/PoradaPanel.jsx`) pokazuje jedną kartę:

| element | plik:linia | co to jest |
|---|---|---|
| znacznik „Małe odkrycie” | `PoradaPanel.jsx:151` | stały napis nad tytułem |
| tytuł (`title`) | `PoradaPanel.jsx:152` | przepuszczony przez `odmienDlaGracza` — tokeny `{m|ż}` działają |
| treść (`body`) | `PoradaPanel.jsx:154` | cała treść porady; jedyna warstwa merytoryczna |
| „Posłuchaj” | `PoradaPanel.jsx:156–165` → `glosLiska.js:88` | **lisek czyta całe `body`** głosem `lisek`, ton `zabawa` |
| czas („1 min” / „2 min”) | `PoradaPanel.jsx:166` | pole `time`; 180 porad ma „1 min”, 18 „2 min” |
| ilustracja | `PoradaPanel.jsx:144` | jeden obrazek dla wszystkich (`lis-zdrowie-uniwersalny.png`) |
| „Rady, które już znasz” | `PoradaPanel.jsx:174–197` | historia z `localStorage` + `viewed_tips` z backendu |
| **stopka z nazwą profilu** | `PoradaPanel.jsx:198–202` | „Porady dobrane dla Ciebie: Śmiałek · Odwaga. W zapasie jest ich 33.” — **etykieta profilu na ekranie, do zdjęcia** (sekcja 3 promptu) |

Nie ma: czynności do wykonania, przycisku „zrobione”, odzewu liska, śladu w świecie, rozróżnienia 1–3 / 4–8. Pola `akcja`, `zapowiedz`, `odzew`, `etap` nie istnieją w `dailyTipsData.js`. Karty ćwiczeń z oddechem, tropem i ruchem (`PoradaKarty.jsx`, `EkranOddechu.jsx`, `PoradaAkcja.jsx`, `KARTY_DNIA` w `poradaDnia.js:31–59`) są schowane za flagą `POKAZ_KARTY_AKTYWNOSCI = false` (`PoradaPanel.jsx:40`). Osobna, nieużywana w hubie pula „karteczek” leży w `hub/data/porady.v1.json` (31 jednozdaniowych poleceń typu „Wypij szklankę wody”).

### 1.2 Mechanika wyboru (co naprawdę trafia na ekran)

1. Profil: `kodProfilu(player.archetype)` (`poradaZBiblioteki.js:39–43`); stare slugi mapowane na kody, brak profilu → `DT`.
2. Dzień przygody: `dzienPrzygody(player)` (`services/dzienGry.js:27–36`) — dni od `registered_at`, cykl 30, bez rejestracji dzień miesiąca.
3. Pora: `poraTeraz()` (`poradaZBiblioteki.js:51–56`): `<12` poranek, `<18` południe, reszta wieczór. **Tylko trzy pory**, podczas gdy `poradaDnia.js:62–68` i `EkranOddechu` używają pięciu (rano/południe/popołudnie/wieczór/noc) — dwie definicje pory w jednym panelu.
4. Wybór: `swiezaPorada()` (`poradaZBiblioteki.js:83–96`) bierze tylko `audience: "dziecko"` (`:66–68`), szuka wpisu dla (dzień, pora); gdy go nie ma, **bierze inną porę tego samego dnia**, a potem następne dni cyklicznie. Wybór jest deterministyczny w obrębie pory (`PoradaPanel.jsx:61` — `useMemo`).
5. Historia: zobaczona porada od razu ląduje w `localStorage` i w `POST markTipViewed` (`PoradaPanel.jsx:71–78`); przy wejściu scalana z `GET viewed-tips` (`:82–88`). Historia filtruje po profilu i `audience` (`:101–104`), więc zmiana profilu chowa stare wpisy.

Skutek pkt 4, zmierzony symulacją 6 profili × 30 dni × 3 pory (540 wyświetleń): **tylko 198 z 540 (37%) trafia w poradę zapisaną dla tej pory**; 342 (63%) to porada z innej pory tego dnia. Profil MD ma wyłącznie porady poranne, więc wieczorem zawsze dostaje poranną. W 87 z 540 wyświetleń (16%) tekst wprost kłóci się z porą („Zanim wstaniesz z łóżka” wieczorem).

### 1.3 Liczby po zmianach z 17.09 (aktualizacja sekcji 5.3 promptu) — stan HEAD; różnice w kopii roboczej w §1.5

| co | stan | źródło |
|---|---|---|
| wpisów w `DAILY_TIPS` | 387; **198 dla dziecka**, 189 dla rodzica (odfiltrowane, poza zakresem) | `wyciag-porady.py` |
| na profil (dziecko) | DT 34 · EM 32 · ST 36 · KR 33 · LD 33 · MD 30 | jw. |
| na porę (dziecko) | poranek 122 · południe 41 · wieczór 35; MD: 30/0/0, KR: 25/8/0, LD: 21/9/3 | jw. |
| „Mędrzec” w tekstach | 0 ✔ (naprawione 17.09) | `grep` |
| pole `kraina`, nazwy krain | pole usunięte ✔; **ale 28 porad nadal opisuje wycofane krainy** (góry 8, morze/fale 13, pustynia 7) i **10 nazywa artefakty spoza kanonu** (Muszla Echa ×7, Tarcza Słońca ×3, Kompas Cieni ×1) | `motywy` w `pomiar-C.out` |
| „Wizkor mówi/szepcze/radzi/…” czytane przez liska | **63 z 198 (32%)** | `cytat_wizkora` |
| „A czy wiesz, że…” | 19 | `a_czy_wiesz` |
| nazwa profilu jako etykieta w treści („Myśliciel wie”, „Śmiałku”) | 31 | `etykieta` |
| jakikolwiek znacznik moralizowania (cytat, etykieta, „pamiętaj/musisz”, „A czy wiesz”) | **94 (47%)** | `moral_any` |
| konkretna czynność (tryb rozkazujący) | 119 (60%); **z widocznym końcem 60 (30%)** | `czynnosc`, `czynnosc_koniec` |
| tylko wyobraźnia („wyobraź sobie”, „pomyśl”) | 33 (17%) | `tylko_wyobraznia` |
| bez żadnej czynności (maksyma, ciekawostka) | **48 (24%)** | `bez_czynnosci` |
| MD przepisane 17.09 | 52 z 60 to liczba z rodzicem; **dla dziecka zostały 2 wpisy o cudzych emocjach: MD-D14-S1, MD-D22-S1** (pozostałe 5 z listy w promptcie — D06-S3, D10-S3, D19-S3, D24-S3, D28-S3 — to porady dla rodzica) | `wyciag-porady.py` |
| cyfry w TTS | 5: DT-D30-S1, LD-D10-S1, LD-D30-S1, LD-D30-S3, ST-D09-S2-NEW7 | `cyfry` |
| formy o dziecku bez tokenu | 14 (12 × wołacz „Śmiałku”/„mały Śmiałku” w LD; EM-D30-S3 „Cała, piękna”; ST-D27-S3-LUKA „sam na sam”) | `brak_tokenu` |
| ukośnik zamiast tokenu | 1: LD-D21-S1 (tytuł) | `ukosnik` |
| bez polskich znaków | 20 (wszystkie bazowe EM poza D02 i D15) | `bez_pl` |
| tytuł > 28 znaków | 51 | `tytul_ponad_28` |
| treść: średnio 134 znaki, maks. 194; **148 (75%) przekracza 120** (limit zapowiedzi TTS) | `body_sr`, `body_max` | |
| pory w tekście niezgodne ze slotem (tekst) | 3 (DT-D29-S2-LUKA, LD-D29-S2-LUKA, EM-D28-S1 — ta ostatnia to tylko „sprawdź wieczorem”, w porządku); do tego ręcznie: LD-D28-S2-LUKA, ST-D22-S1-NEW17 | `pora_niezgodna_slot` + tabela |
| wzorce technik (heurystyka, potwierdzone ręcznie w tabeli) | afirmacja 8 · obietnica efektu 8 · licznik stażu 5 · pseudonauka 3 · wygląd 3 · „nie złość się” 2 · relatywizacja 2 · produktywność 2 · strach przed dorosłym 2 · wyścig 1 · nadzór 1 · zawstydzanie 1 · sekret 1 | `tech` |

Sekcja 5.3 promptu podawała „73 moralizujące” i „16 LD bez tokenu” — po 17.09 jest 94 znaczników (bo „Mędrzec mówi” zamieniono na „Wizkor mówi”, nie wycięto) i 14 form bez tokenu (LD-D02-S2-LUKA i LD-D19-S3 dostały tokeny, ale wołacz „Śmiałku” w 11 poradach został).

### 1.4 Metoda audytu

- **Heurystyki skryptowe** (`pomiar-C.py`): czasownik rozkazujący z listy 90 form; koniec = liczebnik/„aż”/„do końca”; moralizowanie = wzorce „Wizkor …”, „X wie, że”, „pamiętaj”, „musisz”, „A czy wiesz”, nazwa profilu; techniki = wzorce z sekcji 4 promptu; tokeny = formy „-łeś/-łaś” poza nawiasami i wołacz „Śmiałku”; pora = słowa poranne/wieczorne w tekście kontra `slot`; duplikaty = `difflib` ≥ 0,45 na treści albo ≥ 0,7 na tytule (42 pary) plus 16 motywów ręcznych.
- **Ocena ręczna każdej z 198** (`werdykty_C.py`): etap 1–3 / 4–8 / oba według języka i wykonalności, werdykt, oblany test, jedno zdanie. Tabela w sekcji 3 łączy oba źródła (tagi automatyczne + ręczne, po ujednoliceniu nazw).
- Werdykty: **zostaje** (tylko migracja do nowego formatu) · **poprawka** (jedno zdanie do zmiany, kierunek podany) · **przepisać** (pomysł zostaje, tekst do napisania od nowa w standardzie) · **wyciąć** (pomysł nie należy do EwolucJI; nowa porada w tym samym slocie — sekcja 7).


### 1.5 Uzgodnienie z kopią roboczą drugiej sesji (niezacommitowane zmiany)

`git diff HEAD` (git Windows, zapis w `tmp/tresci-skrypty/diff-kopia-robocza-C.patch`, 1045 linii): `dailyTipsData.js` — 105 zmienionych wpisów (**34 dla dziecka**, 71 dla rodzica; licząc pola: 63 treści, 37 ogonki, 5 ukośnik→token, 34 tytuły), `porady-zdrowia.v1.json` — 7 z 16 myśli Wizkora, `poradaDnia.js` — zapowiedź karty „Strząśnij napięcie”. Audyt przeliczony skryptem na obu wersjach (`pomiar-C.py head` / `pomiar-C.py kopia`; wyniki `pomiar-C.out`, `pomiar-C-kopia.out`, tabela werdyktów kopii `czesci/03_tabela-kopia.md`).

**Liczby zbiorcze HEAD → kopia robocza (198 porad dla dziecka):**

| miara | HEAD `596d4aa` | kopia robocza |
|---|---|---|
| „Wizkor mówi/szepcze…” czytane liskiem | 63 | 57 |
| „A czy wiesz” | 19 | 17 |
| etykieta profilu w treści | 31 | 28 |
| „pamiętaj/musisz” | 2 | 4 (nowe: LD-D10-S1 „Pamiętaj, żeby”) |
| jakikolwiek znacznik moralizowania | 94 | 90 |
| konkretna czynność / z widocznym końcem | 119 / 60 | 122 / 60 |
| bez czynności | 48 | 45 |
| cyfry w TTS | 5 | 3 (zdjęte LD-D10, LD-D30-S1, ST-D09; **nowa ST-D12-S2-LUKA**) |
| formy o dziecku bez tokenu | 14 | 15 (zdjęty ukośnik LD-D21; **nowe „chciałbyś” LD-D09-S3**) |
| ukośniki | 1 | 0 |
| bez polskich znaków w treści | 20 | **0**; w tytule nadal 14 (EM-D01, D03, D07, D08, D09, D10, D11, D12, D16, D21, D22, D25, D26, D30) |
| tytuł > 28 znaków | 51 | 50 |
| treść: średnio / maks. | 134 / 194 | 135 / **243** (EM-D04-S1 199, ST-D12-S2-LUKA 243) |
| wzorce technik: pseudonauka / produktywność / wygląd | 3 / 2 / 3 | 2 / 1 / 4 (wygląd: EM-D30-S3 „Cała, piękna” liczy się dopiero z ogonkami — na HEAD było to samo, heurystyka nie widziała) |
| krainy wycofane / artefakty spoza kanonu | 28 / 10 | 28 / 10 (bez zmian) |
| tekst kłócący się z porą (symulacja 540 wyświetleń) | 87 | 85 |
| **werdykty** zostaje / poprawka / przepisać / wyciąć | 29 / 52 / 64 / 53 | **29 / 58 / 61 / 50** |
| szkodliwe (sekcja 2) | 40 | 37 (LD-D09-S3, LD-D10-S1, MD-D07-S1 przestają szkodzić; nadal 30 wyciąć + 7 przepisać) |

**Tabela per zmieniony id (34):**

| id | werdykt na HEAD | co zmieniła druga sesja | status | werdykt na kopii | uwaga |
|---|---|---|---|---|---|
| EM-D01-S1 | poprawka | polskie znaki w treści; tytuł nadal bez („W jakim kolorze jest dzis Twoje serce?”) | częściowo | **poprawka** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D03-S3 | przepisać | polskie znaki w treści; tytuł nadal bez („Muszla Echa szepcze przed snem”) | częściowo | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D04-S1 | poprawka | tytuł „Czego mi dziś trzeba?”, ogonki, „dłoń na klatce piersiowej”, dopisane „rozmowy” i „wybierz odpowiedź, która pasuje” | już naprawione | **zostaje** | treść 199 znaków — do przycięcia przy migracji na zapowiedź+krok |
| EM-D04-S2-NEW1 | przepisać | „Wizkor mówi” zdjęte; „czasem twarz robi się cieplejsza, czasem napinają się ręce albo brzuch. Sprawdź, gdzie ty czujesz dziś radość” | częściowo | **poprawka** | nadal „A czy wiesz”; poza tym zgodne z wejściem EM (emocje przez ciało) |
| EM-D06-S3 | przepisać | polskie znaki w treści; tytuł nadal bez („Fala dnia wraca do morza”) | częściowo | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D07-S1 | przepisać | polskie znaki w treści; tytuł nadal bez („Mozesz miec dzis inny kolor niz wczoraj”) | częściowo | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D09-S3 | poprawka | polskie znaki w treści; tytuł nadal bez („Swietlik nad lozkiem”) | częściowo | **poprawka** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D10-S1 | wyciąć | polskie znaki w treści; tytuł nadal bez („Twoje serce widzi to, czego oczy nie widza”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D11-S1 | przepisać | polskie znaki w treści; tytuł nadal bez („Wsluchaj sie jak w morze”) | częściowo | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D12-S3 | poprawka | polskie znaki w treści; tytuł nadal bez („Muszla Echa pamieta smiech”) | częściowo | **poprawka** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D13-S1 | wyciąć | polskie znaki w treści; tytuł nadal bez („Nie wszystko, co czujesz, jest Twoje”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D15-S3 | przepisać | polskie znaki w treści i w tytule | już naprawione (ogonki) | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty) |
| EM-D16-S1 | wyciąć | polskie znaki w treści; tytuł nadal bez („Twoje 'czuje' jest madroscia”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D17-S1 | poprawka | polskie znaki w treści; tytuł nadal bez („Trzy fale oddechu”) | częściowo | **poprawka** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D20-S1 | wyciąć | polskie znaki w treści i w tytule | już naprawione (ogonki) | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty) |
| EM-D21-S3 | wyciąć | polskie znaki w treści; tytuł nadal bez („Muszla Echa przyjmuje sekret”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D22-S1 | wyciąć | polskie znaki w treści; tytuł nadal bez („Mozesz dzis byc w swoim tempie”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D24-S3 | przepisać | obietnica snu zdjęta; „zrób tak kilka razy i zobacz, czy ciało robi się spokojniejsze” | częściowo | **poprawka** | nadal „szum morza” (kraina) i „kilka razy” bez końca — dać „trzy fale” |
| EM-D25-S1 | wyciąć | polskie znaki w treści; tytuł nadal bez („Mozesz prosic o pomoc”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D26-S1 | przepisać | polskie znaki w treści; tytuł nadal bez („Muszla Echa zna Twoje imie”) | częściowo | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D27-S3 | przepisać | polskie znaki w treści; tytuł nadal bez („Morze odplywa razem z dniem”) | częściowo | **przepisać** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D28-S1 | poprawka | polskie znaki w treści; tytuł nadal bez („Trzy kolory dnia”) | częściowo | **poprawka** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| EM-D30-S3 | wyciąć | polskie znaki w treści; tytuł nadal bez („Muszla Echa pamieta wszystko”) | częściowo | **wyciąć** | werdykt merytoryczny bez zmian (test `polskie-znaki` domknięty w treści, nie w tytule) |
| KR-D13-S2-NEW3 | przepisać | „Wizkor mówi” i „najsłynniejsi malarze” zdjęte; „Zrób kilka swobodnych kresek bez planu i zobacz, czy przypominają ci jakiś kształt” | już naprawione | **poprawka** | koniec słaby („kilka”) — dać „aż jedna przypomni ci coś” |
| LD-D01-S1 | przepisać | tylko tytuł „Pierwszy krok dnia” | nadal | **przepisać** | „mały Śmiałku” bez tokenu, „serce podpowie” bez czynności |
| LD-D09-S3 | wyciąć | maksyma i cytat zdjęte; „Pomyśl dziś o jednej rzeczy, którą chciałbyś kiedyś zrobić” | częściowo (nowy problem) | **przepisać** | przestaje być szkodliwa; nowy: „chciałbyś” bez tokenu; tylko wyobraźnia, bez ciała — moja wersja w §7 (skoki i cisza) zostaje jako propozycja |
| LD-D10-S1 | wyciąć | „75%” i „traci blask grzywy” zdjęte; „Woda jest potrzebna… Pamiętaj, żeby regularnie się napić” | częściowo (nowy problem) | **przepisać** | przestaje zawstydzać; nowy: „Pamiętaj, żeby” (zakazane), brak czynności z końcem — moja wersja w §7 (woda cieplejsza od dłoni) zostaje |
| LD-D21-S1 | wyciąć | ukośnik → token w tytule | nadal | **wyciąć** | licznik „trzy tygodnie ze mną” i porównanie z początkiem zostały; moja wersja w §7 zostaje |
| LD-D30-S1 | przepisać | „20 godzin” i „Śmiałkowie wiedzą” zdjęte; „Ty też potrzebujesz odpoczynku, żeby mieć siłę na ruch, zabawę i naukę” | częściowo | **przepisać** | cyfra i etykieta domknięte; nadal bez czynności |
| MD-D07-S1 | wyciąć | maksyma o „ojczyźnie” zdjęta; „Zatrzymaj się na chwilę i posłuchaj: jaki jest najcichszy dźwięk, który teraz słyszysz?” | już naprawione | **poprawka** | czynność z końcem; dubluje MD-D09-S1 (dźwięk do końca) i DT-D21 — moją wersję z §7 (jedna rzecz wzrokiem) **wycofuję jako zbędną**, zostawiam w JSON jako zapas na wypadek deduplikacji |
| ST-D03-S1 | przepisać | „mędrcy w starożytności” i obietnica zdjęte; „Wizkor mówi: spróbuj policzyć pięć spokojnych oddechów. Jeden… pięć” | częściowo | **poprawka** | nadal cytat Wizkora czytany liskiem i tytuł „Poranki w górach” (kraina) |
| ST-D09-S2-NEW7 | przepisać | „około 80 razy” i „Myśliciel lubi” zdjęte; „Możesz przez chwilę policzyć swoje uderzenia” | częściowo | **poprawka** | nadal „A czy wiesz”; czynność bez końca („do dziesięciu”) |
| ST-D12-S2-LUKA | zostaje | dopisane „Burzę zawsze obserwuj z bezpiecznego miejsca” (dobrze) i „orientacyjnie”; cyfry „3 sekundy”, „1 kilometrowi” | nowy problem | **poprawka** | cyfry w TTS (HEAD miał słownie „trzy sekundy”, „kilometr”); „orientacyjnie” to język dorosły |
| ST-D25-S2-LUKA | wyciąć | „Wizkor radzi” zdjęte | nadal | **wyciąć** | obowiązek domowy w kostiumie („odstawić kubek, zamknąć szufladę… załatwić od razu”) został; moja wersja w §7 zostaje |

Podsumowanie: druga sesja zmieniła status **10 z 34** moich werdyktów (wyciąć→przepisać: LD-D09-S3, LD-D10-S1; wyciąć→poprawka: MD-D07-S1; przepisać→poprawka: EM-D24-S3, ST-D03-S1, ST-D09-S2-NEW7, EM-D04-S2-NEW1, KR-D13-S2-NEW3; poprawka→zostaje: EM-D04-S1; **zostaje→poprawka: ST-D12-S2-LUKA — regres, cyfry w TTS**). 20 zmian to same ogonki w treści (werdykt bez zmian; 14 tytułów nadal bez ogonków). Żadna zmiana nie dotknęła krain, artefaktów, „Wizkor mówi” w 57 wpisach ani siatki pór.

**Pozostałe dwa pliki:**
- `porady-zdrowia.v1.json` (7 z 16 zmienionych): `woda`, `oddech`, `dwor`, `przekaska`, `ramiona`, `usmiech`, `sluchawki`. Policzone skryptem na obu wersjach: myśli z czasownikiem rozkazującym **HEAD 6 z 16 → kopia robocza 11 z 16** (nowo rozkazujące: `woda` „Napij się”, `oddech` „Weź”, `przekaska` „Dodaj”, `usmiech` „Uśmiechnij się”, `sluchawki` „Ścisz”; `ramiona` „Zakręć” było już w HEAD; `dwor` bez czasownika). To wbrew nocie w tym samym pliku (`:3` „tryb zapraszający zamiast rozkazującego”) i roli Wizkora w trybie spokojnym (jedna myśl, bez zlecenia — sekcja 3 promptu, §4.5). „Uśmiechnij się do siebie w lustrze i zobacz, jak zmienia się twoja twarz” nadal jest lustrem i wyglądem. `przerwa` („po dłuższym patrzeniu w ekran należy ci się przerwa” po 75 s) bez zmian.
- `poradaDnia.js:56`: zapowiedź „Trzy ruchy: łapki, barki i głowa. Poruszamy nimi chwilę i strząsamy napięcie. Gotowy?” — nadal „Gotowy?” bez tokenu; odzewy „Dobra robota”, „Masz bystre oczy”, „Kto pierwszy zobaczy?” (`:39–57`) bez zmian.

**Konsekwencje dla tego dokumentu:** tabela w §3.2 i sekcja 2 opisują HEAD; werdykty na kopii są w kolumnie wyżej i w `czesci/03_tabela-kopia.md`. W §7 przy pięciu przepisanych poradach (LD-D09-S3, LD-D10-S1, LD-D21-S1, ST-D25-S2-LUKA, MD-D07-S1) stoi adnotacja „druga sesja poprawiła…”; MD-D07-S1 wycofuję jako zbędną (kopia spełnia standard po drobnej poprawce). Do `06`: dwie sesje piszą do tych samych wpisów bez wspólnego standardu — do czasu przyjęcia §4 wstrzymać punktowe poprawki w `dailyTipsData.js` i **nie uruchamiać** `scripts/migrate-tips-to-tasks.mjs` (nadpisze kopię roboczą).

## 2. Szkodliwe — imiennie

Poniższe porady są dziś na produkcji i czyta je lisek dziecku. Każda łamie regułę well-being albo bezpieczeństwa z sekcji 4 promptu. Werdykt „wyciąć” = nowa treść w sekcji 7; „przepisać” = rdzeń do uratowania, tekst do napisania.

| id | plik:linia | cytat | dlaczego szkodzi | werdykt |
|---|---|---|---|---|
| EM-D13-S1 | `dailyTipsData.js:1917` | „Jesli rano jest Ci dziwnie smutno bez powodu - moze to nie Twoje. Moze ktos obok sie martwi.” | relatywizuje własne uczucia dziecka; uczy szukać ich źródła u innych | wyciąć |
| MD-D22-S1 | `:6292` | „Czy to moje, czy ktoś mi to dał? … nie wszystko, co czujesz, jest Twoje” | jw.; resztka „mediatora” MD | wyciąć |
| MD-D14-S1 | `:5972` | „Cudze nastroje mogą po nim spływać, jak deszcz po liściu” | dziecko jako filtr cudzych emocji | wyciąć |
| EM-D10-S1 | `:1797` | „Twoje serce wie, jak naprawde ktos sie czuje. To Twoj dar.” | obarcza dziecko czytaniem uczuć innych; pseudonauka | wyciąć |
| EM-D14-S2-LUKA | `:7325` | „Czasem ktoś obok jest smutny i nic na to nie poradzisz … Możesz po prostu być blisko i milczeć” | porada czeka na cudzy smutek i sadza dziecko w roli opiekuna | wyciąć |
| MD-D12-S1 | `:5892` | „«Rozumiem», «opowiedz mi», «co czujesz», «dziękuję». Wybierz dzisiaj jedno z nich i użyj go” | zestaw narzędzi mediatora dla dorosłych | wyciąć |
| MD-D05-S1 | `:5611` | „Dzisiaj posłuchaj dwa razy więcej, niż mówisz.” | ucisza dziecko; moralizowanie | wyciąć |
| EM-D20-S1 | `:2137` | „Naukowcy mowia, ze powtarzane w glowie dobre slowa … Slowa to leki bez recepty.” | pseudonauka + afirmacja | wyciąć |
| KR-D30-S1 | `:4268` | „Naukowcy mówią, że w snach widzimy kolory, których na jawie nikt nie potrafi narysować. Wynalazcy noszą te kolory” | nieprawda podana jako nauka; etykieta | wyciąć |
| LD-D10-S1 | `:4650` | „Czy wiesz, że twój mózg składa się w 75% z wody? Śmiałek, który zapomina pić, traci blask grzywy.” | zawstydzanie, cyfra w TTS, etykieta | wyciąć |
| ST-D04-S2-NEW3 | `:6686` | „pszczoła rozróżnia tylko parę kolorów, ale potrafi liczyć do czterech” | fałsz (pszczoły widzą też ultrafiolet); bez czynności | przepisać |
| KR-D23-S2-NEW5 | `:7077` | „plastelina powstała przez przypadek” | nieprawda (to ciastolina); „Wizkor mówi” | przepisać |
| KR-D08-S2-NEW2 | `:7026` | „żarówka powstała, bo ktoś zapytał: jak zatrzymać światło w domu?” | zmyślona anegdota jako fakt | przepisać |
| EM-D22-S1 | `:2217` | „Powiedz sobie: 'ide swoim tempem, w swoim swietle'.” | afirmacja zamiast czynności | wyciąć |
| ST-D28-S1 | `:3139` | „Twoje dzisiejsze zdanie: idę krok po kroku.” | afirmacja | wyciąć |
| ST-D17-S3 | `:2899` | „Twoja dzisiejsza lampka to jedno dobre słowo o sobie. Powiedz je.” | afirmacja | wyciąć |
| LD-D03-S1 | `:4370` | „zacznij dzień od myśli: «dziś jestem dla kogoś» … Tarcza Słońca rozgrzewa twoją pierś” | afirmacja + artefakt spoza kanonu | wyciąć |
| LD-D26-S1 | `:5270` | „Wystarczy, że będziesz sobą. Tyle.” | afirmacja jako „szept Wizkora” | wyciąć |
| EM-D24-S3 | `:2297` | „Piec fal i juz jestes w glebokim, cieplym snie.” | obietnica efektu (sen) | przepisać |
| DT-D19-S3 | `:932` | „jej kosmyki niosą twoje zmartwienia daleko. Jutro polana będzie czysta.” | obietnica efektu, sama wyobraźnia | wyciąć |
| ST-D08-S1-NEW6 | `:6737` | „narysuj w głowie jedną strzałkę … Reszta drogi sama się ułoży.” | obietnica efektu | wyciąć |
| EM-D15-S3 | `:1997` | „Jedno slowo, ktore chcesz tam zostawic, plynie i wraca jutro lzejsze.” | obietnica efektu | przepisać |
| LD-D06-S1 | `:4490` | „Ciało powie sercu: «jestem gotowy». I dzień zacznie się dobrze.” | obietnica efektu; wołacz bez tokenu | przepisać |
| ST-D03-S1 | `:2578` | „Pięć wdechów potrafi spowolnić cały świat.” | obietnica efektu; „mędrcy w starożytności” | przepisać |
| LD-D18-S1 | `:4950` | „Dziś idę bez krzyku … Lwia grzywa nie musi ryczeć.” | wersja „nie złość się” | wyciąć |
| LD-D21-S1 | `:5070` | „Trzy tygodnie — gdzie urosłaś/urosłeś? … zauważ jedną rzecz, w której jesteś inaczej niż na początku” | licznik stażu, porównanie z własnym „wczoraj”, ukośnik | wyciąć |
| EM-D30-S3 | `:2517` | „Trzydziesci dni razem … Posluchaj - to Ty. Cala, piekna.” | licznik stażu, ocena wyglądu, forma żeńska bez tokenu | wyciąć |
| LD-D15-S1 | `:4830` | „Połowa drogi za nami, Śmiałku.” | licznik stażu | wyciąć |
| LD-D30-S3 | `:5430` | „kończymy 30 dni. Pamiętaj … Idziesz pierwszy — nie z pychy, z troski.” | licznik, „pamiętaj”, cyfra, artefakt | wyciąć |
| ST-D18-S3-NEW15 | `:6890` | „liczenie dni dodaje im wartości” | licznik dni jako mądrość | wyciąć |
| DT-D12-S3 | `:617` | „Ile sekund wytrzymasz, zanim usłyszysz najcichszy dźwięk?” | wyścig z samym sobą | przepisać |
| LD-D19-S3 | `:5010` | „Wizkor patrzy z chmury i widzi twój dzień” | obraz nadzoru | wyciąć |
| LD-D08-S1 | `:4570` | „Powiedzieć «dzień dobry» pani, której się boisz — to też odwaga.” | pcha dziecko do dorosłego, którego się boi | wyciąć |
| EM-D25-S1 | `:2317` | „Dorosly obok Ciebie chce pomoc. Powiedz dzis, gdy cos jest za trudne.” | zakłada bezpiecznego dorosłego; „Pamietaj” | wyciąć |
| EM-D21-S3 | `:2197` | „jeden sekret z dnia. Nikomu nie musisz mowic. Muszla Echa go pilnuje.” | uczy trzymania sekretów przed dorosłymi — sprzeczne z zasadami ochrony dzieci | wyciąć |
| DT-D08-S1 | `:386` | „Spójrz w lustro … Czy twoje oczy są takie same jak wczoraj? A włosy?” | uwaga na wygląd | wyciąć |
| ST-D17-S1-NEW14 | `:6873` | „zacząć od trudniejszej rzeczy, gdy głowa jest świeża … Myśliciel wie” | poradnik produktywności dla dorosłych | wyciąć |
| ST-D25-S2-LUKA | `:7530` | „jeśli coś zajmuje mniej niż minutę, zrób to od razu. Odstawiony kubek, zamknięta szuflada.” | obowiązek domowy w kostiumie | wyciąć |
| LD-D25-S1 | `:5230` | „Co jest DOBRE. Tam jest twój kompas.” | kazanie bez czynności | wyciąć |
| EM-D16-S1 | `:2017` | „Dorosli czasem zapominaja … Ty pamietaj.” | pouczenie, ustawia dziecko przeciw dorosłym | wyciąć |

**Razem 40 porad z realną szkodą** (33 wyciąć, 7 przepisać) na HEAD; w kopii roboczej drugiej sesji 37 — LD-D09-S3, LD-D10-S1 i MD-D07-S1 przestają szkodzić (szczegóły §1.5). Osobna grupa, nieszkodliwa, ale sprzeczna z kanonem `docs/SWIAT_I_POSTACIE.md`: 10 porad z artefaktami spoza kanonu (Muszla Echa, Tarcza Słońca, Kompas Cieni), 28 z opisami wycofanych krain, 1 z postacią spoza kanonu (DT-D23-S3 „stara sowa, która zbiera pytania”) — wszystkie ujęte w tabeli.

Do zgłoszenia autorowi od razu (szkoda dziś na produkcji): EM-D21-S3 (sekret), EM-D13-S1 / MD-D22-S1 / MD-D14-S1 (relatywizacja uczuć), LD-D08-S1 (dorosły, którego się boi), EM-D25-S1 (zakłada bezpiecznego dorosłego), LD-D10-S1 (zawstydzanie).

## 3. Audyt 198 porad

### 3.1 Statystyki z pomiaru

| werdykt | razem | DT | EM | ST | KR | LD | MD |
|---|---|---|---|---|---|---|---|
| zostaje | **29** | 6 | 1 | 1 | 15 | 0 | 6 |
| poprawka | **52** | 15 | 7 | 8 | 5 | 4 | 13 |
| przepisać | **64** | 7 | 15 | 19 | 6 | 13 | 4 |
| wyciąć | **53** | 6 | 9 | 8 | 7 | 16 | 7 |

Odczyt profilami:
- **KR** jest najzdrowszy (15 zostaje): wyobraźnia z jedną odpowiedzią na głos. Wypadają wyłącznie wpisy o pustyni i pseudonauka.
- **MD** po przepisaniu 17.09 ma dobry rdzeń (oddech, jedna rzecz, kamyk na dłoni), ale 13 poprawek to jeden i ten sam błąd: „Wizkor mówi/szepcze” czytane przez liska. Zostały 2 wpisy o cudzych emocjach.
- **LD** nie ma ani jednej porady do zostawienia bez zmian: 16 wyciąć (afirmacje, artefakty, liczniki, nadzór), 13 przepisać. To profil do przebudowy w całości (sekcja 5.3).
- **ST** ma 19 „przepisać”: ciekawostki „A czy wiesz” bez czynności i plany „w głowie” z cytatem Wizkora; rdzeń (liczenie, porządek) jest dobry.
- **EM** ma 20 wpisów bez polskich znaków i 13 osadzonych w wycofanym „morzu”; po poprawkach zostaje solidne wejście przez ciało i kolor.
- **DT** jest najbliżej standardu (trop, obserwacja), przeważają poprawki „dopisać widoczny koniec”.

Etap (ocena ręczna języka): **oba 150 · 4–8 30 · 1–3 18**. Żadna porada nie ma wariantu drugiego etapu; obok siebie leżą „pluszak” (KR-D26-S1) i „plan B jak u żeglarzy” (ST-D20-S3-NEW16).

Duplikaty i niemal-duplikaty (42 pary ze skryptu, potwierdzone 16 motywów): kolor nastroju/serca ×6 (EM-D01, EM-D28, KR-D03, KR-D07, KR-D29, MD-D04), dłoń przy uchu ×3, niebo za oknem ×3 (DT-D03, D09, D17), „powiedzieć nie” ×3 (EM-D23, LD-D04, LD-D11), lew odpoczywa ×2, mrówki ×2, sowa ×2, pytanie do zabrania ×4. Wskazane w kolumnie „test oblany” jako `duplikat`.

Zgodność z porą: patrz 1.2 — problem leży w siatce (MD 30/0/0, KR 25/8/0, LD 21/9/3), nie w pojedynczych tekstach. Rozwiązanie w standardzie (4.4) i w 12 nowych poradach (8 z 12 obsadza puste pory: KR i MD dostają pierwsze wieczorne, MD pierwszą południową).

### 3.2 Tabela werdyktów (198)

Kolumna „test oblany” łączy tagi skryptu i ocenę ręczną. Skróty: `brak-konca` = czynność bez widocznego końca; `cytat-wizkora` = lisek czyta „Wizkor mówi…”; `etykieta` = nazwa profilu w treści; `kanon-*` = miejsce/przedmiot/postać spoza `SWIAT_I_POSTACIE.md`; `polskie-znaki` = tekst bez ogonków.


| id | profil | dzień | pora | etap | werdykt | test oblany | jedno zdanie |
|---|---|---|---|---|---|---|---|
| DT-D01-S1 | DT | 1 | rano | oba | **poprawka** | brak-konca, maksyma | Sufit i porównanie z wczoraj są dobre; ostatnie zdanie to maksyma do wycięcia. |
| DT-D03-S1 | DT | 3 | rano | oba | **poprawka** | brak-konca | Wyjrzenie za okno jest czynnością, ale bez końca — dodać „aż jedna chmura zniknie za ramą”. |
| DT-D04-S3 | DT | 4 | wieczór | oba | **zostaje** | — | Wdech nosem, wydech ustami, trzy razy — technika poprawna, obraz mgły pasuje do wieczoru. |
| DT-D05-S1 | DT | 5 | rano | oba | **poprawka** | brak-konca, maksyma | Dobra obserwacja pokoju; dopisać „jedną rzecz” i wyciąć „uważne oko widzi”. |
| DT-D06-S3 | DT | 6 | wieczór | 4-8 | **przepisać** | bez-czynnosci | Słoje drzewa to dobra ciekawostka, ale porada nie każe nic zrobić. |
| DT-D07-S1 | DT | 7 | rano | 1-3 | **poprawka** | brak-konca, etykieta, infantylizm | Sprawdzenie głodu w brzuchu jest w porządku; wyciąć „Odkrywca zna” i „brzuszek”. |
| DT-D08-S1 | DT | 8 | rano | oba | **wyciąć** | brak-konca, wyglad | Poranne oglądanie twarzy i włosów w lustrze kieruje uwagę na wygląd — temat zakazany. |
| DT-D09-S3 | DT | 9 | wieczór | oba | **poprawka** | brak-konca, duplikat | Trzecia porada o kolorze nieba za oknem (D03, D17); dopisać koniec: „nazwij kolor jednym słowem”. |
| DT-D10-S1 | DT | 10 | rano | 4-8 | **przepisać** | brak-konca, maksyma, tylko-wyobraznia | Pytanie do siebie bez żadnej czynności i z ogonem „pytanie zna swoją drogę”. |
| DT-D11-S3 | DT | 11 | wieczór | oba | **wyciąć** | bez-czynnosci, niezrozumiale, tylko-wyobraznia | Gwiazdy, z których każda „zna jedną odpowiedź” — nie wiadomo, co dziecko ma zrobić. |
| DT-D12-S1 | DT | 12 | rano | oba | **poprawka** | brak-konca | Słuchanie domu jest dobre; dopisać „znajdź trzy dźwięki”. |
| DT-D12-S3 | DT | 12 | wieczór | oba | **przepisać** | brak-konca, wyscig | „Ile sekund wytrzymasz” zamienia ciszę w zawody; rdzeń (najcichszy dźwięk) zostaje. |
| DT-D14-S1 | DT | 14 | rano | oba | **poprawka** | brak-konca, maksyma, wykluczenie | Zakłada kwiatka w domu bez wersji zapasowej; „tak jak ty” do wycięcia. |
| DT-D15-S3 | DT | 15 | wieczór | oba | **wyciąć** | niezrozumiale, tylko-wyobraznia | Krzyczenie „kim jestem?” do wyimaginowanego echa — bez czynności i bez sensu dla dziecka. |
| DT-D17-S1 | DT | 17 | rano | oba | **poprawka** | brak-konca, duplikat | Pogoda kontra nastrój jest w porządku (emocje bez zwierzeń); dopisać widoczny koniec. |
| DT-D17-S3 | DT | 17 | wieczór | oba | **zostaje** | afirmacja, brak-konca | Koc, ciężar, cztery oddechy, zamknięcie dnia — uziemienie zmysłami, pora zgodna. |
| DT-D19-S1 | DT | 19 | rano | oba | **poprawka** | brak-konca | Oglądanie dłoni to dobre uziemienie; „sprawdzaj ją czasem” zamienić na „policz linie na jednej dłoni”. |
| DT-D19-S3 | DT | 19 | wieczór | oba | **wyciąć** | obietnica-efektu, tylko-wyobraznia | Mgła „niesie zmartwienia daleko, jutro polana będzie czysta” — obietnica bez czynności. |
| DT-D20-S3 | DT | 20 | wieczór | oba | **poprawka** | maksyma, tylko-wyobraznia, zaklada-rodzine | Trzy zapachy dnia są dobre; wyciąć „może mama” i ogon o pamięci. |
| DT-D22-S3 | DT | 22 | wieczór | oba | **poprawka** | brak-konca | Pytanie pod poduszkę — dopisać czynność: „powiedz je szeptem jeden raz”. |
| DT-D23-S3 | DT | 23 | wieczór | oba | **wyciąć** | kanon-postac | „Stara sowa zbierająca pytania” to postać spoza kanonu (sowa jest tylko zwierzęciem profilu ST). |
| DT-D24-S3 | DT | 24 | wieczór | oba | **poprawka** | bez-czynnosci, duplikat, maksyma | Dźwięk dnia — jak D20 z zapachami; wyciąć ogon „dźwięki są jak ślady”. |
| DT-D25-S1 | DT | 25 | rano | oba | **zostaje** | brak-konca | Plama słońca na ścianie — konkretna obserwacja z jutrzejszym sprawdzeniem. |
| DT-D26-S3 | DT | 26 | wieczór | 1-3 | **poprawka** | brak-konca | Światełko w piersi z oddechem jest bezpieczne dla młodszych; dopisać „trzy oddechy”. |
| DT-D27-S3 | DT | 27 | wieczór | oba | **wyciąć** | bez-czynnosci, kanon-przedmiot | Kompas Cieni nie istnieje w grze; porada tylko o artefakcie. |
| DT-D28-S1 | DT | 28 | rano | oba | **zostaje** | brak-konca | Nazwanie nastroju jednym słowem, bez zwierzeń — poprawne nazywanie emocji. |
| DT-D30-S1 | DT | 30 | rano | oba | **przepisać** | bez-czynnosci, cyfra, etykieta | „270 stopni” w TTS i „Odkrywcy uczą się”; ciekawostka bez czynności. |
| EM-D01-S1 | EM | 1 | rano | oba | **poprawka** | polskie-znaki | Kolor serca po jednym oddechu — dobre wejście EM; brak polskich znaków. |
| EM-D02-S1 | EM | 2 | rano | oba | **przepisać** | bez-czynnosci, polskie-znaki | Maksyma o falach dobrych słów bez żadnej czynności. |
| EM-D03-S3 | EM | 3 | wieczór | 1-3 | **przepisać** | kanon-przedmiot, polskie-znaki, tylko-wyobraznia | Jedno wspomnienie z dnia jest dobre; Muszla Echa to artefakt spoza kanonu. |
| EM-D04-S1 | EM | 4 | rano | oba | **poprawka** | brak-konca, polskie-znaki | Dłoń na sercu, „czego mi trzeba” — interocepcja bez zwierzeń; brak polskich znaków. |
| EM-D06-S3 | EM | 6 | wieczór | 1-3 | **przepisać** | polskie-znaki, tylko-wyobraznia | Fala zabierająca trudne rzeczy — sama wyobraźnia; dołożyć wydech jako falę. |
| EM-D07-S1 | EM | 7 | rano | oba | **przepisać** | bez-czynnosci, polskie-znaki | „Możesz mieć dziś inny kolor” — pocieszenie bez czynności. |
| EM-D08-S1 | EM | 8 | rano | oba | **przepisać** | brak-konca, kanon-przedmiot, polskie-znaki | Dłoń przy uchu, oddech, serce — dobre uziemienie; tytuł i „Muszla Echa” do zmiany. |
| EM-D09-S3 | EM | 9 | wieczór | 1-3 | **poprawka** | brak-konca, polskie-znaki, tylko-wyobraznia | Świetlik nad łóżkiem — dopisać „przypomnij jeden ciepły moment”. |
| EM-D10-S1 | EM | 10 | rano | oba | **wyciąć** | brak-konca, polskie-znaki, praca-emocjonalna, pseudonauka | „Twoje serce wie, jak naprawdę ktoś się czuje. To Twój dar” — dziecko jako czytnik cudzych uczuć. |
| EM-D11-S1 | EM | 11 | rano | oba | **przepisać** | bez-czynnosci, polskie-znaki, tylko-wyobraznia | Fale spokojne czy wzburzone — bez ciała; dołożyć dłoń na brzuchu. |
| EM-D12-S3 | EM | 12 | wieczór | oba | **poprawka** | kanon-przedmiot, polskie-znaki | Przypomnienie jednego śmiechu z dnia jest dobre; wyciąć Muszlę. |
| EM-D13-S1 | EM | 13 | rano | oba | **wyciąć** | afirmacja, brak-konca, polskie-znaki, praca-emocjonalna, relatywizacja | „Nie wszystko, co czujesz, jest Twoje” — uczy podważać własne uczucia i szukać ich u innych. |
| EM-D15-S3 | EM | 15 | wieczór | oba | **przepisać** | bez-czynnosci, obietnica-efektu, polskie-znaki, wyglad | Słowo zostawione na wodzie „wraca jutro lżejsze” — obietnica; dołożyć wydech. |
| EM-D16-S1 | EM | 16 | rano | oba | **wyciąć** | bez-czynnosci, moralizowanie, polskie-znaki, tylko-wyobraznia | „Dorośli zapominają… Ty pamiętaj” — pouczenie bez czynności. |
| EM-D17-S1 | EM | 17 | rano | oba | **poprawka** | obietnica-efektu, polskie-znaki | Trzy fale oddechu są dobre; wyciąć „już jesteś na brzegu dnia”. |
| EM-D20-S1 | EM | 20 | rano | oba | **wyciąć** | afirmacja, bez-czynnosci, obietnica-efektu, pseudonauka | „Słowa to leki bez recepty” i „naukowcy mówią” — pseudonauka plus afirmacja. |
| EM-D21-S3 | EM | 21 | wieczór | oba | **wyciąć** | polskie-znaki, sekret, zwierzenia | Uczy trzymać sekret „nikomu nie musisz mówić” — sprzeczne z zasadami bezpieczeństwa dziecka. |
| EM-D22-S1 | EM | 22 | rano | oba | **wyciąć** | afirmacja, brak-konca, polskie-znaki | „Powiedz sobie: idę swoim tempem, w swoim świetle” — afirmacja zamiast czynności. |
| EM-D24-S3 | EM | 24 | wieczór | oba | **przepisać** | brak-konca, obietnica-efektu, polskie-znaki | Oddech-fala jest dobry; „pięć fal i już jesteś w głębokim śnie” to obietnica. |
| EM-D25-S1 | EM | 25 | rano | oba | **wyciąć** | brak-konca, etykieta, pamietaj, polskie-znaki, zaklada-doroslego | „Dorosły obok Ciebie chce pomóc”, „często pomagasz innym”, „Pamiętaj” — zakłada bezpiecznego dorosłego. |
| EM-D26-S1 | EM | 26 | rano | 1-3 | **przepisać** | brak-konca, kanon-przedmiot, polskie-znaki | Wypowiedzenie własnego imienia do dłoni — łagodne; Muszla do wycięcia. |
| EM-D27-S3 | EM | 27 | wieczór | 1-3 | **przepisać** | polskie-znaki, tylko-wyobraznia | Morze zabiera dzień — dołożyć ruch: wygładź dłonią koc jak piasek. |
| EM-D28-S1 | EM | 28 | rano | oba | **poprawka** | polskie-znaki, pora | Trzy kolory dnia z wieczornym sprawdzeniem — czynność z końcem. |
| EM-D30-S3 | EM | 30 | wieczór | oba | **wyciąć** | brak-konca, brak-tokenu, licznik-stazu, polskie-znaki, wyglad | „Trzydzieści dni razem”, „Cała, piękna” — licznik stażu, forma żeńska bez tokenu, ocena wyglądu. |
| ST-D03-S1 | ST | 3 | rano | oba | **przepisać** | bez-czynnosci, cytat-wizkora, niesprawdzone, obietnica-efektu | „Mędrcy w starożytności” i „pięć wdechów spowolni świat”; rdzeń (policz wdechy) dobry. |
| ST-D07-S3 | ST | 7 | wieczór | oba | **poprawka** | kanon-miejsce | Trzy światełka z dnia — wdzięczność bez przymusu; wyciąć „górską wioskę”. |
| ST-D10-S1 | ST | 10 | rano | oba | **wyciąć** | cytat-wizkora, tylko-wyobraznia | Most ze sznurów do przejścia w myślach — nic do zrobienia. |
| ST-D14-S3 | ST | 14 | wieczór | oba | **przepisać** | kanon-miejsce, tylko-wyobraznia | „Twoim skarbem może być spokój albo nowa myśl” — abstrakcja bez czynności. |
| ST-D17-S3 | ST | 17 | wieczór | oba | **wyciąć** | afirmacja, duplikat | „Jedno dobre słowo o sobie, powiedz je” — afirmacja; temat wieczoru pokrywa D11-S3. |
| ST-D21-S1 | ST | 21 | rano | 4-8 | **przepisać** | brak-konca, tylko-wyobraznia | Szczyty Wiem/Próbuję/Pytam — abstrakcja bez czynności. |
| ST-D24-S3 | ST | 24 | wieczór | oba | **przepisać** | cytat-wizkora | Wizkor jako postać w tekście liska; rdzeń (co było piękne) do ratowania z czynnością. |
| ST-D28-S1 | ST | 28 | rano | oba | **wyciąć** | afirmacja, bez-czynnosci | „Twoje dzisiejsze zdanie: idę krok po kroku” — afirmacja. |
| ST-D30-S1 | ST | 30 | rano | oba | **przepisać** | bez-czynnosci, etykieta | Mrówki i „Myśliciel patrzy na świat” — ciekawostka bez czynności. |
| KR-D01-S1 | KR | 1 | rano | 1-3 | **zostaje** | brak-konca | Śniadanie jako stworek — wyobraźnia z jedną odpowiedzią na głos. |
| KR-D03-S1 | KR | 3 | rano | 1-3 | **zostaje** | duplikat, tylko-wyobraznia | Kolor zapachu — synestezja dla młodszych; bliźniak D23 (zapach dnia). |
| KR-D05-S1 | KR | 5 | rano | oba | **wyciąć** | bez-czynnosci, kanon-miejsce | „Na pustyni piasek mówi szeptem” — kraina wycofana, brak czynności. |
| KR-D07-S1 | KR | 7 | rano | oba | **zostaje** | bez-czynnosci | Jeden kolor na cały dzień i szukanie go wokół — zauważanie z końcem dnia. |
| KR-D09-S1 | KR | 9 | rano | 1-3 | **zostaje** | — | Łóżko-rakieta i nazwa planety ze snu — jedno słowo na głos. |
| KR-D10-S1 | KR | 10 | rano | oba | **wyciąć** | bez-czynnosci, kanon-miejsce | Oaza z papierowymi liśćmi — kraina wycofana, „weź jeden pomysł” to nic. |
| KR-D12-S1 | KR | 12 | rano | oba | **zostaje** | bez-czynnosci | Szkoła na Marsie — jedno zdanie wystarczy. |
| KR-D13-S1 | KR | 13 | rano | oba | **zostaje** | brak-konca | Dźwięki poranka jako instrumenty — słuchanie z pytaniem. |
| KR-D15-S1 | KR | 15 | rano | oba | **wyciąć** | bez-czynnosci, kanon-miejsce | Miraż na pustyni — kraina wycofana, brak czynności. |
| KR-D16-S1 | KR | 16 | rano | 1-3 | **poprawka** | tylko-wyobraznia, wykluczenie | Zakłada drzewo za oknem — dodać „albo dowolne drzewo, które dziś zobaczysz”. |
| KR-D18-S1 | KR | 18 | rano | oba | **zostaje** | brak-konca | Cień tancerz — ruch ciała w świetle lampy, każdy dom. |
| KR-D19-S1 | KR | 19 | rano | 1-3 | **zostaje** | tylko-wyobraznia | Buty mówią — jedno zdanie ich głosem. |
| KR-D20-S1 | KR | 20 | rano | oba | **wyciąć** | bez-czynnosci, kanon-miejsce | Karawana wielbłądów z pomysłami — kraina wycofana. |
| KR-D21-S1 | KR | 21 | rano | oba | **przepisać** | a-czy-wiesz, bez-czynnosci | Rymy od tysięcy lat — bez czynności; dopisać rym do przedmiotu w zasięgu ręki. |
| KR-D23-S1 | KR | 23 | rano | oba | **poprawka** | duplikat, tylko-wyobraznia | Zapach dnia — bliźniak D03; zmienić zmysł (dźwięk albo dotyk). |
| KR-D25-S1 | KR | 25 | rano | oba | **przepisać** | kanon-miejsce | Wiatr pustyni — wycofać pustynię; słuchanie własnego oddechu zostaje. |
| KR-D26-S1 | KR | 26 | rano | 1-3 | **poprawka** | infantylizm, wykluczenie | Zakłada maskotkę; dodać wariant „albo kubek”. |
| KR-D27-S1 | KR | 27 | rano | oba | **zostaje** | brak-konca | Słowo, które brzmi jak smak — język i wyobraźnia. |
| KR-D28-S1 | KR | 28 | rano | oba | **zostaje** | brak-konca | Kształt snu — tokeny poprawne, jedno słowo w głowie. |
| KR-D29-S1 | KR | 29 | rano | oba | **zostaje** | brak-konca, duplikat | Kolor humoru zamiast „wesoły/zły” — emocje przez kolor; bliźniak EM-D01. |
| KR-D30-S1 | KR | 30 | rano | oba | **wyciąć** | bez-czynnosci, etykieta, pseudonauka | „Kolory, których nikt nie potrafi narysować” i „Wynalazcy noszą je” — nieprawda z etykietą. |
| LD-D01-S1 | LD | 1 | rano | oba | **przepisać** | brak-tokenu, etykieta | „Mały Śmiałku” bez tokenu; ręka na piersi zostaje, „serce podpowie” do zmiany na puls. |
| LD-D03-S1 | LD | 3 | rano | oba | **wyciąć** | afirmacja, brak-konca, brak-tokenu, etykieta, kanon-przedmiot | „Dziś jestem dla kogoś” i Tarcza Słońca — afirmacja z artefaktem spoza kanonu. |
| LD-D05-S1 | LD | 5 | rano | oba | **wyciąć** | kanon-przedmiot, tylko-wyobraznia | Tarcza Słońca w piersi — artefakt, którego nie ma, bez czynności. |
| LD-D06-S1 | LD | 6 | rano | oba | **przepisać** | brak-konca, brak-tokenu, etykieta, obietnica-efektu | Postawa ciała jest dobra; „dzień zacznie się dobrze” i „Śmiałku” do wycięcia. |
| LD-D07-S1 | LD | 7 | rano | 4-8 | **przepisać** | brak-konca, cytat-wizkora, etykieta | Pozwolić komuś wybrać — dobra mikropróba dla starszych; „tajemnica Wizkora” i „lider” do zmiany. |
| LD-D08-S1 | LD | 8 | rano | oba | **wyciąć** | brak-konca, brak-tokenu, etykieta, strach-dorosly | „Powiedz dzień dobry pani, której się boisz” — pcha dziecko do dorosłego, którego się boi. |
| LD-D09-S3 | LD | 9 | wieczór | oba | **wyciąć** | a-czy-wiesz, bez-czynnosci, cytat-wizkora | Marzenie pod chmurami „nigdy nie ginie” — maksyma. |
| LD-D10-S1 | LD | 10 | rano | oba | **wyciąć** | a-czy-wiesz, bez-czynnosci, cyfra, cytat-wizkora, etykieta, pseudonauka, zawstydzanie | „75%”, „traci blask grzywy” — zawstydzanie i cyfra w TTS. |
| LD-D12-S1 | LD | 12 | rano | oba | **przepisać** | tylko-wyobraznia | Słowo na sztandar — zamienić w rzecz: słowo na kartce w kieszeni. |
| LD-D13-S1 | LD | 13 | rano | oba | **przepisać** | brak-konca, brak-tokenu, etykieta | „Jeden krok odwagi. Zrobisz go i basta” — bez konkretu; mikroodwaga do dopisania. |
| LD-D15-S1 | LD | 15 | rano | oba | **wyciąć** | brak-konca, brak-tokenu, etykieta, licznik-stazu | „Połowa drogi za nami” — licznik stażu; siedzenie z oddechem ma już MD. |
| LD-D16-S1 | LD | 16 | rano | 4-8 | **przepisać** | brak-konca, brak-tokenu, etykieta, strach-dorosly | „Tam gdzie TRUDNO, ale DOBRZE” — abstrakcja; potrzebna jedna konkretna mikropróba. |
| LD-D17-S1 | LD | 17 | rano | oba | **wyciąć** | etykieta, kanon-miejsce, tylko-wyobraznia | Ognisko Śmiałków pod gwiazdami — lore grupy, bez czynności. |
| LD-D18-S1 | LD | 18 | rano | oba | **wyciąć** | brak-konca, brak-tokenu, etykieta, nie-zlosc-sie | „Dziś idę bez krzyku”, „grzywa nie musi ryczeć” — wersja „nie złość się”. |
| LD-D19-S3 | LD | 19 | wieczór | oba | **wyciąć** | cytat-wizkora, etykieta, nadzor, tylko-wyobraznia | Wizkor „patrzy z chmury i widzi twój dzień” — obraz nadzoru. |
| LD-D20-S1 | LD | 20 | rano | oba | **wyciąć** | bez-czynnosci, brak-konca, brak-tokenu, etykieta | Zbroja z gliny — metafora bez czynności. |
| LD-D21-S1 | LD | 21 | rano | oba | **wyciąć** | brak-tokenu, etykieta, licznik-stazu, porownanie, ukosnik, ukośnik | „Trzy tygodnie ze mną”, „urosłaś/urosłeś”, porównanie z początkiem. |
| LD-D22-S1 | LD | 22 | rano | oba | **przepisać** | brak-tokenu, duplikat, etykieta | Jedna rzecz powoli, dla siebie — dobre; „Śmiałek jak lew” i bliźniak D30-S1. |
| LD-D24-S1 | LD | 24 | rano | oba | **wyciąć** | bez-czynnosci, etykieta, tylko-wyobraznia | „Drużyna Śmiałków wokół ciebie” — grupa-etykieta, sama wyobraźnia. |
| LD-D25-S1 | LD | 25 | rano | oba | **wyciąć** | brak-konca, brak-tokenu, etykieta, moralizowanie | „Co jest DOBRE, nie co łatwe” — kazanie bez czynności. |
| LD-D26-S1 | LD | 26 | rano | oba | **wyciąć** | afirmacja, bez-czynnosci, cytat-wizkora, etykieta | „Wystarczy, że będziesz sobą” — afirmacja jako „szept Wizkora”. |
| LD-D27-S1 | LD | 27 | rano | oba | **przepisać** | brak-konca, etykieta | Spojrzenie w okno rano jest dobre; „wszystkich Śmiałków na świecie” do wycięcia, brak końca. |
| LD-D30-S1 | LD | 30 | rano | oba | **przepisać** | bez-czynnosci, cyfra, etykieta | „20 godzin” w TTS, „Śmiałkowie wiedzą” — ciekawostka bez czynności. |
| LD-D30-S3 | LD | 30 | wieczór | oba | **wyciąć** | bez-czynnosci, cyfra, etykieta, kanon-przedmiot, licznik-stazu, pamietaj | „Kończymy 30 dni. Pamiętaj… Tarcza Słońca… idziesz pierwszy” — wszystko naraz. |
| MD-D01-S1 | MD | 1 | rano | oba | **zostaje** | — | Trzy oddechy, stopy na podłodze po trzecim — wzorzec. |
| MD-D02-S1 | MD | 2 | rano | oba | **zostaje** | — | Obie strony przedmiotu, odłóż po obejrzeniu — skupienie z końcem, tokeny są. |
| MD-D03-S1 | MD | 3 | rano | 4-8 | **poprawka** | cytat-wizkora | Jedna rzecz naraz do końca — dobre; wyciąć „Wizkor szepcze”. |
| MD-D04-S1 | MD | 4 | rano | oba | **przepisać** | brak-konca, cytat-wizkora, duplikat, mediator | „Zanim zaczniesz mieszać go z innymi” — resztka mediatora; kolor nastroju ma EM/KR. |
| MD-D05-S1 | MD | 5 | rano | oba | **wyciąć** | cytat-wizkora, moralizowanie | „Posłuchaj dwa razy więcej, niż mówisz” — ucisza dziecko. |
| MD-D06-S1 | MD | 6 | rano | 1-3 | **poprawka** | brak-konca | Klepsydra z oddechem — dopisać „trzy razy”. |
| MD-D07-S1 | MD | 7 | rano | oba | **wyciąć** | bez-czynnosci, cytat-wizkora | „Cisza między uderzeniami serca to twoja ojczyzna” — maksyma. |
| MD-D08-S1 | MD | 8 | rano | 4-8 | **zostaje** | — | Klucz do jednych drzwi — wybór jednej rzeczy i domknięcie. |
| MD-D09-S1 | MD | 9 | rano | oba | **poprawka** | cytat-wizkora | Dźwięk aż całkiem ucichnie — dobre; wyciąć „Wizkor mówi”. |
| MD-D10-S1 | MD | 10 | rano | oba | **poprawka** | cytat-wizkora | Jeden długi wydech przed nową rzeczą — dobre; wyciąć „Wizkor szepcze”. |
| MD-D11-S1 | MD | 11 | rano | 4-8 | **przepisać** | obietnica-efektu, tylko-wyobraznia | „Z góry wszystko wygląda spokojniej, prawda?” — sugestia bez czynności. |
| MD-D12-S1 | MD | 12 | rano | oba | **wyciąć** | mediator | „Co czujesz”, „opowiedz mi” jako narzędzia do innych — resztka mediatora. |
| MD-D13-S1 | MD | 13 | rano | oba | **wyciąć** | literowka, tylko-wyobraznia | Waga w sercu „co przewazy” — bez czynności, z literówką. |
| MD-D14-S1 | MD | 14 | rano | oba | **wyciąć** | mediator, relatywizacja, tylko-wyobraznia | „Cudze nastroje spływają po płaszczu” — porada o cudzych emocjach (lista MD do dokończenia). |
| MD-D15-S1 | MD | 15 | rano | oba | **przepisać** | cytat-wizkora, kanon-miejsce, wyglad | Płomień między lustrami — zbyt złożony obraz; zostaje „patrz w jeden punkt, licząc do dziesięciu”. |
| MD-D16-S1 | MD | 16 | rano | 4-8 | **poprawka** | afirmacja, brak-konca, cytat-wizkora | Powtórzyć krótko, co ktoś powiedział — słuchanie; wyciąć „Wizkor mówi”. |
| MD-D17-S1 | MD | 17 | rano | oba | **poprawka** | cytat-wizkora | Jedna czynność najwolniej — wzorzec; wyciąć „Wizkor mówi”. |
| MD-D18-S1 | MD | 18 | rano | oba | **poprawka** | brak-konca, cytat-wizkora | Najwolniejsze kroki przez pokój — wzorzec; wyciąć „Wizkor szepcze”. |
| MD-D19-S1 | MD | 19 | rano | oba | **poprawka** | cytat-wizkora | Wieża z trzech rzeczy — ręce i koniec; wyciąć „Wizkor mówi”. |
| MD-D20-S1 | MD | 20 | rano | oba | **poprawka** | cytat-wizkora | Słowo na długim wydechu trzy razy — oddech, nie afirmacja; wyciąć „Wizkor zdradza sekret”. |
| MD-D21-S1 | MD | 21 | rano | oba | **wyciąć** | brak-konca, cytat-wizkora, tylko-wyobraznia | „Bądź jak piasek w klepsydrze” — maksyma. |
| MD-D22-S1 | MD | 22 | rano | oba | **wyciąć** | brak-konca, cytat-wizkora, mediator, relatywizacja | „Czy to moje, czy ktoś mi to dał? Nie wszystko, co czujesz, jest Twoje” — lista MD do dokończenia. |
| MD-D23-S1 | MD | 23 | rano | 1-3 | **zostaje** | — | Ręka jak wstążka, aż opadnie — powolny ruch z końcem. |
| MD-D24-S1 | MD | 24 | rano | 1-3 | **poprawka** | cytat-wizkora, obowiazek | Jedna zabawka do końca zabawy — dobre; wyciąć „Wizkor przypomina” i „odłóż na miejsce”. |
| MD-D25-S1 | MD | 25 | rano | oba | **zostaje** | brak-konca | Kamyk na dłoni od drzwi do okna — wzorzec. |
| MD-D26-S1 | MD | 26 | rano | 4-8 | **przepisać** | brak-konca, cytat-wizkora, mediator | Patrzenie na twarz mówiącego — słuchanie zostaje, „to, co najważniejsze, między słowami” do zmiany. |
| MD-D27-S1 | MD | 27 | rano | oba | **poprawka** | cytat-wizkora | Kredki po jednej do ostatniej — skupienie, nie sprzątanie; wyciąć „Wizkor mówi”. |
| MD-D28-S1 | MD | 28 | rano | oba | **poprawka** | cytat-wizkora | Pięć wydechów od nowa, gdy ucieknie — wzorzec; wyciąć „Wizkor mówi”. |
| MD-D29-S1 | MD | 29 | rano | oba | **poprawka** | afirmacja, cytat-wizkora | Wdech na cztery, wydech na sześć — wzorzec; wyciąć ogon „Wizkor mówi”. |
| MD-D30-S1 | MD | 30 | rano | oba | **zostaje** | — | Ośmiornica i palce jednej ręki po kolei — ciekawostka z czynnością. |
| ST-D02-S2-NEW1 | ST | 2 | południe | oba | **przepisać** | a-czy-wiesz, brak-konca, cytat-wizkora | „Znajdź jakąś trójkę, która się powtarza” — niejasne; obudowa do zdjęcia. |
| ST-D04-S1-NEW2 | ST | 4 | rano | 4-8 | **przepisać** | cytat-wizkora, tylko-wyobraznia | Plan trzech rzeczy w głowie — pomysł dobry, tekst to „Wizkor szepcze”. |
| ST-D04-S2-NEW3 | ST | 4 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, niesprawdzone | Pszczoła „rozróżnia parę kolorów” to nieprawda (widzi też ultrafiolet); brak czynności. |
| ST-D06-S1-NEW4 | ST | 6 | rano | oba | **przepisać** | cytat-wizkora, obietnica-efektu, tylko-wyobraznia | „Ten, który sobie wyobrazisz, łatwiej znajdziesz” — obietnica; brak czynności. |
| ST-D06-S2-NEW5 | ST | 6 | południe | 4-8 | **przepisać** | a-czy-wiesz, bez-czynnosci, maksyma | Historia zera bez czynności, „czasem nic jest najmądrzejsze”. |
| ST-D08-S1-NEW6 | ST | 8 | rano | oba | **wyciąć** | cytat-wizkora, obietnica-efektu | „Narysuj w głowie strzałkę, reszta drogi sama się ułoży” — obietnica bez czynności. |
| ST-D09-S2-NEW7 | ST | 9 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, cyfra, etykieta | „Około 80 razy” w TTS i „Myśliciel lubi”; rdzeń (policz uderzenia serca) do wzięcia. |
| ST-D11-S1-NEW8 | ST | 11 | rano | 4-8 | **przepisać** | cytat-wizkora, etykieta | „Myśliciel wie, że kolejność to plan” — etykieta; pomysł „jedno na początek” zostaje. |
| ST-D11-S3-NEW9 | ST | 11 | wieczór | oba | **poprawka** | cytat-wizkora | Trzy rzeczy, które się udały — dobre; wyciąć „Wizkor mówi: skarbiec”. |
| ST-D13-S1-NEW10 | ST | 13 | rano | oba | **wyciąć** | cytat-wizkora, maksyma, tylko-wyobraznia | Kompas w kieszeni i „kierunek cenniejszy niż prędkość” — sama maksyma. |
| ST-D13-S2-NEW11 | ST | 13 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci | Sześciokąty pszczół — prawda, ale bez czynności (znajdź sześciokąt w domu). |
| ST-D15-S1-NEW12 | ST | 15 | rano | oba | **przepisać** | cytat-wizkora, duplikat, maksyma, tylko-wyobraznia | „Najdłuższa droga zaczyna się od kroku” — maksyma; kroki ma już D01-S1-LUKA. |
| ST-D15-S3-NEW13 | ST | 15 | wieczór | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, etykieta | Mózg porządkuje we śnie — prawda, ale „Myśliciel odpoczywa” i brak czynności. |
| ST-D17-S1-NEW14 | ST | 17 | rano | oba | **wyciąć** | brak-konca, cytat-wizkora, etykieta, produktywnosc | „Zacznij od najtrudniejszego, gdy głowa świeża” — poradnik produktywności dla dorosłych. |
| ST-D18-S3-NEW15 | ST | 18 | wieczór | oba | **wyciąć** | cytat-wizkora, licznik, licznik-stazu, tylko-wyobraznia | „Liczenie dni dodaje im wartości” — licznik dni podany jako mądrość. |
| ST-D20-S3-NEW16 | ST | 20 | wieczór | 4-8 | **przepisać** | bez-czynnosci, cytat-wizkora | Plan B jako inna droga — dobra myśl bez czynności. |
| ST-D22-S1-NEW17 | ST | 22 | rano | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, etykieta, pora | Gwiazdozbiory rano, bez czynności, z etykietą. |
| ST-D26-S1-NEW18 | ST | 26 | rano | oba | **przepisać** | bez-czynnosci, cytat-wizkora | „Mapa jest też w tobie” — bez czynności; rysowanie planu drogi do wzięcia. |
| EM-D04-S2-NEW1 | EM | 4 | południe | oba | **przepisać** | a-czy-wiesz, brak-konca, cytat-wizkora | Gdzie w ciele mieszka radość — dobre wejście EM; obudowa „A czy wiesz/Wizkor mówi” do zdjęcia. |
| EM-D11-S2-NEW2 | EM | 11 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, cytat-wizkora | Uśmiech zaraźliwy — bez czynności; dla 4–8 „uśmiechnij się do kogoś” to wstyd. |
| EM-D19-S2-NEW3 | EM | 19 | południe | 4-8 | **przepisać** | bez-czynnosci, cytat-wizkora | „Wizkor szepcze: cisza to prezent” — maksyma bez czynności. |
| KR-D04-S2-NEW1 | KR | 4 | południe | 1-3 | **zostaje** | tylko-wyobraznia | Smak chmury — wyobraźnia z jedną odpowiedzią. |
| KR-D08-S2-NEW2 | KR | 8 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, cytat-wizkora, niesprawdzone | Anegdota o żarówce jest zmyślona; brak czynności. |
| KR-D13-S2-NEW3 | KR | 13 | południe | oba | **przepisać** | bez-czynnosci, cytat-wizkora | Bazgroły rozgrzewają — dopisać czynność: minuta kresek bez odrywania ręki. |
| KR-D17-S2-NEW4 | KR | 17 | południe | oba | **przepisać** | cytat-wizkora, niesprawdzone, tylko-wyobraznia | „Drzewa szepczą korzeniami — tak jest naprawdę” — uproszczenie podane jako pewnik. |
| KR-D23-S2-NEW5 | KR | 23 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, cytat-wizkora, niesprawdzone | Plastelina nie powstała przez przypadek (to ciastolina); brak czynności. |
| KR-D27-S2-NEW6 | KR | 27 | południe | oba | **wyciąć** | bez-czynnosci, cytat-wizkora, etykieta | „Wynalazca ćwiczy umysł zabawą” — etykieta i maksyma. |
| LD-D08-S2-NEW1 | LD | 8 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, cytat-wizkora | Serce bije szybciej, żeby dać siłę — prawda; dopisać czynność (poczuj puls, strząśnij). |
| LD-D14-S2-NEW2 | LD | 14 | południe | oba | **wyciąć** | bez-czynnosci, cytat-wizkora, etykieta | „Trzeci krok sam się robi” — maksyma z etykietą. |
| LD-D22-S2-NEW3 | LD | 22 | południe | 4-8 | **przepisać** | a-czy-wiesz, bez-czynnosci, cytat-wizkora | Cicho, ale pewnie — ćwiczenie głosu do wzięcia; obudowa do zdjęcia. |
| DT-D15-S2-NEW1 | DT | 15 | południe | oba | **przepisać** | a-czy-wiesz, bez-czynnosci, cytat-wizkora | Mrówki są dobrą ciekawostką, ale tekst to „A czy wiesz” + „Wizkor mówi” bez czynności. |
| DT-D02-S2-LUKA | DT | 2 | południe | oba | **poprawka** | cytat-wizkora | Najmniejsza rzecz w pokoju — wzorcowa czynność; wyciąć ogon „Wizkor mówi”. |
| DT-D13-S2-LUKA | DT | 13 | południe | 4-8 | **zostaje** | — | Pytanie noszone w kieszeni z wieczornym sprawdzeniem — czynność z końcem. |
| DT-D16-S2-LUKA | DT | 16 | południe | 4-8 | **przepisać** | bez-czynnosci, warunek | Paproć jest tylko „jeśli zobaczysz” — bez wersji dla dziecka bez paproci. |
| DT-D18-S2-LUKA | DT | 18 | południe | 4-8 | **poprawka** | brak-konca, cytat-wizkora | Liczenie drzew po znanej drodze jest dobre; wyciąć „Wizkor mówi”. |
| DT-D21-S2-LUKA | DT | 21 | południe | oba | **zostaje** | — | Najdalszy dźwięk aż ucichnie, powrót do oddechu — wzorzec. |
| DT-D29-S2-LUKA | DT | 29 | południe | oba | **przepisać** | cytat-wizkora, pora, tylko-wyobraznia | Południowa porada o tym, kto wstał rano; sama wyobraźnia plus „Wizkor mówi”. |
| EM-D05-S1-LUKA | EM | 5 | rano | oba | **przepisać** | cytat-wizkora, wstyd-4-8 | Komplement na głos i „zobacz, co zrobi jego twarz” — dla 4–8 wstyd, dla wszystkich instrumentalne. |
| EM-D14-S2-LUKA | EM | 14 | południe | oba | **wyciąć** | bez-czynnosci, cytat-wizkora, praca-emocjonalna | Porada czeka na czyjś smutek i sadza dziecko w roli tego, kto „jest blisko i milczy”. |
| EM-D18-S2-LUKA | EM | 18 | południe | 4-8 | **przepisać** | brak-konca, kanon-miejsce, wstyd-4-8 | „Zaproś go do siebie”, „bądź czyjąś latarnią” — niejasne i widowiskowe; rdzeń (usiąść obok kogoś z boku) dobry. |
| EM-D23-S2-LUKA | EM | 23 | południe | 4-8 | **zostaje** | tylko-wyobraznia | Wolno powiedzieć nie — pomyśleć o jednej rzeczy; asertywność bez zwierzeń. |
| EM-D29-S1-LUKA | EM | 29 | rano | 4-8 | **poprawka** | a-czy-wiesz, brak-konca | Zgadnięcie nastroju z ramion, potem pytanie — do przyjęcia dla starszych; zdjąć „A czy wiesz”. |
| ST-D01-S1-LUKA | ST | 1 | rano | oba | **poprawka** | brak-konca, cytat-wizkora | Policz kroki do drzwi — wzorzec; wyciąć „Wizkor szepcze”. |
| ST-D05-S2-LUKA | ST | 5 | południe | 4-8 | **poprawka** | bez-czynnosci, cytat-wizkora, obietnica-efektu | Pierwsza rzecz zamiast listy — dobre; wyciąć „Wizkor pyta”. |
| ST-D12-S2-LUKA | ST | 12 | południe | 4-8 | **zostaje** | — | Echo i sekundy między błyskiem a grzmotem — ciekawostka sprawdzona (dźwięk ok. 340 m/s) z czynnością. |
| ST-D16-S2-LUKA | ST | 16 | południe | 4-8 | **poprawka** | cytat-wizkora, tylko-wyobraznia | Droga od końca — dobra zmiana perspektywy; wyciąć „Wizkor podpowiada”. |
| ST-D19-S1-LUKA | ST | 19 | rano | 1-3 | **poprawka** | cytat-wizkora | Trzy pary i ile to sztuk — liczenie z końcem; wyciąć „Wizkor szepcze”. |
| ST-D23-S2-LUKA | ST | 23 | południe | 4-8 | **przepisać** | bez-czynnosci, brak-konca | Zakosy w górach — „poszukaj drogi, która kręci” nie ma końca ani miejsca. |
| ST-D25-S2-LUKA | ST | 25 | południe | oba | **wyciąć** | cytat-wizkora, obowiazek, produktywnosc | „Odstawiony kubek, zamknięta szuflada — zrób od razu” — obowiązek domowy w kostiumie. |
| ST-D27-S3-LUKA | ST | 27 | wieczór | 4-8 | **poprawka** | brak-tokenu, cytat-wizkora | „Sam na sam” bez tokenu i „Wizkor szepcze”; liczenie własnych decyzji zostaje. |
| ST-D29-S2-LUKA | ST | 29 | południe | 4-8 | **poprawka** | cytat-wizkora, obietnica-efektu | Jedna rzecz odłożona na jutro — pozwolenie, nie obowiązek; wyciąć „Wizkor mówi”. |
| KR-D02-S1-LUKA | KR | 2 | rano | oba | **zostaje** | — | Trzy przedmioty w nowym układzie i nazwa — ręce, materiał, koniec. |
| KR-D06-S1-LUKA | KR | 6 | rano | oba | **zostaje** | — | Nazwa dla czegoś bez nazwy — wzorzec. |
| KR-D11-S2-LUKA | KR | 11 | południe | oba | **poprawka** | kanon-miejsce | Dwie niepasujące rzeczy razem — dobre; wyciąć „warsztat pod wydmą”. |
| KR-D14-S1-LUKA | KR | 14 | rano | oba | **zostaje** | — | Zdanie z pięciu pierwszych słów dnia — ograniczenie i koniec. |
| KR-D22-S1-LUKA | KR | 22 | rano | oba | **poprawka** | wykluczenie | Zakłada „swój pokój” — zmienić na „pokój, w którym śpisz”. |
| KR-D24-S2-LUKA | KR | 24 | południe | oba | **wyciąć** | kanon-miejsce, niezrozumiale, tylko-wyobraznia | Nocna mapa pustyni i nazwa miejsca „które chcesz tam znaleźć” — kraina wycofana, bez sensu. |
| LD-D02-S2-LUKA | LD | 2 | południe | oba | **poprawka** | etykieta | Najmniejsza część czegoś onieśmielającego — wzorzec; wyciąć „{mały|mała} {Śmiałku|Śmiałko}”. |
| LD-D04-S2-LUKA | LD | 4 | południe | oba | **poprawka** | cytat-wizkora, nie-zlosc-sie | „Nie chcę — to całe zdanie” — wzorzec; wyciąć „Wizkor mówi”. |
| LD-D11-S2-LUKA | LD | 11 | południe | 4-8 | **przepisać** | duplikat, kanon-miejsce, tylko-wyobraznia | Most z chmur to wycofane Niebo Marzeń; treść pokrywa EM-D23 (powiedzieć nie). |
| LD-D23-S2-LUKA | LD | 23 | południe | oba | **poprawka** | a-czy-wiesz | Zadaj komuś jedno prawdziwe pytanie — dobre; zdjąć „A czy wiesz”. |
| LD-D28-S2-LUKA | LD | 28 | południe | 4-8 | **poprawka** | bez-czynnosci, pora | „Co dziś było trudne” w południe — przesunąć na wieczór albo „do tej pory”. |
| LD-D29-S2-LUKA | LD | 29 | południe | oba | **przepisać** | bez-czynnosci, pora, tylko-wyobraznia | Latawiec siada — pozwolenie na odpoczynek bez ciała; dopisać minutę leżenia. |

## 4. Standard porady

### 4.1 Pola

Punkt wyjścia z promptu potwierdzony z pięcioma zmianami (oznaczone ★, uzasadnienie pod tabelą).

| pole | typ / limit | kto widzi | uwagi |
|---|---|---|---|
| `id` | `PP-Dnn-Sk` jak dziś | nikt | zachowany dla `viewed_tips`; przepisane porady **zachowują id** (historia dziecka nie traci wpisów; `poradaPoId` w `PoradaPanel.jsx:102` odrzuca nieznane id) |
| `profile[]` | kody DT…MD | nikt | porada może być wspólna dla kilku profili; etykieta profilu **nigdy** na ekranie |
| `etap` | `1-3` \| `4-8` \| `oba` | nikt | wybór filtruje po etapie dziecka; `oba` = ten sam tekst dla obu; **model wspólny z `03` (spójność f):** `etap` + opcjonalne `warianty["1-3"\|"4-8"]`, które nadpisują pojedyncze pola (`zapowiedz`, `krok`, `minimum`, `odzew`) — jeden wpis zamiast dwóch; przykłady: EM-D22-S1 (4–8 dostaje „tempo” zamiast „zwierzę”), LD-D05-S1 (4–8 bez języka na wierzchu) |
| `pora` | `poranek` \| `poludnie` \| `wieczor` | nikt | ★ zostają trzy wartości jak w `slot`, bo tak liczy `poraTeraz()`; pięć pór z `poradaDnia.js:62` mapuje się 1:1 na tempo oddechu (rano→poranek, południe+popołudnie→poludnie, wieczór+noc→wieczor) |
| `rodzaj` | `oddech` \| `zmysly` \| `ruch` \| `napiecie-pusc` \| `emocje-cialo` \| `zyczliwosc` \| `tworzenie` \| `mikroodwaga` \| `wyciszenie` | nikt | technika dobrostanu; „do ciała” = pierwsze pięć |
| `wejscie` | `trop` \| `cialo-kolor-postac` \| `liczenie-porzadek` \| `rece-material` \| `energia-cialo` \| `jedna-rzecz-wolno` | nikt | mechanizm profilu (sekcja 5); przy `profile[]` z kilku kodów — wejście pierwszego |
| `tryb` ★ | `inicjowanie` \| `odpowiadanie` \| `zaproszenie` \| `obserwowanie` | nikt | z `swieze-spojrzenie`; do balansu, żeby nie było 90% „zrób” |
| `gdzie` ★ | `apka` \| `obok` \| `dzien` | pośrednio | `apka` = wykonanie w silniku (ekran pełny), `obok` = tuż przy ekranie w minutę, potem „Zrobione”, `dzien` = w ciągu dnia; odzew przy „Zrobione” |
| `silnik` ★ | `oddech` \| `fazy` \| `szukanie` \| `cisza` \| `napiecie` \| `null` | pośrednio | tylko dla `gdzie: apka`; `oddech` = `EkranOddechu` (5 cykli, tempo za porą); **`fazy`** = kolejne fazy ruchu (np. strząśnij → zamrzyj → wydech) **bez licznika czasu na ekranie** — fazę przełącza dotknięcie dziecka albo koniec wydechu z balonu, nigdy sekundy (prompt §3: „nigdy odliczanie”; dzisiejszy `PoradaAkcja/Ruch` z zegarem 5 s i cyfrą na ekranie, `PoradaAkcja.jsx:53–64,81`, jest do przebudowy na ten model); `szukanie` = `PoradaAkcja/Trop` (kropki); `cisza` i `napiecie` — do zbudowania (sekcja 6) |
| `tytul` | ≤ 28 znaków | karta, historia | tokeny dozwolone (`odmienDlaGracza` już działa na tytule) |
| `zapowiedz` | ≤ 120 znaków, **dwa zdania, każde ≤ 70**, TTS | głos liska + karta | jedyne miejsce, gdzie lisek mówi więcej niż 70 znaków — bo mówi, czym jest praktyka, zanim dziecko się zgodzi (`glosLiska.js:40–44`); wyjątek wpisany do `01_STANDARD_GLOSOW` (spójność a); walidator sprawdza każde zdanie osobno |
| `krok` | ≤ 60 znaków, **jeden czasownik, widoczny koniec** | karta; dla 1–3 także głos | to jest cała instrukcja; nic więcej dziecko nie czyta |
| `minimum` | ≤ 50 znaków | karta (mała linia „Na gorszy dzień:”) | zawsze widoczne, nigdy jako „skoro nie dałeś rady” |
| `odzew` | ≤ 70 znaków, TTS | głos liska + karta | zauważa czynność, nie chwali cechy; lisek mówi o sobie w rodzaju męskim, o dziecku w tokenach; przy `gdzie: dzien` **bez** „widziałem/słyszałem” |
| `ciekawostka` | ≤ 90 znaków, TTS, opcjonalna | karta + głos po odzewie | sprawdzona; zawsze przy poradzie z czynnością; **≤ 1 na tydzień na profil** |
| `slad` | klucz z tabeli 6.1 | świat 3D | co robi lisek i co zostaje do końca doby |
| `warianty` | `{"1-3": {…}, "4-8": {…}}`, opcjonalne | pośrednio | nadpisania pól dla jednego etapu; te same limity i zakazy co pola bazowe |
| `rodzina` | klucz z `06` §6, opcjonalne | nikt | ta sama czynność co zadanie w realu (np. `po-cichu` = EM-D16-S1 i `tajny-pomocnik` z `03` §7.3; `drugie-uzycie` = KR-D10-S1 i `wynalazca-z-kieszeni` z `03` §7.7). **Porada z polem `rodzina` nie wchodzi w dniu, w którym dziecko ma aktywne zadanie z tej samej rodziny** — wybór bierze wtedy najbliższy dzień o tej samej porze (4.4) |
| `uzasadnienie` | zdanie dla projektantów | nikt | jaką potrzebę karmi i dlaczego ten profil |

Pola do usunięcia z `dailyTipsData.js`: `category` (medrzec/kraina — obie wycofane), `subcategory`, `icon`, `tone`, `time` (czas wynika z `gdzie`/`silnik`), `profileName`, `cecha` (etykiety), `audience` (porady rodzica idą do osobnego pliku dla panelu Mentora). `tags` może zostać.

★ Uzasadnienie zmian: `tryb` i `gdzie`/`silnik` są potrzebne, bo bez nich nie da się ani zbalansować kształtów (dziś 84% porad zaczyna się od „zrób/pomyśl”), ani połączyć biblioteki z istniejącymi silnikami z `PoradaKarty`. Trzy wartości `pora` zamiast pięciu — bo dwie definicje w jednym panelu to błąd, który już dziś daje 63% wyświetleń w złej porze.

### 4.2 Reguły treści

1. **Lisek nie cytuje nikogo.** Ani „Mędrzec mówi”, ani „Wizkor mówi/szepcze/radzi”. Jeśli treść pochodzi od Wizkora, mówi ją Wizkor własnym głosem w chmurce (4.5), a nie lisek. Skrypt odrzuca `Wizkor|Mędrz` w polach TTS.
2. **Bez „pamiętaj”, „musisz”, „X wie, że”, „A czy wiesz”.** Ciekawostka ma własne pole i własny limit; nie jest wstępem do porady.
3. **Bez liczników**: dni, tygodni, „półmetek”, „kończymy 30 dni”, „trzy tygodnie razem”, „ile sekund wytrzymasz”.
4. **Porada nie zakłada rodziny ani bezpiecznego dorosłego**: „ktoś” zamiast „mama”, „komuś znajomemu” zamiast „pani”, żadnego „dorosły obok chce pomóc”. Wersja `minimum` działa w pojedynkę.
5. **Emocje zawsze bez zwierzeń**: nazywanie stanu przez ciało, kolor, pogodę, postać; nigdy „powiedz komuś, co czujesz”, nigdy „sekret”.
6. **Bez afirmacji, obietnic efektu, pseudonauki, diety/wyglądu, dyskomfortu fizycznego, „nie złość się”, relatywizowania uczuć, nadzoru, wyścigów** (lista z sekcji 4 promptu; wzorce w `pomiar-C.py`).
7. **Bez etykiety profilu na ekranie**: stopka `PoradaPanel.jsx:198–202` do usunięcia; w treści żadnych „Śmiałku”, „Myśliciel wie”.
8. **Kanon nazw**: tylko `docs/SWIAT_I_POSTACIE.md`. Bez krain (góry, morze, pustynia), artefaktów (Muszla Echa, Tarcza Słońca, Kompas Cieni) i postaci spoza kanonu (sowa-strażniczka). Lisek w odzewie mówi tylko o tym, co jest w scenie: polana, głaz, oczko wodne, choinka, wielkie drzewo, drabinka i pomost domku, chmury, gałęzie; **plac budowy tylko przed etapem 1 domku** (schodzi po `ustawSchronienie(1)`, a porady zaczynają się po pierwszej sesji — w praktyce nie nazywać go w odzewie).
9. **TTS**: bez cyfr, bez ukośników, bez „zostało ci”; każdy czasownik w czasie przeszłym i przymiotnik o dziecku w tokenie `{m|ż}`; lisek o sobie w rodzaju męskim.
10. **1–3 kontra 4–8**: 1–3 dostają `krok` także w głosie (lektor czyta pytanie i krok), obraz i jedno polecenie; 4–8 nie dostają maskotek, „brzuszka”, „mały”; porady `etap: 4-8` mogą wymagać dwóch kroków (podziel–zrób) i działać w szkole.
11. **Jedna porada na porę, żadnego „zajrzyj później”.** Komunikat pustego stanu „Nie mam dziś dla Ciebie nowej porady. Zajrzyj jutro” (`PoradaPanel.jsx:171`) zamienić na wersję z `02` §2.5: „Dziś nic nowego. Wczorajsze rady są niżej.” (mówi, gdzie coś jest, nie kiedy wrócić — spójność i).
12. **Odzew nie ocenia i nie obiecuje**: zakazane „dobra robota”, „brawo”, „masz bystre oczy” (dziś w `poradaDnia.js:48,57`), „głośny i dobry”, także miękkie „i dobrze”; zakazane orzekanie efektu, którego lisek nie widzi („głowa była cichsza”, „ciało robi się cięższe”, „uspokaja bardziej”) — lisek mówi o tym, co widać (ramiona opadły) albo o sobie. Wzorzec (`01` para 13): **„U mnie … A u ciebie?”** — lisek mówi, co było u niego, i pyta; nie orzeka, co stało się z ciałem dziecka („twoje nogi już nigdzie nie idą”, „ciało robi się cięższe”). Walidator odrzuca „twoje … już/był/robi się…” w odzewie. Formuła „liczy się” tylko w polu `minimum`, nigdy w odzewie. Lisek o sobie mówi „łapy”, nie „łapki” (zdrobnienia tylko przy `etap: 1-3`).

### 4.3 Przepływ na ekranie (jedna karta, cztery stany)

`zapowiedz` (lisek mówi, karta pokazuje tytuł + krok + minimum) → „Zrób to ze mną” (`apka`: silnik na pełnym ekranie; `obok`/`dzien`: przycisk „Zrobione” i „Później”) → `odzew` (lisek, jedno zdanie) → `slad` (świat, sekcja 6). „Później” nie jest porażką i nie wraca komunikatem; porada zostaje w tej samej porze. Historia jak dziś (`Rady, które już znasz`), bez listków z siedmiu dni (`PoradaKarty.jsx:194–203` — to ukryty licznik tygodnia; usunąć).

### 4.4 Siatka

Docelowo **każdy profil ma poradę na każdą z 90 par dzień × pora**, żeby fallback z `poradaZBiblioteki.js:88–94` nigdy nie wchodził. Do tego czasu fallback zmienić: brak porady w tej porze → porada z **najbliższego dnia o tej samej porze** (nie z innej pory tego dnia); wieczorem nigdy nie czytać „zanim wstaniesz”. Kolejność uzupełniania: MD południe i wieczór (0/0), KR wieczór (0), LD wieczór (3), potem reszta.

### 4.5 Współistnienie z 16 myślami o ciele Wizkora — reguła wspólna z `01` (R7)

Chmurka `PodpowiedzMedrca.jsx` (głos `las_decyzji`, ton `calm`) losuje jedną z 16 myśli z `hub/data/porady-zdrowia.v1.json` bez żadnej wiedzy o poradzie liska; dziś: po 75 s, potem co 5 min, maks. 3 na sesję (`PodpowiedzMedrca.jsx:30–33`). Tego samego dnia dziecko może usłyszeć od Wizkora „Trzy spokojne wdechy…” (`porady-zdrowia.v1.json:9` w HEAD) i od liska „Pięć wydechów na palcach”. Obowiązuje **R7 z `01_STANDARD_GLOSOW`** rozszerzone o dwie reguły z tego dokumentu (spójność g):

| reguła | źródło | jak |
|---|---|---|
| rytm: pierwsza myśl nie wcześniej niż po **4 min** spokojnej gry, kolejna po **5 min**, **maks. 2 na sesję**, **żadnej po zachodzie** | `01` R7 | zmiana stałych `PIERWSZA`, `KOLEJNA`, `MAX_NA_SESJE` i warunek na `doba:pora` |
| **jeden temat dziennie** | `04` | myśl Wizkora dostaje pole `temat` (woda, oczy, plecy, ruch, oddech, dwór, sen, jedzenie, ręce, równowaga, przerwa, ramiona, uśmiech, cisza, słuchawki); porada dnia ma `rodzaj`. Kolizje: `oddech`↔oddech, `ruch`/`napiecie-pusc`↔ruch/plecy/ramiona/równowaga, `wyciszenie`↔cisza/sen, `zmysly`↔oczy. Losowanie chmurki pomija tematy kolidujące z dzisiejszą poradą (deterministycznie, z kluczem dnia) |
| **nie wcześniej niż 3 min po odzewie liska** i nigdy przy otwartym silniku porady | `04` | `aktywna=false` już blokuje chmurkę przy otwartym panelu (`PodpowiedzMedrca.jsx:115–121`); dodać znacznik czasu odzewu |
| tylko o ciele, tryb zapraszający | `01` R7 | myśli z czasownikiem („wyprostuj plecy”, „wstań i przeciągnij się”, „zakręć ramionami”) zostają u Wizkora jako uwaga o ciele (rozstrzygnięcie `02` §2.4); nie są zleceniem i nie mają odzewu ani śladu |
| do wycięcia z 16 | `04` | „Uśmiech do siebie w lustrze…” (`:17` — lustro, wygląd; w kopii roboczej nadal lustro), „Po dłuższym patrzeniu w ekran należy ci się przerwa” (`:15` — moment ustala A.4), „Coś chrupiącego i kolorowego na talerzu” (`:12` — jedzenie na granicy diety) |

Osobny licznik „maks. 1 chmurka w sesji z wykonaną poradą” z pierwszej wersji tego dokumentu **skreślony** — przy 15-minutowej sesji i starcie po 4 min drugi wpis i tak rzadko wejdzie, a dwa liczniki to dwa źródła prawdy.

## 5. Mechanizmy profili — profil zmienia wejście, technika jest wspólna

Techniki (pole `rodzaj`) są jedne dla wszystkich: oddech z wydłużonym wydechem, uziemienie zmysłami, ruch, napięcie–puść, nazywanie stanu przez ciało, życzliwość bez przymusu, tworzenie, mikroodwaga, wyciszenie. Profil decyduje tylko o tym, **jak lisek otwiera drzwi** (pole `wejscie`). Ta sama technika „wydłużony wydech” u DT zaczyna się od tropu („który dźwięk zaśnie pierwszy”), u ST od liczenia („następny o jeden dłuższy”), u LD od energii („lwi wydech”), u MD od jednej rzeczy wolno („od dziesięciu do jednego”).

### 5.1 Tabela wejść

| profil | `wejscie` | co robi pierwsze zdanie zapowiedzi | przykład otwarcia (z sekcji 7–8) | czego unikać |
|---|---|---|---|---|
| DT Ciekawość | `trop` — zmysł, który coś wyłapie: dźwięk, zapach, temperatura, ruch | stawia zagadkę ze świata obok dziecka | „Wieczorem rzeczy stygną w różnym tempie. Poszukamy razem najzimniejszej w pokoju?” (DT-D27-S3) | ciekawostek bez czynności („A czy wiesz”), zagadek z odpowiedzią w głowie („kim jestem?”), lustra |
| EM Życzliwość | `cialo-kolor-postac` — stan przez pogodę, kolor, zwierzę; gest dla kogoś bez słów | nazywa stan bez słowa „emocja” albo pokazuje czyjąś potrzebę | „W brzuchu też bywa pogoda: spokojna, burzowa albo słoneczna. Sprawdzimy razem, jaka jest dziś?” (EM-D10-S1) | czytania cudzych uczuć, komplementów na głos, „sekretów”, „dorosły obok chce pomóc”, zakładania rodziny |
| ST Mądrość | `liczenie-porzadek` — policz, ustaw w rzędzie, podziel na kroki | daje miarę albo kolejność | „Wydech da się zmierzyć, licząc w głowie. Zrobimy razem trzy, każdy o jeden dłuższy?” (ST-D10-S1) | planów „w głowie”, poradnika produktywności, liczenia dni, cyfr w TTS |
| KR Kreatywność | `rece-material` — kartka, kubek, cień, spinacz; wynik nieznany z góry | wskazuje materiał pod ręką i ograniczenie | „Da się narysować kubek jedną linią, bez odrywania ręki. Spróbujemy razem, choćby palcem po stole?” (KR-D15-S1) | krain (pustynia, oaza), „wyobraźnia jak mięsień”, zadań wymagających kredek bez wersji palcem |
| LD Odwaga | `energia-cialo` — strząśnij → zamrzyj → wydech; lwi wydech; skok; mikroodwaga jednego gestu | zaprasza do rozładowania energii albo do jednego pierwszego ruchu | „Rano ciało ma w sobie dużo prądu. Strząśniemy go razem, zamrzemy na trzy i puścimy wydechem?” (LD-D03-S1) | afirmacji („jestem odważny”), artefaktów (Tarcza Słońca), „pani, której się boisz”, występów przy ludziach, liczników |
| MD Skupienie | `jedna-rzecz-wolno` — jedna czynność do końca, najwolniej jak się da | zawęża do jednej rzeczy i spowalnia | „Drzwi da się zamknąć tak wolno, że klamka nie kliknie. Spróbujemy razem raz, zanim wyjdziesz?” (MD-D21-S1) | wszystkiego o cudzych emocjach („czyje to”), „słuchaj więcej, niż mówisz”, metafor bez czynności (klepsydra, waga) |

Zasady wspólne:
- **Każdy profil co najmniej raz na trzy dni dostaje poradę do ciała** (`rodzaj` ∈ oddech, zmysły, ruch, napięcie–puść, emocje przez ciało). Sprawdzenie skryptem po zmianach z sekcji 7–8 (`sprawdz-nowe-C.py`, „luki”): LD i MD spełniają regułę niemal w całości (LD: dni 14, 27; MD: 24, 25), DT ma luki w dniach 10–14 i 28–29, EM 2–4, 14–17, 26, ST 4–5, 14, 20–22, 26–28, **KR 1–10, 14–15, 26–30** (KR to prawie same porady wyobraźni). Sposób domknięcia: przy przepisywaniu wpisów „przepisać/poprawka” z tych dni dodać wersję do ciała (KR: cień, kartka w rękach, stukanie; DT: dotyk, temperatura). Lista id do ciała w tych oknach: KR-D03-S1, KR-D07-S1, KR-D09-S1, KR-D16-S1, KR-D26-S1, KR-D28-S1; DT-D10-S1, DT-D12-S1, DT-D14-S1, DT-D28-S1; EM-D02-S1, EM-D15-S3, EM-D26-S1; ST-D04-S1-NEW2, ST-D14-S3, ST-D21-S1, ST-D26-S1-NEW18.
- **Profil nie zamyka reszty**: raz na tydzień porada spoza wejścia profilu (np. DT dostaje „ręce i materiał”). Wybór bierze `profile[]`, więc porada może mieć dwa profile.
- **Tryb**: w każdej siódemce dni co najmniej jedno `obserwowanie` i jedno `odpowiadanie`/`zaproszenie`; dziś w bazie prawie wszystko to `inicjowanie`.

### 5.2 Plan przebudowy MD — z mediatora na Skupienie

Stan po 17.09: rdzeń MD jest już o skupieniu (D01, D02, D08–D10, D17–D20, D23, D25, D27–D30). Do zrobienia:

| co | id | ruch |
|---|---|---|
| dokończyć wycięcie „cudzych emocji” (dziecko) | MD-D14-S1, MD-D22-S1 | wycięte, nowe treści w 7.6 (mokre dłonie; co obudziło się pierwsze) |
| resztki mediatora | MD-D04-S1 („zanim zaczniesz mieszać go z innymi”), MD-D12-S1 (cztery słowa), MD-D26-S1 („między słowami”), MD-D16-S1 (echo) | D12 wycięte (7.6); D04 i D26 przepisać na własny stan / patrzenie na jedną rzecz; D16 zostaje jako słuchanie (poprawka) |
| moralizowanie/maksymy | MD-D05-S1, MD-D07-S1, MD-D21-S1, MD-D13-S1 | wycięte, nowe treści w 7.6 |
| „Wizkor mówi” | 13 wpisów (poprawka) | zdjąć cytat, zostawić czynność |
| pory | MD ma 30 porannych, 0 południowych, 0 wieczornych | 12 nowych daje MD-D01-S3 i MD-D02-S2 jako wzorce; dopisać po jednej południowej i wieczornej na każdy dzień (wzorce: kołysanie do zera, trzy oddechy przed ekranem, drzwi bez kliknięcia, dźwięk do końca) |
| porady rodzica MD o „oddawaniu cudzych emocji” (D06-S3, D10-S3, D19-S3, D24-S3, D28-S3) | poza zakresem C | odnotowane w notatkach do 06: przenieść do panelu Mentora tylko po przepisaniu na skupienie |

### 5.3 Plan przebudowy LD — z afirmacji na ruch i mikroodwagę

LD ma 0 porad „zostaje”. Przebudowa: 16 wyciętych ma nowe treści w 7.5 (12 do ciała, 4 mikroodwagi); 13 „przepisać” dostaje kierunek:

| id | dziś | nowy kierunek (rodzaj) |
|---|---|---|
| LD-D01-S1 | ręka na piersi, „serce podpowie”, „mały Śmiałku” | policz uderzenia serca zanim wstaniesz (emocje-cialo) |
| LD-D06-S1 | postawa + obietnica | postawa: stopy, barki w dół, jeden wydech; bez „dzień zacznie się dobrze” (ruch) |
| LD-D07-S1 | „prawdziwy lider umie nie prowadzić” | pozwól dziś komuś wybrać jedną rzecz (zabawę, drogę); bez „lider” (mikroodwaga, 4–8) |
| LD-D12-S1 | słowo na sztandar | napisz jedno słowo na kartce i schowaj do kieszeni (tworzenie) |
| LD-D13-S1 | „krok odwagi i basta” | jedna konkretna mikropróba: zapytaj o godzinę, usiądź w innym miejscu (mikroodwaga) |
| LD-D16-S1 | „tam gdzie TRUDNO, ale DOBRZE” | to samo co D13, ale dla 4–8: powiedz „nie wiem” na głos raz (mikroodwaga) |
| LD-D22-S1 | „lew odpoczywa” + etykieta | jedna rzecz powoli, dla siebie, bez celu — bez lwa (wyciszenie) |
| LD-D27-S1 | okno rano, „wszyscy Śmiałkowie” | okno rano: znajdź jedną rzecz, która rusza się na wietrze (zmysły) |
| LD-D30-S1 | lew 20 godzin | ciekawostka o lwach (sprawdzona: odpoczywają większość doby) + czynność: połóż się na minutę (ruch/wyciszenie) |
| LD-D08-S2-NEW1 | serce bije szybciej — Wizkor mówi | poczuj puls po dziesięciu podskokach, potem po minucie (emocje-cialo) |
| LD-D22-S2-NEW3 | „twój głos ma wagę” | powiedz jedno zdanie cicho, ale wyraźnie, do końca (mikroodwaga) |
| LD-D11-S2-LUKA | most z chmur | na którą rzecz dziś nie masz zgody — bez mostu; zsunąć z EM-D23 (mikroodwaga) |
| LD-D29-S2-LUKA | latawiec siada | połóż się na plecach na minutę, ręce luźno (napiecie-pusc) |

Po przebudowie LD: 12 ruch/napięcie/oddech, 9 mikroodwaga, 4 zmysły/emocje, 3 tworzenie/wyciszenie, 5 poprawek. Żadnego „Śmiałku”, żadnego artefaktu, żadnego licznika.

## 6. Ślad porady w świecie

Zasada: **lisek robi w świecie to samo, co dziecko zrobiło obok ekranu, a świat zmienia się delikatnie i tylko do końca doby.** Ślad nie jest nagrodą: nie ma licznika, nie kumuluje się (druga porada tego dnia nie dokłada drugiego śladu), nie daje monet, **nie podlewa Fasoli** (zdarzenie `fasola:podlana` nie jest emitowane) i znika razem z nocą (`doba:sesja`), tak jak mokre ślady łap. To, co lisek potrafi dziś (klipy z `postacie.js:16` i `app.js:76`): `idle`, `walk`, `run`, `happy`, `turn` (podklip z `walk`, `app.js:811`). Nie ma klipów „siedzi”, „śpi”, „oddycha” — oddech i zamrożenie robimy skalą i zatrzymaniem, bez nowej animacji.

### 6.1 Tabela: rodzaj → lisek → świat → hak

| `slad` (dla `rodzaj`) | co robi lisek (od razu, ≤ 3 s) | co zostaje w świecie do końca doby | hak w scenie |
|---|---|---|---|
| `lisek-oddycha` (oddech, emocje przez ciało) | staje (`play("idle")`), grupa bohatera pulsuje skalą 1,00→1,03 w tempie `TEMPO[pora]` z `EkranOddechu.jsx:50`, pięć razy | drzewa i kwiaty kołyszą się o połowę wolniej: tłumienie sprężyny w `_gibKwiaty`/`_gibDrzew` (`app.js:1307`, `:1320`) ×0,5; chmury wolniej: `Chmury.C.tempoOd/Do` (`chmury.js:44`) ×0,6 | istniejące: `play`, sprężyny, `CHMURY`; **do zbudowania: puls skali + parametr tłumienia + metoda publiczna — koszt niski** |
| `swiatlo-dnia` (zmysły) — dawniej „świetlik”; nazwa zmieniona, bo „świetlik” znaczy w `03` i `05` nocny znak z `mapa-w2` (spójność c) | obraca głowę (`play("turn")`) w stronę wielkiego drzewa | jedna kula światła (`Swiatlo`, `swiatlo.js:54`, jak kule niesione przez bohatera) krąży **w dzień** przy **drabince pomostu** (domek etap ≥ 1; przy etapie 0 — obok placu budowy), gaśnie o zachodzie; nie jest świetlikiem nocnym i nie jest światłem w oknie | istniejące: klasa `Swiatlo`, `pokazMiejsce` (`app.js:2426`); **do zbudowania: instancja zakotwiczona w punkcie mapy zamiast na `hero` — koszt niski** |
| `lisek-strzasa` (ruch, napięcie–puść) | `play("happy")` dwa razy (`app.js:1520`), dymki pod łapkami (`Dymki`, `dymki.js:77`) | trzy kwiaty wokół miejsca, w którym stał (`kwiaty.posadz`, `swiat.js:1745`, ten sam mechanizm co `ustawSladyPrzygod` w `index.js:61–72`) | **istniejące w całości — koszt: tylko wywołanie** |
| `kwiat-koloru` (emocje przez kolor, kolor bez nazwy) | idzie do oczka wodnego (`pokazMiejsce` + `startWalk`, `app.js:1545`) | jeden kwiat przy oczku w kolorze wybranym przez dziecko (trzy do wyboru na karcie odzewu) | istniejące: `posadz`, paleta w `zbudujKwiaty` (`swiat.js:1423`); **do zbudowania: `posadz(x, z, kolor)` — koszt niski** |
| `kropla-swiatla` (życzliwość) | idzie nad oczko wodne | błękitna kropla (`this.kropla`, `app.js:831` — `Swiatlo` z jedną kulą) unosi się nad oczkiem wodnym do zmierzchu | istniejące: `kropla`; **do zbudowania: zakotwiczenie nad oczkiem — koszt niski**. Celowo **nie** przy domku i **nie** po zachodzie: „światło w oknie / lampka / świetliki nocą” to reakcja hybrydy **MD** (`05`, po zauważeniu przez Mentora) — ślad porady nie używa światła w oknie ani światła nocnego (spójność b/c) |
| `kamyczek-przy-drabince` (tworzenie) — dawniej `kamyczek-na-placu`; plac budowy schodzi po etapie 1 domku (`ustawPlacBudowy` przy `_etapSchronienia > 0`, `05`), a porady zaczynają się po pierwszej sesji | kładzie mały kamyczek u stóp drabinki pomostu (osadzanie jak `_polozNaPlacu`, `app.js:2559`, model `kamyczki()` `natura.js:163`; przy etapie 0 — obok placu) | kamyczek leży do końca doby; **nie liczy się jako materiał** (nie wywołuje `oznaczDostarczone`) | istniejące: model i osadzanie; **do zbudowania: wariant „ozdobny”, poza logiką materiału — koszt niski** |
| `slady-lap` (mikroodwaga) | biegnie kawałek w stronę choinki (start Lotu Liska) i wraca | ślady łap na ścieżce (`MokreSlady`, `mokreslady.js:97`) nie wysychają do końca doby | istniejące: ślady; **do zbudowania: flaga „nie wysychaj” do zmierzchu — koszt niski** |
| `niebo-cichnie` (wyciszenie) | staje, kamera nie drga (`ustawSpokojnyRuch(true)` na 10 s, `app.js:3135`) | chmury płyną wolniej (jak wyżej) i światło wypełniające o krok cieplejsze (`Doba` — barwy z `DOBA` w `doba.js:51`, bez zmiany fazy) | istniejące: `Chmury`, `Doba`; **do zbudowania: metoda „ścisz świat” zmieniająca tylko intensywność, NIE `doba.przewin` (to skróciłoby sesję) — koszt niski** |

Wspólny hak: jedna publiczna metoda w API sceny (`index.js` obok `ustawSladyPrzygod`): `ustawSladPorady(slad, { kolor, bezAnimacji })`. React woła ją po odzewie i przy wejściu do świata (z `bezAnimacji`, jak `oznaczZuzyte`). Stan śladu w `localStorage` z kluczem dnia (jak `poradaDnia.js:77–81`), kasowany o północy. Koszt całości: **niski–średni** (jedna metoda, siedem gałęzi, żadnego nowego modelu ani klipu).

### 6.2 Czego ślad nie robi

- Nie mówi tekstem. Żadnego toastu „+1 kwiat”. Narratorka może raz, przy pierwszym śladzie w życiu gracza, powiedzieć jedno zdanie o zmianie („Przy placu budowy coś świeci.”) — w limicie z `01_STANDARD_GLOSOW`.
- Nie zostaje na jutro i nie rośnie: to różnica między poradą (rytm dnia) a zadaniem w realu (trwała zmiana świata, `05_ZADANIA_HYBRYDOWE`).
- Nie zależy od Mentora. Porada nie ma śladu-dowodu i Mentor jej nie widzi; w panelu Mentora może być tylko zbiorcze „dziś porada z liskiem: oddech” bez oceny (pytanie w notatkach do 06).
- Nie wchodzi w Fasolę, monety, gwiazdki, plac budowy jako materiał.
- Nie używa światła w oknie domku, lampki ani nocnych świetlików — to reakcje hybryd (`05`, MD). Jedyne światła porady to dzienna kula przy drabince i kropla nad oczkiem, obie gasną o zachodzie.

### 6.3 Co z tego, co jest, wchodzi bez zmian

`EkranOddechu.jsx` (balon, pięć cykli, tempo za porą, wstrzymanie ≤ 1,6 s — poprawne dla dzieci) = silnik `oddech`. `PoradaAkcja.jsx` `Trop` (kropki) = silnik `szukanie` z parametrem `ile`; `Ruch` (kroki po 5 s) = zalążek silnika `fazy`, ale **do przebudowy**: zegar sekundowy i cyfra na ekranie (`PoradaAkcja.jsx:53–64,81`) to odliczanie, którego prompt §3 zakazuje; fazę ma przełączać dotknięcie dziecka („dalej”) albo koniec wydechu, bez liczb. Do dopisania: `cisza` (odliczanie z przygaszeniem ekranu) i `napiecie` (fazy napnij/puść). Flaga `POKAZ_KARTY_AKTYWNOSCI` przestaje być przełącznikiem „albo–albo”: karta biblioteki dostaje przycisk „Zrób to ze mną”, który otwiera silnik z pola `silnik`. `KARTY_DNIA` (`poradaDnia.js:31–59`) znikają jako osobna pula — ich trzy treści wchodzą do biblioteki w standardzie (bez „Kto pierwszy zobaczy?”, „Masz bystre oczy”, „Dobra robota”, „Pięć zielonych śladów już świeci na mapie”).


## 7. Przepisane porady (werdykt „wyciąć”) — ten sam slot profil × dzień × pora

53 wpisy (52 aktywne + MD-D07-S1 wycofana po uzgodnieniu z kopią roboczą, §1.5). Format ze standardu 4.1 (z polem `warianty` tam, gdzie etap 4–8 dostaje inny tekst, i `rodzina` tam, gdzie porada dubluje zadanie w realu). Każdy wpis przeszedł skrypt `sprawdz-nowe-C.py` (limity, zdania zapowiedzi ≤ 70, cyfry, tokeny, słowa zakazane, zdrobnienia przy etap ≠ 1-3, orzekanie o dziecku w odzewie, slot, silnik): 0 błędów. Pod każdym JSON-em skrót rundy panelu (ss = świeże spojrzenie, ps = psycholog, so = socjolog, pe = pedagog, r13/r48 = rodzice, cw = copywriter, ng = narrator-gama). Przy pięciu wpisach adnotacja o tym, co zmieniła w międzyczasie druga sesja; recenzje z §10 i §11 naniesione.

### 7.1 DT (6)

Było (`dailyTipsData.js:386`): „Twarz w lustrze” — Spójrz w lustro przez chwilę. Czy twoje oczy są takie same jak wczoraj? A włosy? Nawet ty zmieniasz się każdego dnia.

#### DT-D08-S1 · Trzy rzeczy, które pachną

```json
{
 "id": "DT-D08-S1",
 "profile": [
  "DT"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Trzy rzeczy, które pachną",
 "zapowiedz": "Rano nos budzi się pierwszy. Powąchamy razem trzy rzeczy w zasięgu ręki?",
 "krok": "Powąchaj trzy rzeczy obok siebie i wybierz najmocniejszą.",
 "minimum": "Jedna rzecz, jeden wdech nosem.",
 "odzew": "Ja obstawiam poduszkę. A u ciebie, co pachniało najmocniej?",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast lustra i wyglądu (D08 wycięte) — uziemienie węchem, też poranne, bez oceny siebie."
}
```

Panel — ss: obserwowanie; zmysł, o którym rano nikt nie myśli; ps: zero wyglądu, zero oceny — zdrowe; so: trzy rzeczy pod nosem ma każdy dom; pe: 1–3 potrafi; „trzy” to widoczny koniec; r13: minuta przy śniadaniu, beze mnie; r48: nikt nie widzi, że wącha — zrobi; cw: tytuł ok; wariant „Nos na zwiady”; ng: lisek zaprasza, bez cyfr, token jest

Było (`dailyTipsData.js:554`): „Polanka pod gwiazdami” — Wyobraź sobie polankę w środku lasu. Leżysz na trawie. Nad tobą gwiazdy. Każda zna jedną odpowiedź. Którą wybierasz?

#### DT-D11-S3 · Najdalsze światło

```json
{
 "id": "DT-D11-S3",
 "profile": [
  "DT"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "wyciszenie",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Najdalsze światło",
 "zapowiedz": "Wieczorem światła widać dalej niż w dzień. Poszukamy razem najdalszego światełka za oknem?",
 "krok": "Znajdź najdalsze światło za oknem. Policz do dziesięciu.",
 "minimum": "Jedno światło w pokoju, trzy oddechy.",
 "odzew": "Ja też patrzyłem daleko. Oczy lubią odpoczywać na końcu widoku.",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Zamiast gwiazd „znających odpowiedzi” — daleki punkt dla oczu (odpoczynek akomodacji) i wyciszenie."
}
```

Panel — ss: obserwowanie; wieczór ma inną skalę odległości; ps: brak presji, minimum w pokoju; so: blok: latarnia; wieś: gwiazda; minimum bez okna; pe: liczenie do dziesięciu to koniec dla 1–3; r13: z łóżka, bez wstawania; r48: patrzenie w okno nikogo nie zawstydza; cw: „Najdalsze światło” trzyma; ng: odzew o czynności, nie o cesze

Było (`dailyTipsData.js:743`): „Echo w lesie” — W głębi lasu jest skała, która powtarza pytania. Wyobraź sobie, że krzyczysz: kim jestem? Co ci odpowiada echo?

#### DT-D15-S3 · Dźwięk, który zaśnie

```json
{
 "id": "DT-D15-S3",
 "profile": [
  "DT"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "wyciszenie",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Dźwięk, który zaśnie",
 "zapowiedz": "Wieczorem dom cichnie krok po kroku. Posłuchamy razem, który dźwięk zaśnie pierwszy?",
 "krok": "Zamknij oczy i posłuchaj, aż jeden dźwięk całkiem ucichnie.",
 "minimum": "Jeden wdech nosem z zamkniętymi oczami.",
 "odzew": "U mnie ostatni zasnął wiatr. A u ciebie, co zasnęło?",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Zamiast echa i „kim jestem” — słuchanie do wygaśnięcia dźwięku (uziemienie słuchem), naturalny koniec."
}
```

Panel — ss: odpowiadanie: koniec wyznacza świat, nie zegar; ps: bez zwierzeń, bez obietnicy snu; so: dźwięki są wszędzie, także w bloku; pe: „aż ucichnie” to koniec, który dziecko samo pozna; r13: minuta w łóżku; r48: zrobi, nikt nie widzi; cw: tytuł 28 znaków, na styk; ng: lisek nie ocenia; „przyszła sama” ok

Było (`dailyTipsData.js:932`): „Mgła nad polanką” — Wieczorem na leśnej polance pojawia się mgła. Wyobraź sobie, że jej kosmyki niosą twoje zmartwienia daleko. Jutro polana będzie czysta.

#### DT-D19-S3 · Gdzie dziś siedzi zmęczenie

```json
{
 "id": "DT-D19-S3",
 "profile": [
  "DT"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "emocje-cialo",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Gdzie dziś siedzi zmęczenie",
 "zapowiedz": "Zmęczenie mieszka gdzieś w ciele: w nogach, w oczach albo w barkach. Poszukamy go razem?",
 "krok": "Połóż dłoń tam, gdzie dziś siedzi zmęczenie. Trzy oddechy.",
 "minimum": "Dłoń na brzuchu, jeden wydech.",
 "odzew": "Moje zmęczenie siedzi w ogonie. A u ciebie, gdzie dziś siedzi?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast mgły unoszącej zmartwienia — nazwanie stanu przez ciało, bez zwierzeń i bez obietnicy."
}
```

Panel — ss: trop w ciele zamiast tropu w świecie; ps: emocja przez ciało, nie przez słowa — zdrowe; so: nie zakłada niczego; pe: 1–3: „w nogach, oczach, barkach” daje przykład; r13: w łóżku, beze mnie; r48: prywatne, nieinfantylne; cw: krótko, konkret; ng: lisek mówi o sobie, nie chwali

Było (`dailyTipsData.js:1100`): „Strażniczka pytań” — W głębi lasu mieszka stara sowa, która zbiera pytania dzieci. Wyszepcz jej dziś jedno. Ona zaopiekuje się nim do rana.

#### DT-D23-S3 · Mapa pokoju bez oczu

```json
{
 "id": "DT-D23-S3",
 "profile": [
  "DT"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "zmysly",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Mapa pokoju bez oczu",
 "zapowiedz": "Z zamkniętymi oczami pokój zmienia się w nową mapę. Przejdziemy ją razem palcami?",
 "krok": "Zamknij oczy, dotknij trzech rzeczy z łóżka. Co to?",
 "minimum": "Jedna rzecz pod dłonią, z zamkniętymi oczami.",
 "odzew": "Ja bez oczu poznaję świat nosem. Ty {sprawdziłeś|sprawdziłaś} dłońmi.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast sowy spoza kanonu — dotyk jako trop; zamknięte oczy zamiast ciemności (bez kosztu dla dziecka, które boi się ciemności)."
}
```

Panel — ss: ograniczenie (bez oczu) zamiast dokładania; ps: zgadywanie bez złej odpowiedzi; so: każde łóżko ma coś w zasięgu ręki; pe: trzy rzeczy = koniec; „z łóżka” = bez chodzenia po ciemku; r13: po zgaszeniu światła, bez mojego udziału; r48: ok, prywatne; cw: tytuł nadaje rolę; ng: bez cyfr, tokeny są

Było (`dailyTipsData.js:1289`): „Kompas Cieni świeci” — Twój artefakt — Kompas Cieni — świeci wieczorem najmocniej. Pokazuje, że dziś też coś {odkryłeś|odkryłaś}. Nawet jeśli wydaje ci się, że nie.

#### DT-D27-S3 · Najzimniejsza rzecz w pokoju

```json
{
 "id": "DT-D27-S3",
 "profile": [
  "DT"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "zmysly",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Najzimniejsza rzecz w pokoju",
 "zapowiedz": "Wieczorem rzeczy stygną w różnym tempie. Poszukamy razem najzimniejszej w pokoju?",
 "krok": "Dotknij trzech rzeczy i wybierz najzimniejszą.",
 "minimum": "Dotknij jednej rzeczy grzbietem dłoni.",
 "odzew": "Ja obstawiałem szybę. Ty {sprawdziłeś|sprawdziłaś} naprawdę.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast Kompasu Cieni (artefakt nie istnieje) — porównanie temperatur dotykiem; bez zimnej wody, bez dyskomfortu."
}
```

Panel — ss: obserwowanie przez porównanie; ps: ok, wynik nieznany z góry; so: szyba, klamka, kubek — wszędzie; pe: „trzech” i „najzimniejsza” = koniec; r13: minuta, sam; r48: zrobi; cw: krótko; ng: lisek zgaduje, nie orzeka

### 7.2 EM (9)

Było (`dailyTipsData.js:1797`): „Twoje serce widzi to, czego oczy nie widza” — Dzis, gdy spotkasz kogos, popatrz nie tylko na usmiech. Popatrz glebiej. Twoje serce wie, jak naprawde ktos sie czuje. To Twoj dar.

#### EM-D10-S1 · Pogoda w brzuchu

```json
{
 "id": "EM-D10-S1",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "emocje-cialo",
 "wejscie": "cialo-kolor-postac",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Pogoda w brzuchu",
 "zapowiedz": "W brzuchu też bywa pogoda: spokojna, burzowa albo słoneczna. Sprawdzimy razem, jaka jest dziś?",
 "krok": "Dłoń na brzuchu. Nazwij pogodę w środku jednym słowem.",
 "minimum": "Dłoń na brzuchu, jeden wdech.",
 "odzew": "U mnie lekki wiatr. Pogoda w środku zmienia się jak ta za oknem.",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „serce widzi, jak czuje się ktoś” — własny stan przez metaforę pogody, bez czytania innych."
}
```

Panel — ss: pogoda zamiast skali emocji; ps: o sobie, nie o innych; jedno słowo, bez zwierzeń; so: nic nie zakłada; pe: 1–3 zna pogodę; słowo = koniec; r13: przy śniadaniu, samo; r48: w myślach, prywatnie; cw: „Pogoda w brzuchu” zostaje; ng: lisek mówi o swojej pogodzie — ok

Było (`dailyTipsData.js:1917`): „Nie wszystko, co czujesz, jest Twoje” — Jesli rano jest Ci dziwnie smutno bez powodu - moze to nie Twoje. Moze ktos obok sie martwi. Powiedz sobie: 'sprawdzam - co jest moje?'.

#### EM-D13-S1 · Ciepło z własnych dłoni

```json
{
 "id": "EM-D13-S1",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "cialo-kolor-postac",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Ciepło z własnych dłoni",
 "zapowiedz": "Dłonie potrafią zrobić własne ciepło. Potrzemy je razem i sprawdzimy, gdzie najlepiej grzeją?",
 "krok": "Potrzyj dłonie, aż będą ciepłe. Połóż je na policzkach.",
 "minimum": "Potrzyj dłonie trzy razy.",
 "odzew": "Ja grzeję łapy w ogonie. A u ciebie, gdzie grzeją najlepiej?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „nie wszystko, co czujesz, jest Twoje” — samoukojenie dotykiem, którego dziecko jest źródłem."
}
```

Panel — ss: ciało robi coś dla ciała; ps: uziemienie, bez interpretacji uczuć; so: nic nie zakłada; pe: dwa kroki, ale jeden ruch — ok dla 1–3; r13: dwadzieścia sekund; r48: ok, prywatne; cw: tytuł ciepły, nie słodki; ng: tokeny są

Było (`dailyTipsData.js:2017`): „Twoje 'czuje' jest madroscia” — Kiedy mowisz 'czuje, ze...' - to nie wymysl. To Twoja inteligencja. Dorosli czasem zapominaja, ze tak tez sie mysli. Ty pamietaj.

#### EM-D16-S1 · Coś dla kogoś, po cichu

```json
{
 "id": "EM-D16-S1",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zyczliwosc",
 "wejscie": "cialo-kolor-postac",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "rodzina": "po-cichu",
 "tytul": "Coś dla kogoś, po cichu",
 "zapowiedz": "Mała wygoda dla kogoś, po cichu: kubek bliżej, krzesło odsunięte. Zrobimy to razem?",
 "krok": "Zrób jedną małą wygodę dla kogoś, zanim ktoś zauważy.",
 "minimum": "Podsuń komuś jedną rzecz bliżej.",
 "odzew": "Nikt nie widział. Tak działają najlepsze wygody.",
 "slad": "kropla-swiatla",
 "uzasadnienie": "Zamiast maksymy o „czuję” — gest bez słów i bez widowni; działa w domu, świetlicy i autobusie."
}
```

Panel — ss: inicjowanie bez proszenia i bez publiczności; ps: sprawczość, bez pracy emocjonalnej; so: „ktoś” = kto jest obok; nie zakłada rodziny; pe: 1–3 potrafi „podsunąć”; r13: zrobi po drodze; r48: nikt nie widzi — zrobi; cw: „po cichu” to zwrot akcji; ng: lisek zauważa czynność, nie chwali

Było (`dailyTipsData.js:2137`): „Slowa, ktore nosza ciepło” — Naukowcy mowia, ze powtarzane w glowie dobre slowa - 'spokoj', 'czulosc', 'odwaga' - faktycznie zmieniaja samopoczucie. Slowa to leki bez recepty.

#### EM-D20-S1 · Ramiona do uszu i w dół

```json
{
 "id": "EM-D20-S1",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "napiecie-pusc",
 "wejscie": "cialo-kolor-postac",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "fazy",
 "tytul": "Ramiona do uszu i w dół",
 "zapowiedz": "Rano ramiona lubią być blisko uszu. Podniesiemy je razem wysoko i puścimy z wydechem?",
 "krok": "Ramiona do uszu, policz do trzech, puść. Trzy razy.",
 "minimum": "Jeden raz: ramiona w górę i w dół.",
 "odzew": "U mnie ramiona opadły z wydechem. A u ciebie?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast „słowa to leki bez recepty” — napięcie i puszczenie barków, technika bez pseudonauki."
}
```

Panel — ss: napnij–puść zamiast słów; ps: zdrowe, bez afirmacji; so: nic nie zakłada; pe: trzy razy = koniec; r13: pół minuty, samo; r48: ok; cw: rytm w tytule; ng: bez cyfr w TTS

Było (`dailyTipsData.js:2197`): „Muszla Echa przyjmuje sekret” — Szepnij dzis do swojej dloni - jak do muszli - jeden sekret z dnia. Nikomu nie musisz mowic. Muszla Echa go pilnuje.

#### EM-D21-S3 · Napnij i puść pod kocem

```json
{
 "id": "EM-D21-S3",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "napiecie-pusc",
 "wejscie": "cialo-kolor-postac",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Napnij i puść pod kocem",
 "zapowiedz": "Pod kocem da się zrobić falę: ciało napięte, potem luźne jak woda. Spróbujemy razem?",
 "krok": "Napnij całe ciało na trzy i puść. Powtórz trzy razy.",
 "minimum": "Zaciśnij pięści i puść.",
 "odzew": "Widziałem falę. Ja po trzeciej leżę jak koc.",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „sekretu, którego nikomu nie mówisz” — rozluźnianie przez napięcie; fala zostaje jako obraz, nie kraina."
}
```

Panel — ss: fala w ciele zamiast fali w morzu; ps: zero sekretów; technika klasyczna; so: koc/leżenie — każde łóżko; pe: 1–3: „napnij i puść” rozumie; r13: w łóżku; r48: ok; cw: tytuł prosty; ng: bez obietnicy snu

Było (`dailyTipsData.js:2217`): „Mozesz dzis byc w swoim tempie” — Nie musisz dzis biec za innymi. Twoje tempo jest dobre. Powiedz sobie: 'ide swoim tempem, w swoim swietle'.

#### EM-D22-S1 · Zwierzę na dziś

```json
{
 "id": "EM-D22-S1",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "emocje-cialo",
 "wejscie": "cialo-kolor-postac",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Zwierzę na dziś",
 "zapowiedz": "Każdy poranek ma swoje zwierzę: żółw, wiewiórka albo kot. Przejdziemy razem przez pokój jego krokiem?",
 "krok": "Wybierz zwierzę na dziś i przejdź jego krokiem przez pokój.",
 "warianty": {
  "4-8": {
   "krok": "Wybierz tempo na dziś i przejdź tak przez pokój.",
   "zapowiedz": "Każdy poranek ma swoje tempo: wolne, skoczne albo ciche. Przejdziemy razem przez pokój w twoim?"
  }
 },
 "minimum": "Nazwij w myślach zwierzę, które dziś pasuje.",
 "odzew": "Ja dziś jestem liskiem, jak zawsze. A ty, kim {szedłeś|szłaś}?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast afirmacji „idę swoim tempem” — stan przez postać i ruch; tempo wybiera ciało, nie zdanie."
}
```

Panel — ss: postać zamiast etykiety; ruch zamiast słowa; ps: emocja przez postać, bez nazywania siebie; so: nic nie zakłada; pe: 1–3 uwielbia; 4–8 w pokoju, solo; r13: pół minuty; r48: w swoim pokoju zrobi; minimum w myślach; cw: tytuł krótki; ng: lisek nie wybiera za dziecko

Było (`dailyTipsData.js:2317`): „Mozesz prosic o pomoc” — Czesto pomagasz innym. Pamietaj - Ty tez mozesz prosic. Dorosly obok Ciebie chce pomoc. Powiedz dzis, gdy cos jest za trudne.

#### EM-D25-S1 · Dziesięć uderzeń serca

```json
{
 "id": "EM-D25-S1",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "emocje-cialo",
 "wejscie": "cialo-kolor-postac",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Dziesięć uderzeń serca",
 "zapowiedz": "Serce liczy cały czas, tylko nikt go nie słucha. Posłuchamy razem dziesięciu uderzeń?",
 "krok": "Podskocz trzy razy, dłoń na sercu, policz dziesięć uderzeń.",
 "minimum": "Dłoń na sercu na jeden oddech.",
 "odzew": "Moje bije szybciej, bo jestem mały. A twoje, szybko czy wolno?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „dorosły obok chce pomóc” (zakłada dorosłego) — kontakt z własnym ciałem, dostępny zawsze."
}
```

Panel — ss: obserwowanie czegoś, co i tak trwa; ps: nie zakłada nikogo; interocepcja; so: nic nie zakłada; pe: 1–3 liczy do dziesięciu; r13: minuta; r48: ok; cw: tytuł liczbowy, słownie; ng: tokeny są

Było (`dailyTipsData.js:2517`): „Muszla Echa pamieta wszystko” — Trzydziesci dni razem. Twoja Muszla Echa zna teraz Twoj oddech, Twoj kolor, Twoje slowo. Przyloz dlon do ucha. Posluchaj - to Ty. Cala, piekna.

#### EM-D30-S3 · Coś, co dziś działało

```json
{
 "id": "EM-D30-S3",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "zyczliwosc",
 "wejscie": "cialo-kolor-postac",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Coś, co dziś działało",
 "zapowiedz": "Cały dzień coś działa dla nas po cichu: kran, światło, czyjeś drzwi. Przypomnimy sobie jedną taką rzecz?",
 "krok": "Przypomnij jedną rzecz albo osobę, która dziś ci pomogła.",
 "minimum": "Jedna rzecz, która dziś działała.",
 "odzew": "Mnie pomógł wiatr, pchał w plecy. Dobrze mieć to w głowie na noc.",
 "slad": "kropla-swiatla",
 "uzasadnienie": "Zamiast „trzydzieści dni razem, cała piękna” — wdzięczność bez przymusu i bez licznika; rzeczy i ludzie, więc nie zakłada, że ktoś dziś coś zrobił."
}
```

Panel — ss: odwrócenie: nie ja dla kogoś, ktoś dla mnie; ps: wdzięczność bez wymuszenia; minimum ratuje gorszy dzień; so: nie zakłada rodziny; pe: jedna rzecz = koniec; r13: w łóżku; r48: prywatne, nie do powiedzenia na głos; cw: tytuł jak zdanie — ok; ng: bez liczników

Było (`dailyTipsData.js:7325`): „Nie musisz naprawiać każdego smutku” — Czasem ktoś obok jest smutny i nic na to nie poradzisz. To nie Twoja wina. Możesz po prostu być blisko i milczeć. Wizkor mówi: obecność też pomaga, nawet bez słów.

#### EM-D14-S2-LUKA · Wolne miejsce obok

```json
{
 "id": "EM-D14-S2-LUKA",
 "profile": [
  "EM"
 ],
 "etap": "oba",
 "pora": "poludnie",
 "rodzaj": "zyczliwosc",
 "wejscie": "cialo-kolor-postac",
 "tryb": "zaproszenie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Wolne miejsce obok",
 "zapowiedz": "Wolne miejsce obok to zaproszenie bez słów. Zrobimy je razem: odsunąć torbę, przesunąć się o kawałek?",
 "krok": "Zrób obok siebie wolne miejsce i policz do dwudziestu.",
 "minimum": "Przesuń torbę o jedno miejsce.",
 "odzew": "Wolne miejsce nie musi się zapełnić, żeby działać.",
 "slad": "kropla-swiatla",
 "uzasadnienie": "Zamiast czekania na cudzy smutek — zaproszenie bez słów; działa w świetlicy, autobusie i w domu; nikt nie musi z niego skorzystać."
}
```

Panel — ss: zaproszenie bez zaczepiania; ps: nie robi z dziecka opiekuna; brak porażki; so: ławka, autobus, kanapa; pe: „do dwudziestu” = koniec; r13: w świetlicy albo przy stole; r48: niewidoczne dla innych — zrobi; cw: tytuł jasny; ng: „nie musi” to nie „musisz” — ok

### 7.3 ST (8)

Było (`dailyTipsData.js:2739`): „Mosty nad doliną” — Wizkor opowiada: między górskimi szczytami wiszą mosty z mocnych sznurów. Wyobraź sobie jeden taki most i przejdź po nim w myślach.

#### ST-D10-S1 · Wydech o jeden dłuższy

```json
{
 "id": "ST-D10-S1",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "oddech",
 "wejscie": "liczenie-porzadek",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Wydech o jeden dłuższy",
 "zapowiedz": "Wydech da się zmierzyć, licząc w głowie. Zrobimy razem trzy, każdy o jeden dłuższy?",
 "krok": "Policz wydech. Następny o jeden dłuższy. Trzy razy.",
 "minimum": "Jeden wydech do końca powietrza.",
 "odzew": "Ja doszedłem do sześciu. A ty, dokąd {doszedłeś|doszłaś}?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast mostu w myślach — wydłużony wydech sterowany liczeniem (wejście ST)."
}
```

Panel — ss: liczenie jako sterownik ciała; ps: technika poprawna, bez wstrzymywania; so: nic nie zakłada; pe: 1–3 liczy do kilku; ok; r13: minuta; r48: ok; cw: tytuł precyzyjny; ng: bez cyfr

Było (`dailyTipsData.js:2899`): „Lampka w górskim domku” — W górskiej wiosce wieczorem w każdym oknie zapala się jedna lampka. Twoja dzisiejsza lampka to jedno dobre słowo o sobie. Powiedz je.

#### ST-D17-S3 · Ile świateł jeszcze świeci

```json
{
 "id": "ST-D17-S3",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "wyciszenie",
 "wejscie": "liczenie-porzadek",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Ile świateł jeszcze świeci",
 "zapowiedz": "Wieczorem światła gasną jedno po drugim. Policzymy razem, ile jeszcze świeci w twoim domu?",
 "krok": "Policz światła, które jeszcze się palą w domu.",
 "minimum": "Policz światła w jednym pokoju.",
 "odzew": "U mnie zostało jedno. Liczby wieczorem robią się małe.",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Zamiast „dobrego słowa o sobie” (afirmacja) — liczenie zamykające dzień, z naturalnym końcem."
}
```

Panel — ss: liczenie tego, co znika; ps: bez oceny, bez afirmacji; so: pokój w bloku ma dwa światła — minimum; pe: 1–3 policzy; r13: w drodze do łóżka; r48: ok; cw: tytuł-pytanie; ng: lisek liczy swoje

Było (`dailyTipsData.js:3139`): „Zwój przed wyruszeniem” — W górskich domach przed wyjściem rozwija się jeden zwój i czyta jedno zdanie. Twoje dzisiejsze zdanie: idę krok po kroku.

#### ST-D28-S1 · Trzy rzeczy w kolejności

```json
{
 "id": "ST-D28-S1",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "tworzenie",
 "wejscie": "liczenie-porzadek",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Trzy rzeczy w kolejności",
 "zapowiedz": "Rzeczy na stole nie znają kolejności, dopóki ktoś jej nie ustali. Ułożymy razem trzy od najmniejszej?",
 "krok": "Ustaw trzy rzeczy w rzędzie od najmniejszej do największej.",
 "minimum": "Wskaż palcem najmniejszą rzecz na stole.",
 "odzew": "Widziałem rząd. U mnie: szyszka, kamyk, gałąź.",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Zamiast zwoju z afirmacją — porządek zrobiony ręką, sprawdzalny wzrokiem."
}
```

Panel — ss: porządek jako mikrotworzenie; ps: ok; so: stół i trzy rzeczy — wszędzie; pe: porównanie wielkości = 1–3; r13: przy śniadaniu; r48: ok, szybkie; cw: tytuł ok; ng: lisek podaje swój rząd, nie ocenia

Było (`dailyTipsData.js:6737`): „Strzałka w głowie” — Wizkor radzi: jeśli czujesz zamęt, narysuj w głowie jedną strzałkę. To pierwszy znak na nowej mapie. Reszta drogi sama się ułoży.

#### ST-D08-S1-NEW6 · Ile wdechów do skarpetek

```json
{
 "id": "ST-D08-S1-NEW6",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "oddech",
 "wejscie": "liczenie-porzadek",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Ile wdechów do skarpetek",
 "zapowiedz": "Skarpetki da się zmierzyć oddechem. Policzymy razem, ile wdechów trwa ich włożenie?",
 "krok": "Policz wdechy, zanim włożysz obie skarpetki.",
 "minimum": "Jeden wdech, jedna skarpetka.",
 "odzew": "Ja skarpetek nie noszę, więc zero. A u ciebie, ile wdechów?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „strzałki w głowie” — oddech doczepiony do czynności, która i tak się dzieje."
}
```

Panel — ss: pomiar codziennej rzeczy oddechem; ps: ok; so: lato bez skarpetek — minimum: buty; pe: 1–3 policzy do kilku; r13: rano i tak wkłada; r48: uśmiechnie się, zrobi; cw: tytuł zabawny; ng: tokeny są

Było (`dailyTipsData.js:6805`): „Kompas w kieszeni” — Wyobraź sobie mały kompas w kieszeni. Strzałka pokazuje to, co dziś najważniejsze. Wizkor mówi: kierunek jest cenniejszy niż prędkość.

#### ST-D13-S1-NEW10 · Trzy okrągłe rzeczy

```json
{
 "id": "ST-D13-S1-NEW10",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "liczenie-porzadek",
 "tryb": "obserwowanie",
 "gdzie": "apka",
 "silnik": "szukanie",
 "tytul": "Trzy okrągłe rzeczy",
 "zapowiedz": "Okrągłe rzeczy chowają się wszędzie: kubek, guzik, zegar. Znajdziemy razem trzy, zanim wyjdziesz?",
 "krok": "Znajdź trzy okrągłe rzeczy i dotknij każdej.",
 "minimum": "Jedna okrągła rzecz, jeden dotyk.",
 "odzew": "Ja znalazłem oczko wodne. Duże, ale okrągłe.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast kompasu-maksymy — kształt jako porządek do odnalezienia; silnik szukania (trzy kropki)."
}
```

Panel — ss: geometria w kuchni; ps: ok; so: wszędzie; pe: 1–3 zna koło; r13: minuta; r48: ok; cw: tytuł ok; ng: oczko wodne istnieje w scenie — ok

Było (`dailyTipsData.js:6873`): „Najpierw to, co najtrudniejsze” — Wizkor radzi: spróbuj zacząć od trudniejszej rzeczy, gdy głowa jest świeża. Łatwe poczeka. Myśliciel wie, że poranek ma najwięcej siły.

#### ST-D17-S1-NEW14 · Jedna noga, do dziesięciu

```json
{
 "id": "ST-D17-S1-NEW14",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "ruch",
 "wejscie": "liczenie-porzadek",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "fazy",
 "tytul": "Jedna noga, do dziesięciu",
 "zapowiedz": "Rano ciało lubi sprawdzić, czy trzyma równowagę. Postoimy razem na jednej nodze, licząc do dziesięciu?",
 "krok": "Przy ścianie stań na jednej nodze. Policz do dziesięciu.",
 "minimum": "Jedna noga, policz do trzech.",
 "odzew": "Ja miałem ogon do równowagi. Ty {próbowałeś|próbowałaś} bez. To trudniejsze.",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast poradnika produktywności — równowaga z liczeniem; „przy ścianie” zdejmuje ryzyko."
}
```

Panel — ss: ciało liczy za głowę; ps: ok, bez wyścigu; so: ściana jest wszędzie; pe: 1–3 do dziesięciu przy ścianie; r13: pół minuty; r48: ok; cw: tytuł 28 na styk; ng: tokeny są

Było (`dailyTipsData.js:6890`): „Tydzień to siedem światełek” — Wieczorem pomyśl: dziś było jedno światełko, jutro będzie drugie. W tygodniu jest siedem. Każde inne. Wizkor mówi: liczenie dni dodaje im wartości.

#### ST-D18-S3-NEW15 · Dźwięki od trzech do jednego

```json
{
 "id": "ST-D18-S3-NEW15",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "wyciszenie",
 "wejscie": "liczenie-porzadek",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Dźwięki od trzech do jednego",
 "zapowiedz": "Wieczorem dźwięki gasną po kolei. Policzymy razem, aż zostanie tylko jeden?",
 "krok": "Policz dźwięki, które słyszysz. Czekaj, aż zostanie jeden.",
 "minimum": "Znajdź jeden dźwięk i posłuchaj go.",
 "odzew": "U mnie został wiatr. Ja liczę w dół, bo tak wolniej.",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Zamiast „liczenie dni dodaje wartości” — liczenie w dół dźwięków; koniec wyznacza dom."
}
```

Panel — ss: liczenie w dół, koniec ze świata; ps: ok; so: wszędzie; pe: ok dla 1–3; r13: w łóżku; r48: ok; cw: tytuł ok; ng: lisek liczy swoje

Było (`dailyTipsData.js:7530`): „Rzecz, która zajmuje minutę” — Wizkor radzi: jeśli coś zajmuje mniej niż minutę, zrób to od razu. Odstawiony kubek, zamknięta szuflada. Znajdź dziś jedną taką rzecz i miej ją z głowy.

**Druga sesja zdjęła „Wizkor radzi”**; obowiązek domowy („odstawić kubek… załatwić od razu”) został. Moja wersja zostaje.

#### ST-D25-S2-LUKA · Ile nóg jest w pokoju

```json
{
 "id": "ST-D25-S2-LUKA",
 "profile": [
  "ST"
 ],
 "etap": "oba",
 "pora": "poludnie",
 "rodzaj": "zmysly",
 "wejscie": "liczenie-porzadek",
 "tryb": "obserwowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Ile nóg jest w pokoju",
 "zapowiedz": "Nogi mają nie tylko ludzie, ale też krzesła i stół. Policzymy razem wszystkie nogi w pokoju?",
 "krok": "Policz wszystkie nogi w pokoju: ludzi, krzeseł i stołów.",
 "minimum": "Policz nogi jednego krzesła.",
 "odzew": "Ja mam cztery, liczę się podwójnie. {Doliczyłeś|Doliczyłaś} do końca?",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast „zrób od razu” (obowiązek domowy) — liczenie z niespodzianką w wyniku, bez porządkowania."
}
```

Panel — ss: liczenie tego, czego nikt nie liczy; ps: ok; so: pokój = klasa, świetlica, kuchnia; pe: 1–3 do dwudziestu z pomocą palców; minimum ratuje; r13: ok; r48: ok, zabawne; cw: tytuł-pytanie; ng: tokeny są

### 7.4 KR (7)

Było (`dailyTipsData.js:3365`): „Sekret pustyni” — Na pustyni piasek mówi szeptem. Gdy zamkniesz oczy na chwilę rano, może usłyszysz jedną małą podpowiedź.

#### KR-D05-S1 · Mapa z pogniecionej kartki

```json
{
 "id": "KR-D05-S1",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Mapa z pogniecionej kartki",
 "zapowiedz": "Pognieciona kartka ma na sobie góry i rzeki. Zrobimy razem taką mapę i nazwiemy jedno miejsce?",
 "krok": "Zgnieć kartkę, rozprostuj i nazwij jedno miejsce z zagięć.",
 "minimum": "Zgnieć jedną kartkę i rozprostuj.",
 "odzew": "Widziałem rzekę w zagięciu. Moja mapa ma jeszcze górę.",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Zamiast szeptu pustyni — materiał w rękach; kartka to stara gazeta albo ulotka."
}
```

Panel — ss: ślad zamiast efektu: zagięcia są mapą; ps: ok; so: kartka = ulotka z klatki; pe: 1–3 potrafi; r13: minuta, bez sprzątania; r48: ok; cw: tytuł ok; ng: bez krain

Było (`dailyTipsData.js:3533`): „Oaza na pustyni” — Na pustyni jest oaza, gdzie rosną drzewa z papierowymi liśćmi. Każdy liść to jeden pomysł. Weź sobie dziś jeden.

#### KR-D10-S1 · Do czego jeszcze to służy

```json
{
 "id": "KR-D10-S1",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "rodzina": "drugie-uzycie",
 "tytul": "Do czego jeszcze to służy",
 "zapowiedz": "Łyżka może być łopatką, a kubek bębnem. Weźmiemy razem jedną rzecz i wymyślimy jej drugie życie?",
 "krok": "Weź jedną rzecz ze stołu i pokaż ręką jej nowe zastosowanie.",
 "minimum": "Weź jedną rzecz i obróć ją do góry nogami.",
 "odzew": "Ja z kubka zrobiłem kapelusz. A ty, co z czego?",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Zamiast oazy z liśćmi-pomysłami — pomysł pokazany ręką, z przedmiotem, który jest pod ręką."
}
```

Panel — ss: zamiana ról przedmiotu; ps: nie ma złej odpowiedzi; so: stół i rzecz — wszędzie; pe: 1–3: „pokaż ręką” zamiast „opisz”; r13: ok; r48: ok; cw: tytuł ok; ng: lisek nie ocenia

Było (`dailyTipsData.js:3701`): „Miraż na pustyni” — Na pustyni czasem widzi się coś, czego nie ma. To miraż. Twoja wyobraźnia też umie tak czarować. Co dziś zobaczysz?

#### KR-D15-S1 · Jedna linia, jeden kubek

```json
{
 "id": "KR-D15-S1",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Jedna linia, jeden kubek",
 "zapowiedz": "Da się narysować kubek jedną linią, bez odrywania ręki. Spróbujemy razem, choćby palcem po stole?",
 "krok": "Narysuj kubek jedną linią, nie odrywając ręki.",
 "minimum": "Narysuj kubek palcem po stole.",
 "odzew": "Mój wyszedł krzywy i taki ma być. A twój, jaki wyszedł?",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Zamiast mirażu — ograniczenie (jedna linia) jako zwrot akcji; minimum nie wymaga kredki."
}
```

Panel — ss: ograniczenie w stylu Oulipo; ps: krzywy = dobry, mówi to lisek o sobie; so: palec po stole — bez kredek; pe: 1–3 potrafi; r13: ok; r48: ok; cw: tytuł rytmiczny; ng: ok

Było (`dailyTipsData.js:3890`): „Karawana pomysłów na pustyni” — Przez pustynię idą długie karawany. Każdy wielbłąd niesie jeden pomysł. Co dziś niesie twój wielbłąd?

#### KR-D20-S1 · Trzy uderzenia na kubku

```json
{
 "id": "KR-D20-S1",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "rece-material",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Trzy uderzenia na kubku",
 "zapowiedz": "Każda rzecz ma swój dźwięk: kubek, stół, łyżka. Znajdziemy razem najlepszy bęben w kuchni?",
 "krok": "Zastukaj cicho w trzy rzeczy i wybierz najlepszy dźwięk.",
 "minimum": "Zastukaj palcem w stół trzy razy.",
 "odzew": "Ja wybieram głaz. Ty {znalazłeś|znalazłaś} swój bęben.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast karawany pomysłów — materiał poznawany słuchem; „cicho” ratuje poranek w bloku."
}
```

Panel — ss: materiał ma dźwięk; ps: ok; so: „cicho” — sąsiedzi za ścianą; pe: trzy = koniec; r13: cicho, więc ok; r48: ok; cw: tytuł ok; ng: głaz istnieje w scenie

Było (`dailyTipsData.js:4268`): „Sny mają więcej kolorów” — Naukowcy mówią, że w snach widzimy kolory, których na jawie nikt nie potrafi narysować. Wynalazcy noszą te kolory w sobie cały dzień.

#### KR-D30-S1 · Kolor bez nazwy

```json
{
 "id": "KR-D30-S1",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Kolor bez nazwy",
 "zapowiedz": "Niektóre kolory nie mają swojej nazwy: coś między szarym a zielonym. Znajdziemy razem jeden i nazwiemy go?",
 "krok": "Znajdź kolor, który nie ma nazwy, i nadaj mu ją na głos.",
 "minimum": "Wskaż jeden kolor, który trudno nazwać.",
 "odzew": "Mój ogon jest „rudy po deszczu”. A twój kolor, jak się nazywa?",
 "slad": "kwiat-koloru",
 "uzasadnienie": "Zamiast pseudonauki o snach — nazwanie koloru (jak KR-D06 dla rzeczy); ślad: kwiat w tym kolorze."
}
```

Panel — ss: nazywanie zamiast zbierania; ps: ok; so: wszędzie; pe: 1–3: „na głos” = koniec; r13: ok; r48: w myślach, jeśli wstyd — minimum; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:7094`): „Wyobraźnia jest jak mięsień” — Wizkor szepcze: im częściej coś sobie wyobrażasz, tym szybciej przychodzą nowe obrazy. Wynalazca ćwiczy umysł zabawą.

#### KR-D27-S2-NEW6 · Rysunek z zamkniętymi oczami

```json
{
 "id": "KR-D27-S2-NEW6",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poludnie",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Rysunek z zamkniętymi oczami",
 "zapowiedz": "Ręka umie rysować sama, gdy oczy odpoczywają. Narysujemy razem dom, nie patrząc na kartkę?",
 "krok": "Zamknij oczy i narysuj dom. Otwórz dopiero po dachu.",
 "minimum": "Narysuj z zamkniętymi oczami jedno kółko.",
 "odzew": "Mój dom miał drzwi na dachu. Twój też jest jedyny taki.",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Zamiast „wyobraźnia jak mięsień” — ograniczenie (bez oczu), które gwarantuje niepowtarzalny wynik."
}
```

Panel — ss: ograniczenie: bez patrzenia; ps: nie da się źle; so: kartka i cokolwiek do pisania; pe: 1–3 potrafi; r13: ok; r48: dom z zamkniętymi oczami to gra, nie dziecinada; cw: tytuł 28; ng: ok

Było (`dailyTipsData.js:7695`): „Nocna mapa pustyni” — Nocą piasek układa się w nowe kształty i rano mapa nigdy nie wygląda tak samo. Wymyśl dziś nazwę jednego miejsca, które chcesz tam znaleźć.

#### KR-D24-S2-LUKA · Zwierzę z trzech rzeczy

```json
{
 "id": "KR-D24-S2-LUKA",
 "profile": [
  "KR"
 ],
 "etap": "oba",
 "pora": "poludnie",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Zwierzę z trzech rzeczy",
 "zapowiedz": "Gumka, klucz i spinacz potrafią być zwierzęciem, gdy je ułożyć. Zrobimy razem jedno?",
 "krok": "Ułóż zwierzę z trzech rzeczy pod ręką i nazwij je.",
 "minimum": "Połóż dwie rzeczy tak, żeby wyglądały jak oczy.",
 "odzew": "Jeż ze spinaczy? Nazwa nadana, zwierzę istnieje.",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Zamiast nocnej mapy pustyni — składanie z tego, co w piórniku albo kieszeni; działa w szkole."
}
```

Panel — ss: materiał z kieszeni; ps: ok; so: piórnik, kieszeń, stół; pe: trzy = koniec; r13: ok; r48: ok, szybkie; cw: tytuł ok; ng: ok

### 7.5 LD (16)

Było (`dailyTipsData.js:4370`): „Dziś jestem dla kogoś” — Mały Śmiałku, zacznij dzień od myśli: „dziś jestem dla kogoś”. Nie musisz wiedzieć dla kogo. Życie ci podpowie. Tarcza Słońca rozgrzewa twoją pierś.

#### LD-D03-S1 · Strząśnij i zamrzyj

```json
{
 "id": "LD-D03-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "napiecie-pusc",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "fazy",
 "tytul": "Strząśnij i zamrzyj",
 "zapowiedz": "Rano ciało ma w sobie dużo prądu. Strząśniemy go razem, zamrzemy na trzy i puścimy wydechem?",
 "krok": "Potrząśnij ciałem, zamrzyj na trzy, wydech. Trzy razy.",
 "minimum": "Potrząśnij dłońmi i zrób jeden wydech.",
 "odzew": "U mnie ogon zamarł w powietrzu. A u ciebie, co zamarło?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast afirmacji z Tarczą Słońca — sygnatura LD: strząśnij → zamrzyj → wydech."
}
```

Panel — ss: trzy fazy zamiast jednego „ruszaj”; ps: rozładowanie pobudzenia, bez słów; so: wszędzie; pe: 1–3 uwielbia „zamrzyj”; r13: ok; r48: w pokoju zrobi; cw: tytuł ok; ng: tokeny są

Było (`dailyTipsData.js:4450`): „Tarcza Słońca w piersi” — Twój pierwszy artefakt to Tarcza Słońca. Wyobraź sobie, że masz ją w piersi. Świeci ciepłem dla każdego, kto cię spotka. Wstajesz z tarczą.

#### LD-D05-S1 · Lwi wydech

```json
{
 "id": "LD-D05-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "oddech",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Lwi wydech",
 "zapowiedz": "Lwy ziewają na cały pysk i nie wstydzą się tego. Zrobimy razem trzy lwie wydechy z językiem na wierzchu?",
 "krok": "Wdech nosem, wydech z językiem na wierzchu. Trzy razy.",
 "minimum": "Jedno wielkie ziewnięcie.",
 "odzew": "Mój lwi wydech przestraszył ptaka. A twój, kogo przestraszył?",
 "warianty": {
  "4-8": {
   "zapowiedz": "Lwy ziewają na cały pysk. Zrobimy razem trzy długie wydechy otwartymi ustami?",
   "krok": "Wdech nosem, długi wydech otwartymi ustami. Trzy razy.",
   "odzew": "Mój lwi wydech przestraszył ptaka. A twój, jak daleko doleciał?"
  }
 },
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast tarczy w piersi — lwi wydech (technika z promptu C.3), ciało zamiast artefaktu."
}
```

Panel — ss: dźwięk i mina zamiast cichego oddechu; ps: rozładowanie, zabawa; so: wszędzie; pe: 1–3 tak; 4–8 solo; r13: ok; r48: zrobi w łazience, nie przy bracie — minimum ziewnięcie; cw: tytuł dwa słowa; ng: ptak w scenie? — lisek opowiada, nie obiecuje

Było (`dailyTipsData.js:4570`): „Mała odwaga to też odwaga” — Posłuchaj, mały Śmiałku: nie musisz dziś robić niczego wielkiego. Powiedzieć „dzień dobry” pani, której się boisz — to też odwaga. Liczy się każdy krok.

#### LD-D08-S1 · Pierwsze dzień dobry

```json
{
 "id": "LD-D08-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "mikroodwaga",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Pierwsze dzień dobry",
 "zapowiedz": "Ktoś zawsze mówi dzień dobry pierwszy. Dziś spróbujemy razem, żeby to był twój głos?",
 "krok": "Powiedz dzień dobry komuś znajomemu, zanim on powie tobie.",
 "minimum": "Powiedz dzień dobry w myślach, patrząc na kogoś.",
 "odzew": "{Zdążyłeś pierwszy|Zdążyłaś pierwsza}? Jeśli nie, głos i tak był gotowy.",
 "slad": "slady-lap",
 "uzasadnienie": "Zamiast „pani, której się boisz” — inicjowanie wobec kogoś znanego; nie ma przegranej."
}
```

Panel — ss: inicjowanie: być pierwszym głosem; ps: bez strachu, z minimum w myślach; so: „znajomemu”, nie obcym; pe: 1–3 potrafi; r13: rano w domu; r48: ok, jedno słowo; cw: tytuł ok; ng: token dwuwyrazowy poprawny

Było (`dailyTipsData.js:4630`): „Pod chmurami” — Czy wiesz, że nawet największe odkrycia zaczynały się od jednego marzenia? Wizkor mówi, że marzenie zostawione pod chmurami nigdy nie ginie.

**Druga sesja poprawiła** (kopia robocza): zdjęła maksymę i cytat, zostawiła „pomyśl o jednej rzeczy, którą chciałbyś…” (bez tokenu, sama wyobraźnia). Moja wersja dodatkowo daje ciało (skoki → serce zwalnia) i token; zostaje jako propozycja.

#### LD-D09-S3 · Dziesięć wspięć i cisza

```json
{
 "id": "LD-D09-S3",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "ruch",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "fazy",
 "tytul": "Dziesięć wspięć i cisza",
 "zapowiedz": "Przed wieczorem ciało lubi jeszcze jeden wolny ruch. Wespniemy się razem dziesięć razy i postoimy?",
 "krok": "Dziesięć wspięć na palce, wolno. Stój, aż serce zwolni.",
 "minimum": "Trzy wspięcia i jeden długi wydech.",
 "odzew": "Moje serce zwolniło po dłuższej chwili. A twoje?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast maksymy o marzeniach — wolny ruch z fazą uspokojenia; wspięcia zamiast skoków, bo wieczór i sąsiad pod spodem."
}
```

Panel — ss: energia, potem stop; ps: zdrowe: pobudzenie i zejście; so: na palcach = blok; pe: 1–3 policzy skoki; r13: wieczorem? cicho, ok; r48: ok; cw: tytuł ok; ng: tokeny są

Było (`dailyTipsData.js:4650`): „Woda — sekret grzywy” — Czy wiesz, że twój mózg składa się w 75% z wody? Śmiałek, który zapomina pić, traci blask grzywy. Wizkor mówi: woda to ciche paliwo odwagi.

**Druga sesja poprawiła**: zdjęła „75%” i „blask grzywy”, ale wpisała „Pamiętaj, żeby regularnie się napić” (zakazane „pamiętaj”, bez czynności z końcem). Moja wersja dodatkowo daje czynność z końcem i zmysł zamiast pouczenia; zostaje.

#### LD-D10-S1 · Woda cieplejsza od dłoni?

```json
{
 "id": "LD-D10-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "energia-cialo",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Woda cieplejsza od dłoni?",
 "zapowiedz": "Rano dłonie i woda z kranu mają różną temperaturę. Sprawdzimy razem, co jest cieplejsze?",
 "krok": "Umyj ręce i sprawdź, czy woda jest cieplejsza od dłoni.",
 "minimum": "Dotknij kranu jedną dłonią.",
 "odzew": "U mnie oczko jest zimniejsze od łap. {Sprawdziłeś|Sprawdziłaś} swoje.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast „75% i blask grzywy” — porównanie temperatur bez zimnej wody jako techniki."
}
```

Panel — ss: pytanie, na które odpowiada ciało; ps: bez dyskomfortu; so: kran jest wszędzie; pe: ok; r13: i tak myje ręce; r48: ok; cw: tytuł-pytanie; ng: oczko istnieje

Było (`dailyTipsData.js:4830`): „Półmetek — przystań na chwilę” — Połowa drogi za nami, Śmiałku. Dziś rano nie biegnij. Usiądź na łóżku przez minutę. Posłuchaj oddechu. Śmiałek, który umie przystanąć, idzie dalej.

#### LD-D15-S1 · Zęby drugą ręką

```json
{
 "id": "LD-D15-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "mikroodwaga",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Zęby drugą ręką",
 "zapowiedz": "Druga ręka wszystko robi pierwszy raz. Umyjemy razem zęby tą, która zwykle tylko patrzy?",
 "krok": "Umyj zęby ręką, której zwykle do tego nie używasz.",
 "minimum": "Weź szczoteczkę do drugiej ręki na trzy ruchy.",
 "odzew": "Moja druga łapa też jest niezdarna. Pierwszy raz zawsze tak wygląda.",
 "slad": "slady-lap",
 "uzasadnienie": "Zamiast półmetka (licznik) — mikroodwaga w codziennej czynności; niezdarność jest wpisana."
}
```

Panel — ss: ograniczenie: druga ręka; ps: porażka wbudowana i nieszkodliwa; so: wszędzie; pe: ok; r13: i tak myje zęby; r48: ok, śmieszne; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:4910`): „Ognisko w piersi” — Gdzieś pod gwiazdami pali się ognisko Śmiałków. Wyobraź sobie, że masz takie małe ognisko w piersi. Grzeje cię i grzeje innych. Niesiesz je dziś przez dzień.

#### LD-D17-S1 · Ręce do sufitu

```json
{
 "id": "LD-D17-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "ruch",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "oddech",
 "tytul": "Ręce do sufitu",
 "zapowiedz": "Rano kręgosłup lubi się wydłużyć. Wyciągniemy razem ręce do sufitu na pięć oddechów?",
 "krok": "Ręce do sufitu. Pięć oddechów, każdy sięga wyżej.",
 "minimum": "Jedno przeciągnięcie z wdechem.",
 "odzew": "U mnie za piątym razem łapy sięgnęły gałęzi. A u ciebie?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast ogniska Śmiałków — przeciąganie z oddechem; pięć cykli jak w EkranOddechu."
}
```

Panel — ss: ruch z oddechem; ps: ok; so: wszędzie; pe: ok; r13: ok; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:4950`): „Dziś idę bez krzyku” — Mały Śmiałku, dziś spróbuj: cokolwiek się stanie, najpierw oddech, potem słowa. Lwia grzywa nie musi ryczeć. Może mówić cicho i też być słyszana.

#### LD-D18-S1 · Pięści na trzy i luz

```json
{
 "id": "LD-D18-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "napiecie-pusc",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Pięści na trzy i luz",
 "zapowiedz": "Pięści potrafią zebrać cały prąd z ciała. Zaciśniemy je razem na trzy i puścimy?",
 "krok": "Zaciśnij pięści na trzy i puść. Gdzie zrobiło się luźniej?",
 "minimum": "Jedno zaciśnięcie, jedno puszczenie.",
 "odzew": "U mnie luz zszedł do ogona. U ciebie pewnie gdzie indziej.",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast „dziś idę bez krzyku” — regulacja przez napięcie, bez zakazu emocji."
}
```

Panel — ss: napięcie z pytaniem na końcu; ps: nie tłumi złości — daje jej ciało; so: wszędzie; pe: ok; r13: ok; r48: ok; cw: tytuł ok; ng: pytanie w kroku ok

Było (`dailyTipsData.js:5010`): „Wizkor patrzy z chmury” — Wyobraź sobie, że Wizkor patrzy z chmury i widzi twój dzień. Co mówi? Nie krzyczy. Mówi: „widzę cię, {mały Śmiałku|mała Śmiałko}. Jesteś w porządku”.

#### LD-D19-S3 · Pierwszy raz dzisiaj

```json
{
 "id": "LD-D19-S3",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "mikroodwaga",
 "wejscie": "energia-cialo",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Pierwszy raz dzisiaj",
 "zapowiedz": "Każdy dzień ma w sobie jakiś pierwszy raz, nawet mały. Poszukamy go razem przed snem?",
 "krok": "Znajdź w dzisiejszym dniu jeden pierwszy raz.",
 "minimum": "Jedna nowa rzecz, którą dziś {widziałeś|widziałaś}.",
 "odzew": "Mój pierwszy raz: skok przez głaz. Twój zostaje z tobą.",
 "slad": "slady-lap",
 "uzasadnienie": "Zamiast Wizkora patrzącego z chmury — własne zauważenie próby, bez publiczności i bez raportu."
}
```

Panel — ss: obserwowanie własnej odwagi; ps: „zostaje z tobą” = bez zwierzeń; so: nic nie zakłada; pe: ok; r13: ok; r48: prywatne; cw: tytuł ok; ng: głaz istnieje

Było (`dailyTipsData.js:5030`): „Zbroja z gliny, nie z żelaza” — Posłuchaj, mały Śmiałku: twoja zbroja jest z miękkiej gliny, nie z twardego żelaza. To dlatego, że odwaga ma być ciepła, a nie zimna. Można w niej oddychać.

#### LD-D20-S1 · Trzy skoki, każdy wyżej

```json
{
 "id": "LD-D20-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "ruch",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Trzy skoki, każdy wyżej",
 "zapowiedz": "Rano nogi mają sprężyny. Podskoczymy razem trzy razy, każdy skok trochę wyżej?",
 "krok": "Podskocz trzy razy, każdy skok wyżej. Wyląduj cicho.",
 "minimum": "Jeden skok na palcach.",
 "odzew": "U mnie trzeci skok był najwyższy. A u ciebie, który?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast zbroi z gliny — ruch ze stopniowaniem; „cicho” to jedyny warunek."
}
```

Panel — ss: skala rosnąca; ps: ok; so: cicho = blok; pe: ok; r13: rano w bloku — na palcach; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5070`): „Trzy tygodnie — gdzie urosłaś/urosłeś?” — Mały Śmiałku, trzy tygodnie ze mną. Zatrzymaj się rano i zauważ jedną rzecz, w której jesteś inaczej niż na początku. Może bardziej spokojnie. Może bardziej śmiało.

**Druga sesja poprawiła tylko ukośnik → token** w tytule; licznik „trzy tygodnie ze mną” został. Moja wersja zostaje.

#### LD-D21-S1 · Zamrzyj co trzy kroki

```json
{
 "id": "LD-D21-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "ruch",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Zamrzyj co trzy kroki",
 "zapowiedz": "Idziemy przez pokój: trzy kroki i stop na jeden wydech. Wchodzisz?",
 "krok": "Idź przez pokój i zamieraj co trzy kroki na jeden wydech.",
 "minimum": "Trzy kroki i jeden stop.",
 "odzew": "U mnie stop wyszedł z ogonem w górze. A u ciebie, co zostało w górze?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast „trzy tygodnie ze mną” — ruch z zatrzymaniem i wydechem, bez porównań z „początkiem”."
}
```

Panel — ss: rytm: ruch–stop; ps: ok; so: wszędzie; pe: ok; r13: ok; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5190`): „Drużyna Śmiałków wokół ciebie” — Gdzieś pod tym samym niebem jest cała drużyna takich jak ty. Wyobraź sobie, że stoją wokół ciebie dzisiaj rano. Nie jesteś {sam|sama}. Idziesz w drużynie, nawet kiedy idziesz {sam|sama}.

#### LD-D24-S1 · Wydech z dźwiękiem

```json
{
 "id": "LD-D24-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "oddech",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Wydech z dźwiękiem",
 "zapowiedz": "Wydech może brzmieć jak wiatr albo jak pszczoła. Zrobimy razem trzy, każdy dłuższy?",
 "krok": "Zrób trzy wydechy z dźwiękiem, jak wiatr. Każdy dłuższy.",
 "minimum": "Jeden wydech z cichym mruczeniem.",
 "odzew": "Mój trzeci wydech brzmiał jak lisek. A twój, jak co?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „drużyny Śmiałków” — wydłużony wydech z dźwiękiem (mruczenie), technika sprawdzona."
}
```

Panel — ss: dźwięk jako miara wydechu; ps: ok; so: wszędzie; pe: ok; r13: ok; r48: minimum cicho, jeśli wstyd; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5230`): „Twoje serce — twój kompas” — Posłuchaj, Śmiałku: gdy nie wiesz, jak postąpić, połóż dłoń na piersi i zapytaj: „co jest dobre?”. Nie „co jest łatwe”, nie „co inni powiedzą”. Co jest DOBRE. Tam jest twój kompas.

#### LD-D25-S1 · Miejsce, gdzie nikt nie stoi

```json
{
 "id": "LD-D25-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "mikroodwaga",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Miejsce, gdzie nikt nie stoi",
 "zapowiedz": "W każdym domu jest kąt, w którym nikt nie staje. Staniemy tam razem na chwilę?",
 "krok": "Stań tam, gdzie nigdy nie stoisz, i popatrz stamtąd.",
 "minimum": "Obróć się i popatrz na pokój od tyłu.",
 "odzew": "Ja stanąłem na głazie. Pokój od tej strony to nowa mapa.",
 "slad": "slady-lap",
 "uzasadnienie": "Zamiast „co jest DOBRE” (kazanie) — zmiana miejsca ciała jako mikroodwaga i nowa perspektywa."
}
```

Panel — ss: skala: bardzo mały krok w nieznane; ps: ok; so: mały pokój też ma kąt; pe: ok; r13: ok; r48: ok; cw: tytuł ok; ng: głaz istnieje

Było (`dailyTipsData.js:5270`): „Nie musisz dziś wygrać” — {Mały Śmiałku|Mała Śmiałko}, dzisiejszy poranny szept Wizkora: nie musisz dziś niczego wygrać. Nie musisz być {najlepszy|najlepsza}. Wystarczy, że będziesz sobą. Tyle.

#### LD-D26-S1 · Najdłuższy krok

```json
{
 "id": "LD-D26-S1",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "ruch",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Najdłuższy krok",
 "zapowiedz": "Jest krok zwykły i jest krok najdłuższy z możliwych. Sprawdzimy razem, jak daleko sięga twój?",
 "krok": "Zrób jeden najdłuższy krok, jaki potrafisz. Potem zwykły.",
 "minimum": "Jeden krok trochę dłuższy niż zwykle.",
 "odzew": "Mój najdłuższy krok to prawie skok. A twój, dokąd sięgnął?",
 "slad": "slady-lap",
 "uzasadnienie": "Zamiast „wystarczy, że będziesz sobą” — próba z wpisaną granicą ciała, bez oceny."
}
```

Panel — ss: skala ruchu; ps: ok; so: wszędzie; pe: ok; r13: w skarpetkach na panelach — uwaga; minimum; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5430`): „Twoje miejsce — zawsze” — {Drogi Śmiałku|Droga Śmiałko}, kończymy 30 dni. Pamiętaj: pod tym niebem zawsze znajdziesz dla siebie miejsce. Tarcza Słońca nigdy nie znika. Idziesz {pierwszy|pierwsza} — nie z pychy, z troski.

#### LD-D30-S3 · Nogi ciężkie jak kamienie

```json
{
 "id": "LD-D30-S3",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "wieczor",
 "rodzaj": "napiecie-pusc",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Nogi ciężkie jak kamienie",
 "zapowiedz": "Wieczorem nogi mogą stać się ciężkie jak kamienie. Napniemy je razem na trzy i puścimy?",
 "krok": "Leżąc, napnij nogi na trzy i puść. Powtórz, aż będą ciężkie.",
 "minimum": "Napnij stopy raz i puść.",
 "odzew": "Moje łapy leżą jak głazy. A twoje nogi, jak co?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „kończymy 30 dni, pamiętaj, Tarcza Słońca” — rozluźnienie nóg na koniec dnia, bez licznika."
}
```

Panel — ss: ciężar zamiast lekkości; ps: ok; so: wszędzie; pe: ok; r13: w łóżku; r48: ok; cw: tytuł ok; ng: głazy istnieją

Było (`dailyTipsData.js:7128`): „Pierwszy krok zawsze jest najtrudniejszy” — Wizkor mówi: drugi krok jest już lżejszy od pierwszego, a trzeci sam się robi. Śmiałek zaczyna, nawet jeśli się trochę boi.

#### LD-D14-S2-NEW2 · Inne miejsce niż zwykle

```json
{
 "id": "LD-D14-S2-NEW2",
 "profile": [
  "LD"
 ],
 "etap": "oba",
 "pora": "poludnie",
 "rodzaj": "mikroodwaga",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Inne miejsce niż zwykle",
 "zapowiedz": "Każdy ma swoje stałe miejsce: przy stole, w świetlicy, na kanapie. Usiądziemy dziś razem gdzie indziej?",
 "krok": "Usiądź dziś raz w innym miejscu niż zwykle.",
 "minimum": "Przesuń się o jedno miejsce.",
 "odzew": "Inne miejsce, inny widok. Ja czasem siadam na głazie.",
 "slad": "slady-lap",
 "uzasadnienie": "Zamiast „trzeci krok sam się robi” — mikroodwaga bez widowni i bez wyścigu (pierwsza wersja „ręka w górę, zanim ktoś inny” wycofana po recenzji psychologa: wyścig i scena w klasie)."
}
```

Panel — ss: zmiana miejsca ciała, nie występ; ps: bez wyścigu, bez publiczności; so: stół, świetlica, autobus; pe: ok; r13: ok; r48: nikt nie zauważy; cw: tytuł ok; ng: głaz istnieje; odzew bez „widziałem”

### 7.6 MD (7)

Było (`dailyTipsData.js:5611`): „Dwa uszy, jedne usta” — Wizkor przypomina: masz dwa uszy i jedne usta nie przez przypadek. Dzisiaj posłuchaj dwa razy więcej, niż mówisz.

#### MD-D05-S1 · Gdzie ubranie dotyka skóry

```json
{
 "id": "MD-D05-S1",
 "profile": [
  "MD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Gdzie ubranie dotyka skóry",
 "zapowiedz": "Ubranie cały dzień dotyka skóry, a nikt tego nie czuje. Poczujemy razem trzy takie miejsca?",
 "krok": "Poczuj trzy miejsca, w których ubranie dotyka skóry.",
 "minimum": "Poczuj kołnierz albo rękaw przez jeden oddech.",
 "odzew": "Ja mam futro wszędzie, więc u mnie to trudne. A u ciebie, gdzie?",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast „dwa uszy, jedne usta” — uziemienie dotykiem, jedna rzecz naraz."
}
```

Panel — ss: zmysł, którego się nie zauważa; ps: ok; so: wszędzie; pe: trzy = koniec; r13: ok; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5692`): „Cicha pora poranka” — Poranek to najcichsza pora dnia. Wizkor mówi: cisza między dwoma uderzeniami serca to twoja prawdziwa ojczyzna.

**WYCOFANA.** Druga sesja przepisała wpis na „posłuchaj: jaki jest najcichszy dźwięk, który teraz słyszysz?” — czynność z końcem, zgodna ze standardem po poprawce (bez tytułu „Cicha pora poranka”). Moja wersja poniżej zostaje w `nowe-porady-C.json` tylko jako zapas, gdyby autor chciał uniknąć dubla z MD-D09-S1 (dźwięk do końca).

#### MD-D07-S1 · Jedna rzecz, aż coś nowego

```json
{
 "id": "MD-D07-S1",
 "profile": [
  "MD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "zmysly",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Jedna rzecz, aż coś nowego",
 "zapowiedz": "Nawet znana rzecz ma coś, czego nikt nie widział. Popatrzymy razem na jedną, aż to znajdziesz?",
 "krok": "Patrz na jedną rzecz, aż zauważysz w niej coś nowego.",
 "minimum": "Popatrz na jedną rzecz przez trzy oddechy.",
 "odzew": "Ja znalazłem rysę na głazie. Rzeczy otwierają się powoli.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Zamiast „ciszy jako ojczyzny” — patrzenie z końcem wyznaczonym przez odkrycie."
}
```

Panel — ss: obserwowanie aż do zmiany; ps: ok; so: wszędzie; pe: „aż zauważysz” — dla 1–3 minimum z oddechami; r13: ok; r48: ok; cw: tytuł ok; ng: głaz istnieje

Było (`dailyTipsData.js:5892`): „Cztery słowa, które otwierają” — „Rozumiem”, „opowiedz mi”, „co czujesz”, „dziękuję”. Wybierz dzisiaj jedno z nich i użyj go choć raz. Zobacz, co się stanie.

#### MD-D12-S1 · Do kropki, zanim odpowiesz

```json
{
 "id": "MD-D12-S1",
 "profile": [
  "MD"
 ],
 "etap": "4-8",
 "pora": "poranek",
 "rodzaj": "wyciszenie",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "odpowiadanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Do kropki, zanim odpowiesz",
 "zapowiedz": "Zdania mają kropkę na końcu, ale rzadko ktoś na nią czeka. Poczekamy dziś razem na jedną?",
 "krok": "Posłuchaj jednego zdania do samej kropki, zanim odpowiesz.",
 "minimum": "Policz w myślach do dwóch, zanim odpowiesz.",
 "odzew": "U mnie kropka zawsze czeka najdłużej. A u ciebie?",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Zamiast „co czujesz, opowiedz mi” (narzędzia mediatora) — skupienie na jednym zdaniu, bez roli pomocnika."
}
```

Panel — ss: odpowiadanie: czekanie na sygnał; ps: skupienie, nie mediacja; so: wszędzie; pe: 4–8; dla 1–3 zbyt abstrakcyjne; r13: —; r48: ok, niewidoczne; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5932`): „Waga w sercu — co dziś przewazy?” — Wyobraź sobie wagę w swoim sercu. Po jednej stronie spokój, po drugiej pośpiech. Co dzisiaj chcesz, żeby przewazyło?

#### MD-D13-S1 · Od dziesięciu do jednego

```json
{
 "id": "MD-D13-S1",
 "profile": [
  "MD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "oddech",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Od dziesięciu do jednego",
 "zapowiedz": "Liczenie w dół działa jak schodzenie po schodach. Policzymy razem od dziesięciu do jednego, po jednym na wydech?",
 "krok": "Licz w dół od dziesięciu, jedna liczba na każdy wydech.",
 "minimum": "Trzy, dwa, jeden — na trzech wydechach.",
 "odzew": "U mnie przy jedynce opadły ramiona. A u ciebie, co opadło?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast wagi w sercu — oddech z liczeniem w dół; koniec jest wpisany."
}
```

Panel — ss: schody w dół; ps: ok; so: wszędzie; pe: 1–3 liczy w dół od dziesięciu z pomocą; minimum od trzech; r13: ok; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:5972`): „Niewidzialny płaszcz” — Wyobraź sobie, że wkładasz lekki, świetlisty płaszcz. Cudze nastroje mogą po nim spływać, jak deszcz po liściu. Ty zostajesz sobą.

#### MD-D14-S1 · Mokre dłonie i spokój

```json
{
 "id": "MD-D14-S1",
 "profile": [
  "MD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "napiecie-pusc",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "fazy",
 "tytul": "Mokre dłonie i spokój",
 "zapowiedz": "Dłonie potrafią strząsnąć z siebie wszystko jak wodę. Strząśniemy razem i położymy je nieruchomo?",
 "krok": "Strząśnij dłonie jak mokre. Połóż na kolanach do dziesięciu.",
 "minimum": "Potrząśnij dłońmi trzy razy.",
 "odzew": "U mnie łapy najpierw latały, potem leżały. A u ciebie?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Zamiast „płaszcza na cudze nastroje” — strząśnięcie i bezruch; ciało, nie cudze emocje."
}
```

Panel — ss: ruch, potem bezruch; ps: ok, bez cudzych emocji; so: wszędzie; pe: ok; r13: ok; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:6252`): „Wielka klepsydra” — Wyobraź sobie ogromną klepsydrę. Wizkor mówi: gdy świat się spieszy, popatrz, jak piasek leci spokojnie. Dzisiaj Ty bądź jak ten piasek.

#### MD-D21-S1 · Drzwi bez kliknięcia

```json
{
 "id": "MD-D21-S1",
 "profile": [
  "MD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "wyciszenie",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Drzwi bez kliknięcia",
 "zapowiedz": "Drzwi da się zamknąć tak wolno, że klamka nie kliknie. Spróbujemy razem raz, zanim wyjdziesz?",
 "krok": "Zamknij jedne drzwi tak wolno, żeby nie było kliknięcia.",
 "minimum": "Odłóż jedną rzecz bez stuknięcia.",
 "odzew": "U mnie klamka i tak kliknęła. A u ciebie?",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Zamiast „bądź jak piasek” — jedna rzecz bardzo wolno, z końcem słyszalnym (albo nie)."
}
```

Panel — ss: skala: najwolniej; ps: ok; so: drzwi są wszędzie; pe: ok; r13: ok; r48: ok; cw: tytuł ok; ng: ok

Było (`dailyTipsData.js:6292`): „Sprawdź, czyje to jest” — Jeśli rano czujesz coś dziwnego, zapytaj siebie: „Czy to moje, czy ktoś mi to dał?”. Wizkor mówi: nie wszystko, co czujesz, jest Twoje.

#### MD-D22-S1 · Co obudziło się pierwsze

```json
{
 "id": "MD-D22-S1",
 "profile": [
  "MD"
 ],
 "etap": "oba",
 "pora": "poranek",
 "rodzaj": "emocje-cialo",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Co obudziło się pierwsze",
 "zapowiedz": "Ciało budzi się po kawałku: najpierw oczy, potem nogi albo brzuch. Sprawdzimy razem, co u ciebie jest już na nogach?",
 "krok": "Znajdź miejsce w ciele, które dziś obudziło się pierwsze.",
 "minimum": "Poruszaj palcami stóp przez jeden oddech.",
 "odzew": "U mnie zawsze najpierw nos. U ciebie dziś coś innego.",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Zamiast „czy to moje, czy ktoś mi to dał” — własne ciało, bez cudzych emocji."
}
```

Panel — ss: trop w ciele; ps: własny stan, bez relatywizacji; so: wszędzie; pe: ok; r13: w łóżku; r48: ok; cw: tytuł 28; ng: ok


## 8. Dwanaście nowych porad wzorcowych — po dwie na profil (jedna `etap: 1-3`, jedna `4-8`)

Sloty wybrane tam, gdzie siatka jest pusta: KR i MD dostają pierwsze wieczorne porady, MD pierwszą południową (por. 1.2 i 4.4). Recenzje z §10 i §11 naniesione.

#### DT-D03-S2 · Coś, co rusza się samo

```json
{
 "id": "DT-D03-S2",
 "profile": [
  "DT"
 ],
 "etap": "1-3",
 "pora": "poludnie",
 "rodzaj": "zmysly",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Coś, co rusza się samo",
 "zapowiedz": "W każdym pokoju coś rusza się samo: firanka, cień, kurz w słońcu. Znajdziemy to razem?",
 "krok": "Znajdź rzecz, która rusza się sama. Patrz trzy oddechy.",
 "minimum": "Popatrz na jedną rzecz przez trzy oddechy.",
 "odzew": "Ja patrzyłem na chmurę. Ruszała się, choć nikt jej nie pchał.",
 "slad": "swiatlo-dnia",
 "uzasadnienie": "Wzorzec DT 1–3: trop zmysłowy z końcem, który daje świat (rzecz się zatrzyma)."
}
```

Panel — ss: odpowiadanie: świat wyznacza koniec; ps: ok; so: wszędzie; pe: 1–3: firanka, cień — konkret; r13: ok; r48: —; cw: tytuł ok; ng: chmury są w scenie

#### DT-D05-S3 · Dźwięki bez obrazka

```json
{
 "id": "DT-D05-S3",
 "profile": [
  "DT"
 ],
 "etap": "4-8",
 "pora": "wieczor",
 "rodzaj": "zmysly",
 "wejscie": "trop",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Dźwięki bez obrazka",
 "zapowiedz": "Wieczorem słychać rzeczy, których nie widać: rura, sąsiad, wiatr. Policzymy razem trzy takie dźwięki?",
 "krok": "Zamknij oczy i znajdź trzy dźwięki, których nie widać.",
 "minimum": "Jeden dźwięk z zamkniętymi oczami.",
 "odzew": "Mój trzeci dźwięk to woda w oczku. Twoje trzy zostają w domu.",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Wzorzec DT 4–8: trop bez infantylizmu, prywatny, z widocznym końcem."
}
```

Panel — ss: ograniczenie: bez oczu; ps: ok; so: blok ma najwięcej takich dźwięków; pe: ok; r13: —; r48: ok, prywatne; cw: tytuł ok; ng: oczko istnieje

#### EM-D01-S3 · Kolor na dobranoc

```json
{
 "id": "EM-D01-S3",
 "profile": [
  "EM"
 ],
 "etap": "1-3",
 "pora": "wieczor",
 "rodzaj": "emocje-cialo",
 "wejscie": "cialo-kolor-postac",
 "tryb": "obserwowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Kolor na dobranoc",
 "zapowiedz": "Wieczór w środku ma jakiś kolor: ciepły pomarańcz albo cichy granat. Pokażesz mi go palcem na czymś w pokoju?",
 "krok": "Wybierz kolor tego wieczoru i wskaż go palcem w pokoju.",
 "minimum": "Nazwij jeden kolor w myślach.",
 "odzew": "Mój wieczór jest granatowy jak niebo nad polaną.",
 "slad": "kwiat-koloru",
 "uzasadnienie": "Wzorzec EM 1–3: emocja przez kolor, bez słów o uczuciach; ślad: kwiat w tym kolorze."
}
```

Panel — ss: kolor zamiast nazwy emocji; ps: bez zwierzeń; so: wszędzie; pe: 1–3 zna kolory; r13: w łóżku; r48: —; cw: tytuł ok; ng: polana istnieje

#### EM-D02-S2 · Pytanie o czyjś dzień

```json
{
 "id": "EM-D02-S2",
 "profile": [
  "EM"
 ],
 "etap": "4-8",
 "pora": "poludnie",
 "rodzaj": "zyczliwosc",
 "wejscie": "cialo-kolor-postac",
 "tryb": "zaproszenie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Pytanie o czyjś dzień",
 "zapowiedz": "Większość pytań jest o nas. Dziś zadamy razem jedno o kogoś innego i posłuchamy do końca?",
 "krok": "Zadaj komuś jedno pytanie o jego dzień. Wysłuchaj do końca.",
 "minimum": "Zapytaj kogoś: co u ciebie?",
 "odzew": "Jedno pytanie, cała odpowiedź. To więcej, niż się wydaje.",
 "slad": "kropla-swiatla",
 "uzasadnienie": "Wzorzec EM 4–8: życzliwość przez uwagę, nie przez komplement; bez widowni i bez zwierzeń o sobie."
}
```

Panel — ss: zaproszenie kogoś do mówienia; ps: ok, nie o sobie; so: kolega, nauczyciel, ktoś w domu; pe: 4–8; r13: —; r48: pytanie nie zawstydza; cw: tytuł ok; ng: ok

#### ST-D01-S3 · Pięć wydechów na palcach

```json
{
 "id": "ST-D01-S3",
 "profile": [
  "ST"
 ],
 "etap": "1-3",
 "pora": "wieczor",
 "rodzaj": "oddech",
 "wejscie": "liczenie-porzadek",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "oddech",
 "tytul": "Pięć wydechów na palcach",
 "zapowiedz": "Palce jednej ręki wystarczą, żeby policzyć wydechy. Zegniemy razem po jednym na każdy wydech?",
 "krok": "Zginaj po jednym palcu na każdy wydech, aż zamkniesz dłoń.",
 "minimum": "Jeden wydech, jeden zgięty palec.",
 "odzew": "U mnie pięść zamknęła się po piątym. A u ciebie?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Wzorzec ST 1–3: liczenie na palcach jako sterownik oddechu; pięć cykli = EkranOddechu."
}
```

Panel — ss: ciało liczy; ps: ok; so: wszędzie; pe: 1–3: palce = liczydło; r13: w łóżku; r48: —; cw: tytuł ok; ng: ok

#### ST-D03-S2 · Tylko pierwszy z trzech

```json
{
 "id": "ST-D03-S2",
 "profile": [
  "ST"
 ],
 "etap": "4-8",
 "pora": "poludnie",
 "rodzaj": "wyciszenie",
 "wejscie": "liczenie-porzadek",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Tylko pierwszy z trzech",
 "zapowiedz": "Każdą większą rzecz da się pociąć na trzy kroki. Wybierzemy razem jedną i zrobimy tylko pierwszy?",
 "krok": "Podziel jedną rzecz na trzy kroki i zrób tylko pierwszy.",
 "minimum": "Nazwij pierwszy krok jednej rzeczy.",
 "odzew": "U mnie pierwszy krok to zawsze najkrótszy. A u ciebie?",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Wzorzec ST 4–8: porządek obniża napięcie; „tylko pierwszy” chroni przed obowiązkiem."
}
```

Panel — ss: skala: jedna trzecia; ps: zmniejsza ciężar, nie dokłada; so: rzecz wybiera dziecko; pe: 4–8 planuje; r13: —; r48: nie brzmi jak szkoła, bo rzecz jest jego; cw: tytuł ok; ng: ok

#### KR-D01-S3 · Cień-zwierzę na ścianie

```json
{
 "id": "KR-D01-S3",
 "profile": [
  "KR"
 ],
 "etap": "1-3",
 "pora": "wieczor",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Cień-zwierzę na ścianie",
 "zapowiedz": "Przy lampce dłonie zamieniają się w zwierzęta na ścianie. Zrobimy razem jedno i nadamy mu imię?",
 "krok": "Zrób dłońmi cień zwierzęcia na ścianie i nadaj mu imię.",
 "minimum": "Pomachaj dłonią przed lampką i popatrz na cień.",
 "odzew": "Mój cień ma uszy większe niż ja. A twój, co ma największego?",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Wzorzec KR 1–3: ręce i światło, bez materiałów; nadanie imienia = koniec."
}
```

Panel — ss: materiał = światło; ps: ok; so: lampka albo latarka telefonu dorosłego; pe: 1–3 potrafi; r13: przy zgaszonym świetle, chętnie; r48: —; cw: tytuł ok; ng: ok

#### KR-D03-S2 · Imię bez liter

```json
{
 "id": "KR-D03-S2",
 "profile": [
  "KR"
 ],
 "etap": "4-8",
 "pora": "poludnie",
 "rodzaj": "tworzenie",
 "wejscie": "rece-material",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Imię bez liter",
 "zapowiedz": "Imię da się zapisać bez liter: kreskami, kropkami, rysunkami. Wymyślimy razem twój sposób?",
 "krok": "Zapisz swoje imię bez użycia liter.",
 "minimum": "Narysuj jeden znak, który znaczy ciebie.",
 "odzew": "Moje imię bez liter to trzy kreski i ogon. A twoje?",
 "slad": "kamyczek-przy-drabince",
 "uzasadnienie": "Wzorzec KR 4–8: ograniczenie (bez liter) daje wynik nieznany z góry; prywatne, na marginesie zeszytu."
}
```

Panel — ss: ograniczenie Oulipo; ps: o sobie bez zwierzeń; so: margines zeszytu; pe: 4–8; r13: —; r48: prywatne, nie występ; cw: tytuł ok; ng: ok

#### LD-D01-S3 · Robot i szmatka

```json
{
 "id": "LD-D01-S3",
 "profile": [
  "LD"
 ],
 "etap": "1-3",
 "pora": "wieczor",
 "rodzaj": "napiecie-pusc",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "apka",
 "silnik": "fazy",
 "tytul": "Robot i szmatka",
 "zapowiedz": "Najpierw jesteśmy robotem, twardym i prostym, potem miękką szmatką. Zrobimy tak trzy razy przed snem?",
 "krok": "Robot na trzy, potem szmatka. Trzy razy.",
 "minimum": "Jeden robot, jedna szmatka.",
 "odzew": "U mnie robot był twardy, a szmatka bardzo miękka. A u ciebie?",
 "slad": "lisek-strzasa",
 "uzasadnienie": "Wzorzec LD 1–3: napięcie–rozluźnienie przez postać; trzy powtórzenia = koniec."
}
```

Panel — ss: postać jako instrukcja ciała; ps: klasyczna technika; so: wszędzie; pe: 1–3 rozumie robota i szmatkę; r13: przed snem, chętnie; r48: —; cw: tytuł ok; ng: ok

#### LD-D03-S2 · Pierwsze zdanie rozmowy

```json
{
 "id": "LD-D03-S2",
 "profile": [
  "LD"
 ],
 "etap": "4-8",
 "pora": "poludnie",
 "rodzaj": "mikroodwaga",
 "wejscie": "energia-cialo",
 "tryb": "inicjowanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Pierwsze zdanie rozmowy",
 "zapowiedz": "Ktoś zawsze mówi pierwsze zdanie rozmowy. Dziś spróbujemy razem, żeby to było twoje?",
 "krok": "Powiedz pierwsze zdanie rozmowy z kimś, kogo znasz.",
 "minimum": "Powiedz komuś jedno zdanie o pogodzie.",
 "odzew": "U mnie pierwsze zdanie zawsze waży najwięcej. A u ciebie?",
 "slad": "slady-lap",
 "uzasadnienie": "Wzorzec LD 4–8: inicjowanie w relacji, jedno zdanie, bez publiczności i bez obcych."
}
```

Panel — ss: inicjowanie; ps: brak porażki: zdanie się liczy; so: „kogo znasz” — nie obcy; pe: 4–8; r13: —; r48: jedno zdanie, nie występ; cw: tytuł ok; ng: ok

#### MD-D01-S3 · Kołysanie aż do zera

```json
{
 "id": "MD-D01-S3",
 "profile": [
  "MD"
 ],
 "etap": "1-3",
 "pora": "wieczor",
 "rodzaj": "wyciszenie",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "inicjowanie",
 "gdzie": "obok",
 "silnik": null,
 "tytul": "Kołysanie aż do zera",
 "zapowiedz": "Siedząc, można się kołysać jak łódka, coraz wolniej, aż woda ucichnie. Pokołyszemy się razem?",
 "krok": "Kołysz się w bok coraz wolniej, aż całkiem się zatrzymasz.",
 "minimum": "Trzy kołysania i stop.",
 "odzew": "Moja łódka stanęła po długiej chwili. A twoja?",
 "slad": "niebo-cichnie",
 "uzasadnienie": "Wzorzec MD 1–3: jedna rzecz coraz wolniej, koniec w bezruchu; pierwsza wieczorna porada MD."
}
```

Panel — ss: skala: coraz wolniej; ps: ok; so: wszędzie; pe: 1–3 potrafi; r13: na łóżku; r48: —; cw: tytuł ok; ng: ok

#### MD-D02-S2 · Trzy oddechy przed ekranem

```json
{
 "id": "MD-D02-S2",
 "profile": [
  "MD"
 ],
 "etap": "4-8",
 "pora": "poludnie",
 "rodzaj": "oddech",
 "wejscie": "jedna-rzecz-wolno",
 "tryb": "odpowiadanie",
 "gdzie": "dzien",
 "silnik": null,
 "tytul": "Trzy oddechy przed ekranem",
 "zapowiedz": "Ekran poczeka trzy oddechy. Spróbujemy dziś raz, przed następnym włączeniem?",
 "krok": "Zanim włączysz następny ekran, weź trzy oddechy.",
 "minimum": "Jeden wydech przed jednym ekranem.",
 "odzew": "U mnie ekran poczekał trzy oddechy i nic mu nie było. A u ciebie?",
 "slad": "lisek-oddycha",
 "uzasadnienie": "Wzorzec MD 4–8: odpowiadanie na sygnał (ekran) oddechem; zgodne z celem gry, bez zakazu."
}
```

Panel — ss: odpowiadanie: sygnałem jest ekran; ps: nie zakazuje, dokłada pauzę; so: ekran = też telewizor w domu; pe: 4–8; r13: —; r48: nie brzmi jak kontrola rodzica; cw: tytuł ok; ng: ok

## 9. Werdykty panelu — zbiorczo

Runda dla każdej z 65 porad (53 przepisane + 12 nowych), w kolejności z `.claude/commands/panel-zadan.md`: szkic `swieze-spojrzenie` (tryb startu, ograniczenie), recenzja pięciu głosów (`psycholog` i `socjolog` z wetem, `pedagog`, `rodzic-1-3`, `rodzic-4-8`), słowa `copywriter`, ton `narrator-gama` jako ostatni. Skróty werdyktów przy każdej poradzie w sekcjach 7–8; poniżej wszystko w jednej tabeli.

Wynik: **0 wet** psychologa i socjologa; 6 uwag rodzica 1–3 o hałasie/ślisko rano wbudowanych w tekst („cicho”, „na palcach”, „przy ścianie”); 4 uwagi rodzica 4–8 o wstydzie rozwiązanych przez `minimum` w myślach albo `etap: 4-8` z wykonaniem solo; pedagog obniżył etap trzech porad do 4–8 (MD-D12-S1, EM-D02-S2, ST-D03-S2 — dwa kroki albo abstrakcja); copywriter skrócił 5 tytułów do 28 znaków; narrator-gama zdjął „widziałem” z odzewów porad `gdzie: dzien` (lisek nie widzi szkoły) i sprawdził, że każdy obiekt w odzewie liska istnieje w scenie (głaz, oczko wodne, polana, chmury, choinka, plac budowy).

Zbiorczo dla trybów startu (`tryb`): inicjowanie 38, obserwowanie 23, zaproszenie 2, odpowiadanie 2 — `swieze-spojrzenie` zgłasza, że przy przepisywaniu 64 „przepisać” trzeba dołożyć co najmniej 10 porad `odpowiadanie` (zrób coś dopiero, gdy usłyszysz/zobaczysz sygnał) i 6 `zaproszenie`.


| id | świeże spojrzenie | psycholog | socjolog | pedagog | rodzic 1–3 | rodzic 4–8 | copywriter | narrator-gama |
|---|---|---|---|---|---|---|---|---|
| DT-D08-S1 | obserwowanie; zmysł, o którym rano nikt nie myśli | zero wyglądu, zero oceny — zdrowe | trzy rzeczy pod nosem ma każdy dom | 1–3 potrafi; „trzy” to widoczny koniec | minuta przy śniadaniu, beze mnie | nikt nie widzi, że wącha — zrobi | tytuł ok; wariant „Nos na zwiady” | lisek zaprasza, bez cyfr, token jest |
| DT-D11-S3 | obserwowanie; wieczór ma inną skalę odległości | brak presji, minimum w pokoju | blok: latarnia; wieś: gwiazda; minimum bez okna | liczenie do dziesięciu to koniec dla 1–3 | z łóżka, bez wstawania | patrzenie w okno nikogo nie zawstydza | „Najdalsze światło” trzyma | odzew o czynności, nie o cesze |
| DT-D15-S3 | odpowiadanie: koniec wyznacza świat, nie zegar | bez zwierzeń, bez obietnicy snu | dźwięki są wszędzie, także w bloku | „aż ucichnie” to koniec, który dziecko samo pozna | minuta w łóżku | zrobi, nikt nie widzi | tytuł 28 znaków, na styk | lisek nie ocenia; „przyszła sama” ok |
| DT-D19-S3 | trop w ciele zamiast tropu w świecie | emocja przez ciało, nie przez słowa — zdrowe | nie zakłada niczego | 1–3: „w nogach, oczach, barkach” daje przykład | w łóżku, beze mnie | prywatne, nieinfantylne | krótko, konkret | lisek mówi o sobie, nie chwali |
| DT-D23-S3 | ograniczenie (bez oczu) zamiast dokładania | zgadywanie bez złej odpowiedzi | każde łóżko ma coś w zasięgu ręki | trzy rzeczy = koniec; „z łóżka” = bez chodzenia po ciemku | po zgaszeniu światła, bez mojego udziału | ok, prywatne | tytuł nadaje rolę | bez cyfr, tokeny są |
| DT-D27-S3 | obserwowanie przez porównanie | ok, wynik nieznany z góry | szyba, klamka, kubek — wszędzie | „trzech” i „najzimniejsza” = koniec | minuta, sam | zrobi | krótko | lisek zgaduje, nie orzeka |
| EM-D10-S1 | pogoda zamiast skali emocji | o sobie, nie o innych; jedno słowo, bez zwierzeń | nic nie zakłada | 1–3 zna pogodę; słowo = koniec | przy śniadaniu, samo | w myślach, prywatnie | „Pogoda w brzuchu” zostaje | lisek mówi o swojej pogodzie — ok |
| EM-D13-S1 | ciało robi coś dla ciała | uziemienie, bez interpretacji uczuć | nic nie zakłada | dwa kroki, ale jeden ruch — ok dla 1–3 | dwadzieścia sekund | ok, prywatne | tytuł ciepły, nie słodki | tokeny są |
| EM-D16-S1 | inicjowanie bez proszenia i bez publiczności | sprawczość, bez pracy emocjonalnej | „ktoś” = kto jest obok; nie zakłada rodziny | 1–3 potrafi „podsunąć” | zrobi po drodze | nikt nie widzi — zrobi | „po cichu” to zwrot akcji | lisek zauważa czynność, nie chwali |
| EM-D20-S1 | napnij–puść zamiast słów | zdrowe, bez afirmacji | nic nie zakłada | trzy razy = koniec | pół minuty, samo | ok | rytm w tytule | bez cyfr w TTS |
| EM-D21-S3 | fala w ciele zamiast fali w morzu | zero sekretów; technika klasyczna | koc/leżenie — każde łóżko | 1–3: „napnij i puść” rozumie | w łóżku | ok | tytuł prosty | bez obietnicy snu |
| EM-D22-S1 | postać zamiast etykiety; ruch zamiast słowa | emocja przez postać, bez nazywania siebie | nic nie zakłada | 1–3 uwielbia; 4–8 w pokoju, solo | pół minuty | w swoim pokoju zrobi; minimum w myślach | tytuł krótki | lisek nie wybiera za dziecko |
| EM-D25-S1 | obserwowanie czegoś, co i tak trwa | nie zakłada nikogo; interocepcja | nic nie zakłada | 1–3 liczy do dziesięciu | minuta | ok | tytuł liczbowy, słownie | tokeny są |
| EM-D30-S3 | odwrócenie: nie ja dla kogoś, ktoś dla mnie | wdzięczność bez wymuszenia; minimum ratuje gorszy dzień | nie zakłada rodziny | jedna rzecz = koniec | w łóżku | prywatne, nie do powiedzenia na głos | tytuł jak zdanie — ok | bez liczników |
| EM-D14-S2-LUKA | zaproszenie bez zaczepiania | nie robi z dziecka opiekuna; brak porażki | ławka, autobus, kanapa | „do dwudziestu” = koniec | w świetlicy albo przy stole | niewidoczne dla innych — zrobi | tytuł jasny | „nie musi” to nie „musisz” — ok |
| ST-D10-S1 | liczenie jako sterownik ciała | technika poprawna, bez wstrzymywania | nic nie zakłada | 1–3 liczy do kilku; ok | minuta | ok | tytuł precyzyjny | bez cyfr |
| ST-D17-S3 | liczenie tego, co znika | bez oceny, bez afirmacji | pokój w bloku ma dwa światła — minimum | 1–3 policzy | w drodze do łóżka | ok | tytuł-pytanie | lisek liczy swoje |
| ST-D28-S1 | porządek jako mikrotworzenie | ok | stół i trzy rzeczy — wszędzie | porównanie wielkości = 1–3 | przy śniadaniu | ok, szybkie | tytuł ok | lisek podaje swój rząd, nie ocenia |
| ST-D08-S1-NEW6 | pomiar codziennej rzeczy oddechem | ok | lato bez skarpetek — minimum: buty | 1–3 policzy do kilku | rano i tak wkłada | uśmiechnie się, zrobi | tytuł zabawny | tokeny są |
| ST-D13-S1-NEW10 | geometria w kuchni | ok | wszędzie | 1–3 zna koło | minuta | ok | tytuł ok | oczko wodne istnieje w scenie — ok |
| ST-D17-S1-NEW14 | ciało liczy za głowę | ok, bez wyścigu | ściana jest wszędzie | 1–3 do dziesięciu przy ścianie | pół minuty | ok | tytuł 28 na styk | tokeny są |
| ST-D18-S3-NEW15 | liczenie w dół, koniec ze świata | ok | wszędzie | ok dla 1–3 | w łóżku | ok | tytuł ok | lisek liczy swoje |
| ST-D25-S2-LUKA | liczenie tego, czego nikt nie liczy | ok | pokój = klasa, świetlica, kuchnia | 1–3 do dwudziestu z pomocą palców; minimum ratuje | ok | ok, zabawne | tytuł-pytanie | tokeny są |
| KR-D05-S1 | ślad zamiast efektu: zagięcia są mapą | ok | kartka = ulotka z klatki | 1–3 potrafi | minuta, bez sprzątania | ok | tytuł ok | bez krain |
| KR-D10-S1 | zamiana ról przedmiotu | nie ma złej odpowiedzi | stół i rzecz — wszędzie | 1–3: „pokaż ręką” zamiast „opisz” | ok | ok | tytuł ok | lisek nie ocenia |
| KR-D15-S1 | ograniczenie w stylu Oulipo | krzywy = dobry, mówi to lisek o sobie | palec po stole — bez kredek | 1–3 potrafi | ok | ok | tytuł rytmiczny | ok |
| KR-D20-S1 | materiał ma dźwięk | ok | „cicho” — sąsiedzi za ścianą | trzy = koniec | cicho, więc ok | ok | tytuł ok | głaz istnieje w scenie |
| KR-D30-S1 | nazywanie zamiast zbierania | ok | wszędzie | 1–3: „na głos” = koniec | ok | w myślach, jeśli wstyd — minimum | tytuł ok | ok |
| KR-D27-S2-NEW6 | ograniczenie: bez patrzenia | nie da się źle | kartka i cokolwiek do pisania | 1–3 potrafi | ok | dom z zamkniętymi oczami to gra, nie dziecinada | tytuł 28 | ok |
| KR-D24-S2-LUKA | materiał z kieszeni | ok | piórnik, kieszeń, stół | trzy = koniec | ok | ok, szybkie | tytuł ok | ok |
| LD-D03-S1 | trzy fazy zamiast jednego „ruszaj” | rozładowanie pobudzenia, bez słów | wszędzie | 1–3 uwielbia „zamrzyj” | ok | w pokoju zrobi | tytuł ok | tokeny są |
| LD-D05-S1 | dźwięk i mina zamiast cichego oddechu | rozładowanie, zabawa | wszędzie | 1–3 tak; 4–8 solo | ok | zrobi w łazience, nie przy bracie — minimum ziewnięcie | tytuł dwa słowa | ptak w scenie? — lisek opowiada, nie obiecuje |
| LD-D08-S1 | inicjowanie: być pierwszym głosem | bez strachu, z minimum w myślach | „znajomemu”, nie obcym | 1–3 potrafi | rano w domu | ok, jedno słowo | tytuł ok | token dwuwyrazowy poprawny |
| LD-D09-S3 | energia, potem stop | zdrowe: pobudzenie i zejście | na palcach = blok | 1–3 policzy skoki | wieczorem? cicho, ok | ok | tytuł ok | tokeny są |
| LD-D10-S1 | pytanie, na które odpowiada ciało | bez dyskomfortu | kran jest wszędzie | ok | i tak myje ręce | ok | tytuł-pytanie | oczko istnieje |
| LD-D15-S1 | ograniczenie: druga ręka | porażka wbudowana i nieszkodliwa | wszędzie | ok | i tak myje zęby | ok, śmieszne | tytuł ok | ok |
| LD-D17-S1 | ruch z oddechem | ok | wszędzie | ok | ok | ok | tytuł ok | ok |
| LD-D18-S1 | napięcie z pytaniem na końcu | nie tłumi złości — daje jej ciało | wszędzie | ok | ok | ok | tytuł ok | pytanie w kroku ok |
| LD-D19-S3 | obserwowanie własnej odwagi | „zostaje z tobą” = bez zwierzeń | nic nie zakłada | ok | ok | prywatne | tytuł ok | głaz istnieje |
| LD-D20-S1 | skala rosnąca | ok | cicho = blok | ok | rano w bloku — na palcach | ok | tytuł ok | ok |
| LD-D21-S1 | rytm: ruch–stop | ok | wszędzie | ok | ok | ok | tytuł ok | ok |
| LD-D24-S1 | dźwięk jako miara wydechu | ok | wszędzie | ok | ok | minimum cicho, jeśli wstyd | tytuł ok | ok |
| LD-D25-S1 | skala: bardzo mały krok w nieznane | ok | mały pokój też ma kąt | ok | ok | ok | tytuł ok | głaz istnieje |
| LD-D26-S1 | skala ruchu | ok | wszędzie | ok | w skarpetkach na panelach — uwaga; minimum | ok | tytuł ok | ok |
| LD-D30-S3 | ciężar zamiast lekkości | ok | wszędzie | ok | w łóżku | ok | tytuł ok | głazy istnieją |
| LD-D14-S2-NEW2 | zmiana miejsca ciała, nie występ | bez wyścigu, bez publiczności | stół, świetlica, autobus | ok | ok | nikt nie zauważy | tytuł ok | głaz istnieje; odzew bez „widziałem” |
| MD-D05-S1 | zmysł, którego się nie zauważa | ok | wszędzie | trzy = koniec | ok | ok | tytuł ok | ok |
| MD-D07-S1 | obserwowanie aż do zmiany | ok | wszędzie | „aż zauważysz” — dla 1–3 minimum z oddechami | ok | ok | tytuł ok | głaz istnieje |
| MD-D12-S1 | odpowiadanie: czekanie na sygnał | skupienie, nie mediacja | wszędzie | 4–8; dla 1–3 zbyt abstrakcyjne | — | ok, niewidoczne | tytuł ok | ok |
| MD-D13-S1 | schody w dół | ok | wszędzie | 1–3 liczy w dół od dziesięciu z pomocą; minimum od trzech | ok | ok | tytuł ok | ok |
| MD-D14-S1 | ruch, potem bezruch | ok, bez cudzych emocji | wszędzie | ok | ok | ok | tytuł ok | ok |
| MD-D21-S1 | skala: najwolniej | ok | drzwi są wszędzie | ok | ok | ok | tytuł ok | ok |
| MD-D22-S1 | trop w ciele | własny stan, bez relatywizacji | wszędzie | ok | w łóżku | ok | tytuł 28 | ok |
| DT-D03-S2 | odpowiadanie: świat wyznacza koniec | ok | wszędzie | 1–3: firanka, cień — konkret | ok | — | tytuł ok | chmury są w scenie |
| DT-D05-S3 | ograniczenie: bez oczu | ok | blok ma najwięcej takich dźwięków | ok | — | ok, prywatne | tytuł ok | oczko istnieje |
| EM-D01-S3 | kolor zamiast nazwy emocji | bez zwierzeń | wszędzie | 1–3 zna kolory | w łóżku | — | tytuł ok | polana istnieje |
| EM-D02-S2 | zaproszenie kogoś do mówienia | ok, nie o sobie | kolega, nauczyciel, ktoś w domu | 4–8 | — | pytanie nie zawstydza | tytuł ok | ok |
| ST-D01-S3 | ciało liczy | ok | wszędzie | 1–3: palce = liczydło | w łóżku | — | tytuł ok | ok |
| ST-D03-S2 | skala: jedna trzecia | zmniejsza ciężar, nie dokłada | rzecz wybiera dziecko | 4–8 planuje | — | nie brzmi jak szkoła, bo rzecz jest jego | tytuł ok | ok |
| KR-D01-S3 | materiał = światło | ok | lampka albo latarka telefonu dorosłego | 1–3 potrafi | przy zgaszonym świetle, chętnie | — | tytuł ok | ok |
| KR-D03-S2 | ograniczenie Oulipo | o sobie bez zwierzeń | margines zeszytu | 4–8 | — | prywatne, nie występ | tytuł ok | ok |
| LD-D01-S3 | postać jako instrukcja ciała | klasyczna technika | wszędzie | 1–3 rozumie robota i szmatkę | przed snem, chętnie | — | tytuł ok | ok |
| LD-D03-S2 | inicjowanie | brak porażki: zdanie się liczy | „kogo znasz” — nie obcy | 4–8 | — | jedno zdanie, nie występ | tytuł ok | ok |
| MD-D01-S3 | skala: coraz wolniej | ok | wszędzie | 1–3 potrafi | na łóżku | — | tytuł ok | ok |
| MD-D02-S2 | odpowiadanie: sygnałem jest ekran | nie zakazuje, dokłada pauzę | ekran = też telewizor w domu | 4–8 | — | nie brzmi jak kontrola rodzica | tytuł ok | ok |

## 10. Naniesione recenzje

Źródła: `tmp/tresci-recenzja-weto.md` (panel: 6 poprawek, 11 uwag do `04`) i `tmp/tresci-recenzja-glos.md` (copywriter + narrator-gama: 6 poprawek, 6 uwag; spójność a–i). Po naniesieniu: `sprawdz-nowe-C.py` — **0 błędów** (walidator rozszerzony o: zdania `zapowiedz` ≤ 70 każde, zdrobnienia/„zabawa” przy `etap ≠ 1-3`, „liczy się” w odzewie, pola `warianty`).

| wpis | źródło | wprowadzono / odrzucono | dlaczego / jak |
|---|---|---|---|
| EM-D16-S1 odzew „Nikt nie widział, a ja tak” | weto · psycholog · poprawka | wprowadzono | lisek nie widzi czynności w realu (`gdzie: dzien`); nowy odzew „Nikt nie widział. Tak działają najlepsze wygody.” |
| EM-D22-S1 etap 1-3 albo wariant 4–8 | weto · rodzic-4-8 · poprawka | wprowadzono jako `warianty["4-8"]` | model `etap` + `warianty` z `03` (spójność f): 4–8 dostaje „tempo” zamiast „zwierzę”; zapowiedź skrócona wg copywritera (zdania ≤ 70, jest „razem”) |
| EM-D25-S1 tętno niewyczuwalne dla siedmiolatka | weto · pedagog · uwaga | wprowadzono | krok „Podskocz trzy razy, dłoń na sercu, policz dziesięć uderzeń.” |
| EM-D30-S3 zakłada, że ktoś coś dziś zrobił | weto · psycholog · poprawka | wprowadzono | tytuł „Coś, co dziś działało”; zapowiedź o kranie, świetle, czyichś drzwiach; krok „rzecz albo osoba”; minimum bez osoby; odzew o wietrze |
| EM-D14-S2-LUKA „do trzydziestu” | weto · rodzic-4-8 · uwaga | wprowadzono | „do dwudziestu” (także w skrócie werdyktu pedagoga przy poradzie) |
| ST-D17-S1-NEW14 odzew orzeka sukces | weto · psycholog · uwaga | wprowadzono | „Ty {próbowałeś\|próbowałaś} bez. To trudniejsze.” |
| ST-D18-S3-NEW15 „uspokaja bardziej” | weto · psycholog · uwaga + głos · poprawka | wprowadzono | wersja narratora „Ja liczę w dół, bo tak wolniej.” |
| LD-D05-S1 język na wierzchu przy 4–8 | weto · rodzic-4-8 · uwaga | wprowadzono jako `warianty["4-8"]` | zamiast obniżać etap: 4–8 dostaje długi wydech otwartymi ustami bez języka |
| LD-D05-S1 odzew „głośny i dobry” | głos · narrator-gama · poprawka | wprowadzono | „Twój był głośny jak prawdziwy.” (wariant 4–8: „długi jak prawdziwy”) |
| LD-D09-S3 skoki o dwudziestej, „oddaje resztę prądu” | weto · rodzic-1-3 · poprawka | wprowadzono (wersja wieczorna) | pora zostaje wieczór; „dziesięć wspięć na palce, wolno”; zapowiedź bez obietnicy; tytuł „Dziesięć wspięć i cisza” |
| LD-D14-S2-NEW2 „zanim ktoś inny” = wyścig, lekcja jako scena | weto · psycholog · poprawka + głos · uwaga 11 | **wycofano całą treść** (polecenie koordynatora), nowa w tym samym slocie | „Inne miejsce niż zwykle” — mikroodwaga bez widowni i bez wyścigu; `etap: oba`, minimum „przesuń się o jedno miejsce” |
| DT-D23-S3 „po ciemku” | weto · psycholog · uwaga | wprowadzono | zamknięte oczy zamiast ciemności (tytuł, zapowiedź, krok, odzew, uzasadnienie) |
| MD-D13-S1 odzew „głowa była cichsza” | weto · uwaga + głos · poprawka | wprowadzono | „Przy jedynce ramiona opadły, widziałem. U mnie też.” |
| EM-D21-S3 odzew „cięższe od koca” | weto · uwaga + głos · poprawka | wprowadzono | „Widziałem falę. Ja po trzeciej leżę jak koc.”; zapowiedź skrócona do zdań ≤ 70 |
| LD-D21-S1 „jak w zabawie w posągi” | weto · rodzic-4-8 · uwaga + głos 7 | wprowadzono (wersja bez „zabawy”) | „Idziemy przez pokój: trzy kroki i stop na jeden wydech. Wchodzisz?” — wersja narratora „jak posągi” odrzucona, bo rodzic 4–8 wskazał samo słowo „zabawa”, a „posągi” niosą to samo |
| DT-D03-S2 „aż stanie” — cień nie stanie | weto · pedagog · poprawka | wprowadzono | „Patrz trzy oddechy.” |
| EM-D02-S2 „pytanie o jego sprawę” | weto · pedagog · uwaga | wprowadzono | „Zadaj komuś jedno pytanie o jego dzień. Wysłuchaj do końca.” (dwa zdania, żeby zmieścić się w 60) |
| MD-D02-S2 „zanim coś odblokujesz”, „jakikolwiek ekran” | weto · rodzic-4-8 · uwaga | wprowadzono | „przed następnym włączeniem” / „następny ekran” |
| EM-D13-S1, LD-D10-S1 „łapki/łapek” przy `etap: oba` | głos · copywriter · poprawka | wprowadzono | „łapy”, „od łap”; reguła 4.2 pkt 12 rozszerzona; walidator pilnuje zdrobnień przy `etap ≠ 1-3` |
| 7 zdań zapowiedzi > 70 (EM-D16, EM-D21, EM-D22, KR-D24, KR-D03-S2, LD-D21, LD-D25) | głos · copywriter · uwaga 7 + spójność a | wprowadzono | wszystkie przycięte; walidator sprawdza każde zdanie; wyjątek ≤ 120 wpisany do §4.1 z odesłaniem do `01` |
| DT-D19-S3, MD-D22-S1 miękka ocena („dobrze, że”, „i dobrze”) | głos · uwaga 8 | wprowadzono | „Twoje ma dziś swoje miejsce.” / „U ciebie dziś coś innego.” |
| KR-D05-S1 pseudo-maksyma o mapie z rąk | głos · uwaga 9 | wprowadzono | „Moja mapa ma jeszcze górę.” |
| „malutki” (LD-D19-S3, LD-D26-S1) | głos · uwaga 10 | wprowadzono | „mały” / „krótki” |
| „liczy się” w odzewach (ST-D13, KR-D24, LD-D20) | głos · uwaga 12 | wprowadzono | usunięte; formuła zostaje tylko w `minimum` (reguła 4.2 pkt 12) |
| (b)/(c) „świetlik” ma trzy znaczenia; światło przy domku myli EM z MD | głos · spójność | wprowadzono | ślad `swietlik` → `swiatlo-dnia` (dzienna kula przy placu, gaśnie o zachodzie); `kropla-swiatla` przeniesiona nad oczko, bez światła w oknie i bez nocy — światło w oknie/lampka/świetliki nocą należą wyłącznie do hybrydy MD |
| (f) model `etap` + `warianty` z `03` | głos · spójność | wprowadzono | §4.1: pole `warianty["1-3"\|"4-8"]` nadpisuje pola; dwa wpisy używają go od razu; recenzent proponował zostawić `04` bez wariantów — przyjęto model wspólny, bo koordynator wskazał go jako obowiązujący i jest prostszy niż osobne wpisy per etap |
| (g) R7: 4 min / 5 min / maks. 2 / nic po zachodzie + filtr tematu + 3 min po odzewie | głos · spójność | wprowadzono | §4.5 przepisane jako reguła wspólna z `01`; własny licznik „maks. 1 przy wykonanej poradzie” skreślony; trzy myśli z czasownikiem zostają u Wizkora wg `02` |
| (i) pusty stan Porady | głos · spójność | wprowadzono | §4.2 pkt 11: wersja `02` „Dziś nic nowego. Wczorajsze rady są niżej.” |
| (a) wyjątek 120 zn. dla `zapowiedz` do wpisania w `01` | głos · spójność | wprowadzono po stronie `04` | §4.1 odsyła do `01`; wpis w `01` robi agent A |

Razem: **28 pozycji wprowadzonych** (w tym 2 jako `warianty` zamiast obniżenia etapu i 1 pełne wycofanie treści na polecenie koordynatora), **0 odrzuconych w całości**; jedna wersja alternatywna odrzucona (zapowiedź „jak posągi” dla LD-D21-S1 — słowo niosło to samo, co „zabawa”). Zmiany w danych: `tmp/tresci-skrypty/nowe_porady_C.py` → `nowe-porady-C.json`; sekcje 7–9 przegenerowane.

## 11. Poprawki po recenzencie końcowym

Źródło: recenzja z §8 promptu (sprzeczności z §3–4). Wszystkie pięć pozycji wprowadzone; walidator `sprawdz-nowe-C.py` po zmianach: **0 błędów** (rozszerzony o heurystykę orzekania o dziecku w odzewie i o listę dozwolonych silników).

| # | uwaga | co zmieniono |
|---|---|---|
| 1 | plac budowy schodzi po etapie 1 domku; ślady `swiatlo-dnia` i `kamyczek-na-placu` oraz lista obiektów dla odzewu (§4.2 pkt 8) nazywały plac | oba ślady zakotwiczone przy **drabince pomostu** (przy etapie 0 — obok placu); klucz `kamyczek-na-placu` → `kamyczek-przy-drabince` (w §6.1, §6.2 i we wszystkich 9 poradach z tym śladem); lisek w `swiatlo-dnia` obraca głowę w stronę wielkiego drzewa; w §4.2 pkt 8 „plac budowy” oznaczony „tylko przed etapem 1 — w praktyce nie nazywać”; żaden z 65 odzewów nie mówił o placu (sprawdzone) |
| 2 | silnik `odliczanie` = pasek w czasie, prompt §3 „nigdy odliczanie” | silnik nazwany **`fazy`**: kolejne fazy ruchu przełącza dotknięcie dziecka albo koniec wydechu z balonu, bez sekund i bez cyfr na ekranie; zmienione w §4.1, §6.3 i w polach `silnik` sześciu porad (EM-D20-S1, ST-D17-S1-NEW14, LD-D03-S1, LD-D09-S3, MD-D14-S1, LD-D01-S3) w `nowe_porady_C.py`/`nowe-porady-C.json`; `PoradaAkcja/Ruch` (zegar 5 s, cyfra) oznaczony jako do przebudowy |
| 3 | lisek orzeka efekt, którego nie widzi (LD-D30-S3, LD-D05-S1, LD-D24-S1, ST-D01-S3 i inne) | przejrzane wszystkie 65 odzewów (i 1 wariant); **36 przepisanych** na wzorzec `01` para 13 „U mnie … A u ciebie?” — w tym wszystkie, które twierdziły coś o ciele, stanie albo wyniku dziecka („twoje nogi już nigdzie nie idą”, „twój był głośny”, „kręgosłup to lubi”, „widziałem to”, „zdanie doszło do końca”, „dwa następne mają gdzie stanąć”); zostały tylko zdania liska o sobie, pytania i zauważenia czynności, którą dziecko samo zgłosiło („Ty {sprawdziłeś\|sprawdziłaś} dłońmi”); reguła 4.2 pkt 12 przepisana; walidator odrzuca „twoje … już/był/robi się/leży/opadł…”, „ciało robi się”, „widziałem to”, „poczekałeś na to” |
| 4 | liczby: „5 myśli Wizkora w trybie rozkazującym” vs „6 z 16” w notatkach | policzone skryptem na `porady-zdrowia.v1.json`: myśli z czasownikiem rozkazującym **HEAD 6 z 16 → kopia robocza 11 z 16**; zmienionych wpisów 7, z nich 5 nowo rozkazujących (`ramiona` było rozkazujące już w HEAD, `dwor` bez czasownika); §1.5 i notatki C poprawione na te liczby. EM-D14-S2-LUKA: skrót werdyktu pedagoga poprawiony na „do dwudziestu” (treść już taka była) |
| 5 | EM-D16-S1 dubluje `tajny-pomocnik` (`03` §7.3), KR-D10-S1 dubluje `wynalazca-z-kieszeni` (`03` §7.7) | dopisane pola `rodzina: "po-cichu"` (EM-D16-S1) i `rodzina: "drugie-uzycie"` (KR-D10-S1); §4.1 dostał wiersz `rodzina` z regułą: porada z polem `rodzina` nie wchodzi w dniu aktywnego zadania z tej samej rodziny, wybór bierze najbliższy dzień o tej samej porze |

Zastrzeżenia: (a) heurystyka orzekania w walidatorze łapie formy „Twój/Twoje … był/już/robi się…”, ale nie każde zdanie z „ty” — ostatnie przejście po odzewach zostaje ręczne; (b) ślady przy drabince zakładają istnienie pomostu (etap 1) — jeśli dziecko wykona poradę przed pierwszym zadaniem drewna, kotwicą jest plac budowy (opisane w §6.1); (c) silnik `fazy` bez sekund wymaga w `EkranOddechu`/`PoradaAkcja` sygnału „koniec wydechu” — dziś balon go nie emituje (zależność do `06`).

