# 08 — Kanały i występowanie: wspólna bramka komunikatów

> Stan: 18.09.2026. Powstało z jednej obserwacji: „jest kolizja powiadomień”.
> `docs/design-system/powiadomienia.md` mówi, JAK kanały wyglądają i czym są.
> Ten dokument mówi, KIEDY wolno im wejść — i jest nadrzędny, gdy się różnią.
>
> Do tej pory każdy kanał trzymał własną listę stanów, przy których ma milczeć.
> Każda z tych list była niepełna, bo nikt nie ma w głowie wszystkich czternastu
> stanów `Swiat.jsx` naraz. Bramka zabiera tę listę kanałom i trzyma ją w jednym
> miejscu.

## 1. Cztery poziomy głośności

| poziom | co to jest | kanały | głos | blokuje świat |
|---|---|---|---|---|
| **0 · świat** | planeta sama pokazuje | przelot kamery, iskry do licznika, podbicie kafelka, zmiana sceny | nie | nie |
| **1 · znak** | jedno potwierdzenie albo ikona | toast, chmurka ikon przy awatarze, chmurka zadania, pasek kolejnej misji, podpis narratorki | tylko narratorka | nie |
| **2 · szept** | jedno zdanie obok świata | myśl Wizkora o ciele, dymek Reflektora | tak | nie |
| **3 · rozmowa** | świat staje, jest przycisk | karta postaci, szuflady, koło, nagroda, minigry, układanka, rysunek, wnętrze domku, podsumowanie dnia | tak | tak |

Poziom 0 nie pyta bramki o zgodę. Nigdy. Świat ma prawo pokazać, co się zmieniło,
nawet pod oknem — bo nie rywalizuje o uwagę, tylko ją nagradza.

## 2. Sloty — gdzie na ekranie

Dwa kanały tego samego slotu nie stoją obok siebie nigdy.

| slot | kto go zajmuje |
|---|---|
| `chmurka` | myśl Wizkora, dymek Reflektora, chmurka ikon przy awatarze, chmurka zadania |
| `dol` | toast |
| `podpis` | cichy podpis narratorki |
| `karta` | wszystko z poziomu 3 |

Slot `chmurka` jest wspólny dla czterech kanałów i to jest cała zasada „jedna
chmurka na ekranie”, wyjęta z trzech osobnych warunków do jednego miejsca.

## 3. Rejestr zajętości

`Swiat.jsx` melduje bramce stan ekranu w JEDNYM efekcie, przy każdej zmianie:

```
ustawStanEkranu({
  odsloniete,          // chmury się rozsunęły
  rozmowa,             // powitanie | zaproszenie | lisekHybryda | kolo | wskazówka-reflektor
  pelnyEkran,          // gra | nagroda | rysunek | ukladanka | podsumowanie | dom
  szuflada,            // panel (porada, zadania, hybryda, profil, gry, zwój)
  noc,                 // planetaSpi
})
```

Żaden kanał nie sprawdza już tych stanów sam. Dopisanie nowego pełnego ekranu
to jedna linijka tutaj, a nie cztery poprawki w czterech listach wyjątków.

## 4. Werdykty bramki

`czyWolno(poziom, { slot, kanal, minOdstep })` zwraca `{ wolno, powod }`.
Powód jest po to, żeby pulpit DEV mógł napisać, dlaczego chmurka nie weszła —
dziś to się zgaduje z konsoli.

| powód | kiedy |
|---|---|
| `chmury` | świat jeszcze się nie odsłonił |
| `rozmowa` | poziom ≥ 1 pod otwartą kartą albo pełnym ekranem |
| `szuflada` | poziom ≥ 2 pod otwartą szufladą (poziom 1 wolno: HUD i toast stoją nad szufladą) |
| `noc` | poziom ≥ 2 po zachodzie; wyjątek `kanal === "narratorka"` |
| `slot` | slot zajęty przez kogoś innego |
| `budzet` | budżet szeptu na sesję wyczerpany |
| `odstep` | za wcześnie po ostatnim odezwaniu TEGO kanału |
| `odstep-globalny` | mniej niż 45 s od ostatniego odezwania z tekstem, czyjegokolwiek |

**Odmowa nie zużywa limitu.** To jest sedno poprawki: dziś myśl Wizkora odpala
się pod minigrą, odlicza jedenaście sekund za zasłoną i spala jedno z dwóch
dozwolonych wejść. Po zmianie kanał, który dostał `wolno: false`, nie zwiększa
licznika, nie zapisuje znacznika czasu i próbuje ponownie za pół minuty.

