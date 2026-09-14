# Motywy z czterech epok — przełożone na model hybrydowy

Wydobyte 2026-09-14 z gita (403 commity, 29.03–13.09), nie z ekranów.
Cztery epoki wyciągnięte do `_epoki/` (`git worktree`, poza `git status`):

| epoka | commit | co to było | co z niej bierzemy |
|---|---|---|---|
| **marzec** | `55f9de0` | liniowy prototyp RPG: 11 kroków, 5 krain, wybory z punktami, awatar z AI | element startowy, tranzycja krainy, „odpowiedź przez przedmiot", 6 zadań z krain, model wzrostu |
| **maj** | `e9c812e` | aplikacja zakładkowa: quiz → archetyp, 336 zadań Mentora, 355 tipów, lore krain | 20 zadań, 20 kart dnia, 30 wpisów kroniki, 8 scenek, zdania do obiektów, 4 światy-rozdziały |
| **sierpień** | `34118d8` | hub, misje Wizkora, koncept „doliny na poziomach", prompty piórka | żywopłot i kładka jako rzeczy, które rosną; kamień-ślad; schody/rampa; DNA stylu do pipeline'u |
| **wrzesień** | `0b83e65` | planeta, W2, fasola | model docelowy — `docs/OPIS_PROJEKTU.md`, `docs/WERSJE_I_MOTYWY.md` |

Model docelowy w jednym zdaniu: **lisek nosi, świat rośnie** — woda z oczka
daje liść, światło z porad zapala latarnię, dowód z realu przyjęty przez
Mentora daje etap. Bez liczników, serii, typowania. Wszystko poniżej jest już
przepisane pod ten model; nic nie wraca w starym kształcie.

Przed dopisaniem do plików danych każda partia idzie przez `/panel-zadan`
(weto `psycholog` i `socjolog`, ostatnie słowo `narrator-gama`). Miejsca do
weta zaznaczone.

---

## 1. Co wraca, co nie — jedna mapa

**Wraca (przepisane):** zwój jako ceremonia · kronika dzień po dniu · łuk
trzydziestu dni liczony zamkniętymi dniami · dwie pory jako dwa pojemniki
(poranek bez ekranu, wieczór ze światłem) · sytuacje z quizu jako scenki
liska · nazwy krain jako nazwy planet-rozdziałów · element startowy jako
przedmiot, który lisek niesie · tranzycja świata jako rytuał · dowód
głosowy i rysunkowy · `highlighted` jako deszcz z tęczą · podział „resetuje
się / zostaje" = listki / etapy · żywopłot, kładka, schody, kamień-ślad
z doliny · trzy momenty rocznicowe jako zdarzenia świata.

**Nie wraca:** profil/archetyp w jakiejkolwiek formie (kody, „Mały
Gwardzisto", „urosłaś/urosłeś") · punkty, poziomy, paski, 11 kropek,
0/1000 · Piórko jako nagroda „mid-week" i piątkowy deadline · selfie
i awatar z twarzy dziecka · regeneracja awatara przez AI po każdym
przedmiocie i generowanie misji per gracz (duch dzisiejszego
`/missions/generate`) · odliczanie z auto-wyborem · obserwator
psychologiczny „nigdy nie ujawniany" · raport CASEL/VIA o dziecku ·
afirmacje, rachunki sumienia, „moje/cudze emocje" · zdrowie z tabelki ·
odpowiedzi bramkowane odsłuchem · Lustro Uczuć (ocenianie domowników) ·
muzyka z YouTube · `detectGender` z imienia.

---

## 2. Zadania Wizkora — 26 gotowych do weta

Format zwarty: tytuł · cecha · cel linia 1 / **linia 2 = zwrot akcji** ·
szept · jak · dowód (zawsze dwie drogi) · przykład · miejsca · źródło.
Wszystkie `nagroda 25`, `minuty 10` (15 gdzie zaznaczono), rodzaj
neutralny, „i tak się liczy" tam, gdzie misję dało się oblać.

Inwentarz kształtów w starej bazie (276 zadań): zrób rzecz 53 · powiedz coś
komuś 38 · odpowiedz na sygnał 31 (25 z nich o kłótni albo smutku — do
oblania, gdy dziś spokojnie) · zaplanuj 27 · zauważ 22 · wymyśl 22 ·
wytrzymaj 19 · zbierz 15 · gest 14 · zapytaj dorosłego 6 · bądź obok 6.
Rówieśnik jako równy partner: 2 na 276. Miejsca: autobus 0, klatka 0,
świetlica 0. Poniższe 26 zmienia to celowo.

### Ciekawość

**Okno na minutę** · Stań przy oknie i patrz jedną minutę. / Jeśli nic się
nie rusza — to też trop. · „To też trop." · Wybierz jedno okno i nie
odrywaj wzroku, aż minie minuta. · Zdjęcie widoku albo jedno zdanie o tym,
co się ruszało. · „Z mojego okna widać tylko parking. Ruszał się jeden gołąb
i jedna reklamówka." · dom: okno, przez które patrzysz najrzadziej ·
autobus: okno po stronie, po której zwykle nie siedzisz · klatka: okienko
na półpiętrze. · DT-TASK-023, DT-TASK-002.

**Termometr w dłoni** · Połóż dłoń na metalu, potem na drewnie. / Obie mają
tę samą temperaturę — a jednak. · „A jednak." · Dotknij po kolei dwóch
rzeczy z różnych materiałów i sprawdź, która wydaje się zimniejsza. ·
Zdjęcie obu rzeczy albo zdanie, która oszukała rękę. · „Poręcz w autobusie
zimna jak lód, siedzenie obok ciepłe. Podobno to samo powietrze." ·
autobus: poręcz i siedzenie · klatka: barierka i drzwi · kuchnia: łyżka
i deska. · DT-TASK-013, DT-TASK-027.

**Ucho zwiadowcy** · Zamknij oczy tam, gdzie jesteś, na trzy minuty. / Licz
dźwięki — najcichszy jest najważniejszy. · „Ten najcichszy." · Usiądź,
zamknij oczy i wyłapuj każdy nowy dźwięk. · Zdanie, jaki był najcichszy
dźwięk, albo zdjęcie miejsca. · „W świetlicy najciszej szumi lodówka pani.
Wcześniej wcale jej nie było słychać." · klatka: winda, drzwi, czyjeś kroki
· autobus: z zamkniętymi oczami zgadnij przystanek · świetlica: w kącie,
gdy inni grają. · DT-TASK-006, EM-TASK-027.

