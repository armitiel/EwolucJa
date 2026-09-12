# Pierwsza minuta — projekt wejścia do gry

Spisane 2026-09-12 na podstawie briefu „Ewolucja" i tego, co silnik
`frontend/scena-3d-src/` naprawdę już potrafi. Czytaj razem z
`docs/WARIANTY_ROZGRYWKI.md` (jak to badać) i pamięcią
`project_doba_i_teren_fasetowany.md` (jak działa doba).

Zasada nadrzędna z briefu, do której wszystko poniżej jest podporządkowane:
**nie zbieramy, żeby mieć więcej — zbieramy, żeby zobaczyć, co stanie się
ze światem.**

---

## 0. Jedna decyzja, od której zależy cała reszta: TEMPO

Słońce stoi w układzie planety, więc **jedno okrążenie = jedna doba**. To
znaczy, że rozmiar planety i prędkość bohatera USTAWIAJĄ DŁUGOŚĆ DNIA:

    czas okrążenia = 2πR / prędkość

Dzisiaj: R ≈ 8, bieg 3,6 j/s → **doba trwa 14 sekund**. Za szybko na
jakąkolwiek narrację: mijasz cały dzień, zanim zdążysz się rozejrzeć.

Naiwne rozwiązanie — powiększyć planetę — psuje to, co w niej najlepsze.
Przy R = 34 (doba ok. minuty) horyzont robi się prawie płaski i „mała
planeta" przestaje istnieć.

**Propozycja: planeta zostaje mała (R ≈ 11), a tempo reguluje dziecko.**

| tryb | prędkość | doba |
|---|---|---|
| marsz (domyślnie) | 1,2 j/s | **~57 s** |
| bieg | 3,6 j/s | ~19 s |

Silnik ma już oba tryby (`running`, `setRunMode`, osobne klipy). Zysk jest
podwójny: narracja dostaje oddech, a dziecko odkrywa, że **biegiem
przyspiesza dobę**. To nie jest efekt uboczny — to najtańsza możliwa lekcja
o tym, skąd bierze się dzień i noc.

**Pułapka do rozwiązania:** dziecko biegające w tę i z powrotem przez
terminator przełącza porę co sekundę. Wygładzanie w `doba.js` (1,5/s) łapie
krótki zryw, ale nie celowe wahadło. Do dopisania: minimalny czas trwania
pory, ok. 6 s.

---

## 1. Rozmieszczenie obiektów

