# 05 — Sześć zadań hybrydowych, jedno na każdy profil

> Zadanie D promptu (`tmp/PROMPT_FABLE.md` §6/D). Stan repo 17.09.2026, gałąź `v2-postgres-vercel`,
> HEAD `596d4aa`; `frontend/public/scena-3d/mapa.json` czytana z niezacommitowanymi zmianami drugiej sesji.
> Nad tym dokumentem stoją `docs/OPIS_PROJEKTU.md`, kanon `docs/SWIAT_I_POSTACIE.md` i standard `01_STANDARD_GLOSOW.md`.
> Pytania do autora i zależności techniczne są osobno w `tmp/tresci-notatki-D.md` (do scalenia w `06`).

Zadanie hybrydowe ma dwie połówki: **część A** w świecie 3D na `/swiat` (ekran tylko zadaje pytanie, ≤ 2 minuty)
i **część B** w prawdziwym świecie (10–15 minut, bez przygotowań). Między nimi jest **most** — moment, w którym
dziecko odkłada urządzenie, bo chce coś sprawdzić, a nie dlatego, że musi. Po powrocie dziecko zostawia **ślad**
(wybór z trzech opcji albo jedno zdanie; zdjęcie tylko opcjonalnie i tylko rzeczy), a **świat odpowiada od razu**,
nie czekając na dorosłego. Gdy Mentor **zauważy**, świat dokłada coś małego. Nagrodą jest zmiana świata;
monety zostają cichym licznikiem w HUD i nie padają w żadnej kwestii.

Każde z sześciu zadań jest **pierwszą przygodą hybrydową** dla jednego profilu z testu startowego, ale
żadne nie jest do niego przypisane na stałe: profil ustawia tylko, które z sześciu dziecko dostaje pierwsze.
Nazwa profilu nie pada w tekstach dla dziecka.

## 1. Tabela zbiorcza

| # | id · tytuł | profil | oś | potrzeba | kształt | część A (świat) | część B (real) | reakcja po śladzie → po zauważeniu | koszt |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `kamienie-kroki` Kamienie-kroki | LD | odwaga | ruch | odważ się | od drabinki pomostu do oczka nie ma drogi; lisek zostawia mokre ślady, pod drabinką leży jeden kamień; zakład „ile kamieni do wody” | kamienie z płaskich rzeczy na podłodze; przejść z zamkniętymi oczami, ręka przy ścianie; 4–8: aż raz nie trafisz | pięć kamieni-kroków wzdłuż wyschniętego śladu → szósty na brzegu i kwiat | niski |
| 2 | `swiatlo-w-oknie` Światło w oknie | MD | wytrwalosc (regulacja) | regulacja | wytrzymaj | zachód: na pomoście ciemno, Wizkor nie rozpali ognia; wybór, gdzie stanie lampka | przy oknie znaleźć trzy światła, patrzeć na jedno, aż coś się przy nim zmieni; 4–8: własne światło zgaszone | lampka na pomoście świeci po zachodzie → trzy świetliki wokół drzewa nocą | niski |
| 3 | `kladka-nad-oczkiem` Kładka | ST | wytrwalosc | kompetencja | zbuduj | kładka nad przewężeniem oczka ma tylko brzegi; zakład: płaska / harmonijka / rurka | kładka z kartki między książkami, ten sam ciężarek; 4–8: trzy kształty i kolejność | deski w kształcie zwycięskiej konstrukcji, lisek przechodzi → sznurowa poręcz i kwiat | niski |
| 4 | `co-jest-na-dnie` Co jest na dnie | DT | ciekawosc | uwaznosc | zauważ | na dnie oczka coś błyska, woda mętna; zakład: co z trzech rzeczy pływa | miska z wodą, pięć rzeczy z kuchni: najpierw powiedz, potem sprawdź; 4–8: spraw, żeby tonące popłynęło | woda przejrzysta, kamyk na dnie, liście lilii → lilia zakwita | niski–średni |
| 5 | `lawka-dla-goscia` Ławka dla gościa | EM | wspolpraca | troska | podaruj | na pomoście pusta ławka dla dwojga; wybór: co zostawić gościowi (poduszka / kubek / koc) | przygotować komuś miejsce, zanim przyjdzie, tak, żeby sam je znalazł; 4–8: bez podpisu, niech sam zgadnie | na ławce rzecz wybrana w A → na ławce siada królik (`kroliczek.glb`) | średni |
| 6 | `ramka-w-domku` Ramka w domku | KR | tworzenie | sprawczosc | zrób | na barierce pomostu pusta ramka ze znacznikiem braku; wybór: co lisek ma widzieć z pomostu | narysować to, co lisek ma widzieć z pomostu; 4–8: jedna rzecz z domu albo z drogi i jedna, której nie ma na planecie | w ramce wybrany symbol → mała ramka z łapką liska; „Pokaż w domku” od Mentora = zdjęcie rysunku (tor obrazu) | średni (zdjęcie: wysoki) |

Numeracja w tabeli = **kolejność wdrożenia** (sekcja 4), nie ważność. Mieszanka, której wymagał prompt:
ruch (LD), wyciszenie (MD), relacja (EM), obserwacja (DT), ręce (KR, ST); dom (wszystkie) i dwór (DT kałuża,
LD kreda, MD klatka); solo (DT, ST, KR, MD) i z kimś / dla kogoś (EM, LD w klasach 1–3). Sześć kształtów bez
powtórki. Każda część B jest ciekawsza od A, bo A tylko stawia zakład, a rozstrzygnąć go da się wyłącznie w realu.

### 1.1 Podmiany względem tabeli wyjściowej promptu

| profil | prompt | tu | dlaczego (od panelu) |
|---|---|---|---|
| LD | ścieżka z poduszek po cichu / z zamkniętymi oczami **albo skok między skarpetkami** | tylko „bez patrzenia”, kamienie z płaskich rzeczy | skok między skarpetkami jest już zadaniem w realu `skok-przez-skarpetki` (`03` §7.9); poduszki na panelach skręcają kostkę (`rodzic-1-3`) → rzeczy płaskie; zamknięte oczy tylko z ręką przy ścianie (`psycholog`, bezpieczeństwo). |
| MD | „znajdź trzy światła i posłuchaj ciszy, aż zniknie jeden dźwięk; albo łódka na brzuchu” | trzy światła, patrzeć na jedno, aż coś się przy nim zmieni | „aż zniknie dźwięk” to `ostatni-dzwiek` (`03` §7.11) — nie dublujemy; „łódka na brzuchu” to porada oddechowa (`04`), nie hybryda; zmiana przy świetle jest końcem, który widać, i wiąże się z reakcją świata (lampka). |
| ST | kładka z kartki (jak w prompcie) | bez zmian w treści; dodane pole `rodzina`, które wyłącza z kolejki `kladka-z-kartki` (`03` §7.5) i `papierowy-most` (`wariant/tresci.js:26`) po tej hybrydzie | to samo doświadczenie istnieje dziś w trzech miejscach; hybryda ma pierwszeństwo do mostu (ustalenie koordynatora), zadanie w realu dostaje kwiat. |
| DT | miska z wodą i pięć przedmiotów (jak w prompcie) | bez zmian; żaba po zauważeniu → **lilia zakwita** | żaba to model i animacja (koszt wysoki, `scena-3d`); kwiat na liściu lilii jest w treści (to, co pływa) i kosztuje kilka linijek. |
| EM | „przygotuj komuś małą wygodę tak, żeby sam ją znalazł (minimum: podlej roślinę)” | wygoda **dla kogoś, kto dopiero przyjdzie**; minimum: odsunięte krzesło, także „dla siebie po powrocie” | „mała wygoda po cichu” to `tajny-pomocnik` (`03` §7.3) — hybryda dostaje gościnność (ktoś przyjdzie), nie pomoc; „podlej roślinę” zakłada roślinę (`socjolog`). |
| KR | ramka na etapie 2 domku | ramka na **barierce pomostu (etap 1)**, od etapu 2 na ścianie domku — ten sam obiekt | etapu 2 nie ma w kodzie (`schronienie.js:308` `ETAPY = [etap1]`), a pierwsza sesja kończy się na etapie 1; założenie autora o zdjęciu i pełnoprawnej wersji bez zdjęcia zachowane w całości. |

### 1.2 Zasady wspólne dla szóstki (czytać przed kartami)

- **Otwarcie:** każda hybryda otwiera się po postawieniu domku etap 1 (`hub/zadanieDrewna.js:263` `postawEtap`), tego samego albo następnego dnia; szczegóły w sekcji 5. Profil z `hub/profilStartowy.js:36` (`typStartowy`) wybiera, która z sześciu jest pierwsza; etap 1–3 / 4–8 z `etapSzkolny()` (`:31`) wybiera wariant części B i formę śladu.
- **Jedno zadanie na dany moment:** dopóki hybryda ma status „Czeka — u ciebie”, Koło nie losuje zadania w realu, a Wizkor nie otwiera kolejnej gry (sekcja 5).
- **Ślad:** domyślnie wybór z trzech opcji (obrazki dla 1–3, tekst dla 4–8) **albo** jedno zdanie (≤ 160 znaków, nie 600 jak dziś `ZadaniePanel.jsx:329`). Zdjęcie opcjonalne, tylko rzeczy / rysunku / efektu, bez ludzi, z podpowiedzią przy aparacie; w MD zdjęcia nie ma wcale. Żadna z opcji śladu nie jest o uczuciach. Nagłówek: „Pokaż, co {zrobiłeś|zrobiłaś}”, przycisk: „Zostaw ślad”; „Mentor to zobaczy” pojawia się tylko przy prawdziwym, niedemowym Mentorze (rozstrzygnięcie recenzenta końcowego).
- **Reakcja świata od razu po śladzie**, bez werdyktu; kamera pokazuje miejsce (`pokazMiejsce`, `app.js:2426`), narratorka mówi jedno–dwa zdania. Po „Zauważam” Mentora — mały dodatek, nazwany w karcie. Nie ma „zatwierdź”, „odrzuć”, „poprawka”.
- **Monety w tle:** dwadzieścia pięć przy śladzie, zero za zauważenie, tylko w liczniku HUD (rekomendacja B, `tmp/tresci-notatki-B.md` pkt 2). Żadna kwestia ich nie nazywa.
- **Tylko prawda o scenie:** każdy obiekt w kwestii istnieje w `mapa.json` (nieukryty) albo jest oznaczony w `haki_3d` jako „do zbudowania” z kosztem; kwestia pojawia się dopiero, gdy obiekt stoi.
- **Dodatek po zauważeniu:** każda hybryda ma własny, nazwany w karcie (`reakcja_po_zauwazeniu`); dla zadań w realu z Koła ogólny dodatek to **kwiat w nowym wariancie koloru przy drabince** (`kwiaty[].wariant`, istnieje), nie światło. **Światło w świecie (lampka, świetliki) należy wyłącznie do hybrydy MD** — żadna inna karta ani sekwencja końca dnia (`02` §3) nie zapala niczego (rozstrzygnięcie b recenzji).
- **Mentor:** powiadomienie „Zobacz, co {zrobił|zrobiła} {imie}” + jedno pytanie do rozmowy (musi działać także przy śladzie „nie wyszło” i przy minimum — nie zakłada wyniku); jeden przycisk „Zauważam” (KR dodatkowo „Pokaż w domku”, tylko gdy jest zdjęcie). Tryb demo bez Mentora: świat i tak reaguje po śladzie; „zauważenie” nie jest udawane (notatka B pkt 7).
- **Rodzina zadań:** pole `rodzina` łączy hybrydę z zadaniami w realu o tej samej czynności; kolejka pomija resztę rodziny po wykonaniu jednego (`kladka-nad-oczkiem` ↔ `kladka-z-kartki`, `papierowy-most`; `lawka-dla-goscia` ↔ `obok` tylko w tym samym tygodniu).
- **Kwestie** trzymają standard `01`: Wizkor zleca i nazywa brak („tego magią nie zrobię”), lisek zaprasza „razem”, narratorka opisuje rzecz po powrocie; wariant 1–3 ma pierwsze zdanie głosu równe karcie; 4–8 bez zdrobnień. Kwestie są danymi (`kwestieWizkora.js`, `glosLiska.js`, `koniec-dnia.v1.json`), nie kodem komponentów.

## 2. Karty zadań

Pola w kolejności szablonu z promptu. Kolejność kart = kolejność wdrożenia.

### 1. `kamienie-kroki` — Kamienie-kroki (LD · odważ się · odwaga · ruch)

Wyzwanie ruchowe z wpisaną niepewnością: nie widzisz, gdzie stawiasz stopę. Porażka jest metą („aż raz nie trafisz”), nie błędem. W bloku, bez sprzętu, solo. Najtańsza z sześciu — nie potrzebuje ani jednego nowego modelu.

| pole | treść |
|---|---|
| `id` | `kamienie-kroki` |
| `profil_pierwszy` | LD |
| `os` | `odwaga` |
| `potrzeba` | `ruch` |
| `dlaczego_to_dziala` | Odwaga w klasach 1–8 to zrobienie kroku, którego wyniku się nie zna, na własnych warunkach (ręka przy ścianie jest dozwolona, otwarte oczy są opcją śladu, nie porażką). Ciało zamiast rozmowy o odwadze; sufit zamknięty przez własną stopę, więc nie ma „jak najwięcej”. Świat odpowiada dosłownie: droga z kamieni tam, gdzie mokre ślady liska wyschły — trwałe zostaje to, co dziecko zrobiło naprawdę. |
| `warunek_otwarcia` | Domek etap 1 stoi (`postawEtap`, `hub/zadanieDrewna.js:263`). Dowolna pora dnia. Jeśli etap 1 stanął po zachodzie — otwiera się następnego dnia po wejściu (sekcja 5). |
| `czesc_A` | **Miejsce:** od stopy drabinki pomostu (`mapa.json` `schronienie.pos` [0.18, 1.65]) w stronę oczka zachodniego (`oczka[1]`, obrys wokół [-17.5, 3]). **Mechanika:** Wizkor prosi, żeby lisek pobiegł do oczka i wrócił pod drzewo (na `/swiat` nie ma nabierania wody — `_fasolaTik` wraca bez Fasoli, `app.js:3068`); dziecko prowadzi liska tam i z powrotem — po wyjściu z wody lisek zostawia mokre plamki, które wysychają w kilka kroków (`mokreslady.js`, tik w `app.js:1716` — istnieje). Pod drabinką leży **jeden kamień-krok** (model `kamyczki`, `natura.js:163` — istnieje; to jeden kamyk spod głazu na polanie — głaz od `da86ca2` nie jest rozbijany ani nie jest materiałem, stoi jako element świata; czy kamień ma wrócić jako materiał, decyduje autor — `tmp/tresci-notatki-D.md`). Pod drzewem otwiera się okno Wizkora → karta z trzema obrazkami „Ile kamieni trzeba do wody?”: **trzy / pięć / więcej** — zakład, nie test. Przycisk „Ułożę swoje”. **Zdarzenie końca:** karta hybrydy w Zadaniach ze statusem „Czeka — u ciebie”, znak Wizkora wraca do zwykłej kwestii stanu. Czas: ≤ 2 min (dojście ok. 17 j. w jedną stronę ≈ 15 s marszem). |
| `most` | Mówi **Wizkor** (okno postaci, przycisk „Ułożę swoje”). Karta: „Od drzewa do wody nie ma drogi. Lisek położył jeden kamień.” Głos: „Ślady liska wyschną do rana, a drogi do wody dalej nie będzie. Kamieni magią nie ułożę. Ułóż swoje i przejdź po nich bez patrzenia.” **Dlaczego dziecko chce wstać:** widziało, jak ślady wysychają; zakład „ile kamieni” postawiło na ekranie, a „bez patrzenia” brzmi jak „założę się, że nie dasz rady” — i sprawdzić da się to tylko na podłodze. |
| `czesc_B.mlodsi` | „Ułóż na podłodze trzy kamienie z płaskich rzeczy: kapcie, złożone ubrania, ręczniki tylko na dywanie. Przejdź po nich raz patrząc, a potem raz z zamkniętymi oczami — ręka może trzymać ściany.” 10 min, solo; dorosły tylko jako głos „ciepło–zimno”, jeśli akurat jest. Materiały: to, co leży w przedpokoju. |
| `czesc_B.starsi` | „Pięć kamieni. Przejdź z zamkniętymi oczami. Jeśli trafisz wszystkie, przesuń jeden w bok o pół stopy i idź jeszcze raz — aż raz nie trafisz.” Bez dorosłego, bez widowni; zwrot akcji: koniec wyznacza pierwsze nietrafienie, więc nie ma wyniku „za słaby”. |
| `czesc_B.minimum` | „Jeden kamień z zamkniętymi oczami — i tak się liczy.” Wersja z otwartymi oczami też jest opcją śladu. |

**miejsca** (to samo zadanie w innym kontekście; ★ = działa w bloku bez ogrodu, zwierzaka i pieniędzy):

| id | nazwa | opis |
|---|---|---|
| `pokoj` | W pokoju ★ | Na dywanie, z dala od stołu i kantów; kamienie z ręczników i złożonych ubrań (ręcznik tylko na dywanie). |
| `przedpokoj` | W przedpokoju ★ | Kapcie i wycieraczka jako kamienie, drzwi zamknięte, nic na panelach, co się ślizga. |
| `swietlica` | W świetlicy ★ | Woreczki gimnastyczne albo kartki na wykładzinie, gdy jest kawałek wolnej podłogi. |
| `podworko` | Na podwórku | Kamienie narysowane kredą na chodniku, z dorosłym w zasięgu wzroku; oczy zamknięte tylko trzymając kogoś za rękę. |

