# Plan scalenia: elementy W1 na planetę W2, całość pod `/swiat`

Zapisane 2026-09-14. Plan roboczy — **przed wykonaniem wymaga akceptacji autora**
(otwarta decyzja w § 3 i pytania w § 9).

Dokumenty nadrzędne: `docs/OPIS_PROJEKTU.md` (sens), `docs/WERSJA_AKTUALNA.md`
(tor główny), `AGENT_DEPLOY_INSTRUCTIONS.md` (deploy), `CLAUDE.md` (role agentów,
strażnik sceny).

---

## 1. Co ma powstać — zamówienie w jednym zdaniu

Jeden świat pod adresem **`/swiat`**: **planeta z ostatniej wersji (W2)** jako
scena, a na niej **elementy W1** — minigry w popupach, gwiazdki, okna postaci
i zwoje, Koło Fortuny, Puzzle, Reflektor, Domek — w tych samych stylach
graficznych, co świat ze wskazanego deployu.

Ustalenia z rozmowy (2026-09-14):

| pytanie | odpowiedź |
|---|---|
| co przenosimy | minigry (panel + splash/tutorial/poziomy), gwiazdki na mapie, popupy i szuflady (Wizkor, zwój, podpowiedzi), Koło / Puzzle / Reflektor / Domek |
| jak otwierają się gry | **popup nad sceną**, planeta zostaje pod spodem |
| wzorzec stylu | wygląd ze starego deployu `e1ebk0ouk` — z warunkiem sprawdzenia, że to te same style |
| adres docelowy | **scalony świat stoi pod `/swiat`** |

---

## 2. Stan wyjściowy — fakty z repo (sprawdzone, nie z pamięci)

**Wspólny silnik.** Obie wersje jadą na tym samym module `public/scena-3d/`
(`WERSJA_SCENY = "75"`, źródła w `frontend/scena-3d-src/`). Różni je **plik
mapy** podawany propem: `<Scena3D mapa="…" />`.

