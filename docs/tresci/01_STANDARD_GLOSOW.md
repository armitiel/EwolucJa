# 01 — Standard głosów i komunikatów EwolucJI

> Dla agenta, który pisze albo poprawia kwestie dla dziecka. Stan repo 17.09.2026.
> Nad tym dokumentem stoją `docs/OPIS_PROJEKTU.md` i kanon `docs/SWIAT_I_POSTACIE.md`.
> Liczby (pomiar) i pełny inwentarz są w `02_KOMUNIKATY_POPRAWKI.md`.

## 1. Limity i struktury

Limity sprawdzone w CSS: karta okna postaci ma szerokość 382 px, tekst 18,5 px pogrubiony
(`hub/styles/hub.css:1767,1855`) → ok. 30 znaków w wierszu, 60 znaków to dwa wiersze,
90 to trzy. Toast (`public/scena-3d/hud.css:357–390`) to JEDNA pigułka 15 px wersalikami,
max 420 px → ok. 28 znaków w jednym wierszu; **`opis` toastu nie jest widoczny**
(idzie do `aria-label`, `Swiat.jsx:2817`). Chmurka trybu spokojnego: tekst 15,5 px na
ok. 280 px (`hub.css:1587–1613`) → 65 znaków to dwa–trzy wiersze.

| głos | karta (ekran) | głos (TTS) | struktura | nie wolno |
|---|---|---|---|---|
| **Wizkor** | ≤ 60 zn., jedno polecenie albo jeden fakt; **każda kwestia MA `tekstEkranu`** | ≤ 140 zn., ≤ 3 zdania; 1–3: pierwsze zdanie = zdanie z karty | co się stało w świecie → co teraz → po co (albo: czego nie umiem → co dziecko może) | opisywać krajobraz; monety za real i gry; „musisz”; „mały wędrowcze”/„wędrowcze”; cyfry; liczyć, ile zostało |
| **Wizkor, tryb spokojny** (dawna chmurka „Mędrca”) | 1 zdanie ≤ 65 zn. | = karta, ten sam głos `las_decyzji`, ton `calm` | jedna myśl o ciele, tryb zapraszający, bez zlecenia | liczyć („trzy wdechy”, „pięć razy”); moralizować; „należy ci się”; obiecywać efekt; przedstawiać się |
| **lisek** | ≤ 70 zn., 2 wiersze łamane `\n` | ≤ 70 zn., 1–2 zdania; **wyjątek:** `zapowiedz` porady ≤ 120 zn. jako dwa zdania po ≤ 70 (lisek mówi, czym jest praktyka, zanim dziecko się zgodzi — `glosLiska.js:40–44`) | „ja” + jedna wspólna czynność + zaproszenie („razem?”) | oceniać („dobra robota”, „bystre oczy”), ścigać się, zlecać, cytować kogokolwiek, opowiadać świat |
| **narratorka** | ≤ 80 zn. na wiersz, ≤ 3 wiersze; **zawsze w tokenach**, jeśli zdanie mówi o dziecku | jak karta, `gora_podsumowania`, ton `calm` | opisuje rzeczy i zmiany w świecie; podmiotem jest rzecz, nie dziecko; 1–3: po śladzie dozwolone jedno zdanie „To od ciebie.” | rozliczać („zdobyłeś”, „znalazłeś 7”), liczby, „brawo”, terminy, zaprzeczenia („do jutra nic się nie stanie”) |
| **toast UI** | tytuł ≤ 28 zn. (widoczny); `opis` = pełne zdanie dla czytnika ≤ 60 zn. | – | co się właśnie zmieniło w świecie | obietnice bez pokrycia, liczniki „x z y” jako rozliczenie, ikona monety przy gwiazdkach |
| **ekran nagrody / panel** | tytuł ≤ 24, podtytuł ≤ 70 zn. | – | nazwa rzeczy, która się zmieniła + gdzie ją znaleźć | „Mentor zatwierdził”, „+25 monet od Mentora”, „sprawdzane” |
| **Mentor-tekst** (co dziecko widzi o Mentorze) | ≤ 60 zn. | – | „Mentor {zobaczył\|zobaczyła}” / czas teraźniejszy („Mentor ogląda”); **tylko gdy Mentor istnieje i nie jest demo** — inaczej mówi świat („Ślad zostawiony”) | przyjął, zatwierdź, poprawka, sprawdzane, odrzuć, werdykt, kwota |