**Tam i z powrotem** (15 min) · W drodze tam zapamiętaj trzy szczegóły. /
W drodze z powrotem sprawdź, czy wciąż są. · „Czy wciąż są." · Wybierz trzy
drobiazgi po drodze — plamę, naklejkę, patyk — i odszukaj je, wracając. ·
Zdjęcie szczegółu, który został, albo zdanie, który zniknął. · „Kreda na
chodniku jest, patyk jest, kartonu przy śmietniku już nie ma." · szkoła:
droga tam i z powrotem · sklep: z dorosłym · klatka: od drzwi do windy. ·
DT-TASK-032 (ściśnięte z dwóch dni do jednego).

**Boczna ścieżka** · Idź dziś inną drogą niż zawsze — do szkoły, sklepu,
pokoju. / Znajdź na niej jedną rzecz, której nie znasz. · „Której nie
znasz." · Skręć raz tam, gdzie zwykle nie skręcasz. · Zdjęcie tej rzeczy
albo zdanie, co to było. · „Do sklepu poszłam drugą stroną ulicy. Jest tam
skrzynka na listy pomalowana w kropki." · droga do szkoły · korytarz
w bloku · własne mieszkanie: do kuchni przez pokój, nie przedpokój. ·
marzec, kraina 2 „Tędy do niczego nie dojdziesz".

### Tworzenie

**Rysunek na ślepo** · Narysuj coś, co masz przed sobą. / Z zamkniętymi
oczami, od początku do końca. · „Oczy zamknięte." · Zamknij oczy, trzymaj
kredkę na kartce i nie podglądaj, aż uznasz, że koniec. · Zdjęcie rysunku
albo zdanie, co to miało być. · „To miał być mój plecak. Wyszedł kot
z kółkami. Zostaje." · świetlica: ktoś obok zgaduje, co to · autobus: na
kolanie, w zeszycie · stół: portret osoby naprzeciwko. · KR-TASK-036,
KR-TASK-013.

**Celowo brzydko** · Narysuj coś jak najbrzydziej potrafisz. / A potem
podpisz to z dumą. · „Z dumą." · Rysuj tak, żeby nic nie pasowało, i podpisz
swoim imieniem. · Zdjęcie podpisanego rysunku albo zdanie, co jest w nim
najbrzydsze. · „Pies z pięcioma nogami pod fioletowym niebem. Podpis:
Arcydzieło." · stół: na lodówkę · świetlica: każde rysuje to samo, brzydko,
bez wygranych · zeszyt: ostatnia strona. · KR-TASK-020.

**Wynalazca z kieszeni** · Weź jedną rzecz, którą masz przy sobie. / Wymyśl
jej trzy nowe użycia i jedno pokaż. · „Jedno pokaż." · Wybierz przedmiot
z kieszeni albo plecaka i sprawdź, czym jeszcze może być. · Zdjęcie rzeczy
w nowej roli albo trzy pomysły w zdaniu. · „Gumka do włosów: zakładka,
obrączka na dwa palce i miarka do ciastek. Zakładka działa." · autobus:
bilet, klucz albo gumka · świetlica: coś z piórnika · kuchnia: łyżka. ·
KR-TASK-026, KR-TASK-043.

**Książka, której nie ma** · Wymyśl tytuł książki, która nie istnieje. /
Ktoś inny dopisze jej pierwsze zdanie. · „Ktoś dopisze." · Podaj komuś obok
tytuł i poproś o jedno zdanie na początek, bez poprawiania — a gdy nikogo
nie ma, dopisz je lewą ręką, i tak się liczy. · Zdjęcie kartki z tytułem
i zdaniem albo oba w wiadomości. · „Mój tytuł: „Kot, który zjadł kalendarz".
Ola dopisała: „W poniedziałek kot nie wiedział, że to poniedziałek"." ·
ławka: kolega z ławki · telefon: dorosły na zmianie dopisuje esemesem ·
świetlica: ktoś młodszy. · KR-TASK-047, KR-TASK-024 (rówieśnik dołożony).

**Trzy przedmioty** · Weź trzy rzeczy, które do siebie nie pasują. / Zrób
z nich jedną, która do czegoś służy. · „Do czegoś służy." · Połóż trzy
rzeczy obok siebie i patrz, aż zobaczysz, czym mogą być razem. · Zdjęcie
tego, co powstało, albo zdanie, do czego to jest. · „Kubek, sznurek
i klamerka. Wyszedł dzwonek na drzwi. Dzwoni cicho." · kuchnia · piórnik ·
plecak. · marzec, kraina 7 (parasol-puszka-sznurek); kształt: ograniczenie.

### Współpraca

**Obok** · Usiądź dziś obok kogoś, kto jest sam albo cicho. / Nic nie mów.
Po prostu bądź. · „Po prostu bądź." · Znajdź kogoś, kto siedzi z boku,
i zostań obok przez chwilę bez rozmowy. · Zdanie o tym, gdzie to było, albo
zdjęcie tego miejsca — bez ludzi. · „Na przerwie Kuba siedział sam na
schodach. Siedzimy razem, nic nie mówimy. Potem poszedł grać." · przerwa:
ktoś sam na ławce · świetlica: stół, przy którym nikt nie siada · dom: obok
dorosłego, który coś robi w ciszy — i tak się liczy. · EM-TASK-029.

**Echo** · Wysłuchaj kogoś przez minutę bez jednego słowa. / Potem powtórz,
co usłyszysz — jak echo. · „Jak echo." · Poproś o opowieść o dzisiejszym
dniu, milcz do końca i powtórz najważniejsze. · Zdanie z tego echa albo
zdjęcie miejsca rozmowy. · „Babcia przez telefon: kolejka u lekarza, pani
z pieskiem, numerek trzydzieści. Echo — i babcia: „no właśnie!"" ·
telefon: rodzic na zmianie, babcia · ławka: kolega o wczorajszym meczu ·
kolacja: kto zmywa, ten opowiada. · MD-TASK-004, MD-TASK-011, EM-TASK-013.

**Jedna zasada** (15 min) · Ustal z kimś jedną zasadę na dziś. / Ma
obowiązywać was oboje — Ciebie też. · „Ciebie też." · Wymyślcie razem jedną
prostą regułę, na przykład „kto pierwszy skończy, ten wybiera", i trzymajcie
się jej do wieczora. · Zdjęcie zasady na kartce albo zasada w zdaniu. ·
„Z Maćkiem: kto przegra, ten niesie piłkę. Piłkę niosę ja." · świetlica:
zasada na jedno popołudnie · podwórko: z sąsiadem z bloku, na jedną grę ·
dom: z dorosłym, na jedną kolację. · MD-TASK-023.

