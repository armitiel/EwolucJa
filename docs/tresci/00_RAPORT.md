# 00 — Raport: warstwa tekstów, zadania w realu, porady dnia, hybrydy

> Wykonanie promptu `tmp/PROMPT_FABLE.md` (17.09.2026). **Baza audytu: HEAD `596d4aa`**; w trakcie
> pracy HEAD przesunął się na `da86ca2`, a przy odbiorze na `4d7b7eb` (druga sesja; SPDX/licencje, bez wpływu na treści) — różnice uzgodnione w `02` §6, `03` §11,
> `04` §1.5, `05` §7, `06` §4.13. Zmienione tylko pliki w `docs/tresci/` (skrypty pomocnicze
> w `tmp/tresci-skrypty/`, gitignore). Bez commita, bez pusha, bez zmian w kodzie.

## ⚠ Do zrobienia od razu — treść, która dziś szkodzi na produkcji

Lisek czyta dziecku porady, które łamią reguły well-being z §4 promptu. Siedem najpilniejszych
(`04` §2, treść zastępcza pod tym samym `id` w `04` §7):

| id | co robi | nowa treść |
|---|---|---|
| EM-D21-S3 | uczy trzymać sekret | `04` §7.2 |
| EM-D13-S1, MD-D22-S1, MD-D14-S1 | relatywizuje uczucia dziecka („inni mają gorzej”, cudze emocje do „oddania”) | `04` §7.2, §7.6 |
| LD-D08-S1 | każe podejść do dorosłego, którego dziecko się boi | `04` §7.5 |
| EM-D25-S1 | zakłada bezpiecznego dorosłego obok | `04` §7.2 |
| LD-D10-S1 | zawstydza (w kopii roboczej złagodzone, nadal „pamiętaj”) | `04` §7.5 |

Razem **37 porad z realną szkodą** w kopii roboczej (40 na HEAD): 30 wyciąć + 7 przepisać —
pełna lista imienna w `04` §2. Wszystkie mają gotową treść zastępczą w `04` §7 (53 przepisane).

Drugi alarm, techniczny (`06` §4.5): zdjęcia-dowody dzieci idą do **publicznego** Vercel Blob
(`ZadaniePanel.jsx:133`) z EXIF (GPS), bez retencji i bez uwierzytelnienia odczytu
(`cycles.js:246`). Rekomendacja: **wyłączyć zdjęcia globalnie** do czasu toru obrazu W7.

---

## Dziesięć najważniejszych problemów (z liczbami)

| # | problem | liczba | źródło |
|---|---|---|---|
| 1 | Porady dnia szkodliwe albo moralizujące | 37 szkodliwych; **94 z 198 (47%)** z cytatem Wizkora, etykietą, „pamiętaj/musisz” albo „A czy wiesz”; 48 (24%) bez żadnej czynności | `04` §1.3, §2; `pomiar-C.py` |
| 2 | Mentor jako sędzia, monety jako nagroda — w kodzie, tekstach i dokumentach | 7 tekstów o Mentorze-sędzim, 16 wzmianek o monetach w kwestiach; `approve/reject` + punkty w `mentor.js:94–160`; `PANEL_ZADAN.md`, `projektant-zadan.md`, oba skille konta | `02` §1; `06` §3, §4.7 |
| 3 | Połowa odbiorców czyta o kimś innym: forma męska bez tokenu `{m\|ż}` | kwestie: 24 w głosie + 15 na ekranie; biblioteka Mentora **228 z 276 (83%)**; porady 14; `odmien` działa tylko w 2 komponentach | `02` §1; `03` §3.1; `06` §4.1 |
| 4 | Etykieta profilu w tekstach dla dziecka | biblioteka 50 (18%; ST 26, LD 16); porady 31; `PoradaPanel.jsx:200`, `KoloFortuny` chip | `03` §3.1; `04` §1.3 |
| 5 | Zadania w realu: liczebnik zamiast odkrycia, brak pierwszego zadania dla profilu | 155/276 (56%) prowadzi liczebnikiem; 22 tylko ze zdjęciem; dobre pierwsze zadanie na start miały 1–2 profile z 6; `wyciąć` 47, `przepisać` 29 + 3 z 10 Wizkora | `03` §2–§3, §10 |
| 6 | Świat nie reaguje na działanie w realu — brak kanału ślad → scena na `/swiat` | 0 metod; `/w2` tylko `ustawSladyPrzygod`; stan świata wyłącznie w `localStorage`; 0 zdarzeń analityki z pętli zadania | `06` §4.3, §4.4, §4.12 |
| 7 | Sesja: brak etapu „noc”, koniec dnia opisuje obiekty spoza sceny, świat po końcu chodzi dalej i odświeżenie zaczyna nowy dzień | 8 obiektów spoza sceny w `koniec-dnia.v1.json`; `PodsumowanieDnia` czyta mockup, nie stan gracza | `02` §2.7, §3; `06` §4.8 |
| 8 | Wizkor za długi, bez `tekstEkranu`, opisuje krajobraz; toasty niewidoczne | 9 z 26 kart > 60 zn. (5 > 100); 5 kwestii > 140; 4 z 14 toastów > 28 (widać tylko tytuł); 14 ozdobników; 8 „trzyma przy ekranie” | `02` §1 |
| 9 | Dwa głosy tego samego dnia bez reguły: tryb spokojny Wizkora vs porada liska | chmurka po 75 s, 3 na sesję; lisek cytuje Wizkora w **63 z 198 (32%)** porad; myśli Wizkora w trybie rozkazującym: 6 z 16 na HEAD, **11 z 16** w kopii roboczej | `04` §1.5, §4.5; `01` R7 |
| 10 | Siatka porad dziurawa i bez wariantów wieku | MD 30/0/0, KR 25/8/0, LD 21/9/3 (poranek/południe/wieczór); 0 porad z wariantem drugiego etapu; 51 tytułów > 28 zn.; 148 (75%) treści > 120 zn. | `04` §1.3, §3.1 |

