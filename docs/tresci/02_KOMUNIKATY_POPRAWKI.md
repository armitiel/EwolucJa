# 02 — Inwentarz komunikatów i poprawki

> Zadanie A.1, A.2, A.4, A.5. **Bazą audytu (§1–§5) jest HEAD `596d4aa`**, linie liczone
> w plikach z HEAD. Niezacommitowane zmiany drugiej sesji (stan na 17.09, wieczór) są
> uzgodnione osobno w **§6** jako delta — tam stoją przesunięte linie i nowe komunikaty. Standard, do którego się odnoszę: `01_STANDARD_GLOSOW.md`.
> Werdykty: **zostaje / poprawka / przepisać / wyciąć**. Nowe teksty w tokenach `{m|ż}`;
> tam, gdzie komponent nie przepuszcza tekstu przez `odmienDlaGracza`, wiersz ma znacznik
> ⚙ (zależność techniczna w `tmp/tresci-notatki-A.md`).

## 1. Metoda i wynik pomiaru

Wejście: `tmp/teksty-mowione.json` (466 kwestii w głos; 387 porad dnia policzone jednym
wierszem — Zadanie C) oraz własny przegląd tekstów ekranowych z plików wymienionych w
zadaniu. Skrypt liczy długości, cyfry, brak tokenów, ozdobniki, słowa trzymające przy
ekranie, słowa o Mentorze-sędzim i monetach, obiekty spoza sceny. Naruszenia ról i prawdę
o scenie oceniałem ręcznie wiersz po wierszu (skrypt daje tylko szybkie liczniki po
słowach-kluczach). Skrypt: `tmp/tresci-skrypty/pomiar-A.py`, wynik poniżej wklejony bez zmian.

### Wynik pomiaru (skrypt `tmp/tresci-skrypty/pomiar-A.py`, stan repo 17.09.2026)

Kwestie w głos poza poradami dnia: **92** (JSON: 79 minus 2 składane w kodzie, plus 15 dopisanych z kodu). Porady dnia: 387 (Zadanie C). Teksty tylko ekranowe zebrane ręcznie: **99**.

### Długości w znakach (bez \n) — kwestie w głos

| głos | n | średnia | mediana | max |
|---|---|---|---|---|
| Wizkor | 50 | 102 | 102 | 256 |
| Wizkor-spokojny | 16 | 56 | 56 | 65 |
| lisek | 16 | 46 | 40 | 82 |
| narratorka | 7 | 55 | 46 | 103 |
| narratorka(dolina_selfie) | 3 | 56 | 76 | 77 |

### Długości — teksty ekranowe (karta postaci / toast / panel)

| kanał | n | średnia | mediana | max |
|---|---|---|---|---|
| karta | 38 | 59 | 45 | 124 |
| toast | 14 | 24 | 22 | 37 |
| panel | 47 | 39 | 35 | 87 |

Karty Wizkora > 60 zn.: **9 z 26** (w tym 5 powyżej 100 — to kwestie bez `tekstEkranu`, na kartę idzie pełny `tekst`).
Kwestie Wizkora w głos > 140 zn.: **5**; > 3 zdania: **3**.
Toasty > 28 zn.: **4 z 14** (widoczny jest TYLKO tytuł; `opis` idzie do aria-label — `Swiat.jsx:2817`).

### Liczniki (skrypt)

| co | głos (TTS) | ekran | przykłady |
|---|---|---|---|
| cyfry w tekście | 0 | 17 | `kwestieWizkora.js:250`; `kwestieWizkora.js:401`; `misjeGier.js:113`; `misjeGier.js:186` |
| forma męska o dziecku bez tokenu {m|ż} | 24 | 15 | `kwestieWizkora.js:224`; `kwestieWizkora.js:248`; `kwestieWizkora.js:311`; `kwestieWizkora.js:323` |
| tokeny rodzaju obecne | 0 | 0 |  |
| ozdobniki bez informacji (brawo/super/świetnie/wędrowcze…) | 14 | 3 | `kwestieWizkora.js:311`; `kwestieWizkora.js:323`; `kwestieWizkora.js:432`; `glosLiska.js:47` |
| trzyma przy ekranie (baw się dalej, pobiegaj, zajrzyj później, jeszcze jedna rzecz…) | 4 | 8 | `kwestieWizkora.js:108`; `kwestieWizkora.js:121`; `kwestieWizkora.js:263`; `kwestieWizkora.js:323` |
| Mentor jako sędzia (przyjął/zatwierdz/sprawdzan/poprawk/przyznał) | 1 | 6 | `kwestieWizkora.js:248`; `kwestieWizkora.js:250`; `ZadaniePanel.jsx:246`; `ZadaniePanel.jsx:281` |
| monety/skarbiec w tekście | 6 | 10 | `kwestieWizkora.js:248`; `kwestieWizkora.js:399`; `misjeGier.js:113`; `misjeGier.js:186` |
| obiekt spoza sceny (ściana, dach, studnia, wiadro, fasola, ślady na mapie, skrzynia, monety za gwiazdki) | 8 | 8 | `koniec-dnia.v1.json:stan-rzeczy`; `koniec-dnia.v1.json:nie-do-wyczarowania`; `koniec-dnia.v1.json:dzienPusty.linie[0]`; `koniec-dnia.v1.json:dzienPusty.linie[1]` |
| Wizkor mówi o monetach za real/gry | 5 | 5 | `kwestieWizkora.js:248`, `misjeGier.js:113/186/253` |
| lisek ocenia / ściga się | 5 | 0 | `poradaDnia.js:39/48/57`, `glosLiska.js:47` |
| narratorka rozlicza dziecko (zdobyłeś/znalazłeś/…) | 1 | 3 | `Onboarding.jsx:749`, `Swiat.jsx:2057/1523/1930` |
| Wizkor opisuje krajobraz | 5 | 0 | `kwestieWizkora.js:108/121`, `misjeGier.js:82/92` |
| Wizkor w trybie spokojnym: cyfry / liczenie | 3 | – | `porady-zdrowia.v1.json: woda, oddech, ramiona` |
| Wizkor bez `tekstEkranu` (pełny tekst na karcie) | – | 8 | `kwestieWizkora.js:263,285`; `misjeGier.js` granie+wyplata ×3 (ręcznie z kodu) |

Ręcznie (nie skrypt): naruszenia ról oceniane wiersz po wierszu w inwentarzu; „prawda o scenie” sprawdzona z `public/scena-3d/mapa.json` (most, brama, latarnia i domek `hut2` są UKRYTE; studni, wiadra, fasoli, ścian i dachu nie ma) i `docs/KONCEPT_GRY.md`.


**Odczyt liczb.** Wizkor mówi średnio 102 znaki, ale 5 kwestii przekracza 140, a
onboarding (256 zn.) jest niemal dwukrotnie za długi. W 8 stanach nie ma `tekstEkranu`,
więc na kartę wchodzi 100–124 znaki. W całej grze nie ma ani jednego tokenu rodzaju,
a 39 miejsc mówi do dziecka formą męską. Cyfry nie padają w mowie (0), ale 17 razy na
ekranie — głównie jako monety i liczniki „x z y”. Lisek w żywym kodzie jest czysty; jego
oceny i wyścig (5) siedzą w kartach za flagą `POKAZ_KARTY_AKTYWNOSCI = false`.

**Bilans inwentarza (policzone skryptem po wierszach tabel §2).** 141 wierszy (część
grupuje kilka tekstów tego samego typu, np. 7 przejść quizu albo 16 chmurek): **zostaje 51 ·
poprawka 51 · przepisać 31 · wyciąć 6**; 2 wiersze odsyłają do Zadań B/C (treść zadań i 387
porad). Nowe teksty sprawdzone skryptem `tmp/tresci-skrypty/sprawdz-limity-A.py` (tokeny
rozwinięte na dłuższy wariant, `{tytuł}` = 18 zn., `{miejsce_reakcji}` liczone jako
placeholder): po naniesieniu recenzji (§7) wynik **`problemów: 0`** — zero kart Wizkora > 60,
zero kwestii > 140, zero cyfr w polach mówionych, zero słów zakazanych (w tym „na zewnątrz”
i terminy „zanim…” po dopisaniu ich do listy w 01 §3 nie występują w nowych tekstach).

**Delta z kopii roboczej (§6).** Druga sesja zmieniła 12 tekstów z inwentarza (0 naprawionych
w całości, 4 częściowo, 6 nadal do poprawki — w tym 2 pogorszone, 2 zmienione i nadal „zostaje”)
i dodała 3 nowe komunikaty (+1 kwestia w głos: Wizkor po gwiazdkach, 139 zn.; +2 ekranowe:
toast i pasek). Po delcie: kwestie w głos 93, ekranowe 101; liczniki z §1 (mierzone na HEAD)
zmieniają się o: cyfry na ekranie bez zmian, „wędrowcze” +1, monety w ustach Wizkora bez zmian.

**Rozbieżności z sekcją 5 promptu.** (a) `Onboarding.jsx:396` mówi głosem `las_decyzji`,
nie `dolina_selfie` (JSON się myli); `:364` i `:749` nadal używają kluczy marcowych krain
(`dolina_selfie`, `gora_podsumowania`+`celebration`). (b) Karty liska z ocenami są
wyłączone flagą — nie są dziś na produkcji. (c) `PytanieSpotkania.jsx` nie jest nigdzie
importowany — poza inwentarzem. (d) `wiadomosci.js:105–108` (statusy „Mentor prosi o
poprawkę”, „Sprawdź, czy wrócił”) obsługuje tor `/przygoda`, wyłączony
(`POKAZ_MISJE_PRZYGODY = false`) — do wycięcia razem z torem, nie do poprawki.
(e) `HintPopup.jsx` milczy na `/swiat`, ale **nie** na `/games/*` — ekran „MENTOR
ZATWIERDZIŁ / Świetna robota!” może wskoczyć w środku minigry.

## 2. Inwentarz

Kolumny: gdzie · głos · typ · obecny tekst (≤ 80 zn.) · problem · werdykt · nowa karta ·
nowy głos · wariant 1–3 / 4–8 (gdy inny). Głosy: W = Wizkor, Ws = Wizkor spokojny,
L = lisek, N = narratorka, UI = bez głosu, M = Mentor-tekst. Moment wyświetlenia w kolumnie „typ”.

