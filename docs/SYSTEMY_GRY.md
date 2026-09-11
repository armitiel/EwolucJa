# Systemy gry — elementy i oddziaływania

Stan kodu na 2026-09-08. Opisuje to, co **jest**, nie to, co planowane.
Dokument dzieli grę na **kanały oddziaływania** (czym gra zaczepia dziecko)
i **pętle zadaniowe** (co dziecko z tym robi). Każdy wpis mówi: gdzie leży,
kiedy się odzywa, jaka zasada nim rządzi i jak dołożyć kolejny.

---

## 0. Konstytucja — reguły wspólne dla wszystkich kanałów

Nie są zapisane w jednym miejscu w kodzie, ale każdy moduł ich pilnuje.
Nowy element, który je łamie, jest błędem projektowym, nie funkcją.

1. **Nic nie wyskakuje.** Powiadomienia lądują w spokojnej skrzynce, a nie
   w oknie modalnym. Jedyny kanał, który zaciemnia świat, to tryb
   `reflektor` — i jest świadomie nieużywany.
2. **Brak kary za nieprzeczytanie.** Żadna nieodebrana wiadomość niczego
   nie zamyka i nie odbiera.
3. **Brak odliczania, serii i losowych nagród.** Porada dnia jest
   deterministyczna w obrębie doby — odświeżenie ekranu nie działa jak
   losowanie.
4. **Każde zaczepienie prowadzi do konkretnego ekranu**, który sam w sobie
   ma wartość. Nie ma powiadomień „wróć do gry".
5. **Jedna liczba ma jedno źródło.** Nagroda za minigrę stoi w
   `poziomyGier.js`, nie w komponencie gry — bo pokazują ją dwa ekrany naraz.
6. **Tekst mówiony pisze się pod ucho, nie pod oko.** „Pięć oddechów",
   nie „5 oddechów".
7. **Rodzic/Mentor decyduje**, które rodzaje powiadomień są włączone.
8. **Brak sieci nie gasi treści.** Strumień świata jest offline'owy;
   skrzynka zostaje widoczna bez backendu.

---

## 1. Kanały wychodzące — od najcichszego do najgłośniejszego

| # | kanał | czy przerywa grę | gdzie żyje stan | pliki |
|---|---|---|---|---|
| 1 | Plakietki w doku | nie | localStorage (per urządzenie) | `hub/nowosci.js`, `hub/HubDock.jsx` |
| 2 | Skrzynka / zwój | nie | localStorage + baza | `hub/wiadomosci.js`, `hub/MessageScroll.jsx`, `adventure/engine/notifications.js` |
| 3 | Wskazówka „dymek" | nie | localStorage | `hub/wskazowki.js`, `hub/Reflektor.jsx`, `hub/ksztaltChmurki.js` |
| 4 | Podpowiedź Mędrca | nie | pamięć sesji | `hub/PodpowiedzMedrca.jsx` |
| 5 | Kwestia postaci (Wizkor / lisek / narratorka) | zależnie | stan misji | `hub/kwestieWizkora.js`, `hub/glosLiska.js`, `components/NarratorVoice.jsx` |
| 6 | Tutorial gry | tak, raz | localStorage | `hub/zasadyGier.js`, `hub/TutorialGry.jsx` |
| 7 | Wskazówka „reflektor" | tak, blokuje świat | localStorage | `hub/wskazowki.js` — **gotowy, nieużywany** |
| 8 | Powiadomienie push (poza apką) | tak, poza grą | subskrypcja w bazie | `services/pushNotifications.js`, `backend/src/api/push.js` |

### 1.1 Plakietki w doku — „coś na Ciebie czeka"

Najcichszy kanał w grze: liczba albo kropka na ikonie doku.
**Liczba mówi ILE** (jest co odhaczyć), **kropka mówi tylko ŻE** (nowa minigra —
liczba niczego nie wnosi).

Mechanika jest jedna dla wszystkich sekcji: *zbiór dostępnych minus zbiór
obejrzanych*. Stan siedzi w localStorage, bo to stan **tego urządzenia** —
dziecko, które przeczytało porady na tablecie, na telefonie ma prawo zobaczyć
je jako nowe.