## Pięć najpilniejszych zmian (jeśli czas jest na pięć)

1. **Podmienić 37 szkodliwych porad** treścią z `04` §7 (te same `id`) — najpierw siedem z alarmu. Zero kodu poza danymi.
2. **`odmienDlaGracza` we wszystkich komponentach tekstu** (`06` §4.1) i `tekstEkranu` dla każdej kwestii Wizkora — bez tego żaden nowy tekst z `01`–`05` nie może wejść.
3. **Statusy i Mentor „Zauważam”**: `Do zrobienia → Czeka — u ciebie → Ślad zostawiony → Mentor {zobaczył|zobaczyła}`, jeden przycisk bez punktów, demo bez udawanego Mentora, `/games` wyciszone w `HintPopup` (`06` §4.7; teksty w `02` §2.5).
4. **22 zadania Wizkora v2** (`03` §7–§8: 12 nowych + 3 przepisane + 7 poprawionych) z `pierwszeZadania(profil)` i pomijaniem powtórek po `id` — pierwsze zadanie dobre dla każdego z sześciu profili.
5. **Kanał ślad → scena + `kamienie-kroki`** (W1–W6 z `05` §4, koszt niski) — pierwszy raz na `/swiat` świat odpowiada na coś, co wydarzyło się poza ekranem.

---

## Skrót obszarów

**A. Standard głosów i komunikaty (`01`, `02`).** Zmierzono 92 kwestie w głos i 99 ekranowych (`pomiar-A.py`). Standard: limity z CSS (karta ≤ 60, Wizkor ≤ 140 / 3 zdania, lisek ≤ 70 z wyjątkiem `zapowiedz` ≤ 120 jako dwa zdania ≤ 70, toast ≤ 28, chmurka ≤ 65), 10 reguł (R7 dwa głosy: 4 min / 5 min / maks. 2 na sesję / nic po zachodzie; R9 cztery stany zadania), słowa zakazane → zamienne, 22 pary przed/po. Inwentarz 141 wierszy z werdyktami; nowa sekwencja zachód (4 warianty) → noc (narratorka, jedno zdanie) → koniec (5 kroków z realnego stanu) → powrót; 29 recenzji naniesionych, 3 odrzucone z uzasadnieniem. Uzgodnienie z kopią roboczą: 3 nowe komunikaty, „Przygotowałam” w głosie Wizkora, „wędrowcze” w `Swiat.jsx:1172`.

