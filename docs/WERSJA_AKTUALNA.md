# Wersja aktualna — co jest torem głównym gry

Ustalone 2026-09-14. Ten plik mówi, **którędy idzie dziecko** i co należy do
wersji aktualnej. Gdy trasa albo ekran się zmienia, zmienia się najpierw tu.

Nadrzędny sens: `docs/OPIS_PROJEKTU.md`. Stan ekranów: `docs/KONCEPT_GRY.md`.
Plan prac: `docs/PLAN_DZIALANIA.md`. Test startowy: `docs/TEST_OBRAZKOWY.md`.

---

## Łańcuch wersji aktualnej

```
1. EKRAN POCZĄTKOWY  /            START
2. ONBOARDING        /onboarding  test profilu → typ dziecka
3. ŚWIAT 3D          /swiat       planeta, fasola, przygody poza ekranem
4. BAZA WIEDZY                    porada dnia + porada zdrowia — DOBIERANE PO TYPIE
5. ZADANIA                        dobierane PO TYPIE
6. PROFIL AWATARA                 dostępny z UI po kliknięciu w awatar
```

Punkty 1–3 są **przepięte w kodzie** (2026-09-14). Punkty 4–6 mają dane
i miejsce, ale nie są jeszcze spięte — rozpisane niżej.

## Co należy do wersji aktualnej, a co jest poprzednią

> **Aktualizacja 2026-09-14 (wieczór): tor główny to `/swiat`.** Oprawa 3D z W2
> — planeta R = 8,5, doba, słońce, kadry kamery, ekspozycja — została
> przeniesiona do `mapa.json`, więc `/swiat` niesie dziś nowy świat RAZEM
> z hubem i łańcuchem misji. START i koniec onboardingu prowadzą tam.
> `/w2` zostaje żywy pod swoim adresem: to jedyne miejsce, gdzie działa
> **limit sesji** (`wariant/stan.js`, 8 min) i **karta profilu awatara** —
> obie rzeczy mają jeszcze przejść do `/swiat`. Tabela niżej opisuje różnice
> projektowe obu torów i została napisana przed tym przepięciem; czytaj ją
> jako „czym różni się W2 od huba", nie jako „co jest aktualne".

| | wersja aktualna | poprzednia (żywa, nie kasujemy) |
|---|---|---|
| świat | **W2** — `/w2` (`frontend/src/wariant/`) | W1 — `/swiat` (`pages/Swiat.jsx`) |
| mapa | `public/scena-3d/mapa-w2.json`, kula R = 8,5, doba nogami | `mapa.json`, kula R = 12,5, bez doby |
| pętla | trop → krótka aktywność → odłożenie ekranu → ślad → Mentor → powrót → zmiana świata | gwiazdki → puzzle → trzy minigry → Koło → zadanie |
| profil | 6 typów z onboardingu | cechy z Koła, profil z zerami |
| limit sesji | **jest** (`wariant/stan.js`, 8 min) | brak |
| dok | brak — dziecko idzie do rzeczy | cztery ikony |

**W1 zostaje dostępny** pod swoim adresem i z pulpitu DEV. Jego elementy
(gwiazdki, puzzle, minigry, zwój, Koło, schematy UI) przenosimy do W2
**pojedynczo, na zawołanie** — każdy wtedy, gdy ma w W2 swoje miejsce i swój
powód. Nic z W1 nie jest kasowane „bo już nieaktualne”.

---

## Co zostało przepięte (zmiany z 2026-09-14)