Każda zmiana ogłasza `ZDARZENIE_ZMIANY`, bo dok żyje w `Swiat.jsx`, a
odznaczanie dzieje się w panelach.

**Nowa plakietka** = jedna funkcja `saNowe…()` + `oznacz…Obejrzane()`
w `nowosci.js` i jeden wpis w `KLUCZE`. Bez własnego wzorca.

### 1.2 Skrzynka / zwój — dwa strumienie, jedna lista

Łączy powiadomienia świata (localStorage, offline) i wiadomości Mentora
(baza, `api.getAllHints`). Rodzaje są zadeklarowane w `KINDS` w
`adventure/engine/notifications.js`; dwa ponaglające są domyślnie wyłączone.
Etykiety w `KINDS` pochodzą z toru `/przygoda`, którego nie ma w grze, a UI
zgód (`getPrefs/setPref`) nie istnieje — mechanizm skrzynki jest żywy,
etykiety nie.

Kształt wpisu (`tytuł`, `treść`, `cel`) jest już taki, jakiego potrzebuje
warstwa push, więc podłączenie jej nie zmieni struktury.

**Nowy rodzaj** = wpis w `KINDS` + wywołanie `notify({ id, kind, title, body, to })`.
Pole `to` jest obowiązkowe: powiadomienie bez celu łamie regułę 4.

### 1.3 Wskazówki — chmurka celująca w jedną rzecz

Dok ma cztery ikony i dziecko nie ma powodu ich dotykać. Chmurka z dzióbkiem
wbitym w ikonę mówi dwoma zdaniami, po co tam zaglądać.

Rytm jest **świadomie późny** (`poCzasie`, `powtorkaCo`, `maksNaSesje`):
podpowiedź przy pierwszym wejściu wpada w moment, w którym dziecko i tak ma
nowy świat, sterowanie i czarodzieja. Odzywa się, dopiero gdy dziecko już
pobiegało. **Milknie na zawsze**, gdy raz tam zajrzy.

Treść jest danymi — dopisanie wpisu do `WSKAZOWKI` to wszystko, czego trzeba.
Wymaga selektora `cel` i pola `obszar` (bo dzióbek celuje w *widoczne* koło
68×68, nie w komórkę siatki).

### 1.4 Podpowiedź Mędrca — mrugnięcie okiem o ciele

Rzadko, nigdy w drodze, nie przerywa. Chowa się przy otwartym panelu.
Mówi **głosem Mentora** (`land: "mentor"`, osobny `ELEVENLABS_MENTOR_VOICE_ID`),
bo jest po stronie dorosłego, a nie fabuły. Odzywa się tylko przy włączonej muzyce.

### 1.5 Kwestie postaci — trzy głosy, trzy role

Rozdział ról jest twardy i warto go nie mieszać:

- **narratorka** — opowiada świat (`NarratorVoice.jsx`)
- **Wizkor / czarodziej** — zleca zadania (`kwestieWizkora.js`)
- **lisek** — zaprasza do wspólnego działania: porada dnia i lekka wskazówka
  do minigier (`glosLiska.js`). Nic więcej. „Zrobimy to razem" i tyle.
- **Mędrzec** — głos dorosłego (patrz 1.4)

Backend dobiera barwę po polu `land` (`ttsService.js`) — dla postaci używa się
tego samego pola, żeby nie było dwóch dróg do jednej decyzji.

Dobór kwestii Wizkora do etapu jest w JEDNYM miejscu (`powitanieCzarodzieja`),
bo pyta o to i hub, i pulpit testowy. Wcześniej siedziało w `Swiat.jsx` i stąd
wzięła się cała klasa błędów „Wizkor gubi kolejność".

### 1.6 Tutorial gry — jeden ekran dla całej rodziny minigier

Miejsce w przepływie: **ekran startowy → „Zagraj!" → tutorial → partia**.
Zasady czyta się po decyzji o graniu, bo na ekranie startowym konkurowałyby
z nagrodą i wyborem poziomu.