### 2.1 Landing `/` i Onboarding `/onboarding`

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowa karta | nowy głos | 1–3 / 4–8 |
|---|---|---|---|---|---|---|---|---|
| `Landing.jsx` przycisk START | UI | CTA, wejście | START | – | zostaje | – | – | – |
| `Onboarding.jsx:364` | N (`dolina_selfie`) | onboarding, ekran imienia | Witaj, wędrowcze… Zanim ruszymy w tę przygodę — powiedz mi, jak masz na imię? | „wędrowcze”; klucz głosu z wycofanej krainy; to kwestia Wizkora (on „poznaje dziecko”), nie narratorki | przepisać | Jak mam do ciebie mówić? | (W) Jestem Wizkor. Zanim wejdziemy, powiedz mi, jak masz na imię. | 1–3: karta = głos |
| `Onboarding.jsx:396` | W | onboarding, intro quizu, 256 zn. | Witaj. Cieszę się, że tu jesteś. Świat Ewolucji właśnie otwiera przed tobą swoje bramy… | za długie (256 > 140), 7 zdań, „odpowiadaj szczerze” = ocena szczerości, „siła w tobie drzemie” orzeka o dziecku | przepisać | Kilka pytań o bohatera. Zaczynamy? | Dobrze, {imie}. Zanim wejdziesz, pokażę ci kilka sytuacji. Wybierz, co zrobi bohater — a ja będę wiedział, od czego zacząć. | 4–8: „Wybierz, jak działa bohater. To mi powie, od czego zacząć.” |
| `Onboarding.jsx:47–53` (7 przejść) | W | onboarding, przed pyt. 2–8 | Dobrze… słyszę cię. / Hmm, to ciekawe… / Czuję, że zaczynam cię już rozumieć… / Świetnie… / Półmetek… / Widzę, co Cię porusza… / Ostatnie pytanie. Skup się… | Wizkor komentuje dziecko („zaczynam cię rozumieć”, „widzę, co Cię porusza”), ozdobniki („Świetnie”, „Hmm”), „skup się” = pouczenie | przepisać | – (ekran pokazuje tylko pytanie) | 2: „Dalej.” · 3: „A tu?” · 4: „Jeszcze jedno.” · 5: „Połowa za nami.” · 6: „Teraz coś innego.” · 7: „Prawie koniec.” · 8: „Ostatnie.” | jedna wersja |
| `Onboarding.jsx:359` | UI | CTA | Dalej / Otwieram bramę… | – | zostaje | – | – | – |
| `Onboarding.jsx:279` | UI | ekran przelotu | Otwieram świat… | – | zostaje | – | – | – |
| `Onboarding.jsx:549` | UI | ujawnienie profilu, chip | Twój archetyp | etykieta, słowo dla dorosłych | poprawka | Twoja siła na start | – | – |
| `Onboarding.jsx:573` (`PROFILE_INFO.name`) | UI | ujawnienie, nazwa | Odkrywca / Przyjaciel / Myśliciel / Wynalazca / Śmiałek / Spokojna Głowa | tylko forma męska; dziewczynka czyta nie o sobie | poprawka ⚙ | {Odkrywca\|Odkrywczyni}, {Przyjaciel\|Przyjaciółka}, {Myśliciel\|Myślicielka}, {Wynalazca\|Wynalazczyni}, {Śmiałek\|Śmiałka}, Spokojna Głowa (`nazwaArchetypuGracza` już to umie) | – | – |
| `Onboarding.jsx:29–34` tagline ×6 | UI | ujawnienie | Nic nie umknie Twojej uwadze. / Twoje serce widzi… / Trzy kroki do przodu, zawsze. / Robisz z kartonu kosmiczny statek. / Idziesz pierwszy, nie z pychy — z troski. / Słyszysz to, czego inni… | orzekają o dziecku („jesteś taki”); LD „Idziesz pierwszy” bez tokenu; ST/LD język dorosłych | przepisać | DT: Lubisz sprawdzać, co jest dalej. · EM: Zauważasz, gdy komuś czegoś brakuje. · ST: Lubisz najpierw pomyśleć, potem zrobić. · KR: Z kartonu potrafisz zrobić statek. · LD: Lubisz spróbować, zanim ktoś powie „nie da się”. · MD: Umiesz robić jedną rzecz naraz, do końca. | – | 1–3: bez zmian, lektor czyta tylko pytanie |
| `Onboarding.jsx:29–34` description ×6 | UI | ujawnienie | Cicho stąpasz przez świat… Rozwijasz dociekliwość, uważność i sztukę zadawania pytań. (itd.) | „Rozwijasz X, Y i Z” = język raportu; słowa spoza wieku („samokontrola”, „ekspresja”, „nieszablonowe”) | przepisać | jedno zdanie o tym, CO DOSTANIE: DT: „Wizkor zacznie od zagadki ze świata.” · EM: „…od kogoś, komu czegoś brakuje.” · ST: „…od rzeczy, którą trzeba wymyślić.” · KR: „…od miejsca, gdzie czegoś nie ma.” · LD: „…od tego, co podobno się nie da.” · MD: „…od czegoś cichego, z wyraźnym końcem.” | – | – |
| `Onboarding.jsx:588` | UI | CTA | Start | – | zostaje | – | – | – |
| `Onboarding.jsx:728` | UI | celebracja po quizie | Twoje szczere odpowiedzi zasłużyły na pierwszą nagrodę. | ocena szczerości, nagroda za test | wyciąć (cały ekran monet; zostaje samo przejście do profilu) | – | – | – |
| `Onboarding.jsx:749` | N (`gora_podsumowania`, ton `celebration`) | celebracja, głos | Brawo! Zdobyłeś pierwsze 50 złotych monet. Twój skarbiec dopiero się otwiera. | narratorka rozlicza; „brawo”; cyfra; skarbca nie ma; monety za test | przepisać | – | (N, `calm`) Świat Ewolucji jest otwarty. Na polanie czeka lisek. | – |
| `Onboarding.jsx:736` | UI | CTA po celebracji | Odkryj swoją siłę → | decyzja autora | zostaje | – | – | – |
| quiz `quiz.questions[]` | W (czyta pytanie) | pytania z backendu | (backend) | poza zakresem A — audyt w `docs/TEST_OBRAZKOWY.md` | – | – | – | – |

### 2.2 Świat `/swiat` — okna Wizkora (`hub/kwestieWizkora.js`, `hub/misjeGier.js`)

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowa karta | nowy głos | 1–3 / 4–8 |
|---|---|---|---|---|---|---|---|---|
| `kwestieWizkora.js:432–437` | W | onboarding świata, pierwsze podejście do Wizkora | Witaj, mały wędrowcze! Jestem Wizkor, opiekun Świata Ewolucji. Na polanie ukryło się 10 złotych gwiazdek… | „mały wędrowcze”; cyfra w TTS; „opiekun” (kanon: przewodnik); przycisk „Ruszam po gwiazdki!” ok | przepisać ⚙ | Na polanie spadło dziesięć gwiazdek. Znajdziesz je? | Jestem Wizkor. W nocy z polany spadło dziesięć gwiazdek i leżą w trawie. Pozbierasz je? | 1–3: głos = karta + „Leżą w trawie.” |
| `kwestieWizkora.js:419–424` | W | w trakcie gwiazdek (dziś tylko z pulpitu) | Widzę, że szukasz. Masz 3 z 10 gwiazdek — zostało 7. Świecą w trawie… | licznik „x z y”, „zostało” | poprawka | Szukaj gwiazdek w trawie. | Widzę, że szukasz. Jeszcze kilka świeci w trawie — trzeba tylko wbiec. | – |
| `kwestieWizkora.js:399–405` | W | pochwała, komplet gwiazdek | Masz je wszystkie! 10 gwiazdek, co do jednej. Należy ci się 10 monet — bierz. | monety w ustach Wizkora, cyfry, „należy ci się”; nagrodą ma być zmiana świata | przepisać ⚙ | Wszystkie gwiazdki! Polana jaśniej świeci. | Wszystkie, co do jednej. Popatrz na polanę — jest jaśniej niż rano. | przycisk: „Patrzę!” zamiast „Odbieram nagrodę!” |
| `kwestieWizkora.js:157–163` | W | zlecenie drewna | Widzisz to wielkie drzewo na polanie? Zbudujemy na nim domek. Ścięte drzewo da deski na pomost, głaz da kamienie pod drabinkę. Przynieś jedno i drugie… | 4 zdania (>3), 158 zn.; „ścięte drzewo” — kanon: tylko suche/powalone; karta ok | poprawka | Zbudujemy domek na drzewie.\nZetnij suche drzewko i przynieś drewno. | Na tym drzewie stanie domek. Na pomost trzeba desek. Zetnij suche drzewko i przynieś trzy stosy drewna pod wielkie drzewo. | wersja GŁÓWNA wg §3 promptu (tylko suche/powalone; po `da86ca2` etap 1 = trzy stosy drewna, głaz bez rozbijania). Alternatywa z kopii roboczej („zetnij jedno drzewo”) — do decyzji autora, `06` pkt 13–14 |
| `kwestieWizkora.js:196–209` (składane) | W | w trakcie drewna | Dobrze idzie. Drewno czeka tam, gdzie je ściąłeś — zanieś je pod drzewo. Zostało jeszcze: głaz. | „ściąłeś/rozbiłeś” bez tokenu; „Zostało:” | poprawka ⚙ | Zanieś drewno pod drzewo. Potem głaz. | Drewno czeka tam, gdzie {ściąłeś\|ścięłaś} drzewko — zanieś je pod drzewo. Głaz jeszcze stoi. | – |
| `kwestieWizkora.js:224–229` | W | pochwała, komplet materiału | Wszystko leży pod drzewem — sam to przyniosłeś. Zbijmy pomost i drabinkę. Domek dobudujemy innego dnia. | „sam… przyniosłeś” bez tokenu; reszta dobra | poprawka ⚙ | Budujemy pomost na drzewie! | Wszystko leży pod drzewem — {sam\|sama} to {przyniosłeś\|przyniosłaś}. Zbijmy pomost i drabinkę. Domek dobudujemy innego dnia. | – |
| `misjeGier.js:82–86` | W | zlecenie Gry na Pamięć | Masz oko do gwiazdek, wędrowcze. Teraz coś trudniejszego: mój obrazek rozsypał się… (172 zn.) | >140, „wędrowcze”, opis wiatru | poprawka | (jest: :388) Zbierz kawałki obrazka na polanie. | Mój obrazek rozsypał się po polanie. Pozbieraj kawałki i ułóż go, a karta zostanie twoja. | – |
| `misjeGier.js:92–95` | W | zbieranie | Kawałki obrazka błyszczą w trawie po całej polanie. Zbierz wszystkie, a ułożymy z nich mój obrazek. | ok (karta :375) | zostaje | – | – | – |
| `misjeGier.js:99–102` | W | komplet kawałków | Masz wszystkie kawałki! Ułóż z nich obrazek, a od razu rozłoży się stół pełen par. | ok | zostaje | – | – | – |
| `misjeGier.js:106–109` | W | gra zdobyta, do rozegrania | Karta jest twoja — masz ją już w skrzyni z grami i na mapie. Zostało najtrudniejsze: dobierz wszystkie pary. | brak `tekstEkranu` (105 zn. na karcie); „skrzynia z grami” nie istnieje | poprawka | Karta stoi na polanie. Dobierz pary. | Karta jest twoja — stoi na polanie i czeka w Minigrach. Teraz dobierz wszystkie pary. | – |
| `misjeGier.js:113–116` | W | wypłata za partię | Widziałem każdą parę, którą odkryłeś. Pamięć masz jak sowa — należy ci się 25 monet. | monety, „należy ci się”, „odkryłeś” bez tokenu, brak `tekstEkranu`; „sowa” to zwierzę profilu ST | przepisać ⚙ | Wszystkie pary. Karta zostaje na polanie. | Widziałem każdą parę. Karta zostaje na polanie — wracaj do niej, kiedy chcesz. | przycisk: „Dobrze” |
| `misjeGier.js:119–120` | UI | ekran nagrody za ułożenie | Obrazek ułożony! / Karta Wizkora jest twoja — czeka w skrzyni z grami i na polanie. | „skrzynia z grami” | poprawka | Obrazek ułożony! / Karta Wizkora stoi na polanie i czeka w Minigrach. | – | – |
| `misjeGier.js:123–124` | UI | ekran nagrody za partię | Pamięć jak sowa! / Dobrałeś wszystkie pary z karty Wizkora. | „sowa” (profil ST), brak tokenu | poprawka ⚙ | Wszystkie pary! / {Dobrałeś\|Dobrałaś} wszystkie pary z karty Wizkora. | – | – |
| `misjeGier.js:157–161` | W | zlecenie Lotu | Czas polatać, wędrowcze. Obrazek lotu rozsypał się na dziewięć kawałków… (163 zn.) | >140, „wędrowcze” | poprawka | (jest :388) | Obrazek lotu rozsypał się po polanie. Pozbieraj kawałki i ułóż go, a wejdziesz na szczyt choinki. | – |
| `misjeGier.js:165–175` | W | zbieranie / komplet | Kawałki obrazka wciąż leżą w trawie… / Masz wszystkie kawałki! Ułóż z nich obrazek, a od razu wejdziesz na choinkę. | ok | zostaje | – | – | – |
| `misjeGier.js:179–182` | W | gra zdobyta | Jesteś na górze. Odbij się w dobrym momencie i łap wiatr — im dłużej lecisz, tym więcej po drodze zbierzesz. | brak `tekstEkranu` (107 zn.); „więcej zbierzesz” = zbieractwo | poprawka | Choinka jest twoja. Odbij się i leć. | Choinka jest twoja. Odbij się w dobrym momencie i łap wiatr — im dłużej lecisz, tym dalej widać polanę. | – |
| `misjeGier.js:186–189` | W | wypłata za lot | Widziałem ten lot z ziemi, wędrowcze. Kawał drogi. 35 monet — należą ci się. | monety, „wędrowcze”, brak `tekstEkranu` | przepisać | Widziałem ten lot. Choinka zostaje twoja. | Widziałem ten lot z ziemi. Kawał drogi. Choinka zostaje na polanie — startuj, kiedy chcesz. | – |
| `misjeGier.js:192–197` | UI | ekrany nagrody Lotu | Choinka jest twoja — od teraz startujesz z niej, kiedy chcesz. / Ale lot! / Złapałeś wiatr i poleciałeś dalej, niż sięga polana. | brak tokenów | poprawka ⚙ | – / Ale lot! / {Złapałeś\|Złapałaś} wiatr i {poleciałeś\|poleciałaś} dalej, niż sięga polana. | – | – |
| `misjeGier.js:224–228` | W | zlecenie Biegu | Zostało ostatnie, wędrowcze. Obrazek górskiej trasy rozsypał się na dziewięć kawałków… (159 zn.) | >140, „wędrowcze”, „zostało ostatnie” = lista do odhaczenia | poprawka | (jest :388) | Obrazek górskiej trasy rozsypał się po polanie. Pozbieraj kawałki i ułóż go, a bucik do biegania będzie twój. | – |
| `misjeGier.js:232–242` | W | zbieranie / komplet | Kawałki obrazka leżą w trawie… / Masz wszystkie kawałki! Ułóż z nich obrazek, a trasa stanie otworem od razu. | ok | zostaje | – | – | – |
| `misjeGier.js:246–249` | W | gra zdobyta | Bucik masz, więc trasa stoi otworem. Biegnij i licz w biegu — bramki nie czekają, aż się zastanowisz. | brak `tekstEkranu` (103 zn.); „nie czekają, aż się zastanowisz” = presja | poprawka | Bucik jest twój. Trasa stoi otworem. | Bucik jest twój, więc trasa stoi otworem. Biegnij i licz w biegu — po jednej bramce naraz. | – |
| `misjeGier.js:253–256` | W | wypłata za bieg | Przebiegłeś całą trasę i jeszcze liczyłeś po drodze. Głowa i nogi naraz — to rzadkie. 40 monet jest twoje. | monety, brak tokenów, brak `tekstEkranu` | przepisać ⚙ | Cała trasa. Bucik zostaje na polanie. | {Przebiegłeś\|Przebiegłaś} całą trasę i jeszcze {liczyłeś\|liczyłaś} po drodze. Bucik zostaje na polanie — trasa jest twoja. | – |
| `misjeGier.js:259–264` | UI | ekrany nagrody Biegu | Bucik jest twój — trasa czeka w skrzyni z grami i na polanie. / Głowa i nogi! / Przebiegłeś całą trasę, licząc na każdej bramce. | „skrzynia z grami”, brak tokenu | poprawka ⚙ | Bucik jest twój — trasa czeka na polanie i w Minigrach. / Głowa i nogi! / {Przebiegłeś\|Przebiegłaś} całą trasę, licząc na każdej bramce. | – | – |
| `kwestieWizkora.js:367` | W | karta: komplet kawałków | Masz komplet. Teraz ułóż obrazek! | ok | zostaje | – | – | – |
| `kwestieWizkora.js:375` | W | karta: zbieranie | Zbieraj kawałki błyszczące na polanie. | ok | zostaje | – | – | – |
| `kwestieWizkora.js:388` | W | karta: zlecenie gry | Zbierz kawałki obrazka na polanie. | ok | zostaje | – | – | – |
| `kwestieWizkora.js:311–316` | W | zlecenie: koło | Mapę już znasz, wędrowcze. Czas na zadanie poza ekranem. Zakręć kołem przeznaczenia — wskaże, którą siłę dziś ćwiczysz. | „wędrowcze”; brak powodu ze świata („magią nie zrobię”) | przepisać | Zakręć kołem. Wskaże dzisiejszą siłę. | Tu na polanie zrobiliśmy swoje. Teraz coś, czego magią nie zrobię. Zakręć kołem — wskaże, którą siłą dziś działasz. | 1–3: „Zakręć kołem. Ono pokaże, co dziś robimy naprawdę.” |
| `kwestieWizkora.js:285–289` | W | przypomnienie o zadaniu | Pamiętasz o zadaniu? „Zwiadowca” czeka w zakładce Zadania. | brak `tekstEkranu` (ok, 3 wiersze); „pamiętasz?” lekko odpytuje; nie mówi, że to poza ekranem | poprawka | „{tytuł}” czeka. U ciebie, nie tu. | „{tytuł}” dalej czeka — u ciebie. Jak zrobisz swoje, polana to zauważy. | – |
| `kwestieWizkora.js:263–268` | W | po wysłaniu dowodu | Twoje zadanie jest u Mentora. Baw się dalej — zajrzyj do Zadań za jakiś czas. | trzyma przy ekranie; „u Mentora” = teczka; obiecuje Mentora, którego może nie być | przepisać | Ślad zostawiony. Zobacz {miejsce_reakcji}. | To, co {zrobiłeś\|zrobiłaś}, zostawiło ślad {miejsce_reakcji}. Idź, zobacz — to od ciebie. | gdy Mentor istnieje (nie demo): karta „Mentor już to widzi.” · głos „Mentor już widzi, co {zrobiłeś\|zrobiłaś}. A ślad {miejsce_reakcji} — to od ciebie.” |
| `kwestieWizkora.js:248–254` | W | po zauważeniu | Mentor przeczytał to, co mu wysłałeś, i przyjął. Przyznał ci 25 monet — bierz. | Mentor-sędzia, monety, cyfra, brak tokenu; przycisk „Odbieram nagrodę!” | przepisać ⚙ | Mentor to {zobaczył\|zobaczyła}. Przy drzewie wyrósł nowy kwiat. | Mentor {zobaczył\|zobaczyła} to, co {zrobiłeś\|zrobiłaś}. A przy drzewie wyrósł nowy kwiat — idź, zobacz. | przycisk: „Idę zobaczyć” · akcja: `pokazMiejsce` na drabinkę; kwiat = `kwiaty[].wariant` w nowym kolorze (istnieje) |
| `kwestieWizkora.js:323–329` | W | brak zadania do zlecenia | Dobrze się spisałeś, mały wędrowcze. Odpocznij chwilę — przygotowuję dla ciebie nowe zadanie. | ozdobnik, „mały wędrowcze”, brak tokenu, trzyma („odpocznij chwilę” = zostań) | przepisać | Na dziś koniec zleceń. Polana poczeka. | Na dziś nie mam już nic. Polana poczeka. U ciebie dzieje się więcej niż tu. | 4–8: „Dziś nic więcej ode mnie. Polana poczeka.” |
| `kwestieWizkora.js:108–115` | W | zachód, jest zadanie w realu | Słońce schodzi nisko — widzisz, jak się złoci? Zdąży jeszcze jedna rzecz, zanim planeta uśnie. A „X” czeka na ciebie tam, na zewnątrz. | opis krajobrazu; „jeszcze jedna rzecz” = jeszcze na ekranie; karta gubi zadanie | przepisać | patrz §3 (sekwencja sesji) | patrz §3 | patrz §3 |
| `kwestieWizkora.js:118–127` | W | zachód, bez zadania | …Wybierz, co to będzie. | jak wyżej | przepisać | patrz §3 | patrz §3 | patrz §3 |
| przyciski okien Wizkora (`:113,162,216,228,252,266,287,315,327,404,424,437`; `misjeGier.js:86,95,102,109,116…`) | UI | CTA | Idę / Biorę się za to / Idę dalej / Budujemy! / Odbieram nagrodę! / Dobrze! / Otwieram zadanie / Kręcę kołem! / Do zobaczenia! / Zbieram dalej! / Ruszam po gwiazdki! / Zbieram kawałki! / Układam! / Gram dalej! / Lecę! / Biegnę! | „Odbieram nagrodę!” ×4 (nagroda = monety); reszta dobra | poprawka | „Odbieram nagrodę!” → „Patrzę!” (gwiazdki) / „Dobrze” (gry) / „Idę zobaczyć” (Mentor); „Do zobaczenia!” → „Idę” | – | – |

