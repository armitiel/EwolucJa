# Świat Ewolucji — kanon nazw, miejsc i postaci

> Jedno źródło prawdy o tym, jak nazywa się świat, kto w nim występuje i których
> nazw już nie używamy. Ustalone przez autora 17.09.2026. Historie świata
> układamy później — ten plik porządkuje nazwy, nie fabułę.
>
> Każdy tekst dla dziecka, dokument i prompt ma być z tym zgodny. Przy konflikcie
> z innym dokumentem wygrywa ten plik, a nad nim tylko opis nadrzędny projektu.

## Nazwy

| co | nazwa | uwagi |
|---|---|---|
| gra | **EwolucJA** | pisownia z wielkim „JA” |
| świat | **Świat Ewolucji** | jedyna nazwa świata na ekranie i w promptach |
| to, co dziecko widzi | mała planeta w Świecie Ewolucji | „planeta” wolno używać opisowo |
| kolejne światy | W3, W4, W5, W6 | nazwy robocze bez nazw własnych; historie później |

## Miejsca (stan dzisiejszy)

Bazą jest **planeta z liskiem** (tor `/swiat`).

| miejsce | co to jest |
|---|---|
| polana | teren startowy, gwiazdki i puzzle |
| wielkie drzewo | miejsce, na którym powstaje domek |
| **plac budowy** | stan PRZED budową: wydeptana ziemia, obrys, paliki; tu lisek znosi materiał |
| **domek na drzewie** | to, czym plac budowy się staje; etapy: 1 platforma z barierką i drabinką, 2 przytulny domek, 3 rozbudowany domek |
| drzewa i głaz | materiał na domek — **decyzja autora 17.09: ścinać można każde drzewo; etap 1 = trzy ścięte drzewa = trzy stosy drewna pod wielkim drzewem, bez kamienia; suche drzewko zdjęte z mapy; kamień wraca przy etapie 2** (drzewo → stos i pieniek, głaz → kamyczki) |
| **choinka** | start minigry Lot Liska |
| oczko wodne | woda dla Magicznej Fasoli |
| **Magiczna Fasola** | będzie używana na planecie; rośnie po działaniu w prawdziwym świecie |

W przyszłości będą **różne budowle**. Dziś jest jedna: domek na drzewie.
Klucz `schronienie` w kodzie, mapie i zapisie to tylko adres techniczny — w tekstach
zawsze „plac budowy” (przed) albo „domek na drzewie” (po).

## Kanał ślad → scena (18.09)

Po śladzie zadania w realu świat reaguje od razu: kwiat przy jednej z kotwic
(pod drzewem, obok karty Gry na Pamięć, przy choince, na pieńku, przy drabince,
przy ścieżce), kamyczki przy ścieżce, ukryte bryły `most`/`brama`/`latarnia`
pokazują się (`pokazUkryty`). Po zauważeniu przez Mentora — kwiat w nowym
kolorze przy drabince; światło tylko w hybrydzie MD. Lisek robi w scenie to samo,
co dziecko w poradzie (ślad porady do końca doby) i daje chmurkę zaproszenia
przy obiekcie części A hybrydy. Szczegóły: `docs/tresci/03` §7, `05`, `06` §4.3.

## Postacie i głosy

Trzy głosy. Nie ma czwartego.

| postać | kim jest | głos lektora (klucz techniczny) |
|---|---|---|
| **Wizkor** | czarodziej, pierwszy przewodnik; wie, że pewnych rzeczy nie da się zrobić magią. **Dawny „Mędrzec” to Wizkor** — rzadkie, spokojne myśli o ciele mówi Wizkor, tym samym głosem | `las_decyzji` |
| **Lisek** | **postać bazowa** — jedyna postać gracza i towarzysz naraz: dziecko nim steruje, a lisek zaprasza do wspólnej aktywności; awatar w HUD-zie to `fox_avatar.png` | `lisek` |
| **Narratorka** | bezimienny głos Świata Ewolucji; opowiada, nie zleca | `gora_podsumowania` |