Zmiany względem punktu wyjścia z promptu i dlaczego:
- **Toast: tylko tytuł ≤ 28** (zmierzone: `opis` niewidoczny; 4 z 14 tytułów łamią 28 i zawijają się na dwa wiersze wersalikami).
- **Wizkor 1–3:** nie „zdanie z karty w głosie”, tylko **pierwsze zdanie głosu = karta**; sześciolatek słyszy najpierw to, co widzi, a resztę lektor dopowiada po zamknięciu okna (`mowaPostaci.js` nie ucina mowy).
- **Narratorka dostaje tokeny**, bo dziś rozlicza dziecko w dzienniku dnia (`Swiat.jsx:2057`, `:1523`, `:1930`) i w onboardingu (`Onboarding.jsx:749`). Docelowo podmiotem jest rzecz; token tylko tam, gdzie zdanie o dziecku musi zostać.
- Dodany wiersz **Mentor-tekst**: dziś 6 miejsc mówi o Mentorze językiem sędziego.

## 2. Reguły

**R1. Klasy 1–3 i 4–8.** Klasy 1–3: karta to jedno zdanie, które lektor czyta jako pierwsze; głos ≤ 2 zdania; zero słów spoza codzienności siedmiolatka („kompetencja”, „strategia”, „zasłużyły”). Klasy 4–8: ten sam limit, bez zdrobnień („łapki”, „chwilkę”, „mały wędrowcze”), bez „brawo”, bez tłumaczenia mechaniki, którą widać. Jeśli wariant się różni, kwestia ma dwa pola: `1-3` i `4-8`; jeśli nie — jedno. Etap bierze się z profilu startowego (`hub/profilStartowy.js`), a nie z wieku.

**R2. Tokeny rodzaju.** Każdy czasownik w czasie przeszłym i każdy przymiotnik/imiesłów o dziecku pisze się `{m|ż}`: `{przyniosłeś|przyniosłaś}`, `{gotowy|gotowa}`, `{sam|sama}`. Wołacz „wędrowcze” wypada w ogóle. **Mentor też**: rodzaj Mentora z jego danych (`mentor.gender`, do dodania) albo czas teraźniejszy: „Mentor ogląda”, „Mentor już to widzi”. Tekst z tokenem musi przejść przez `odmienDlaGracza` — dziś robią to tylko `PoradaPanel` i `HintPopup`; `PopupPostaci`, `PodsumowanieDnia`, toasty, `RewardScreen`, `ZadaniePanel` NIE (zależność techniczna w `tmp/tresci-notatki-A.md`). Do czasu wdrożenia token w tych miejscach wyszedłby na ekran surowy — dlatego poprawki w `02` oznaczają, które teksty czekają na `odmien`.

**R3. Tylko prawda o scenie.** Każdy obiekt w kwestii istnieje w `public/scena-3d/mapa.json` (nieukryty) albo w stanie gry w chwili wyświetlenia. Dziś na `/swiat` NIE MA: studni, wiadra, Fasoli, ścian, dachu, domku `hut2` (wyłączony), mostu, bramy, latarni (ukryte), „śladów na mapie”, „skarbca”. JEST: polana, rzeka, drzewa, głazy, kwiaty, grzyby, suche drzewko, głaz, wielkie drzewo z placem budowy → pomost z barierką i drabinką (etap 1), dwa oczka wodne, choinka, karta, bucik, gwiazdki, kawałki obrazka, Wizkor. Domek etapu 2 i 3 wolno **zapowiadać jako brak** („domku jeszcze nie ma”), nie opisywać („drewno leży przy ścianie”).

**R4. Kwestia kończąca etap daje powód, żeby odłożyć urządzenie.** Ostatnie zdanie po gwiazdkach, po pomoście, po partii i po zachodzie nazywa **rzecz poza ekranem** albo **to, co świat zrobi po powrocie** — nigdy kolejną rzecz na ekranie („odpocznij, szykuję nowe zadanie”, „gram dalej”, „zdąży jeszcze jedna rzecz”).

