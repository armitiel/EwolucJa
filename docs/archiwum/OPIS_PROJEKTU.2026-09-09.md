# EwolucJA — opis projektu dla agentów

Ten dokument mówi, **po co** jest gra i **pod jakim kątem** ma działać każdy,
kto w niej cokolwiek zmienia — kod, tekst, zadanie, grafikę, model biznesowy.
Fakty o tym, co jest na ekranie, są w `docs/KONCEPT_GRY.md`; reguły systemów
w `docs/SYSTEMY_GRY.md`; ten plik jest nad nimi. Gdy coś, co robisz, kłóci
się z tym opisem, zatrzymaj się i zapytaj autora.

## Jedno zdanie

EwolucJA to gra dla dzieci 6–12 lat, w której mały świat na ekranie jest
pretekstem, żeby dziecko **zrobiło coś naprawdę poza ekranem** — z ciekawości,
odwagi, wytrwałości, współpracy albo tworzenia — a dorosły (Mentor) to
zobaczył i przyjął.

## Dla kogo i po co

Odbiorca to dziecko (klasy 1–3 i 4–8 to dwa różne światy) oraz dorosły
obok niego: rodzic, nauczyciel, opiekun. Problem, który rozwiązujemy, jest
podwójny. Dziecko dostaje zaproszenie do działania w realnym świecie, które
nie jest lekcją ani karą. Dorosły dostaje **narzędzie do zauważania**
dziecka — dowód (zdjęcie albo jedno zdanie), który można przyjąć, o który
można zapytać, na którym można zbudować rozmowę.

Sukcesem gry jest to, że **dziecko odkłada telefon i idzie coś zrobić**.
Dlatego czas w aplikacji i „dzienni aktywni" mierzą tu porażkę, a nie
sukces. Miary, na które patrzymy: zadania zamknięte dowodem, odsetek dowodów
przyjętych przez Mentora, powrót dziecka i dorosłego liczone osobno.

## Zasada, której podporządkowane jest wszystko

**Nie zbieramy, żeby mieć więcej — zbieramy, żeby zobaczyć, co stanie się
ze światem.** Każda nagroda, licznik i mechanika ma prowadzić do zmiany
w świecie albo do działania poza ekranem. Świat odpowiada na to, co robi
dziecko; nie wyświetla liczników.

Z tego wynika konstytucja (pełna w `docs/SYSTEMY_GRY.md` §0): nic nie
wyskakuje; brak kary za nieprzeczytanie; brak odliczania, serii i losowych
nagród; każde zaczepienie prowadzi do ekranu, który sam ma wartość; jedna
liczba ma jedno źródło; tekst mówiony pisze się pod ucho; dorosły decyduje,
co jest włączone; brak sieci nie gasi treści. Nowy element, który to łamie,
jest błędem projektowym, nie funkcją.

## Co dziecko robi (cztery pętle)

1. **Gwiazdki i puzzle na polanie** — Wizkor (czarodziej) zleca zbieranie;
   z ułożonych puzzli odkrywają się minigry (Pamięć Mędrca, Lot Liska, Bieg
   Liska). To warstwa „na ekranie": krótka, spokojna, bez presji.
2. **Zadanie poza ekranem** — Koło Przeznaczenia losuje jedną z pięciu
   cech (`ciekawosc`, `tworzenie`, `wspolpraca`, `odwaga`, `wytrwalosc`),
   do cechy dobierane jest zadanie, dziecko robi je w realu, dowód idzie do
   Mentora. **To jest serce gry.** Reszta istnieje, żeby do tego doprowadzić.
3. **Porada dnia** — jedna mikroaktywność dziennie z liskiem (oddech,
   zielony trop…), deterministyczna w obrębie doby.
4. **Świat, który rośnie** (kierunek od września 2026, świat W2): mała
   planeta, doba robiona nogami (obejście = dzień i noc), Magiczna Fasola,
   którą lisek podlewa wodą z oczka, aż da się po niej wspiąć do następnego
   świata. Tu testujemy, czy „świat odpowiada" działa lepiej niż zlecenia.

## Głosy świata