## 5. Kolejka głosu

Trzy głosy, jeden lektor. Dotąd każde wywołanie miało `interrupt: true`, więc
narratorka o nocy potrafiła uciąć Wizkora w pół słowa.

| waga | kto | co robi, gdy ktoś już mówi |
|---|---|---|
| 3 · rozmowa | karta postaci, szuflada zadania | przerywa niższych |
| 2 · narratorka | noc, powrót, podsumowanie | przerywa szept, czeka na rozmowę |
| 1 · szept | myśl Wizkora, dymek liska | czeka; odpada, jeśli w kolejce już ktoś stoi |

Równa waga czeka w kolejce, maksymalnie jeden w kolejce. Niższa odpada bez
śladu — i bez zużycia budżetu, bo to ta sama zasada, co w punkcie 4.

## 6. Sześć rytmów — co kiedy wraca

### A · Potwierdzenie — natychmiast, raz, nigdy więcej
Toast, iskry do licznika, podbicie kafelka. Wyzwala je działanie dziecka.
Nie powtarzają się nigdy. Toast pod zasłoną **czeka w kolejce najwyżej 15 s**
i wchodzi, gdy zasłona zejdzie; starszy niż 15 s przepada, bo dziecko już
nie pamięta, czego dotyczył.

### B · Odpowiedź świata — natychmiast, raz na zdarzenie
Przelot kamery, zmiana sceny, podpis narratorki po powrocie. Poziom 0 i 1.
Uruchamiane po śladzie z realu, po zauważeniu przez Mentora, po zbudowaniu
etapu. Dziś przelot chodzi tylko przy zleceniu — ma chodzić po każdej z tych
trzech rzeczy.

### C · Przypominacz etapu — wraca, dopóki etap trwa
Chmurka ikon przy awatarze. Trzy wejścia:

- **po zmianie etapu** — 2,6 s po zmianie (oddech, żeby świat zdążył odpowiedzieć);
- **po postępie wewnątrz etapu** — nie częściej niż co 40 s (pierwsza, piąta
  i przedostatnia gwiazdka, każdy stos drewna, każdy kawałek puzzla);
- **bez postępu** — po 90 s ciągłego wolnego chodzenia, maks. 3 razy na etap.

Licznik zeruje się przy zmianie etapu. Cisza po rozmowie: 45 s, ale **zero, gdy
etap zmienił się od działania dziecka** — świat odpowiada na to, co dziecko
właśnie zrobiło, i nie ma powodu z tym czekać minutę.

### D · Zaproszenie do miejsca — raz na miejsce, potem nigdy
Dymek Reflektora. Bez zmian: 90 s, powtórka co 210 s, porada dnia raz na sesję,
minigry trzy razy. Pierwsze wejście do panelu gasi zaproszenie **na zawsze**.

### E · Myśl bez celu — rzadko, bez konsekwencji
Myśl Wizkora o ciele. Reguła R7 bez zmian: 240 s / 300 s, maks. 2 na sesję,
nic po zachodzie, ≥ 120 s od kwestii Wizkora, ≥ 180 s od odzewu liska, filtr
tematu kolidującego z poradą dnia. Zmienia się tylko to, że **odmowa bramki
nie zużywa jednego z dwóch wejść**.

### F · Koniec dnia — zawsze wchodzi, nigdy nie odpada
Zachód, noc, podsumowanie. Poziom 3 i waga głosu 2–3. Jeśli ekran jest zajęty,
czeka w kolejce zamiast przepaść — tak jak dziś działa `zachodWKolejce`.

## 7. Budżet szeptu na sesję

**Cztery odezwania z tekstem na sesję** poza rozmowami zleceń. Wspólny licznik
dla myśli Wizkora i dymków Reflektora; wewnątrz niego myśl ma swoje 2, dymek
porady 1, dymek minigier 3. Po wyczerpaniu budżetu poziom 2 milczy do końca
sesji — ikony i świat działają dalej.

Powód jest w opisie projektu: sesja jest celowo krótka, a jej najlepszym końcem
jest to, że dziecko odkłada urządzenie. Kanał, który dopomina się o uwagę po raz
piąty, pracuje przeciwko temu.