**R5. Zero rozliczania.** Bez „x z y” w mowie i w podsumowaniu; w toaście liczba tylko jako polecenie z widocznym końcem („Zbierz dziesięć” — słownie w mowie, cyfrą tylko w HUD). Bez „zostało ci”, bez serii, bez „trzeci dzień”, bez czasu.

**R6. Nagroda = zmiana świata.** Monety zostają w HUD; postać nie wypowiada ani liczby, ani słowa „monety” za real i za gry. Zamiast tego nazywa, co przybyło albo co się otworzyło.

**R7. Tryb spokojny Wizkora (chmurka o ciele).** Dziś: pierwsza po 75 s, kolejne co 5 min, do 3 na sesję (`PodpowiedzMedrca.jsx:30–33`). **Obowiązuje:** pierwsza nie wcześniej niż po **4 min** i tylko wtedy, gdy nie ma zlecenia na ekranie i od ostatniej kwestii Wizkora minęły 2 min; kolejna po **5 min**; **maks. 2 na sesję**; **żadnej po zachodzie**; **filtr tematu** — Wizkor nie mówi tego samego dnia o tym, o czym była porada liska (pole `temat` w obu zbiorach); **nie wcześniej niż 3 min po odzewie porady**. Uzasadnienie: 15-minutowa sesja z zachodem w 8,5 min ma miejsce najwyżej na dwie ciche uwagi; trzecia wchodzi w czas zamykania. Chmurka mówi wyłącznie o ciele, nigdy o zadaniu, monetach ani porze.

**R8. Wizkor a porada liska.** Wizkor **może raz na sesję wskazać ikonę Porady** (`wskazowki.js:63`), bo jako przewodnik po HUD to jego rola — ale mówi o **liskach**, nie o „radzie od siebie”: „Lisek ma coś na dziś. Dotknij i zobacz.” Nie streszcza porady, nie cytuje liska, nie wraca do niej w innych kwestiach. Częstotliwość: raz na sesję, po 90 s, potem lisek sam (chmurka liska `minigry-liska` zostaje na 90 s / 3 razy — to jego zaproszenie).

**R9. Statusy zadania nie oceniają.** Zadania nie da się oblać. Cztery stany na karcie: „Do zrobienia” (nie wzięte z koła) → „Czeka — u ciebie” (wzięte) → „Ślad zostawiony” (świat już odpowiedział; podtytuł „Mentor już to widzi” tylko gdy Mentor istnieje i nie jest demo) → „Mentor {zobaczył|zobaczyła}”. „Zrobione” tylko jako nagłówek w historii. Klucze: `doZrobienia / czeka / slad / zauwazone`. Brak statusu „poprawka” i „sprawdzane”. Miejsce reakcji świata bierze się z karty zadania (pole `miejsce_reakcji`), nie z ogólnika „pod drzewem”; dodatek po zauważeniu przez Mentora = kwiat w nowym kolorze przy drabince (światło tylko w hybrydzie MD). Dowód: „Pokaż, co {zrobiłeś|zrobiłaś}”, zdjęcie rzeczy albo jedno zdanie, nigdy „jak się czułeś”.

**R10. Kwestie są danymi.** Teksty stoją w `kwestieWizkora.js`, `misjeGier.js`, `glosLiska.js`, `koniec-dnia.v1.json`, nie w komponentach; każda ma `tekst` i `tekstEkranu`, opcjonalnie `1-3`/`4-8`.

## 3. Słowa zakazane → zamienne

