# Porady dnia — plan przebudowy

Stan na dziś: karteczka z jedną radą, dwa wyjścia (kciuk / krzyżyk), pod spodem
półki z poradami na aktualną porę dnia, zegar i losowany kącik dobrostanu.

Ten dokument opisuje, dlaczego to za mało i co konkretnie zmieniamy.

---

## 1. Co jest nie tak

Trzy rzeczy, każda osobno drobna, razem tłumaczą, dlaczego dziecko nie ma po co
tu wracać.

**To jest rada.** Rada to głos dorosłego — dziecko zna ten ton z domu i ze
szkoły. „Wypij szklankę wody" nie jest zaproszeniem, tylko poleceniem, i nawet
najładniejsza karteczka tego nie zmienia.

**Wykonanie dzieje się gdzie indziej.** Panel mówi, co zrobić poza aplikacją, a
potem prosi o samoocenę. Dziecko klika kciuk szybciej, niż zdąży wstać.

**Nic nie wraca.** Po kliknięciu karteczka znika i to cała odpowiedź świata.
Żadna postać niczego nie zauważyła, nic się nigdzie nie zmieniło.

---

## 2. Zasada

Cztery kroki, w tej kolejności:

**wybór → zrobienie tutaj → odzew → ślad**

1. **Wybór zamiast polecenia.** Trzy karty, dziecko bierze jedną na dziś.
   „Wypij wodę" jest cudze, „wybrałem tę" jest moje. Najtańsza zmiana w całym
   planie i największa różnica w tym wieku.
2. **Zrobienie na miejscu.** Większość kart daje się wykonać w aplikacji w
   20–60 sekund: oddech, rozciąganie z odliczaniem, „znajdź pięć zielonych
   rzeczy za oknem", minuta ciszy. To jest ta część, którą dziecko lubi —
   widzieliśmy to po kąciku z oddechem.
3. **Odzew.** Po wykonaniu odzywa się postać ze świata — jedno zdanie, w tym
   samym pop-upie co zaproszenia. Nie punkt, nie procent: „zauważył".
4. **Ślad, który rośnie.** Drzewo tygodnia dostaje liść. Bez liczb, bez serii,
   bez procentów.

### Czego świadomie nie robimy

- **Serii dni.** Pierwszy przerwany dzień zamienia panel w miejsce, do którego
  się nie wraca. Dziecko nie ma tu długu do spłacenia.
- **Monet za porady.** Gra nie widzi, czy woda została wypita. Nagroda za
  niesprawdzalne kliknięcie uczy klikania, a porady stają się farmieniem.
- **Liczników i procentów.** „3/5 na dziś" robi z dbania o siebie zadanie
  domowe.

---

## 3. Model danych (`porady.v2.json`)

Dzisiejszy wpis ma cztery pola: `id`, `pora`, `typ`, `tekst`. Nowy rozróżnia
przede wszystkim **gdzie karta się wykonuje** — to jest oś całej zmiany.

```json
{
  "id": "p-oddech-wieczor",
  "pora": "wieczor",
  "typ": "glowa",
  "gdzie": "apka",
  "tekst": "Pooddychaj ze mną",
  "akcja": { "rodzaj": "oddech", "sekundy": 40 },
  "odzew": { "kto": "wizkor", "tekst": "Widziałem, jak zwolniłeś. Dobrze." }
}
```

```json
{
  "id": "p-woda-rano",
  "pora": "rano",
  "typ": "cialo",
  "gdzie": "swiat",
  "tekst": "Wypij szklankę wody",
  "odzew": { "kto": "lis", "tekst": "Woda rano to najlepszy start. Wiem coś o tym." }
}
```

| pole | znaczenie |
|---|---|
| `pora` | `rano` / `poludnie` / `popoludnie` / `wieczor` / `noc` — bez zmian |
| `typ` | `cialo` / `glowa` — nazwy z ekranu, nie „zdrowie/samopoczucie" |
| `gdzie` | `apka` = wykonywalna tutaj, `swiat` = przypomnienie do zrobienia poza grą |
| `akcja` | tylko dla `gdzie: "apka"`; `rodzaj` wybiera silnik wykonania |
| `odzew` | jedno zdanie od konkretnej postaci, po wykonaniu |