### 2.3 Świat `/swiat` — toasty, dziennik, zaproszenia liska, ekran nagrody (`pages/Swiat.jsx`)

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowy tytuł toastu (≤ 28) | nowy `opis` (aria) | uwagi |
|---|---|---|---|---|---|---|---|---|
| `Swiat.jsx:1362–1365` | UI | toast po „start” gwiazdek | Zbierz 10 [moneta] / opis: Zbierz 10 złotych monet | ikona monety i „monet” przy zadaniu gwiazdek — nieprawda | poprawka | Zbierz 10 [gwiazdka] (`/star.png`) | Zbierz dziesięć gwiazdek z polany | – |
| `Swiat.jsx:2015–2018` | UI | toast: dotknięcie Wizkora w trakcie gwiazdek | Wizkor czeka — masz 3 z 10 [moneta] | licznik „x z y”, moneta | poprawka | Gwiazdki jeszcze w trawie | Wizkor czeka na wszystkie gwiazdki | licznik jest w HUD |
| `Swiat.jsx:1342` / `:1424` | UI | toast po zleceniu gry | Znajdź 9 kawałków obrazka (26 zn.) | cyfra ok w toaście (widoczny koniec); >28? nie | zostaje | – | – | – |
| `Swiat.jsx:1426` | UI | toast (gra bez bramy — dziś brak) | Znajdź kartę Wizkora na mapie | „na mapie” — dziecko widzi polanę | poprawka | Znajdź kartę na polanie | Znajdź kartę Wizkora na polanie | – |
| `Swiat.jsx:2032` | UI | toast: Wizkor w trakcie puzzli | Wizkor czeka — masz 2 z 9 kawałków (33 zn.) | >28, licznik | poprawka | Kawałki jeszcze w trawie | Wizkor czeka na wszystkie kawałki obrazka | – |
| `Swiat.jsx:2039` | UI | toast: Wizkor, gra zdobyta | Wizkor czeka — zagraj w Gra na Pamięć (37 zn.) | >28, brak odmiany tytułu, „zagraj” trzyma | poprawka | Karta czeka na polanie | Karta Wizkora czeka na polanie — rozegraj partię | analogicznie: Choinka czeka / Bucik czeka |
| `Swiat.jsx:2128` | UI | toast: komplet kawałków | Masz wszystkie kawałki! | ok | zostaje | – | – | – |
| `Swiat.jsx:2131` | UI | toast: kawałek zebrany | Kawałek obrazka — masz 2 z 9 (28 zn.) | licznik w toaście, gdy jest w HUD | poprawka | Kawałek obrazka | Kawałek obrazka — licznik w górnym pasku | – |
| `Swiat.jsx:1372–1375` | UI | toast po zleceniu drewna | Suche drzewko i głaz [kłoda] / opis: Zanieś materiał na plac budowy na polanie | ok (nazywa obiekty, które są) | zostaje | – | – | – |
| `Swiat.jsx:1912–1915` | UI | toast: ścięte / rozbite | Drewno gotowe / Kamienie gotowe · opis: Zanieś to na plac budowy | ok | zostaje | – | – | – |
| `Swiat.jsx:1937–1940` | UI | toast: dostarczone | Drewno na placu / Kamienie na placu · opis: Jest wszystko… / Zostało jeszcze jedno | „zostało” zakazane (R5) także w `aria-label` | poprawka | Drewno na placu (tytuł bez zmian) | opis: „Jeszcze jedno jest do przyniesienia” / „Jest wszystko, czego trzeba” | – |
| `Swiat.jsx:1394–1397` | UI | toast: pomost | Pomost gotowy · opis: Na drzewie stanął pomost z drabinką | wzorzec | zostaje | – | – | – |
| `Swiat.jsx:1447` | UI | toast po zleceniu realu | Nowe zadanie — zajrzyj do Zadań (31 zn.) | >28; mówi o zakładce, nie o świecie | poprawka | Zadanie czeka u ciebie | Nowe zadanie u ciebie, poza ekranem — zakładka Zadania | dok mruga, więc tytuł może być krótszy |
| `Swiat.jsx:2057` (dziennik → podsumowanie) | N | wpis dnia | Znalazłeś pierwszą gwiazdkę / Znalazłeś 7 gwiazdek | rozlicza, cyfra, brak tokenu | przepisać | Pierwsza gwiazdka wróciła na polanę. / Gwiazdki wracają na polanę. / (komplet) Wszystkie gwiazdki świecą znów w trawie. | – | podmiotem rzecz |
| `Swiat.jsx:1523` | N | wpis dnia | Rozegrałeś: Gra na Pamięć | rozlicza, bez tokenu | przepisać | Karta Wizkora stoi na polanie. / Choinka jest do lotu. / Bucik jest na polanie. | – | – |
| `Swiat.jsx:1930–1932` | N | wpis dnia | Przyniosłeś wszystko na domek na drzewie / Przyniosłeś materiał na plac budowy | bez tokenu, rozlicza | przepisać | Pod drzewem leży wszystko na pomost. / Pod drzewem leży pierwszy materiał. | – | – |
| `Swiat.jsx:1392` | N | wpis dnia | Na drzewie stanął pomost z drabinką | wzorzec | zostaje | – | – | – |
| `Swiat.jsx:319–332` | L | zaproszenie do gry (karta, bez głosu) | Znalazłem kartę Wizkora! / Wszedłem na choinkę! / Znalazłem bucik do biegania! + „Wybierz, jak trudno gramy:” | lisek mówi w rodzaju męskim o sobie — lisek jest liskiem, ok; „jak lecimy” ok | zostaje | – | – | 1–3: bez zmian (tekst + kafle poziomu) |
| `Swiat.jsx:341` | L | zaproszenie fallback | Zagramy w {tytuł}? | ok | zostaje | – | – | – |
| `Swiat.jsx:2731–2732` | UI | CTA zaproszenia | START / Nie teraz | ok | zostaje | – | – | – |
| `Swiat.jsx:2740–2744` | UI | ekran nagrody: gwiazdki | ✦ ZADANIE WIZKORA / Wszystkie gwiazdki! / Zebrałeś 10 złotych gwiazdek dla Wizkora. / +10 monet / Super! ✦ | tokeny, cyfra, monety w centrum, „Super!”; „dla Wizkora” — gwiazdki są polany | przepisać ⚙ | ✦ POLANA / Wszystkie gwiazdki! / Świecą znów w trawie, co do jednej. / CTA: Patrzę na polanę | monety: cichy licznik w HUD, bez pigułki „+10” (decyzja 17.09) | – |
| `Swiat.jsx:2756–2761` | UI | ekran nagrody: ułożenie | ✦ OBRAZEK ZŁOŻONY / … / Reszta czeka za rozegraną partię / Gramy! ✦ | „reszta czeka” = monety jako wabik | poprawka | note → „Karta stoi już na polanie” (Lot: „Choinka jest do lotu”; Bieg: „Bucik leży na polanie”) | – | CTA „Gramy!” zostaje (obiecuje to, co się dzieje) |
| `Swiat.jsx:2772–2776` | UI | ekran nagrody: partia (z huba) | ✦ ZADANIE WIZKORA / … / Super! ✦ | „Super!” | poprawka | CTA → „Wracam na polanę” | – | – |