| pole | treść |
|---|---|
| `bezpieczenstwo` | Wprost w karcie: tylko na płaskiej podłodze, z dala od stołu, schodów, balkonu i kantów; kamienie płaskie i nieśliskie (nie kartki na panelach, nie poduszki); boso albo w butach, nie w skarpetkach; oczy zamknięte tylko wtedy, gdy ręka dosięga ściany albo trzyma kogoś; nigdy na schodach ani na dworze bez dorosłego. Zdjęcie: kamienie na podłodze, bez ludzi. |
| `slad` | Wybór z trzech (1–3 obrazki: stopa na kamieniu / stopa obok kamienia / otwarte oko): „{Trafiłem\|Trafiłam} wszystkie” · „{Trafiłem\|Trafiłam} część” · „{Przeszedłem\|Przeszłam} z otwartymi oczami”. 4–8 albo jedno zdanie: „Ile kamieni i który był najtrudniejszy?” Zdjęcie opcjonalne: „Same kamienie na podłodze. Bez ludzi.” Każda opcja domyka zadanie. |
| `reakcja_po_sladzie` | Od drabinki w stronę oczka zachodniego układa się **pięć kamieni-kroków** wzdłuż trasy, którą lisek szedł po wodę (instancje `kamyczki`, pozycje stałe w danych, nie z zapisu trasy). Kamera `pokazMiejsce` na drugi kamień, narratorka mówi wiersz z tabeli. Widać z polany i z pomostu. |
| `reakcja_po_zauwazeniu` | Szósty kamień na samym brzegu oczka i kwiat obok niego (`kwiaty.posadz`, `swiat.js:1745` — istnieje): droga dochodzi do wody. |
| `trwaly_obiekt` | Droga z kamieni od wielkiego drzewa do oczka zachodniego (pięć, po zauważeniu sześć + kwiat). Zostaje na planecie na zawsze; nie znika z nową dobą. |
| `monety_w_tle` | Dwadzieścia pięć przy śladzie, w HUD. Zero za zauważenie. Nie pada w kwestiach. |
| `mentor.powiadomienie` | „Zobacz, co {przeszedł\|przeszła} {imie}. W Świecie Ewolucji od drzewa do wody leżą teraz kamienie.” Pod spodem wybór dziecka (np. „trafił część”) i zdjęcie, jeśli jest. Przycisk: „Zauważam”. |
| `mentor.pytanie` | „Który kamień był najtrudniejszy do trafienia?” (działa przy każdym śladzie: z otwartymi oczami, przy części i przy minimum) |

**kwestie** (tokeny `{m|ż}`; bez cyfr w głosie; limity: Wizkor karta ≤ 60 / głos ≤ 140, lisek ≤ 70, narratorka ≤ 80 na wiersz; kolumna `zn.` liczy token jako dłuższą formę):

| głos | moment | wariant | tekst | zn. |
|---|---|---|---|---|
| Wizkor karta | zlecenie (most) | oba | Od drzewa do wody nie ma drogi. Lisek położył jeden kamień. | 59 |
| Wizkor głos | zlecenie (most) | 4–8 | Ślady liska wyschną do rana, a drogi do wody dalej nie będzie. Kamieni magią nie ułożę. Ułóż swoje i przejdź po nich bez patrzenia. | 131 |
| Wizkor głos | zlecenie (most) | 1–3 | Od drzewa do wody nie ma drogi. Ułóż swoje kamienie i przejdź po nich bez patrzenia — ręka może trzymać ściany. | 111 |
| Wizkor karta | przypomnienie (zadanie czeka, następny dzień) | oba | Kamienie czekają na podłodze u ciebie. Nie tu. | 46 |
| Wizkor głos | przypomnienie (zadanie czeka, następny dzień) | oba | Ślady wyschły, kamienia jest jeden. Reszta leży u ciebie na podłodze — ułóż je, kiedy będziesz w domu. | 102 |
| lisek | zaproszenie (chmurka przy drabince) | oba | Ja położyłem jeden kamień. ⏎ Ułożysz swoje? Bez patrzenia. | 55 |
| narratorka | powrót po śladzie | oba | Od drzewa w stronę wody leżą kamienie. ⏎ Ktoś po nich szedł — i zrobiła się droga. | 79 |
| narratorka | powrót po śladzie | 1–3 | Od drzewa do wody leżą kamienie. ⏎ To od ciebie. | 45 |
| narratorka | po zauważeniu przez Mentora | oba | Ostatni kamień dotyka wody. ⏎ Obok wyrósł kwiat, jakby ktoś tędy chodził co dzień. | 79 |
| Wizkor karta | po zauważeniu (podejście) | oba | Mentor to {zobaczył\|zobaczyła}. Kamienie doszły do wody. | 45 |

**haki_3d** (istniejące z `plik:linia`; brakujące z kosztem):

| hak | stan | gdzie / co dopisać | koszt |
|---|---|---|---|
| `kamyczki(s)` | istnieje | `scena-3d-src/src/natura.js:163`; osadzanie wzorcem `_osadz` (`app.js:2246`) | — |
| mokre ślady po wodzie | istnieje | `mokreslady.js`, `app.js:378–382`, tik `app.js:1716`; działa dla każdego oczka z `mapa.oczka` | — |
| `pokazMiejsce(pos)` | istnieje | `app.js:2426`; `spokojnyRuch` pomija obrót i tylko emituje `miejsce:pokazane` | — |
| `kwiaty.posadz(x, z)` | istnieje | `swiat.js:1745` | — |
| pierwszy kamień pod drabinką | do zbudowania | jeden `kamyczki(0.5)` przy stopie drabinki (kamyk „spod głazu”, bez rozbijania — zgodnie z `mapa.json` `glazy[0].doRozbicia: false` po `da86ca2`) (pozycja z `_uklad.drabinkaOdsun`, `app.js:2686`); pokazywany z chwilą otwarcia hybrydy | niski |
| `ulozKamienie(lista)` + zapis | do zbudowania | metoda publiczna w `index.js` (jak `ustawSchronienie`), lista pozycji w `mapa.json` (`hybrydy.kamienie[]`); stan „ile kamieni stoi” w zapisie gracza, odtwarzany po `gotowa` jak `oznaczZuzyte` (`app.js:2279`) | niski |
| karta hybrydy w Zadaniach + ślad z trzech opcji | do zbudowania (wspólne dla szóstki) | wzorzec `wariant/stan.js` (`slad`, `zauwaz`) przeniesiony do `/swiat`; szczegóły w notatkach D | średni (raz) |
| kanał ślad → scena | brak (wspólne) | po zapisie śladu React woła metodę sceny i zapisuje stan świata poza `localStorage` (notatki D, 06) | średni (raz) |

**ryzyka:**

- Upadek z zamkniętymi oczami — kamienie płaskie, ręka przy ścianie, zakaz schodów i dworu bez dorosłego zapisany w karcie, nie w dokumentacji.
- Rodzeństwo chce iść razem — kamienie da się dzielić: każdy idzie osobno, nikt nie wygrywa.
- Dziecko boi się zamknąć oczy — „z otwartymi oczami” jest pełnoprawną opcją śladu, a kamienie i tak się układają.
- 1–3 nie policzy kamieni w zdaniu — ślad obrazkowy; zdanie tylko dla 4–8.
- Ślady liska w części A nie zostaną zauważone (dziecko biegnie) — kwestia Wizkora nazywa je wprost, a pierwszy kamień leży w kadrze pod drabinką.

**runda panelu:** `projektant-zadan`: zwrot akcji to „bez patrzenia” plus meta wyznaczona przez porażkę — bez tego byłby to tor przeszkód. `swieze-spojrzenie`: kształt „ograniczenie” (bez wzroku), tryb inicjowania; ślad zamiast efektu (który kamień), nie zdjęcie pozy. `scena-3d`: świat odpowie kamieniami wzdłuż trasy po wodę (`kamyczki`, `_osadz`) i kwiatem (`posadz`); ślady mokre już działają; zero nowych modeli. `copywriter`: tytuł „Kamienie-kroki” zostaje (z promptu; rola byłaby „Skoczek”, zajęta w `03`); karta bez „założę się”, bo to lisek położył kamień, a nie Wizkor rzuca wyzwanie. Weto `psycholog`/`socjolog`: przeszło po dopisaniu ręki przy ścianie i miejsca w przedpokoju.

| specjalista | werdykt (jedno zdanie) |
|---|---|
| `rodzic-1-3` | Ręczniki z łazienki i trzy minuty — zrobi się w środę; jedyne, czego pilnuję, to „nie na panelach w skarpetkach”, i to stoi w karcie. |
| `rodzic-4-8` | „Aż raz nie trafisz” to wyzwanie, o którym opowie w szkole; nikt nie musi patrzeć, zdjęcie to same ręczniki — zrobi. |
| `pedagog` | 1–3: trzy kamienie i jedno polecenie naraz (najpierw patrząc, potem bez) — wykonalne; 4–8: przesuwanie o pół stopy to prosta strategia, w normie. |
| `psycholog` | Porażka jest metą, więc nie ma „przegrałeś”; opcja z otwartymi oczami chroni dziecko, które nie chce ciemności — zdrowe. |
| `socjolog` | Przedpokój w bloku i świetlica działają bez ogrodu; podwórko jest dodatkiem, nie normą; skryptu płci brak. |
| `scena-3d` | Wszystko z istniejących brył: `kamyczki`, `_osadz`, `posadz`, mokre ślady; do dopisania tylko metoda układania i zapis — najtańsza z szóstki. |
| `narrator-gama` | Wizkor nazywa brak i to, czego nie zrobi; lisek mówi „ja położyłem”, nie zleca; narratorka opisuje kamienie, nie dziecko; tokeny są, cyfr nie ma — przeszło. |

---
### 2. `swiatlo-w-oknie` — Światło w oknie (MD · wytrzymaj · wytrwalosc (regulacja) · regulacja)

Cisza z wyraźnym końcem: patrzysz na jedno światło za oknem, aż coś się przy nim zmieni. Uwaga idzie na rzecz, nie na „uspokój się”; bez liczenia oddechów, bez obietnicy snu. Otwiera się o zachodzie na planecie, więc zamyka sesję powodem, żeby odejść od ekranu.

| pole | treść |
|---|---|
| `id` | `swiatlo-w-oknie` |
| `profil_pierwszy` | MD |
| `os` | `wytrwalosc (regulacja)` |
| `potrzeba` | `regulacja` |
| `dlaczego_to_dziala` | Regulacja przez skupienie na jednym bodźcu z zewnątrz, z końcem, który dziecko rozpozna samo (światło zgasło, ktoś przeszedł). Skupienie i spokój, nie mediacja (kanon: Spokojna Głowa). Świat odpowiada dosłownie tym, czego brakowało: światłem tam, gdzie było ciemno — więc dziecko widzi związek między swoim patrzeniem a lampką na pomoście. |
| `warunek_otwarcia` | Domek etap 1 stoi. Najlepszy moment: **zachód** na planecie (`doba:sesja` z etapem „zachod”, `app.js:1761`; próg w `doba.js:585`, ok. 8 min 31 s przy `minutySesji: 15`, `doba.js:235`). Jeśli etap 1 stanął przed zachodem, Wizkor otwiera hybrydę od razu (kamera na pomost), a kwestia zachodu powtarza ją jako „zadanie czeka” (wariant 1 z `02` §3.1). Jeśli etap 1 stanie po zachodzie — następnego dnia. |
| `czesc_A` | **Miejsce:** pomost na wielkim drzewie (`schronienie`, etap 1). **Mechanika:** bez chodzenia. Okno Wizkora → karta z trzema obrazkami „Gdzie ma stanąć lampka?”: **na barierce / na drabince / pod drzewem** — wybór ustawia pozycję lampki po śladzie. Przycisk „Idę do okna”. **Zdarzenie końca:** karta hybrydy „Czeka — u ciebie”; po zachodzie Wizkor nie zleca już nic (R7 z `01`), noc i podsumowanie idą według `02` §3.2–3.3 z wariantem „zadanie w realu czeka”. Czas: ≤ 60 s. |
| `most` | Mówi **Wizkor** (to jest kwestia zachodu, gdy hybryda MD jest otwarta — zastępuje wariant 1 z `02` §3.1). Karta: „Słońce schodzi, a na pomoście ciemno. Ognia nie wyczaruję.” Głos: „Słońce schodzi, a na pomoście nie ma żadnego światła. Ognia magią nie rozpalę. Usiądź przy swoim oknie i popatrz, skąd bierze się światło.” **Dlaczego dziecko chce wstać:** świat na ekranie właśnie gaśnie, a światło jest tylko za prawdziwym oknem; sesja i tak się kończy, więc nic nie trzyma. |
| `czesc_B.mlodsi` | „Usiądź przy oknie. Znajdź trzy światła albo błyski. Wybierz jedno i patrz na nie, aż coś się przy nim zmieni.” 10 min, solo; gdy jest jasno, „światła” to błyski słońca na szybach i samochodach. Bez materiałów. |
| `czesc_B.starsi` | „Jeśli chcesz, zgaś swoje światło. Usiądź przy oknie i wybierz jedno światło, które nie jest twoje: latarnię, samochód, okno daleko. Patrz, aż zauważysz coś, czego nie było, gdy {zaczynałeś\|zaczynałaś}.” Bez dorosłego; zwrot akcji: końcem jest zmiana, której nie da się przewidzieć. |
| `czesc_B.minimum` | „Trzy światła policzone przy oknie — i tak się liczy.” |

**miejsca** (to samo zadanie w innym kontekście; ★ = działa w bloku bez ogrodu, zwierzaka i pieniędzy):

| id | nazwa | opis |
|---|---|---|
| `okno` | Przy oknie w domu ★ | Okno w pokoju albo w kuchni; w bloku okna naprzeciwko to najlepsze światła. |
| `klatka` | Na klatce (4–8) ★ | Okno na półpiętrze (dla starszych): drzwi mieszkania otwarte, ktoś w domu wie, że tam jesteś. |
| `swietlica` | W świetlicy ★ | Okno na parking albo ulicę po lekcjach: latarnie, błyski, światła aut. |
| `balkon` | Na balkonie | Tylko z dorosłym obok; drzwi balkonowe otwarte, nie wychylać się. |

| pole | treść |
|---|---|
| `bezpieczenstwo` | Wprost: nie otwierać okna, nie wychylać się; balkon tylko z dorosłym. **Bez zdjęcia** — za oknem są cudze okna; ślad tylko wybór albo zdanie. Własne światło gasi tylko 4–8 i tylko „jeśli chcesz”. |
| `slad` | Wybór z trzech (1–3 obrazki: zgaszona lampa / cień przechodzącej sylwetki / oko): „Światło zgasło” · „Ktoś przy nim przeszedł” · „{Zauważyłem\|Zauważyłam} coś innego”. 4–8 albo jedno zdanie: „Co się zmieniło przy świetle?” Zdjęcia nie ma. |
| `reakcja_po_sladzie` | Na pomoście, w miejscu wybranym w części A, staje **mała lampka** (model `latarnia()` ze `swiat.js:1291` w skali ok. 0,45, z `PointLight`). W dzień stoi, po zachodzie świeci — dziecko zobaczy ją zapaloną pod koniec następnej sesji i przy powrocie (kamera `pokazMiejsce`, narratorka). Znacznik braku na pomoście gaśnie. |
| `reakcja_po_zauwazeniu` | Wokół wielkiego drzewa pojawiają się **trzy świetliki** widoczne tylko nocą (znaki z `pora: "noc"`; brama pory `znak.js:321–335` istnieje; wpisy do skopiowania z `mapa-w2.json:1135–1218`, bez `PointLight` — `lightBase: 0`). |
| `trwaly_obiekt` | Lampka na pomoście (świeci każdej nocy); po zauważeniu trzy świetliki nocą wokół drzewa. |
| `monety_w_tle` | Dwadzieścia pięć przy śladzie, w HUD. Zero za zauważenie. |
| `mentor.powiadomienie` | „Zobacz, co {zauważył\|zauważyła} {imie}. Na pomoście w Świecie Ewolucji zapaliła się lampka.” Pod spodem wybór dziecka. Przycisk „Zauważam”. |
| `mentor.pytanie` | „Które światło za oknem {imie} {wybrał\|wybrała} i co się przy nim zmieniło?” |

**kwestie** (tokeny `{m|ż}`; bez cyfr w głosie; limity: Wizkor karta ≤ 60 / głos ≤ 140, lisek ≤ 70, narratorka ≤ 80 na wiersz; kolumna `zn.` liczy token jako dłuższą formę):

| głos | moment | wariant | tekst | zn. |
|---|---|---|---|---|
| Wizkor karta | zachód = most | oba | Słońce schodzi, a na pomoście ciemno. Ognia nie wyczaruję. | 58 |
| Wizkor głos | zachód = most | 4–8 | Słońce schodzi, a na pomoście nie ma żadnego światła. Ognia magią nie rozpalę. Usiądź przy swoim oknie i popatrz, skąd bierze się światło. | 138 |
| Wizkor głos | zachód = most | 1–3 | Słońce schodzi, a na pomoście ciemno. Ognia nie wyczaruję. Usiądź przy oknie i poszukaj świateł. | 96 |
| Wizkor karta | otwarcie przed zachodem (etap 1 stanął w dzień) | oba | Po zachodzie na pomoście będzie ciemno. Gdzie stanie lampka? | 60 |
| Wizkor głos | otwarcie przed zachodem | oba | Po zachodzie na pomoście będzie ciemno. Ognia magią nie rozpalę. Wybierz, gdzie ma stanąć lampka, a światła poszukaj u siebie za oknem. | 135 |
| lisek | zaproszenie (chmurka na pomoście) | oba | Ja siadam na pomoście po ciemku. ⏎ Usiądziesz przy oknie? Opowiesz mi. | 67 |
| narratorka | powrót po śladzie (wejście) | oba | Na pomoście świeci mała lampka. ⏎ Zapaliła się, kiedy ktoś patrzył w okno. | 71 |
| narratorka | powrót po śladzie | 1–3 | Na pomoście świeci lampka. ⏎ To od ciebie. | 39 |
| narratorka | po zauważeniu (noc) | oba | Wokół drzewa krążą świetliki. ⏎ Przyleciały do światła, które nie zgasło. | 70 |
| Wizkor karta | po zauważeniu (podejście) | oba | Mentor to {zobaczył\|zobaczyła}. Przy drzewie są świetliki. | 47 |

