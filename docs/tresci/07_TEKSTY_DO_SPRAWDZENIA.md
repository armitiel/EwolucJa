# 07 — Teksty do sprawdzenia (naturalność języka)

> Lista powstała 18.09.2026 po uwadze autora do chmurki Wizkora „Po ekranie ręce i oczy
> lubią chwilę czegoś innego.". Zawiera **wszystkie** teksty z tą samą wadą, nie tylko tę
> jedną. Kolumna „propozycja" to szkic do akceptacji — nic nie zostało jeszcze zmienione.
> Limity i zasady: `01_STANDARD_GLOSOW.md`. Stan danych: `dailyTipsData.js` (210 porad dla
> dziecka), `hub/data/porady-zdrowia.v1.json` (10 myśli Wizkora).

## Na czym polega wada

Trzy wzory, wszystkie z migracji formatu, nie z pisania:

1. **Uosobiona część ciała jako podmiot** — „oczy lubią", „ciało lubi, gdy ktoś",
   „ręce i oczy lubią chwilę czegoś innego". Brzmi jak tłumaczenie z angielskiego ulotki
   o higienie pracy, nie jak zdanie czarodzieja. Do tego dopełnienie bywa puste
   („chwilę czegoś innego" — czego?).
2. **Odzew liska z puli ogólnej** — 146 z 210 porad ma odzew, którego nikt nie napisał
   do tej porady; jedno zdanie („Ja znalazłem swoją rzecz przy oczku. A ty, co?") pada **47 razy**,
   także po poradach, w których nic się nie znajdowało.
3. **`krok` = `zapowiedz`** — 45 porad powtarza to samo zdanie dwa razy pod rząd: lisek je mówi,
   a potem dziecko czyta je jeszcze raz jako instrukcję.

---

## 1. Myśli Wizkora w chmurce (10) — ZROBIONE

Plik: `frontend/src/hub/data/porady-zdrowia.v1.json`. Limit: jedno zdanie ≤ 65 znaków,
obserwacja, nie zlecenie, bez liczenia i bez obietnicy efektu.

**Naniesione 18.09.2026** (decyzje autora) — `porady-zdrowia.v1.json`, commit niżej.
Temat `rownowaga` wypadł w całości: stanie na jednej nodze nie dało się napisać tak, żeby
brzmiało naturalnie w chmurce, a dziesiąte hasło nie jest niczym święte. Na jego miejsce
weszło ziewanie.

| # | temat | było | jest |
|---|---|---|---|
| 1 | `woda` | Gdzieś blisko stoi kubek wody. Reszta poczeka. | bez zmian |
| 2 | `oczy` | Oczy lubią popatrzeć daleko, aż za okno. | Najdalsza rzecz w tym pokoju jest za oknem. |
| 3 | `plecy` | Plecy same się prostują, gdy ramiona opadną. | Plecy prostują się same, kiedy ramiona opadną. |
| 4 | `ruch` | Ciało lubi, gdy ktoś wstanie i się przeciągnie. | Krzesło trzyma mocno. Można mu się wyrwać na chwilę. |
| 5 | `oddech` | Jeden wolny wdech. I jeszcze jeden, wolniejszy. | bez zmian |
| 6 | `rownowaga` → **`ziewanie`** | Stanie na jednej nodze to też mała sztuka. | Ziewanie zaraża szybciej niż śmiech. |
| 7 | `przerwa` | Po ekranie ręce i oczy lubią chwilę czegoś innego. | Ekran zgaśnie na chwilę i nic się nie stanie. |
| 8 | `ramiona` | Ramiona zakręcone do tyłu robią się cięższe i luźne. | Kiedy ramiona idą do tyłu, robi się więcej miejsca na oddech. |
| 9 | `cisza` | Chwila ciszy bez dźwięków to odpoczynek dla uszu. | Cisza też jest dźwiękiem. Najrzadszym. |
| 10 | `sluchawki` | Ciszej w słuchawkach to więcej muzyki na całe życie. | W słuchawkach świat robi się mały, a dookoła nadal coś gra. |

Wszystkie ≤ 65 znaków, bez cyfr, bez uosobionego ciała, bez obietnicy efektu. `rownowaga`
zniknęła też z `KOLIZJE_TEMATOW` w `PodpowiedzMedrca.jsx` (dwie listy: `ruch`, `napiecie-pusc`);
`ziewanie` nie koliduje z żadnym `rodzaj` porady liska, więc wchodzi zawsze.

Dlaczego stare wypadły: `oczy`, `ruch`, `przerwa` mają podmiot „oczy/ciało/ręce", który
„lubi" — dziecko nie mówi tak o sobie i nikt tak nie mówi do dziecka. `ruch` dodatkowo
mówi „gdy ktoś wstanie" — kto? `przerwa` kończy się pustym „czegoś innego". `cisza`
powtarza się sama („ciszy bez dźwięków") i wpada w „odpoczynek dla uszu", czyli język
ulotki BHP. `sluchawki` obiecuje efekt na całe życie — to morał, nie obserwacja.
`ramiona` ma niezręczne „zakręcone do tyłu".

---

## 2. Ta sama konstrukcja w poradach liska (16)

Tu podmiotem jest część ciała, zwierzę albo rzecz, która „lubi" / „potrafi". Część jest
w porządku (zwierzę naprawdę coś potrafi — ciekawostka), część to ta sama wada, co wyżej.

| id | pole | tekst | uwaga |
|---|---|---|---|
| `DT-D11-S3` | odzew | Ja też patrzyłem daleko. Oczy lubią odpoczywać na końcu widoku. | odzew orzeka za dziecko („oczy lubią odpoczywać") — do przepisania na „U mnie…" |
| `DT-D22-S3` | zapowiedz | Połóż jedno pytanie pod poduszkę. To może być nawet: co znaczy moje imię? Sen lubi pracować nocą nad zagadkami. | „Sen lubi pracować nocą" — obietnica efektu we śnie; wyciąć drugie zdanie |
| `DT-D30-S1` | krok | Sowa potrafi obrócić głowę tak daleko, że widzi za siebie. | ciekawostka jako `krok` — brak czynności (patrz §4) |
| `EM-D11-S2-NEW2` | zapowiedz | Uśmiech jednej osoby potrafi rozjaśnić kilka twarzy naraz. Sprawdzimy to dziś razem? | „uśmiech potrafi rozjaśnić kilka twarzy" — obietnica efektu na innych |
| `EM-D13-S1` | zapowiedz | Dłonie potrafią zrobić własne ciepło. Potrzemy je razem i sprawdzimy, gdzie najlepiej grzeją? | ok — „dłonie potrafią zrobić ciepło" jest sprawdzalne ręką |
| `EM-D20-S1` | zapowiedz | Rano ramiona lubią być blisko uszu. Podniesiemy je razem wysoko i puścimy z wydechem? | „ramiona lubią być blisko uszu" — uosobienie, do przepisania |
| `KR-D24-S2-LUKA` | zapowiedz | Gumka, klucz i spinacz potrafią być zwierzęciem, gdy je ułożyć. Zrobimy razem jedno? | ok — rzecz „potrafi być" to zaproszenie do zabawy, nie twierdzenie o ciele |
| `LD-D09-S3` | zapowiedz | Przed wieczorem ciało lubi jeszcze jeden wolny ruch. Wespniemy się razem dziesięć razy i postoimy? | „ciało lubi jeszcze jeden wolny ruch" — uosobienie |
| `LD-D17-S1` | zapowiedz | Rano kręgosłup lubi się wydłużyć. Wyciągniemy razem ręce do sufitu na pięć oddechów? | „kręgosłup lubi się wydłużyć" — uosobienie + słowo spoza słownika dziecka |
| `LD-D18-S1` | zapowiedz | Pięści potrafią zebrać cały prąd z ciała. Zaciśniemy je razem na trzy i puścimy? | „pięści zbierają cały prąd z ciała" — pseudonauka, do przepisania |
| `LD-D30-S1` | krok | Lwy potrafią odpoczywać przez dużą część doby. | ciekawostka jako `krok` — brak czynności (patrz §4) |
| `MD-D14-S1` | zapowiedz | Dłonie potrafią strząsnąć z siebie wszystko jak wodę. Strząśniemy razem i położymy je nieruchomo? | ok — „strząsnąć jak wodę" to porównanie, nie twierdzenie |
| `MD-D17-S1` | title | Najwolniej, jak potrafię | ok — tytuł w pierwszej osobie |
| `ST-D02-S2-NEW1` | title | Liczby lubią się powtarzać | ok — o liczbach, nie o ciele |
| `ST-D04-S2-NEW3` | zapowiedz | Pszczoły potrafią odliczyć cztery znaki na drodze do kwiatów. | **fakt do sprawdzenia** (pszczoły i liczenie znaków) |
| `ST-D17-S1-NEW14` | zapowiedz | Rano ciało lubi sprawdzić, czy trzyma równowagę. Postoimy razem na jednej nodze, licząc do dziesięciu? | „ciało lubi sprawdzić" — uosobienie |

---

## 3. Odzew liska z puli ogólnej (146 porad)

Te zdania podstawił skrypt migracji, nie autor. Lisek mówi je po wykonaniu porady —
i często nie mają związku z tym, co dziecko przed chwilą zrobiło.

| ile razy | zdanie | co jest nie tak |
|---:|---|---|
| 47× | Ja znalazłem swoją rzecz przy oczku. A ty, co? | pada po oddechu, ciszy, rysowaniu — wszędzie; nic nie było znajdowane |
| 23× | U mnie wyszło krzywo i takie ma być. A u ciebie? | pasuje tylko do tworzenia |
| 18× | U mnie wydech był długi jak ogon. A u ciebie? | pasuje tylko do oddechu |
| 16× | U mnie zrobiło się cicho jak w norze. A u ciebie? | pasuje tylko do wyciszenia |
| 14× | U mnie dziś lekki wiatr w środku. A u ciebie? | mgliste — „wiatr w środku" nie odsyła do czynności |
| 12× | U mnie pierwszy krok jest zawsze najkrótszy. A u ciebie? | pasuje tylko do mikroodwagi |
| 9× | Ja też się ruszyłem, aż zafurczało. A u ciebie? | pasuje tylko do ruchu |
| 7× | U mnie to była mała rzecz. A u ciebie, jaka? | mgliste |

Rozkład na profile: DT:28 · EM:23 · ST:28 · KR:26 · LD:17 · MD:24

**Do zrobienia:** każda z tych 146 porad potrzebuje jednego zdania odzewu napisanego do
niej — wzorzec „U mnie … A u ciebie?", lisek mówi o sobie, nie orzeka o dziecku. Pełna
lista id niżej, pogrupowana po profilu.

- **DT** (28): `DT-D01-S1`, `DT-D02-S2-LUKA`, `DT-D03-S1`, `DT-D04-S3`, `DT-D05-S1`, `DT-D06-S3`, `DT-D07-S1`, `DT-D09-S3`, `DT-D10-S1`, `DT-D12-S1`, `DT-D12-S3`, `DT-D13-S2-LUKA`, `DT-D14-S1`, `DT-D15-S2-NEW1`, `DT-D16-S2-LUKA`, `DT-D17-S1`, `DT-D17-S3`, `DT-D18-S2-LUKA`, `DT-D19-S1`, `DT-D20-S3`, `DT-D21-S2-LUKA`, `DT-D22-S3`, `DT-D24-S3`, `DT-D25-S1`, `DT-D26-S3`, `DT-D28-S1`, `DT-D29-S2-LUKA`, `DT-D30-S1`
- **EM** (23): `EM-D01-S1`, `EM-D02-S1`, `EM-D03-S3`, `EM-D04-S1`, `EM-D04-S2-NEW1`, `EM-D05-S1-LUKA`, `EM-D06-S3`, `EM-D07-S1`, `EM-D08-S1`, `EM-D09-S3`, `EM-D11-S1`, `EM-D11-S2-NEW2`, `EM-D12-S3`, `EM-D15-S3`, `EM-D17-S1`, `EM-D18-S2-LUKA`, `EM-D19-S2-NEW3`, `EM-D23-S2-LUKA`, `EM-D24-S3`, `EM-D26-S1`, `EM-D27-S3`, `EM-D28-S1`, `EM-D29-S1-LUKA`
- **ST** (28): `ST-D01-S1-LUKA`, `ST-D02-S2-NEW1`, `ST-D03-S1`, `ST-D04-S1-NEW2`, `ST-D04-S2-NEW3`, `ST-D05-S2-LUKA`, `ST-D06-S1-NEW4`, `ST-D06-S2-NEW5`, `ST-D07-S3`, `ST-D09-S2-NEW7`, `ST-D11-S1-NEW8`, `ST-D11-S3-NEW9`, `ST-D12-S2-LUKA`, `ST-D13-S2-NEW11`, `ST-D14-S3`, `ST-D15-S1-NEW12`, `ST-D15-S3-NEW13`, `ST-D16-S2-LUKA`, `ST-D19-S1-LUKA`, `ST-D20-S3-NEW16`, `ST-D21-S1`, `ST-D22-S1-NEW17`, `ST-D23-S2-LUKA`, `ST-D24-S3`, `ST-D26-S1-NEW18`, `ST-D27-S3-LUKA`, `ST-D29-S2-LUKA`, `ST-D30-S1`
- **KR** (26): `KR-D01-S1`, `KR-D02-S1-LUKA`, `KR-D03-S1`, `KR-D04-S2-NEW1`, `KR-D06-S1-LUKA`, `KR-D07-S1`, `KR-D08-S2-NEW2`, `KR-D09-S1`, `KR-D11-S2-LUKA`, `KR-D12-S1`, `KR-D13-S1`, `KR-D13-S2-NEW3`, `KR-D14-S1-LUKA`, `KR-D16-S1`, `KR-D17-S2-NEW4`, `KR-D18-S1`, `KR-D19-S1`, `KR-D21-S1`, `KR-D22-S1-LUKA`, `KR-D23-S1`, `KR-D23-S2-NEW5`, `KR-D25-S1`, `KR-D26-S1`, `KR-D27-S1`, `KR-D28-S1`, `KR-D29-S1`
- **LD** (17): `LD-D01-S1`, `LD-D02-S2-LUKA`, `LD-D04-S2-LUKA`, `LD-D06-S1`, `LD-D07-S1`, `LD-D08-S2-NEW1`, `LD-D11-S2-LUKA`, `LD-D12-S1`, `LD-D13-S1`, `LD-D16-S1`, `LD-D22-S1`, `LD-D22-S2-NEW3`, `LD-D23-S2-LUKA`, `LD-D27-S1`, `LD-D28-S2-LUKA`, `LD-D29-S2-LUKA`, `LD-D30-S1`
- **MD** (24): `MD-D01-S1`, `MD-D02-S1`, `MD-D03-S1`, `MD-D04-S1`, `MD-D06-S1`, `MD-D07-S1`, `MD-D08-S1`, `MD-D09-S1`, `MD-D10-S1`, `MD-D11-S1`, `MD-D15-S1`, `MD-D16-S1`, `MD-D17-S1`, `MD-D18-S1`, `MD-D19-S1`, `MD-D20-S1`, `MD-D23-S1`, `MD-D24-S1`, `MD-D25-S1`, `MD-D26-S1`, `MD-D27-S1`, `MD-D28-S1`, `MD-D29-S1`, `MD-D30-S1`

---

## 4. `krok` powtarza `zapowiedz` (45 porad)

Karta pokazuje to samo zdanie dwa razy: raz mówi je lisek, raz stoi jako instrukcja.
Do rozdzielenia: `zapowiedz` = zaproszenie („Zrobimy razem…?"), `krok` = co konkretnie
zrobić, z widocznym końcem.

| id | zdanie powtórzone dwa razy |
|---|---|
| `DT-D01-S1` | Zanim wstaniesz, popatrz uważnie na sufit. |
| `DT-D02-S2-LUKA` | Rozejrzyj się i znajdź najmniejszą rzecz w pokoju. |
| `DT-D04-S3` | Wdech nosem — wyobraź sobie, że wciągasz mgłę z lasu. |
| `DT-D05-S1` | Rozejrzyj się po pokoju. |
| `DT-D13-S2-LUKA` | Wymyśl dziś jedno pytanie, na które nikt w domu nie zna odpowiedzi. |
| `DT-D19-S1` | Spójrz na swoje dłonie. |
| `DT-D21-S2-LUKA` | Zamknij oczy i poszukaj najdalszego dźwięku, jaki słyszysz. |
| `DT-D24-S3` | Jaki dźwięk {zapamiętałeś|zapamiętałaś} z dziś? |
| `DT-D26-S3` | Zamknij oczy. |
| `DT-D28-S1` | Zanim zaczniesz dzień, sprawdź: jaki masz nastrój? |
| `DT-D29-S2-LUKA` | Pomyśl, kto dziś wstał przed tobą. |
| `EM-D01-S1` | Zamknij oczy i weź jeden powolny oddech. |
| `EM-D02-S1` | Każde dobre słowo to mała fala — biegnie dalej niż myślisz. |
| `EM-D06-S3` | Wyobraź sobie, że dzień był falą. |
| `EM-D07-S1` | Wczoraj było różowe - dziś może być błękitne. |
| `EM-D08-S1` | Przyłóż dłoń do ucha jak do muszli. |
| `EM-D09-S3` | Wyobraź sobie małego świetlika krążącego nad łóżkiem. |
| `EM-D11-S1` | Rano wsłuchaj się w siebie jak w morze. |
| `EM-D12-S3` | Przed snem przyłóż dłoń do ucha jak do muszli. |
| `EM-D15-S3` | Wybierz jedno słowo z dzisiejszego dnia, które chcesz odłożyć. |
| `EM-D23-S2-LUKA` | Bycie dobrym nie znaczy zgadzać się na wszystko. |
| `EM-D26-S1` | Wymów rano swoje imię cicho do dłoni - jak do muszli. |
| `EM-D27-S3` | Wyobraź sobie, że stoisz na brzegu. |
| `KR-D01-S1` | Spójrz na talerz i wymyśl, jakim stworkiem byłoby twoje śniadanie. |
| `KR-D04-S2-NEW1` | Pomyśl chwilę: jakim smakiem byłaby dzisiejsza chmura? |
| `KR-D07-S1` | Jeden kolor, który będzie ci dziś towarzyszył. |
| `KR-D17-S2-NEW4` | Wyobraź sobie, że drzewa szepczą do siebie korzeniami. |
| `KR-D21-S1` | Czy wiesz, że poeci tworzą rymy od tysięcy lat? |
| `KR-D22-S1-LUKA` | Przesuń dziś jeden przedmiot w swoim pokoju na zupełnie inne miejsce. |
| `LD-D01-S1` | Zanim wstaniesz, połóż rękę na piersi. |
| `LD-D12-S1` | Wyobraź sobie, że masz dziś sztandar. |
| `LD-D16-S1` | Tam, gdzie się trochę boisz, ale wiesz, że jest dobrze — tam idź. |
| `LD-D22-S1` | Lwy odpoczywają wiele godzin dziennie. |
| `LD-D27-S1` | Spójrz dziś rano w okno. |
| `LD-D28-S2-LUKA` | To dobra pora na jedno pytanie. |
| `LD-D29-S2-LUKA` | Latawce nie latają całą noc. |
| `MD-D02-S1` | Weź do ręki jeden mały przedmiot. |
| `MD-D04-S1` | Zanim spotkasz innych ludzi, zauważ swój własny nastrój. |
| `MD-D15-S1` | Wyobraź sobie dwa lustra naprzeciwko siebie i świeczkę między nimi. |
| `MD-D25-S1` | Połóż na otwartej dłoni mały kamyk albo guzik. |
| `MD-D29-S1` | Wdychaj powietrze licząc do czterech, wydychaj do sześciu. |
| `ST-D06-S1-NEW4` | Wyobraź sobie, że dzień to ścieżka z trzema przystankami. |
| `ST-D06-S2-NEW5` | A czy wiesz, że zero zostało wymyślone później niż jeden, dwa i trzy? |
| `ST-D11-S1-NEW8` | Kiedy masz dwa zadania, wybierz jedno na początek. |
| `ST-D12-S2-LUKA` | W górach echo wraca później, gdy przeszkoda jest dalej. |

---

## 5. Ciekawostki bez czynności i fakty do sprawdzenia

Standard (`04` §4.2): ciekawostka wchodzi **tylko** razem z czynnością i po sprawdzeniu faktu.

| id | tekst | co zrobić |
|---|---|---|
| `ST-D06-S2-NEW5` | zero wymyślone później niż jeden, dwa i trzy | `krok` = `zapowiedz`; dopisać czynność, np. „Znajdź dziś trzy rzeczy, których jest zero." |
| `DT-D30-S1` | sowa obraca głowę tak daleko, że widzi za siebie | dopisać czynność (obrót głowy powoli w obie strony) |
| `LD-D30-S1` | lwy odpoczywają przez dużą część doby | dopisać czynność albo wyciąć — dziś sama informacja |
| `ST-D04-S2-NEW3` | pszczoły odliczają cztery znaki w drodze do kwiatów | sprawdzić fakt przed zostawieniem |
| `KR-D21-S1` | poeci tworzą rymy od tysięcy lat | `krok` = `zapowiedz`; dopisać czynność |
| `EM-D04-S2-NEW1` | złość można poczuć w ciele na różne sposoby | zapowiedź o złości, `krok` o radości — rozjazd tematu |

---

## Kolejność pracy

1. Dziesięć myśli Wizkora (§1) — widać je w każdej sesji, jest ich dziesięć, godzina pracy.
2. Osiem zdań odzewu (§3) — napisanie 146 własnych to duża robota, ale sam podział
   puli ogólnej na rodzaje (oddech / ruch / wyciszenie / tworzenie / zmysły / mikroodwaga)
   i dopasowanie po polu `rodzaj` naprawia najgorszy przypadek (47× to samo) w jeden wieczór.
3. `krok` ≠ `zapowiedz` (§4) — 45 porad, po jednym zdaniu każda.
4. Uosobienia w poradach (§2) — 8 wpisów do przepisania.
5. Ciekawostki (§5) — 6 wpisów.