**Tajny pomocnik** · Zrób dziś coś pomocnego, zanim ktoś poprosi. / Tak,
żeby nikt nie wiedział, że to Ty. · „Nikt nie wie." · Wybierz jedną drobną
rzecz — kubek, buty, krzesło — i załatw ją po cichu. · Zdjęcie, zanim ktoś
zauważy, albo zdanie — tylko Mentor będzie wiedzieć. · „Buty siostry stoją
czyste. Siostra myśli, że to mama." · dom: rzecz, o którą zwykle ktoś Cię
prosi · świetlica: odłożona gra, którą ktoś zostawił · klasa: kredka
podłożona komuś, kto jej szuka. · EM-TASK-005, EM-TASK-024, LD-TASK-041.

**Dwa dlaczego** · Gdy dwie osoby chcą czegoś innego — filmu, gry, drogi —
/ zapytaj każdą „dlaczego?", zanim ktoś wybierze. · „Zanim ktoś wybierze." ·
Nie rozstrzygaj. Tylko zapytaj oboje. · Zdanie: o co poszło i co wybraliście.
Albo zdjęcie tego, co robiliście. · „Brat chciał klocki, ja film. Brat: bo
zaczął budować. Ja: bo się nudzę. Poszłam budować." · stół · świetlica ·
podwórko. · marzec, kraina 8 opcja C; kształt: wyzwalacz. *Do weta: dzień
bez sporu → „i tak się liczy": zapytaj kogoś „dlaczego" o cokolwiek.*

### Odwaga

**Ręka w górze** · Zadaj dziś jedno pytanie na lekcji. / Takie, które
wydaje Ci się głupie. · „Wydaje Ci się." · Podnieś rękę i zapytaj o to,
czego naprawdę nie rozumiesz. · Zdanie, o co było pytanie, albo zdjęcie
zeszytu z zapisanym pytaniem. · „Na matmie: dlaczego nie da się dzielić
przez zero. Pani mówiła pięć minut, pół klasy słuchało." · lekcja ·
trening albo zajęcia: pytanie do trenera · dom bez lekcji: zapytaj
dorosłego o to, o co wstyd — i tak się liczy. · LD-TASK-019.

**Pierwsze cześć** · Powiedz „cześć" albo „dzień dobry", zanim usłyszysz. /
Komuś, kogo znasz tylko z widzenia. · „Zanim usłyszysz." · Wybierz sąsiada,
panią z szatni albo kogoś z klasy i przywitaj się na głos, patrząc w oczy. ·
Zdanie, kto to był (bez nazwiska), albo zdjęcie miejsca. · „Pan z trzeciego
piętra, w windzie. Zdziwił się i powiedział „dzień dobry"." · klatka: sąsiad
mijany codziennie · szkoła: pani z szatni · klasa: ktoś, z kim jeszcze nie
było rozmowy. · LD-TASK-011. *Do weta socjologa: „znany z widzenia" to nie
obcy, ale granica jest cienka.*

**Chodź z nami** (15 min) · Zauważ kogoś, kto stoi z boku. / Powiedz trzy
słowa: „chodź z nami". · „Chodź z nami." · Rozejrzyj się na przerwie albo
w świetlicy i zaproś do zabawy tę osobę, która nie gra. · Zdanie, co
robiliście potem, albo zdjęcie gry — bez twarzy. · „Nowa z klasy stała przy
ścianie. Teraz gumę skaczemy we trzy. Nie umie, ale skacze." · przerwa ·
podwórko: ktoś na ławce przy bloku · dom: dorosły, który zwykle tylko patrzy
— i tak się liczy. · LD-TASK-024, EM-TASK-041.

**Nie, dziękuję** · Gdy dziś ktoś namawia na coś, czego nie chcesz, / powiedz
spokojnie „nie, dziękuję". Bez tłumaczenia. · „Bez tłumaczenia." · Powiedz
dwa słowa i zostań przy swoim, nawet gdy ktoś pyta „dlaczego". · Zdanie, że
się udało — o czym, zostaje Twoje — albo zdjęcie tego, co robisz zamiast. ·
„Koledzy chcieli jeszcze rundę na telefonie. „Nie, dziękuję". Kuba pytał
dlaczego. Nic więcej." · przerwa · podwórko: starsze dzieci — powiedz
i odejdź, a gdy nie słuchają, powiedz dorosłemu · sam: nikt nie namawiał?
Powiedz „nie" jednej rzeczy z rozpędu — i tak się liczy. · LD-TASK-015,
LD-TASK-030. *Do weta psychologa.*

**Cichy ratunek** · Zauważ kogoś, komu coś nie wychodzi. / Pomóż, zanim
poprosi — i nie mów, że to zadanie. · „Zanim poprosi." · Patrz, komu dziś
coś się nie udaje, i podejdź bez pytania. · Zdanie: komu i w czym. Albo
zdjęcie tego, co razem naprawiliście. · „Młodszemu w świetlicy rozsypały
się puzzle. Zbieraliśmy razem, nie wiedział, że to misja." · świetlica ·
dom · podwórko. · marzec, kraina 3 „Chowaniec"; kształt: wyzwalacz.

### Wytrwałość

**Połowa teraz** · Weź coś, na co masz ochotę, i zostaw połowę na później. /
Sprawdź, czy druga połowa smakuje inaczej. · „Druga połowa." · Podziel na
pół — słodycz, odcinek, poziom w grze — i wróć do reszty po obiedzie albo po
lekcjach. · Zdjęcie odłożonej połowy albo zdanie, czy smakowała inaczej. ·
„Pół batona po szkole, pół po kolacji. Drugie lepsze, bo się czekało." ·
świetlica: kanapka albo gra, połowa po lekcjach · dom: odcinek — połowa
przed kolacją, połowa po · kuchnia: słodycz — a gdy się nie uda, napisz, ile
udało się poczekać, i tak się liczy. · ST-TASK-015, ST-TASK-023.

**Pięć minut niczego** · Usiądź i nie rób nic przez pięć minut. / Bez
telefonu, bez rozmowy — możesz przestać, gdy zechcesz. · „Możesz przestać."
· Znajdź miejsce, usiądź i patrz przed siebie, aż samo się skończy. ·
Zdjęcie miejsca albo zdanie, ile udało się wytrzymać — każda minuta się
liczy. · „Na schodach między drugim a trzecim piętrem. Trzy minuty
i przyszła sąsiadka. Liczy się." · klatka: schody między piętrami ·
przystanek: bez telefonu · świetlica: przy oknie, gdy inni grają. ·
MD-TASK-001, ST-TASK-021, ST-TASK-050.