### 2.4 Chmurki: tryb spokojny Wizkora i wskazówki HUD

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowy tekst (= głos) |
|---|---|---|---|---|---|---|
| `porady-zdrowia.v1.json` woda | Ws | chmurka, po 75 s / co 5 min / 3 na sesję | Kubek wody teraz smakuje lepiej niż trzy później. | liczy („trzy”), obietnica efektu | poprawka | Kubek wody teraz. Reszta poczeka. |
| oczy | Ws | | Popatrz przez chwilę daleko za okno — oczy lubią dalekie widoki. | ok | zostaje | – |
| plecy | Ws | | Wyprostuj plecy i opuść ramiona. O, właśnie tak. | ok (zaprasza, nie liczy) | zostaje | – |
| ruch | Ws | | Wstań i przeciągnij się — ciało lubi, gdy o nim pamiętasz. | ok | zostaje | – |
| oddech | Ws | | Trzy spokojne wdechy potrafią zmienić cały dzień. | liczy, obiecuje efekt („cały dzień”) | poprawka | Jeden wolny wdech. I jeszcze jeden, wolniejszy. |
| dwor | Ws | | Nawet krótkie wyjście na dwór liczy się bardziej, niż myślisz. | „liczy się” = punktacja; moralizuje; wieczorem „za oknem jaśniej” to nieprawda, treść dubluje „przerwa” | wyciąć (scalone z „przerwa”) | – |
| sen | Ws | | Wieczorem jest ciemno nie bez powodu — sen to twoja supermoc. | pseudo-maksyma, „supermoc”; R7: chmurka nie mówi o porze (po 4 min to sugestia snu) | wyciąć | – |
| przekaska | Ws | | Coś chrupiącego i kolorowego na talerzu dodaje energii na dłużej. | temat jedzenia (reguła: bez diety), obietnica | wyciąć | – |
| rece | Ws | | Umyte ręce to najprostsza tarcza, jaką masz. | plakat z gabinetu | wyciąć | – |
| nogi | Ws | | Postój chwilę na jednej nodze — równowaga to też ćwiczenie. | ok | zostaje | – |
| przerwa | Ws | | Po dłuższym patrzeniu w ekran należy ci się przerwa. | „należy ci się”; wchodzi już po 75 s | poprawka | Oczy lubią popatrzeć daleko. Za oknem coś się rusza? |
| ramiona | Ws | | Zakręć ramionami do tyłu pięć razy — napięcie samo odpływa. | liczy, obiecuje | poprawka | Zakręć ramionami do tyłu, aż poczujesz, że są cięższe. |
| usmiech | Ws | | Uśmiech do siebie w lustrze działa nawet wtedy, gdy jest udawany. | pseudonauka, „udawany” | wyciąć | – |
| cisza | Ws | | Chwila ciszy bez dźwięków to odpoczynek dla uszu. | ok | zostaje | – |
| posilek | Ws | | Jedz powoli — brzuch potrzebuje chwili, żeby nadążyć. | temat jedzenia | wyciąć | – |
| sluchawki | Ws | | Ciszej w słuchawkach to więcej muzyki na całe życie. | ok (jedno zdanie, prawda) | zostaje | – |
| `PodpowiedzMedrca.jsx:30–33` rytm | – | 75 s / 5 min / 3 na sesję | – | za wcześnie i za często na 15-minutową sesję | poprawka | 4 min / 5 min / 2 na sesję / nigdy po zachodzie (R7) |
| `wskazowki.js:60–63` | W (karta, bez głosu) | chmurka doku, 75 s / 3,5 min / 3 na sesję | Porada dnia / Zostawiam ci tu jedną krótką radę na dziś. Dotknij ikonki i zajrzyj. | Wizkor przypisuje sobie poradę liska; 3 razy na sesję | poprawka | tytuł: Porada dnia · tekst: Lisek ma coś na dziś. Dotknij i zobacz. · rytm: 90 s, raz na sesję (R8) |
| `wskazowki.js:82–84` | L (głos + karta) | chmurka doku | Pobawimy się? / Tutaj czekają minigry. Wybierzemy jedną razem! | ok; wykrzyknik do zdjęcia w 4–8 | zostaje | (4–8: „Wybierzemy jedną razem.”) |

### 2.5 Panele doku: Zadania, Porada, Minigry, Rozmowy, Profil, Koło, Układanka

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowy tekst | 1–3 / 4–8 |
|---|---|---|---|---|---|---|---|
| `zadanieWizkora.js:53` | UI | status `zlecone` (wzięte z koła) | Do zrobienia / Otwórz | „Do zrobienia” to nazwa stanu PRZED wzięciem (pusty panel `:219`); po wzięciu zadanie jest u dziecka | poprawka | Czeka — u ciebie / Otwórz | – |
| `zadanieWizkora.js:54` | M | status | Mentor prosi o poprawkę / Popraw | werdykt, „poprawka” zakazane; zadania nie da się oblać | wyciąć (status `poprawka` znika; `rejected`/`needs_followup` z backendu mapować na „Czeka”) | – | – |
| `zadanieWizkora.js:58` | UI | status `wyslane` | Sprawdzane / Zajrzyj | „sprawdzane” zakazane; „Mentor już to widzi” obiecywałoby dorosłego, którego może nie być (demo, brak konta) | przepisać | Ślad zostawiony / Zobacz · podtytuł „Mentor już to widzi” TYLKO gdy Mentor istnieje i nie jest demo | – |
| `zadanieWizkora.js:59` | UI | status `zatwierdzone` | Nagroda czeka / Odbierz nagrodę | monety jako nagroda | przepisać | Mentor {zobaczył\|zobaczyła} / Zobacz, co się zmieniło ⚙ | – |
| `zadanieWizkora.js:60` | UI | status `wyplacone` | Zrobione / Zobacz | ok jako nagłówek w historii; na przypiętej karcie ostatnim stanem jest „Mentor {zobaczył\|zobaczyła}” | poprawka | Zrobione — tylko w historii zadań | – |
| `zadanieWizkora.js:259` | M (demo) | notatka demo po 60 s | Widziałem, co zrobiłeś. Właśnie tak wygląda ciche dobro. | udaje żywego Mentora; bez tokenu; „ciche dobro” = ocena moralna | przepisać ⚙ | (tryb demo) Świat to zauważył. | oznaczyć jawnie jako demo — pytanie w notatkach |
| `ZadaniePanel.jsx:219` | UI | pusty panel, jest co losować | Wizkor ma dziś dla Ciebie zadanie. Znajdź go na polanie i zakręć kołem przeznaczenia. | ok | zostaje | – | – |
| `ZadaniePanel.jsx:220` | UI | pusty panel, nic do losowania | Wizkor nie ma dziś dla Ciebie zadania. Pobiegaj po mapie — znajdzie Cię sam. | nieprawda (Wizkor stoi), trzyma przy ekranie | przepisać | Wizkor stoi na polanie. Dziś nie ma nowego zlecenia. | – |
| `ZadaniePanel.jsx:233–234` | UI | zrobione | Zrobione! / {tytuł} — masz to za sobą. Wizkor przygotuje kolejne. | „masz to za sobą” = obowiązek odhaczony; „pod drzewem” prawdziwe tylko dla części zadań | poprawka | Zrobione / „{tytuł}” zostawiło ślad na polanie. | – |
| `ZadaniePanel.jsx:246–250` | M/UI | zauważone | Mentor przyjął Twoje zadanie / „notatka” / +25 monet / Odbieram nagrodę! | przyjął, kwota, nagroda | przepisać ⚙ | Mentor {zobaczył\|zobaczyła}, co {zrobiłeś\|zrobiłaś} / (opcjonalnie) jedna z gotowych formuł Mentora bez oceny: „Widziałem.” / „Widziałam.” / „Porozmawiamy o tym.” / „Ciekawe, jak to {zrobiłeś\|zrobiłaś}.” / CTA: Zobacz, co się zmieniło (→ `pokazMiejsce`) | wybór: gotowe formuły zamiast wolnego zdania — wolne pole to kanał na ocenę (§3: Mentor dostaje pytanie do rozmowy, nie werdykt); formuła z wyboru zachowuje sygnał „ktoś to zobaczył”, którego dziecko potrzebuje, a nie pozwala napisać „mogło być lepiej” |
| `ZadaniePanel.jsx:281–282` | UI | wysłane | Twoje zadanie jest sprawdzane / Wizkor zaniósł Twoją odpowiedź Mentorowi. Mentor właśnie ją ogląda. Zajrzyj tu później. | sprawdzane, „zajrzyj później”, ilustracja Wizkora z lupą = kontrola; obiecuje Mentora, którego może nie być | przepisać ⚙ | Ślad zostawiony / To, co {zrobiłeś\|zrobiłaś}, zostawiło ślad {miejsce_reakcji}. Zobacz na polanie. · gdy Mentor istnieje (nie demo) dopisek: „Mentor już to widzi.” | ilustrację `wizSprawdza.webp` zamienić (Wizkor patrzy na pomost) |
| `ZadaniePanel.jsx:296` | UI | krok dowodu | Pokaż Mentorowi | obiecuje Mentora, którego może nie być (demo, brak konta) | poprawka ⚙ | Pokaż, co {zrobiłeś\|zrobiłaś} · dopisek „Mentor to zobaczy” TYLKO przy prawdziwym, niedemowym Mentorze | jedna wersja dla całego toru; `05` W1 („Wyślij do Mentora”) ma ją przejąć |
| `ZadaniePanel.jsx:310` | UI | CTA | Dodaj zdjęcie | brak zasady „bez twarzy” | poprawka | Dodaj zdjęcie rzeczy (bez ludzi) | – |
| `ZadaniePanel.jsx:328` | UI | placeholder | Napisz, co zrobiłeś… | bez tokenu; 600 znaków zaprasza do pamiętnika | poprawka ⚙ | Jedno zdanie o tym, co {zrobiłeś\|zrobiłaś}… (maxLength 160) | – |
| `ZadaniePanel.jsx:347` | UI | CTA | Wyślij do Mentora | jw. — Mentora może nie być; ślad idzie do świata | poprawka | Zostaw ślad | `05` W1 przejmuje „Zostaw ślad” zamiast „Wyślij do Mentora” |
| `ZadaniePanel.jsx:370` | M | notatka „poprawka” | Mentor pisze: „…” | razem ze statusem | wyciąć | (pytanie Mentora do rozmowy pokazuje panel Mentora, nie dziecko) | – |
| `ZadaniePanel.jsx:124,125,141,149,158` | UI | błędy | To nie jest zdjęcie. / Zdjęcie jest za duże… / Zdjęcie nie chce się wysłać. Możesz opisać wszystko słowami — Mentor to zobaczy. / Napisz choć jedno zdanie albo dodaj zdjęcie. / Nie udało się wysłać. Spróbuj za chwilę. | ok | zostaje | – | – |
| `ZadaniePanel.jsx:363, 376, 380` | UI | CTA / nagłówki | Posłuchaj jeszcze raz / Do dzieła! / Gdzie możesz to zrobić? | ok | zostaje | – | – |
| `ZadaniePanel.jsx:83` (`cel`+`jak` z `zadania-wizkora.v1.json`) ×10 | W | głos przy otwarciu panelu | np. „Znajdź dziś trzy rzeczy, których nigdy nie zauważyłeś. Idź drogą…” | 8 z 10 ma formę męską bez tokenu (`zauważyłeś`, `sam`, `wstydzisz`…); treść to Zadanie B | poprawka ⚙ (tokeny) — treść wg `03_ZADANIA_W_REALU.md` | – | – |
| `PoradaPanel.jsx:151` | UI | nagłówek | Małe odkrycie | ok | zostaje | – | – |
| `PoradaPanel.jsx:171` | UI | brak porady | Nie mam dziś dla Ciebie nowej porady. Zajrzyj jutro. | kto mówi? (panel liska) — „zajrzyj jutro” = wróć | poprawka | Dziś nic nowego. Wczorajsze rady są niżej. | – |
| `PoradaPanel.jsx:174,195` | UI | historia | Rady, które już znasz / Poznane rady pojawią się tutaj. | ok | zostaje | – | – |
| `PoradaPanel.jsx:200` | UI | stopka | Porady dobrane dla Ciebie: Śmiałek · Odwaga. W zapasie jest ich 30. | etykieta profilu, licznik zapasu | wyciąć | – | – |
| `PoradaPanel.jsx:128,130` | UI | CTA | Posłuchaj / Wróć do porad | ok | zostaje | – | – |
| `dailyTipsData.js` (387; 198 dla dziecka) | L | porada dnia, treść czytana liskiem | (zbiorczo) | „Wizkor mówi…” w ustach liska (~40), cyfry, brak tokenów, brak czynności | Zadanie C (`04_PORADY_DNIA.md`) | – | – |
| `poradaDnia.js:38–57` + `glosLiska.js:33–49` (za flagą) | L | karty ćwiczeń (wyłączone) | zapowiedzi ok; odzewy: „Masz bystre oczy. Pięć zielonych śladów już świeci na mapie.”, „Dobra robota.”, „Kto pierwszy zobaczy?”, „Świetny wybór.” | ocena, wyścig, ślady na mapie nie istnieją | poprawka (na wypadek włączenia flagi) | `:47` Szukamy pięciu zielonych rzeczy. Ja zaczynam od trawy — a ty? · `:48` Pięć zielonych. Ja widziałem trawę, ty swoje — razem dziesięć. · `:39` Balon zabrał trochę pośpiechu. U mnie też. · `:57` Łapki, barki, głowa. U mnie lżej — a u ciebie? · `glosLiska.js:47` Robimy to razem. · `:49` Zaczynamy. | 4–8: „łapki” → „ręce” |
| `KoloFortuny.jsx:180,188,198` | UI | koło | Koło Przeznaczenia / Co dziś ćwiczysz? / Każde pole to inna mocna strona. | „ćwiczysz” = trening; reszta ok | poprawka | Co dziś działa? / Każde pole to inna siła. | – |
| `KoloFortuny.jsx:185,197` | UI | wynik | Odwaga! / „{tytuł}” / Wizkor szykuje zadanie… | ok | zostaje | – | – |
| `KoloFortuny.jsx:251,261` | UI | CTA | Biorę zadanie! / Zakręć! / Kręci się… | ok | zostaje | – | – |
| `PuzzleBrama.jsx:357–362` | UI | układanka | ✦ UKŁADANKA / Przeciągnij kawałek na jego miejsce. Dotknięty na siatce — obraca się. / Obrazek jest cały — brama otwarta! | „brama” — nie ma jej w scenie (metafora układanki, ok) | zostaje | – | – |
| `MinigryPanel.jsx` | UI | kafle + plakietka „nowe” | (tytuły gier z katalogu) | – | zostaje | – | – |
| `EkranStartuGry.jsx:35,39` | UI | start gry | Szykuję zabawę… / Zagraj | „zabawę” infantylne dla 4–8 | poprawka | Szykuję grę… / Zagraj | – |
| `poziomyGier.js:21–35` | UI | poziomy | Łatwy / Średni / Trudny / Obręcz po obręczy / Dwie naraz, jednym lotem / Do 10 / Do 20 | ok | zostaje | – | – |
| `WiadomosciPanel.jsx:112` | UI | pusta skrzynka | Na razie cisza. To też jest w porządku. | ok | zostaje | – | – |
| `wiadomosci.js:105–108` | UI | statusy toru `/przygoda` (wyłączony) | Mentor prosi o poprawkę / U Mentora / Sprawdź, czy wrócił / Nagroda czeka | martwy kod | wyciąć razem z torem | – | – |
| `HubDock.jsx:12–15` | UI | dok | Minigry / Rozmowy / Zadania / Porada | ok | zostaje | – | – |
| `ProfilPanel.jsx:54` | UI | profil | Mocne strony | ok | zostaje | – | – |
| `HintPopup.jsx:101,200` | UI | globalny popup (żywy na `/games/*`) | ARTEFAKT / WIADOMOŚĆ / NOWE ZADANIE / PODPOWIEDŹ; ✨ MENTOR ZATWIERDZIŁ / Świetna robota! | zatwierdził, ocena, wyskakuje w grze | wyciąć na `/games/*` (dodać do `SILENT_POPUP_PATHS`); reszta tekstu: „Mentor {zobaczył\|zobaczyła}” | – | – |