Wszystko mierzę kątem **θ od zenitu słońca** wzdłuż jednego wielkiego koła
(„równika wędrówki"). θ = 0 to południe, 90° to terminator, 180° to północ.

Słońce stawiam **nad środkiem mapy** (`slonceNad: [0, 0]`), dzięki czemu
przeliczenie jest trywialne: `r_mapy = R · θ[rad]`, wszystko na jednym
promieniu.

| θ | co | pozycja na mapie (R = 11) | kiedy mija to dziecko (marsz) |
|---|---|---|---|
| 35° | **start** | (0, 6.7) | 0 s |
| 78° | **Kamienny Pąk** | (0, 15.0) | ~7 s, w złotym świetle |
| 90° | terminator | — | ~9 s, zmierzch |
| 112° | świetlik I | (1.4, 21.5) | ~12 s |
| 138° | świetlik II | (−1.6, 26.4) | ~16 s |
| 166° | świetlik III | (0.9, 31.8) | ~21 s |

Świetliki zbaczam o ±1,5 j. w bok, żeby droga nie była korytarzem.

Powrót do Pąka to 88° wstecz: **14 s marszem, 4,6 s biegiem.** Do przodu
jest 272°, czyli pełne okrążenie — obie drogi prowadzą do celu, tylko jedna
jest krótsza. Dziecko, które pójdzie dalej, i tak dojdzie; nie ma ślepej uliczki.

### Dlaczego akurat Pąk tuż przed terminatorem

To ostatnia rzecz, którą widać w świetle dnia. Dziecko mija ją, nie mogąc nic
zrobić, i wchodzi w noc z pytaniem. Brief nazywa to wprost: najpierw „co to
jest?", odpowiedź dopiero później.

---

## 2. Prowadzenie bez tekstu

### Sterowanie
Po 2 s bez dotknięcia ekranu pojawia się przy dolnej krawędzi blada smuga
gestu (łuk w lewo / w prawo). Znika przy pierwszym dotknięciu i nie wraca.
Żadnego ekranu instrukcji.

### Kierunek — robi go światło
Na starcie słońce stoi z boku (θ = 35°), więc cień bohatera jest długi
i wyraźny. Idąc „od cienia" idzie się w stronę słońca, idąc „za cieniem" —
w noc. Dziecko nie musi tego nazwać, żeby tym sterować.

### Pąk jako punkt orientacyjny — liczby, nie życzenia
Na małej planecie **wysokość = zasięg widoczności**:

    zasięg = R·acos(R/(R+h_oczu)) + R·acos(R/(R+h_obiektu))

Dla R = 11, oczu 0,5 i Pąka **3 j. wysokości** daje to 10,5 j., czyli **55°
łuku**. Pąk jest więc widoczny z ponad połowy dziennej strony planety —
naprawdę jest latarnią, a nie tylko tak go nazywamy. To jest argument za tym,
żeby był wysoki: nie estetyka, tylko nawigacja.

### Powrót po trzecim świetliku
Trzy sygnały naraz, żaden tekstowy:
1. **Słup światła** — Pąk wysyła powolny, pionowy puls widoczny zza horyzontu.
2. **Ślad** — na ziemi zapalają się blade znaki prowadzące krótszą drogą
   (geometrycznie to wstęga z `wstega.js`, więc ma stałą szerokość na całej kuli).
3. **Ciągnięcie** — cząstki odrywają się od Pąka i lecą w stronę bohatera,
   wskazując kierunek ruchem, a nie strzałką.

---

## 3. Licznik 1/3 → 2/3 → 3/3 bez HUD-u

Trzy warstwy, od najcichszej do najgłośniejszej:

**Warstwa 1 — kule.** Wokół bioder bohatera krąży 1, potem 2, potem 3 małe
światła. Każde nowe wchodzi spiralą, żeby przybycie było widoczne.

**Warstwa 2 — sam bohater.** Koniec ogona rozświetla się stopniowo:
przy jednej kuli tli się, przy dwóch świeci równo, przy trzech jest latarnią —
z prawdziwym światłem punktowym rzucającym blask na trawę pod łapami.
Postęp widać na postaci, nawet gdy kul nie widać zza niej.

**Warstwa 3 — świat odpowiada.** To jest ta, na której mi zależy najbardziej.
Przechodząc obok Pąka:

| masz | Pąk robi |
|---|---|
| 0 | nic — kamień, bez ruchu |
| 1 | mrugnie raz i gaśnie |
| 2 | pulsuje w rytm Twoich kul |
| 3 | otwiera się i sięga po Ciebie |

**Liczbę odczytuje się z celu, nie z licznika.** Dziecko nie dowiaduje się
„mam 2 z 3", tylko „on już prawie". To jest ta sama informacja, ale opowiedziana
przez świat — dokładnie to, o co prosi punkt 7 briefu.

---

## 4. Kamienny Pąk — jak wygląda

**Zamknięty kamienny pąk na krótkim, spękanym kikucie.** Wysokość 3 j.
(trzy razy wyższy od bohatera). Fasetowany tą samą techniką co teren, więc
należy do świata, a nie jest z innej gry. Barwa ciemnego bazaltu, kilka
kredowych, martwych żyłek.

**Nie ma żadnej animacji.** To jest cały pomysł na jego „martwość": w świecie,
w którym wszystko lekko oddycha — trawa się kołysze, chmury dryfują, planeta
się obraca — **bezruch czyta się jako śmierć bez jednego słowa.**

Wokół podstawy pierścień **popielatej ziemi**: jedyne miejsce na planecie,
gdzie fasetki nie są zielone, tylko szare. Dwa zadania naraz — przyciąga wzrok
z daleka i jest gotowym płótnem pod efekt domina.

**Dlaczego pąk, a nie uschnięte drzewo.** Pąk niesie w sobie „to się może
otworzyć". Uschnięte drzewo niesie „to się skończyło". Pierwsze zadaje
pytanie, drugie je zamyka.

---

## 5. Efekt domina — przebieg sekunda po sekundzie

| czas | co się dzieje |
|---|---|
| 0,0–0,8 s | kule odrywają się od bohatera i wlatują spiralą w Pąk |
| 0,8–1,6 s | **ciemność** — bohater zgasł, Pąk jeszcze nie zapłonął; jedyny moment ciszy w całej grze |
| 1,6–2,2 s | pęknięcie światła biegnie w górę kamienia; Pąk otwiera się w trzy płatki |
| 2,2–6,5 s | **pierścień światła biegnie po ziemi na zewnątrz** |
| 6,5–8,0 s | Pąk wyrasta w młode drzewo ze świecącą koroną |
| 8,0–9,0 s | rój świetlików wraca i osiada w koronie |
| po | jedno zdanie lektora |

**Czym jest ten pierścień, technicznie.** Jednym czołem geodezyjnym —
rosnącym kątem `θ_front` od punktu aktywacji. Każda fasetka terenu ma
policzoną odległość kątową od Pąka; gdy czoło ją mija:

- fasetka przeskakuje z popiołu w zieleń, z przestrzeleniem w jasną limonkę
  i powrotem (to daje wrażenie „żywego" koloru, nie podmiany tekstury),
- kępka trawy wyskakuje sprężyną ze skali 0,
- pół sekundy za nią kwiat,
- dalej rozwija się małe drzewo.

Czoło przebiega **~70° planety w 4 s** — to jest te 20–25% powierzchni z briefu.

**To jest jedyna rzecz w całym projekcie, której nie da się udać.** I dobra
wiadomość: teren jest już fasetowany z kolorem w wierzchołkach, więc płótno
istnieje. 720 ścianek × 3 wierzchołki to 2160 zapisów na klatkę — nic.
Rośliny to `InstancedMesh` ze skalą na instancję, wzorzec taki sam jak
`zbudujKwiaty`. Drzewa mają gotowe generatory (`sosna`, `drzewoLisciaste`).

**Świecąca korona jest nagrodą długoterminową:** od tej pory drzewo oświetla
swoją okolicę w nocy. Dziecko właśnie postawiło sobie pierwszą latarnię
i zobaczy ją przy każdym kolejnym okrążeniu.

Zdanie na koniec, jedno:
> „Niektóre rzeczy budzą się dopiero wtedy, gdy ktoś przyniesie im światło."

---

## 6. Druga misja — „Obudź deszcz"

Musi odwrócić kierunek pierwszej. Pierwsza była: **noc przygotowała dzień**.
Druga: **dzień przygotowuje noc**.

1. Nowe drzewo zrzuca **trzy nasiona** — celowo na tę stronę planety, której
   zielona fala NIE dosięgła. Są szare, zamknięte, suche.
2. W pełnym słońcu (θ blisko 0) nad jedynym oczkiem wody unosi się **mgiełka**.
   Widać ją tylko wtedy, gdy stoi się tam w mocnym świetle — o zmierzchu
   i w nocy nie ma jej wcale.
3. Mgiełka zbiera się w **jedną małą chmurę**, która zaczyna iść za dzieckiem.
   Powoli, jak balonik na sznurku. (Chmury są już bryłami w `chmury.js`.)
4. Idąc w stronę nocy, na **terminatorze** robi się chłodno i chmura puszcza —
   **pada deszcz**. Jeśli dziecko stoi wtedy nad nasionami, dostają wodę.
5. W nocy nie dzieje się nic widocznego.
6. **O świcie**, w tym samym miejscu, trzy siewki przebijają ziemię — i rusza
   druga, mniejsza fala zieleni.

Zdanie na koniec:
> „Słońce podnosi wodę do góry. Chłód każe jej spaść."

Dlaczego akurat to: uczy obiegu wody samym przeżyciem, używa doby i chmur,
które już stoją, a przede wszystkim **ustanawia regułę całej gry** —
dzień i noc to nie dwie skórki, tylko dwa uzupełniające się tryby świata.

---

## 7. Co silnik już ma, a co trzeba dopisać

### Gotowe
planeta i chodzenie dookoła · obrót trackballem · doba ze słońcem w układzie
planety, gradient nieba, tarcza słońca, księżyc, gwiazdy · chmury 3D ·
**teren fasetowany z kolorem na ściankę** · cienie rzucane · tryby marszu
i biegu z klipami · **system `znaki`** (zasięg, animacja wchłonięcia, powrót,
iskry, halo, blask) · wstęgi geodezyjne.

### Do dopisania, z uczciwą wyceną

| # | co | ile |
|---|---|---|
| 1 | bramkowanie znaków porą dnia (`tylkoNoc` / `tylkoDzien`) | drobiazg — jedno pole + `doba:pora` |
| 2 | kule wokół bohatera i blask ogona | mało |
| 3 | **czoło zieleni po ziemi** | średnio, ale płótno jest |
| 4 | rośliny wyskakujące za czołem | mało, wzorzec z `zbudujKwiaty` |
| 5 | model Pąka + otwarcie | grafika + średnio kodu |
| 6 | słup światła i ślad powrotny | mało |
| 7 | minimalny czas trwania pory dnia | drobiazg |
| 8 | mgła, chmura z wodą, deszcz (misja 2) | średnio |

**Świetliki i Pąk to wpisy w `mapa.json`, nie nowy kod** — system znaków
obsługuje jedno i drugie (`absorb: true` dla świetlików, `absorb: false,
raz: true` dla Pąka).

### Czego NIE trzeba
„Prostego resetu / kolejnego okrążenia" z listy prototypu. Planeta obraca się
dalej — **następne okrążenie JEST resetem.** Nie ma czego zerować.

---

## 8. Test z briefu — czym niesiemy każde z trzech zrozumień

| co dziecko ma zrozumieć | co to niesie |
|---|---|
| „Świat zmienia się wraz z czasem" | doba pod nogami; bieg przyspiesza ją w sposób, który widać |
| „W różnych momentach znajduję różne rzeczy" | świetliki istnieją WYŁĄCZNIE w nocy; Pąk widać tylko w dzień |
| „Jeśli je połączę, zmieniam planetę" | czoło zieleni na 70° powierzchni |

## 9. Ryzyka, uczciwie

- **Dziecko może nie zawrócić.** Łagodzone słupem światła, śladem i tym, że
  droga do przodu też dochodzi. Ale to jest rzecz do sprawdzenia na żywym
  dziecku, nie do rozstrzygnięcia przy biurku.
- **Wow działa raz.** Druga misja MUSI zazieleniać inny fragment planety,
  inaczej drugi efekt domina będzie już tylko animacją.
- **Wahadło na terminatorze** — patrz §0, potrzebny minimalny czas pory.
- **Brak HUD-u kontra istniejący hub.** Dzisiejszy `/swiat` ma dok i belkę
  monet. Nowy świat startuje bez nich; to decyzja do utrzymania, bo pierwszy
  dodany licznik zabije regułę z §3.