**Trzy oddechy** · Gdy dziś coś Cię ruszy, nie odpowiadaj od razu. /
Najpierw trzy oddechy, potem słowa. · „Najpierw oddechy." · Poczuj, że
chcesz odpowiedzieć szybko, i policz trzy powolne oddechy, zanim otworzysz
usta. · Zdanie, jak się skończyło, albo zdjęcie miejsca, gdzie się udało. ·
„Brat wziął mój kubek. Trzy oddechy. „Oddaj, proszę" zamiast krzyku.
Oddał." · przerwa: ktoś zaczepia · gra: przegrana, oddechy zanim rzucisz pada
· dom: nic nie ruszyło? Oddechy przed jedną zwykłą odpowiedzią — i tak się
liczy. · MD-TASK-020, LD-TASK-018.

**Wybierz ty** (15 min) · Oddaj dziś komuś jeden wybór, który zwykle jest
Twój. / I idź za nim do końca, bez „ale". · „Bez ale." · Powiedz „wybierz
ty" — grę, film, trasę, miejsce — i zrób to, co wybrano. · Zdanie, co
wybrano zamiast Twojego, albo zdjęcie tego, co robiliście. · „Zwykle ja
wybieram grę w świetlicy. Dziś Zosia: bierki. Nudne przez minutę, potem
nie." · świetlica: ktoś inny wybiera grę · podwórko: ktoś inny wybiera, w co
gramy · spacer: ktoś inny wybiera trasę. · LD-TASK-027, LD-TASK-038,
MD-TASK-039.

**Strażnik czasu** · Wybierz coś, co samo się dzieje: czajnik, autobus,
zachód. / Czekaj z pustymi rękami, aż się stanie. · „Z pustymi rękami." ·
Stań i patrz, nie sięgając po nic. · Zdjęcie tego, co się stało, albo
zdanie, ile trwało. · „Czekałam na czajnik bez telefonu. Gwizdnął, a ja
nie wiedziałam, że tak długo." · kuchnia: czajnik · przystanek: autobus ·
okno: zachód. · marzec, kraina 4 „Skarbiec" bez timera; kształt: ślad.

**Drugie podejście** · Wróć do czegoś, co Ci ostatnio nie wyszło. / Spróbuj
raz jeszcze — inaczej niż wtedy. · „Inaczej niż wtedy." · Przypomnij sobie
jedną rzecz, którą rzuciłeś, i zmień w niej jedno. · Zdjęcie drugiej próby
albo zdanie, co zmieniłaś. · „Wieża z klocków znowu. Tym razem szeroka
podstawa. Stoi." · klocki · zeszyt · sznurówki. · marzec, kraina 6 „Spróbuję
ponownie"; growth mindset jako praktyka, nie etykieta.

**Balans po dopisaniu:** ciekawość 5, tworzenie 5, współpraca 5, odwaga 5,
wytrwałość 6 — razem z dzisiejszymi 10 daje 36. Kształty: zauważ 6 (było 1),
bez słów 2 (było 0), sygnał ze świata albo od ludzi 5 (było 0), wytrzymaj
5 (było 2), rówieśnik jako partner 8 (było 1). Miejsca: klatka 7, autobus
5, świetlica 11, przerwa 5, telefon 2 — dom przestaje dominować. Rezerwa,
gdyby coś odpadło w wecie: DT-TASK-030 (lustro w łyżce), ST-TASK-042
(zgadnij minutę), LD-TASK-039 (dziękuję niewidocznemu), MD-TASK-014 (po
połowie).

**Czego w żadnej epoce nie ma — do napisania od zera:** rówieśnik jako
równy partner w robocie (dwa zalążki na 276) · sygnał ze świata, nie od
ludzi („gdy zacznie padać", „gdy zgaśnie światło na klatce") · „naucz mnie"
— dziecko prosi, żeby ktoś je nauczył, i dowodzi, że umie · zadanie dla
miejsca, nie dla osoby (kawałek klatki, parapetu) · wysiłek ciała w bloku
(schody zamiast windy, przystanek dalej pieszo) · wróć do tego samego po
godzinie w jednym dniu · zadanie z dorosłym przez telefon albo esemes.

---

## 3. Karty dnia — 20 do `KARTY_DNIA`

Stara baza: 6 profili × 30 dni × 3 pory = 355 tipów; po zwinięciu profili
zostaje ok. 40 czynności — ta sama rzecz chodziła w sześciu kostiumach.
Zachowane osie: dwie pory (poranek bez ekranu, wieczór ze światłem), skala
„jedna minuta", łuk trzydziestu dni liczony **zamkniętymi dniami**, nie
kalendarzem. Format: `id · tytuł · opis kafla · akcja · zapowiedź (lisek,
bez cyfr) · odzew`. Nowe akcje oznaczone; `nasłuch`, `szept`, `wspomnienie`,
`słowo` mieszczą się na jednym ekranie z liskiem, `niebo`, `światło`,
`klepsydra`, `tobołek` potrzebują elementu w scenie.

**Rano — karta brana wieczorem „na jutro"; rano gry nie ma**

- `sufit` · **Sufit** · Znajdź jedną nową rzecz nad sobą · trop · „Zanim
  wstaniesz, patrzysz w górę i szukasz jednej rzeczy, której wczoraj tam nie
  było. Zaczniemy dzień od zagadki?" · „Sufit też ma tajemnice. Dobre oko na
  dzisiaj." · DT-D01-S1
- `niebo-mapa` · **Niebo jak mapa** · Sprawdź kolor nieba i ruch chmur ·
  niebo [NOWA] · „Wyglądamy przez okno i sprawdzamy, jakiego koloru jest
  dziś niebo i czy chmury idą. Spojrzysz ze mną?" · „Zapamiętaj ten kolor.
  Wieczorem będzie inny." · DT-D03-S1
- `instrumenty-poranka` · **Instrumenty poranka** · Posłuchaj, co gra dom ·
  nasłuch [NOWA] · „Czajnik, kran, kroki, ptak za oknem — słuchamy ich jak
  instrumentów. Co dziś gra u ciebie?" · „Twój poranek ma własną muzykę.
  Usłyszeliśmy ją razem." · KR-D13-S1
- `trzy-fale` · **Trzy fale** · Trzy oddechy jak morze · oddech · „Wdech —
  fala nadchodzi, wydech — fala odchodzi, i tak trzy razy. Wypłyniemy tak
  w dzień?" · „Trzy fale i już stoisz na brzegu dnia." · EM-D17-S1