### 2.6 Minigry `/games/*` (tutorial, splash, komunikaty w grze, ekran wyniku)

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowy tekst | 1–3 / 4–8 |
|---|---|---|---|---|---|---|---|
| `zasadyGier.js:24–26` | UI | tutorial Gry na Pamięć | Dotknij dwóch kart. / Takie same? Zostają odkryte. / Różne? Wracają na swoje miejsce. | wzorzec | zostaje | – | – |
| `zasadyGier.js:29` | UI | stopka tutorialu | Im mniej ruchów, tym więcej monet. | monety jako cel | poprawka | Im mniej ruchów, tym pełniejszy wynik na końcu. | – |
| `TutorialGry.jsx:96,112,116` | UI | tutorial | Jak grać? / Gram! / Wracam do gry | ok | zostaje | – | – |
| `MemoryGame.jsx:484,487,491` | UI | splash | Odkryj wszystkie pary! / Tasuję karty… / Zagraj! | ok | zostaje | – | – |
| `MemoryGame.jsx:574–578` | UI | wynik | Wspaniale! / Super! / Brawo! · Twoja pamięć jest jak zwój Wizkora. / Niezła robota — spróbuj jeszcze raz! / Każdy ruch to krok do wprawy. | inflacja zachwytu jako tytuł; „spróbuj jeszcze raz” ponagla; „zwój Wizkora” nie istnieje | przepisać | tytuł: Wszystkie pary! (3★) / Wszystkie pary. (2★) / Dotarłeś do końca. → {Doszedłeś\|Doszłaś} do końca. (1★) ⚙ · podtytuł: Za pierwszym podejściem. / Kilka kart wróciło, ale komplet jest. / Każda para to jeden ruch mniej następnym razem. | 4–8: bez wykrzykników |
| `MemoryGame.jsx:583–593` | UI | rozbicie / akcje | Za partię / Od Wizkora za misję / ruchy / czas / pary / Wracam / Jeszcze raz | „Od Wizkora za misję” = monety od postaci | poprawka | „Od Wizkora za misję” → „Za zdobycie gry”; reszta zostaje | – |
| `ChoinkaLaunchGame.jsx:972,1052,1074,1166` | UI | komunikaty w locie | Spójrz, tam jest cel! / Naciągnij i leć w lewo / Celuj i puść! / Choinka się prostuje… / Lecimy! | ok (instrukcja, nie ocena) | zostaje | – | – |
| `ChoinkaLaunchGame.jsx:1401–1408` | UI | splash | Leć wysoko po gwiazdki! / Wyznaczam lot… / Lecimy! | ok | zostaje | – | – |
| `ChoinkaLaunchGame.jsx:1439–1443` | UI | wynik | Przez obie bramy! / Ale lot! / Wszystkie obręcze trafione! · Jeden lot, 2 bramy — i ani razu obok. / Choinka wystrzeliła liska przez trzy złote cele. | cyfra „2 bramy” obok „trzy” słownie — niespójne | poprawka | Jeden lot, dwie bramy — i ani razu obok. | – |
| `ChoinkaLaunchGame.jsx:1449–1465` | UI | rozbicie / akcje | Za lot / Od Wizkora za misję / bramy / cele / strzały / Wracam / Jeszcze raz | jw. | poprawka | „Od Wizkora za misję” → „Za zdobycie gry” | – |
| `BiegLiskaGame.jsx:595,598,656,814` | UI | reakcje w biegu | Brawo! 3 + 4 = 7 / Uciekła! … / Ups! Wyrwa w drodze… / Ostatnie serce… / To nie ta liczba… | „Ostatnie serce…” = presja straty; „Brawo!” | poprawka | „Brawo!” → „Jest!” · „Ostatnie serce…” → „Jeszcze jedno serce.” · reszta zostaje | – |
| `BiegLiskaGame.jsx:906–907` | UI | błąd ładowania | Telefon potrzebował pamięci na coś innego. / Spróbuj jeszcze raz za chwilę. | ok | zostaje | – | – |
| `BiegLiskaGame.jsx:922–929` | UI | splash | Licz w biegu, skacz po wynik! / Buduję serpentynę… / Biegniemy! | ok | zostaje | – | – |
| `BiegLiskaGame.jsx:985–993` | UI | wynik | Wyrwa Cię złapała! / Mistrz liczenia! / Świetny bieg! / Dobiegłeś do mety! · Serca się skończyły, ale odpowiedzi zostają: 3 z 5. / Zebrane odpowiedzi: 3 z 5. | „złapała” = porażka; tokeny; licznik „x z y” w zdaniu (kafelek już to pokazuje) | przepisać ⚙ | tytuły: Bieg przerwany. / Wszystkie wyniki! / Dobry bieg! / {Dobiegłeś\|Dobiegłaś} do mety! · podtytuły: Wyniki zostają — liczby niżej. / Każda bramka trafiona. / Meta jest. Liczby niżej. | 4–8: „Bieg przerwany.” bez kropki-wykrzyknika |
| `BiegLiskaGame.jsx:1000–1010` | UI | rozbicie / kafelki / akcje | Za bieg / Od Wizkora za misję / wyniki / serca / monety / Wracam / Jeszcze raz | jw.; kafelek „monety” podwaja pigułkę | poprawka | „Od Wizkora za misję” → „Za zdobycie gry”; kafelek „monety” wyciąć | – |
| `RewardScreen.jsx:78` | UI | domyślne CTA | Dziękuję ✦ | ok | zostaje | – | – |


### 2.7 Koniec dnia (`hub/data/koniec-dnia.v1.json`, `hub/PodsumowanieDnia.jsx`) — stan dzisiejszy

| gdzie | głos | typ · moment | obecny | problem | werdykt | nowy tekst |
|---|---|---|---|---|---|---|
| `koniec-dnia.v1.json:19–20` nie-zasnelo | N | krok 1 po `sesja:zamknieta` | Planeta gasła powoli, światło po świetle. Zostało jedno, przy domku na drzewie. | „domek na drzewie” — jest pomost (etap 1) albo plac budowy; brak zależności od stanu | poprawka | patrz §3.3 (wg stanu) |
| `:27–31` stan-rzeczy | N | krok 2 | Drewno leży przy ścianie, głaz trzyma róg. Dachu nie ma. Lisek śpi przy kamieniu, który jeszcze grzeje. | ściana, dach, kamień grzejący — nie ma ich w scenie; pierwsza linia bierze surowy wpis dziennika („Znalazłeś 7 gwiazdek”) | przepisać | §3.3 |
| `:37–38` nie-do-wyczarowania | W | krok 3 | Umiem zatrzymać deszcz w pół drogi. Ale dachu z niczego nie zrobię. U ciebie takie rzeczy leżą zwyczajnie. | wzorzec, ale „dach” spoza sceny i brak zależności od realnego zadania | poprawka | §3.3 |
| `:45–47` pusty-ksztalt | L | krok 4 + przycisk „Dobrze” | Trzymam miejsce. Poszukamy jutro, jak będzie jasno. | wzorzec | zostaje (wariant nic/zadanie); nowe warianty ślad/Mentor w §3.3 | – |
| `:54–56` odejscie | N | krok 5 + „Dobranoc, planeto” | Stoi otwarty. Będzie stał. | ok dla wariantu z brakiem; nie pasuje, gdy świat już odpowiedział | poprawka | §3.3 |
| `:63–67` dzienPusty | N | krok 2, pusty dzień | Fasola wypuściła listek… / Wiatr przewrócił wiadro przy studni. / Kamień przy ścianie nagrzał się od słońca. / Lisek śpi przy kamieniu… | Fasola, studnia, wiadro, ściana — nie ma ich na `/swiat` | przepisać | §3.3 wariant „nic” |
| `:72–73` odlozenie | UI/N | trzecia droga | Niech zostanie odkryte / Zostawiamy górę otwartą. Gwiazdom tak wygodniej. | „górę” — nie ma góry; „Niech zostanie odkryte” niezrozumiałe dla 1–3 | poprawka | Zostaw otwarte / Zostaje otwarte. Gwiazdom tak wygodniej. |
| `PodsumowanieDnia.jsx:182` | UI | wstęga | Dzień się skończył | brzmi jak „czas minął” | poprawka | Planeta zasypia |
| `PodsumowanieDnia.jsx:202–203` | UI | ramka braku | Czegoś tu brakuje. / {pierwsza linia `cel`} | dla zadania ze stanu gracza pokazuje `cel` zadania Koła (np. „Znajdź dziś trzy rzeczy”), a nie brak w świecie | poprawka ⚙ | nagłówek: „{tytuł}” · pod nim: „Tego magią nie zrobię.” (do czasu pola `brak` w zadaniach) |
| `PodsumowanieDnia.jsx:218` | UI | CTA | Dalej | ok | zostaje | – |
| `Swiat.jsx:1885–1888` | – | zachód przepada przy otwartym oknie | – | dziecko w panelu nie dostaje zachodu wcale | poprawka ⚙ | kolejkować: pokazać po zamknięciu panelu/gry, jeśli etap nadal „zachod” lub „noc” |

## 3. Sekwencja sesji: zachód → noc → koniec → podsumowanie → powrót

Fakty z kodu: `doba.js:235` `minutySesji: 15`; przy tych progach zachód zaczyna się
w **8 min 31 s**, etykieta „noc” w **11 min 30 s**, koniec (księżyc w zenicie) w **15 min**
(`doba.js:457–466`, policzone z `progi`). Zachód to jedna kwestia Wizkora i tylko przy
wolnym ekranie (`Swiat.jsx:1885–1888`). Etap „noc” nie ma dziś żadnego tekstu. Po końcu
kamera odjeżdża ~6 s, potem `sesja:zamknieta` otwiera `PodsumowanieDnia`, które bierze
zadanie z makiety, gdy nie ma zadania Koła (`PodsumowanieDnia.jsx:104–107`). Po zamknięciu
podsumowania świat chodzi dalej nocą; odświeżenie strony zaczyna nowy dzień.