**haki_3d** (istniejące z `plik:linia`; brakujące z kosztem):

| hak | stan | gdzie / co dopisać | koszt |
|---|---|---|---|
| `latarnia()` — model z `PointLight` | istnieje | `swiat.js:1291–1309`; dziś dodawana do sceny tylko przy `!mapa.latarnia.ukryta` (`swiat.js:1850`) | — |
| `doba:sesja` etap „zachod” | istnieje | `app.js:1751–1762`, `doba.js:585`; hub słucha w `Swiat.jsx:1884` | — |
| brama pory dnia znaków (`pora: "noc"`) | istnieje | `znak.js:321–335` `ustawAktywny`; wpisy świetlików `mapa-w2.json:1135–1218` (w `znakiWylaczone`) | — |
| `pokazMiejsce`, `schowajZnakZMapy` / `pokazZnakNaMapie` | istnieje | `app.js:2426`; `hub/znakiMapy.js:119–146` | — |
| `ustawLampke("barierka"|"drabinka"|"drzewo")` | do zbudowania | instancja `latarnia()` w skali 0,45 na `schronienie-kotwica` (`app.js:2684`) albo na gruncie pod drzewem; metoda publiczna w `index.js`; stan w zapisie gracza | niski |
| świetliki na `/swiat` | do zbudowania (dane) | trzy wpisy w `mapa.json` `znaki` wokół [0.18, 1.65] z `pora: "noc"`, `lightBase: 0`; schowane `schowajZnakZMapy` do zauważenia | niski |
| budżet świateł punktowych | uwaga | `PLAN_DZIALANIA.md` §6: 3–4 światła naraz; lampka MD + ukryta latarnia z `03` (`ostatni-dzwiek`) = 2, świetliki jako sprite bez światła | — |
| kwestia zachodu z hybrydą | do dopisania (dane) | `kwestieWizkora.js:100` `kwestiaZachodu` — nowy wariant, gdy `stanHybrydy().otwarta && id === "swiatlo-w-oknie"` | niski |

**ryzyka:**

- Sesja o szesnastej w czerwcu: za oknem jasno — wariant 1–3 mówi o błyskach, a „coś się zmieni” dzieje się i w dzień.
- Nic się nie zmienia przez dziesięć minut — `minimum` (trzy policzone) domyka zadanie; opcja „coś innego” w śladzie łapie każdą zmianę.
- Okno na ścianę albo parter bez widoku — miejsca `klatka` i `swietlica`.
- Dziecko boi się ciemności — własne światło gasi tylko 4–8 i tylko „jeśli chcesz”; lampka w świecie nie jest nagrodą za ciemność, tylko za patrzenie.
- Kolizja z sekwencją końca dnia z `02` — hybryda MD jest jej wariantem, nie drugim oknem: jedna kwestia zachodu, potem noc i podsumowanie bez zmian.

**runda panelu:** `projektant-zadan`: zwrot akcji to koniec, którego nie da się przewidzieć („aż coś się zmieni”); bez niego to „popatrz w okno”. `swieze-spojrzenie`: tryb obserwowania, rytuał wieczorny bez rytuału; jedyna z szóstki, gdzie ekran daje tylko wybór miejsca lampki. `scena-3d`: świat odpowie modelem, który już jest (`latarnia()` z prawdziwym światłem) i świetlikami z bramą pory — bez nowej geometrii; pilnować budżetu świateł. `copywriter`: „Światło w oknie” zostaje z promptu; karta zachodu w dwóch zdaniach, drugie nazywa brak. Weto `psycholog`: bez snu, bez „uspokój się”, gaszenie światła opcjonalne — przeszło. Weto `socjolog`: okno naprzeciwko w bloku jest najlepszym miejscem, nie gorszym — przeszło.

| specjalista | werdykt (jedno zdanie) |
|---|---|
| `rodzic-1-3` | Zero materiałów, zero mojego czasu, robi się przy oknie w kuchni, kiedy ja zmywam — zrobi się nawet w środę. |
| `rodzic-4-8` | Zgaszenie własnego światła i patrzenie w cudze brzmi jak film, nie jak ćwiczenie; nikt nie widzi, nikt nie pyta o uczucia — zrobi. |
| `pedagog` | 1–3: „trzy światła, wybierz jedno, patrz aż” to trzy proste kroki z widocznym końcem; 4–8: „coś, czego nie było” wymaga porównania — w normie. |
| `psycholog` | Regulacja przez uwagę na zewnątrz, nie przez kontrolę oddechu; koniec rozpoznawalny; opcja „coś innego” chroni przed porażką — zdrowe. |
| `socjolog` | Działa w bloku lepiej niż w domu z ogrodem (więcej świateł); klatka i świetlica ratują dziecko bez wolnego okna. |
| `scena-3d` | `latarnia()` ma już `PointLight`; świetliki są danymi z bramą pory; do dopisania jedna metoda i trzy wpisy — tanio. |
| `narrator-gama` | Kwestia zachodu nazywa zadanie i brak, nie zaprasza do kolejnej rzeczy na ekranie (R4); lisek nie cytuje nikogo; narratorka mówi o lampce — przeszło. |

---
### 3. `kladka-nad-oczkiem` — Kładka (ST · zbuduj · wytrwalosc · kompetencja)

Problem z ograniczeniem i test: ta sama kartka, ten sam odstęp, ten sam ciężarek — dwa (4–8: trzy) kształty. Wynik nieznany, ale każdy wynik jest odkryciem. Świat buduje kładkę dokładnie w kształcie, który wygrał, więc dziecko widzi swoją decyzję w drewnie. Pole `rodzina` łączy ją z `kladka-z-kartki` (`03` §7.5) i `papierowy-most` (`wariant/tresci.js:26`): po hybrydzie kolejka pomija oba.

| pole | treść |
|---|---|
| `id` | `kladka-nad-oczkiem` |
| `profil_pierwszy` | ST |
| `os` | `wytrwalosc` |
| `potrzeba` | `kompetencja` |
| `dlaczego_to_dziala` | Plan → test → poprawka to kształt ST (`03` §6.1): dziecko stawia zakład na ekranie, sprawdza go rękami, a poprawka (drugi kształt) jest wpisana w polecenie. Kompetencja bierze się z tego, że wie, dlaczego kładka wygląda tak, a nie inaczej — sama to sprawdziła. Wytrwałość jako „sprawdź do końca”, nie jako „nie wstawaj”. |
| `warunek_otwarcia` | Domek etap 1 stoi. Dowolna pora. Jeśli zadanie w realu `kladka-z-kartki` albo `papierowy-most` było już zrobione, hybryda ST nie wchodzi jako pierwsza — profil ST dostaje `co-jest-na-dnie` (pierwsze z pozostałych). |
| `czesc_A` | **Miejsce:** kładka nad przewężeniem oczka wschodniego (`mapa.json` `oczka[0]`; przewężenie między [15.57, -1.01] a [15.03, -3.69]). Model `most()` (`swiat.js:1311`) istnieje, dziś ukryty pod [-4.7, 6.9]; do przeniesienia na ok. [15.3, -2.3], obrót w poprzek, skala ok. 1,3 — sprawdzić w `public/scena-3d/edytor.html`. Wersja startowa **„bez desek”**: tylko dwie skrajne deski i słupki, bez sznura. **Mechanika:** kamera `pokazMiejsce` na kładkę po zleceniu; lisek dochodzi do brzegu, kładka bez desek nie przenosi (`onBridge`, `app.js:1061`, włączane dopiero po ułożeniu). Dotknięcie znaku `kladka` (`absorb: false`, `raz: true`) → okno Wizkora → karta z trzema obrazkami „Którą deskę położyć?”: **płaska / harmonijka / rurka** — zakład. Przycisk „Sprawdzę na kartce”. **Zdarzenie końca:** karta hybrydy „Czeka — u ciebie”. Czas: ≤ 2 min (dojście ze startu ok. 25 j.). |
| `most` | Mówi **Wizkor**. Karta: „Kładka ma tylko brzegi. Która deska utrzyma liska?” Głos: „Nad oczkiem została kładka bez desek. Płaska czy złożona — nie umiem tego policzyć. Sprawdź na kartce, która utrzyma więcej.” **Dlaczego dziecko chce wstać:** lisek stoi przed przerwą w kładce, zakład jest postawiony, a odpowiedź leży w kartce z zeszytu, nie na ekranie. |
| `czesc_B.mlodsi` | „Połóż kartkę między dwiema książkami. Sprawdź, czy utrzyma gumkę. Potem złóż kartkę jak wachlarz i sprawdź to samo.” 10–15 min, solo; dwie książki, kartka z zeszytu, gumka albo temperówka. |
| `czesc_B.starsi` | „Trzy kształty z tej samej kartki — płaska, harmonijka, rurka. Ten sam odstęp, ten sam ciężarek. Ustal kolejność od najsłabszej do najmocniejszej.” Bez dorosłego; zwrot akcji: kolejność trzech, nie „czy się uda”. |
| `czesc_B.minimum` | „Jedna kładka i jeden ciężarek — i tak się liczy.” |

**miejsca** (to samo zadanie w innym kontekście; ★ = działa w bloku bez ogrodu, zwierzaka i pieniędzy):

| id | nazwa | opis |
|---|---|---|
| `biurko` | Przy stole ★ | Weź dwie książki, kartkę z zeszytu i gumkę. |
| `swietlica` | W świetlicy ★ | Weź dwa pudełka od gier zamiast książek. |
| `kuchnia` | W kuchni ★ | Weź dwa kubki, serwetkę i łyżeczkę jako ciężarek. |
| `lawka` | Na ławce w szkole ★ | Na ławce: dwa piórniki, kartka i gumka. |

| pole | treść |
|---|---|
| `bezpieczenstwo` | Brak narzędzi, brak nożyczek; kartka i drobiazgi z piórnika. Zdjęcie: sama kładka na stole, bez ludzi. Nic do kupienia. |
| `slad` | Wybór z trzech (1–3 obrazki: kartka płaska / harmonijka / znak równości): „Płaska utrzymała więcej” · „Złożona utrzymała więcej” · „Obie tyle samo”. 4–8 albo jedno zdanie: „Co {położyłeś\|położyłaś} jako ciężarek i która wygrała?” Zdjęcie kładki opcjonalne: „Sama kładka na stole.” Wybór ustawia kształt desek w świecie (płaska → deski, złożona → zygzak, tyle samo → deski przemiennie). |
| `reakcja_po_sladzie` | Kładka dostaje **deski w kształcie zwycięskiej konstrukcji** (płaskie deski / zygzak harmonijki / okrągłe rurki jako cylindry), kolizja `onBridge` włączona — lisek przechodzi nad oczkiem; kamera na kładkę, narratorka mówi wiersz. Znak `kladka` gaśnie. |
| `reakcja_po_zauwazeniu` | Na słupkach pojawia się **sznurowa poręcz** (w `most()` już jest — `swiat.js:1321–1325`; wersja bez desek ją chowa) i kwiat przy przęśle (`kwiaty.posadz`). |
| `trwaly_obiekt` | Kładka nad oczkiem wschodnim, przechodnia, w kształcie wybranym przez dziecko; po zauważeniu z poręczą i kwiatem. |
| `monety_w_tle` | Dwadzieścia pięć przy śladzie, w HUD. Zero za zauważenie. |
| `mentor.powiadomienie` | „Zobacz, co {zbudował\|zbudowała} {imie}. Nad oczkiem w Świecie Ewolucji stanęła kładka — z takich desek, jakie wygrały na stole.” Pod spodem wybór i zdjęcie, jeśli jest. Przycisk „Zauważam”. |
| `mentor.pytanie` | „Co {imie} {położył\|położyła} na kładce jako ciężarek — i która kładka wygrała?” |

**kwestie** (tokeny `{m|ż}`; bez cyfr w głosie; limity: Wizkor karta ≤ 60 / głos ≤ 140, lisek ≤ 70, narratorka ≤ 80 na wiersz; kolumna `zn.` liczy token jako dłuższą formę):

| głos | moment | wariant | tekst | zn. |
|---|---|---|---|---|
| Wizkor karta | zlecenie (most) | oba | Kładka ma tylko brzegi. Która deska utrzyma liska? | 50 |
| Wizkor głos | zlecenie (most) | 4–8 | Nad oczkiem została kładka bez desek. Płaska czy złożona — nie umiem tego policzyć. Sprawdź na kartce, która utrzyma więcej. | 124 |
| Wizkor głos | zlecenie (most) | 1–3 | Kładka ma tylko brzegi. Która deska utrzyma liska? Sprawdź na kartce między książkami. | 86 |
| Wizkor karta | przypomnienie (zadanie czeka) | oba | Kładka czeka na deski. Kartka i dwie książki — u ciebie. | 56 |
| Wizkor głos | przypomnienie (zadanie czeka) | oba | Kładka nad oczkiem dalej nie ma desek. Odpowiedź leży u ciebie: kartka, dwie książki i coś ciężkiego. | 101 |
| lisek | zaproszenie (chmurka przy kładce) | oba | Ja tu nie przejdę. ⏎ Zbudujesz małą kładkę z kartki? | 49 |
| narratorka | powrót po śladzie | oba | Nad oczkiem leży kładka z nowymi deskami. ⏎ Złożone tak, jak ta, która wygrała. | 76 |
| narratorka | powrót po śladzie | 1–3 | Kładka ma deski. ⏎ Lisek już przeszedł. | 36 |
| narratorka | po zauważeniu przez Mentora | oba | Na słupkach kładki zawisł sznur, obok wyrósł kwiat. ⏎ Teraz da się przejść, nie patrząc pod nogi. | 94 |
| Wizkor karta | po zauważeniu (podejście) | oba | Mentor to {zobaczył\|zobaczyła}. Kładka ma poręcz. | 38 |

**haki_3d** (istniejące z `plik:linia`; brakujące z kosztem):

| hak | stan | gdzie / co dopisać | koszt |
|---|---|---|---|
| `most()` — model kładki | istnieje (ukryty) | `swiat.js:1311–1326`; `mapa.json` `most.ukryty: true`, pos [-4.7, 6.9]; do sceny dodawany tylko przy budowie świata (`swiat.js:1843`) | — |
| `onBridge` / `MOST_POL_SZER` | istnieje | `app.js:66`, `app.js:1061`; liczone od `mapa.most.pos` — po przeniesieniu kładki nad wodę sprawdzić wysokość tafli (`fasola.js:342`: `-gl + 0.05`) | — |
| `pokazMiejsce`, znaki (`absorb:false`, `raz:true`) | istnieje | `app.js:2426`; wzorzec znaku `czarodziej` w `mapa.json` | — |
| `pokazUkryty("most")` w czasie gry | do zbudowania | trzymać referencję do bryły z `swiat.js:1838` i `s.add(t)` na żądanie; metoda publiczna w `index.js` | niski |
| parametr `deski` w `most()` | do zbudowania | `"brak" \| "plaska" \| "harmonijka" \| "rurka"`: skrajne deski zawsze, środek wg wartości; sznur tylko od `poreczy: true` | niski |
| `mapa.json`: pozycja, obrót, skala kładki | do zbudowania (dane) | przewężenie oczka wschodniego, ok. [15.3, -2.3]; obrót w poprzek; skala ~1,3 (rozpiętość ok. 2,7 j.) — sprawdzić w edytorze | niski |
| zapis kształtu i poręczy | brak (wspólne) | stan świata poza `localStorage` (notatki D) | średni (raz) |
| hak dzielony z `03` | uwaga | `kladka-z-kartki` (`03` §7.5) i `papierowy-most` (W2) proponują ten sam most → hybryda ma pierwszeństwo; zadanie w realu dostaje kwiat przy stole liska (pieniek) — do poprawienia w `03` przy scaleniu | — |

**ryzyka:**

- 1–3 nie wie, co to harmonijka — polecenie mówi „złóż jak wachlarz”, przykład na karcie (obrazek).
- Wynik „obie tyle samo” wygląda jak brak wyniku — to trzecia opcja śladu, a świat i tak kładzie deski (przemiennie).
- Dziecko zna odpowiedź ze szkoły — wariant 4–8 ma trzeci kształt i kolejność, której nie zna.
- Ciężarek za ciężki (książka) — `jak` nazywa gumkę i łyżeczkę; nic nie spadnie nikomu na stopę.
- Powtórka z `kladka-z-kartki` w tygodniu drugim — pole `rodzina` wyłącza ją z kolejki po hybrydzie.

**runda panelu:** `projektant-zadan`: zwrot akcji to porównanie kształtów z tym samym ciężarkiem — bez niego „zbuduj most” nie ma pytania; dubel z `03` §7.5 rozstrzygnięty polem `rodzina`. `swieze-spojrzenie`: skala (most na dwie książki) i ograniczenie (jedna kartka) — dziwne i dobre; ekran daje zakład, nie instrukcję. `scena-3d`: model jest, brakuje tylko pokazania w czasie gry i parametru desek; przeniesienie nad wodę to dane plus sprawdzenie tafli. `copywriter`: „Kładka” (rzecz, nie rola — rola „Budowniczy” zajęta w `03`); szept dla 4–8: „Która wygra.” Weto `psycholog`: nie da się oblać (każdy wynik jest opcją śladu) — przeszło. Weto `socjolog`: ławka w szkole i świetlica, zero zakupów — przeszło.