## 8. Mapa sesji — co kiedy może się pojawić

| czas | kanał | poziom | warunek bramki |
|---|---|---|---|
| 0:00 | najazd kamery, podpowiedź sterowania | 0 / 1 | raz w życiu gracza |
| 0:06 | karta Wizkora — zlecenie | 3 | zawsze |
| 0:07 | toast + przelot na polanę | 1 / 0 | toast czeka, aż karta zejdzie |
| 0:10 | chmurka ikon — co teraz | 1 | 2,6 s po zmianie etapu; cisza 0 s, bo zmiana od karty… |
| 0:10 | …ale karta właśnie mówiła to samo | — | cisza 45 s, wchodzi ok. 0:52 |
| 1:30 | dymek: porada dnia | 2 | 1 z budżetu 4 |
| 2:00–4:00 | chmurka ikon przy postępie | 1 | co 40 s, maks. 3 na etap |
| 4:00 | myśl Wizkora o ciele | 2 | 2 z budżetu; ≥ 45 s od dymka |
| 5:00 | dymek: minigry | 2 | 3 z budżetu |
| 9:00 | druga myśl Wizkora | 2 | 4 z budżetu — **dalej cisza** |
| zachód | kwestia zachodu | 3 | w kolejce, jeśli ekran zajęty |
| noc | podpis narratorki → podsumowanie | 1 → 3 | poziom ≤ 2 milknie po zachodzie |

## 9. Cztery kolizje — i czym je zamyka bramka

| kolizja | dziś | po zmianie |
|---|---|---|
| myśl Wizkora pod minigrą pali limit | `aktywna` nie obejmuje ośmiu stanów | `czyWolno` zna `pelnyEkran`; odmowa nie zwiększa licznika |
| dwie chmurki Wizkora naraz | `spokoj` nie obejmuje `myslWizkora` | slot `chmurka` jest jeden |
| toast odlicza 5 s pod zasłoną | brak bramki, ręczne `setTimeout(900)` | toast czeka w kolejce do 15 s |
| lektor ucina sam siebie | `interrupt: true` wszędzie | kolejka z wagą 1–3 |

## 10. Co ten dokument świadomie zostawia

Trzy implementacje kształtu chmurki (`ChmurkaKsztalt.jsx`, `ksztaltChmurki.js`,
`.chmurka-awatara`), pięć martwych komponentów (`HintPopup`, `WiadomosciPanel`,
`PoradaKarty`, `PytanieSpotkania`, `MessageScroll`) i brak głosu przy zaproszeniu
do minigry. To są osobne zmiany, nie część bramki.

## 11. Pliki

- `frontend/src/hub/bramkaKomunikatow.js` — bramka: poziomy, sloty, rejestr, budżet.
- `frontend/src/hub/mowaPostaci.js` — kolejka głosu z wagą.
- `frontend/src/pages/Swiat.jsx` — jedno miejsce, które melduje stan ekranu.
- `frontend/src/hub/PodpowiedzMedrca.jsx` — pyta bramkę zamiast ufać `aktywna`.
- `frontend/src/hub/coTeraz.js` — próg postępu wewnątrz etapu.
- `docs/design-system/powiadomienia.md` — kształty i role kanałów (nie zmienia się).

## 12. Rejestr zdarzeń — co się odzywa i czy mówi prawdę

Scena zgłasza dwadzieścia pięć zdarzeń (`scena-3d-src/src/index.js`, lista
`ZDARZENIA`). Poniżej każde z nich: co dziś na nie odpowiada, na jakim poziomie
i czy komunikat jest **wyraźny względem tego, co się właśnie stało**.

### Zdarzenia z odpowiedzią