Zasady sekwencji: bez odliczania, bez „czas minął”, bez liczb; karta zachodu NAZYWA
zadanie poza ekranem; każdy krok czyta REALNY stan; ostatnie zdanie każdej ścieżki
zaprasza do realu, nie do „jeszcze jednej rzeczy”; trzy głosy wg ról (Wizkor nazywa brak
i zleca, lisek zaprasza „razem”, narratorka opisuje rzeczy). Stan gracza czytany z:
`stanZadaniaWizkora()` (doZrobienia / czeka / doOdbioru / wyplacone / brak),
`stanDrewna()` (brak placu / plac / etap 1; etapy 2–3 do zbudowania), dziennik dnia.

### 3.1 Zachód (8,5 min) — Wizkor, okno postaci, przycisk

| stan | karta (≤ 60) | głos (≤ 140) | 1–3 / 4–8 | przycisk |
|---|---|---|---|---|
| zadanie w realu czeka | Słońce schodzi. „{tytuł}” czeka u ciebie, nie tu. | Słońce schodzi. Tu już nic mi nie trzeba. „{tytuł}” czeka tam, gdzie magia nie sięga — u ciebie w domu. | 1–3: głos = karta + „U ciebie, nie tu.” · 4–8: bez zmian | Idę |
| brak zadania (nic nie zlecone / wszystko rozliczone) | Słońce schodzi. U ciebie za oknem też? | Słońce schodzi nad polaną. Sprawdź, czy u ciebie za oknem też — i co robi światło. | 1–3: „Słońce schodzi. Zobacz, czy za oknem też.” | Sprawdzam |
| ślad wysłany dziś | Słońce schodzi. Na polanie coś przybyło. | Słońce schodzi. To, co {zrobiłeś\|zrobiłaś}, zostawiło ślad {miejsce_reakcji}. Jutro będzie go lepiej widać. | – | Dobrze |
| Mentor {zobaczył\|zobaczyła} dziś | Mentor to {zobaczył\|zobaczyła}. Przy drzewie wyrósł nowy kwiat. | Mentor {zobaczył\|zobaczyła}, co {zrobiłeś\|zrobiłaś}. Przy drzewie wyrósł kwiat, którego rano nie było. Spójrz. | – | Patrzę |

Uwagi: „domek”/„pomost”/„plac budowy”/„drzewo” dobierane z `stanDrewna()`: bez placu →
„na polanie”; plac → „pod drzewem”; etap 1 → „na pomoście”. `{miejsce_reakcji}` to pole
karty zadania (wartości: „pod drzewem”, „obok karty”, „przy choince”, „na pieńku”, „przy
drabince”, „przy ścieżce”) — „pod drzewem” jest prawdą w 5 z 15 zadań z `03`. Dodatek po
zauważeniu przez Mentora = **kwiat w nowym kolorze przy drabince** (`kwiaty[].wariant`,
istnieje); światło tylko w hybrydzie MD. Warianty „ślad” i „Mentor” wymagają kanału
ślad → scena (dziś nie ma; do czasu wdrożenia użyć wariantu 1 albo 2).

### 3.2 Noc (11,5 min) — narratorka, jedno zdanie w świecie, bez przycisku, bez okna

Nic nie wyskakuje (konstytucja §0.1): jedna linijka głosem narratorki i ten sam tekst
jako cichy podpis nad HUD-em (jak toast, ale bez pigułki; do zbudowania). Nie powtarza się.

| stan | tekst (= głos) | 1–3 / 4–8 |
|---|---|---|
| dowolny, plac / etap 1 | Nad polaną wschodzi księżyc. Lisek zwalnia krok. | – |
| dowolny, brak placu | Nad polaną wschodzi księżyc. Trawa ciemnieje. | – |

Od tej chwili Wizkor nie zleca nic nowego (okno pokazuje wariant zachodu), a chmurka
trybu spokojnego jest wyłączona (R7).

### 3.3 Koniec (15 min) — podsumowanie po odjeździe kamery, pięć kroków

Krok 1 · narratorka (wstęga: „Planeta zasypia”):

| stan domku | tekst |
|---|---|
| brak placu | Planeta gasła powoli, światło po świetle.\nJedno świeci dalej — na polanie przy Wizkorze. |
| plac budowy | Planeta gasła powoli, światło po świetle.\nJedno świeci dalej — pod wielkim drzewem. |
| etap 1 (pomost) | Planeta gasła powoli, światło po świetle.\nJedno świeci dalej — na pomoście. |

Krok 2 · narratorka, trzy linie o rzeczach (1 = co się dziś zmieniło, 2 = brak nazwany, 3 = ciepłe):

| stan | linia 1 (z dziennika dnia) | linia 2 (brak) | linia 3 |
|---|---|---|---|
| nic nie zrobione, brak placu | Wiatr przeczesał trawę na polanie. | Na wielkim drzewie nie ma jeszcze nic. | Lisek śpi w trawie, przy Wizkorze. |
| nic, plac budowy | Paliki na placu budowy stoją, jak stały. | Pod drzewem jeszcze nie ma drewna. | Lisek śpi między palikami. |
| nic, etap 1 | Pomost stoi na drzewie. | Domku na nim jeszcze nie ma. | Lisek śpi na pomoście, obok drabinki. |
| coś na ekranie (gwiazdki / karta / materiał / pomost) | wpis dziennika po poprawce z §2.3 (np. „Wszystkie gwiazdki świecą znów w trawie.”, „Na drzewie stanął pomost z drabinką.”) | jak wyżej wg etapu | jak wyżej |
| zadanie w realu czeka | jak wyżej | „{tytuł}” czeka u ciebie. | jak wyżej |
| ślad zostawiony | jak wyżej | Na polanie przybyło coś nowego — {miejsce_reakcji}. | Lisek śpi obok tego, co przybyło. |
| Mentor {zobaczył\|zobaczyła} | jak wyżej | Przy drzewie wyrósł kwiat, którego rano nie było. Mentor już to widzi. | Lisek śpi obok kwiatu. |

Krok 3 · Wizkor (ramka braku pod tekstem pokazuje „{tytuł}” + „Tego magią nie zrobię.”):

| stan | karta (3 wiersze) | głos | 1–3 / 4–8 |
|---|---|---|---|
| nic / brak zadania | Umiem zatrzymać deszcz w pół drogi.\nAle domku z niczego nie zrobię.\nCzegoś tu brakuje — i to nie jest magia. | Umiem zatrzymać deszcz w pół drogi. Ale domku z niczego nie zrobię. Czegoś tu brakuje — i to nie jest magia. | – |
| zadanie w realu czeka | Umiem zatrzymać deszcz w pół drogi.\nAle „{tytuł}” — tego nie.\nU ciebie takie rzeczy leżą zwyczajnie. | Umiem zatrzymać deszcz w pół drogi. Ale „{tytuł}” — tego magią nie zrobię. U ciebie takie rzeczy leżą całkiem zwyczajnie. | 1–3: „Deszcz umiem zatrzymać. „{tytuł}” — nie. To jest u ciebie.” |
| ślad zostawiony | To, co {zrobiłeś\|zrobiłaś}, już tu jest.\nNa polanie coś przybyło.\nRano będzie widać więcej. | To, co {zrobiłeś\|zrobiłaś}, dotarło do świata. {miejsce_reakcji} coś przybyło — rano będzie widać więcej. | – |
| Mentor {zobaczył\|zobaczyła} | Mentor to {zobaczył\|zobaczyła}.\nPrzy drzewie wyrósł nowy kwiat.\nTego bym nie wyczarował. | Mentor {zobaczył\|zobaczyła}, co {zrobiłeś\|zrobiłaś}, i przy drzewie wyrósł kwiat. Tego bym nie wyczarował. | – |

Krok 4 · lisek (przycisk „Dobrze”; przy stanie „nic” i „zadanie” drugi przycisk „Zostaw otwarte” — dawne „Niech zostanie odkryte” siedmiolatek nie odróżnia od „Dobrze”):

| stan | karta (= głos) | 1–3 / 4–8 |
|---|---|---|
| nic | Trzymam miejsce.\nPoszukamy jutro, jak będzie jasno. | – |
| zadanie czeka | Ja pilnuję drzewa.\n„{tytuł}” jest u ciebie — ja tu poczekam. | 4–8: „Ja pilnuję drzewa. „{tytuł}” czeka u ciebie.” |
| ślad | Widziałem, co przybyło.\nJutro obejrzymy to z bliska. | – |
| Mentor | Kwiat przy drzewie widać z pomostu.\nJutro pokażę ci, gdzie. | – |

Odzew po „Zostaw otwarte”: „Zostaje otwarte. Gwiazdom tak wygodniej.”

Krok 5 · narratorka, przycisk „Dobranoc, planeto”:

| stan | tekst |
|---|---|
| nic / zadanie | Stoi otwarte. Będzie stało. |
| ślad / Mentor | Jest. I zostanie. |

Po zamknięciu: świat zostaje nocą, chodzić wolno, Wizkor i lisek milczą (dotknięcie
Wizkora → krótki toast „Wizkor śpi”), a górny HUD pokazuje księżyc. Nowy dzień zaczyna
się przy następnym wejściu (dziś: przy odświeżeniu — do decyzji, patrz notatki).

### 3.4 Powrót (następne wejście) — narratorka na wejściu, potem Wizkor na podejście

| stan wczoraj | narratorka na wejściu (głos + podpis nad HUD) | Wizkor przy podejściu (karta / głos) |
|---|---|---|
| nic nie zrobione | Noc minęła. Wiatr położył liść na {pomoście\|placu\|polanie}. | zwykła kwestia stanu (bez „no i jak, {znalazłeś\|znalazłaś}?”) |
| zadanie w realu czeka | Noc minęła. Lisek pilnuje drzewa. | karta: „{tytuł}” czeka. U ciebie, nie tu. · głos: „{tytuł}” dalej czeka — u ciebie. Jak zrobisz swoje, polana to zauważy. |
| ślad zostawiony wczoraj (świat odpowiedział) | {miejsce_reakcji} przybyło coś, czego wczoraj nie było. (kamera: `pokazMiejsce` na miejsce reakcji) | karta: Ślad zostawiony. · głos: To {miejsce_reakcji} — to od ciebie. · gdy Mentor istnieje (nie demo): karta „Mentor już to widzi.” · głos „Mentor już widzi, co {zrobiłeś\|zrobiłaś}. A to {miejsce_reakcji} — to od ciebie.” |
| Mentor {zobaczył\|zobaczyła} w nocy | W nocy przy drzewie wyrósł kwiat. (kamera na drabinkę) | karta: Mentor to {zobaczył\|zobaczyła}. · głos: Mentor {zobaczył\|zobaczyła}, co {zrobiłeś\|zrobiłaś}. Kwiat przy drzewie zostaje — a teraz mam dla ciebie następny brak. |
| zadanie czeka od kilku sesji | Noc minęła. W trawie przy drzewie coś się zagnieździło. ⚙ (obiekt do zbudowania — gniazdo/ptak przy drzewie; do tego czasu wariant „nic nie zrobione”; bez słowa o zadaniu; brak zmienia przeznaczenie — `koniec-dnia.v1.json:80`) | zwykła kwestia stanu |

Warianty 1–3: narratorka jednym zdaniem („Noc minęła. Coś przybyło pod drzewem.”);
4–8: bez zmian. Wszystkie kwestie sekwencji mają `tekstEkranu` = karta.

## 4. Werdykty panelu

**copywriter.** Zaproszenie w dwóch linijkach: tak — każda karta ma czasownik i rzecz,
tytuły ról zostają w zadaniach (Zadanie B). Wprowadzone poprawki: (1) „Odbieram nagrodę!”
→ „Patrzę!/Dobrze/Idę zobaczyć”; (2) usunąłem „Super! ✦” z CTA ekranów nagrody;
(3) w zachodzie bez zadania skróciłem głos do dwóch zdań; (4) chip „Twoja siła na start”
zamiast „Twój archetyp”. Wątpliwość dla narratora: „Tu już nic mi nie trzeba” może brzmieć
jak odprawa — narrator rozstrzyga.

**psycholog.** Presja i wstyd: sekwencja końca nie ma terminu ani liczby; brak jest zawsze
po stronie świata, nie dziecka; „Niech zostanie odkryte” zostaje jako trzecia droga.
Ryzyka, które poprawiłem: (1) „Wyrwa Cię złapała!” i „Ostatnie serce…” — strata jako
treść; zamienione na „Bieg przerwany.” i „Jeszcze jedno serce.”; (2) „szczere odpowiedzi
zasłużyły” — ocena szczerości u sześciolatka; wycięte; (3) „Mentor prosi o poprawkę” —
zadanie, które da się oblać; status usunięty; (4) w powrocie „nic nie zrobione” żadna
postać nie wraca do tematu; (5) w kroku 4 przy zadaniu „razem” dla 1–3, żeby siedmiolatek
nie został sam z „zrobisz”. Weto niepotrzebne. Uwaga na później: demo-notatka udająca
Mentora to obietnica relacji, której nie ma — oznaczyć jawnie (pytanie w notatkach).