- `slonce-na-scianie` · **Słońce na ścianie** · Znajdź, gdzie pada światło ·
  światło [NOWA] · „Szukamy plamy światła — na ścianie, podłodze, stole;
  w deszcz najjaśniejszego miejsca w pokoju. Jutro będzie gdzie indziej,
  sprawdzisz?" · „Znalezione. Słońce wędruje, a ty wiesz którędy." ·
  DT-D25-S1

**Dzień — działa w bloku i w świetlicy**

- `kolor-dnia` · **Kolor dnia** · Wybierz jeden kolor, wypatruj go cały dzień
  · trop · „Wybierasz jeden kolor i przez cały dzień wypatrujesz go wszędzie:
  pod stołem, w drzewie, na czyjejś bluzie. Który bierzesz?" · „Twój kolor
  był dziś w wielu miejscach. Świat lubi, gdy ktoś go tak ogląda." ·
  KR-D07-S1
- `dzwieki-domu` · **Dźwięki domu** · Policz dźwięki wokół siebie · nasłuch
  [NOWA] · „Zatrzymujemy się i liczymy, co słychać: lodówka, drzewo za
  oknem, czyjeś kroki. Ile ich nazbierasz?" · „Dom ma swoją muzykę, a ty masz
  na nią ucho." · DT-D12-S1
- `co-sie-zmienilo` · **Co się zmieniło** · Znajdź jedną rzecz, która leży
  inaczej · trop · „Rozglądamy się i szukamy jednej rzeczy, która dziś jest
  nie tak jak wczoraj. Znajdziesz ją przede mną?" · „Uważne oko widzi drobne
  zmiany. Twoje widzi." · DT-D05-S1
- `cien-tancerz` · **Cień tancerz** · Zatańcz swoim cieniem · ruch · „Stajemy
  w słońcu albo pod lampą i puszczamy cień w tany: powolny, śmieszny, dziki.
  Pokażesz mi swój?" · „Twój cień umie tańczyć. Ja też trochę podskoczyłem."
  · KR-D18-S1
- `jedno-slowo` · **Jedno słowo** · Powiedz dziś komuś: opowiedz mi · słowo
  [NOWA] · „Wybierasz jedno z tych słów — rozumiem, opowiedz mi, dziękuję —
  i mówisz je dziś komuś naprawdę. Które bierzesz?" · „Jedno słowo, a ktoś
  został dziś usłyszany. Tak to działa." · MD-D12-S1
- `klepsydra-liska` · **Klepsydra liska** · Jedna rzecz, aż przesypie się
  piasek · klepsydra [NOWA] · „Stawiam klepsydrę, a ty robisz jedną rzecz,
  którą odkładasz, tylko dopóki leci piasek. Odwrócisz ją?" · „Piasek się
  przesypał. Koniec, choćby nie było skończone." · MD-D06-S1
- `listek` · **Listek** · Sprawdź, czy roślina ma nowy liść · trop ·
  „Podchodzimy do jakiejś rośliny — w domu, w sali, za oknem — i sprawdzamy,
  czy wypuściła nowy listek. Rośliny rosną po cichu, zobaczysz?" · „Rośnie,
  choć nikt nie patrzy. Trochę jak nasza fasola." · DT-D14-S1

**Wieczór — światło idzie do latarni**

- `trzy-zapachy` · **Trzy zapachy dnia** · Przypomnij trzy zapachy z dziś ·
  wspomnienie [NOWA] · „Przypominamy sobie trzy zapachy z dzisiaj: może
  chleb, może deszcz, może czyjaś kurtka. Powiesz mi je?" · „Zapach to
  pamięć, której nie widać. Niosę te trzy do kroniki." · DT-D20-S3
- `najcichszy-dzwiek` · **Najcichszy dźwięk** · Wyłącz, co się da, i słuchaj
  · nasłuch [NOWA] · „Wyłączamy wszystko, co się da wyłączyć, i czekamy na
  najcichszy dźwięk w pokoju. Wytrzymasz ze mną w ciszy?" · „Było go słychać.
  To dom szykuje się do snu." · DT-D12-S3
- `oddech-jak-mgla` · **Oddech jak mgła** · Trzy oddechy z lasu · oddech ·
  „Wdech nosem — wciągamy mgłę z lasu, wydech ustami — oddajemy ją, trzy
  razy. Zrobimy to razem?" · „Mgła odpłynęła. Dziś koniec tropienia." ·
  DT-D04-S3
- `pytanie-pod-poduszke` · **Pytanie pod poduszkę** · Szepnij jedno pytanie
  na noc · szept [NOWA] · „Wybierasz jedno pytanie i szepczesz je pod
  poduszkę, bo sen lubi pracować nocą nad zagadkami. Masz już swoje?" ·
  „Pytanie jest bezpieczne do rana. Może odpowiedź przyjdzie we śnie." ·
  DT-D22-S3 *(do weta)*
- `muszla` · **Muszla** · Dłoń przy uchu, posłuchaj siebie · nasłuch [NOWA]
  · „Przykładamy dłoń do ucha jak muszlę i słuchamy własnego oddechu
  i serca. Posłuchasz ze mną?" · „Muszla zna twój oddech. Jutro też będzie
  go pamiętać." · EM-D08-S1 *(do weta)*
- `jedna-lampka` · **Jedna lampka** · Zgaś górne światło, zostaw jedną ·
  światło [NOWA] · „Gasimy górne światło i zostawiamy tylko jedną lampkę, jak
  latarnię na polanie. Zrobisz tak u siebie?" · „Jedna lampka wystarczy.
  Niosę jej światło do latarni." · EM-D19-S3, DT-D26-S3
- `tobolek-liska` · **Tobołek liska** · Trzy rzeczy na jutro przy drzwiach ·
  tobołek [NOWA] · „Pakuję tobołek na jutro, a ty kładziesz przy drzwiach
  trzy rzeczy, których rano zwykle brakuje. Pakujemy razem?" · „Tobołek
  gotowy. Rano nikt niczego nie szuka." · DT-D24-S1, `ROZWIAZANIA` §6
- `niebo-nad-planeta` · **Niebo nad planetą** · Ustaw dzisiejszą pogodę
  w sobie · niebo [NOWA] · „Ustawiamy niebo nad planetą tak, jaka była dziś
  pogoda w tobie: słońce, chmury, a może burza. Które niebo dziś?" · „Niebo
  ustawione. Każda pogoda ma tu miejsce." · DT-D17-S1, `ROZWIAZANIA` §4
  *(do weta; Mentor widzi tylko dziś, planeta nie reaguje)*