| zakazane | dlaczego | zamiast |
|---|---|---|
| „przyznał ci 25 monet — bierz”, „+25 monet od Mentora” | Mentor jako kasjer, monety jako powód | „Coś przybyło pod drzewem. Zobacz.” / „Świat coś dołożył.” |
| „Mentor przyjął / zatwierdził / prosi o poprawkę / sprawdzane” | werdykt, ocena | „Mentor {zobaczył\|zobaczyła}” / „Mentor już to widzi” / „Czeka” |
| „należy ci się” | nagroda jako wypłata | „to twoje” / „patrz, co się zmieniło” |
| „mały wędrowcze”, „wędrowcze” | infantylne, bez rodzaju | imię dziecka (`{imie}`) albo nic |
| „baw się dalej”, „pobiegaj po mapie”, „zajrzyj później”, „za jakiś czas” | trzyma przy ekranie | „Wracaj, jak zrobisz swoje — świat to zauważy.” (bez „później”; czas przyszły nie ma rodzaju — bez pustych tokenów `{x\|x}`) |
| „na zewnątrz”, „wyjdź”, „na dworze” jako synonim „poza ekranem” | dla dziecka to „na dwór”; 13 z 21 zadań dzieje się w domu; wysyła samo poza dom | „u ciebie, nie tu”, „u ciebie w domu” |
| „zanim zgasną”, „zanim zajdzie słońce” | termin, groźba straty | bez terminu: „Pozbierasz je?”, „Spójrz.” |
| „założę się, że…” | – (dozwolone jako trop Wizkora, nie ocena; jedna decyzja dla `03` i `05`) | zostaje |
| „zdąży jeszcze jedna rzecz” | zaprasza do kolejnej rzeczy na ekranie | „Na dziś zostaje jedno — u ciebie: …” |
| „zostało ci”, „masz 3 z 10”, „7 gwiazdek” w mowie | rozliczanie, cyfry w TTS | „Jeszcze kilka świeci w trawie.” / słownie |
| „brawo!”, „super!”, „świetnie”, „dobra robota”, „bystre oczy” | inflacja zachwytu, ocena | jeden konkretny czasownik o rzeczy: „Pomost stoi.” |
| „musisz”, „powinieneś”, „pamiętaj, żeby” | pouczenie | „mam pomysł, ale sam tego nie zrobię” |
| „skarbiec”, „skrzynia z grami”, „ściana”, „dach”, „studnia”, „Fasola” (na `/swiat`) | nie ma ich w scenie | „zakładka Minigry”, „plac budowy”, „pomost”, „domek — jeszcze go nie ma” |
| „Zbierz 10 [moneta]” | ikona monety przy gwiazdkach | „Zbierz 10 [gwiazdka]” |
| „Mędrzec mówi”, „Wizkor mówi” w ustach liska | lisek nikogo nie cytuje | lisek mówi od siebie w pierwszej osobie |
| „Twój archetyp”, „Porady dobrane dla Ciebie: Śmiałek” | etykieta profilu | „Twoja siła na start” / usunąć stopkę |
| „kto pierwszy”, „jeszcze raz, spróbuj lepiej” | wyścig, porównanie | „razem”, „jeszcze raz?” tylko jako wybór dziecka w grze |
| „zasłużyły na nagrodę”, „szczere odpowiedzi” | ocena szczerości | „Dzięki. Teraz wiem, od czego zacząć.” |

## 4. Pary przed → po (z repo)