**rodzic-1-3.** Siedmiolatek z lektorem: karty zachodu i końca dnia mieszczą się w jednym
oddechu lektora; „{tytuł}” w cudzysłowie lektor czyta bez cudzysłowu, więc tytuły zadań
muszą być rzeczownikami („Zwiadowca”), nie zdaniami. Poprawki: (1) w 1–3 pierwsze zdanie
głosu = karta (wszędzie); (2) „Sprawdź, czy u ciebie za oknem też” działa w bloku, bez
wychodzenia i bez mnie; (3) wyciąłem „skup się jeszcze na chwilę” z onboardingu — to mówi
nauczyciel. Co się posypie: „Jutro pokażę ci, czego mi brakuje” — jutro dziecko zapyta
mnie, czego Wizkorowi brakuje; niech ramka braku pokazuje to od razu.

**rodzic-4-8.** Infantylne: „mały wędrowcze”, „łapki”, „Szykuję zabawę…”, „Brawo!”,
„Wspaniale!”, „Super!” — wszystkie zdjęte albo z wariantem 4–8. „Wyrwa Cię złapała”
jedenastolatek weźmie jako kpinę — zmienione. Ekran „MENTOR ZATWIERDZIŁ / Świetna robota!”
nad minigrą to raport dla dorosłych w środku gry — wycięty. Dowód: „Dodaj zdjęcie rzeczy
(bez ludzi)” daje mu kontrolę nad kadrem. Zostawiłbym „Nie teraz” przy zaproszeniach
liska — to jedyny przycisk, który nie tłumaczy się z odmowy.

**narrator-gama (ostatni).** Ton: Wizkor zleca i nazywa brak, lisek mówi „razem”,
narratorka opisuje rzeczy — podział trzyma się we wszystkich nowych kwestiach. Nazwy tylko
z kanonu: „plac budowy”, „pomost”, „domek na drzewie” (jako brak), „polana”, „Minigry”;
„skrzynia z grami”, „skarbiec”, „zwój Wizkora”, „góra” wypadły. Poprawki wprowadzone:
(1) „Tu już nic mi nie trzeba” → „Tu już nic mi nie trzeba.” zostaje, ale w 1–3 zastąpione
„U ciebie, nie tu.” (copywriter miał rację, że to blisko odprawy — w 4–8 to działa);
(2) lisek w kroku 4 przy „ślad”: „Widziałem, co przybyło” — lisek widzi, nie ocenia, ok;
(3) w onboardingu narratorka mówi „Świat Ewolucji jest otwarty” — bezimienna, rodzaj
żeński nie pada, ok; (4) usunąłem „opiekun Świata Ewolucji” (kanon: przewodnik);
(5) w kwestii koła „którą siłą dziś działasz” zamiast „ćwiczysz” — siła to mocna strona,
nie trening. Do Zadania C: lisek w poradach nadal cytuje Wizkora — poza tym dokumentem.

## 5. Lista „zostaje” z powodem

| gdzie | dlaczego zostaje |
|---|---|
| `misjeGier.js:92–102, 165–175, 232–242` (zbieranie / komplet ×3) | jeden fakt ze świata + jedno polecenie, ≤ 3 zdania, obiekty istnieją |
| `kwestieWizkora.js:367, 375, 388` (karty puzzli) | jedno polecenie ≤ 45 zn., zgodne ze sceną |
| `Swiat.jsx:1372, 1912, 1394` (toasty drewna i pomostu; `:1937` tytuły zostają, opis poprawiony) | nazywają rzecz, która właśnie się zmieniła; ≤ 28 zn.; wzorzec toastu |
| `Swiat.jsx:1342` „Znajdź 9 kawałków obrazka” | cyfra w toaście jako widoczny koniec, nie rozliczenie; tytuł mieści się |
| `Swiat.jsx:2128` „Masz wszystkie kawałki!” | reakcja świata na komplet, bez liczby |
| `Swiat.jsx:319–341` zaproszenia liska + START / Nie teraz | lisek mówi od siebie o tym, co znalazł; odmowa nic nie kosztuje |
| `Swiat.jsx:1392` dziennik „Na drzewie stanął pomost z drabinką” | podmiotem rzecz, prawda o scenie |
| `koniec-dnia.v1.json:45` lisek „Trzymam miejsce. Poszukamy jutro, jak będzie jasno.” | wzorzec: ciężar po stronie postaci, termin „jak będzie jasno” bez presji |
| `porady-zdrowia.v1.json` oczy, plecy, ruch, nogi, cisza, sluchawki | jedno zdanie o ciele, tryb zapraszający, bez liczenia i obietnic |
| `wskazowki.js:82–84` chmurka liska | lisek zaprasza „razem”, dwa zdania, po co, nie co |
| `zadanieWizkora.js:53, 60` „Do zrobienia / Zrobione” | stan, nie ocena |
| `ZadaniePanel.jsx:219, 363, 376, 380` + błędy `:124–158` (`:296`, `:347` → poprawka po recenzencie, §8) | mówią, gdzie iść i co zrobić, bez oceny; błędy tłumaczą i dają drugą drogę (słowa) |
| `PoradaPanel.jsx:151, 174, 195, 128, 130` | nagłówki bez etykiety profilu |
| `KoloFortuny.jsx:185, 197, 251, 261` | nazwa siły i tytuł zadania, CTA jednowyrazowe |
| `PuzzleBrama.jsx:357–362` | instrukcja obsługi, „brama” jako nazwa układanki |
| `poziomyGier.js`, `HubDock.jsx`, `ProfilPanel.jsx:54`, `MinigryPanel.jsx` | etykiety UI bez oceny i liczb |
| `WiadomosciPanel.jsx:112` „Na razie cisza. To też jest w porządku.” | pustka nazwana bez wyrzutu |
| `zasadyGier.js:24–26`, `TutorialGry.jsx` | trzy kroki, wzorzec tutorialu |
| splashe gier (`MemoryGame.jsx:484–491`, `Choinka:1401–1408`, `Bieg:922–929`) i komunikaty w locie | instrukcje w czasie gry, bez oceny dziecka |
| `BiegLiskaGame.jsx:906–907` błąd ładowania | tłumaczy bez winy |
| `Onboarding.jsx:279, 359, 588, 736` (Otwieram świat… / Dalej / Start / Odkryj swoją siłę →) | neutralne CTA; „Odkryj swoją siłę” to decyzja autora |
| `Landing.jsx` START | jeden przycisk |
| `RewardScreen.jsx:78` „Dziękuję ✦” | domyślne CTA bez zachwytu |


## 6. Uzgodnienie z kopią roboczą (stan na dziś, `git diff HEAD` z Windows, 17.09 wieczór)

Zmiany drugiej sesji, niezacommitowane, w plikach z inwentarza: `kwestieWizkora.js`,
`misjeGier.js`, `poradaDnia.js`, `koniec-dnia.v1.json`, `porady-zdrowia.v1.json`,
`Onboarding.jsx`, `Swiat.jsx`, nowy `PasekKolejnejMisji.jsx` (+ `styles/pasek-misji.css`),
`scena-3d-src/src/app.js` (+160: `pokazZnakWKadrze`, najazd kamery — bez tekstów dla dziecka),
`index.js` (+1 eksport), `public/scena-3d/mapa.json` (suchy pień wyłączony: `sucheDrzewka: []`).
Nic w tych plikach nie zmieniałem.

### 6.1 Wpisy inwentarza dotknięte przez drugą sesję

| wpis inwentarza (HEAD) | co zmieniła druga sesja | mój werdykt nadal? | nowa linia |
|---|---|---|---|
| `kwestieWizkora.js:157–163` zlecenie drewna | głos: „Widzisz to wielkie drzewo na polanie? Zbudujemy na nim domek. Na pomost trzeba desek, a pod drabinkę kamieni. Zetnij jedno z drzew, rozbij głaz i przynieś je pod to wielkie drzewo.” (180 zn., 4 zdania); karta: „Zbudujemy domek na drzewie.\nZetnij jedno drzewo i rozbij głaz.” (62 zn., dwa wiersze) | **częściowo** — karta ma teraz powód i pierwszy ruch (dobrze), ale głos urósł do 180 zn. i 4 zdań; „zetnij jedno z drzew” jest sprzeczne z kanonem (tylko suche/powalone) — to decyzja 16.09 vs kanon 17.09, do rozstrzygnięcia przez autora (notatki). Wersja GŁÓWNA (§3 promptu wygrywa): karta „Zbudujemy domek na drzewie.\nZetnij suche drzewko i przynieś drewno.” · głos „Na tym drzewie stanie domek. Na pomost trzeba desek. Zetnij suche drzewko i przynieś trzy stosy drewna pod wielkie drzewo.” (≤ 140, 3 zdania). Wariant kopii roboczej („Zetnij jedno drzewo…”) tylko jako alternatywa do decyzji autora (`06` pkt 13–14; wymaga przywrócenia `sucheDrzewka` w `mapa.json`) | `:160–179` |
| `kwestieWizkora.js:196–209, 224, 248, 263, 285, 311, 323, 399, 419, 432` | bez zmian treści; przesunięcie | **nadal** (wszystkie werdykty z §2.2) | `:201–217, 223, 247, 263, 284, 310, 322, 398, 418, 431` |
| `misjeGier.js:253–256` wypłata za Bieg | „Przebiegłeś całą trasę i jeszcze liczyłeś po drodze. Głowa i nogi pracowały razem — świetna robota. {nagroda} monet jest twoje.” | **nadal przepisać, pogorszone** — doszedł ozdobnik „świetna robota”, monety i brak tokenów zostały; poprawka z §2.2 obowiązuje | `:253–256` |
| `poradaDnia.js:56` zapowiedź „Strząśnij napięcie” (za flagą) | „Trzy ruchy: łapki, barki i głowa. Poruszamy nimi chwilę i strząsamy napięcie. Gotowy?” | **nadal poprawka** (drobna): „Gotowy?” bez tokenu → „{Gotowy\|Gotowa}?” albo „Ruszamy?”; 4–8: „łapki” → „ręce” | `:56` |
| `koniec-dnia.v1.json:54–55` krok `odejscie` | „Drzwi stoją otwarte.\nDomek czeka na ciebie.” | **nadal, pogorszone: poprawka → przepisać** — drzwi i domek nie istnieją (etap 1 = pomost bez domku; `hut2` wyłączony), „czeka na ciebie” przenosi ciężar na dziecko wbrew `_zasady` tego samego pliku. Obowiązuje §3.3 krok 5: „Stoi otwarte. Będzie stało.” / „Jest. I zostanie.” | `:54–55` |
| `porady-zdrowia.v1.json` woda | „Napij się teraz kilku łyków wody. Mała przerwa też może dobrze zrobić.” (70 zn., 2 zdania) | **częściowo** — liczenie zniknęło; > 65 i dwa zdania. Poprawka z §2.4: „Kubek wody teraz. Reszta poczeka.” | `:5` |
| oddech | „Weź trzy spokojne oddechy. Czasem już to pomaga trochę zwolnić.” | **nadal** — dalej liczy; poprawka z §2.4 | `:9` |
| dwor | „Nawet krótkie wyjście na dwór i trochę ruchu się liczy.” | **nadal** — „się liczy” = punktacja; poprawka z §2.4 | `:10` |
| przekaska | „Dodaj dziś do posiłku coś chrupiącego i kolorowego — na przykład owoc albo warzywo.” (78 zn.) | **nadal wyciąć** — temat jedzenia, > 65 | `:12` |
| ramiona | „Zakręć ramionami do tyłu pięć razy. Sprawdź, czy barki zrobiły się luźniejsze.” (76 zn.) | **częściowo** — obietnica efektu zniknęła, zostało liczenie i długość; poprawka z §2.4 | `:16` |
| usmiech | „Uśmiechnij się do siebie w lustrze i zobacz, jak zmienia się twoja twarz.” (71 zn.) | **częściowo: wyciąć → poprawka** — pseudonauka zniknęła, to już czynność; skrócić: „Uśmiechnij się do lustra i zobacz, co robi twarz.” | `:17` |
| sluchawki | „Ścisz trochę słuchawki. Twój słuch też potrzebuje odpoczynku.” (61 zn.) | **zostaje** (zmienione, dalej w standardzie) | `:20` |
| `Onboarding.jsx:396` intro quizu | „…Zanim ruszymy w drogę, chcę cię lepiej poznać. Przygotowałam dla ciebie kilka prostych pytań. Odpowiadaj szczerze, a na końcu zobaczysz, jaka siła jest ci najbliższa…” | **nadal przepisać** + nowy problem: forma żeńska („Przygotowałam”) w głosie `las_decyzji`, czyli Wizkora — mówi kobieta głosem czarodzieja (podział ról); długość bez zmian (256), „odpowiadaj szczerze” zostało. Poprawka z §2.1 (Wizkor, „Przygotowałem” zbędne — bez czasu przeszłego) | `:396` |
| `Onboarding.jsx:749` celebracja | „Brawo! Pierwsze 50 złotych monet jest już w twoim skarbcu. To dopiero początek.” | **nadal przepisać** — rodzaj zdjęty (dobrze), ale „Brawo!”, cyfra, skarbiec i monety za test zostały; poprawka z §2.1 | `:749` |
| `Swiat.jsx:1372–1375` toast po zleceniu drewna | „Zetnij drzewo, rozbij głaz” (26 zn.) · opis: „Potem zanieś materiał pod wielkie drzewo na polanie” | **poprawka** — §3 promptu: tylko suche drzewko, a głaz po `da86ca2` nie jest rozbijany. Wersja główna: tytuł „Zetnij suche drzewko” (19 zn.) · opis „Potem zanieś drewno pod wielkie drzewo na polanie”. Wariant kopii roboczej — alternatywa do decyzji autora (`06` pkt 13–14) | `:1440–1443` |
| `Swiat.jsx:1362, 1394, 1447, 2015, 2032, 2039, 2057, 2128, 2131, 2740` | bez zmian treści; po „start” doszedł najazd kamery na pierwszą gwiazdkę (`pokazZnakWKadrze`) — dobra reakcja świata bez tekstu | **nadal** | `:1414, 1462, 1515, 2083, 2100, 2107, 2125, 2196, 2199, 2809` |

