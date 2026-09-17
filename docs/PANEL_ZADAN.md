# Panel zadań — wspólny brief specjalistów

Ten plik czyta **każdy** agent z panelu (`rodzic-1-3`, `rodzic-4-8`, `pedagog`,
`psycholog`, `socjolog`, `swieze-spojrzenie`, `projektant-zadan`, `copywriter`)
zanim cokolwiek napisze. Tu są formaty i twarde reguły. Agenci trzymają
u siebie tylko to, co widzą z własnej perspektywy.

---

## Co to jest „zadanie" w EwolucJA

Zadanie robi się **poza ekranem**. Ciąg jest taki:

Wizkor zleca → **Koło Przeznaczenia** losuje cechę → do cechy dobierane jest
zadanie → dziecko wybiera **miejsce** → robi je w realnym świecie → dowodem
jest **zdjęcie albo jedno zdanie** → dowód idzie do **Mentora** (dorosły) →
Mentor przyjmuje albo prosi o poprawkę → backend przyznaje monety i cecha
rośnie (`wzmocnijCeche`).

Pięć cech: `ciekawosc`, `tworzenie`, `wspolpraca`, `odwaga`, `wytrwalosc`
(`adventure/engine/adventureState.js` → `TRAIT_LABELS`).

Odbiorca: **dziecko 6–12 lat**. Klasy 1–3 i 4–8 to dwa różne światy — patrz
agenci `rodzic-1-3` i `rodzic-4-8`.

---

## Trzy formaty wyjścia

### 1. Zadanie Wizkora — `frontend/src/hub/data/zadania-wizkora.v1.json`

To jest **główny** format. Po dwa zadania na cechę, żeby powtórzone losowanie
nie dawało od razu tego samego.

| pole | co to jest | limit |
|---|---|---|
| `id` | kebab-case, po polsku, bez ogonków | 2–3 słowa |
| `cecha` | jedna z pięciu, dokładnie te stringi | — |
| `tytul` | nazwa zadania, brzmi jak rola albo tytuł | 1–2 słowa |
| `cel` | co zrobić — **dwie linie rozdzielone `\n`**, druga linia to zwrot akcji | 2 × ~40 znaków |
| `szept` | echo celu, Wizkor mówi to półgłosem | 2–4 słowa |
| `jak` | jedno zdanie, jeden czasownik | 1 zdanie |
| `dowod` | rozkaz przy przycisku zdjęcia, **zawsze dwie drogi**: zdjęcie albo zdanie | 1 zdanie |
| `przyklad` | głosem dziecka, konkret, niedoskonałe | 1–2 zdania |
| `nagroda` | monety; dziś wszystkie mają 25 | int |
| `minuty` | realny czas dziecka, nie życzeniowy | 10–20 |
| `competency_focus` | kody legacy dla raportów Mentora (tablica) | 1–2 kody |
| `miejsca` | 3–4 warianty **tego samego** zadania w różnych kontekstach: `{id, emoji, nazwa, opis}` | `opis` = 1 zdanie |

Kody legacy: `DT` Ciekawość · `EM` Życzliwość · `ST` Mądrość · `KR` Kreatywność
· `LD` Odwaga · `MD` Skupienie. **W tekstach dla dziecka nie istnieją.**

Teksty krótkie: panel ma się zmieścić bez przewijania ściany tekstu. Jedno
zdanie na pole.

### 2. Baza Mentora — `frontend/src/data/mentorTaskLibrary.js` (+ `.additions.js`)

Stary format generatora, profile `DT/EM/ST/KR/LD/MD`:

```
{ id: "DT-TASK-011", profile: "DT", kind: "task", title, body,
  points_reward: 25, competency_focus: ["DT","KR"], proof_hint, tags: [] }
```

`kind`: `task` (do zrobienia) · `hint` (zdanie motywujące, `points_reward: 0`)
· `artifact` (opis magicznego przedmiotu, `points_reward: 5`). `id` idzie
dalej od ostatniego w danym profilu — sprawdź, zanim nadasz.

### 3. Porada dnia — `frontend/src/hub/poradaDnia.js` → `KARTY_DNIA`

Mikroaktywność na dziś, mówi ją **lisek**, nie Wizkor. Pola: `id`, `tytul`,
`opis` (podpis na kafelku), `akcja`, `ilustracja`, `zapowiedz` (to, co lisek
mówi po wybraniu karty), `odzew` (po zrobieniu). Wybór jest deterministyczny
w obrębie doby — to tablica korkowa, nie losowanie nagrody.

**`zapowiedz` i `odzew` czyta TTS**: bez cyfr i skrótów. „Pięć wolnych
oddechów", nie „5 oddechów".

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
- Dowód nie jest sprawdzianem. Ma być łatwy do dostarczenia i trudny do
  oblania.
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