### Rodzaje akcji (silniki wykonania)

Pięć, celowo mało — każdy jeden komponent, każdy działa dla wielu kart.

| rodzaj | co robi | parametry |
|---|---|---|
| `oddech` | koło rosnące i malejące, tempo za porą dnia | `sekundy` |
| `odliczanie` | jedno ćwiczenie ruchowe i licznik | `sekundy`, `ruch` |
| `szukanie` | „znajdź pięć rzeczy w kolorze…", stukasz pięć kropek | `ile`, `czego` |
| `cisza` | odliczanie bez animacji, ekran gaśnie do ciemniejszego | `sekundy` |
| `napiecie` | napnij–puść, prowadzone kolejnymi partiami ciała | `sekundy` |

Karty `gdzie: "swiat"` nie mają akcji — mają tylko „zrobione" i odzew. Powinny
być **mniejszością puli** (docelowo ok. jednej trzeciej), bo to one najbardziej
przypominają rodzicielskie przypomnienie.

### Ile kart na porę

Minimum **6 na porę** (żeby losowanie trzech nie powtarzało się co drugi dzień),
w tym co najmniej 4 typu `apka`. Dziś noc ma 4 karty łącznie — do uzupełnienia.

---

## 4. Przepływ

```
┌─ wejście do panelu ──────────────────────────────────────────┐
│  karta dnia jeszcze niewybrana                               │
│                                                              │
│   [ karta 1 ]   [ karta 2 ]   [ karta 3 ]     ← trzy do wyboru
│                                                              │
│  dotknięcie karty → karta zostaje, dwie odjeżdżają           │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌─ wybrana karta ──────────────────────────────────────────────┐
│  gdzie: "apka"   → duży przycisk „Zrób to ze mną"            │
│                    → ekran wykonania (silnik akcji)          │
│  gdzie: "swiat"  → przycisk „Zrobione" + „Później"           │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌─ odzew ──────────────────────────────────────────────────────┐
│  pop-up postaci, jedno zdanie z pola `odzew`                 │
│  pod spodem: liść ląduje na drzewie tygodnia (animacja)      │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌─ panel po wykonaniu ─────────────────────────────────────────┐
│  zegar + kącik dobrostanu (jak dziś)                         │
│  drzewo tygodnia                                             │
│  półki „Ciało" / „Głowa" na aktualną porę                    │
└──────────────────────────────────────────────────────────────┘
```

Trzy karty losujemy **deterministycznie z dnia** (jak dziś jedną), więc
odświeżenie ekranu nie jest automatem do losowania. Wybór zapisuje się w
`localStorage` i trzyma do północy.

„Później" nie jest porażką: karta wraca do trójki przy następnym wejściu tego
samego dnia. Dopiero wykonanie ją domyka.

---

## 5. Pliki

| plik | co się dzieje |
|---|---|
| `hub/data/porady.v2.json` | nowy zestaw kart (schemat wyżej) |
| `hub/poradaDnia.js` | `trzyKarty(data)`, `wybierzKarte(id)`, `wykonaj(id)`; stary `poradaDnia()` znika |
| `hub/panels/PoradaPanel.jsx` | trzy stany panelu: wybór → wykonanie → po wykonaniu |
| `hub/WyborKart.jsx` | **nowy** — trzy karty i animacja wyboru |
| `hub/akcje/Oddech.jsx` | wyjęty z `KacikDobrostanu`, używany w dwóch miejscach |
| `hub/akcje/Odliczanie.jsx` | **nowy** — ruch z licznikiem |
| `hub/akcje/Szukanie.jsx` | **nowy** — pięć kropek do stuknięcia |
| `hub/akcje/Cisza.jsx` | **nowy** — odliczanie z wygaszeniem |
| `hub/DrzewoTygodnia.jsx` | **nowy** — siedem miejsc na liście, bez liczb |
| `hub/KacikDobrostanu.jsx` | zostaje, ale korzysta z tych samych silników |
| `hub/styles/hub.css` | style trzech kart, ekranu wykonania, drzewa |