| # | gdzie | przed | po (karta / głos) | reguła |
|---|---|---|---|---|
| 1 | `kwestieWizkora.js:111` | Słońce schodzi. Zdąży jeszcze jedna rzecz. | **karta:** Słońce schodzi. „{tytuł}” czeka u ciebie, nie tu. | R4, karta nazywa zadanie |
| 2 | `kwestieWizkora.js:108–110` | Słońce schodzi nisko — widzisz, jak się złoci? Zdąży jeszcze jedna rzecz, zanim planeta uśnie. A „X” czeka na ciebie tam, na zewnątrz. | **głos:** Słońce schodzi. Tu już nic mi nie trzeba. „{tytuł}” czeka tam, gdzie magia nie sięga — u ciebie w domu. | R4, bez krajobrazu |
| 3 | `kwestieWizkora.js:248–250` | Mentor przeczytał to, co mu wysłałeś, i przyjął. Przyznał ci 25 monet — bierz. | **karta:** Mentor to {zobaczył\|zobaczyła}. Przy drzewie wyrósł nowy kwiat. **głos:** Mentor {zobaczył\|zobaczyła} to, co {zrobiłeś\|zrobiłaś}. A przy drzewie wyrósł nowy kwiat — idź, zobacz. | R6, R9: Mentor zauważa, świat dokłada kwiat |
| 4 | `kwestieWizkora.js:263–264` | Twoje zadanie jest u Mentora. Baw się dalej — zajrzyj do Zadań za jakiś czas. | **karta:** Ślad zostawiony. Zobacz {miejsce_reakcji}. **głos:** To, co {zrobiłeś\|zrobiłaś}, zostawiło ślad {miejsce_reakcji}. Idź, zobacz — to od ciebie. (gdy Mentor istnieje: „Mentor już to widzi.”) | R9, bez trzymania przy ekranie, bez obiecywania Mentora |
| 5 | `kwestieWizkora.js:311–313` | Mapę już znasz, wędrowcze. Czas na zadanie poza ekranem. Zakręć kołem przeznaczenia — wskaże, którą siłę dziś ćwiczysz. | **karta:** Zakręć kołem. Wskaże dzisiejszą siłę. **głos:** Tu na polanie zrobiliśmy swoje. Teraz coś, czego magią nie zrobię. Zakręć kołem — wskaże, którą siłą dziś działasz. | R4, bez „wędrowcze” |
| 6 | `kwestieWizkora.js:323–325` | Dobrze się spisałeś, mały wędrowcze. Odpocznij chwilę — przygotowuję dla ciebie nowe zadanie. | **karta:** Na dziś koniec zleceń. Polana poczeka. **głos:** Na dziś nie mam już nic. Polana poczeka. U ciebie dzieje się więcej niż tu. | R4, bez ozdobników, nie wysyła na dwór |
| 7 | `kwestieWizkora.js:399–401` | Masz je wszystkie! 10 gwiazdek, co do jednej. Należy ci się 10 monet — bierz. | **karta:** Wszystkie gwiazdki! Polana jaśniej świeci. **głos:** Wszystkie, co do jednej. Popatrz na polanę — jest jaśniej niż rano. | R5, R6 |
| 8 | `kwestieWizkora.js:432–434` | Witaj, mały wędrowcze! Jestem Wizkor, opiekun Świata Ewolucji. Na polanie ukryło się 10 złotych gwiazdek. Znajdziesz wszystkie? | **karta:** Na polanie spadło dziesięć gwiazdek. Znajdziesz je? **głos:** Jestem Wizkor. W nocy z polany spadło dziesięć gwiazdek i leżą w trawie. Pozbierasz je? | R3, R5 (słownie, bez „zanim zgasną”) |
| 9 | `misjeGier.js:113–114` | Widziałem każdą parę, którą odkryłeś. Pamięć masz jak sowa — należy ci się 25 monet. | **karta:** Wszystkie pary. Karta zostaje na polanie. **głos:** Widziałem każdą parę. Karta zostaje na polanie — wracaj do niej, kiedy chcesz. | R6 |
| 10 | `misjeGier.js:82–84` | Masz oko do gwiazdek, wędrowcze. Teraz coś trudniejszego: mój obrazek rozsypał się na kawałki i wiatr rozniósł je po polanie. Pozbieraj je i ułóż w całość, a moja karta będzie twoja. | **karta:** Zbierz kawałki obrazka na polanie. **głos:** Mój obrazek rozsypał się po polanie. Pozbieraj kawałki i ułóż go, a karta zostanie twoja. | ≤140, bez „wędrowcze” |
| 11 | `poradaDnia.js:47` | Szukamy pięciu zielonych rzeczy dookoła siebie. Kto pierwszy zobaczy? | Szukamy pięciu zielonych rzeczy. Ja zaczynam od trawy — a ty? | lisek nie ściga się |
| 12 | `poradaDnia.js:48` | Masz bystre oczy. Pięć zielonych śladów już świeci na mapie. | Pięć zielonych. Ja widziałem trawę, ty swoje — razem dziesięć. | lisek nie ocenia, R3 |
| 13 | `poradaDnia.js:57` | Łapki, barki i głowa są już lżejsze. Dobra robota. | Łapki, barki, głowa. U mnie lżej — a u ciebie? | bez oceny |
| 14 | `Onboarding.jsx:749` | Brawo! Zdobyłeś pierwsze 50 złotych monet. Twój skarbiec dopiero się otwiera. | (narratorka) Świat Ewolucji jest otwarty. Na polanie czeka lisek. | narratorka nie rozlicza, R3 („brama” to ukryty obiekt w `mapa.json`) |
| 15 | `Swiat.jsx:2057` (dziennik) | Znalazłeś 7 gwiazdek | Gwiazdki wróciły na polanę. (przy komplecie) / Część gwiazdek świeci znów w trawie. | R5, podmiotem rzecz |
| 16 | `koniec-dnia.v1.json:27–29` | Drewno leży przy ścianie, głaz trzyma róg. Dachu nie ma. Lisek śpi przy kamieniu, który jeszcze grzeje. | Pomost stoi na drzewie. Domku na nim jeszcze nie ma. Lisek śpi na pomoście, obok drabinki. | R3 |
| 17 | `ZadaniePanel.jsx:281–282` | Twoje zadanie jest sprawdzane / Wizkor zaniósł Twoją odpowiedź Mentorowi. Mentor właśnie ją ogląda. Zajrzyj tu później. | Ślad zostawiony / To, co {zrobiłeś\|zrobiłaś}, zostawiło ślad {miejsce_reakcji}. Zobacz na polanie. (+ „Mentor już to widzi.” tylko przy istniejącym Mentorze) | R9 |
| 18 | `ZadaniePanel.jsx:220` | Wizkor nie ma dziś dla Ciebie zadania. Pobiegaj po mapie — znajdzie Cię sam. | Wizkor stoi na polanie. Dziś nie ma nowego zlecenia. | R3 (Wizkor stoi w miejscu), bez trzymania |
| 19 | `porady-zdrowia.v1.json: ramiona` | Zakręć ramionami do tyłu pięć razy — napięcie samo odpływa. | Zakręć ramionami do tyłu, aż poczujesz, że są cięższe. | tryb spokojny nie liczy |
| 20 | `porady-zdrowia.v1.json: przerwa` | Po dłuższym patrzeniu w ekran należy ci się przerwa. | Oczy lubią popatrzeć daleko. Za oknem coś się rusza? | bez „należy ci się”, bez presji |
| 21 | `wskazowki.js:63` | Zostawiam ci tu jedną krótką radę na dziś. Dotknij ikonki i zajrzyj. | Lisek ma coś na dziś. Dotknij i zobacz. | R8 |
| 22 | `Swiat.jsx:1362` toast | Zbierz 10 [moneta] | Zbierz 10 [gwiazdka] | R3 |