**Do wyrzucenia ze starej bazy** (z powodem w jednym zdaniu): 150 tipów
„mentor/rodzic" — nie głos do dziecka; najlepsze pytania („co cię dziś
zaskoczyło", „co najtrudniejsze, a co najjaśniejsze") idą do panelu Mentora
jako „co powiedzieć przy kolacji" · 48 tipów „kraina" — lore, którego nie
ma na ekranie · artefakty (Tarcza Słońca, Muszla Echa, Kompas Cieni) —
przywiązane do profilu · ciekawostki „a czy wiesz, że" — czytanie zamiast
czynności · afirmacje — stan, nie czynność · „moje/cudze emocje" —
quasi-terapia dla sześciolatka · wieczorne rachunki sumienia („gdzie
zabrakło mi odwagi") — samoocena przed snem · zdrowie z tabelki — rodzic
w kostiumie · zwroty archetypowe i podwójne końcówki — typowanie i TTS.

---

## 4. Kronika — trzydzieści wpisów do domku

Wpis po zamkniętym dniu. Numer to liczba zamkniętych dni — widoczny, nie
mówiony. Linia narratorki, rodzaj żeński, bez cyfr w tekście mówionym.

1. Pierwsze spojrzenie dnia — „Zaczęło się od jednego spojrzenia w górę."
2. Trzy szczegóły — „Zapisałam trzy drobiazgi, których nikt inny nie zauważył."
3. Niebo jak mapa — „Niebo zmieniało się co minutę i ktoś wreszcie na nie patrzył."
4. Oddech jak mgła — „Mgła przyszła z lasu i wróciła do lasu."
5. Co się zmieniło — „Jedna rzecz leżała inaczej; uważne oko ją znalazło."
6. Klepsydra — „Piasek przesypał się bez pośpiechu i jedna rzecz jest zrobiona."
7. Kolor dnia — „Cały dzień miał jeden kolor i był on wszędzie."
8. Muszla — „Dłoń przy uchu, a w niej oddech i serce."
9. Światło w oknie — „Wieczór miał inny odcień niż wczoraj; zapamiętałam go."
10. Pytanie do siebie — „Pytanie zadane po cichu zna swoją drogę."
11. Polanka pod gwiazdami — „Nad polaną gwiazdy, każda z jedną odpowiedzią."
12. Dźwięki domu — „Dom zagrał swoją muzykę i ktoś jej słuchał."
13. Instrumenty poranka — „Czajnik, kran i ptak zagrały dzisiejszy poranek."
14. Listek — „Roślina wypuściła listek po cichu, tak jak fasola."
15. Przystanek — „Połowa drogi. Dziś nikt nie biegł, wszyscy przystanęli."
16. Drzewo, które chodzi — „Drzewo za oknem wybrało się dziś nad morze."
17. Pogoda na twarzy — „Za oknem deszcz, w środku słońce; bywa i tak."
18. Cień tancerz — „Cień zatańczył, a lisek podskoczył razem z nim."
19. Dłonie — „Dwie dłonie, jedyne takie na świecie."
20. Trzy zapachy dnia — „Chleb, deszcz i coś jeszcze; zapisałam wszystkie trzy."
21. Wielka klepsydra — „Świat się spieszył, a piasek leciał spokojnie."
22. Pytanie do snu — „Pytanie poszło pod poduszkę; sen pracował nad nim do rana."
23. Strażniczka pytań — „Sowa przyjęła jedno pytanie na przechowanie."
24. Dźwiękowy ślad — „Jeden dźwięk został z całego dnia: niewidoczny, ale prawdziwy."
25. Słońce na ścianie — „Plama światła przeszła dziś na drugą ścianę."
26. Jedna lampka — „Zgasły górne światła; została lampka i latarnia."
27. Coś odkryte — „Dziś też coś zostało odkryte, nawet jeśli po cichu."
28. Niebo w środku — „Niebo pokazało dzisiejszą pogodę i nikt o nic nie pytał."
29. Co zostawiam — „Z całego miesiąca jedna rzecz idzie dalej."
30. Miesiąc odkryć — „Mija miesiąc odkryć. Następna kartka już czeka."

Do tego wpisy zdarzeniowe z zadań: *„Dzień czternasty — Ola przyniosła
Odwagę."* — jedno zdanie Mentora głosem (`comment_voice_url` z majowego
schematu) może być treścią tej linijki.

**Trzy momenty rocznicowe jako zdarzenia świata** — liczone zamkniętymi
dniami, grane raz, nigdy jako „przegapione":
- **pełna łodyga** (siódmy liść), przy fasoli: „Łodyga jest pełna liści.
  Fasola pamięta każdy z nich."
- **półmetek** (piętnasty), przy latarni: „Połowa drogi. Latarnia świeci
  dziś trochę dłużej i nikt nie musi biec."
- **miesiąc** (trzydziesty), przy domku: „Mija miesiąc odkryć. Kronika jest
  pełna — możesz pokazać ją komuś, komu ufasz. Następna kartka już czeka."

---

## 5. Obiekty na planecie — zdania, które już można wkleić

Po dwa zdania narratorki, bez zadania, bez nagrody, w funkcjach z
`WERSJE_I_MOTYWY.md` (brama = gry, most = przejście, latarnia = światło,
domek = kronika). Źródła obrazów: lore „kraina istnieje, gdy ktoś o niej
pamięta", „Kronika nie ocenia, zapamiętuje", ślady stóp, które gasną.

- **Brama:** „Ta brama nie ma zamka ani klucza. Stoi otworem dla każdego,
  kto tu wraca." *(zapas: „Za bramą jest to, czego jeszcze nie znasz. Lisek
  też kiedyś stał tu dłużej, niż chciał.")*
- **Most:** „Ten most nie należy do żadnego brzegu. Łączy je dopiero wtedy,
  gdy ktoś po nim idzie." *(zapas: „Most nie pyta, ile masz kroków. Liczy
  tylko ten pierwszy — reszta idzie sama.")*
- **Latarnia:** „Nie ma tu latarnika. Latarnia świeci tym, co przyniesiono
  jej za dnia." *(zanim wejdzie światło z porad: „Nocą widać ją z każdego
  miejsca na planecie.")*
- **Domek:** „Ten dom nie ocenia, tylko pamięta. Każdy dzień na planecie
  dopisuje w nim jedną linijkę." *(zanim wejdzie kronika: „Drzwi są otwarte,
  w środku jest ciepło.")*
- **Krawędź tarasu / wzniesienia:** „Za tą krawędzią coś jest. Widziałam.
  Stąd nie widać nic."