Cztery głosy i wyraźny podział: **narratorka** opowiada i nie zleca;
**Wizkor** zleca i rozlicza, nie opowiada; **lisek** zaprasza do wspólnej
aktywności, nie zleca; **Mędrzec** ma jedną myśl o ciele, głosem dorosłego,
rzadko. Każdy tekst, który dziecko widzi lub słyszy, przechodzi przez
`narrator-gama` — panel specjalistów dowozi substancję, narrator robi
ostatnie przejście po tonie. Ton: ciepły, konkretny, bez infantylizacji
i bez szkolnego „zadanie domowe".

## Co jest zakazane niezależnie od tego, kto pyta

Loot boxy, waluta premium, reklamy, płatne skróty, serie i kary za
przerwę, odliczania, powiadomienia „wróć do gry", wszystko, co przywiązuje
do ekranu. Treści dla dziecka: żadnych zadań wymagających kontaktu z obcymi,
ryzyka fizycznego, wydawania pieniędzy, publikowania w sieci; nic, co
dziecko może zrobić „źle" i ponieść konsekwencję w grze. Weto w tych
sprawach mają `psycholog` i `socjolog` z panelu zadań. Ramy typu human
design są generatorem kształtów zadań, nigdy wiedzą o dziecku i nigdy nie
wychodzą na ekran.

## Model biznesowy — z czego to ma żyć

Klientem, który płaci, jest **dorosły** (rodzic, szkoła, opiekun grupy),
i płaci za to, że gra pomaga mu być z dzieckiem — nie za to, że dziecko
gra więcej. Model ma wynikać z zasad produktu, nie odwrotnie; `strateg-
produktu` pilnuje, żeby każda nowa funkcja odpowiadała na pytania „czyj
problem to rozwiązuje" i „kto za to zapłaci", oraz liczy koszt na
użytkownika (Claude, ElevenLabs, generowanie grafik — to realne koszty
za każde wywołanie).

## Styl i świat

Mała, niska poligonowo planeta w ciepłych, spokojnych barwach; miękkie
kształty, czytelne sylwetki, fasetki zamiast tekstur, żadnych ostrych
kontrastów ani „gamingowego" UI. Świat jest łagodny nawet nocą. System
stylów: `docs/SYSTEM_STYLOW.md`, `docs/grafika.md`, `docs/design-system/`.
Lore Zakątka Gamma (`agents/world/`) to tło narracji, nie lista funkcji —
opisuje zamiary, nie stan gry.

## Jak tu pracujemy — rzeczy, które kosztowały

- **Prawda o grze jest na ekranie**, nie w dokumentach koncepcyjnych:
  `docs/KONCEPT_GRY.md` (co jest), `docs/ROZWOJ_GRY.md` (gdzie się
  kończy), `docs/WARIANTY_ROZGRYWKI.md` (jak badać nowy kierunek bez
  psucia starego). Produkcja: gałąź `v2-postgres-vercel`, auto-deploy;
  czytaj `AGENT_DEPLOY_INSTRUCTIONS.md` przed każdym pushem.
- **Scena 3D ma źródła** w `frontend/scena-3d-src/`; bundle w
  `public/scena-3d/` nie jest kodem; po każdej zmianie podbij
  `WERSJA_SCENY`. Build esbuild uruchamia się na Windowsie.
- **Nad repo bywają dwie sesje naraz.** Zanim zapiszesz plik, sprawdź
  jego aktualną wersję (`git log`, `WERSJA_SCENY`); nakładaj patch, nie
  podmieniaj całych plików; nie wypychaj cudzych niedokończonych zmian.
- Klucze API (`backend/.env`) nie opuszczają maszyny autora. Tripo i
  generatory grafik odpalamy stamtąd; przed wydaniem kredytów mówimy, ile.
- **Nie dokładaj funkcji, dokładaj powody do działania poza ekranem.**
  Najcenniejsze dziś luki (z `ROZWOJ_GRY.md`): łańcuch Wizkora ma koniec,
  monety nie mają ujścia, cechy niczego nie zmieniają, pula zadań to
  10 sztuk. Każdy pomysł oceniaj po tym, którą z tych luk zamyka.

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