| specjalista | werdykt (jedno zdanie) |
|---|---|
| `rodzic-1-3` | Kartka, dwie książki, gumka — wszystko leży na biurku; „jak wachlarz” wystarczy powiedzieć raz; zrobi się bez mojego udziału. |
| `rodzic-4-8` | To eksperyment z wynikiem do opowiedzenia, nie zadanie plastyczne; trzy kształty i kolejność dają mu własne zdanie — zrobi sam. |
| `pedagog` | 1–3: dwa kroki po kolei (płaska, potem wachlarz) i jeden ciężarek — wykonalne; 4–8: uporządkowanie trzech wyników to strategia w normie. |
| `psycholog` | Każdy wynik jest odkryciem i opcją śladu; kompetencja rośnie z własnego sprawdzenia, nie z pochwały — zdrowe. |
| `socjolog` | Ławka w szkole i pudełka gier ze świetlicy — działa u dziecka bez biurka; bez skryptu „budowanie dla chłopców”, bo to kartka i gumka. |
| `scena-3d` | `most()` z `onBridge` już jest; dopisać `pokazUkryty`, parametr desek i przenieść pozycję nad wodę — tanio, jedno ryzyko to wysokość tafli. |
| `narrator-gama` | Wizkor przyznaje, czego nie policzy, i zleca jedną rzecz; lisek mówi „ja tu nie przejdę” zamiast zlecać; narratorka opisuje deski — przeszło. |

---
### 4. `co-jest-na-dnie` — Co jest na dnie (DT · zauważ · ciekawosc · uwaznosc)

Zagadka ze świata bez zagadki od Wizkora: coś błyska na dnie mętnego oczka, a z góry nie widać, co pływa, a co tonie. Ekran przyjmuje zakład, miska z wodą go rozstrzyga. Świat odpowiada tym, co dziecko sprawdziło: woda robi się przejrzysta, na dnie widać kamyk, na wodzie to, co pływa. `03` §9 odrzuciło „Co jest na dnie miski” jako zadanie w realu właśnie na rzecz tej hybrydy.

| pole | treść |
|---|---|
| `id` | `co-jest-na-dnie` |
| `profil_pierwszy` | DT |
| `os` | `ciekawosc` |
| `potrzeba` | `uwaznosc` |
| `dlaczego_to_dziala` | Ciekawość jako obserwacja → sprawdzenie (`03` §6.1, DT): najpierw przewidywanie, potem test, a różnica między nimi jest odkryciem. Uważność: dziecko patrzy na rzecz, którą zna z kuchni, jakby jej nie znało. Nie da się oblać — „wszystko {zgadłem\|zgadłam}” jest równie dobrym śladem jak „coś mnie zaskoczyło”. |
| `warunek_otwarcia` | Domek etap 1 stoi. Dowolna pora. Dla profilu DT pierwsza; dla ST pierwsza zastępcza, gdy rodzina kładki jest zużyta. |
| `czesc_A` | **Miejsce:** oczko wschodnie (`mapa.json` `oczka[0]`, obrys wokół [16, -2]). **Mechanika:** po zleceniu kamera `pokazMiejsce([15.5, -2.2])`; na wodzie znak `dno-oczka` (`file: "prog"` — sprite istnieje, używany przez świetliki w `mapa-w2.json`; niebieskie halo, `absorb: false`, `raz: true`). Lisek dochodzi, dotknięcie → okno Wizkora → karta z trzema obrazkami „Co z tego pływa?”: **kamyk / patyk / liść** — dziecko stawia zakład (bez „poprawnie”; wybór zapisany, wraca w reakcji). Przycisk „Sprawdzę w prawdziwej wodzie”. **Zdarzenie końca:** karta hybrydy „Czeka — u ciebie”. Czas: ≤ 2 min (dojście ze startu ok. 25 j. ≈ 20 s biegiem). |
| `most` | Mówi **Wizkor**. Karta: „Coś leży na dnie oczka. Co pływa, a co tonie?” Głos: „Na dnie oczka coś błyska, ale woda jest mętna. Nie wiem, co w niej pływa, a co tonie. Sprawdź to w prawdziwej wodzie.” **Dlaczego dziecko chce wstać:** zakład z ekranu da się rozstrzygnąć tylko w misce; woda na planecie jest mętna i taka zostanie, dopóki nie wróci. |
| `czesc_B.mlodsi` | „Postaw miskę w zlewie i nalej trochę wody. Włóż po kolei pięć rzeczy z kuchni. Zanim włożysz, powiedz: utonie czy popłynie.” 10 min, solo; miska nie opuszcza zlewu. Rzeczy: łyżka, korek, nakrętka, kredka, kamyk z butów. |
| `czesc_B.starsi` | „Znajdź rzecz, która tonie, i spraw, żeby popłynęła — bez trzymania.” Folia, nakrętka jako łódka, powietrze w słoiku. Bez dorosłego; zwrot akcji: nie „co pływa”, tylko „jak zmienić wynik”. |
| `czesc_B.minimum` | „Jedna rzecz do kubka z wodą i jedno „a jednak” — i tak się liczy.” |

**miejsca** (to samo zadanie w innym kontekście; ★ = działa w bloku bez ogrodu, zwierzaka i pieniędzy):

| id | nazwa | opis |
|---|---|---|
| `kuchnia` | W kuchni ★ | Miska w zlewie, pięć rzeczy z szuflady. |
| `lazienka` | W łazience ★ | Umywalka z korkiem: szczoteczka, mydło, gumka do włosów, korek od wanny. |
| `swietlica` | W świetlicy ★ | Kubek wody i drobiazgi z piórnika: gumka, temperówka, spinacz. |
| `kaluza` | Na dworze po deszczu | Kałuża, patyki i kamyki, z dorosłym w zasięgu wzroku; nie nad rzeką ani stawem. |

| pole | treść |
|---|---|
| `bezpieczenstwo` | Wprost: miska albo umywalka, nigdy wanna ani woda na dworze poza kałużą; nic elektrycznego i nic, co się psuje od wody (telefon, pilot, zegarek); tylko rzeczy, które wolno zamoczyć. Zdjęcie: miska z rzeczami, bez ludzi. |
| `slad` | Wybór z trzech (1–3 obrazki: kamyk na wodzie / patyk na dnie / ptaszek „zgadnięte”): „Coś, co miało utonąć, pływało” · „Coś, co miało pływać, utonęło” · „Wszystko {zgadłem\|zgadłam}”. 4–8 albo jedno zdanie: „Co pływało, choć nie powinno?” Zdjęcie miski opcjonalne: „Sama miska. Bez ludzi.” |
| `reakcja_po_sladzie` | Woda w oczku wschodnim robi się **przejrzysta** (tafla `MeshLambertMaterial` z `opacity 0.92` → ok. 0,55, `emissiveIntensity` niżej — `fasola.js:343`), na dnie widać **błyszczący kamyk** (`kamyczki` w skali 0,4 pod taflą), a na wodzie **trzy liście lilii** (płaskie dyski na tafli). Znak `dno-oczka` gaśnie; kamera na oczko; narratorka mówi wiersz. |
| `reakcja_po_zauwazeniu` | Jedna lilia **zakwita**: biały kwiat na liściu (mały mesh, nie `kwiaty.posadz` — ten sadzi w trawie). Żaba z promptu odrzucona (koszt wysoki, sekcja 3). |
| `trwaly_obiekt` | Przejrzyste oczko wschodnie z kamykiem na dnie i liśćmi lilii; po zauważeniu kwiat. |
| `monety_w_tle` | Dwadzieścia pięć przy śladzie, w HUD. Zero za zauważenie. |
| `mentor.powiadomienie` | „Zobacz, co {sprawdził\|sprawdziła} {imie}. Na oczku w Świecie Ewolucji wypłynęły liście, a woda jest przejrzysta.” Pod spodem wybór dziecka i zdjęcie, jeśli jest. Przycisk „Zauważam”. |
| `mentor.pytanie` | „Które rzeczy pływały, a które utonęły?” (działa też przy śladzie „wszystko {zgadłem\|zgadłam}” i przy minimum) |

**kwestie** (tokeny `{m|ż}`; bez cyfr w głosie; limity: Wizkor karta ≤ 60 / głos ≤ 140, lisek ≤ 70, narratorka ≤ 80 na wiersz; kolumna `zn.` liczy token jako dłuższą formę):

| głos | moment | wariant | tekst | zn. |
|---|---|---|---|---|
| Wizkor karta | zlecenie (most) | oba | Coś leży na dnie oczka. Co pływa, a co tonie? | 45 |
| Wizkor głos | zlecenie (most) | 4–8 | Na dnie oczka coś błyska, ale woda jest mętna. Nie wiem, co w niej pływa, a co tonie. Sprawdź to w prawdziwej wodzie. | 117 |
| Wizkor głos | zlecenie (most) | 1–3 | Coś leży na dnie oczka. Nie wiem, co pływa, a co tonie. Sprawdź w misce z wodą. | 79 |
| Wizkor karta | przypomnienie (zadanie czeka) | oba | Oczko dalej mętne. Miska z wodą — u ciebie w kuchni. | 52 |
| Wizkor głos | przypomnienie (zadanie czeka) | oba | Woda w oczku dalej jest mętna. Miska, woda i pięć rzeczy z kuchni czekają u ciebie, nie tu. | 91 |
| lisek | zaproszenie (chmurka przy oczku) | oba | Ja bym wrzucił patyk. ⏎ Sprawdzisz w kuchni, co pływa? | 51 |
| narratorka | powrót po śladzie | oba | Woda w oczku jest dziś przejrzysta. ⏎ Na dnie leży kamyk, na wodzie liście. | 72 |
| narratorka | powrót po śladzie | 1–3 | Woda w oczku jest czysta. ⏎ Widać dno. | 35 |
| narratorka | po zauważeniu przez Mentora | oba | Na jednym liściu otworzył się kwiat. ⏎ Biały, tuż nad kamykiem. | 60 |
| Wizkor karta | po zauważeniu (podejście) | oba | Mentor to {zobaczył\|zobaczyła}. Na oczku zakwitła lilia. | 45 |

**haki_3d** (istniejące z `plik:linia`; brakujące z kosztem):

| hak | stan | gdzie / co dopisać | koszt |
|---|---|---|---|
| `zbudujOczko` — tafla wody | istnieje | `fasola.js:322–352`; tafla `transparent`, `opacity 0.92`, `emissive` — przejrzystość to zmiana dwóch liczb na materiale | — |
| znak `prog` (sprite światełka) | istnieje | `mapa-w2.json:1136` (`file: "prog"`); na `/swiat` nieużywany, plik w `public/scena-3d/assets` | — |
| `kamyczki()` | istnieje | `natura.js:163`; osadzenie pod taflą wymaga `h` ujemnego względem gruntu (`_osadz`) | — |
| `pokazMiejsce`, `schowajZnakZMapy` / `pokazZnakNaMapie` | istnieje | `app.js:2426`; `hub/znakiMapy.js:119–146` | — |
| liście lilii (trzy dyski) + kwiat | do zbudowania | `CircleGeometry` r≈0,3 na wysokości tafli, kolor z palety `MAT_NATURA`; kwiat: pięć płatków jak w `zbudujKwiaty` (`swiat.js:1520+`), ale na tafli | niski |
| `ustawOczko({przejrzyste, lilie, kwiat})` + zapis | do zbudowania | metoda publiczna w `index.js`; stan w zapisie gracza; odtwarzane po `gotowa` | niski |
| woda „na dnie coś błyska” przed śladem | do zbudowania (dane) | kamyk pod taflą od początku z `emissive`, widoczny słabo przez `opacity 0.92` — sprawdzić czytelność w przeglądarce | niski |
| żaba po zauważeniu | odrzucone | model + animacja + osadzenie na liściu | wysoki |

**ryzyka:**

- Rozlana woda — miska w zlewie i umywalka to pierwsze miejsca; karta o tym mówi.
- Dziecko wkłada do wody coś cennego — bezpieczeństwo wprost nazywa telefon, pilot, zegarek.
- „Wszystko zgadłem” i nuda — to pełnoprawny ślad, a wariant 4–8 („spraw, żeby popłynęło”) ma wynik nieznany.
- 1–3 nie zna słów „tonie / pływa” w zdaniu — ślad obrazkowy; głos Wizkora używa obu słów przy obrazkach.
- Kałuża na dworze — tylko z dorosłym w zasięgu wzroku, nigdy rzeka ani staw (weto bezpieczeństwa zapisane w miejscu).

**runda panelu:** `projektant-zadan`: zwrot akcji to zakład przed sprawdzeniem — bez „najpierw powiedz” to zabawa w misce bez pytania. `swieze-spojrzenie`: tryb obserwowania, „ślad zamiast efektu” (co zaskoczyło, nie ładne zdjęcie); 4–8 dostaje odwrócenie (zmień wynik). `scena-3d`: świat odpowie na tafli, którą już ma — przejrzystość, kamyk, dyski; kwiat lilii to kilkanaście linijek; żaba odpada. `copywriter`: „Co jest na dnie” zostaje (pytanie w tytule), szept 4–8: „A jednak.” Weto `psycholog`: bez porażki, bez zwierzeń — przeszło. Weto `socjolog`: kubek w świetlicy i umywalka w bloku — przeszło; kałuża tylko z dorosłym.

| specjalista | werdykt (jedno zdanie) |
|---|---|
| `rodzic-1-3` | Miska w zlewie i łyżka — zrobi się przy kolacji; jedyny mój ruch to „nie telefon”, i to jest w karcie. |
| `rodzic-4-8` | „Spraw, żeby utonięte popłynęło” to wyzwanie z wynikiem do pokazania, nie zabawa w wodzie dla maluchów — zrobi, nawet przy bracie. |
| `pedagog` | 1–3: pięć rzeczy z przewidywaniem przed każdą — próg górny, ale jedno polecenie naraz; 4–8: zmiana wyniku wymaga prostej hipotezy — w normie. |
| `psycholog` | Zakład bez oceny i trzy opcje śladu, z których każda domyka — buduje ciekawość, nie obowiązek; zdrowe. |
| `socjolog` | Kubek wody w świetlicy i umywalka w bloku; kałuża tylko z dorosłym — nikt nie odpada; przykłady z kuchni, nie z ogrodu. |
| `scena-3d` | Tafla ma `opacity` i `emissive`, kamyk i dyski to istniejące wzorce; jedyne pytanie to czytelność „błysku” pod mętną wodą — do sprawdzenia w przeglądarce. |
| `narrator-gama` | Wizkor nie wie i pyta, nie zleca listy; lisek „ja bym wrzucił patyk” to zaproszenie razem; narratorka opisuje wodę i liście — przeszło. |

---
### 5. `lawka-dla-goscia` — Ławka dla gościa (EM · podaruj · wspolpraca · troska)

Ktoś czegoś potrzebuje, zanim poprosi — i to ktoś, kto dopiero przyjdzie. Gest bez słów i bez widowni: miejsce przygotowane tak, żeby gość sam je znalazł. Gościnność, nie pomoc (pomoc po cichu to `tajny-pomocnik`, `03` §7.3). Gościem może być ktoś z domu, ktoś ze świetlicy albo samo dziecko po powrocie — dlatego zadanie nie zakłada domu, do którego ktoś wraca.

| pole | treść |
|---|---|
| `id` | `lawka-dla-goscia` |
| `profil_pierwszy` | EM |
| `os` | `wspolpraca` |
| `potrzeba` | `troska` |
| `dlaczego_to_dziala` | Kształt EM to odpowiadanie na czyjąś potrzebę z kimś albo dla kogoś, bez sceny (`03` §6.1). Troska o rzecz i miejsce, nie praca emocjonalna: nikt nie musi się ucieszyć ani zauważyć, a ślad jest o tym, co zostawiono. Niespodzianka (4–8: „nie mów, że to ty — niech sam zgadnie”) zamienia „bądź miły” w grę, którą da się wygrać samemu. Świat odpowiada rzeczą na ławce — dokładnie tą, którą dziecko wybrało na ekranie, ale dopiero po prawdziwym geście. |
| `warunek_otwarcia` | Domek etap 1 stoi (ławka stoi na pomoście). Dowolna pora. Nie w tym samym tygodniu co `obok` (`03` §7.4), które używa tej samej ławki. |
| `czesc_A` | **Miejsce:** pomost (`schronienie`, etap 1). Na pomoście stoi **ławka dla dwojga** (nowy mały model, sekcja haki), pusta. **Mechanika:** po zleceniu kamera `pokazMiejsce` na pomost; lisek wchodzi po drabince; dotknięcie znaku `lawka` (`absorb: false`, `raz: true`, na wysokości pomostu) → okno Wizkora → karta z trzema obrazkami „Co zostawić gościowi na ławce?”: **poduszka / kubek / koc** — wybór zapisany, pojawia się dopiero po śladzie. Przycisk „Przygotuję prawdziwe miejsce”. **Zdarzenie końca:** karta hybrydy „Czeka — u ciebie”. Czas: ≤ 90 s. |
| `most` | Mówi **Wizkor**. Karta: „Na pomoście stoi ławka dla dwojga. Nikt na niej nie usiadł.” Głos: „Na pomoście stoi ławka dla dwojga, ale gościa nie wyczaruję. Przygotuj komuś prawdziwe miejsce — tak, żeby sam je znalazł.” **Dlaczego dziecko chce wstać:** drugie miejsce na ławce jest widocznie puste, a rzecz wybrana na ekranie pojawi się tam dopiero po prawdziwym geście; „żeby sam znalazł” to niespodzianka. |
| `czesc_B.mlodsi` | „Przygotuj miejsce dla kogoś, kto dziś przyjdzie albo wróci: odsuń krzesło, połóż poduszkę, postaw kubek. Nic nie mów — niech sam znajdzie.” 10 min, solo; bez materiałów spoza domu. |
| `czesc_B.starsi` | „Przygotuj miejsce dla kogoś, kto dopiero przyjdzie, i zostaw jeden znak, że ktoś na niego czekał — ale bez kartki i bez podpisu. Nie mów, że to ty — niech sam zgadnie.” Bez dorosłego, bez widowni; zwrot akcji: niespodzianka, którą ktoś ma odkryć. |
| `czesc_B.minimum` | „Jedno odsunięte krzesło dla kogoś, kto dziś jeszcze wróci — albo dla siebie po powrocie ze świetlicy czy ze spaceru — i tak się liczy.” |