| zdarzenie | co się odzywa | poziom | werdykt |
|---|---|---|---|
| `gotowa` | odtworzenie sceny, śladów, placu | 0 | **zostaje** — wejście do świata nie jest chwilą, w której coś rośnie |
| `wejscie:gotowe` | podpis narratorki + głos → po 4,2 s karta Wizkora; przy śpiącej planecie sam podpis | 1 → 3 | **zostaje** — jedyne miejsce z poprawną kolejnością: najpierw co się zmieniło, potem kto czego chce |
| `doba:sesja` (`zachod`) | kwestia zachodu, w kolejce gdy ekran zajęty | 3 | **zostaje** |
| `doba:sesja` (`noc`) | podpis narratorki + głos, chmurki milkną | 1 | **zostaje** |
| `sesja:zamknieta` | Podsumowanie dnia | 3 | **zostaje** |
| `surowiec:zdobyty` | toast „Drewno gotowe” | 1 | **poprawka** — patrz niżej |
| `surowiec:podniesiony` | licznik HUD „w drodze” | 0 | **zostaje** — stan, nie komunikat |
| `surowiec:dostarczony` | wpis do dziennika + toast „Drewno na placu” + karta Wizkora po 900 ms przy komplecie | 1 → 3 | **poprawka** — ręczne 900 ms zastąpione kolejką toastu (`§6` typ A); zwłokę przed kartą zostawiamy, bo to reżyseria, nie obejście |
| `miejsce:pokazane` | zapis stanu | 0 | **zostaje** |
| `domek:wejscie` | otwarcie wnętrza domku | 3 | **zostaje** |
| `hybryda:obiekt-dotkniety` | lisek przy kamieniu, raz na sesję | 3 | **zostaje** |
| `minigra:start` / `znak:dotkniety` | zależnie od znaku: gwiazdka → iskry i licznik; puzzel → licznik; znak gry → zaproszenie liska; znak panelu → szuflada | 0 / 3 | **poprawka** — gwiazdki nie mają chmurki w środku etapu (naprawione progiem postępu), zaproszenie do gry nie ma głosu |
| `blad` | ekran „scena martwa” | 3 | **zostaje** |

### Zdarzenia bez żadnej odpowiedzi

`bohater:doszedl` · `latarnia:reakcja` · `doba:pora` · `swiatlo:zebrane` ·
`woda:nabrana` · `fasola:podlana` · `fasola:wspinaczka` · `swiat:dalej` ·
`domek:drabinka`

Dziewięć zdarzeń przechodzi przez `Swiat.jsx` i nie uruchamia niczego.
Trzy z nich — `swiatlo:zebrane`, `woda:nabrana`, `fasola:podlana` — to
**zmiany świata po działaniu dziecka**, czyli dokładnie to, co według opisu
projektu ma być nagrodą. Dziś są nieme. `pauza`, `wznowienie` i `zniszczona`
są wewnętrzne i mają takie zostać.

Od 18.09 build developerski wypisuje `[kanaly] zdarzenie bez odpowiedzi: …`
przy każdym takim przejściu — żeby nowy nieobsłużony event był widać w dniu,
w którym powstał.

### Zdarzenie, które nie dochodzi wcale

`app.js` woła `this.emit("kino")`, a `"kino"` nie ma go na liście `ZDARZENIA`
w `index.js` — więc nie dociera do gry w ogóle. To jest do naprawy przy
najbliższym buildzie sceny (`WERSJA_SCENY` +1); nie robimy tego razem z bramką,
bo scena jest w tej chwili w rękach drugiej sesji.

## 13. Komunikaty niewyraźne względem stanu

Trzy teksty mówią co innego, niż wynika ze stanu gry w chwili, gdy padają.

**„Drewno gotowe” po ścięciu drzewa.** Komentarz w kodzie mówi wprost:
„ŚCIĘCIE TO POŁOWA ROBOTY — materiał leży w lesie i sam tam nie pójdzie”.
Toast mówi dokładnie odwrotnie. Dla dziecka „gotowe” znaczy „mam to z głowy”,
a właśnie zaczyna się drugie pół zadania. Propozycja: **„Drewno leży w lesie”**,
z drugim wierszem „Zanieś je pod wielkie drzewo”. Drugi wiersz jest dziś tylko
w `aria-label` i nie widzi go nikt poza czytnikiem ekranu.

**Toast pokazuje jedno zdanie, a niesie dwa.** Pole `opis` we WSZYSTKICH
wywołaniach `pokazKomunikat` idzie wyłącznie do `aria-label`. Dziecko widzi
„Zetnij trzy drzewa”, czytnik ekranu — „Każdy stos znieś pod wielkie drzewo”.
Albo toast dostaje drugi wiersz, albo `opis` przestaje udawać treść.

**„Kamienie gotowe” to gałąź martwa.** `surowiec:zdobyty` odrzuca `glaz`
w pierwszej linii, więc wariant kamienny toastu nie ma jak paść. Do usunięcia
razem z resztą kamienia (decyzja 17.09: etap 1 to trzy stosy drewna, bez
kamienia).
