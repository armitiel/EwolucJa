# Rozwój gry — gdzie dziś się kończy i jak ją rozwinąć

Spisane 2026-09-09 na podstawie `docs/KONCEPT_GRY.md` (co jest na ekranie)
i kodu (`hub/*.js`). Każda propozycja buduje na mechanice, która już istnieje,
i trzyma osiem reguł z `docs/SYSTEMY_GRY.md` §0: nic nie wyskakuje, brak kary,
brak odliczania i losowych nagród, jedna liczba — jedno źródło.

---

## Obecny koncept w jednym akapicie

Dziecko wchodzi na planetę z jedną polaną. Wizkor zleca łańcuch: dziesięć
gwiazdek → trzy gry odkrywane przez zbieranie i układanie puzzli (Pamięć
Mędrca → Lot Liska → Bieg Liska). Równolegle, z rozmowy z Wizkorem, Koło
Przeznaczenia losuje jedną z pięciu cech i zadanie poza ekranem, które
weryfikuje Mentor. Lisek zaprasza raz dziennie do porady dnia. Za wszystko
płacą monety, cechy rosną w profilu, dom pokazuje „co już masz".

---

## Gdzie gra dziś się kończy — z kodu, nie z wrażeń

| # | granica | dowód |
|---|---|---|
| 1 | **Łańcuch Wizkora ma cztery ogniwa i koniec.** Po wypłacie za Bieg Liska czarodziej nie ma nic do zlecenia. | `misjeGier.js → MISJE` = 3 wpisy; `etapyMisji.js` buduje etapy z tej listy |
| 2 | **Monety nie mają ujścia.** Zbiera się je, licznik rośnie, na tym koniec. | brak jakiegokolwiek „kup/cena/wydaj" w `hub/`; `DomPanel`: „pokój tylko czyta" |
| 3 | **Rozmowy to atrapa.** Ikona w doku prowadzi do udawanego forum. | `hub/data/czat.mock.json` |
| 4 | **Cechy rosną, ale nie zmieniają niczego.** | `wzmocnijCeche` tylko dopisuje; nikt nie czyta `state.traits` poza profilem i domem |
| 5 | **Planeta jest chodzalna dookoła i pusta poza polaną.** | `swiat.tylkoMapa` domyślnie wyłączone; poza `swiat.teren` tylko trawa |
| 6 | **Jeden powód, żeby wrócić jutro** — porada dnia. Gwiazdki same nie wracają. | `poradaDnia.js` deterministyczna w dobie; `przywrocGwiazdkiNaMape` wołane tylko z resetu etapów |
| 7 | **Pula zadań poza ekranem to 10 sztuk** (po 2 na cechę) i zależy od Mentora. | `zadania-wizkora.v1.json`; stany `wyslane`/`poprawka` czekają na dorosłego |
| 8 | Tutorial ma 1 z 3 gier. | `zasadyGier.js → ZASADY` ma tylko `pamiec-medrca` |

Pierwsze dwie granice są ważniejsze niż pozostałe razem wzięte: gra da się
skończyć w jedno popołudnie, a to, co się w niej zarobiło, nie ma na co pójść.

---

## Kierunki — uszeregowane według tego, ile dają za ile

### 1. Kręgosłup: łańcuch Wizkora nie może mieć końca

Najtańsze rozwinięcie w całym projekcie, bo mechanizm już jest — brakuje
wyłącznie danych.

- **Czwarte ogniwo = pierwsza z trzech zapowiedzianych gier** (Echo Melodii,
  Trop Tropiciela, Zwój Znaków). Podpięcie to osiem wpisów z checklisty
  (`SYSTEMY_GRY` §6): katalog, `GRY_W_HUBIE`, `MISJE`, `SIATKI`, `POZIOMY_GIER`,
  `ZASADY`, trasa, `GRY_OSADZONE` — plus sama gra, której jeszcze nie ma.
  Każda kolejna to nowa misja z puzzlami po polanie.
- **Tutoriale dla Lotu i Biegu Liska** — ekran wspólny istnieje, brakuje
  po trzy zdania i trzy miniatury.
- **Rozgałęzienie zamiast listy.** Po trzeciej grze Wizkor mówi, że kawałki
  dwóch obrazków rozsypały się w dwie strony — dziecko wybiera, za którymi
  idzie. Ten sam mechanizm `ujawnij()`, tylko dla dwóch misji naraz; kolejność
  przestaje być narzucona, a wybór jest pierwszą decyzją dziecka w grze.

### 2. Monety muszą mieć na co pójść — na planecie, nie w sklepie

Dom celowo „tylko czyta" i to jest dobra decyzja: pokój ma odpowiadać na
„co już mam". Ujście monet powinno więc być **na mapie**, tam gdzie dziecko
żyje, a nie w liście z cenami.

