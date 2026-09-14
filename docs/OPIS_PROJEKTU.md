# EwolucJA — opis projektu dla agentów

Ten dokument mówi, **po co** jest gra i **pod jakim kątem** ma działać każdy,
kto w niej cokolwiek zmienia — kod, tekst, zadanie, grafikę, system rozgrywki
czy model biznesowy.

Fakty o tym, co aktualnie jest na ekranie, są w `docs/KONCEPT_GRY.md`; reguły
systemów w `docs/SYSTEMY_GRY.md`; plan najbliższych prac w
`docs/PLAN_DZIALANIA.md`. Ten dokument stoi nad nimi. Jeżeli coś, co
projektujesz, jest sprzeczne z poniższymi zasadami — zatrzymaj się i zapytaj
autora.

Wersja z 2026-09-14. Poprzednia: `docs/archiwum/OPIS_PROJEKTU.2026-09-09.md`.

---

## Jedno zdanie

EwolucJA to gra dla dzieci 6–12 lat, w której krótka i celowo ograniczona
sesja na ekranie rozbudza ciekawość, rozpoczyna przygodę i prowadzi dziecko
do działania w prawdziwym świecie — a świat gry zmienia się w odpowiedzi na
to, co dziecko zrobiło naprawdę. Dorosły — Mentor — może to działanie
zauważyć, przyjąć i wykorzystać jako początek rozmowy.

## Dla kogo i po co

Odbiorcą jest dziecko oraz dorosły znajdujący się obok niego: rodzic,
nauczyciel lub opiekun. Klasy 1–3 i 4–8 traktujemy jako dwa różne światy
projektowe: różnią się językiem, poziomem autonomii, charakterem wyzwań
i sposobem prowadzenia.

**Dziecko** ma dostać powód, żeby zainteresować się czymś poza ekranem,
rozpocząć działanie, spróbować czegoś nowego, stworzyć coś, wykazać się
wytrwałością, współpracować, zrobić coś samodzielnie albo zauważyć coś
w swoim otoczeniu. Nie robimy z tego lekcji ani cyfrowej listy obowiązków.

**Mentor** dostaje narzędzie do zauważania dziecka. Widzi ślad działania —
zdjęcie, krótką wypowiedź albo inny prosty dowód — i może się nim
zainteresować, zapytać o doświadczenie, docenić próbę, zacząć rozmowę.
Mentor nie jest kontrolerem ani nauczycielem wystawiającym ocenę.

## Najważniejsza miara sukcesu

Sukcesem gry jest moment, w którym dziecko odkłada urządzenie, bo chce
sprawdzić albo zrobić coś w prawdziwym świecie. Czas spędzony w aplikacji
nie jest miarą sukcesu. Długie sesje, maksymalizowanie DAU i mechanizmy
trzymające dziecko przed ekranem są **sprzeczne z produktem**.

Patrzymy na: rozpoczęte działania poza ekranem, zadania zakończone realnym
działaniem, powroty po wykonaniu aktywności, interakcje dziecko–Mentor,
liczbę działań zauważonych przez Mentora, samodzielne rozpoczynanie kolejnych
aktywności oraz powrót dziecka i dorosłego liczony osobno.

## Ograniczony czas sesji

Czas pojedynczej sesji jest celowo ograniczony. Limit nie jest karą i nie
brzmi „twój czas się skończył”. Jego funkcją jest rytm:

> ekran → ciekawość → działanie poza ekranem → powrót → reakcja świata

Sesja powinna kończyć się w momencie, w którym dziecko ma powód, żeby odejść
od urządzenia. Najlepszy koniec zostawia lekki niedosyt: „chcę zobaczyć, co
się stanie, jeśli to zrobię” — nie „chcę jeszcze pięć minut pograć”.
Docelowa długość zostanie ustalona w testach; dorosły musi mieć kontrolę nad
zakresem korzystania. Nie używamy odliczania budującego presję.

*Stan kodu:* limit jest już zaimplementowany w torze `/w2`
(`frontend/src/wariant/stan.js`, `limitSesji`, domyślnie 8 minut).

## Profil dziecka na początku gry

Na początku doświadczenia pojawia się lekki test profilu. Może być
komunikowany jako test charakteru albo sposób poznania gracza, ale
wewnętrznie jest **profilem preferencji i sposobu działania**, używanym do
dobierania pierwszych doświadczeń.

Nie jest diagnozą psychologiczną. Nie przypisuje dziecka na stałe do jednego
typu. Nie mówi „jesteś takim człowiekiem”, tylko „wygląda na to, że lubisz
odkrywać rzeczy w taki sposób — zobaczmy, czy Wizkor ma dla ciebie coś
ciekawego”.

**Sześć typów** (decyzja 2026-09-14 — zwycięża zestaw z quizu i radaru;
pięcioosiowy system cech schodzi do warstwy wewnętrznej):