**B. Zadania w realu (`03`).** 10 zadań Wizkora: 7 poprawka, 3 przepisać (`cos-z-niczego` → `trzy-przedmioty`, `ramie-w-ramie` → `na-zmiane`, `jeden-krok-dalej` → `pierwsze-slowo`). Biblioteka Mentora 276: wzorce policzone (`pomiar-B.py`), 47 wyciąć, 29 przepisać, poprawki globalne. „Głupie zadanie” = 7 mechanizmów z cytatem + 8 kryteriów z parą przed/po. 12 nowych pierwszych zadań (po 2 na profil) z polami `potrzeba/minimum/etap/warianty/rozmowa/reakcja_swiata/mentor_powiadomienie`; balans po dopisaniu: `potrzeba` 8 rodzajów zamiast 5, miejsce w bloku 22/22, dwie drogi dowodu 22/22. Mapowanie profili → osi bez szóstej osi. Weto psycholog + socjolog na każdym: 47 recenzji naniesionych, 1 odrzucona; `obok` przepisane po wecie.

**C. Porady dnia (`04`).** 198 porad dla dziecka (189 dla rodzica poza zakresem): werdykty 29 / 52 / 64 / 53 (HEAD) → 29 / 58 / 61 / 50 (kopia robocza). Standard porady (13 pól, cztery stany karty, siatka 30 × 3 × 6). Profil zmienia **wejście**, technika jest wspólna; MD przebudowane z mediatora na Skupienie, LD z afirmacji na ruch i mikroodwagę. Ślad porady w świecie: 8 rodzajów śladu liska (`ustawSladPorady`), bez światła w oknie (to MD). 53 przepisane + 12 nowe (po 2 na profil, `1-3` i `4-8`), 0 ciekawostek celowo; 28 recenzji naniesionych. Ostrzeżenie: **nie regenerować `dailyTipsData.js`** — 130 zmian drugiej sesji zniknie.

**D. Zadania hybrydowe (`05`).** Sześć kart w kolejności wdrożenia: `kamienie-kroki` (LD, niski), `swiatlo-w-oknie` (MD, niski), `kladka-nad-oczkiem` (ST, niski), `co-jest-na-dnie` (DT, niski–średni), `lawka-dla-goscia` (EM, średni), `ramka-w-domku` (KR, średni; zdjęcie = W7 wysoki). Każda: część A ze zakładem, most (Wizkor + lisek), część B w wersji 1–3 / 4–8 / minimum, miejsce w bloku, ślad z trzech opcji bez zdjęcia, reakcja po śladzie i po zauważeniu, pytanie dla Mentora, haki 3D z kosztem. 13 pomysłów odrzuconych z powodem; część wspólna W1–W6; „Pierwsza sesja”; uzgodnienie z `da86ca2` (trzy stosy drewna, `pokazZnakWKadrze`). 25 recenzji naniesionych, 1 odrzucona.

**E. Decyzje i zależności (`06`).** 31 pytań z rekomendacją (9 z §9 promptu + 22 zebrane), mapowanie profili, 30 rozbieżności w dokumentach/agentach/skillach/kodzie, 13 obszarów zależności technicznych (bez kodu), haki dzielone `03`/`05`, rejestr rodzin, kolejność wdrożenia w 10 krokach.

---

## Rozstrzygnięcia spójności między dokumentami (recenzja głosu, przyjęte)

(a) lisek `zapowiedz` ≤ 120 jako dwa zdania ≤ 70 · (b) dodatek po zauważeniu Mentora = kwiat w nowym kolorze przy drabince, światło tylko dla MD · (c)/(d) haki dzielone: hybryda ma pierwszeństwo do obiektu, zadanie w realu dostaje kwiat; rodzina `kladka` · (e) cztery stany zadania, „Zrobione” tylko w historii · (f) jeden model `etap` + `warianty["1-3"|"4-8"]` dla zadań, hybryd i porad · (g) R7 wspólna dla `01`, `02`, `04` · (h) kamień jako materiał = pytanie do autora (`06` pkt 13) · (i) pusty stan Porady wg `02`.


## Wyniki skryptów kontrolnych (wklejone bez zmian, uruchomione 17.09 po naniesieniu recenzji panelu i recenzenta końcowego)