Podział ról: narratorka opowiada, Wizkor zleca i daje trop, lisek zaprasza.

**Mentor nie jest postacią w świecie.** To rola dorosłego — technicznie rodzic
albo nauczyciel. Mentor zauważa działanie dziecka; nie ocenia i nie zalicza.

## Profile z testu startowego

| kod | cecha | nazwa (m / ż) | zwierzę |
|---|---|---|---|
| DT | Ciekawość | Odkrywca / Odkrywczyni | lis |
| EM | Życzliwość | Przyjaciel / Przyjaciółka | żółw |
| ST | Mądrość | Myśliciel / Myślicielka | sowa |
| KR | Kreatywność | Wynalazca / Wynalazczyni | panda |
| LD | Odwaga | Śmiałek / Śmiałka | lew |
| MD | **Skupienie** | Spokojna Głowa | ośmiornica |

Spokojna Głowa to **skupienie i spokój**, nie „mediacja” ani „godzenie innych”.
Sowa jest zwierzęciem profilu Myśliciel — i niczym więcej.

## Minigry

| id techniczne | nazwa na ekranie |
|---|---|
| `pamiec-medrca` | **Gra na Pamięć** (na mapie skrót w postaci karty 3D) |
| `lot-liska` | Lot Liska (start z choinki) |
| `bieg-liska` | Bieg Liska |

## Styl grafiki

Świat to niska poligonowo planeta. Postacie to renderowane kreskówkowe ilustracje z grubym obrysem, ikony HUD to błyszczące ikony ze złotymi ramami. **Claymorphism jest jednym z dostępnych stylów** (drobne przedmioty, ikony miejsc w świecie). Opis wszystkich rodzin: `docs/design-system/styl-ilustracji-i-ikon.md`.

## Nazwy techniczne, które zostają bez zmian

Zmiana tych kluczy zepsułaby zapisy graczy, nagrania lektora albo bazę:
`pamiec-medrca`, `schronienie`, klucze głosów `las_decyzji` / `gora_podsumowania` /
`lisek` / `mentor` (ten ostatni tylko po stronie dorosłego), kategoria porad `medrzec`,
klasy CSS i tokeny `medrzec-*`, slugi starych archetypów w bazie
(`tropiciel_tajemnic`, `zaklinacz_uczuc`, `mistrz_map`, `tkacz_snow`,
`gwardzista_odwagi`, `straznik_mostu`), nazwa agenta `narrator-gama`.

## Wycofane — nie używać w tekstach, dokumentach ani promptach

- **Zakątek Gamma, Świat Gama, „Kronika Gammy”, GAMA-1** (narratorka jest bezimienna)
- **Mędrzec jako osobna postać**, „Mędrzec mówi/szepcze”, Komnata Mędrca, karty i zwój Mędrca, poziom „Mędrczyni”
- **Świecące Piórko** (nagroda)
- **Marcowe krainy:** Dolina Selfie, Las Decyzji, Jaskinia Emocji, Wyspa Talentów, Przystań Współpracy, Góra Podsumowania (żyją tylko jako klucze techniczne)
- **Krainy Zakątka:** Las Pytań, Morze Słów, Góry Liczb, Zamek Czasu, Pustynia Pomysłów, Niebo Marzeń; także Dolina Dźwięków, Las Szeptów, Pracownia Gwiazd
- „kraina” jako nazwa świata albo regionu
- **Mentor jako Sowa** i „Game Master” jako postać
- „schronienie” jako nazwa budowli
- postać chłopca (`adventurer`) i jej awatar (portret chłopca w medalionie) — wyłączone, bohaterem jest lisek
- stare nazwy archetypów (Tropiciel Tajemnic, Zaklinacz Uczuć, Mistrz Map, Tkacz Snów, Gwardzista Odwagi, Strażnik Mostu/Ciszy) i „Tropiciele” jako nazwa grupy dzieci
- Spokojna Głowa jako „mediator”
- cykl tygodniowy z piątkowym terminem, punkty, poziomy, losowe mikronagrody