Reguły treści:
- **trzy kroki, nie więcej.** Czwarty to lista do przeczytania, nie wyjaśnienie.
- **pokazujemy, nie opisujemy** — każdy krok ma ruchomą miniaturę z CSS-a
  (zero plików do pobrania). Sześciolatek, który nie czyta, łapie zasadę z ruchu.
- co nie mieści się w trzech zdaniach, idzie do `stopka` albo jest znakiem,
  że gra jest za skomplikowana.
- wchodzi sam raz na grę, potem tylko po dotknięciu „?".

**Nowy tutorial** = wpis w `ZASADY` w `zasadyGier.js` (`kroki[].demo` wskazuje
miniaturę zdefiniowaną w `TutorialGry.jsx`) + stopka.

### 1.7 Push — infrastruktura gotowa, treść jeszcze nie

Klient (`isSupported / getStatus / enable / disable`) i backend (`api/push.js`,
`web-push`) stoją. **iOS działa dopiero od 16.4 i tylko przy PWA zainstalowanej
na ekranie głównym** — to nie jest błąd do naprawienia, to ograniczenie systemu.

Dziś `notify()` woła wyłącznie `adventure/engine/useAdventure.js` (2 miejsca),
czyli push realnie nie ma czego wysyłać. To jest najbliższa gotowa do podłączenia rzecz.

---

## 2. Pętle zadaniowe — co dziecko faktycznie robi

Cztery niezależne pętle. Każda ma własny zapis w localStorage, własne
zdarzenie zmiany i własny zestaw stanów odczytywalny z **jednego obiektu** —
bo inaczej Wizkor nie wie, co powiedzieć, a HUD nie wie, co pokazać.

### 2.1 Zadanie gwiazdek — licznik (`zadanieGwiazdek.js`)

Pierwsze zadanie od czarodzieja. Cztery stany: brak → zbieranie →
zebrane nierozliczone → rozliczone. Cel domyślny 10, nagroda 30 monet.

Trzymane w localStorage, bo dziecko zamyka apkę w połowie i wraca po godzinie.

### 2.2 Misje gier — gra jako znalezisko (`misjeGier.js` + `puzzleGier.js`)

Najważniejsza pętla w grze. Gry **nie są listą** widoczną od pierwszego wejścia —
są zdobyczą.

```
ukryta      → na mapie nie ma nic z tej misji, gry nie ma w zakładce
ujawniona   → Wizkor zlecił; po polanie leżą kawałki obrazka
odkryta     → układanka ułożona → gra w zakładce NA STAŁE,
              znak wchodzi na mapę jako skrót, minigra rusza OD RAZU
wygrana     → partia rozegrana
wyplacona   → Wizkor zapłacił
```

Dwie rzeczy warto znać przed zmianą:

- **Etapu „znajdź znak na mapie" NIE MA** (decyzja właściciela, 2026-08-22).
  Był drugim szukaniem pod rząd. Dziś obrazek *jest* szukaniem.
- **Kolejność jest zabezpieczona przez dane, nie przez flagę.**
  `zaliczWygrana` nie ruszy misji, której układanka nie została ułożona —
  samo `odkryta` jest dowodem i przeżywa zamknięcie apki.