**miejsca** (to samo zadanie w innym kontekście; ★ = działa w bloku bez ogrodu, zwierzaka i pieniędzy):

| id | nazwa | opis |
|---|---|---|
| `dom` | W domu ★ | Dla kogoś, kto wraca z pracy albo ze szkoły: krzesło, poduszka, kubek przy jego miejscu. |
| `swietlica` | W świetlicy ★ | Dla kogoś, kto przyjdzie po lekcjach: wolne miejsce przy stole i coś, co lubi mieć pod ręką. |
| `klasa` | W klasie ★ | Dla kogoś, kto wraca od lekarza albo z sali: odsunięte krzesło, bez ruszania jego rzeczy. |
| `powrot` | Dla siebie po powrocie ★ | Zanim wyjdziesz do świetlicy albo na spacer, przygotuj własne miejsce na powrót: kapcie, kubek, krzesło — ty po powrocie to też gość. |

| pole | treść |
|---|---|
| `bezpieczenstwo` | Wprost: bez gorących napojów; bez wchodzenia do cudzego pokoju i bez ruszania cudzych rzeczy; nic do kupienia. Zdjęcie: przygotowane miejsce, bez ludzi. |
| `slad` | Wybór z trzech (1–3 obrazki: poduszka / kubek / krzesło): „Poduszka albo koc” · „Kubek albo coś do jedzenia” · „Coś innego”. 4–8 albo jedno zdanie: „Co czekało na tym miejscu?” Zdjęcie miejsca opcjonalne: „Samo miejsce. Bez ludzi.” Ślad nigdy nie pyta, czy gość się ucieszył. |
| `reakcja_po_sladzie` | Na ławce na pomoście pojawia się **rzecz wybrana w części A** (poduszka: zaokrąglony `BoxGeometry`; kubek: `CylinderGeometry`; koc: płaski `BoxGeometry` przewieszony przez oparcie — bez lampki, bo światło w świecie należy tylko do hybrydy MD). Kamera na pomost, narratorka mówi wiersz. Znak `lawka` gaśnie. |
| `reakcja_po_zauwazeniu` | Na ławce **siada królik** (w tekstach „królik”; `kroliczek.glb` to tylko nazwa pliku) — `kroliczek.glb` istnieje w `public/scena-3d/assets` (nieużywany przez kod); jako znak z `file: "kroliczek"`, `bezObrotu`, `absorb: false`, bez halo i pierścienia, bez animacji. Przysiada obok rzeczy, drugie miejsce zostaje wolne. Zero światła — dodatek po zauważeniu poza MD nigdy nie świeci. |
| `trwaly_obiekt` | Ławka z rzeczą na pomoście; po zauważeniu królik na ławce (zostaje). |
| `monety_w_tle` | Dwadzieścia pięć przy śladzie, w HUD. Zero za zauważenie. |
| `mentor.powiadomienie` | „Zobacz, co {przygotował\|przygotowała} {imie}. Na pomoście w Świecie Ewolucji ktoś ma już gdzie usiąść.” Pod spodem wybór dziecka i zdjęcie, jeśli jest. Przycisk „Zauważam”. |
| `mentor.pytanie` | „Dla kogo było to miejsce i co na nim czekało?” (działa, gdy nikt nie przyszedł i przy minimum „dla siebie po powrocie”) |

**kwestie** (tokeny `{m|ż}`; bez cyfr w głosie; limity: Wizkor karta ≤ 60 / głos ≤ 140, lisek ≤ 70, narratorka ≤ 80 na wiersz; kolumna `zn.` liczy token jako dłuższą formę):

| głos | moment | wariant | tekst | zn. |
|---|---|---|---|---|
| Wizkor karta | zlecenie (most) | oba | Na pomoście stoi ławka dla dwojga. Nikt na niej nie usiadł. | 59 |
| Wizkor głos | zlecenie (most) | 4–8 | Na pomoście stoi ławka dla dwojga, ale gościa nie wyczaruję. Przygotuj komuś prawdziwe miejsce — tak, żeby sam je znalazł. | 122 |
| Wizkor głos | zlecenie (most) | 1–3 | Na pomoście stoi ławka dla dwojga. Nikt na niej nie usiadł. Przygotuj komuś prawdziwe miejsce. | 94 |
| Wizkor karta | przypomnienie (zadanie czeka) | oba | Ławka na pomoście dalej pusta. Czyjeś miejsce — u ciebie. | 57 |
| Wizkor głos | przypomnienie (zadanie czeka) | oba | Na ławce nadal nikt nie usiadł. Miejsce dla kogoś przygotuj u siebie — tam, gdzie ktoś naprawdę przyjdzie. | 106 |
| lisek | zaproszenie (chmurka na pomoście) | oba | Ja siedzę z brzegu. ⏎ Zrobisz komuś miejsce, żeby sam je znalazł? | 62 |
| narratorka | powrót po śladzie (`{rzecz}` = poduszka / kubek / koc z części A) | oba | Na ławce na pomoście jest już {rzecz}. ⏎ Drugie miejsce jest wolne — dla kogoś. | 76 |
| narratorka | powrót po śladzie | 1–3 | Na ławce jest {rzecz}. ⏎ Dla gościa. | 33 |
| narratorka | po zauważeniu przez Mentora | oba | Na ławce siedzi królik. ⏎ Przyszedł, kiedy miejsce było gotowe. | 60 |
| Wizkor karta | po zauważeniu (podejście) | oba | Mentor to {zobaczył\|zobaczyła}. Na ławce ktoś usiadł. | 42 |

**haki_3d** (istniejące z `plik:linia`; brakujące z kosztem):

| hak | stan | gdzie / co dopisać | koszt |
|---|---|---|---|
| kotwica pomostu `schronienie-kotwica` | istnieje | `app.js:2684`; obiekty dodane do niej stoją na pomoście i skalują się z domkiem (`def.skala`) | — |
| `kroliczek.glb` | istnieje (plik) | `frontend/public/scena-3d/assets/kroliczek.glb`; kod sceny go nie wczytuje; znaki wczytują GLB po `file` (`mapa.json`: `wizard`, `karta`) | — |
| `schowajZnakZMapy` / `pokazZnakNaMapie` | istnieje | `hub/znakiMapy.js:119–146` — króliczek i znak `lawka` schowane do czasu, aż mają się pokazać | — |
| model ławki | do zbudowania | trzy–cztery `BoxGeometry` z `MAT_BUDOWY.deska` (`schronienie.js:43`) na kotwicy pomostu, przy barierce naprzeciw drabinki | niski |
| trzy rzeczy na ławkę | do zbudowania | poduszka, kubek, koc — bryły z materiałów `matKanciasty`; `ustawLawke({rzecz, krolik})` | niski |
| znak na wysokości pomostu | do zbudowania | znaki stoją na gruncie (`planeta.ustaw` z `height`); pomost jest na `poziom` 2,6 × skala 1,45 → `height` ok. 3,8 albo osadzenie znaku na kotwicy — sprawdzić zasięg dotknięcia liska na pomoście | średni |
| królik na ławce | do zbudowania (dane + osadzenie) | wpis w `mapa.json` `znaki` z `file: "kroliczek"`, skala i obrót do dobrania w edytorze; bez animacji (GLB może mieć klipy — nie uruchamiać) | średni |
| hak dzielony z `03` | uwaga | `obok` (`03` §7.4) proponuje „drugie miejsce do siedzenia na platformie” → hybryda ma ławkę; `obok` dostaje dwa kwiaty przy drabince (już zapisane tam jako wersja tymczasowa) | — |

**ryzyka:**

- Dom, do którego nikt dziś nie wraca — miejsca `swietlica`, `klasa` i `powrot` są pełnoprawne, nie gorsze.
- Ktoś zburzy przygotowane miejsce, zanim gość przyjdzie — ślad jest o tym, co zostawiono, nie o reakcji gościa.
- 4–8: „to obciach” — „niech sam zgadnie” robi z tego niespodziankę; nikt nie musi wiedzieć, że to zadanie.
- 1–3 chce od razu powiedzieć, że to ono — „nic nie mów” to zaproszenie do niespodzianki, nie warunek zaliczenia.
- Rzecz z części A nie pasuje do realnego gestu (wybrał koc, zostawił kubek) — świat i tak stawia to, co wybrano na ekranie; ślad mówi prawdę o realu.

**runda panelu:** `projektant-zadan`: zwrot akcji to „zanim przyjdzie” + „żeby sam znalazł” — bez tego „zrób komuś coś miłego” jest obowiązkiem; dubel z `tajny-pomocnik` rozdzielony (pomoc vs gościnność). `swieze-spojrzenie`: tryb odpowiadania na kogoś, kogo jeszcze nie ma; zamiana ról (dziecko jako gospodarz); miejsce „dla siebie po powrocie” to najdziwniejsze i najlepsze. `scena-3d`: ławka to cztery bryły na kotwicy pomostu, królik to plik `kroliczek.glb`, który już leży w `assets` — do sprawdzenia tylko wysokość znaku. `copywriter`: „Ławka dla gościa” zostaje; szept 4–8: „Bez podpisu.” Weto `psycholog`: bez pracy emocjonalnej, bez „czy się ucieszył”, gość może być samym dzieckiem po powrocie — przeszło. Weto `socjolog`: nie zakłada rodziny wracającej o osiemnastej; świetlica i klasa działają — przeszło.

| specjalista | werdykt (jedno zdanie) |
|---|---|
| `rodzic-1-3` | Poduszka na moim krześle, zanim wrócę — zrobi się samo, a ja mam ładny moment na wejściu; zero organizacji. |
| `rodzic-4-8` | „Niech sam zgadnie” zamienia gest w niespodziankę z zagadką; nikt nie musi wiedzieć, że to z apki — zrobi. |
| `pedagog` | 1–3: jedno polecenie (przygotuj miejsce) z trzema przykładami — wykonalne; 4–8: znak bez podpisu wymaga pomysłu, ale nie planu na jutro — w normie. |
| `psycholog` | Troska o miejsce, nie o cudzy nastrój; ślad o rzeczy; „dla siebie po powrocie” chroni dziecko, u którego nikt dziś nie wraca — zdrowe. |
| `socjolog` | Świetlica, klasa i „dla siebie po powrocie” nie są wersjami gorszymi; bez skryptu „dziewczynki dbają” — kubek i krzesło są dla obojga. |
| `scena-3d` | Ławka i trzy rzeczy to bryły na kotwicy pomostu; króliczek z `assets` jako znak — jedyna niewiadoma to zasięg dotknięcia znaku na wysokości pomostu. |
| `narrator-gama` | Wizkor nazywa brak (gościa nie wyczaruję); lisek „ja siedzę z brzegu” zaprasza, nie zleca; narratorka mówi o ławce i króliku — przeszło. |

---
### 6. `ramka-w-domku` — Ramka w domku (KR · zrób · tworzenie · sprawczosc)

Pomysł autora. Brak do wypełnienia, który widać: pusta ramka na barierce pomostu ze znacznikiem „tu czegoś brakuje”. Dziecko robi obraz w realu, a w ramce zawisa wybrany symbol — od razu, bez czekania. Zdjęcie rysunku trafia do ramki dopiero, gdy Mentor wybierze „Pokaż w domku”; wersja bez zdjęcia jest pełnoprawna, nie gorsza (założenie z §3 promptu, zachowane w całości).

| pole | treść |
|---|---|
| `id` | `ramka-w-domku` |
| `profil_pierwszy` | KR |
| `os` | `tworzenie` |
| `potrzeba` | `sprawczosc` |
| `dlaczego_to_dziala` | Kształt KR to brak do wypełnienia rękami, bez jednej dobrej odpowiedzi (`03` §6.1). Sprawczość: to, co powstanie na kartce, naprawdę zawiśnie w miejscu, które dziecko samo zbudowało, a wybór symbolu jest jego decyzją, nie oceną dorosłego. Ograniczenie w wariancie 4–8 (jedna rzecz z okna, jedna, której nie ma) zdejmuje presję „narysuj ładnie”. |
| `warunek_otwarcia` | Domek etap 1 stoi (ramka wisi na barierce pomostu). Dowolna pora. Gdy powstanie etap 2, ramka przenosi się na ścianę domku — ten sam obiekt i ten sam zapis (etap 2 nie istnieje w kodzie: `schronienie.js:308` `ETAPY = [etap1]`, `ETAPY_DOCELOWO = 3` w `:331`). |
| `czesc_A` | **Miejsce:** barierka pomostu (`schronienie.pos` [0.18, 1.65], `uklad.barierka` 0,5). **Mechanika:** po „Budujemy!” i postawieniu etapu 1 kamera `pokazMiejsce` na pomost; na barierce wisi **pusta ramka** ze znacznikiem braku (sprite z pierścieniem jak `_placIkona`, bez domku w środku — `ustawPlacBudowy` nie nadaje się, bo schodzi przy etapie > 0, `app.js:2897`). Dotknięcie znaku `ramka` → okno Wizkora → karta z trzema obrazkami „Co lisek ma widzieć z pomostu?”: **drzewo / woda / niebo** — wybór ustawia tło ramki (zielone / niebieskie / złote), nie ocenia. Przycisk „Idę rysować”. **Zdarzenie końca:** karta hybrydy „Czeka — u ciebie”. Czas: ≤ 90 s. |
| `most` | Mówi **Wizkor**. Karta: „Na pomoście wisi pusta ramka. Obrazu nie wyczaruję.” Głos: „Na pomoście zawisła ramka, a w niej nic. Ramkę powiesiłem, obrazu nie wyczaruję. Narysuj, co lisek ma widzieć z pomostu.” **Dlaczego dziecko chce wstać:** ramka jest widocznie pusta w miejscu, które właśnie zbudowało, i wie z góry, że to, co zrobi, tam zawiśnie (REAL-01 z `PIERWSZA_PRZYGODA_ROBOCZA.md`: „dziecko musi z góry wiedzieć, jaki efekt otrzyma”). |
| `czesc_B.mlodsi` | „Narysuj to, co lisek ma widzieć z pomostu na drzewie.” 10–15 min, solo; kartka i cokolwiek do rysowania (długopis wystarczy). Dorosły tylko wtedy, gdy dziecko chce pokazać. |
| `czesc_B.starsi` | „Zrób obraz do ramki z jednym warunkiem: ma być na nim jedna rzecz, którą widzisz z domu albo po drodze, i jedna, której na planecie nie ma.” Rysunek, wycinanka albo obraz ułożony z rzeczy na stole. Bez dorosłego, bez widowni; zwrot akcji: warunek, który dziecko samo sprawdzi. |
| `czesc_B.minimum` | „Jeden kształt na kartce — albo sam wybór symbolu w ramce — i tak się liczy.” |

**miejsca** (to samo zadanie w innym kontekście; ★ = działa w bloku bez ogrodu, zwierzaka i pieniędzy):

| id | nazwa | opis |
|---|---|---|
| `stol` | Przy stole ★ | Kartka z zeszytu i ołówek; nic więcej nie trzeba. |
| `swietlica` | W świetlicy ★ | Kartka i kredki ze świetlicy, na przerwie albo po lekcjach. |
| `kolano` | W autobusie albo w łóżku ★ | Zeszyt na kolanie i długopis. |
| `bez-kartki` | Bez kartki ★ | Ułóż obraz z trzech rzeczy na stole, zapamiętaj go i wybierz w ramce symbol, który do niego pasuje. |

| pole | treść |
|---|---|
| `bezpieczenstwo` | Wprost: nożyczki tylko do papieru i tylko, jeśli dziecko używa ich na co dzień; zdjęcie wyłącznie samej pracy — bez twarzy, bez okna, bez numeru domu, bez ludzi w tle (podpowiedź przy aparacie). Rysunek z ludźmi zostaje w domu; w ramce wtedy symbol. |
| `slad` | Domyślnie wybór jednego z sześciu **symboli** w ramce (obrazki: liść, gwiazda, słońce, fala, łapka, spirala — zestaw z REAL-01); 1–3 tylko to. 4–8 albo jedno zdanie „Co jest na obrazku?” (≤ 160 zn.) — wtedy symbol wybierany dodatkowo, bo w ramce musi coś zawisnąć. Zdjęcie rysunku opcjonalne: „Sam rysunek. Bez twarzy, bez okna, bez numeru domu.” Zdjęcie nie pokazuje się w świecie samo — dopiero po „Pokaż w domku”. |
| `reakcja_po_sladzie` | W ramce na barierce pojawia się **wybrany symbol** na tle z części A (`CanvasTexture` na płaszczyźnie ramki — wzorzec `_placIkona`, `app.js:2850`), znacznik braku gaśnie, kamera `pokazMiejsce` na pomost, narratorka mówi wiersz. Widać z polany. |
| `reakcja_po_zauwazeniu` | Obok zawisa **druga, mniejsza ramka z łapką liska** („lisek też coś powiesił”). Jeśli Mentor wybrał **„Pokaż w domku”** (przycisk widoczny tylko przy zdjęciu): w dużej ramce zdjęcie rysunku zamiast symbolu (miniatura ≤ 512 px, bez EXIF, prywatny magazyn — tor obrazu z `06`), symbol przechodzi do małej ramki. Bez zdjęcia: symbol zostaje w dużej — wersja równie dobra. |
| `trwaly_obiekt` | Ramka z symbolem (albo zdjęciem) na barierce pomostu; od etapu 2 na ścianie domku; mała ramka z łapką po zauważeniu. |
| `monety_w_tle` | Dwadzieścia pięć przy śladzie, w HUD. Zero za zauważenie i zero za „Pokaż w domku”. |
| `mentor.powiadomienie` | „Zobacz, co {narysował\|narysowała} {imie}. Na pomoście w Świecie Ewolucji wisi teraz {symbol}.” Pod spodem symbol, zdanie i zdjęcie, jeśli jest. Przyciski: „Zauważam”; przy zdjęciu dodatkowo „Pokaż w domku” (z dopiskiem: „Rysunek zawiśnie w ramce w świecie {imie}. Bez twarzy i bez okna.”). |
| `mentor.pytanie` | 4–8: „Co na tym obrazku jest z twojego okna albo z drogi, a czego nie ma nigdzie?” · 1–3: „Co lisek ma widzieć na tym obrazku?” · przy śladzie „sam symbol” (minimum, oba etapy): „Dlaczego akurat {symbol}?” |