| plik | zmiana |
|---|---|
| `frontend/src/pages/Landing.jsx` | START prowadzi do **`/swiat`** (gracz z sesją) albo `/onboarding` (nowy); kurtyna z chmur stawiana przed obydwoma torami. *Wieczorna korekta: stała `SWIAT` przepięta z `/w2` na `/swiat`.* |
| `frontend/src/pages/Onboarding.jsx` | `POMIN_ONBOARDING = false` — **onboarding wraca**; koniec quizu prowadzi do **`/swiat`** (stała `SWIAT_PO_QUIZIE`; wieczorem przepięta z `/w2`); typ zapisywany do `localStorage` pod `ewolucja.profil.typ` (`KLUCZ_TYP`) |
| `frontend/src/wariant/Wariant.jsx` | pasek: zdjęty tytuł „W2 · Małe wielkie odkrycia” i przycisk „Dla dorosłego” (logowanie Mentora jest na ekranie startowym; panel zostaje pod `/w2/mentor`); dolny HUD (chmurka + trzy przyciski) schowany za `POKAZ_DOLNY_HUD = false` — zadania wracają razem ze spotkaniem Wizkora na mapie; awatar otwiera kartę profilu zamiast formularza |
| `frontend/src/wariant/ProfilAwatara.jsx` | **nowy** — karta profilu z awatarem typu, opisem osobowości i radarem |
| `backend/src/api/onboarding.js` | quiz przepisany na **6 pytań × 4 odpowiedzi** wg `docs/TEST_OBRAZKOWY.md`; każda odpowiedź ma `glowna`, `podpis`, `obraz`, opcjonalnie `tylko48`; typ wybierany z licznika `main_picks`, nie z sumy punktów; `main_picks` zapisywane przy graczu i zwracane z `/submit` |

**Most do W2.** Tor W2 ma odizolowany zapis i celowo nie wczytuje konta
(`AppData.jsx`: `if (location.pathname.startsWith('/w2')) return;`). Dlatego
typ z onboardingu przechodzi przez `localStorage` — to jedyne miejsce, w którym
te dwa światy się stykają. Gdy W2 zacznie czytać konto, most znika.

**Balans quizu po zmianie** (20 000 przebiegów, wybory losowe):
EM 18,1 % · ST 17,5 % · KR 18,0 % · LD 17,1 % · DT 16,4 % · MD 12,9 %
(wersja 3-kafelkowa: 12,7–20,2 %). MD wypada najniżej, bo jest ostatnie
w `TIE_BREAK_PREFERENCE` — do poprawienia kolejnością preferencji, nie treścią
pytań. Skrypt kontrolny: `backend/scripts/test-quiz-balance.mjs` (wymaga
przeliczenia pod 6 pytań).

---

## Punkt 3 — pierwsze wejście do W2: kilka misji na rozgrzewkę

Dziecko, które pierwszy raz staje na planecie, ma dostać **powód, żeby ją
obejść**, zanim padnie pierwsze zadanie poza ekranem. Najtańszy i sprawdzony:
**gwiazdki**. Mechanika istnieje w W1 (`hub/zadanieGwiazdek.js`,
`przywrocGwiazdkiNaMape`, respawn w scenie) — brakuje wyłącznie **pozycji na
nowej mapie**, bo `mapa-w2.json` ma dziś `"znaki": []`.

Propozycja rozstawienia (R = 8,5; `r = 0,1484 · θ`; pas użyteczny do r ≈ 19):

| # | pos `[x, z]` | r | θ | gdzie to jest |
|---|---|---|---|---|
| 1 | `[1.8, 4.6]` | 4,9 | 33° | tuż przy starcie, widoczna od pierwszej klatki |
| 2 | `[3.6, 5.2]` | 6,3 | 43° | po drodze w stronę wody |
| 3 | `[5.4, 6.4]` | 8,4 | 56° | zbocze przed Pąkiem |
| 4 | `[7.6, 5.6]` | 9,4 | 64° | przy przyszłym obiekcie-drogowskazie |
| 5 | `[9.2, 3.2]` | 9,7 | 66° | za oczkiem wody |
| 6 | `[6.2, 1.2]` | 6,3 | 43° | droga powrotna, druga strona polany |
| 7 | `[3.0, 1.6]` | 3,4 | 23° | blisko fasoli, zamyka pętlę |

Siedem, nie dziesięć: pętla ma się zamknąć w kilku minutach, bo sesja jest
ograniczona. **Zebranie kompletu nie daje monet** — daje *jedną widoczną rzecz
na planecie* (zapalona latarnia albo pierwszy liść fasoli), zgodnie z zasadą
„działamy, żeby zobaczyć, co stanie się ze światem”.