| kod | typ | archetyp |
|---|---|---|
| `ST` | Mądrość | Myśliciel |
| `MD` | Skupienie / łączenie | Spokojna Głowa |
| `EM` | Życzliwość | Przyjaciel |
| `KR` | Kreatywność | Wynalazca |
| `DT` | Ciekawość | Odkrywca |
| `LD` | Odwaga | Śmiałek |

Test ma formę **obrazkową**: każda odpowiedź to ilustracja w stylu gry plus
podpis 2–4 słowa, pytanie czyta Wizkor. Pełna specyfikacja i treść pytań:
`docs/TEST_OBRAZKOWY.md`.

Profil ma pomóc dobrać pierwsze zadania, żeby dziecko szybko poczuło „to jest
coś dla mnie”. Z czasem system uczy się z **rzeczywistych wyborów** dziecka,
a nie tylko z testu startowego. Typ dobiera kolejność i rekwizyty — nigdy nie
nazywa dziecka i nigdy nie zamyka mu dostępu do pozostałych aktywności.

Równolegle system może opisywać realny typ działania (rozpoczęcie,
samodzielność, organizacja, regulacja emocji, współpraca, obserwacja,
tworzenie, ruch, troska o otoczenie). Te etykiety służą projektantom
i algorytmowi; nie muszą być widoczne dla dziecka.

## Wizkor

Wizkor jest pierwszym przewodnikiem po systemie zadań — czarodziejem, który
obserwuje rozwijający się świat i wie, że pewnych rzeczy nie da się zrobić
samą magią. Na początku gry poznaje dziecko, korzysta z profilu startowego,
wybiera pierwsze typy doświadczeń, inicjuje zadania i wyjaśnia, dlaczego coś
w świecie potrzebuje działania dziecka.

Nie brzmi jak nauczyciel („twoim zadaniem jest ugotować posiłek”), tylko
tworzy sytuację budzącą ciekawość („w tej kuchni czegoś brakuje; mam pewien
pomysł, ale sam tego nie potrafię”).

Wraz z rozwojem gry rola Wizkora może maleć — docelowo coraz więcej powodów
do działania wynika bezpośrednio ze świata, a nie z poleceń postaci.

## Zadania hybrydowe

Zadanie nie musi istnieć wyłącznie poza ekranem. Może mieć dwie połączone
części.

**Część A — świat gry:** dziecko odkrywa sytuację, poznaje problem,
przygotowuje coś, uczy się podstaw mechaniki, podejmuje decyzję, zaczyna
czynność.

**Część B — prawdziwy świat:** żeby historia poszła dalej, potrzebne jest
rzeczywiste doświadczenie. Przykład: w kuchni świata gry dziecko pomaga
Wizkorowi przygotować składniki, a potem gra proponuje bezpieczną aktywność —
„znajdź w prawdziwej kuchni trzy składniki, które mogłyby znaleźć się w naszym
daniu”. W wersji zaawansowanej, zależnie od wieku i ustawień Mentora:
przygotuj razem z dorosłym prostą część prawdziwego posiłku.

Po wykonaniu aktywności dziecko wraca i **świat reaguje**. Nie „+100 XP”,
tylko: gotowy stół, nowe miejsce, rosnąca roślina, nowa postać, otwarta
droga, zmiana pogody, rozwój domu, nowy fragment planety.

## Podstawowa pętla EwolucJI

```
CIEKAWOŚĆ W ŚWIECIE
   ↓
WIZKOR / ŚWIAT DAJE TROP
   ↓
KRÓTKA AKTYWNOŚĆ W GRZE
   ↓
DZIECKO ODKŁADA EKRAN
   ↓
DZIAŁANIE W PRAWDZIWYM ŚWIECIE
   ↓
PROSTY ŚLAD / DOWÓD
   ↓
MENTOR ZAUWAŻA
   ↓
POWRÓT
   ↓
ŚWIAT SIĘ ZMIENIA
   ↓
POJAWIA SIĘ NOWA CIEKAWOŚĆ
```

To jest najważniejsza pętla produktu.

## Co dziecko robi — główne pętle

1. **Krótka eksploracja świata.** Dziecko porusza się po planecie, odkrywa
   miejsca, bohaterów, gwiazdki, puzzle i krótkie aktywności. Minigry
   (Pamięć Mędrca, Lot Liska, Bieg Liska) są warstwą ekranową: krótkie,
   spokojne, bez presji. Ich celem nie jest zatrzymanie dziecka w aplikacji.
2. **Profil → Wizkor → pierwsze przygody.** Profil dobiera pierwsze
   doświadczenia: zainteresowanie tworzeniem → przygoda wymagająca zbudowania
   czegoś; ciekawość → tajemnica do zbadania; współpraca → historia wymagająca
   Mentora. Profil nie zamyka dostępu do reszty.