## 5. Checklista dla piszącego (10 punktów)

1. Kto mówi? Wizkor zleca / spokojnie zauważa ciało; lisek zaprasza „razem”; narratorka opisuje rzeczy. Nic innego.
2. Karta ≤ 60 (Wizkor), ≤ 70 (lisek), ≤ 80/wiersz (narratorka), toast ≤ 28. Głos Wizkora ≤ 140 i ≤ 3 zdania.
3. Każda kwestia Wizkora ma `tekstEkranu`; dla 1–3 pierwsze zdanie głosu = karta.
4. Zero cyfr w polach mówionych; liczby słownie i tylko jako widoczny koniec („dziesięć gwiazdek”).
5. Każdy czasownik przeszły i przymiotnik o dziecku w `{m|ż}`; o Mentorze — czas teraźniejszy albo token z jego danych.
6. Każdy obiekt w zdaniu jest teraz w scenie (sprawdź `mapa.json`, `KONCEPT_GRY.md`); brak wolno nazwać, nie opisać.
7. Ani słowa o monetach, przyjęciu, zatwierdzeniu, poprawce, sprawdzaniu, „należy ci się”.
8. Ostatnie zdanie etapu wskazuje coś poza ekranem albo zmianę świata po powrocie — nie kolejny klik.
9. Bez „brawo/super/świetnie”, bez „wędrowcze”, bez „kto pierwszy”, bez „jak się czułeś”; „poza ekranem” = „u ciebie”, nigdy „na zewnątrz”; bez terminów („zanim…”).
10. Wariant 4–8 bez zdrobnień; jeśli 1–3 i 4–8 brzmią inaczej, są dwa pola. Ostatnie przejście: `narrator-gama`.