**kwestie** (tokeny `{m|ż}`; bez cyfr w głosie; limity: Wizkor karta ≤ 60 / głos ≤ 140, lisek ≤ 70, narratorka ≤ 80 na wiersz; kolumna `zn.` liczy token jako dłuższą formę):

| głos | moment | wariant | tekst | zn. |
|---|---|---|---|---|
| Wizkor karta | zlecenie (most) | oba | Na pomoście wisi pusta ramka. Obrazu nie wyczaruję. | 51 |
| Wizkor głos | zlecenie (most) | 4–8 | Na pomoście zawisła ramka, a w niej nic. Ramkę powiesiłem, obrazu nie wyczaruję. Narysuj, co lisek ma widzieć z pomostu. | 120 |
| Wizkor głos | zlecenie (most) | 1–3 | Na pomoście wisi pusta ramka. Obrazu nie wyczaruję. Narysuj, co lisek ma widzieć z pomostu. | 91 |
| Wizkor karta | przypomnienie (zadanie czeka) | oba | Ramka dalej pusta. Kartka i kredka — u ciebie. | 46 |
| Wizkor głos | przypomnienie (zadanie czeka) | oba | W ramce na pomoście dalej nic nie ma. Obraz powstaje u ciebie, na kartce — tu tylko zawiśnie. | 93 |
| lisek | zaproszenie (chmurka przy ramce) | oba | Ja bym chciał tu widok z twojego okna. ⏎ Narysujesz? | 49 |
| narratorka | powrót po śladzie | oba | W ramce na pomoście wisi już obraz. ⏎ Lisek ogląda go, kiedy nikt nie patrzy. | 74 |
| narratorka | powrót po śladzie | 1–3 | W ramce jest obraz. ⏎ Twój. | 24 |
| narratorka | po zauważeniu przez Mentora | oba | Obok dużej ramki zawisła mała. ⏎ W niej łapka — lisek też coś powiesił. | 68 |
| narratorka | po „Pokaż w domku” (zdjęcie w ramce) | oba | W ramce wisi teraz twój rysunek. ⏎ Widać go z całej polany. | 56 |
| Wizkor karta | po zauważeniu (podejście) | oba | Mentor to {zobaczył\|zobaczyła}. Obok wisi druga ramka. | 43 |

**haki_3d** (istniejące z `plik:linia`; brakujące z kosztem):

| hak | stan | gdzie / co dopisać | koszt |
|---|---|---|---|
| kotwica pomostu, `ustawSchronienie` | istnieje | `app.js:2649–2700`, `schronienie-kotwica` `app.js:2684`; barierka z `uklad.barierka` | — |
| sprite z `CanvasTexture` (wzorzec) | istnieje | `_placIkona` `app.js:2850–2891`, `_tloWskaznika`; `CanvasTexture` importowany `app.js:16` | — |
| `pokazMiejsce`, znaki, `schowajZnakZMapy` | istnieje | `app.js:2426`; `hub/znakiMapy.js:119–146` | — |
| model ramki + płaszczyzna z symbolem | do zbudowania | dwie–cztery `BoxGeometry` (rama z `MAT_BUDOWY.deskaCiemna`) + `PlaneGeometry` z `CanvasTexture`; symbole rysowane na canvasie (sześć prostych kształtów) albo sześć PNG w `assets` | niski |
| znacznik braku poza placem budowy | do zbudowania | sprite pierścienia bez ikony domku, osobny od `ustawPlacBudowy` (`app.js:2893`, schodzi przy `_etapSchronienia > 0`); używany też przez pozostałe hybrydy jako „tu czegoś brakuje” | niski |
| `ustawRamke({symbol, tlo, obraz?, mala?})` + zapis | do zbudowania | metoda publiczna w `index.js`; stan w zapisie gracza; obraz jako adres miniatury z prywatnego magazynu | niski (symbol) / wysoki (obraz) |
| „Pokaż w domku” po stronie Mentora | do zbudowania | `MentorClassDetail.jsx:845–893` ma dziś podgląd `proof_media_url` i przyciski approve/reject → zamienić na „Zauważam” + warunkowe „Pokaż w domku”; backend: flaga na misji, bez punktów | średni |
| tor obrazu | brak (wspólne, `06`) | miniatura w przeglądarce (canvas → JPEG ≤ 512 px, bez EXIF), magazyn prywatny z podpisanym adresem i retencją, zgoda opiekuna, uwierzytelnienie (`uploads.js` dziś `access: "public"`, `ZadaniePanel.jsx:133`) | wysoki |
| przeniesienie ramki na ścianę domku (etap 2) | do zbudowania (później) | gdy powstanie `etap2` w `schronienie.js`, ta sama grupa dostaje nową kotwicę — bez zmiany zapisu | niski (po etapie 2) |

**ryzyka:**

- „Nie umiem rysować” — wariant 4–8 (obraz z rzeczy) i minimum (sam symbol) są pełnoprawne; nikt nie ocenia rysunku.
- Dziecko chce zobaczyć swoje zdjęcie w ramce od razu, a Mentor nie zajrzał — symbol wisi natychmiast; zdjęcie jest dodatkiem, o którym karta mówi z góry.
- Rysunek z twarzą rodziny wysłany jako zdjęcie — podpowiedź przy aparacie, a „Pokaż w domku” to decyzja Mentora, nie automat.
- 1–3 wieczorem nie ma kredek — długopis wystarczy, miejsca to mówią.
- Symbol „łapka” w dużej ramce i łapka liska w małej wyglądają tak samo — mała ramka ma inny kolor tła (rudy) i mniejszy rozmiar.

**runda panelu:** `projektant-zadan`: zwrot akcji to warunek (rzecz z okna + rzecz, której nie ma) w 4–8 i „to zawiśnie” w 1–3 — bez tego „narysuj coś” to lekcja plastyki. `swieze-spojrzenie`: ograniczenie w stylu Oulipo (jedna rzecz z, jedna spoza) i miejsce „bez kartki” (obraz z trzech rzeczy) — najmocniej odstaje od bazy. `scena-3d`: ramka to bryły na kotwicy pomostu i canvas, jak `_placIkona`; zdjęcie w ramce to nie scena, tylko tor obrazu — i on jest drogi. `copywriter`: tytuł autora zostaje; szept 4–8: „Jedna z okna.” Weto `psycholog`: brak oceny, symbol równie dobry jak zdjęcie — przeszło. Weto `socjolog`: długopis i zeszyt na kolanie, bez kredek i drukarki — przeszło.

| specjalista | werdykt (jedno zdanie) |
|---|---|
| `rodzic-1-3` | Kartka i długopis przy stole, dziecko robi to samo, a ja klikam „Zauważam” w autobusie — zrobi się; zdjęcie robię tylko, jeśli chcę. |
| `rodzic-4-8` | Warunek „jedna rzecz, której nie ma na planecie” daje mu pomysł zamiast wstydu za rysunek; zdjęcie samej kartki nie jest raportem — zrobi. |
| `pedagog` | 1–3: jedno polecenie i widoczny koniec (rysunek); 4–8: warunek dwuczęściowy to prosta strategia — w normie; bez pisania i bez „wniosków”. |
| `psycholog` | Sprawczość realna (to zawiśnie), wybór symbolu należy do dziecka, a zdjęcie nie jest lepszą wersją — zdrowe. |
| `socjolog` | Zeszyt na kolanie w autobusie i wersja bez kartki — działa bez kredek, drukarki i własnego biurka; bez skryptu płci. |
| `scena-3d` | Symbol w ramce to canvas na płaszczyźnie przy barierce — tanio; zdjęcie w ramce to osobny, kosztowny tor poza sceną i tak ma być opisane. |
| `narrator-gama` | Wizkor nazywa brak i to, czego nie wyczaruje; lisek prosi o widok z okna, nie zleca; narratorka mówi o ramce i obrazie, nie o talencie — przeszło. |

---
## 3. Odrzucone pomysły

| pomysł | skąd | kto odrzucił | powód |
|---|---|---|---|
| **Dach dla mieszkańca** — układanie dwóch kawałków dachu, mieszkaniec trzyma poduszkę | `PIERWSZA_PRZYGODA_ROBOCZA.md` PLANETA-01 | `scena-3d`, `projektant-zadan` | mieszkańca ani jego domku nie ma w scenie (`hut2` wyłączony, `mapa.json` `budynkiWylaczone`); część A byłaby dłuższa i ciekawsza od części B — odwrotnie niż wymaga prompt; koszt wysoki (model, animacja, interakcja układania). |
| **Znak naszego domku na drzwiach** — symbol i kolor na drzwiach | tamże, REAL-01 | `scena-3d` | drzwi są w etapie 2, którego nie ma (`schronienie.js:308`); pomysł wchłonięty przez `ramka-w-domku` (ten sam zestaw sześciu symboli, ta sama zasada „wiesz z góry, co dostaniesz”). |
| **Kropla dla Fasoli** — nabierz wodę w oczku, podlej Fasolę; w realu podlej roślinę | `mapa-w2.json` `fasola`, `PLAN_DZIALANIA.md` §6 | `projektant-zadan`, `socjolog` | na `/swiat` nie ma Fasoli (`mapa.json` bez klucza `fasola`; `_fasolaTik` wraca przy braku, `app.js:3068`), nie ma `ustawFasole(n)` ani zapisu; Fasola ma rosnąć od działania w realu, nie od kliknięcia — tu klik byłby częścią A równą B; „podlej roślinę” zakłada roślinę w domu. Zostaje jako mechanika W2 do spięcia później (notatki D). |
| **Lisek nie może zasnąć** — policz oddechy, aż zaśniesz | tabela z promptu (MD, wersja pierwotna) | `psycholog` (weto), `rodzic-1-3` | temat snu wykluczony regułą well-being, obietnica efektu („i zaśniesz”); `03` §9 odrzuciło to samo. |
| **Most z dwóch stron** — znajdź rzecz, którą dwie osoby widzą inaczej, powtórz każdej, co powiedziała druga | `PLAN_DZIALANIA.md` §5 (MD `dwie-strony-jednej-rzeczy`) | `psycholog` (weto) | dziecko jako mediator; Spokojna Głowa to skupienie, nie godzenie innych (kanon `SWIAT_I_POSTACIE.md`). |
| **Pierwszy głos** — zaproponuj coś, zanim zrobi to ktoś inny | `PLAN_DZIALANIA.md` §5 (LD `pierwszy-glos`) | `rodzic-4-8`, `psycholog` | wyzwalacz spoza kontroli dziecka (musi być sytuacja z ludźmi), widownia; jako pierwsza przygoda za trudne; brak reakcji świata związanej z treścią. |
| **Rzecz starsza od ciebie** — znajdź w domu rzecz starszą od siebie i dowiedz się, skąd | `PLAN_DZIALANIA.md` §5 (DT `trop-w-domu`) | `socjolog` (weto) | zakłada dom z pamiątkami i dorosłego, który zna historię rzeczy; dziecko w pieczy zastępczej albo po przeprowadzce odpada; „Kompas Cieni” z części A nie istnieje. |
| **Żaba na oczku** po zauważeniu przez Mentora | tabela z promptu (DT) | `scena-3d` | model + animacja + osadzenie na liściu: koszt wysoki; kwiat lilii jest w treści (to, co pływa) i kosztuje kilkanaście linijek. |
| **Zdjęcie od razu w ramce** po śladzie, bez decyzji Mentora | warianty przy karcie KR | `strateg-produktu`, `psycholog` | tor obrazu jest dziś publiczny i bez retencji (`uploads.js`, `ZadaniePanel.jsx:133`); zdjęcie w świecie bez dorosłego = zdjęcie twarzy w świecie; założenie autora: tylko po „Pokaż w domku”. |
| **Kamienie po ciemku na podwórku** z zawiązanymi oczami | warianty przy karcie LD | `rodzic-1-3`, `psycholog` (weto bezpieczeństwa) | wysokość krawężnika, ruch, brak ściany do ręki; zostaje wersja z kredą tylko z dorosłym i z otwartymi oczami albo za rękę. |
| **Gniazdo darów przy oczku** — przynieś z domu drobiazg, który ląduje w gnieździe | `PLAN_DZIALANIA.md` §6 (B) | `swieze-spojrzenie`, `psycholog` | „przynieś rzecz” to zbieranie; dar bez adresata nie ma potrzeby; model gniazda nie istnieje; ślad = zdjęcie rzeczy zachęca do przynoszenia coraz lepszych rzeczy. |
| **Obudź deszcz** — chmura idzie za liskiem, deszcz na terminatorze | `PIERWSZA_MINUTA.md` §6 | `scena-3d`, `projektant-zadan` | mechanika mgły, chmury i deszczu: koszt średni–wysoki; nie ma części B, którą dałoby się z tym uczciwie połączyć bez „podlej roślinę”. |
| **Lampka za dźwięk** — MD: słuchaj, aż zniknie jeden dźwięk | tabela z promptu (MD, wariant a) | `projektant-zadan` | to `ostatni-dzwiek` z `03` §7.11 — ten sam kształt, ten sam koniec; hybryda MD dostała światło, żeby reakcja świata (lampka) była o tym, na co dziecko patrzyło. |


## 4. Kolejność wdrożenia i haki do dopisania

Kryterium: ile nowego kodu w scenie na jedno zadanie **poza** częścią wspólną. Część wspólna (raz, przed pierwszą hybrydą):

| # | element wspólny | co to jest | koszt |
|---|---|---|---|
| W1 | **karta hybrydy w Zadaniach** | nowy typ wpisu obok zadań Koła: `id`, `profil_pierwszy`, `os`, `potrzeba`, `ksztalt`, `rodzina`, `czescA` (pytanie + 3 obrazki + zapis wyboru), `most` (karta/głos/warianty), `czescB` (`mlodsi`/`starsi`/`minimum`), `miejsca`, `bezpieczenstwo`, `slad` (3 opcje + zdanie + `zdjecie: true/false`), `reakcja` (nazwa metody sceny + argumenty), `reakcjaMentor`, `mentor` (`powiadomienie`, `pytanie`), `kwestie`; statusy (rozstrzygnięcie e recenzji, obowiązuje też `01` R9 i `02` §2.5): „Do zrobienia” (nie wzięte) → „Czeka — u ciebie” (wzięte) → „Ślad zostawiony” (świat już zareagował; podtytuł „Mentor już to widzi” tylko, gdy Mentor naprawdę istnieje) → „Mentor {zobaczył\|zobaczyła}”; klucze `doZrobienia / czeka / slad / zauwazone`; „Zrobione” tylko jako nagłówek historii; nagłówek dowodu „Pokaż, co {zrobiłeś\|zrobiłaś}”, przycisk „Zostaw ślad”; dopisek „Mentor to zobaczy” tylko przy prawdziwym, niedemowym Mentorze (bez niego żaden tekst nie obiecuje dorosłego). Wzorzec: `wariant/stan.js` (fazy `trop → przygotowanie → zaproszenie → poza → slad → zauwazone`) i `wariant/tresci.js` (`slad[]`, `rozmowa`). | średni |
| W2 | **ślad z trzech opcji** | w `ZadaniePanel.jsx` zamiast pola 600 znaków (`:329`): trzy przyciski (obrazki dla 1–3 z `etapSzkolny()`), pole „jedno zdanie” ≤ 160 zn. dla 4–8, przycisk zdjęcia tylko, gdy `slad.zdjecie`, z podpowiedzią z karty; `odmien` na wszystkich tekstach (dziś brak — `tmp/tresci-notatki-B.md`). | niski |
| W3 | **kanał ślad → scena** | po zapisie śladu React woła metodę sceny z `reakcja` (nowe metody publiczne w `index.js`: `ulozKamienie`, `ustawLampke`, `pokazUkryty`, `ustawOczko`, `ustawLawke`, `ustawRamke`) i `pokazMiejsce`; narratorka mówi wiersz przez `mowaPostaci`; toast tytuł ≤ 28 zn. Każde nowe `emit` w `app.js` dopisane do `ZDARZENIA` (`index.js:27–33`; `kino` z `app.js:3171` nadal tam nie ma). | średni |
| W4 | **stan świata poza `localStorage`** | jeden obiekt `swiat` w zapisie gracza (backend `players`, jak `lifetime_scores`): `kamienie: 0–6`, `lampka: null\|"barierka"\|…`, `swietliki: bool`, `kladka: null\|"plaska"\|…`, `kladkaPorecz: bool`, `oczko: {przejrzyste, lilie, kwiat}`, `lawka: {rzecz, kroliczek}`, `ramka: {symbol, tlo, obraz, mala}`; odtwarzany po `gotowa` jak `oznaczZuzyte`/`oznaczDostarczone` (`Swiat.jsx:1981`). Do czasu backendu: `localStorage` z tym samym kształtem. | średni |
| W5 | **Mentor: „Zauważam”** | `mentor.js:94–160`: nowy status `noticed` bez punktów zamiast `approve/reject`; `MentorClassDetail.jsx:845–893`: jeden przycisk, pytanie do rozmowy z karty, powiadomienie „Zobacz, co {zrobił\|zrobiła}…”; po stronie dziecka `reakcjaMentor` przy następnym wejściu. Demo bez Mentora: brak udawanego zauważenia. | średni |
| W6 | **znacznik braku** | sprite pierścienia bez ikony domku (wzorzec `_placIkona`, `app.js:2850`), niezależny od `ustawPlacBudowy`; jeden dla wszystkich hybryd. | niski |

