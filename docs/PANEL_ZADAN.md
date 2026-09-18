# Panel zadań — wspólny brief specjalistów

Ten plik czyta **każdy** agent z panelu (`rodzic-1-3`, `rodzic-4-8`, `pedagog`,
`psycholog`, `socjolog`, `swieze-spojrzenie`, `projektant-zadan`, `copywriter`)
zanim cokolwiek napisze. Tu są formaty i twarde reguły. Agenci trzymają
u siebie tylko to, co widzą z własnej perspektywy.

---

## Co to jest „zadanie" w EwolucJA

Zadanie robi się **poza ekranem**. Pętla od 17.09 (decyzja autora; szczegóły
`docs/tresci/03_ZADANIA_W_REALU.md`, `06_DECYZJE_I_ZALEZNOSCI.md` §4.7):

Wizkor daje trop → pierwsze trzy zadania z **kolejki profilu** (`pierwszeZadania`
w `hub/zadanieWizkora.js`: para `profil_pierwszy` + oś o najniższym liczniku),
potem **Koło Przeznaczenia** losuje cechę z kolejki bez powtórek → dziecko wybiera
**miejsce** → robi je w realnym świecie → zostawia **ślad** (wybór z trzech
kartek albo jedno zdanie ≤ 160 zn.; zdjęcie za flagą, do czasu toru obrazu) →
**świat reaguje od razu** (`reakcja_swiata`: kwiat, kamyczki, ukryta bryła) →
**Mentor zauważa** (jeden przycisk „Zauważam", gotowa formuła bez oceny, pytanie
do rozmowy z pola `rozmowa`) → **świat dokłada** mały dodatek (kwiat w nowym
kolorze przy drabince; światło tylko w hybrydzie MD).

Mentor **nie zatwierdza, nie odrzuca, nie daje punktów**. Monety (25 za ślad,
0 za zauważenie) są cichym licznikiem w HUD i nie padają w żadnym tekście.
Nagrodą jest zmiana świata.

Pięć cech: `ciekawosc`, `tworzenie`, `wspolpraca`, `odwaga`, `wytrwalosc`
(`adventure/engine/adventureState.js` → `TRAIT_LABELS`). Sześć profili z testu
mapuje się na osie wg `06` §2 — profil to **kolejność**, nie zbiór.

Odbiorca: **dziecko 6–12 lat**. Klasy 1–3 i 4–8 to dwa różne światy — pole
`etap` + `warianty["1-3"|"4-8"]`; dla 1–3 karta pokazuje `cel` + `przyklad`,
`jak` czyta lektor.

---

## Trzy formaty wyjścia

### 1. Zadanie Wizkora — `frontend/src/hub/data/zadania-wizkora.v2.json`

To jest **główny** format (v2 od 18.09; v1 zostaje tylko jako archiwum).
52 zadania aktywne + zastąpione (stare `id` z polem `zastapione_przez` —
`historiaZadan()` w zapisach graczy nie może zmienić znaczenia).

| pole | co to jest | limit |
|---|---|---|
| `id` | kebab-case, po polsku, bez ogonków; nowe `id` przy przepisaniu | 2–3 słowa |
| `cecha` | jedna z pięciu | — |
| `tytul` | rola albo tytuł, bez nazwy profilu | 1–2 słowa |
| `cel` | **dwie linie** przez `\n`, druga = zwrot akcji; bez cyfr (TTS) | 2 × ≤ 60 zn. |
| `szept` | echo drugiej linii | 2–4 słowa |
| `jak` | jedno zdanie, jeden czasownik; bez cyfr (TTS) | ≤ 140 zn. |
| `dowod` | nagłówek drugiego kroku, **zawsze dwie drogi**, nigdy „jak się czułeś" | 1 zdanie |
| `przyklad` | głosem dziecka, niedoskonałe, tokeny `{m|ż}` | 1–2 zdania |
| `minimum` | wersja na gorszy dzień, „i tak się liczy" | 1 zdanie |
| `potrzeba` | `autonomia \| kompetencja \| relacja \| regulacja \| ruch \| uwaznosc \| sprawczosc \| troska` | — |
| `ksztalt` / `tryb_startu` / `profil_pierwszy` / `rodzina` | dla projektantów i kolejki (`03` §4, §6) | — |
| `etap` + `warianty` | `oba \| 1-3 \| 4-8`; wariant nadpisuje `cel/jak/przyklad/dowod/miejsca{id→opis}` | — |
| `rozmowa` | jedno pytanie dla Mentora; nie zakłada wyniku | 1 zdanie |
| `slad` | `opcje[3]`, `obrazki[3]`, `zdanie`, `zdjecie`, `podpowiedz` | opcje ≤ 40 zn. |
| `reakcja_swiata` | `{metoda, args, opis, toast{tytul ≤ 28, opis}, istnieje}` — metoda sceny | — |
| `miejsce_reakcji` | pod drzewem · obok karty · przy choince · na pieńku · przy drabince · przy ścieżce | — |
| `reakcja_mentor` | dodatek po zauważeniu (kwiat w nowym kolorze przy drabince) | — |
| `karta_wizkora` | zlecenie na kartę, bez „musi", bez cyfr | ≤ 60 zn. |
| `mentor_powiadomienie` | „Zobacz, co {zrobił\|zrobiła} {imie}: …" | 1 zdanie |
| `kwestie[]` | `glos`, `moment`, `wariant`, `tekst`, `tekstEkranu` | — |
| `nagroda` | cichy licznik (25); **nie pada w tekstach** | int |
| `minuty` | realny czas dziecka | 10–20 |
| `competency_focus` | kody legacy dla raportów Mentora | 1–2 kody |
| `miejsca` | 3–4 warianty **tego samego** zadania; min. jedno w bloku bez ogrodu, zwierzaka, pieniędzy; klatka/korytarz dla 1–3 „gdy dorosły jest obok" | `opis` = 1 zdanie |
| `zrodlo` | `biblioteka:<id>` dla zadań przeniesionych z bazy Mentora | — |