Bilans: **0 wpisów naprawionych w całości**, 4 częściowo (drewno, woda, ramiona, usmiech),
6 nadal (w tym 2 pogorszone: wypłata za Bieg, krok `odejscie`), 2 zmienione i nadal „zostaje”
(sluchawki, toast drewna). Linie inwentarza w `kwestieWizkora.js` po `:179` przesuwają się o −1,
w `Swiat.jsx` o +52…+77 (wartości wyżej).

### 6.2 Nowe komunikaty (delta) — ocena wg `01_STANDARD_GLOSOW.md`

| gdzie (kopia robocza) | głos | typ · moment | tekst | ocena wg standardu | werdykt | poprawka |
|---|---|---|---|---|---|---|
| `Swiat.jsx:1157–1162` (`zapowiedzKolejnejMisji`) | W (głos, bez karty) | reakcja świata + zapowiedź, 1,1 s po zamknięciu ekranu nagrody za gwiazdki | Udało ci się, wędrowcze — polana znów świeci. A teraz spójrz na to drzewo. Myślę, że da się przy nim zbudować coś, co zostanie tu na dobre. | 139 zn., 3 zdania — w limicie; „wędrowcze” zakazane; struktura dobra (co się stało → co teraz → po co); brak `tekstEkranu` (mówi tylko głos, karty nie ma — dla 1–3 to kwestia bez oparcia na ekranie) | poprawka | Polana znów świeci. A teraz spójrz na to wielkie drzewo — da się przy nim zbudować coś, co zostanie na dobre. (118 zn.) · 1–3: „Polana znów świeci. Spójrz na to wielkie drzewo.” · tekst ekranu: tytuł paska (niżej) |
| `Swiat.jsx:1163` toast | UI | toast w tej samej sekundzie co głos i pasek | Wizkor ma nowy pomysł | 21 zn., prawda, ale trzy sygnały naraz (głos + toast + pasek) o tym samym; pasek ma własny tytuł | wyciąć (dublet paska) | – ; jeśli pasek wypada (niżej), toast zostaje jako jedyny tekst ekranu: „Wizkor ma nowy pomysł” |
| `PasekKolejnejMisji.jsx:25` | UI | pasek nad HUD wypełniający się 2,6 s, potem okno Wizkora | Wizkor szykuje kolejne zadanie | tytuł 30 zn. (> 28) i **pasek postępu, który sam się wypełnia = odliczanie** (konstytucja §0.3, standard R5: nic nie mierzy czasu na ekranie); „kolejne zadanie” = lista do odhaczenia | poprawka | tytuł: „Wizkor ma nowy pomysł” (21 zn.); wypełnienie zamienić na spokojne pulsowanie portretu bez toru (albo pasek wyciąć i otworzyć okno 2,5 s po głosie — rekomendacja) |

Uwaga do sekwencji „po gwiazdkach świat idzie dalej sam” (decyzja 17.09): kierunek zgodny z
R4 (koniec etapu pokazuje zmianę świata i powód), ale to wciąż kolejna rzecz NA ekranie —
zlecenie drewna. Standard tego nie blokuje (drewno jest zadaniem świata z widocznym
efektem); pilnować, żeby po **pomoście** ostatnia kwestia prowadziła poza ekran (§2.2, §3).


## 7. Naniesione recenzje (`tmp/tresci-recenzja-weto.md`, `tmp/tresci-recenzja-glos.md`)

Weto i poprawki wprowadzone w całości; uwagi według uznania. Dokumenty: 01 i 02.

| wpis | wprowadzono / odrzucono | dlaczego / gdzie |
|---|---|---|
| weto-1 · rodzic-1-3 · „na zewnątrz” w zachodzie, kroku 2, powrocie, `:285` | wprowadzono | „u ciebie, nie tu” / „u ciebie w domu” wszędzie (§2.2, §3.1, §3.3, §3.4); do 01 §3 dopisany wiersz zakazu |
| weto-2 · psycholog · „Mentor już to widzi” bez Mentora | wprowadzono | stan „Ślad zostawiony” z podtytułem tylko przy istniejącym Mentorze (nie demo) — §2.2 `:263`, §2.5 `:58`, `:281`, §3.4; 01 R9 i wiersz Mentor-tekst |
| weto-3 · psycholog · „spójrz, zanim zajdzie słońce” | wprowadzono | §3.1 wariant Mentor: „…którego rano nie było. Spójrz.” |
| weto-4 · psycholog · „wciąż nie ma drewna” | wprowadzono | „jeszcze nie ma drewna” (§3.3 krok 2) |
| weto-5 · rodzic-1-3 · przycisk „Niech zostanie odkryte” | wprowadzono | „Zostaw otwarte” (§3.3 krok 4, §2.7) |
| weto-6 · rodzic-4-8 · lisek 4–8 „zrobisz, jak będzie jasno” | wprowadzono (scalone z glos-9) | „Ja pilnuję drzewa. „{tytuł}” czeka u ciebie.” — bez „zrobisz” (przypomnienie rodzica) i bez „jutro” (zadanie da się zrobić dziś w domu) |
| glos-1 · narrator-gama · `:323` „Wyjdź, jest jasno” | wprowadzono | karta „Na dziś koniec zleceń. Polana poczeka.”, głos „…U ciebie dzieje się więcej niż tu.” (§2.2, 01 para 6) |
| glos-2 · copywriter · „na zewnątrz” ×6 | wprowadzono | jak weto-1; powrót głos po §8: „Jak zrobisz swoje, polana to zauważy.” |
| glos-3 · narrator-gama · „Zbierzesz je, zanim zgasną?” | wprowadzono | karta „spadło”, głos „Pozbierasz je?” (§2.2 `:432`, 01 para 8) |
| glos-4 · copywriter · „{zrobiłby\|zrobiłaby} bohater” | wprowadzono | „Wybierz, co zrobi bohater” (§2.1 `:396`) |
| glos-5 · narrator-gama · „pod drzewem coś przybyło” | wprowadzono | pole `{miejsce_reakcji}` z karty zadania w §2.2 `:263`, §2.5 `:233`, `:281`, §3.1, §3.3, §3.4; opis pola pod §3.1 |
| glos-6 · copywriter · puste tokeny `{wrócisz\|wrócisz}` | wprowadzono | usunięte w 02 (`:285`, §3.4) i 01 §3; reguła w 01 §3 |
| glos-7 · narrator-gama · krok 3 „Jutro pokażę ci, czego mi brakuje” | wprowadzono | „Czegoś tu brakuje — i to nie jest magia.” (§3.3) |
| glos-8 · uwaga · Mentor jako sprawca światła | wprowadzono | „Przy drzewie wyrósł kwiat, którego rano nie było. Mentor już to widzi.” (§3.3 krok 2) |
| glos-9 · uwaga · lisek 4–8 „zrobisz, jak będzie jasno” | wprowadzono | scalone z weto-6 |
| glos-10 · uwaga · CTA „Wychodzę” | wprowadzono | „Idę” (§2.2 przyciski, §3.1) |
| glos-11 · uwaga · toast „Zadanie w Zadaniach” | wprowadzono | „Zadanie czeka u ciebie” (§2.3 `:1447`) |
| glos-12 · uwaga · chmurka „sen” | wprowadzono | wyciąć (§2.4) — R7 nie mówi o porze |
| glos-13 · uwaga · chmurka „dwor” | wprowadzono | wyciąć, treść scalona z „przerwa” (§2.4); zostaje 11 myśli |
| glos-14 · uwaga · „Brama Świata Ewolucji” | wprowadzono | „Świat Ewolucji jest otwarty. Na polanie czeka lisek.” (§2.1 `:749`, §4, 01 para 14) |
| glos-15 · uwaga · pusty stan Porady (spójność i) | bez zmian w 02 | obowiązuje wersja 02; poprawka po stronie `04` §4.2 pkt 11 |
| glos-16 · uwaga · stopka tutorialu „więcej gwiazdek” | wprowadzono | „Im mniej ruchów, tym pełniejszy wynik na końcu.” (§2.6) |
| glos-17 · uwaga · „coś się zagnieździło” bez obiektu | wprowadzono | oznaczone ⚙ do zbudowania, do tego czasu wariant „nic” (§3.4) |
| glos-18 · uwaga · „za oknem” trzy razy w jeden wieczór | odrzucono jako zmiana tekstu, wpisane do notatek | wariant zachodu „brak zadania” zostaje (jedyny bez zadania w realu); rodzina czynności „okno” do rejestru w `06` (`tmp/tresci-notatki-A.md`) |
| spójność (a) · `zapowiedz` liska ≤ 120 | wprowadzono | 01 §1 wiersz lisek |
| spójność (b) · dodatek Mentora = kwiat przy drabince | wprowadzono | §2.2 `:248`, §3.1, §3.3 krok 2–4, §3.4; 01 R9 i para 3; światło tylko w MD |
| spójność (e) · cztery stany zadania | wprowadzono | §2.5 `:53/:58/:59/:60`, 01 R9 (klucze `doZrobienia / czeka / slad / zauwazone`) |
| spójność (g) · R7 + filtr tematu + 3 min po odzewie | wprowadzono | 01 R7 |
| spójność (h) · kamień jako materiał | wprowadzono jako wariant | §2.2 zlecenie drewna: wariant „trzy stosy drewna” do decyzji autora |
| spójność (i) · pusty stan Porady | bez zmian | jak glos-15 |
| `05` uwaga 6 · narratorka 1–3 „To od ciebie.” | wprowadzono | 01 §1 wiersz narratorki: świadomy wyjątek po śladzie |
| `03` uwaga 9 · „założę się” | wprowadzono | 01 §3: dozwolone jako trop Wizkora, nie ocena — jedna decyzja dla `03` i `05` |


## 8. Poprawki po recenzencie końcowym (§8 promptu)

| # | co | gdzie w 02 |
|---|---|---|
| 1 | Zlecenie drewna: wersja GŁÓWNA „Zetnij suche drzewko i przynieś drewno” (karta) / „…przynieś trzy stosy drewna pod wielkie drzewo” (głos), bez „rozbij głaz” — §3 promptu wygrywa z decyzją 16.09; wariant kopii roboczej („zetnij jedno drzewo”) tylko jako alternatywa do decyzji autora (`06` pkt 13–14). Toast `:1440` → „Zetnij suche drzewko”. | §2.2 `:157`, §6.1 `:160–179`, `:1440` |
| 2 | Krok dowodu: nagłówek „Pokaż, co {zrobiłeś\|zrobiłaś}”, przycisk „Zostaw ślad”; „Mentor to zobaczy” tylko przy prawdziwym, niedemowym Mentorze. Jedna wersja dla toru — `05` W1 przejmuje ją zamiast „Wyślij do Mentora”. | §2.5 `:296`, `:347` |
| 3 | „Potem zajrzyj na polanę” („zajrzyj” z listy zakazanych) → „Jak zrobisz swoje, polana to zauważy.” | §2.2 `:285`, §3.4 |
| 4 | Lisek 1–3 w kroku 4 → „Ja pilnuję drzewa.\nˇ„{tytuł}” jest u ciebie — ja tu poczekam.” (powód do realu dziś, nie „jutro w grze”) | §3.3 krok 4 |
| 5 | Wolne zdanie Mentora na ekranie dziecka → wybór z gotowych formuł bez oceny („Widziałem.” / „Widziałam.” / „Porozmawiamy o tym.” / „Ciekawe, jak to {zrobiłeś\|zrobiłaś}.”). Wybrałem formuły, nie wycięcie: dziecko potrzebuje sygnału „ktoś to zobaczył”, a gotowa lista zamyka kanał na ocenę. | §2.5 `:246–250` |
| 6 | Opis toastu „Zostało jeszcze jedno” („zostało” zakazane także w `aria-label`) → „Jeszcze jedno jest do przyniesienia”; werdykt zostaje → poprawka. | §2.3 `:1937` |

Skrypt `sprawdz-limity-A.py` rozszerzony o „zajrzyj” i „zostało” w nowych tekstach; przy okazji krok 1 podsumowania „Zostało jedno, …” → „Jedno świeci dalej — …” (to samo słowo, choć o świetle, nie o czasie). Wynik po zmianach: `problemów: 0`.