| | W1 — `/swiat` | W2 — `/w2` |
|---|---|---|
| skorupa | `pages/Swiat.jsx` — **2497 linii** | `wariant/Wariant.jsx` — **352 linie** |
| zaplecze | `hub/` — ~5 600 linii komponentów | `wariant/tresci.js`, `stan.js`, `w2.css` |
| mapa | `mapa.json`, kula domyślna (R ≈ 12,5), `promien: 14` | `mapa-w2.json`, **`promienKuli: 8,5`**, doba (`cyklDnia`), `zoom: 1,15` |
| znaki na mapie | **24** | **0** (`"znaki": []`, plus 3 świetliki w `znakiWylaczone`) |
| konto gracza | pełne `AppData` + `api.getPlayer` | **celowo odcięte** (`AppData.jsx`: `if (pathname.startsWith('/w2')) return;`) |
| pętla | gwiazdki → puzzle → minigry → Koło → zadanie | trop → aktywność → odłożenie ekranu → ślad → Mentor |
| limit sesji | brak | **jest** (8 min, `wariant/stan.js`) |
| dok | 4 ikony | 1 ikona („Porada"), dolny HUD za `POKAZ_DOLNY_HUD = false` |

**Znaki W1 do przeniesienia** (`mapa.json`, pozycje `[x, z]`):

`czarodziej` · `karty` (Pamięć Mędrca) · `gwiazda-1…10` · `drzewo-lotu`
(Lot Liska) · `bucik` (Bieg Liska) · `puzel-1…9` · `drzwi-domu` (Dom).

**Komponenty W1 do przeniesienia** (linie):
`MinigryPanel` 125 · `SplashGry` 45 · `TutorialGry` 121 · `WyborPoziomu` 46 ·
`PopupPostaci` 221 · `MessageScroll` 274 · `PodpowiedzMedrca` 224 ·
`ZadaniePanel` 403 · `KoloFortuny` 270 · `PuzzleBrama` 445 · `Reflektor` 397 ·
`WnetrzeDomku` (`pages/`) · `CzatPanel` 393 · `WiadomosciPanel` 161.

---

## 3. Sprawdzenie stylów — **zrobione, wynik: to te same pliki**

Pobrane z deployu `ewolucja-e1ebk0ouk` i porównane skrótem SHA-256 z repo
(lokalne pliki mają CRLF, deploy LF — porównanie po normalizacji):

| plik | deploy | repo | wynik |
|---|---|---|---|
| `/tokeny.css` | 17 794 B | 17 794 B | **identyczny** (`f6de09db…`) |
| `/scena-3d/hud.css` | 59 966 B | 59 966 B (po LF) | **identyczny** (`fee0a703…`) |
| `/scena-3d/mapa.json` | 26 064 B | 26 064 B | **identyczny** (`eaf78a04…`) |
| `/scena-3d/mapa-w2.json` | 23 032 B | 18 538 B | **różny** — deploy ma starszą wersję planety |
| `/scena-3d/scena3d.esm.js` | 658 540 B | 759 197 B | **różny** — deploy ma starszy bundle sceny |

**Wniosek.** „Style graficzne" ze wskazanego deployu to dokładnie
`tokeny.css` + `hud.css`, które leżą dziś w repo — nie ma czego odtwarzać
i nie ma ryzyka, że przenosząc kod stracimy tamten wygląd. W2 **już linkuje
ten sam arkusz** (`Wariant.jsx`, blok `.game-hud`), więc jedno źródło wyglądu
jest utrzymane. Różni się tylko **scena 3D i mapa W2** — i to na korzyść
wersji lokalnej, która jest nowsza.

Do zrobienia mimo to (§ 4, etap 0): zrzuty ekranu stary deploy vs lokalne
`/swiat` i `/w2` obok siebie — na wypadek różnic, których nie widać w CSS
(np. inne pliki graficzne w `public/`).

---

## 4. Kluczowa decyzja: która skorupa zostaje

Adres docelowy to `/swiat`, ale to nie rozstrzyga, **który plik React** jest
podstawą. Dwie drogi:

### Wariant B — rekomendowany: zostaje `pages/Swiat.jsx`, podmieniamy planetę

`Swiat.jsx` już ma wszystko, co ma zostać przeniesione: minigry, popupy,
panele, dok, monety, nagrody, konto. Zmienia się **jedna rzecz w scenie**:

```jsx
<Scena3D mapa="/scena-3d/mapa-w2.json" zoom={1.05} przygotujMape={…} />
```

Do dowiezienia z W2: limit sesji, przygody + ślad + panel Mentora, „Poznanie",
`ProfilAwatara`, fasola / oczko / cykl doby. To ~350 linii wobec ~5 600 linii,
które trzeba by przenosić w drugą stronę.

- **za:** najmniej przenoszonego kodu, zero ryzyka zgubienia funkcji W1, adres
  `/swiat` zostaje sobą (żadnych przekierowań), style bez zmian
- **przeciw:** dziedziczymy dług `Swiat.jsx` (2497 linii w jednym pliku)
  i wracamy z W2 do trybu z kontem — most `localStorage` przestaje być potrzebny,
  ale izolacja zapisu W2 znika i trzeba ją świadomie rozstrzygnąć

### Wariant A — zostaje `wariant/Wariant.jsx`, dorzucamy elementy W1

- **za:** czysty, mały plik; pętla W2 (bez punktów) zostaje nienaruszona
- **przeciw:** przeniesienie minigier, Koła, Puzzli, Reflektora, zwoju i czatu
  to przepisanie kilku tysięcy linii wraz z ich stanem — najdroższa i najbardziej
  ryzykowna droga; przy „przenosimy wszystko" traci sens

**Rekomendacja: Wariant B.** Poniższe etapy zakładają B.

---

## 5. Etapy

### Etap 0 — porządki, zanim cokolwiek ruszymy
- Drzewo robocze ma **106 zmienionych/nowych plików** (32 nieśledzone).
  Najpierw commit albo stash — inaczej nie da się odróżnić scalenia od bieżącej
  pracy nad fasolą.
- Gałąź robocza `scalenie-w1-w2` z `v2-postgres-vercel` (branch produkcyjny —
  nie `main`).
- Zrzuty odniesienia: stary deploy `/swiat`, lokalne `/swiat`, lokalne `/w2`.
- `npm run build` na czysto — punkt wyjścia musi się budować.

### Etap 1 — planeta W2 pod `/swiat` (sama scena, zero zmian w funkcjach)
- `Swiat.jsx`: prop `mapa` na `/scena-3d/mapa-w2.json`, `zoom` i
  `przygotujMape` przeniesione z `Wariant.jsx` (fasola i oczko **zostają** —
  `mapaPrzygody` z W2 je wycina, w scalonym świecie nie chcemy tego).
- Przełącznik awaryjny `?mapa=w1` do porównań na żywo.
- **Weryfikacja:** planeta wstaje, bohater chodzi, HUD siedzi tam gdzie siedział.
  Na tym etapie znaków jeszcze nie ma — to normalne.

### Etap 2 — znaki W1 na kulę o mniejszym promieniu ⚠ najwięcej pracy
Pozycje `[x, z]` z `mapa.json` są zawijane na kulę o R ≈ 12,5; W2 ma R = 8,5.
Ten sam `[x, z]` wypada więc pod **innym kątem** i część znaków ląduje za
horyzontem albo poza pasem chodzenia.

- Reguła startowa: `pos_W2 ≈ pos_W1 × (8,5 / 12,5) = × 0,68`, przy pasie
  użytecznym do `r ≈ 19` i zależności `r = 0,1484 · θ` z `docs/WERSJA_AKTUALNA.md`.
- **Liczby trzeba obejrzeć, nie tylko policzyć** — do sprawdzenia w edytorze
  `/scena-3d/edytor.html?mapa=w2`, znak po znaku.
- Kolejność wstawiania: `czarodziej` → `karty` → `drzewo-lotu` → `bucik` →
  `drzwi-domu` → `puzel-1…9` → `gwiazda-1…10`.
- Kolizje do rozstrzygnięcia: fasola `[-0,4 · 4,3]` siedzi praktycznie w miejscu
  `gwiazda-1` `[-0,4 · 4,6]`, a oczko wody `[10,1 · 4,7]` blisko `puzel-5`.
- Rola: agent `scena-3d`. Bundla `public/scena-3d/scena3d*.js` **nie ruszamy** —
  pilnuje tego `.claude/hooks/straznik-sceny.mjs`; źródła są w `scena-3d-src/`.

### Etap 3 — gwiazdki i pierwsze wejście
- `hub/zadanieGwiazdek.js` + `przywrocGwiazdkiNaMape` działają bez zmian, gdy
  znaki są na mapie (etap 2).
- Rozstawienie: albo 10 gwiazdek z W1 przeliczonych, albo **7 pozycji już
  policzonych** w `docs/WERSJA_AKTUALNA.md` § punkt 3 — te są pisane pod R = 8,5
  i pod krótką sesję. **Rekomendacja: siedem z dokumentu.**
- Nagroda za komplet: jedna widoczna zmiana na planecie (zapalona latarnia albo
  liść fasoli), nie monety — zgodnie z `docs/OPIS_PROJEKTU.md`.

### Etap 4 — minigry w popupie nad sceną
- `MinigryPanel` + `SplashGry` + `TutorialGry` + `WyborPoziomu` w `PanelSheet`,
  scena na `api.pauza()` pod spodem — mechanizm już jest w `Swiat.jsx`
  (`useHubPanel`, `useHubGra`).
- **Ryzyko WebGL:** `Lot Liska` i `Bieg Liska` to własne sceny 3D
  (`ChoinkaLaunchGame.jsx`, `BiegLiskaGame.jsx`). Dwa konteksty WebGL naraz na
  telefonie potrafią wywalić kartę. Propozycja: gry lekkie (Memory, karty)
  w popupie, gry 3D nadal na trasach `/games/*`, z powrotem na `/swiat`.
  **Wymaga potwierdzenia — to odstępstwo od „wszystko w popupie".**

### Etap 5 — popupy, zwój, podpowiedzi
`PopupPostaci`, `MessageScroll`, `PodpowiedzMedrca`, `ZadaniePanel`,
`WiadomosciPanel`, `CzatPanel` — w `Swiat.jsx` już są; tu tylko strojenie pod
nową kompozycję kadru (planeta jest mniejsza i wyżej, dolna część ekranu jest
wolniejsza niż w W1).

### Etap 6 — Koło, Puzzle, Reflektor, Domek
Bez zmian w logice; wejścia przez znaki z etapu 2 (`puzel-*`, `drzwi-domu`).
`KoloFortuny` do rozstrzygnięcia treściowego — patrz § 6.

### Etap 7 — elementy W2, które muszą przeżyć scalenie
| element | plik | uwaga |
|---|---|---|
| limit sesji 8 min | `wariant/stan.js` | W1 go nie ma; w scalonym świecie zostaje |
| przygody + ślad + Mentor | `wariant/Wariant.jsx`, `tresci.js` | serce projektu (zadanie poza ekranem) |
| „Poznanie" | `Wariant.jsx` | tylko gdy nie ma typu z onboardingu |
| `ProfilAwatara` | `wariant/ProfilAwatara.jsx` | zrobione 2026-09-14, wchodzi jak jest |
| doba, fasola, oczko | `mapa-w2.json` | zostają |

### Etap 8 — trasy i sprzątanie
- `/swiat` → świat scalony.
- `/w2` → `<Navigate to="/swiat" replace />` (adres w historii i w linkach).
- Stary hub W1 zostaje w repo i pod adresem DEV — **nic nie kasujemy**
  (`docs/WERSJA_AKTUALNA.md`).
- `AppData.jsx`: warunek `startsWith('/w2')` do przemyślenia — czy scalony świat
  czyta konto (wtedy most przez `localStorage` znika), czy zostaje odcięty.

### Etap 9 — sprawdzenie i wypuszczenie
- `tester-e2e` / `npm run e2e` na `frontend/e2e`.
- `npm run build` lokalnie **przed** pushem.
- Deploy wg `AGENT_DEPLOY_INSTRUCTIONS.md` (push na `v2-postgres-vercel`,
  pułapki: mount sync obcina pliki, git locks, polskie znaki w commit message).
- Aktualizacja `docs/WERSJA_AKTUALNA.md` — **przed** przepięciem trasy, nie po.

---

## 6. Ryzyka i sprzeczności do rozstrzygnięcia

1. **Dwie pętle, dwie filozofie.** W1 nagradza (gwiazdki, monety, Koło),
   W2 świadomie nie punktuje („zbieramy, żeby zobaczyć, co stanie się ze
   światem"). Scalenie musi wybrać, czym jest nagroda — inaczej dziecko dostanie
   dwa niespójne systemy w jednym świecie. Do przejścia z rolami
   `strateg-produktu` i `narrator-gama`.
2. **Limit sesji vs minigry.** 8 minut i katalog gier gryzą się: gra może się
   skończyć w połowie. Trzeba zdecydować, czy gry liczą się do limitu.
3. **Dwa konteksty WebGL** (etap 4).
4. **Geometria znaków** (etap 2) — jedyna część, której nie da się zrobić „na
   sucho"; wymaga edytora i oczu.
5. **Bundle sceny i cache.** Każda zmiana w `public/scena-3d/` = podbicie
   `WERSJA_SCENY` w `Scena3D.jsx`, inaczej przeglądarki serwują starą scenę.
6. **Brudne drzewo robocze** (106 plików) — etap 0 nie jest formalnością.

---

## 7. Czego ten plan nie robi

Nie kasuje W1, nie zmienia bazy danych, nie rusza onboardingu ani quizu,
nie zmienia backendu, nie wypycha niczego na produkcję bez osobnej zgody.

---

## 8. Kolejność w jednym rzucie

```
0. porządki + gałąź + zrzuty odniesienia
1. planeta W2 pod /swiat            ← widać efekt od razu
2. znaki W1 przeliczone na R = 8,5  ← najdroższy etap
3. gwiazdki + nagroda w świecie
4. minigry w popupie
5. popupy / zwój / podpowiedzi
6. Koło, Puzzle, Reflektor, Domek
7. limit sesji, przygody, ślad, Mentor, profil
8. trasy: /w2 → /swiat
9. e2e, build, deploy, docs
```

---

## 9. Do potwierdzenia przed startem

1. **Wariant B** (skorupą zostaje `Swiat.jsx`, podmieniamy pod nią planetę) —
   tak czy nie?
2. **Gry 3D** (`Lot Liska`, `Bieg Liska`) — popup czy jednak osobna trasa?
3. **Gwiazdki** — 10 przeliczonych z W1 czy 7 z `WERSJA_AKTUALNA.md`?
4. **Monety i Koło Fortuny** — zostają w scalonym świecie, czy scalony świat
   idzie za zasadą W2 „bez punktów"?
5. **Konto** — scalony `/swiat` czyta profil z API (jak W1), czy zostaje
   przy lokalnym zapisie (jak W2)?