**Mapowanie pól karty na model danych z `03`** (rozstrzygnięcie f recenzji: jeden schemat `etap` + `warianty["1-3"|"4-8"]` dla zadań Koła i hybryd, żeby `ZadaniePanel` znał jeden model):

| pole w karcie `05` | pole w `zadania-wizkora` v2 (`03` §7) | uwaga |
|---|---|---|
| `czesc_B.mlodsi` | `cel` + `jak` bazowe, `etap: "oba"` | tekst bazowy = wersja 1–3 (krótsza, jeden czasownik); lektor czyta `jak` |
| `czesc_B.starsi` | `warianty["4-8"].cel` (+ `.jak`, `.przyklad`, gdy się różnią) | nadpisuje pola bazowe dla 4–8 |
| `czesc_B.minimum` | `minimum` | bez zmian |
| `miejsca` | `miejsca[]` (`id`, `emoji`, `nazwa`, `opis`); miejsce tylko dla starszych → `warianty["4-8"].miejsca` albo `etap` na miejscu | `klatka` w MD jest tylko 4–8 |
| `mentor.pytanie` | `rozmowa`; wariant 1–3 → `warianty["1-3"].rozmowa`; wariant „sam symbol” (KR) → `rozmowa_minimum` (nowe, opcjonalne) | pytanie nie zakłada wyniku |
| `mentor.powiadomienie` | `mentor_powiadomienie` (nowe pole, także w `03`) | wzorzec „Zobacz, co {zrobił\|zrobiła} {imie}. …” |
| `slad` | `slad: { opcje: [3], obrazki: [3], zdanie: bool, zdjecie: bool, podpowiedz }` | `dowod` z `03` zostaje jako tekst nagłówka „Pokaż, co {zrobiłeś\|zrobiłaś}” |
| `czesc_A`, `most`, `reakcja_po_sladzie`, `reakcja_po_zauwazeniu`, `haki_3d` | pola tylko hybrydy: `czescA`, `most`, `reakcja`, `reakcjaMentor` | zadania Koła mają `reakcja_swiata` (`03`) = `reakcja` |
| `kwestie[]` | `kwestie[]` z `glos`, `moment`, `wariant ∈ {oba, "1-3", "4-8"}`, `tekst`, `tekstEkranu` | jak w `05`; `03` dopisuje zdania Wizkora tym samym schematem |
| `rodzina` | `rodzina` (w `03` i w hybrydach) | kolejka pomija resztę rodziny po jednym wykonaniu |

**Kładka — rozstrzygnięcie d:** `kladka-nad-oczkiem` (`05`) jest pierwsza i ma most; `kladka-z-kartki` (`03` §7.5) zostaje w puli z `rodzina: "kladka"` i reakcją „kwiat przy pieńku po ściętym drzewie” (a gdy pieńka nie ma — kwiat przy drabince); `papierowy-most` (`frontend/src/wariant/tresci.js:26`) do wycofania przy scaleniu W1/W2; **jedno źródło tekstu części B** — `03` §7.5 czyta `czesc_B` z tej karty, nie kopiuje. To samo dla rodziny „okno” (`02` §3.1 „brak zadania”, MD, porady DT-D11-S3 / ST-D17-S3): `rodzina: "okno"`.

Kolejność zadań (każde = część wspólna + to, co niżej):

| kolejność | zadanie | do dopisania w scenie (poza W1–W6) | nowe modele / pliki | koszt |
|---|---|---|---|---|
| 1 | `kamienie-kroki` (LD) | pierwszy kamień pod drabinką; `ulozKamienie(n)` z pozycjami z `mapa.json` (`kamyczki`, `_osadz`); szósty kamień + `kwiaty.posadz` po zauważeniu | brak | **niski** |
| 2 | `swiatlo-w-oknie` (MD) | `ustawLampke(miejsce)` — `latarnia()` w skali 0,45 na kotwicy pomostu; trzy wpisy świetlików w `mapa.json` (`pora: "noc"`, `lightBase: 0`) schowane do zauważenia; wariant `kwestiaZachodu` (`kwestieWizkora.js:100`) | brak (dane) | **niski** |
| 3 | `kladka-nad-oczkiem` (ST) | `pokazUkryty("most")` (referencja z `swiat.js:1838`), parametr `deski` i `porecz` w `most()`, przeniesienie `most.pos` nad przewężenie oczka wschodniego + sprawdzenie `onBridge` i wysokości tafli | brak (dane + parametr) | **niski** |
| 4 | `co-jest-na-dnie` (DT) | znak `dno-oczka` (`prog`) w `mapa.json`; `ustawOczko({przejrzyste, lilie, kwiat})`: `opacity` tafli, kamyk pod taflą, trzy dyski, kwiat na dysku | brak (geometria proceduralna) | **niski–średni** |
| 5 | `lawka-dla-goscia` (EM) | model ławki + trzy rzeczy na kotwicy pomostu; znak `lawka` na wysokości pomostu (zasięg do sprawdzenia); króliczek jako znak `file: "kroliczek"` (skala, obrót, bez animacji) | ławka (bryły), `kroliczek.glb` istnieje | **średni** |
| 6 | `ramka-w-domku` (KR) | model ramki + `PlaneGeometry` z `CanvasTexture`; sześć symboli (canvas albo PNG); `ustawRamke({symbol, tlo, obraz, mala})`; „Pokaż w domku” w panelu Mentora; tor obrazu (W7, osobno) | ramka (bryły), 6 symboli; **tor obrazu = W7 (wysoki)** | **średni**, z obrazem **wysoki** |

W7 (tylko dla „Pokaż w domku”, nie blokuje wersji z symbolem): miniatura w przeglądarce (canvas → JPEG ≤ 512 px, bez EXIF), prywatny magazyn z podpisanym adresem i retencją, zgoda opiekuna, uwierzytelnienie wgrywania i odczytu, usuwanie — opis w `06` (notatki B i D).

Rekomendacja: wdrożyć **1 + W1–W6** jako pierwszy przyrost (LD jest najtańsze i najlepiej testuje cały kanał), potem 2 i 3 tego samego tygodnia (dane + małe metody), 4 po sprawdzeniu czytelności tafli w przeglądarce, 5 i 6 po pierwszym teście z dziećmi (oba dokładają nowe bryły na pomoście, a jeszcze nie wiadomo, czy dziecko w ogóle wchodzi na pomost). Przed **każdą** przebudową sceny: `WERSJA_SCENY` w `Scena3D.jsx` w górę (`.claude/agents/scena-3d.md`).

## 5. Pierwsza sesja — jak hybryda wchodzi w dzisiejszy łańcuch

**Dzisiejszy łańcuch** (`hub/etapyMisji.js`): onboarding → gwiazdki (dziesięć, `zadanieGwiazdek`) → `schronienie:zlecenie` → `schronienie:zbieranie` (ścięcie, rozbicie, noszenie — `surowiec:*`, `Swiat.jsx:1907–1953`) → `schronienie:komplet` → **„Budujemy!” = domek etap 1** (`postawEtap`, `zadanieDrewna.js:263`; `ustawSchronienie(1, true)`, `Swiat.jsx:577`) → misje gier (`Gra na Pamięć` → `Lot Liska` → `Bieg Liska`, każda z kawałkami obrazka) → dopiero po trzech grach `real:kolo` (`etapyMisji.js:255–293`). Sesję odmierza słońce: zachód w 8 min 31 s, noc 11 min 30 s, koniec 15 min (`doba.js:235`, `:585`; `02` §3).

**Zmiana:** między `schronienie:komplet` a `<pierwsza gra>:brak` wchodzą cztery nowe momenty osi:

| moment osi | stan | co widzi dziecko | kto mówi |
|---|---|---|---|
| `hybryda:trop` | etap 1 właśnie stanął | kamera po animacji stawiania pomostu zostaje na pomoście; pojawia się obiekt części A (ramka / ławka / pierwszy kamień / znacznik lampki) albo kamera jedzie do oczka (DT, ST) — `pokazMiejsce`; znacznik braku (W6) | Wizkor: kwestia „Budujemy!” kończy się jednym zdaniem z tropem (np. „A na barierce coś już wisi. Spójrz.”), potem kwestia zlecenia z karty (most) |
| `hybryda:czeka` | dziecko wybrało w części A i nacisnęło przycisk mostu | karta w Zadaniach „Czeka — u ciebie”; Wizkor przy podejściu mówi wariant „przypomnienie”; **żadna gra nie jest zlecana**, Koło nie losuje | Wizkor (przypomnienie), lisek (chmurka zaproszenia raz na sesję) |
| `hybryda:slad` | dziecko zostawiło ślad | reakcja świata od razu (W3), narratorka, kamera na miejsce; karta „Ślad zostawiony”; **od tej chwili Wizkor może zlecić pierwszą grę** (tej samej sesji, jeśli jest dzień) | narratorka, potem Wizkor przy podejściu (zwykła kwestia stanu → gra) |
| `hybryda:zauwazone` | Mentor nacisnął „Zauważam” | przy następnym wejściu narratorka na wejściu (wariant „Mentor zobaczył” z `02` §3.4), mały dodatek w świecie; karta „Mentor {zobaczył\|zobaczyła}” | narratorka, Wizkor („Mentor to {zobaczył\|zobaczyła}…”) |

**Zasada „jedno zadanie na dany moment”** trzyma się tak: dopóki hybryda jest w `hybryda:czeka`, oś gier stoi (`misja: -1`, jak dziś na etapach schronienia — `etapyMisji.js:160–197`), a `real:kolo` nie istnieje aż do trzech gier, jak dotąd. Wyjątek, żeby hybryda nie zamykała gry na tydzień: jeśli dziecko wraca **następnego dnia** (`dobaDzis`, jak w `czyMoznaRozbudowac`, `zadanieDrewna.js:290`) bez śladu, Wizkor mówi wariant „przypomnienie” i **jednocześnie** zleca pierwszą grę — hybryda zostaje w Zadaniach jako jedyne zadanie w realu, a gra jest warstwą ekranową, nie drugim zadaniem (`OPIS_PROJEKTU.md`: minigry to warstwa ekranowa). Koło nie losuje nowego zadania w realu, dopóki hybryda czeka.

**Czas w pierwszej sesji** (15 min, zachód 8:31): wejście i gwiazdki ok. 1–5 min (rozrzut wg `02` §2.3), drewno + głaz + noszenie + „Budujemy!” ok. 3–4 min, część A hybrydy ≤ 2 min → most około 8–10 min, czyli **w okolicach zachodu**. To celowe: kwestia zachodu (`02` §3.1, wariant „zadanie w realu czeka”) nazywa tytuł hybrydy, noc nie zleca nic, a podsumowanie dnia (`02` §3.3) pokazuje ją w ramce braku. Dla MD most **jest** kwestią zachodu (karta 2). Jeśli etap 1 nie stanie przed końcem sesji (dziecko wolno chodzi, grało w Grę na Pamięć z karty na polanie), hybryda otwiera się następnego dnia zaraz po „Budujemy!” — nic nie jest tracone, nic nie przyspiesza.

**Wybór hybrydy:** `typStartowy()` (`hub/profilStartowy.js:36`) → hybryda z `profil_pierwszy` równym profilowi; jeśli jej `rodzina` jest zużyta albo zadanie było już zrobione, pierwsza z pozostałych w kolejności z tabeli zbiorczej. Drugą hybrydę (inny profil) dziecko dostaje najwcześniej po tygodniu, jako „dzikie pole” Koła (`03` §6.2 pkt 3) — sześć hybryd to zapas na sześć tygodni, nie na sześć dni.

**Etapy 2–3 domku** nie są bramkowane hybrydą: kod otwiera je nowym dniem i nowym materiałem (`czyMoznaRozbudowac`). Rekomendacja dla `06`: dodać trzeci warunek — co najmniej jeden ślad z zadania w realu albo hybrydy od ostatniego etapu („domek rośnie, bo coś wydarzyło się poza ekranem”) — bez tego etap 2 byłby drugą rundą rąbania. Ramka KR nie zależy od tej decyzji (wisi na barierce od etapu 1).

**Co się nie zmienia:** gwiazdki, materiał, plac budowy, „Budujemy!”, trzy gry i kolejność gier, Koło po grach. Zmienia się tylko to, co dzieje się w minucie po postawieniu pomostu — i to, że pierwsze zadanie w realu nie przychodzi z Koła po trzech grach, tylko ze świata po pierwszej rzeczy, którą dziecko zbudowało.

## 6. Werdykt stratega (`strateg-produktu`, raz, zbiorczo)

**Czyj problem znika.** Rodzica drugoklasisty we wtorek o osiemnastej: dziecko odkłada tablet samo, bo chce sprawdzić, czy łyżka utonie, a rodzic nie musiał niczego wymyślać ani pilnować — dostaje jedno powiadomienie „Zobacz, co sprawdziła Zosia” i jedno pytanie do kolacji. Nauczyciela świetlicy: sześć gotowych aktywności, które da się zrobić przy stole świetlicowym bez materiałów, i widok śladów bez zeszytu.

**Kto płaci.** B2C: rodzic, w abonamencie — hybrydy są tym, co odróżnia EwolucJĘ od aplikacji „zbierz i kliknij”, więc to argument na stronę z ceną, nie dodatek. B2B: szkoła/świetlica za panel Mentora — pod warunkiem, że „Zauważam” zajmuje piętnaście sekund (pytanie do rozmowy jest gotowe) i nie wymaga oglądania zdjęć (MD nie ma zdjęcia, reszta ma je opcjonalnie).

**Co to zabije.** (1) Tor obrazu: publiczny magazyn bez retencji i EXIF z GPS (`uploads.js`, `ZadaniePanel.jsx:133`) to ryzyko prawne przy danych małoletnich — dlatego domyślny ślad to wybór, a zdjęcie w ramce czeka na W7; nie wdrażać KR z obrazem przed W7. (2) Brak Mentora: w B2C połowa rodziców nie kliknie — dlatego świat reaguje po śladzie, a zauważenie tylko dokłada; pętla nie jest ślepa. (3) Nowość działa raz: sześć różnych reakcji wystarcza na sześć tygodni; potem potrzebne są kolejne obiekty (etap 2 domku, druga polana z `ROZWOJ_GRY.md` §6) — bez nich hybrydy staną się kolejnym „zbierz”. Koszt jednostkowy: zero wywołań AI i TTS poza nagraniem kwestii raz (kwestie są danymi), więc skaluje się bez opłat na dziecko.

**Najtańszy test na przyszły tydzień.** Bez kodu sceny: pięcioro dzieci (troje 1–3, dwoje 4–8), karta LD `kamienie-kroki` wydrukowana z tej tabeli, ślad zbierany słowem, a „reakcja świata” ustawiana ręcznie z pulpitu reżyserki (`DevRezyserka.jsx`, `markers[].mapa`) na następne wejście. Mierzyć jedno: **czy dziecko wróciło opowiedzieć**, zanim zobaczyło kamienie — bo to jest moment, który sprzedaje cały koncept (`OPIS_PROJEKTU.md`, „Pierwsze minuty gry”, pkt 8).

Werdykt: **wdrażać w kolejności z sekcji 4, KR bez obrazu do czasu W7, mierzyć powroty po śladzie, nie czas w aplikacji.**

## 7. Uzgodnienie z kopią roboczą (17.09, po południu)

**Baza kart to HEAD `596d4aa`** — wszystkie `plik:linia` w sekcjach 2–5 liczą się w tym stanie. W czasie pisania druga sesja zacommitowała pięć zmian (`9b1eee1` → `da86ca2`: okna bez sierot; kłody zlatują w stos; kamera pokazuje gwiazdkę i „świat prowadzi dalej”; **domek za trzy stosy drewna, bez kamienia**; ładunek większy + ślad po ziemi do placu). Sprawdzone `git diff 596d4aa da86ca2` (15 plików, +899/−229). Reszta niezacommitowanych plików (`tts.js`, `ttsService.js`, `ttsPlayer.js`, dane porad i zadań, `Onboarding.jsx`, `misjeGier.js`) nie dotyka sceny ani haków hybryd.

### 7.1 Co doszło w scenie i mapie

