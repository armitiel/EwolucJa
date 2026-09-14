# Analiza całości i ułożenie rozgrywki

Narada panelu, 2026-09-13. Pięć składów czytało niezależnie
`KONCEPT_GRY.md`, `SYSTEMY_GRY.md`, `ROZWOJ_GRY.md`, `WARIANTY_ROZGRYWKI.md`,
`PIERWSZA_MINUTA.md`, `PIERWSZA_PRZYGODA_ROBOCZA.md`, `porady-ux.md`,
`analityka.md`, `CLAUDE.md` oraz dane: 10 zadań Wizkora, 6 wpisów minigier,
31 kart porad.

Głosy: strateg produktu · projektant zadań · pedagog + psycholog ·
rodzic 1–3 + rodzic 4–8 + socjolog · świeże spojrzenie + narrator.

---

## 0. Fakt do sprostowania na wejściu

`WARIANTY_ROZGRYWKI.md` §0 (11.09) mówi, że produkcja stoi na `48f09e0`,
czyli na płaskiej mapie. **To jest już nieaktualne.** `48f09e0` jest przodkiem
HEAD-a, baza `11f01b7` („lisek na planecie") weszła na `v2-postgres-vercel`,
a gałąź produkcyjna stoi dziś na `0b83e65` z pracami nad fasolą. Planeta jest
na produkcji.

Co jest nadal prawdą: **w drzewie roboczym wisi 86 plików poza commitem.**
„To, co widzę u siebie" i „to, co widzi dziecko" to wciąż dwie różne gry —
tylko przepaść jest mniejsza, niż mówi tamten akapit.

---

## 1. Mocne strony — pięć rzeczy, których nie kupuje się za pieniądze

**1. Tor weryfikacji dowodu przez dorosłego działa na produkcji.**
`seed → submit → panel Mentora → verified`, do tego klasy, pary, zaproszenia
GM, logowanie ucznia kodem. Monety przyznaje wyłącznie backend przy decyzji
Mentora. To nie jest funkcja — to infrastruktura konta dorosłego, nudna,
wielomiesięczna i dokładnie ta, której nie ma żadna aplikacja „dla dzieci"
robiona jako gra.

**2. Zasady ochronne są w kodzie, nie w manifeście.** Brak serii, odliczania
i losowych nagród; porada deterministyczna w dobie; powiadomienia do skrzynki,
nie w modal; tryb `reflektor` gotowy i świadomie nieużywany. Konkurencja
skopiuje to dopiero, gdy rozbierze własny model przychodowy — dla większości
aplikacji dziecięcych te reguły są źródłem pieniędzy.

**3. Gra jest znaleziskiem, nie pozycją na liście.** `zaliczWygrana` nie ruszy
misji, której układanka nie została ułożona; kolejność pilnują dane, nie
ulotna flaga. Nie da się „wejść z linku" i ominąć pętli. Takie rzeczy pisze
się po trzeciej przebudowie, nie na starcie.

**4. Cztery głosy się nie mieszają.** Wizkor nigdy nie opowiada, narratorka
nigdy nie zleca. Dziecko po trzech minutach wie, kto czego od niego chce.
Panel był tu jednomyślny: to najmocniejsza rzecz w tej grze i najłatwiej ją
stracić, dokładając „jedną kwestię, bo pasuje".

**5. Trudność idzie przez miejsce, nie przez poziom.** Dziesięć zadań ×
3–4 `miejsca` = 40 kontekstów. „Znajdź trzy różne liście" w parku i „trzy
rzeczy starsze od Ciebie" w domu to jedno zadanie o dwóch progach. To jest
właściwe skalowanie dla 6–12 lat i dostajemy je za darmo.

Do tego dwie rzeczy operacyjne: **dokumentacja spisana z ekranów, nie
z zamiarów** (bez `KONCEPT_GRY.md` jednoosobowy zespół z agentami produkuje
pięć równoległych fikcji) i **postawa wobec danych małoletniego** gotowa,
zanim ktokolwiek o nią poprosił.

---

## 2. Jedna diagnoza

**Gra jest kompletna na jedno popołudnie i pusta na tydzień, bo z trzech
pętli działa tylko jedna.**

| pętla | zegar | stan |
|---|---|---|
| **puls dnia** — gwiazdki, minigry, porada | minuty | działa |
| **łuk zadania** — zlecenie → real → dowód → werdykt | 1–3 dni | **wychodzi i nie wraca** |
| **ślad** — co z tego zostaje na trwałe | tygodnie | **nie istnieje** |

Pierwsza sesja trwa 45–70 minut i wyczerpuje wszystko: dziesięć gwiazdek
(jednorazowe), trzy gry (zostają w zakładce na stałe), jedno zadanie, jedna
karta porady. **Dzień dwudziesty jest identyczny z dniem drugim**, a Wizkor
po wypłacie za Bieg Liska nie ma nic do zlecenia i milczy — najgorsza możliwa
odpowiedź od jedynego zleceniodawcy w grze.

Druga pętla nie wraca, bo stoi na najbardziej zawodnym elemencie układu:
uwadze zmęczonego dorosłego w środku tygodnia, do którego nie ma jak dotrzeć.
Rodzic powiedział to wprost: *tydzień 1 przeczytam każdy dowód, tydzień 2
będę klikał „przyjmuję" bez czytania, tydzień 3 dziecko powie „i tak nikt nie
patrzy".* Nie ma powiadomienia, więc trzeba z własnej woli wejść na `/mentor`
i sprawdzić, czy coś przyszło.

Trzeciej pętli nie ma wcale. Dowód z prawdziwego życia zamienia się w monetę
i znika, a monety nie mają ujścia — licznik, który tylko rośnie, uczy, że
nagroda jest atrapą.

---

## 3. Policzone dziury

| co | liczba |
|---|---|
| zadania poza ekranem | 10 (przy jednym dziennie: **starczają na 10 dni**) |
| tryby startu zadania | 10/10 „idź i zrób"; odpowiadanie **0**, zaproszenie **0**, obserwacja **0** |
| zadania kończące się produktem do pokazania | **10/10** — nie ma zadania, którego dowodem jest ślad albo cisza |
| `competency_focus` | użyte 2 kody z 6 (MD 6×, EM 6×; DT/ST/KR/LD **0×**) — raport Mentora kłamie o dziecku |
| rodzaj gramatyczny | teksty w rodzaju męskim przy narratorce w żeńskim — połowa odbiorców czyta o kimś innym |
| zadania z ratunkowym miejscem (blok, bez ogrodu, zwierzaka, rodzeństwa, drugiego dorosłego) | **4 z 10**; warunkowe 3; **zero ratunku 3** |
| szansa powtórki cechy w ciągu 3 dni | **52%** (Koło losuje bez pamięci) |
| minigry z tutorialem | 1 z 3 — Lot i Bieg pokazują nagrodę przed partią, a zasad nie |
| karty porad dotykające świata gry | **0 z 31** (21 z 31 to utrzymanie ciała — rodzic przebrany za liska) |
| zdarzenia analityki z pętli zadania w realu | **0** z 7 (mierzymy wyłącznie czas na ekranie) |

Do tego trzy rzeczy, które kłamią dziecku w twarz: **atrapa Rozmów** w doku
z plakietką nowości, **trzy wpisy minigier z `trasa: null`** i kłódkami do
krain, których nie ma, oraz **przycisk „⚙️ DEV"** renderowany każdemu, także
dziecku.

I jedno marnotrawstwo: `AppData` przy **każdym** wczytaniu woła płatne
`/missions/generate`, a hub tej misji nigdzie nie pokazuje.

---

## 4. Jak poukładać rozgrywkę

### Zasada: doba jest zegarem gry

To jedyna brakująca mechanika. Wszystkie pozostałe elementy już istnieją —
brakuje wyzwalacza, który je rozdziela w czasie. Dziś gra podaje cały swój
zapas w jedno popołudnie.

### Dzień

Wejście: **Wizkor ma dziś jedną rzecz.** Jedną, nie trzy. Gdy nie ma —
mówi to wprost (5–7 wariantów kwestii „dziś nic dla ciebie nie mam, ale
zajrzyj do liska"). Dziś takiej kwestii nie ma, a to najczęstszy stan gry
od dnia czwartego.

Obok, niezależnie od Wizkora: gwiazdki wracają co dobę za mniejszą stawkę
i karta porady na dziś. To jest puls — ma być krótki i zawsze dostępny.

### Pierwszy tydzień

| dzień | co się dzieje |
|---|---|
| 1 | gwiazdki (pełna stawka) → Pamięć Mędrca: puzzle 2×2, tutorial, partia |
| 2 | gwiazdki (mała stawka) → Lot Liska **z tutorialem** |
| 3 | Bieg Liska **z tutorialem** |
| 4 | **pierwsze zadanie poza ekranem — cechę wybiera dziecko, nie Koło** |
| 5 | pusto po stronie Wizkora: gwiazdki + porada. Pusty dzień ma wyglądać na spokój, nie na wyrzut |
| 6 | drugie zadanie, z kolejki bez powtórek |
| 7 | pusto |

Sufit: **trzy zadania na tydzień** dla klas 4–6, **jedno–dwa** dla 1–3,
nigdy dwa dni pod rząd. Koło Przeznaczenia **włącza się od tygodnia
drugiego** — losowość po zbudowaniu zaufania, nie przed.

### Pierwszy miesiąc

Tydzień 2: Koło startuje, losuje z kolejki bez powtórek. Tydzień 3: te same
zadania w trudniejszych `miejscach` (park zamiast okna). Tydzień 4: jedno
zadanie **powtórzone** z tygodnia 1, nazwane wprost powtórką — *„Robiłaś to
już. Tym razem gdzie indziej."* Dziecko widzi różnicę w sobie, nie w liczniku.

Ile treści to wymaga: przy 2–3 zadaniach tygodniowo **12 nowych zadań**
(razem 22) starcza na dwa miesiące. Nie 20, nie 30 — dwanaście, po dwa–trzy
na cechę, z naciskiem na kształty, których nie ma. Porady: zdjąć filtr pory
dnia i mieć 31 kart na 31 dni bez pisania ani jednej.

### Trzy zmiany, które to spinają

**A. Ślady na polanie — trzecia pętla za jedno popołudnie pracy.**
Przy przejściu zadania w stan wypłacony dopisz wpis do `ewolucja.slady`
(`{id, cecha, data}`). W `mapa.json` czeka dziesięć pustych slotów
`slad-1…10` wokół polany; zdejmowane ze sceny tym samym mechanizmem, który
dziś zdejmuje znaki nieujawnionych gier (`hub/znakiMapy.js`, `_app.markers`) —
pokazujesz tyle, ile jest wpisów. Obiekt: glinany kamień w kolorze cechy
(pięć kolorów już jest w profilu). Wbiegnięcie: jedno zdanie narratorki
złożone z danych, nie nowa fabuła.

Co to robi: planeta przestaje być planszą zleceń i staje się **zapisem tego,
co dziecko zrobiło poza ekranem**. Po dwóch tygodniach polana wygląda inaczej
u każdego dziecka i nikt tego nie kupił. Domyka trzy sprawy naraz — powód
powrotu, widoczność cech i ujście dla nagrody bez budowania sklepu.

**B. Mentor w dwie minuty.** Dowód ma przychodzić tam, gdzie dorosły już jest
(push), z jednym tapnięciem „widzę, dobra robota", bez logowania do
przeglądarki. Stan `wyslane` dostaje głos Wizkora („Wysłałem. Wracam, gdy
będę wiedział") i **termin 24 godzin**, po którym zadanie domyka się samo
z adnotacją „Mentor nie zdążył". Dziecko nie płaci za to, że dorosły miał
dyżur. To siatka bezpieczeństwa, nie rozwiązanie — rozwiązaniem jest push.

**C. Odwrócić ekonomię.** Dziś dziesięć gwiazdek przebiegniętych w kilka minut
daje 30 monet, a dwadzieścia minut realnej roboty z dowodem — 25. Gra mówi
dziecku wprost, że **ekran płaci lepiej niż świat**. Zadania Wizkora: 40–60
w zależności od `minuty`. Gwiazdki: 10–15 i powrót co dobę.

---

## 5. Cztery spory i rozstrzygnięcia

**Dom czy świetlica?** Socjolog i strateg doszli do tego samego osobno:
najłatwiejsze wejście to **świetlica klas 1–3**. Mentor przestaje być wąskim
gardłem (jedna osoba, dwadzieścia dowodów, jeden siad zamiast konkurowania
z kąpielą), świetlica jest czasem pustym, a trzy zadania z zerowym ratunkiem
w domu naprawiają się same, bo partnerem jest dziecko z sąsiedniego krzesła.
**Rozstrzygnięcie:** świetlica to dowód i pierwsi Mentorzy, dom zostaje
produktem docelowym — ale dopiero po zmianie B.

**Czy auto-zatwierdzanie nie zabija sensu?** Zabija, jeśli udaje dorosłego
(dzisiejsze `DEMO_SAM_ZATWIERDZA`: werdykt po 60 sekundach za zadanie na
20 minut). Nie zabija, jeśli jest nazwane. **Rozstrzygnięcie:** 24 h i jawna
adnotacja, nigdy udawany werdykt.

**Koło Przeznaczenia — zostaje czy wypada?** Projektant chciał je zastąpić
kolejką (przy puli 10 jest generatorem powtórek), narrator bronił ceremonii,
pedagog chciał wyboru w pierwszym tygodniu. **Rozstrzygnięcie:** zostaje jako
ceremonia, ale losuje **z kolejki bez powtórek**, włącza się od tygodnia
drugiego i dostaje jedno zdanie o tym, po co się kręci.

**Jedna gra czy dwie wiekowe?** Jedna. Pole `wiek` (`"1-3" | "4-6" | "obie"`)
na zadaniu **i osobno na każdym miejscu**, filtr przy losowaniu, zero nowych
ekranów. Dla klas 1–3 pokazuj tylko `cel` + `przyklad`, `jak` czyta lektor.

---

## 6. Kolejność robót

**Dziś, jeden dzień pracy, każda pozycja od innego głosu:**

1. Schować „⚙️ DEV" przed dzieckiem (bramka środowiskowa).
2. Wyciąć `/missions/generate` z `AppData` — płacimy za tekst, którego nikt
   nie widzi.
3. Naprawić `competency_focus` w dziesięciu zadaniach — raport Mentora dziś
   kłamie o dziecku.
4. Przepisać teksty zadań na rodzaj neutralny.
5. Zdjąć **Rozmowy** z doku. Trzy ikony, które mówią prawdę, biją cztery,
   z których jedna kłamie.
6. Poprawić `dowod` w „Jeden krok dalej" — prośba o opis uczuć wysyłana do
   dorosłego łamie własny brief.
7. Dopisać ratunkowe miejsca do trzech zadań bez ratunku (`ramie-w-ramie`:
   „przez telefon"; `mistrz-instrukcji`: „nagraj instrukcję"; `jeden-krok-dalej`:
   „powiedz jednej osobie").

**Ten tydzień:** wyzwalacz doby · tutoriale do Lotu i Biegu · kwestie Wizkora
„nie mam dziś zlecenia" · trzy zdarzenia analityki (`zadanie_zlecone`,
`dowod_wyslany`, `dowod_zatwierdzony`).

**Następne dwa tygodnie:** ślady na polanie (A) · push do Mentora i termin
24 h (B) · nowa ekonomia (C) · 12 nowych zadań, w tym kształty, których nie
ma: **wyzwalacz** („zrób, kiedy usłyszysz"), **ograniczenie** („nakryj do
stołu bez jednego słowa"), **ślad zamiast efektu** (odrysuj cień rano
i po południu).

**Czego nie robić teraz:** druga polana i nowe obiekty 3D · trzy gry
z katalogu bez trasy · cechy jako personalizacja (pięć powitań, pięć roślin)
· Mędrzec jako czwarty głos · sklep za monety.

---

## 7. Czego nie ruszać

Rozdział czterech głosów. Pole `szept` — dwa do czterech słów echa celu, jedno
pole, które zamienia polecenie w zaklęcie. `przyklad` głosem dziecka
i niedoskonały („Spróbowałem oliwek. Dziwne, ale zjadłem trzy") — mówi „dowód
nie musi być ładny" skuteczniej niż instrukcja. `dowod` zawsze dwiema drogami.
Brak ponaglania w całym korpusie — przy dokładaniu powodu powrotu to pęknie
pierwsze, pilnować świadomie. Pierwsze pięć minut: bieganie bez tekstu do
czytania.

---

## 8. Co mierzyć i najtańszy dowód

Czas w aplikacji i DAU mierzą tu **porażkę**, nie wzrost — sukcesem jest to,
że dziecko odkłada telefon. Liczby, które mówią prawdę: zadania **zamknięte
dowodem** na dziecko na tydzień · odsetek dowodów **zweryfikowanych przez
Mentora** · powrót po tygodniu, dziecka i dorosłego osobno · przejście od
pierwszego zadania do trzeciego.

**Test na przyszły tydzień:** pięć par dziecko–Mentor, siedem dni,
`DEMO_SAM_ZATWIERDZA = false`, trzy nowe zdarzenia. Jedna liczba rozstrzyga:
**ile z pięciu dzieci dochodzi do drugiego zatwierdzonego zadania.** Poniżej
trzech — problem jest po stronie dorosłego, nie w grze, i nowe minigry
niczego nie uratują.

---

## 9. Czego panel nie wie

Ile poziomów mają dziś minigry. Czy `KARTY_DNIA` w `poradaDnia.js` i
`porady.v1.json` to ten sam zbiór (opisują różne pola). Czy TTS ma cache —
jeśli nie, płacimy za mówienie zdań, które nie zmieniły się od tygodni. Która
wersja pierwszej minuty jest w kodzie: `KONCEPT_GRY.md` opisuje inne wejście
niż `PIERWSZA_MINUTA.md`. Ile razy dziennie wołany jest `narrativeService`.
I najważniejsze: **jak często dzieci wracają** — bo tego nie mierzy dziś nic.