```
$ python3 tmp/tresci-skrypty/sprawdz-limity-A.py        # nowe teksty w 02 (karta/głos/toast, cyfry, tokeny, słowa zakazane)
problemów: 0

$ python3 tmp/tresci-skrypty/nowe-zadania-B.py           # 15 zadań z 03 §7–§8 (pola, limity, tokeny, dwie drogi dowodu, miejsce w bloku)
ostatni-dzwiek OK
najwolniejszy-krok OK
trzy-przedmioty OK
na-zmiane OK
pierwsze-slowo OK
WYNIK: 15/15 OK

$ python3 tmp/tresci-skrypty/sprawdz-nowe-C.py           # 65 porad z 04 §7–§8
BLĘDY: 0
luki „ciało co 3 dni” (dzień startowy okna bez porady do ciała): {'DT': [10, 11, 12, 13, 14, 28, 29], 'EM': [2, 3, 4, 14, 15, 16, 17, 26], 'ST': [4, 5, 14, 20, 21, 22, 26, 27, 28], 'KR': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 26, 27, 28, 29, 30], 'LD': [14, 27], 'MD': [24, 25]}
rodzaje przepisane+nowe: Counter({'zmysly': 12, 'tworzenie': 9, 'wyciszenie': 8, 'napiecie-pusc': 7, 'oddech': 7, 'emocje-cialo': 6, 'ruch': 6, 'mikroodwaga': 6, 'zyczliwosc': 4})
gdzie: Counter({'obok': 43, 'dzien': 13, 'apka': 9}) tryb: Counter({'inicjowanie': 38, 'obserwowanie': 23, 'zaproszenie': 2, 'odpowiadanie': 2}) slad: Counter({'lisek-oddycha': 14, 'lisek-strzasa': 11, 'swiatlo-dnia': 10, 'kamyczek-przy-drabince': 9, 'niebo-cichnie': 8, 'slady-lap': 7, 'kropla-swiatla': 4, 'kwiat-koloru': 2})
ciekawostki: 0
zapisano czesci 07/08/09; przepisane 53 nowe 12

$ python3 tmp/tresci-skrypty/hybrydy-D-sprawdz.py        # 61 kwestii w 6 kartach z 05
kwestii sprawdzonych: 61
kart: 6
błędów: 0
```

Luki „ciało co 3 dni” dotyczą **istniejącej** bazy (poza 65 nowymi) — lista do drugiego tygodnia pracy nad poradami (`04` §5.1).

## Kryteria odbioru (§8 promptu)

| kryterium | stan |
|---|---|
| tylko `docs/tresci/` zmienione, bez commita i pusha | ✔ (`git status` z Windows na `4d7b7eb`: `docs/tresci/` untracked; 10 zmodyfikowanych plików i `scripts/teksty-mowione.mjs` należą do drugiej sesji; katalogi `__pycache__/` w `frontend/`, `scripts/`, `tools/` to artefakty uruchamiania skryptów, nie treść — do `.gitignore`) |
| limity standardu sprawdzone skryptem, wynik w raporcie | ✔ (wyżej) |
| zero cyfr w TTS, zero „zostało”, zero ukośników, tokeny przy czasownikach | ✔ (skrypty A, B, C, D) |
| zero starych archetypów, zero etykiety profilu w tekście dla dziecka | ✔ (skrypty; nazwa profilu tylko na ekranie ujawnienia — `06` pkt 12) |
| zero „przyjął/zatwierdź/poprawka/sprawdzane” o Mentorze, zero monet w kwestiach o realu | ✔ |
| każde zadanie i hybryda: 1–3 i 4–8, minimum, miejsce w bloku, ślad bez zdjęcia, reakcja po śladzie i po zauważeniu, pytanie dla Mentora | ✔ (`03` §7–§8 15/15; `05` 6/6) |
| weto psycholog + socjolog, werdykty zapisane | ✔ (`03` §12, `04` §10, `05` §8, `02` §7; 1 weto → `obok` przepisane) |
| każdy obiekt świata istnieje w kodzie albo „do zbudowania” z kosztem | ✔ (`05` §4, `03` §10, `06` §5) |
| na profil: 1 hybryda, ≥ 2 pierwsze zadania, ≥ 2 nowe porady | ✔ (6 / 12 / 12) |
| `narrator-gama` ostatni | ✔ (`tmp/tresci-recenzja-glos.md`, po nim tylko poprawki z jego uwag) |
| osobny recenzent na sprzeczności z §3 i §4 | ✔ 23 znaleziska (1 blokujące, 9 poprawek, 13 uwag), wszystkie naniesione — sekcja niżej |

## Spis dokumentów