- **Schody:** „Nikt tych schodów nie podpisał. I tak wiadomo: tędy da się
  wyżej."
- **Kamienie do przeskoku:** „Tych kamieni nikt nie ułożył. Ktoś po prostu
  tędy chodził — i zrobiła się droga."
- **Kładka:** „Ktoś przerzucił deski nad wąwozem. Nie prowadzą wyżej.
  Prowadzą bliżej."

**Wizkor bez zlecenia** — trzy warianty z dawnych hintów, do puli
„nie mam dziś zwoju" (dziś zero, a to najczęstszy stan od dnia czwartego):
- „Zwoju dziś nie ma. Zostało mi jedno „nie wiem". Bierz — z tego zaczynają
  się wyprawy."
- „Dziś bez zlecenia. Możesz zrobić bałagan — każde dzieło tak zaczyna."
- **po rosie zamiast deszczu:** „Wczorajszy zwój nie doszedł? Zwoje pisze
  się od nowa. Jutro będzie świeży."

---

## 6. Światy-rozdziały — W3 i dalej

Dwa składy doszły niezależnie do tej samej triady: **fasola rośnie w górę,
następna rzecz ma rosnąć wokół, kolejna w poprzek.** Krainy z majowego lore
dają nazwy i obrazy, dolina z sierpnia daje gotowe mechanizmy (segment
żywopłotu 1 m ze stykającymi się końcami, łuk z otworem na szerokość
bohatera, kładka skalowana w Z, schody sztaplowane, kamień-krok w trzech
obrotach) — wszystko jako wpisy w `mapa.json`, bez zmiany silnika.