Walidator: `tmp/tresci-skrypty/nowe-zadania-B.py --v2` (cyfry w TTS, tokeny,
dwie drogi, etykiety, limity, `slad`, `warianty`). Hybrydy (`docs/tresci/05`)
używają tego samego schematu plus `czescA`, `most`, `reakcja`, `reakcjaMentor`.

### 2. Baza Mentora — `frontend/src/data/mentorTaskLibrary.js` (+ `.additions.js`)

Format generatora i **propozycji dla dorosłego** w panelu Mentora:

```
{ id: "DT-TASK-011", profile: "DT", kind: "task", title, body,
  points_reward: 25, competency_focus: ["DT","KR"], proof_hint, tags: [],
  zmigrowane: true | wycofane: true, powod }
```

Po migracji 18.09 (`tmp/tresci-skrypty/migruj-biblioteke.py`, `03` §3, §14):
47 wpisów `wycofane` (zostają dla historii), 229 `zmigrowane` (tokeny, dwie
drogi dowodu, bez etykiet profilu i cyfr). Dziecku trafia wyłącznie
`MENTOR_TASKS_DLA_DZIECKA`; 30 najlepszych żyje już w v2 (`zrodlo`). Nowe
zadania pisz **od razu w v2**, nie tutaj.

### 3. Porada dnia — `frontend/src/dailyTipsData.js` (format `docs/tresci/04` §4.1)

Mikroaktywność z liskiem, nie zadanie: lisek **zaprasza** (`zapowiedz`, ≤ 120 zn.
w dwóch zdaniach), dziecko robi `krok` (jeden czasownik, widoczny koniec), jest
`minimum`, po zrobieniu `odzew` (zauważa czynność, nie chwali cechy, nie
obiecuje efektu) i delikatny ślad w scenie do końca doby. Pola `etap`, `rodzaj`,
`wejscie` (mechanizm profilu), `silnik`, `slad`. Lisek nikogo nie cytuje;
porada nie podlewa Fasoli i nie daje monet.

---

## Twarde reguły — łamie je jedno, zadanie wypada

**Bezpieczeństwo**

- Nic, co wysyła dziecko samo poza dom, do obcych ludzi, nad wodę, na
  wysokość, do ruchu ulicznego.
- Nóż, ogień, kuchenka, wiertarka, chemia — **tylko z dorosłym i to
  wprost napisane w zadaniu**, a dorosły trzyma narzędzie.
- Zero zadań wymagających pieniędzy, zakupu, druku, wysyłki.
- Zdjęcie: nie pokazuje twarzy innych osób bez ich zgody, nie pokazuje
  adresu, numeru domu, nazwy szkoły, wnętrza cudzego pokoju.
- Zero zadań, które stawiają dziecko w konflikcie z opiekunem albo każą mu
  oceniać dorosłego.

**Wykonalność**

- Da się zrobić **dzisiaj**, bez przygotowania, bez kupowania, w jednym
  podejściu, w podanych minutach.
- Nie zakłada: ogrodu, zwierzaka, rodzeństwa, własnego pokoju, samochodu,
  telefonu dziecka, dwojga rodziców, spokojnego wieczoru ani wyjazdu.
- Wymaga tylko rzeczy, które są w każdym domu.

**Godność**

- Bez zawstydzania, porównywania, odliczania, serii, „nie przegap",
  „zostało ci". Bez kar za niezrobienie.
- Ślad nie jest sprawdzianem: zadania **nie da się oblać** — jest zrobione
  albo czeka; brak śladu nic nie kosztuje. Mentor zauważa, nie ocenia:
  w tekstach nie ma „zatwierdź", „poprawka", „sprawdzane", „przyjął".
- Nagrodą jest zmiana świata (`reakcja_swiata`); monety nie padają w tekstach.
- Tekst mówiony bez cyfr; czasowniki o dziecku w tokenach `{m|ż}`
  (`odmienDlaGracza`). Standard: `docs/tresci/01_STANDARD_GLOSOW.md`.
- Zadanie o uczuciach nie wymusza zwierzenia. Zawsze jest wersja, którą da
  się zrobić, nie mówiąc nic o sobie.
- Nie obiecujemy tego, czego nie widać na ekranie (`docs/KONCEPT_GRY.md`).

---

## Kto czego pilnuje

| agent | jedno pytanie, które zadaje |
|---|---|
| `rodzic-1-3` | kto to **naprawdę** zrobi w środę o dwudziestej? |
| `rodzic-4-8` | czy dwunastolatek zrobi to, gdy siostra patrzy? |
| `pedagog` | czy dziecko w tym wieku w ogóle to potrafi? |
| `psycholog` | czy to buduje sprawczość, czy kolejny obowiązek? |
| `socjolog` | kogo to zadanie po cichu wyklucza? |
| `swieze-spojrzenie` | dlaczego znowu „zbierz pięć rzeczy"? |
| `projektant-zadan` | gdzie tu jest zwrot akcji i czy pętla się domyka? |
| `copywriter` | czy to brzmi jak zaproszenie w dwóch linijkach? |

**Głos świata należy do `narrator-gama`.** Panel dostarcza substancję;
ostatnie przejście po tekście — ton, rodzaj żeński narratorki, rozdział ról
Wizkor / lisek / narratorka — robi `narrator-gama`.