| plik | co zawiera | linie |
|---|---|---|
| `00_RAPORT.md` | ten raport | ~170 |
| `01_STANDARD_GLOSOW.md` | limity, 10 reguł, słowa zakazane → zamienne, 22 pary przed/po, lista kontrolna | 115 |
| `02_KOMUNIKATY_POPRAWKI.md` | pomiar, inwentarz 141 komunikatów z werdyktami, sekwencja sesji, werdykty panelu, „zostaje”, uzgodnienie z kopią roboczą, naniesione recenzje, poprawki po recenzencie końcowym | 585 |
| `03_ZADANIA_W_REALU.md` | audyt 10 + 276 (z wariantami 1–3 dla 7 poprawionych), balans, „głupie” + 8 kryteriów, profil → zadanie, 12 nowych + 3 przepisane w formacie v2 (z polem `slad`), odrzucone, balans po, uzgodnienie, recenzje, recenzja końcowa | 1991 |
| `04_PORADY_DNIA.md` | stan, szkodliwe imiennie, audyt 198, standard, mechanizmy profili, ślad w świecie, 53 przepisane + 12 nowych, werdykty, recenzje, poprawki po recenzencie końcowym | 2618 |
| `05_ZADANIA_HYBRYDOWE.md` | tabela zbiorcza, 6 kart, odrzucone, kolejność i haki, pierwsza sesja, strateg, uzgodnienie z `da86ca2`, recenzje, poprawki po recenzencie końcowym | 760 |
| `06_DECYZJE_I_ZALEZNOSCI.md` | 31 pytań z rekomendacją, mapowanie profili, rozbieżności, zależności techniczne, haki dzielone, rodziny, kolejność wdrożenia | 283 |

Materiały robocze (gitignore): `tmp/tresci-notatki-{A,B,C,D}.md`, `tmp/tresci-recenzja-{weto,glos}.md`, `tmp/tresci-skrypty/` (pomiary, walidatory, dane JSON nowych treści: `nowe-zadania-B.json`, `nowe-porady-C.json`), `tmp/ADDENDUM_FABLE.md`.

---

## Wynik osobnego recenzenta — sprzeczności z §3 i §4

Osobny subagent dostał wyłącznie prompt i siedem dokumentów (bez repo). Znalazł **23 pozycje: 1 blokującą,
9 poprawek, 13 uwag**; nie znalazł w nowych tekstach: nazw profili ani starych archetypów jako etykiet,
monet w kwestiach o realu, „przyjął/zatwierdź/poprawka/sprawdzane” o Mentorze, cyfr w TTS, ukośników rodzaju,
„brawo/dobra robota/wędrowcze/musisz/pamiętaj”, liska cytującego Wizkora, Wizkora opisującego krajobraz.
Wszystko naniesione (szczegóły: `02` §8, `03` §13, `04` §11, `05` §9, `06` pkt 14, 25, §4.7, §4.10, §6).