| świat | nazwa z lore | co rośnie i jak | co lisek nosi | przejście dalej |
|---|---|---|---|---|
| **W2** | Polana | fasola — **w górę** | krople z oczka | wspinaczka po pnączu |
| **W3** | Las Pytań / Ogród | pierścień — **wokół**: żywopłot ogrodu (assety z doliny) albo krąg świecących grzybów wokół pnia (lore: „niektóre świecą po zmroku") | zarodniki z próchna / sadzonki | domknięty pierścień otwiera łuk albo drzwi w pniu |
| **W4** | Góry (bez „Liczb") | kładka — **w poprzek** wąwozu | deski z wiatrołomu | gdy sięgnie drugiego brzegu; dopóki nie sięga, po prostu się urywa |
| **W5** | Morze Słów | ławica muszli — **wynurza się** z odpływem; muszle grają dźwięk zamiast rosnąć | muszle z brzegu | gdy da się przejść po mieliźnie |
| **W6** | Pustynia Pomysłów | łąka — **w szerz**, każdy dowód to roślina innej sylwetki | ziarna z wiatru | najpóźniej: najbliżej fasoli |
| — | Zamek Czasu | nie świat: „komnaty z zapomnianymi chwilami" to **wnętrze domku** (kronika) | — | — |
| — | Niebo Marzeń | nie rozdział: **ekran finału** — chmura, z której widać wszystkie przeszłe planety | — | — |

Każdy świat: pięć etapów = pięć cech, jak w W2; inna waga i inny gest
noszenia (sypie, kładzie, układa). Oczko i porady dają liście na tym, co
już stoi. Ślad po przyjętym dowodzie: **kamień-krok** na trasie do
następnego przejścia — dolina opisała go gotowym zdaniem: „widać, że ktoś
tędy chodzi, ale nikt tego nie zbudował". Ciąg kamieni jest kroniką
w terenie. Reguła uczciwości śladu, też z doliny: balustrada „tylko tam,
gdzie jest urwisko — inaczej kłamie". Ślad wyłącznie za rzecz, która się
zdarzyła.

Grzbiet z doliny domyka wątek latarni: stoi wyżej, a po zapaleniu widać
ją „z całej kotliny".

---

## 7. Scenki liska — „Co byś zrobił?"

Z ośmiu sytuacji quizu, po odjęciu punktów. Sytuację czyta **narratorka**
(lisek nie opowiada), lisek jest **aktorem echa**: każdy wybór odbija się
w świecie i zostawia ślad, nie nagrodę. Żadne echo nie jest lepsze. Bez
kodów, bez typowania — to ćwiczenie reakcji na spokojnie, dzień wcześniej.

**Rozsypane książki** — *„Koledze wypadła z rąk książka i wszystko
rozsypało się po podłodze. Jest mu głupio. Co byś zrobił?"*
- Schylam się i zbieram razem z nim, nic nie mówię. → Lisek podchodzi do
  przewróconego kwiatka na polanie i prostuje go bez słowa.
- Pytam: „pomóc ci? co się rozsypało?" → Na ścieżce zapala się jeden ślad
  łapy i po chwili gaśnie. Narratorka: „Pytanie zostawia trop."
- Robię z tego nasz żart, żeby śmiech zastąpił „głupio". → Lisek robi
  fikołka; drzewa gibią się, jakby przeszedł wiatr.
- Wstaję pierwszy i wołam: „pomagamy zbierać, kto ze mną?" → Lisek staje
  na moście i macha; z domku wychyla się Mędrzec i kiwa głową.

**Drzewo na ścieżce** — *„Nocą wiatr powalił drzewo w poprzek ścieżki.
Lisek stoi przed pniem. Co byś zrobił?"*
- Patrzę, gdzie pień jest najniższy, i planuję przejście. → W najniższym
  miejscu zostaje wydeptany schodek.
- Idę wzdłuż pnia sprawdzić, dokąd sięga. → Lisek dochodzi do korony
  i znajduje w gałęziach gniazdo — nowy obiekt na mapie.
- Czekam, aż ktoś przyjdzie, przejdziemy razem. → Lisek siada na pniu
  i patrzy na rzekę; pień zostaje ławką nad wodą.
- Szukam gałęzi i kamienia na oparcie. → Z głazu i pnia robi się kładka.

**Sześć w skrócie** (poprawki bezpieczeństwa zaznaczone):
- **Klucz** — „W szufladzie znajdujesz stary klucz. Nikt nie wie, do czego
  pasuje." · lista drzwi po kolei / klucz do krainy i mapa / pytam
  najstarszą osobę w domu / próbuję każdy zamek od razu.
- **Kot** — „Sąsiadka, którą znasz, zgubiła kota." · plakat / pytam ją,
  gdzie kot lubi chodzić, i rysuję trasę / zostaję z nią: koty wracają /
  proszę dorosłego z domu, żebyśmy poszukali razem *(zamiast „pytam
  każdego sąsiada")*.
- **Pochwała** — „Pani mówi przed klasą, że twoja praca była najlepsza." ·
  cieszę się głośno / myślę, co zadziałało / rysuję kartkę dla pani / mówię
  koledze obok, że to też jego zasługa.
- **Minuta** — „Wasza drużyna ma minutę, żeby wybrać, co robicie." · „robimy
  tak, kto za?" / każdy mówi pomysł, ja łączę / ważę plusy i minusy /
  rzucam zupełnie nowy pomysł.
- **Skrzynka** — „Dostajesz wielką pustą skrzynkę." · pracownia wynalazcy /
  laboratorium kamyków i liści / skarbiec z przegródkami / apteczka
  pocieszania. *Echo naturalne: wybrana skrzynka staje w domku — pierwszy
  trwały wybór dziecka w świecie.*
- **Portfel** — „Na ławce leży portfel ze zdjęciem babci z wnukiem." ·
  zanoszę znanemu dorosłemu / z dorosłym sprawdzamy, czy w środku jest imię
  / myślę, że babcia się martwi, i mówię dorosłemu / zapisuję, gdzie i kiedy
  leżał *(usunięte „pytam ludzi w parku")*.

---

## 8. Mechaniki z marca i maja, które wracają przepisane

**Element startowy → przedmiot, który lisek niesie na start** (marzec:
Lupa / Tarcza / Księga / Plecak z jednym zdaniem intencji). Po zejściu
przez chmury na polanie leży **pięć przedmiotów = pięć cech**: Lupa =
ciekawość, Tarcza = odwaga, Plecak = tworzenie, Księga = wytrwałość,
**Latarnia = współpraca** (domyka niedokończony wątek latarni). Dziecko
podnosi jeden, lisek go niesie widocznie, i to jest cecha pierwszego
zadania — dokładnie rozstrzygnięcie „dzień czwarty: cechę wybiera dziecko,
nie Koło". Pierwszy etap fasoli dostaje kolor tej cechy. Najtańszy test:
położyć pięć statycznych obiektów na polanie i patrzeć, który dzieci
podnoszą pierwszy — zanim ktoś napisze logikę.

**Tranzycja świata jako rytuał** (marzec: splash z imieniem, paleta na
krainę, świat odsłania się dopiero po). `swiat:dalej` po wspinaczce nie
ładuje W3 od razu: chowa scenę, narratorka mówi nazwę świata i imię
dziecka, W3 ma własną paletę, scena wraca zejściem przez chmury. Granica,
którą się przekracza, nie ekran, który się otwiera.

**Odpowiedź przez przedmiot, nie przez tekst** (marzec: narracja nigdy się
nie rozgałęziała po wyborze — jedyną odpowiedzią świata był nowy przedmiot
na bohaterze). Potwierdza kierunek: przyjęty dowód = rzecz w świecie.

**Czekanie jako czynność, bez odliczania** (marzec: „nie dotykaj ekranu
przez trzydzieści sekund"). Kropla wsiąka w fasolę dopiero, gdy lisek stoi
przy niej nieruchomo; krąg wypełnia się i znika. Żadnej liczby.

**Kolejka Koła z wagą** (marzec, `growthData`: „dwa z mocnych, jeden
z najsłabszego"). Po zdjęciu typowania: Koło losuje z kolejki bez powtórek,
z wagą na cechę, która ma najmniej etapów fasoli. Mechaniczne domknięcie
„szansy powtórki 52%".

**„Dotknij, aby pominąć"** (marzec). V1 blokowała odpowiedzi do końca
lektora; marzec pozwalał pominąć. Głos nigdy nie bramkuje treści.

**Z majowego `weekly_mission.json`:** dowód w sześciu formach → wracają
**głos** i **rysunek** (ratują sześciolatka, który nie pisze) ·
`highlighted` → **deszcz z tęczą**, bez dodatkowego etapu (nie robić
rankingu) · `skipped` bez kary → „pusty dzień to brak liścia, nie wyrzut" ·
„punkty tygodnia" vs „ewolucja cyklu" → **listki** (resetują się) vs
**etapy** (zostają) · „piątek o zachodzie Mentor czyta" → **tryb klasy**:
chmura czeka do końca tygodnia, rosa spada z ostatnim liściem; dorosły
wybiera rytm.

---

## 9. Słownik — co zostaje w ustach świata

**Zostaje:** trop (działanie, które zostawia ślad) · zwój (misja) · echo
(przyjęty dowód — zamiast „weryfikacja") · Kronika (domek; „nie ocenia,
zapamiętuje") · rozdział (świat — zamiast „kraina", „poziom") · Las Pytań,
Góry, Morze Słów, Pustynia Pomysłów jako nazwy planet · „Mentor nie ocenia,
zauważa" (panel dorosłego) · „tropią, słuchają, pytają i łączą" (cztery
czasowniki bohatera bez walki — kręgosłup scenek) · „kraina istnieje, gdy
ktoś o niej pamięta" (powód powrotu bez serii) · „mówi obrazami — zamiast
plus trzy punkty empatii, Kompas zaświecił mocniej" (to dosłownie
konstytucja o licznikach).

**Wypada:** Świecące Piórko jako nagroda · Kompas Cieni i artefakty
archetypowe · Iskra → Wędrowiec → Tropiciel → Mędrczyni jako poziomy
(„Wędrowiec" zostaje, bo już jest imieniem awatara) · Agent, GAMA-1, „fale
gamma" · cykl z deadlinem.

---

## 10. Co idzie pierwsze

1. **26 zadań z §2 przez `/panel-zadan`** — trzy z gwiazdką do weta
   (Pierwsze cześć, Nie dziękuję, Dwa dlaczego). Pula 10 → 36.
2. **Zdania do obiektów z §5 i trzy kwestie Wizkora bez zlecenia** — dane,
   zero kodu poza wyzwalaczem wejścia.
3. **20 kart dnia z §3** — najpierw dwanaście, które nie wymagają nowego
   elementu w scenie; `niebo`, `światło`, `klepsydra`, `tobołek` razem
   z robotami z `ROZWIAZANIA_DLA_RODZICOW.md` §12.
4. **Kronika z §4** — trzydzieści linii to dane; domek dostaje wnętrze.
5. **Pięć przedmiotów startowych** — test statyczny, potem logika.
6. **W3** — decyzja: żywopłot czy grzyby. Assety z doliny przemawiają za
   żywopłotem, lore za Lasem Pytań; nazwa może zostać z lore, mechanika
   z doliny.

Czego nie ruszać przy okazji: rozdziału głosów, `szept`, przykładów
głosem dziecka, dwóch dróg dowodu, braku ponaglania.