Do sprawdzenia w edytorze (`/scena-3d/?mapa=w2`, `?kula=N`) przed wpisaniem —
liczby wyżej są policzone, nie obejrzane.

---

## Punkt 4 — baza wiedzy po typie

Dane już istnieją i **są otagowane sześcioma archetypami**:

| co | plik | stan |
|---|---|---|
| porady-ciekawostki dla 6 typów | `frontend/src/data/dailyTipsData.js` (7591 linii) | ma `PROFILES_META`, `DAILY_TIPS`, gotowe `tipsForProfile`, `todaysTip`, `tipsForAudience` |
| karty porady dnia (aktywność z liskiem) | `frontend/src/hub/data/porady.v1.json` + `hub/poradaDnia.js` | deterministyczne w dobie, **bez typu** |
| porady zdrowotne Mędrca | `frontend/src/hub/data/porady-zdrowia.v1.json` | 16 zdań, **bez typu** |

Do zrobienia: `poradaDnia.js` przyjmuje typ i woła `tipsForProfile(typ)`;
porady zdrowotne dostają pole `typ` albo zostają wspólne dla wszystkich
(decyzja: **wspólne** — ciało ma to samo niezależnie od charakteru, różnić ma
się *ton podania*, nie treść).

## Punkt 5 — zadania po typie

Opisane w `docs/PLAN_DZIALANIA.md` §2 i §5: mapowanie dziesięciu zadań na
sześć typów, dopisanie po jednym dla EM i ST, Koło dobierające pod typ
z jednym polem dzikim. W W2 dotyczy to `frontend/src/wariant/tresci.js` —
siedem przygód ma dziś pole `os` z pięcioosiowego systemu; do przepisania na
kody typów.

## Punkt 6 — profil awatara z UI — **zrobione 2026-09-14**

Kliknięcie w awatar w lewym górnym rogu otwiera kartę profilu:
`frontend/src/wariant/ProfilAwatara.jsx` — awatar zwierzęcia przypisany do typu
(`components/ProfileAvatar.jsx`), nazwa typu, opis osobowości
(`growthData.js`) i radar sześciu cech (`components/CharakterBohatera.jsx`),
czyli komplet z poprzedniej wersji świata. Zmiana imienia jest w tej karcie
jedną pozycją, nie osobnym ekranem. Sam awatar w pasku też bierze wygląd
z typu (`PROFILE_INFO[...].svgMini`), a lisek zostaje, gdy typu jeszcze nie ma.

Gracza dociągamy w panelu bezpośrednio z API (`api.getPlayer`), bo W2 celowo
nie przechodzi przez AppData. Bez konta albo bez sieci zostaje awatar, imię
i opis z typu zapisanego lokalnie.

---

## Kolejne kroki, w tej kolejności

1. Gwiazdki na mapie W2 (§ punkt 3) — dane + zamknięcie pętli jedną zmianą
   w świecie.
2. W2 czyta typ z `ewolucja.profil.typ` i pomija pytania o preferencje
   w „Poznajmy się”.
3. Profil awatara pod kliknięciem (§ punkt 6).
4. Porada dnia po typie (§ punkt 4).
5. Przygody W2 przepisane na typy (§ punkt 5).
6. Ilustracje do onboardingu — pipeline `fal-ai/flux/dev/image-to-image`
   z `wizPop.webp` jako wzorcem stylu, 24 kafelki, brief w
   `docs/TEST_OBRAZKOWY.md` §5. Nazwy plików są już w danych quizu
   (`/assets/onboarding/<pytanie>-<odpowiedź>.webp`) — wystarczy je wygenerować
   i wrzucić.

## Czego ta zmiana nie robi

Nie kasuje W1, nie rusza Koła, nie zmienia bazy danych, nie była wypchnięta
na produkcję. Zmiany leżą w drzewie roboczym — przed pushem obowiązuje
`AGENT_DEPLOY_INSTRUCTIONS.md` i `npm run build` lokalnie.