| # | znalezisko | waga | co zrobiono |
|---|---|---|---|
| 1 | `03` §7.2–§7.12, §8.1–§8.3: tabele werdyktów panelu były kopią tabeli `tam-i-z-powrotem` — kryterium „werdykty zapisane” niespełnione | **blokujące** | 14 tabel napisanych od nowa, każda o swoim zadaniu (weto psycholog/socjolog w każdej; `obok` z zapisem weta i jego zdjęcia); sprawdzone: 15 tabel, 15 różnych |
| 2 | `02` „Zetnij drzewo, rozbij głaz” jako wersja główna wbrew §3 („tylko suche/powalone”) | poprawka | wersja główna „Zetnij suche drzewko i przynieś trzy stosy drewna”; „zetnij drzewo” z kopii roboczej jako alternatywa (`06` pkt 14 dostał rekomendację) |
| 3 | `05` `lawka-dla-goscia`: miejsce „dla siebie z jutra” = przygotowanie na jutro (§4) | poprawka | miejsce `powrot` „dla siebie po powrocie”, minimum bez „jutro rano” |
| 4 | `03` cztery zadania `etap: oba` wysyłają sześciolatka samego na klatkę/korytarz (§4 weto) | poprawka | jeden wzorzec dla 5 zadań: wersja bazowa „gdy dorosły jest obok”, `warianty["4-8"].miejsca` bez warunku |
| 5 | `03` 15 zadań bez pola `slad` (ślad bez zdjęcia dla 1–3 = pisanie zdania) | poprawka | `slad {opcje[3], obrazki[3], zdanie, zdjecie, podpowiedz}` w każdym zadaniu; `zdjecie: false` w `najwolniejszy-krok`, `pierwsze-slowo` |
| 6 | `03` 7 zadań „poprawka” bez obiecanych wariantów 1–3 | poprawka | `warianty["1-3"]` (`cel` + `jak`) dopisane w §2 |
| 7 | `03` tokeny przy rzeczownikach nie o dziecku („nikt nie {wiedział\|wiedziała}”, „dźwięk {zniknął\|zniknąła}”) | poprawka | „że to {on\|ona}”, „aż ucichł”; walidator odrzuca token po „nikt/dźwięk/kładka/rzecz/ktoś/nic/osoba” |
| 8 | `02`, `05` CTA „Pokaż Mentorowi / Wyślij do Mentora” obiecuje Mentora, którego może nie być | poprawka | nagłówek „Pokaż, co {zrobiłeś\|zrobiłaś}”, przycisk „Zostaw ślad”; „Mentor to zobaczy” tylko przy prawdziwym, niedemowym Mentorze — w `02`, `05` W1 i `06` §4.7 |
| 9 | `04` ślady porad zakotwiczone przy placu budowy, który znika po etapie 1 | poprawka | kotwica = drabinka pomostu (`kamyczek-przy-drabince`), plac tylko przy etapie 0; „plac budowy” wykreślony z listy obiektów dla odzewu |
| 10 | `05` `lawka-dla-goscia` 4–8 „sekret do wieczora” (`04` reguła 5: nigdy „sekret”) | poprawka | „Nie mów, że to ty — niech sam zgadnie”; „sekret” i „do wieczora” usunięte z karty |
| 11 | `03` LD-TASK-025 „w twojej pracy?” zakłada dorosłego z pracą | uwaga | „w tym, co robisz?” |
| 12 | `04` silnik `odliczanie` w 6 poradach (§3: nigdy odliczanie) | uwaga | silnik `fazy` bez sekund i cyfr: fazę przełącza dotknięcie albo koniec wydechu; zależność w `06` §4.10 (`EkranOddechu` musi emitować „koniec wydechu”, `PoradaAkcja/Ruch` do przebudowy) |
| 13 | `04` lisek orzeka o ciele dziecka („Twoje nogi też już nigdzie nie idą”) | uwaga | 36 odzewów przepisanych na „U mnie … A u ciebie?”; walidator z heurystyką orzekania |
| 14 | `02` „Potem zajrzyj na polanę” („zajrzyj” zakazane) | uwaga | „Jak zrobisz swoje, polana to zauważy.” |
| 15 | `02` lisek 1–3 odkłada zadanie na „jutro, razem” w grze | uwaga | „„{tytuł}” jest u ciebie — ja tu poczekam.” |
| 16 | `03` `celowo-brzydko` „jak najbrzydziej” = otwarty sufit | uwaga | „trzy rzeczy nie tak” |
| 17 | `03` `celowo-brzydko` zdjęcie rysunku podpisanego imieniem do publicznego magazynu | uwaga | podpis wymyślonym znakiem, zdjęcie bez imienia |
| 18 | porada EM-D16-S1 dubluje `tajny-pomocnik`, KR-D10-S1 dubluje `wynalazca-z-kieszeni` — bez rodziny | uwaga | rodziny `po-cichu`, `drugie-uzycie` w `04` (pole `rodzina`) i `06` §6 |
| 19 | `02` wolne „jedno zdanie Mentora” na ekranie dziecka = kanał na ocenę | uwaga | wybór z gotowych formuł bez oceny („Widziałem.” / „Widziałam.” / „Porozmawiamy o tym.” / „Ciekawe, jak to {zrobiłeś\|zrobiłaś}.”) |
| 20 | liczby niespójne: myśli Wizkora rozkazujące „6” vs „5”; EM-D14-S2-LUKA „do trzydziestu” vs „do dwudziestu” | uwaga | policzone skryptem: HEAD 6 z 16, kopia robocza **11 z 16** — jedna liczba w `00`, `04`, `06`; werdykt pedagoga ujednolicony do „do dwudziestu” |
| 21 | `03` dodatek po zauważeniu Mentora („drugi kwiat pod drzewem”) niezgodny z R9 i `05` | uwaga | kwiat w nowym wariancie koloru przy drabince pomostu — wszędzie |
| 22 | `06` pkt 14 (ścinanie) bez rekomendacji, wbrew §9 | uwaga | rekomendacja: suche drzewko (§3 wygrywa z kodem) |
| 23 | `02` opis toastu „Zostało jeszcze jedno” ze statusem „zostaje” | uwaga | „Jeszcze jedno jest do przyniesienia”; przy okazji krok 1 podsumowania „Zostało jedno, na pomoście” → „Jedno świeci dalej — na pomoście.”; skrypt A sprawdza „zajrzyj” i „zostało” |

Po naniesieniu wszystkie cztery skrypty kontrolne przeszły ponownie (wyniki wyżej).