Propozycja: **rzeczy, które dziecko stawia na planecie.** Ławka przy rzece,
druga latarnia, kwiaty wokół domku, kamień z własnym imieniem. Wizkor po
wygranej misji przynosi *jedną* rzecz do postawienia za konkretną liczbę
monet (liczba widoczna przed decyzją — ta sama zasada, co `monetyMax`).
Bez losowania, bez skrzyń, bez czasu. Scena ma już mechanizm stawiania
obiektów na kuli (`Planeta.ustaw`), a `mapa.json` przyjmuje nowe wpisy
bez zmiany silnika.

Dlaczego to, a nie dekoracje pokoju: rzecz na mapie widać przy każdym wejściu
i podczas gry, rzecz w pokoju — tylko po kliknięciu drzwi. Planeta, którą
dziecko samo zmieniło, jest najsilniejszym powodem, żeby na nią wracać.

### 3. Powód, żeby wrócić jutro — bez odliczania i bez straty

- **Gwiazdki wracają co dzień.** Nowa doba → dziesięć gwiazdek z powrotem na
  polanie, Wizkor płaci mniej niż za pierwsze zbieranie. Deterministycznie
  w obrębie dnia, dokładnie jak porada. Mechanika istnieje
  (`zadanieGwiazdek`, `przywrocGwiazdkiNaMape`, respawn w scenie) — brakuje
  wyzwalacza „nowy dzień".
- **Dwa małe rytuały zamiast jednego:** karta liska rano, gwiazdki Wizkora.
  Oba kończą się same, żadne nie karze za pominięcie.
- Nie: serie, „wróć jutro albo stracisz", licznik dni.

### 4. Cechy mają coś znaczyć — najmniejszy krok, który to robi

- **Wizkor wita inaczej** zależnie od najsilniejszej cechy — pięć wariantów
  pierwszego zdania w `kwestieWizkora.js`. Same dane, zero logiki.
- **W domu rośnie coś od cechy** — pięć roślin, każda od jednej cechy,
  wysokość z `state.traits`. `DomPanel` już czyta cechy; brakuje tylko
  pięciu obrazków.
- Koła nie ruszać: jest równomierne z premedytacją (komentarz w
  `KoloFortuny.jsx`), a cechy nie mają się „domykać" w jednej.

### 5. Rozmowy: podłączyć albo zdjąć

Ikona prowadząca do atrapy uczy tego samego, co profil z zerami (własna
diagnoza z `ProfilPanel`: „uczy, że nie warto tu zaglądać"). Podpowiedzi
Mentora już płyną do Zadań — Rozmowy mogą być prawdziwym wątkiem z Mentorem,
a atrapa forum wychodzi. Jeśli nie teraz — lepiej trzy ikony w doku niż cztery,
z których jedna kłamie.

### 6. Planeta zarabia na siebie razem z punktem 1

Gdy łańcuch ma piąte i szóste ogniwo, kawałki puzzli tych misji lądują **za
horyzontem**, a Wizkor wskazuje kierunek zamiast stawiać znak. Druga polana
to dane w `mapa.json` (ścieżka, kilka drzew, woda, znak), a miejsce na nią
robi się podnosząc `swiat.promienKuli` — dziś polana zajmuje ~100° od
bieguna. Sprawdź skalę zanim cokolwiek zbudujesz: `?kula=20`, `?kula=28`
w adresie podglądu.

To nie jest osobny kierunek — to forma, jaką przyjmuje wydłużony łańcuch,
kiedy jedna polana przestaje wystarczać.

### 7. Zadanie poza ekranem: pula i cierpliwość

Dziesięć zadań to za mało na dwa tygodnie grania — dopisać (dane w
`zadania-wizkora.v1.json`, po dwa–trzy na cechę). I jedno zdanie w zwoju,
gdy dowód czeka na Mentora dłużej niż dzień: „Mentor jeszcze nie zajrzał —
to nie twoja wina". Dziecko nie ma dziś jak odróżnić „czekam" od „coś
zepsułem".

---

## Kolejność, którą bym wybrał

| krok | co | dlaczego teraz |
|---|---|---|
| 1 | dwa tutoriale + czwarta gra z zapowiedzianych | tutoriale to dni; gra to pierwszy nowy kod od czasu Biegu Liska |
| 2 | gwiazdki wracają co dzień | dni pracy, pierwszy powód powrotu poza poradą |
| 3 | rzeczy do postawienia na planecie | tydzień, domyka pętlę monet |
| 4 | Rozmowy → prawdziwy wątek z Mentorem | dni, zdejmuje kłamiącą ikonę |
| 5 | rozgałęzienie łańcucha + druga polana | z grami 5 i 6, gdy jest co rozgałęziać |

Tutoriale i krok 2 nie dotykają silnika sceny. Krok 3 to pierwszy, który dokłada
nowy rodzaj obiektu na kuli — i pierwszy, przy którym warto usiąść z dzieckiem
i popatrzeć, czy stawianie rzeczy w ogóle cieszy, zanim powstanie dziesięć
modeli.