Odzew idzie przez istniejący `PopupPostaci` — ma już wariant `lis` i `wizkor`,
nic nowego rysować nie trzeba.

---

## 6. Etapy

Każdy etap jest osobno wdrażalny i osobno testowalny na dziecku.

**E1 — wybór z trzech kart** (bez nowych silników)
Trzy karty, wybór, dotychczasowe „zrobione". Odpowiada na pytanie, czy sam
wybór zmienia zachowanie. *Gotowe, gdy:* dziecko wybiera kartę zamiast ją
przyjmować, a panel pamięta wybór do północy.

**E2 — wykonanie w aplikacji**
Silniki `oddech` i `odliczanie` (dwa najprostsze), część kart oznaczona
`gdzie: "apka"`. *Gotowe, gdy:* karta z akcją da się przejść od początku do
końca bez wychodzenia z panelu.

**E3 — odzew postaci**
Pole `odzew`, pop-up po wykonaniu. *Gotowe, gdy:* każda karta ma zdanie od
konkretnej postaci, a pop-up nie pojawia się przy „Później".

**E4 — drzewo tygodnia**
Siedem miejsc, liść za wykonaną kartę, reset w poniedziałek bez żadnego
komunikatu o porażce. *Gotowe, gdy:* pusty tydzień wygląda spokojnie, a nie jak
wyrzut.

**E5 — uzupełnienie puli**
Do 6+ kart na porę, w tym 4 wykonywalne w aplikacji. Nocna pula najpierw.

---

## 7. Teksty

Karty mówią do dziecka, nie o dziecku. Czasownik na początku, jedno zdanie,
bez „pamiętaj, żeby".

| źle | dobrze |
|---|---|
| „Pamiętaj o nawodnieniu organizmu" | „Wypij szklankę wody" |
| „Warto zrobić przerwę od ekranu" | „Odłóż ekran i popatrz w okno" |
| „Spróbuj się zrelaksować" | „Pooddychaj ze mną" |

Odzewy są krótkie i konkretne, bez chwalenia charakteru („jesteś super"),
za to z zauważeniem czynności („widziałem, jak zwolniłeś"). To różnica między
oceną a uwagą — pierwsza uzależnia od pochwały, druga wzmacnia samo działanie.

---

## 8. Kotwica psychologiczna

Z `psychologia_baza.md`, żeby ten panel nie był oderwaną wyspą:

- **Samoregulacja (CASEL 2)** — oddech, cisza, napięcie–rozluźnienie to
  klasyczne techniki regulacji pobudzenia, tu podane bez nazywania ich terapią.
- **Samoświadomość (CASEL 1)** — wybór jednej z trzech kart wymaga sprawdzenia,
  czego mi teraz trzeba: ruchu czy spokoju.
- **Odpowiedzialne decyzje (CASEL 5)** — codzienny, mały, bezpieczny wybór bez
  konsekwencji, na którym można ćwiczyć wybieranie.

---

## 9. Ryzyka

**Klikanie „zrobione" bez robienia.** Nie da się temu zapobiec i nie warto
próbować. Odpowiedź jest inna: im więcej kart wykonuje się w aplikacji, tym
mniej jest czego udawać — a karty ze świata zostają przypomnieniem, nie testem.

**Wybór jako paraliż.** Trzy to maksimum. Przy pięciu dziecko czyta wszystkie,
przy trzech wybiera.

**Odzew, który się nudzi.** Jedno zdanie na kartę wystarczy, dopóki kart jest
30+. Przy mniejszej puli te same zdania wrócą w tym samym tygodniu.

**Drzewo jako ukryty licznik.** Jeśli puste miejsca będą wyglądać na braki,
wrócimy do tego, czego unikamy. Puste miejsce ma być ledwo widoczne — liść
dodaje, brak liścia nie odejmuje.