3. **Zadania poza ekranem.** Serce EwolucJI. Każde zadanie ma przypisany typ
   (sześć powyżej) oraz wewnętrzny opis realnego działania. Koło Przeznaczenia
   zostaje jako mechanika, ale **dobiera zadania sprofilowane pod typ dziecka**
   zamiast losować cechę na ślepo; jedno pole zostaje dzikie, żeby profil nie
   zamykał dziecka w koleinie.
4. **Mentor.** Po realnym działaniu pojawia się prosty ślad: zdjęcie, jedno
   zdanie, wybór odpowiedzi. Mentor go widzi. Nie „zalicza zadania”, nie
   wystawia punktów, nie decyduje, czy było wystarczająco dobrze. Jego funkcją
   jest **zauważyć**. Interfejs mówi „zobacz, co zrobił Kuba”, nie „zatwierdź
   wykonanie zadania”.
5. **Porada dnia.** Jedna niewielka aktywność z Liskiem: oddech, obserwacja,
   ruch, wyciszenie, zauważenie otoczenia. Spokojny dodatek, nie konkurencja
   dla przygody.
6. **Świat, który rośnie.** Mała planeta nie jest planszą z zadaniami, tylko
   żywą reprezentacją tego, co wydarzyło się naprawdę. Magiczna Fasola nie
   rośnie dlatego, że dziecko kliknęło przycisk — rośnie dlatego, że coś
   wydarzyło się poza ekranem. Gdy urośnie dostatecznie, przestaje być
   dekoracją: staje się drogą na wyższy poziom świata.

## Najważniejsza zasada nagradzania

**Nie zbieramy, żeby mieć więcej — działamy, żeby zobaczyć, co stanie się ze
światem.** Nie budujemy gospodarki „zadanie → monety → sklep → więcej
przedmiotów”. Model to: **działanie → konsekwencja → zmiana świata → nowa
możliwość**. Nagrodą jest „spójrz, co się wydarzyło dzięki temu, co zrobiłeś”.

Z tego wynika konstytucja (pełna w `docs/SYSTEMY_GRY.md` §0): nic nie
wyskakuje; brak kary za nieprzeczytanie; brak odliczania, serii i losowych
nagród; każde zaczepienie prowadzi do ekranu, który sam ma wartość; jedna
liczba ma jedno źródło; tekst mówiony pisze się pod ucho; dorosły decyduje,
co jest włączone; brak sieci nie gasi treści.

## Czego szczególnie unikamy

Nie projektujemy systemu: rodzic wpisuje obowiązek → dziecko wykonuje →
rodzic zatwierdza → dziecko dostaje punkty. To byłaby cyfrowa tablica
obowiązków. Rodzic może współuczestniczyć, ale świat nie może być przebranym
systemem kontroli rodzicielskiej.

## Co jest zakazane niezależnie od tego, kto pyta

Loot boxy, waluta premium, reklamy, płatne skróty, serie i kary za przerwę,
odliczania, powiadomienia „wróć do gry”, wszystko, co przywiązuje do ekranu.

Treści dla dziecka: żadnych zadań wymagających kontaktu z obcymi, ryzyka
fizycznego, wydawania pieniędzy, publikowania w sieci; nic, co dziecko może
zrobić „źle” i ponieść konsekwencję w grze. Weto w tych sprawach mają
`psycholog` i `socjolog` z panelu zadań. Ramy typu human design są
generatorem kształtów zadań, nigdy wiedzą o dziecku i nigdy nie wychodzą na
ekran.

## Głosy świata

Cztery głosy i wyraźny podział: **narratorka** opowiada i nie zleca;
**Wizkor** zleca i rozlicza, nie opowiada; **lisek** zaprasza do wspólnej
aktywności, nie zleca; **Mędrzec** ma jedną myśl o ciele, głosem dorosłego,
rzadko. Każdy tekst, który dziecko widzi lub słyszy, przechodzi przez
`narrator-gama` — panel specjalistów dowozi substancję, narrator robi ostatnie
przejście po tonie. Ton: ciepły, konkretny, bez infantylizacji i bez szkolnego
„zadanie domowe”.

## Pierwsze minuty gry — kierunek

1. **Przybycie.** Dziecko poznaje mały świat i jego mieszkańców. Bez długiego
   tutorialu.
2. **Poznanie dziecka.** Wizkor przeprowadza lekkie profilowanie przez kilka
   ciekawych wyborów i sytuacji. Nie wygląda to jak formularz psychologiczny.
3. **Pierwsza mała rzecz w świecie.** Krótka aktywność na ekranie
   z natychmiastową informacją: świat potrafi reagować.
4. **Pierwsza tajemnica.** Pojawia się coś, czego nie da się rozwiązać samym
   klikaniem.