Brama z puzzli (`puzzleGier.js`) staje **raz, przed pierwszą partią**, nie przed
każdą — druga byłaby karą za chęć grania. Rozmiary siatek: karty 2×2,
Lot Liska 3×3, Bieg Liska 3×3. **Liczba kawałków do zebrania = liczba pól siatki**
(„zebrałeś 4, ułóż 9" byłoby obietnicą bez pokrycia).

Znaki na mapie zdejmuje i stawia `znakiMapy.js` — jedyne miejsce sięgające do
wnętrza bundla sceny (`_app.markers`). Wszystko defensywne: gdy czegoś zabraknie,
świat działa dalej z widocznym znakiem, a nie z pustą mapą.

### 2.3 Zadanie Wizkora poza ekranem (`zadanieWizkora.js`)

Zadanie, którego **nie da się zrobić w grze** — dowodem jest zdjęcie albo własne
zdanie dziecka. Idzie istniejącym torem weryfikacji:
`POST /missions/seed` → `POST /missions/:id/submit` → Mentor w panelu → `GET /missions/:id`.

Sześć stanów: `brak → zlecone → wyslane → (poprawka) → zatwierdzone → wyplacone`.

Monety mają tu **jedno źródło prawdy: backend przy decyzji Mentora.**
Frontend pokazuje `points_awarded`, ale nie dopisuje drugiej lokalnej nagrody.

### 2.4 Porada dnia i rytuał (`poradaDnia.js`)

Tablica korkowa w pokoju dziecka, nie zapis postępu — dlatego wyłącznie
localStorage i zmiana urządzenia zaczyna od czysta.

`KARTY_DNIA` to mała biblioteka mikro-aktywności (oddech, trop, …). Ilustracja
niesie wybór tak samo jak w Minigrach, tekst dopowiada tylko, co się stanie.
Każda karta ma `zapowiedz` (co lisek mówi po wyborze) i `odzew` (co mówi po).

### 2.5 Minigry (`poziomyGier.js` + strony gier)

`POZIOMY_GIER` trzyma **wyłącznie sufit nagrody** (`monetyMax`) — bo ta sama
kwota stoi na dwóch ekranach naraz (zaproszenie liska na mapie i ekran startowy),
a dwie kopie liczby to kwestia czasu, zanim jedna zacznie kłamać.
Zasady liczenia (progi czasu, kara za pudło) zostają **w grach** — to ich strojenie.

Gra z jednym poziomem nie nazywa go (`nazwa` opcjonalna) i nie udaje wyboru.

---

## 3. Ekonomia i ślady zdobyczy

**Monety** (`services/monety.js`) mają dziś dwa źródła i jedną formułę:

```
monety w HUD = player.coins (baza) + bonusMonet() (lokalne zadania i gry)
```

To jest **świadomy dług**, nie docelowy kształt: backend nie ma końcówki
„dodaj graczowi N monet" — przyznaje je wyłącznie weryfikacja misji przez Mentora.
Liczba z bazy zostaje nietknięta, więc nic nie kłamie i nic nie trzeba cofać.
Gdy końcówka powstanie, `dodajMonety` ma wysłać wartość na serwer i wyzerować bonus.

> **Pułapka:** tędy idą wyłącznie nagrody, których backend NIE zapisuje.
> Monet za misję zatwierdzoną przez Mentora tu nie dopisujemy — będzie podwójne liczenie.

Pozostałe ślady zdobyczy:

| ślad | plik | rola |
|---|---|---|
| lot iskier do licznika | `hub/lotDoLicznika.js` | zszywa „znak zniknął" z „licznik urósł" — poza Reactem, `onDolot` woła się ZAWSZE |
| błysk gwiazdki | `components/StarBurst.jsx` | moment zaliczenia |
| celebracja | `components/Celebration.jsx` | domknięcie większej zdobyczy |
| wnętrze domku | `pages/WnetrzeDomku.jsx`, panel `DomPanel` | „co już masz" — dorobek w przestrzeni, nie na liście |

---

## 4. Warstwa dorosłego

Osobny odbiorca, osobne ekrany, osobny głos.

- **Mentor** — `pages/MentorDashboard.jsx`, `MentorClassDetail.jsx`, `MentorPairs.jsx`,
  `backend/src/api/mentor.js`. Weryfikuje dowody, przyznaje monety, wysyła podpowiedzi.
- **GM / zaproszenia** — `pages/GMPanel.jsx`, `InviteGM.jsx`, `JoinClass.jsx`.
- **Zgody na powiadomienia** — `getPrefs / setPref` w `notifications.js`.
- **Pulpit deweloperski** — `pages/DevPanel.jsx`, `hub/DevRezyserka.jsx`,
  `hub/etapyMisji.js`. Ten ostatni jest ważniejszy, niż wygląda: pozwala
  przeskoczyć na dowolny etap łańcucha, odbudowując **oba** zapisy tą samą
  drogą, którą idzie gra. Skrót przez localStorage testowałby sam skrót,
  a pierwszy stan niemożliwy w grze wyglądałby jak jej błąd.

---

## 5. Cechy — mocne strony

Pięć cech — Ciekawość, Tworzenie, Współpraca, Odwaga, Wytrwałość
(`TRAIT_LABELS` w `adventureState.js`) — widać w profilu jako „mocne strony".
Kody `EM/ST/KR/LD/DT/MD` to mapowanie legacy (`TRAIT_TO_LEGACY`) dla radaru
i raportów Mentora, nie coś, co dziecko widzi. Cechy rosną po zadaniach
(`wzmocnijCeche` w `adventure/engine/adventureState.js`). Cechę zadania poza
ekranem losuje Koło Przeznaczenia (`zadanieDlaCechy`). Agenci po stronie
backendu (`backend/src/agents/`) nie są wołani z huba.

---

## 6. Przepisy — jak dołożyć element każdego typu

### Nowa minigra (najczęstsza pomyłka w tym repo)

**Dwie listy muszą iść w parze.** Brak `id` w `GRY_W_HUBIE` = martwy kafelek.

1. `hub/data/minigry.v1.json` — wpis katalogowy (`id`, `tytul`, `opis`, `trasa`, `ikona`)
2. `hub/useHubPanel.js` → **`GRY_W_HUBIE`** — bez tego kafelek nic nie robi
3. `hub/misjeGier.js` → `MISJE` — misja odkrycia i teksty Wizkora
4. `hub/puzzleGier.js` → `SIATKI` — bok siatki bramy
5. `hub/poziomyGier.js` → `POZIOMY_GIER` — poziomy i `monetyMax`
6. `hub/zasadyGier.js` → `ZASADY` — trzy kroki tutoriala + demo
7. trasa i komponent gry
8. `Swiat.jsx` → `GRY_OSADZONE`, jeśli gra ma iść w hubie

### Nowe powiadomienie
`KINDS` w `adventure/engine/notifications.js` + `notify()` z wypełnionym `to`.

### Nowa wskazówka
Wpis w `WSKAZOWKI` (`tryb`, `cel`, `obszar`, rytm). Nic poza tym.

### Nowa karta porady dnia
Wpis w `KARTY_DNIA` + ilustracja + `zapowiedz` i `odzew` pisane pod ucho.

### Zmiana w scenie 3D
**Nigdy bezpośrednio w bundlu.** Skrypt w `frontend/narzedzia/`, który przerywa
pracę, jeśli wzorzec nie trafi dokładnie raz. Po każdej zmianie podbij
`WERSJA_SCENY` w `components/Scena3D.jsx` — pliki w `public/` nie mają hasha.

---

## 7. Luki widoczne w kodzie na dziś

| luka | gdzie | waga |
|---|---|---|
| **Tutoriale tylko dla 1 z 3 grywalnych gier** — `ZASADY` ma wyłącznie `pamiec-medrca`, a Lot Liska i Bieg Liska wchodzą bez zasad | `hub/zasadyGier.js` | wysoka — ekran gotowy, brakuje treści |
| **Push nie ma czego wysyłać** — `notify()` woła tylko `useAdventure.js` (2 miejsca), pozostałe kanały nie zasilają skrzynki | `adventure/engine/` | wysoka |
| Trzy gry w katalogu bez trasy: `echo-melodii`, `trop-tropiciela`, `zwoj-znakow` | `hub/data/minigry.v1.json` | średnia — świadome zapowiedzi |
| Tryb `reflektor` gotowy i nieużywany | `hub/wskazowki.js` | niska — czeka na rzecz, bez której dalej nie idzie |
| Bonus monet lokalny zamiast końcówki backendu | `services/monety.js` | dług opisany, świadomy |

---

*Dokument opisuje kod. Gdy zmienisz zachowanie, zmień też ten plik —
inaczej za miesiąc będzie kłamał pewniej niż brak dokumentacji.*