| zmiana | gdzie (stan `da86ca2`) | skutek dla hybryd |
|---|---|---|
| **Etap 1 domku = trzy stosy drewna z DOWOLNYCH drzew; kamień nie jest materiałem** | `hub/zadanieDrewna.js:77–78` (`CEL_DRZEWKA = 3`, `CEL_STOSOW = 3`), `mapa.json` `glazy[0]` `doRozbicia: false` (opis: „kamień nie jest już materiałem”), `sucheDrzewka: []` (pień przeniesiony do `sucheDrzewkaWylaczone`), `etapyMisji.js` opisy etapów schronienia | zmienia **LD** (7.2) i opis łańcucha w §5; `schronienie.js:334` `KOSZT_ETAPU` nadal mówi `klody: 3, kamyki: 6` — rozjazd z `zadanieDrewna.js` do odnotowania w `06` |
| **`pokazZnakWKadrze(znak, opcje)`** — najazd kamery na konkretny znak (to jest ta +1 linia w `index.js`, nie nowe zdarzenie; `ZDARZENIA` bez zmian, `kino` nadal nie wpisane) | `app.js:2483`, `index.js` obiekt API; użyte w `Swiat.jsx:1443` przy zleceniu gwiazdek | **hak istnieje** dla DT (`dno-oczka`), ST (`kladka`), EM (`lawka`), KR (`ramka`) — zamiast `pokazMiejsce([x, z])` z ręcznymi współrzędnymi; koszt tych czterech kart nie rośnie, precyzja rośnie |
| **Ślad po ziemi do placu** — kropki na gruncie od liska do celu, po parametrach mapy, z wysokością terenu, fala w stronę celu | `app.js:2575` `_sladDoPlacu`, `_sladTik` | gotowy wzorzec dla **LD**: kamienie-kroki układają się tą samą metodą (lista punktów na parametrach mapy → `kamyczki` zamiast kropek) — koszt LD dalej niski, mniej nowego kodu niż zakładała karta |
| Skład na placu: trzy stosy wachlarzem wg numeru dostawy; kłody zlatują z góry i układają się w stos | `app.js` `_polozNaPlacu(rodzaj, skala, nr)`, `_zacznijOpadKlod`, `_opadKlodKlatka`; `natura.js` `stosDrewna(s, { szczapy })` | bez wpływu; wzorzec „animacja tylko raz, przy `prefers-reduced-motion` od razu” obowiązuje też reakcje po śladzie |
| **`PasekKolejnejMisji`** — „Wizkor szykuje kolejne zadanie” między rozliczeniem misji a zleceniem następnej | `hub/PasekKolejnejMisji.jsx`, `Swiat.jsx:1168–1186` (`zapowiedzKolejnejMisji`, `naKoniecPaskaMisji`), `styles/pasek-misji.css` | moment `hybryda:trop` z §5 ma wchodzić **przez ten sam pasek** (po „Budujemy!”, przed kwestią zlecenia hybrydy), a nie osobnym oknem; uwaga: zapowiedź w `Swiat.jsx:1172` mówi „wędrowcze” (zakazane w `01`) — sprawa dla `02`, nie dla hybryd |
| `mapa.json`: **pięć nowych głazów** (dekoracja, bez `doRozbicia`), przesunięte drzewa i typ `lisciaste`, `respawn` gwiazdek/puzzli, `schronienie.uklad` w mapie | `mapa.json` `glazy[]`: [10.08, 17.05], [−20.4, 12.2], [19.31, −3.18], [−9.37, −19.55], [3.82, −24.46] | **kolizja do sprawdzenia:** głaz [19.31, −3.18] leży przy wschodnim brzegu oczka wschodniego, obok proponowanej kładki ST (~[15.3, −2.3]) i liści lilii DT — nie nachodzi, ale kadr `pokazZnakWKadrze` musi go objąć albo kładkę przesunąć na zachodnie przewężenie; trasa LD (drzewo → oczko zachodnie) wolna od nowych głazów |
| Kamera pokazuje pierwszą gwiazdkę przy zleceniu; po gwiazdkach zapowiedź drzewa i pasek | `Swiat.jsx:1436–1446`, `:1168` | wzorzec „zlecenie = pokaż adres” obowiązuje część A każdej hybrydy (`pokazZnakWKadrze` na obiekt braku) |
| Przesunięte numery linii w `app.js` (+284), `Swiat.jsx` (+179), `zadanieDrewna.js` (+131), `kwestieWizkora.js` | mapowanie kluczowych odwołań z kart na `da86ca2`: `pokazMiejsce` 2490 (było 2426); `ustawSchronienie` 2806 (2649); `schronienie-kotwica` 2841 (2684); `_placIkona` 3007 (2850); `ustawPlacBudowy` 3050, warunek etapu 3054 (2893/2897); `oznaczZuzyte` 2314 (2279); `oznaczDostarczone` 2745 (2589); `kino` 3306, emit 3328 (3149/3171); `pokazZnak` 3574 (3320); `onBridge` 1094 (1061); mokre ślady tik 1749 (1716); `doba:sesja` 1794 (1761); `sesja:zamknieta` 3527 (3273); `_fasolaTik` `if (!F) return` 3162 (3068); `Swiat.jsx` `doba:sesja` 1973 (1884), `sesja:zamknieta` 1983 (1894), `surowiec:zdobyty` 1996 (1907), odtworzenie etapu 2074 (1981); `zadanieDrewna.js` `postawEtap` 298 (263), `czyMoznaRozbudowac` 325 (290) | tylko numery; treść haków bez zmian |

### 7.2 Które karty to zmienia

- **`kamienie-kroki` (LD):** część A mówiła pierwotnie „ten, który został z głazu”; po `da86ca2` głaz nie jest rozbijany (`doRozbicia: false`), więc karta (poprawiona w §8) mówi **„jeden kamyk spod głazu na polanie”** (model `kamyczki` z `natura.js` istnieje niezależnie od rąbania; głaz stoi jako element świata). Kwestie bez zmian (żadna nie mówi „z rozbitego głazu”). Hak `ulozKamienie` — **koszt niżej**: pozycje i osadzenie na wysokości gruntu daje gotowy wzorzec `_sladDoPlacu`. Uwaga dla `03`: `tam-i-z-powrotem` (§7.1) i `minuta-w-glowie` (§7.6) powołują się na „rozbity `glaz-polana`” — model kamyczków jest, rozbijania nie ma.
- **`co-jest-na-dnie` (DT), `kladka-nad-oczkiem` (ST), `lawka-dla-goscia` (EM), `ramka-w-domku` (KR):** `pokazMiejsce([x, z])` w części A i w reakcji po śladzie → **`pokazZnakWKadrze(id)`** (hak istnieje, `app.js:2483`). W tabelach `haki_3d` wiersz „`pokazMiejsce`” zostaje jako zapas dla `spokojnyRuch` (obie metody go respektują). Koszt bez zmian (niski / niski / średni / średni).
- **`kladka-nad-oczkiem` (ST) i `co-jest-na-dnie` (DT):** nowy głaz [19.31, −3.18] przy oczku wschodnim — sprawdzić kadr w `edytor.html`; w razie potrzeby kładka na zachodnim przewężeniu oczka (między [14.51, −1.5] a [13.85, −2.91]), liście lilii bliżej [15, −2]. Koszt bez zmian (dane).
- **`swiatlo-w-oknie` (MD):** bez zmian; `doba:sesja` i `etapSesji` nietknięte (`app.js:1794`, `doba.js:585`).
- **Kładka (ST) a `03` §7.5 i W2** — zapis rozstrzygnięcia d: hybryda pierwsza, `03` z `rodzina: "kladka"` i kwiatem przy pieńku, `papierowy-most` z W2 do wycofania (szczegóły w §4).
- **§5 „Pierwsza sesja”:** łańcuch to teraz gwiazdki → **trzy drzewa do ścięcia i trzy kursy pod drzewo** (nie „drzewko + głaz”) → „Budujemy!” → hybryda. Trzy kursy z ładunkiem to realnie **4–6 min**, nie 3–4, więc most hybrydy częściej wypadnie **po zachodzie** — gałąź „etap 1 stanął po zachodzie → hybryda następnego dnia po wejściu” z kart staje się główną ścieżką, a kwestia zachodu (`02` §3.1) dostaje w tej sesji wariant „brak zadania” (domek jeszcze się buduje). Moment `hybryda:trop` przechodzi przez `PasekKolejnejMisji` jak każda kolejna misja. Reguła „jedno zadanie na dany moment” bez zmian.
- **Kolejność wdrożenia (§4):** bez zmian; W3 (kanał ślad → scena) może użyć `pokazZnakWKadrze` zamiast dopisywać własny najazd; W6 (znacznik braku) bez zmian — `ustawPlacBudowy` dalej schodzi przy etapie > 0 (`app.js:3054`).

Niczego w plikach kopii roboczej nie zmieniono; ten dokument i `tmp/tresci-notatki-D.md` to jedyne pliki agenta D.

## 8. Naniesione recenzje (`tmp/tresci-recenzja-weto.md`, `tmp/tresci-recenzja-glos.md`)

Wszystkie poprawki wprowadzone; z uwag wprowadzono te, które zmieniały tekst dla dziecka albo bezpieczeństwo; odrzucono jedną (z uzasadnieniem). Po naniesieniu `tmp/tresci-skrypty/hybrydy-D-sprawdz.py`: 61 kwestii, 6 kart × 30 pól, **0 błędów** (kolumna `zn.` liczy teraz token jako dłuższą formę — uwaga 9 recenzji głosu).

| # | wpis (dokument · karta · autor) | typ | wprowadzono / odrzucono | dlaczego |
|---|---|---|---|---|
| W1 | weto · `kamienie-kroki` · rodzic-1-3 · ręcznik na panelach, głos 1–3 bez ręki przy ścianie | poprawka | wprowadzono | `czesc_B.mlodsi`: „kapcie, złożone ubrania, ręczniki tylko na dywanie”; głos 1–3 kończy się „— ręka może trzymać ściany”; miejsce `pokoj` doprecyzowane. Siedmiolatek słucha głosu, nie karty. |
| W2 | weto · `kamienie-kroki` · psycholog · pytanie zakłada zamknięte oczy | poprawka | wprowadzono | `mentor.pytanie`: „Który kamień był najtrudniejszy do trafienia?” — działa przy śladzie „z otwartymi oczami” i przy minimum. |
| W3 | weto · `swiatlo-w-oknie` · socjolog · klatka samemu o zmierzchu, „cudze” okna | poprawka | wprowadzono | `klatka` tylko 4–8, drzwi mieszkania otwarte, ktoś w domu wie; `czesc_B.starsi`: „jedno światło, które nie jest twoje: latarnię, samochód, okno daleko”. |
| W4 | weto · `kladka-nad-oczkiem` · pedagog · kładka na kolanie | uwaga | wprowadzono | `lawka.opis`: „Na ławce: dwa piórniki, kartka i gumka.” |
| W5 | weto · `co-jest-na-dnie` · psycholog · pytanie zakłada pomyłkę | poprawka | wprowadzono | `mentor.pytanie`: „Które rzeczy pływały, a które utonęły?” — także przy „wszystko {zgadłem\|zgadłam}” i minimum. |
| W6 | weto · `co-jest-na-dnie` · rodzic-1-3 · „rzeczy z półki w łazience” | poprawka | wprowadzono | `lazienka.opis`: „szczoteczka, mydło, gumka do włosów, korek od wanny” — bez kosmetyków i maszynki. |
| W7 | weto · `co-jest-na-dnie` · rodzic-1-3 · pełna miska nad podłogą | uwaga | wprowadzono | `czesc_B.mlodsi`: „Postaw miskę w zlewie i nalej trochę wody…”; „miska nie opuszcza zlewu”. |
| W8 | weto · `lawka-dla-goscia` · psycholog · pytanie zakłada, że ktoś przyszedł | poprawka | wprowadzono | `mentor.pytanie`: „Dla kogo było to miejsce i co na nim czekało?” — działa, gdy nikt nie przyszedł i przy „dla siebie z jutra”. |
| W9 | weto · `lawka-dla-goscia` · rodzic-4-8 · „króliczek” przy `oba` | uwaga | wprowadzono | wszędzie „królik”; `kroliczek.glb` zostaje jako nazwa pliku (to samo: głos 7). |
| W10 | weto · `ramka-w-domku` · pedagog · pytanie o warunek, którego 1–3 nie dostało | poprawka | wprowadzono | `mentor.pytanie` w trzech wariantach: 4–8 (okno albo droga), 1–3 („Co lisek ma widzieć na tym obrazku?”), sam symbol / minimum („Dlaczego akurat {symbol}?”). |
| W11 | weto · `ramka-w-domku` · socjolog · „z twojego prawdziwego okna” (parter na ścianę) | uwaga | wprowadzono | `czesc_B.starsi`: „jedna rzecz, którą widzisz z domu albo po drodze”. |
| G1 | głos · `ramka-w-domku` · narrator-gama · „z domku”, „w domku wisi” — domku nie ma | poprawka | wprowadzono | wszystkie kwestie, `czesc_B.mlodsi`, część A i powiadomienie Mentora mówią „z pomostu” / „na pomoście”; tytuł „Ramka w domku” zostaje jako zapowiedź (etap 2). |
| G2 | głos · `co-jest-na-dnie` · narrator-gama · lisek zleca („Ty wrzuć”) | poprawka | wprowadzono | lisek: „Ja bym wrzucił patyk. ⏎ Sprawdzisz w kuchni, co pływa?” (52). |
| G3 | głos · `kamienie-kroki` · copywriter · lisek 71 zn. | poprawka | wprowadzono | „Ja położyłem jeden kamień. ⏎ Ułożysz swoje? Bez patrzenia.” (56). |
| G4 | głos · `kamienie-kroki` · copywriter · pusty token „{wrócisz\|wrócisz}”, założenie „poza domem” | poprawka | wprowadzono | „…ułóż je, kiedy będziesz w domu.” (102). |
| G5 | głos · `lawka-dla-goscia` · copywriter · „stoi / leży {rzecz}” | poprawka | wprowadzono | „Na ławce na pomoście jest już {rzecz}.” / „Na ławce jest {rzecz}.” |
| G6 | głos · karty 1, 2, 6 · narratorka 1–3 „To od ciebie.” | uwaga | odrzucono (zostaje jako wyjątek) | narratorka zwraca się do dziecka jednym zdaniem po śladzie, bo siedmiolatek ma zobaczyć związek między swoim działaniem a rzeczą; recenzja sama uznaje to za świadomy wyjątek — do wpisania w `01` (tabela narratorki: „1–3: jedno zdanie „To od ciebie.” dozwolone po śladzie”). |
| G7 | głos · `lawka-dla-goscia` · „króliczek” | uwaga | wprowadzono | jak W9. |
| G8 | głos · `ramka-w-domku` · figura „deszcz umiem zatrzymać” dwa razy w jednej sesji | uwaga | wprowadzono | głos 4–8 i 1–3: „Ramkę powiesiłem, obrazu nie wyczaruję.” |
| G9 | głos · kolumna `zn.` liczy obie formy tokenu | uwaga | wprowadzono | `hybrydy_D_lib.py` i `hybrydy-D-sprawdz.py` liczą dłuższą formę; kolumna przeliczona; dopisek w nagłówku tabel kwestii. |
| S-b | spójność · dodatek po zauważeniu, światło tylko MD | rozstrzygnięcie | wprowadzono | §1.2 nowa zasada; **EM: „lampka” na ławce → „koc”** (żadna karta poza MD nie świeci); sprawdzone: LD kwiat + kamień, ST poręcz + kwiat, DT kwiat lilii, EM królik, KR mała ramka — bez światła. |
| S-c | spójność · tabela haków dzielonych | rozstrzygnięcie | wprowadzono | `tmp/tresci-notatki-D.md`: +3 wiersze (brama, przedmiot na pieńku, nowy znak) i jedna definicja „świetlika”. |
| S-d | spójność · kładka w trzech miejscach | rozstrzygnięcie | wprowadzono | §4 (akapit „Kładka — rozstrzygnięcie d”) i §7.2: hybryda pierwsza, `03` z `rodzina`, W2 do wycofania, jedno źródło tekstu B; rodzina „okno”. |
| S-e | spójność · stany zadania | rozstrzygnięcie | wprowadzono | §1.2 i W1: „Do zrobienia” → „Czeka — u ciebie” → „Ślad zostawiony” (podtytuł „Mentor już to widzi” tylko przy istniejącym Mentorze) → „Mentor {zobaczył\|zobaczyła}”; karty używają „Czeka — u ciebie”. |
| S-f | spójność · pola wiekowe | rozstrzygnięcie | wprowadzono | §4 tabela mapowania `czesc_B.mlodsi/starsi/minimum`, `mentor.pytanie` → `rozmowa` (+ `warianty["1-3"].rozmowa`, `rozmowa_minimum`), `mentor.powiadomienie` → `mentor_powiadomienie`, `kwestie[].wariant`. |
| S-h | spójność · kamień jako materiał po `da86ca2` | rozstrzygnięcie | wprowadzono | karta LD mówi „kamyk spod głazu na polanie, głaz nie jest rozbijany” (zgodnie z kodem); pytanie do autora w `tmp/tresci-notatki-D.md`. |

Razem: **26 wpisów, 25 wprowadzonych, 1 odrzucony** (G6 — zostaje jako wyjątek do wpisania w `01`).

## 9. Poprawki po recenzencie końcowym (§8 promptu)

| # | co | zmiana |
|---|---|---|
| 1 | `lawka-dla-goscia` — „dla siebie z jutra”, minimum „ty jutro rano” (§4 promptu: zero przygotowań na jutro) | miejsce `jutro` → `powrot` „Dla siebie po powrocie” (ze świetlicy, ze spaceru); minimum: „dla kogoś, kto dziś jeszcze wróci — albo dla siebie po powrocie”; wszystkie odwołania w karcie, rundzie, werdyktach i §1.1 poprawione. |
| 2 | `lawka-dla-goscia` — „sekret do wieczora”, „Nie przyznawaj się do wieczora” (`04` reguła 5: nigdy „sekret”) | 4–8: „Nie mów, że to ty — niech sam zgadnie”; zwrot akcji = niespodzianka; słowo „sekret” i „do wieczora” usunięte z karty (dlaczego, starsi, ryzyka, runda, werdykt, tabela zbiorcza). Kwestie Wizkora i liska tej karty sprawdzone: nie zawierały ani „sekretu”, ani terminu („żeby sam je znalazł” zostaje). |
| 3 | CTA dowodu „Wyślij do Mentora” obiecuje Mentora, którego może nie być | §1.2 (zasada śladu) i W1: nagłówek „Pokaż, co {zrobiłeś\|zrobiłaś}”, przycisk „Zostaw ślad”, dopisek „Mentor to zobaczy” tylko przy prawdziwym, niedemowym Mentorze — zgodnie z `02` po poprawce. |
| 4 | kotwica po etapie 1: plac czy drabinka/pomost | Sprawdzone: żadna reakcja w `05` nie zakłada placu po etapie 1 — kamienie od drabinki, kwiat przy drabince (ogólny dodatek), ramka i ławka na barierce/kotwicy pomostu, lampka na pomoście; W6 (znacznik braku) jest wprost niezależny od `ustawPlacBudowy`, bo ten schodzi przy etapie > 0. „Plac budowy” pada w `05` tylko w opisie łańcuca przed „Budujemy!” (§5, §7). Bez zmian; `04` §6.1 poprawia agent C (kotwica `swiatlo-dnia` / `kamyczek-na-placu` → drabinka). |

Kontrola po zmianach: `tmp/tresci-skrypty/hybrydy-D-sprawdz.py` — 61 kwestii, 6 kart, 0 błędów.