5. **Pierwsza wyprawa poza ekran.** Wizkor proponuje bardzo prostą aktywność
   dopasowaną do profilu: łatwą, bezpieczną, krótką, ciekawą, możliwą bez
   przygotowań.
6. **Koniec sesji ekranowej.** Gra świadomie zostawia dziecko z powodem do
   odejścia od urządzenia.
7. **Mentor.** Dziecko zostawia prosty ślad; Mentor go zauważa.
8. **Powrót.** Dziecko odkrywa realną zmianę świata. To pierwszy moment „to,
   co zrobiłem naprawdę, zmieniło to miejsce” — i to doświadczenie sprzedaje
   dziecku cały koncept EwolucJI.

## Model biznesowy — z czego to ma żyć

Klientem, który płaci, jest **dorosły** (rodzic, szkoła, opiekun grupy),
i płaci za to, że gra pomaga mu być z dzieckiem — nie za to, że dziecko gra
więcej. Model ma wynikać z zasad produktu, nie odwrotnie. `strateg-produktu`
pilnuje, żeby każda nowa funkcja odpowiadała na pytania „czyj problem to
rozwiązuje” i „kto za to zapłaci”, oraz liczy koszt na użytkownika (Claude,
ElevenLabs, generowanie grafik — to realne koszty za każde wywołanie).

## Styl i świat

Mała, niskopoligonowa planeta w ciepłych, spokojnych barwach; miękkie
kształty, czytelne sylwetki, fasetki zamiast tekstur, żadnych ostrych
kontrastów ani „gamingowego” UI. Świat jest łagodny nawet nocą. System
stylów: `docs/SYSTEM_STYLOW.md`, `docs/grafika.md`, `docs/design-system/`.
Lore Zakątka Gamma (`agents/world/`) to tło narracji, nie lista funkcji.

## Test, który powinien przejść każdy nowy pomysł

Przed dodaniem funkcji odpowiedz:

- Czy zwiększa ciekawość dziecka?
- Czy daje powód do działania poza ekranem?
- Czy zwiększa samodzielność zamiast kontroli?
- Czy świat może odpowiedzieć na to działanie?
- Czy Mentor ma okazję dziecko zauważyć?
- Czy można osiągnąć ten sam efekt bez wydłużania czasu ekranowego?

Jeżeli odpowiedzi są słabe, funkcja prawdopodobnie nie należy do EwolucJI.

## Jak tu pracujemy — rzeczy, które kosztowały

- **Prawda o grze jest na ekranie**, nie w dokumentach koncepcyjnych:
  `docs/KONCEPT_GRY.md` (co jest), `docs/ROZWOJ_GRY.md` (gdzie się kończy),
  `docs/WARIANTY_ROZGRYWKI.md` (jak badać nowy kierunek bez psucia starego).
  Produkcja: gałąź `v2-postgres-vercel`, auto-deploy; czytaj
  `AGENT_DEPLOY_INSTRUCTIONS.md` przed każdym pushem.
- **Scena 3D ma źródła** w `frontend/scena-3d-src/`; bundle w
  `public/scena-3d/` nie jest kodem; po każdej zmianie podbij `WERSJA_SCENY`.
  Build esbuild uruchamia się na Windowsie.
- **Nad repo bywają dwie sesje naraz.** Zanim zapiszesz plik, sprawdź jego
  aktualną wersję (`git log`, `WERSJA_SCENY`); nakładaj patch, nie podmieniaj
  całych plików; nie wypychaj cudzych niedokończonych zmian.
- Klucze API (`backend/.env`) nie opuszczają maszyny autora. Tripo
  i generatory grafik odpalamy stamtąd; przed wydaniem kredytów mówimy, ile.
- **Nie dokładaj funkcji, dokładaj powody do działania poza ekranem.**

## Role

| kto | pod jakim kątem patrzy |
|---|---|
| `strateg-produktu` | czyj problem, kto płaci, ile kosztuje na użytkownika, co mierzymy |
| panel zadań (`rodzic-1-3`, `rodzic-4-8`, `pedagog`, `psycholog`, `socjolog`, `swieze-spojrzenie`, `projektant-zadan`, `copywriter`) | zadania poza ekranem: wykonalne w domu i w szkole, bezpieczne, niewykluczające, z dowodem, w dwóch wersjach wiekowych |
| `narrator-gama` | ton każdego zdania dla dziecka |
| `scena-3d` | świat, który odpowiada; planeta, fasola, formy terenu |
| `nowa-minigra`, `tester-e2e`, `deploy` | rzemiosło: kontrakt osadzenia gier, sprawdzenie przed wypchnięciem, produkcja |

Autor: Amitiel (artysta i projektant — patrzy na grę okiem plastyka:
sylwetka, kolor, ruch, ciepło). Język pracy: polski.
