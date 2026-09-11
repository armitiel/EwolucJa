# EwolucJA — instrukcje dla agentów

## ⚠️ PRZED JAKIMKOLWIEK DEPLOYEM — przeczytaj

**[AGENT_DEPLOY_INSTRUCTIONS.md](./AGENT_DEPLOY_INSTRUCTIONS.md)** zawiera kompletny przewodnik:
- git + Vercel workflow (push na `v2-postgres-vercel` = auto-deploy w ~60s)
- Pułapki: mount sync (pliki same się ucinają), git locks, polskie znaki w commit message
- Windows vs Linux bash — co gdzie działa
- Pełen flow naprawy gdy plik został ucięty

Pominięcie tego pliku = stracona godzina na debugowanie znanych problemów.

## Agenci, komendy i strażnik — czytaj zanim zaczniesz

W repo są wyspecjalizowani subagenci (`.claude/agents/`). Użyj właściwego
zamiast robić wszystko samodzielnie:

| agent | do czego |
|---|---|
| `scena-3d` | cokolwiek w scenie 3D (źródła `scena-3d-src/`), planeta, mapa, znaki, animacje |
| `nowa-minigra` | dodanie gry, martwy kafelek gry |
| `deploy` | commit, push, produkcja |
| `narrator-gama` | każdy tekst, który widzi lub słyszy dziecko |
| `tester-e2e` | sprawdzenie przed wypchnięciem |

Komendy (`.claude/commands/`): `/deploy`, `/nowa-gra`, `/scena-patch`, `/e2e`, `/systemy`.

**Strażnik sceny** (`.claude/hooks/straznik-sceny.mjs`) blokuje bezpośrednią
edycję `public/scena-3d/scena3d*.js` i przypomina o `WERSJA_SCENY` po każdej
zmianie w `public/scena-3d/`. To nie jest przeszkoda do obejścia — bundle
naprawdę nie jest kodem źródłowym; źródła są w `frontend/scena-3d-src/`.

**Mapa systemów gry:** [`docs/SYSTEMY_GRY.md`](./docs/SYSTEMY_GRY.md) —
kanały oddziaływania na dziecko, pętle zadaniowe, ekonomia, przepisy na nowy
element i aktualne luki. Czytaj, zanim dołożysz cokolwiek, co odzywa się do gracza.

## Stack — szybka referencja

- **Frontend:** Vite + React 18 + react-router-dom v6 (`frontend/`)
- **Backend:** Express jako Vercel Function (`api/index.js` → `backend/src/server.js`)
- **DB:** Neon Postgres (`POSTGRES_URL` w Vercel env)
- **Błędy:** Sentry — `VITE_SENTRY_DSN` (front), `SENTRY_DSN` (back); patrz sekcja „Sentry" niżej
- **TTS:** ElevenLabs (`ELEVENLABS_*`)
- **AI (tekst):** Claude API (`ANTHROPIC_API_KEY`) — narracja, profile
- **AI (obrazy):** patrz sekcja „Generowanie grafik" niżej — są DWA generatory
- **Production URL:** https://ewolucja-azure.vercel.app
- **Production branch:** `v2-postgres-vercel` (NIE `main`)
- **Repo:** github.com/armitiel/EwolucJa

## `tmp/` NIE jest śmietnikiem — pisze tam lokalny Postgres

W `tmp/` leżał prawdziwy śmieć (979 MB porzuconych profili Chrome CDP,
skasowane 2026-09-08), ale **`tmp/pg.log` to działający dziennik lokalnego
Postgresa** z historią od sierpnia. Katalogu nie kasuj w całości — usuwaj
z niego wyłącznie profile `chrome-cdp*` i `chrome-gpu`.

Przy próbie usunięcia całego `tmp/` 2026-09-08 Postgres przeszedł restart
z odtworzeniem (`redo done`, checkpoint bez straty danych) i wstał czysto.
Drugi raz może nie być tak łagodnie.

## `agents/world/*.md` to DANE URUCHOMIENIOWE, nie dokumentacja

`backend/src/services/narrativeService.js` czyta przy starcie:

```
agents/world/zakatek_gama.md    -> WORLD_LORE
agents/world/archetypes.md      -> ARCHETYPE_LORE
```

Katalog `agents/` wygląda na martwy (skrypt `game_master.py` nie jest nigdzie
uruchamiany), ale **podkatalog `world/` jest wczytywany przez backend w czasie
działania**. Przeniesienie go daje ciche `ENOENT` w logu i narrację bez lore —
gra wstaje, tylko głupieje. Dokładnie to stało się 2026-09-08.

`agents/world/quiz_osobowosci.md` jest dodatkowo źródłem prawdy dla quizu
w `backend/src/api/onboarding.js` (sekcja 5) — zsynchronizowane ręcznie.

## Gdzie co leży — reguły po porządkach z 2026-09-08

| rzecz | miejsce | czego NIE robić |
|---|---|---|
| **tokeny wyglądu** (paleta, kroje, promienie, cienie, skala CTA, złoto HUD-u) | `frontend/public/tokeny.css` — linkowany w `index.html` PRZED `hud.css` | **nie wpisywać `#hex` w regule komponentu ani w `style={{}}`** — komponent czyta `var(--token)`; przezroczystość przez `color-mix(in srgb, var(--token) P%, transparent)`, nie `rgba`; zasady i plan: [`docs/SYSTEM_STYLOW.md`](./docs/SYSTEM_STYLOW.md); po zmianie tokenów podbij `?v=N` w obu `index.html`; po dopisaniu barwy do rampy: `node scripts/tokenizuj-barwy.mjs` (bezstratnie podmienia literały na `var()`) |
| dane treściowe | `frontend/src/data/` (JS) lub `frontend/src/hub/data/` (JSON) | nie zostawiać ich w korzeniu `src/` |
| źródła graficzne (.psd/.ai/.psb) | `zrodla-graficzne/` w korzeniu repo | **nigdy pod `frontend/public/`** — wszystko stamtąd Vercel serwuje publicznie |
| eksporty używane przez grę | `frontend/public/assets/` w formacie webowym | nie commitować źródeł obok |
| kopie zapasowe | git | `.bak-*` w `public/` to bomba z opóźnionym zapłonem |
| kod bez importów | `_do_usuniecia/` | nie zostawiać „na wszelki wypadek" w `src/` |

**PUŁAPKA — backend importuje z frontendu.** `backend/src/api/cycles.js` robi
`import { MENTOR_TASK_LIBRARY } from "../../../frontend/src/data/mentorTaskLibrary.js"`.
Przeniesienie albo zmiana nazwy tego pliku **wywala produkcję**, a nic w
`frontend/` o tym nie uprzedza. To jedyne takie miejsce w repo i dług
do spłacenia (dane powinny być wspólną paczką albo tabelą w bazie).

**Prototyp V1** (`src/App.jsx`, 1698 linii — koncept porzucony)
wisi na `/play`, osiągalny tylko z pulpitu `/dev`. Od 2026-09-08 jest ładowany
leniwie — jego 72 KB nie jedzie już w paczce startowej. Nie importuj go
statycznie z powrotem.

## Konwencje kodu

- **Stan globalny:** `frontend/src/contexts/AppData.jsx` (player, cycle, mission preloaded raz przy starcie — zakładki nie powinny refetchować)
- **Top/Tab nav:** `TopBar` i `TabBar` są `position: fixed`. Spacer wewnątrz komponentu trzyma miejsce w flow. Nie modyfikuj bez zrozumienia rubber-band efektu.
- **Scroll wewnętrzny:** klasa `.screen-scroll` (overflow-y:auto + overscroll-behavior contain). Padding `12px 18px 52px` daje "oddech" na granicach.
- **Kolory:** `#4e4d76` zamiast czarnego w UI (var `--p-ink`). Brak czarnych elementów.
- **Czcionki:** Display = Baloo 2, Body = Nunito, Handwritten = Caveat/Fredoka.
- **Styl 3D:** Stylized Claymorphism / Pixar — obłe kształty, żywe kolory, matowe tekstury.

## Koncept gry — co jest naprawdę na ekranie

Źródło prawdy: **[`docs/KONCEPT_GRY.md`](./docs/KONCEPT_GRY.md)** (spisane
z ekranów 2026-09-09). W skrócie: START → **Świat 3D**, czyli planeta z jedną
polaną. Wizkor zleca: gwiazdki, odkrywanie trzech gier przez puzzle, zadanie
poza ekranem (cechę losuje Koło Przeznaczenia, dowód idzie do Mentora). Lisek
zaprasza do porady dnia. Dok: Minigry · Rozmowy · Zadania · Porada. Profil:
awatar, imię, monety, mocne strony. Dom: „co już masz".

Trasy bez dojścia z interfejsu (`/play`, `/przygoda`, stara aplikacja
zakładkowa) **nie są częścią gry** — nie buduj na nich i nie opisuj ich jako
gry. `project_instructions` w ustawieniach Cowork są nieaktualne wobec
`KONCEPT_GRY.md` — do poprawki po stronie ustawień, nie repo.

Kierunki rozwoju i granice dzisiejszej gry: [`docs/ROZWOJ_GRY.md`](./docs/ROZWOJ_GRY.md).

Język: dzieci 6–12 lat, ciepły, tajemniczy, pełen przygód; narratorka w rodzaju
żeńskim. Styl: Stylized 3D Claymorphism / Pixar.

## Co NIE działa (znane problemy)

- `git push` z Linux bash sandbox (`fatal: could not read Username`) — używaj `mcp__Windows-MCP__PowerShell` lub Desktop Commander
- `sed -i` na 5+ plikach JSX naraz — truncuje
- `npm install` w workspace bash bez `&` + logfile — wisi
- Polskie znaki w `git commit -m "..."` z cmd/PowerShell — łamie escaping

## Generowanie grafik — dwa generatory, oba działają

Sprawdzone 2026-08-16 wywołaniem na maszynie autora.

| co | klucz | gdzie leży | stan |
|---|---|---|---|
| **OpenAI** | `OPENAI_API_KEY` | `backend/.env` | działa, prefiks `sk-proj-`, 164 znaki |
| **fal.ai** | `FAL_KEY` | `backend/.env` | działa, wpięty w `backend/src/services/falService.js` |

**Modele obrazowe dostępne na koncie OpenAI:** `gpt-image-2`, `gpt-image-2-2026-04-21`,
`gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `chatgpt-image-latest`.

**Co potrafi fal.ai (już w kodzie, nie trzeba pisać od zera):**

- `fal-ai/flux/schnell` — tekst → obraz (`falService.generate`)
- `fal-ai/flux/dev/image-to-image` — **obraz → obraz**, czyli styl brany z gotowej
  ilustracji zamiast zgadywany z opisu (`falService.img2img`)
- `fal-ai/bria/background/remove` — usuwanie tła

**Do zadań „w stylu istniejącej grafiki" wybieraj img2img z fal.ai.** Podanie
`public/wizPop.webp` jako obrazu wejściowego odwzorowuje grube obrysy, połysk
i paletę fiolet–złoto pewniej niż jakikolwiek opis tekstowy.

### Pułapki przy kluczach — realne, nie teoretyczne

- **`sk-ant-` to Anthropic, nie OpenAI.** Klucz wklejony pod `OPENAI_API_KEY`
  z tym prefiksem da 401 „Incorrect API key provided". Prefiksy: OpenAI
  `sk-proj-` (~164 znaki), Anthropic `sk-ant-` (~108).
- **Zmienna systemowa Windows `OPENAI_API_KEY` bywa nieaktualna** — na tej
  maszynie leżała tam wartość 35-znakowa, która zwracała 401. Źródłem prawdy
  jest `backend/.env`, a nie zmienne konta.
- **ChatGPT Plus ≠ API.** Konto API rozlicza się osobno; bez środków klucz
  jest poprawny, ale generowanie zwraca błąd.
- `backend/.env` jest w `.gitignore` (linia 10) i nie jest śledzony — to
  właściwe miejsce na sekrety. Nie wpisuj kluczy do plików w `frontend/`,
  bo wszystko z `public/` i z builda ląduje w przeglądarce dziecka.
- Klucze wołaj **z maszyny autora** (Desktop Commander), nie z sandboxa —
  sekret nie musi nigdzie wyjeżdżać.

## Scena 3D — źródła w `frontend/scena-3d-src/`, bundle to wynik builda

Od 2026-09-09 scena ma kod źródłowy: `frontend/scena-3d-src/src/` (three.js,
esbuild). `frontend/public/scena-3d/scena3d.js` i `scena3d.esm.js` to **wynik
builda** — nie edytuj ich i nie uruchamiaj na nich skryptów z
`frontend/narzedzia/` (relikty sprzed planety). Build: `cd frontend && node
scena-3d-src/build.mjs` (cmd na Windowsie). Opis architektury — w tym rzutu
mapy na kulę i kontraktu z Reactem — w `frontend/scena-3d-src/README.md`.

**Świat jest KULĄ (planetą), ale logika gry jest płaska.** Ruch, kolizje,
ścieżka, znaki, `mapa.json` i edytor liczą się w układzie (x, z); na sferę
przenosi je `Planeta.ustaw(obj, x, z, h, obrotY)`. Kula obraca się pod
bohaterem z opóźnieniem (mały margines ruchu), kamera stoi w miejscu.

**Po KAŻDEJ zmianie w bundlu podbij `WERSJA_SCENY`** w
`frontend/src/components/Scena3D.jsx`. Pliki w `public/` nie mają hasha
w nazwie, więc bez tego przeglądarka poda starą scenę z cache. Numer ma
tylko rosnąć — cofnięcie serwuje z cache zawartość sprzed miesięcy.
To samo dotyczy `hud.css`: wersja siedzi w `frontend/index.html` jako `?v=N`.

**Czego NIE da się przetestować bezgłowo:** bezgłowy Chromium ze swiftshaderem
zatrzymuje pętlę renderowania po kilkunastu klatkach — licznik klatek staje
i żaden zegar sceny nie postępuje. Cykle pojawiania się, respawny i wszystko
oparte o upływ czasu trzeba sprawdzać w prawdziwej przeglądarce. Bezgłowo
weryfikuj tylko stan po wczytaniu, pozycje, geometrię i to, czy model się
wczytał.

## Misje z grami — gry są znaleziskiem, nie spisem

Łańcuch zadań Wizkora i odkrywanie minigier siedzą w jednym module:
`frontend/src/hub/misjeGier.js`. Cztery stany jednej gry:

```
ukryta → ujawniona (Wizkor zlecił: znak wchodzi na mapę)
       → znaleziona (wbiegnięcie w znak: gra w zakładce NA STAŁE)
       → wygrana → wyplacona
```

Konsekwencje, o które łatwo się potknąć:

- **`zaliczWygrana` nie ruszy gry nieznalezionej.** To jest cała zasada
  „najpierw znajdź na mapie" — nie ma żadnej ulotnej flagi „wszedłem z mapy".
- **Znaki nieujawnionych gier są zdejmowane ze sceny w locie**
  (`hub/znakiMapy.js`), bo `mapa.json` czyta się raz, przy montowaniu WebGL-a.
  To jedyne miejsce sięgające do wnętrza bundla (`_app.markers`). Pętla sceny
  liczy próg powrotu jako `powroty ? def.respawn : (def.respawnPierwszy ??
  def.respawn)` — wygaszenie samego `respawn` NIE wystarcza.
- **Zakładka minigier filtruje po `gryWZakladce()`.** Gra spoza łańcucha misji
  zachowuje się po staremu (kłódka; warunek `wymaga` z katalogu).
- Dopisanie kolejnej gry = jeden wpis w `MISJE` (teksty Wizkora, ikona,
  nagroda, id znaku) + wywołanie `zaliczWygrana("<id>")` w samej grze.

## Wskazówki (chmurka Wizkora nad ikoną)

`frontend/src/hub/Reflektor.jsx` + treści i rytm w `frontend/src/hub/wskazowki.js`.
Ilustracja: `frontend/public/wizTip.webp` (Wizkor z uniesionym palcem).

Dwa tryby: `"dymek"` (komiksowa chmurka z dzióbkiem, świat chodzi dalej,
schodzi sama) i `"reflektor"` (świat ciemnieje, w świetle zostaje jeden
przycisk — gotowy, dziś nieużywany).

Decyzje, których nie wolno cofnąć bez powodu:

- **Nie w trakcie misji.** `misjaWToku` w `Swiat.jsx` blokuje chmurkę i ZERUJE
  zegar. Odliczanie w tle podczas zadania kończyłoby się chmurką w sekundzie,
  w której dziecko właśnie skończyło misję.
- **Nie na wejściu.** Pierwsza chmurka po `poCzasie` (75 s) wolnego chodzenia,
  potem co `powtorkaCo` (3,5 min), najwyżej `maksNaSesje` razy.
- **Zamknięcie ≠ „już wiem".** Pamięć (`oznaczPoznana`) zapisuje się dopiero,
  gdy dziecko otworzy wskazany panel (`panelCelu`) — obojętnie czy z chmurki,
  czy samo.
- **`obszar` w definicji** mówi, co w elemencie jest NAPRAWDĘ widoczne.
  Przycisk doku to komórka ~107×73, a widać z niego złote koło 68×68 przy
  dolnej krawędzi; bez tego dzióbek celuje w powietrze nad ikoną.

## Pulpit testowy (DEV)

`frontend/src/hub/DevRezyserka.jsx`, włącznik w `services/dev.js`.

- Na dev-serwerze Vite jest **domyślnie włączony** — pinezka „DEV" przy lewej
  krawędzi `/swiat`. Na produkcji trzeba dopisać `?dev=1`.
- `Ctrl+Shift+D` wyłącza i przeładowuje (podgląd świata bez narzędzi).
- Skraca: gwiazdki do kompletu, zlecenie/znalezienie/zaliczenie każdej misji,
  przywołanie Wizkora (inaczej ~95 s czekania), skok do znaku, wygranie
  otwartej gry przez uchwyt `window.__devGra` rejestrowany przez samą grę.
- **Katalog zdarzeń** (`zdarzeniaDev` w `Swiat.jsx`) daje na żądanie wszystko,
  co normalnie przychodzi samo i rzadko: każdą kwestię Wizkora (na podstawionych
  stanach, więc bez zapisu do postępu), zaproszenia liska, ekrany nagród, toast,
  lot gwiazdki do licznika. Lista mieszka w hubie — pulpit tylko rysuje przyciski,
  więc nowe okno dopisuje się w jednym miejscu.
- **Pulpit nie ma własnej logiki stanu** — woła te same funkcje co gra. Skróty
  chodzące własną drogą testowałyby siebie, nie grę.

## Monety — dwa źródła, jedno bez backendu

Backend przyznaje monety **wyłącznie** przy weryfikacji misji przez Mentora;
nie ma końcówki „dodaj graczowi N monet". Nagrody z gry (zadanie czarodzieja,
minigry) idą więc przez `frontend/src/services/monety.js` i są **doliczane**
do liczby z bazy:

```
monety w HUD = player.coins (baza) + bonusMonet() (localStorage)
```

Konsekwencje: dorobek nie przechodzi na inne urządzenie i ginie po
wyczyszczeniu danych strony. To świadomy dług — `dodajMonety` jest jednym
miejscem, przez które to później pójdzie na serwer. **Nie dopisuj tędy monet
za misje Mentora** — one już są w bazie, policzyłyby się podwójnie.

## Zadanie w realu — w demie Mentor odpowiada sam

Dowód dziecka leci do bazy i misja dostaje status `submitted`. Na `verified`
przestawia ją **wyłącznie** prawdziwy Mentor ze swojego panelu
(`backend/src/api/mentor.js`) — nic nie robi tego automatycznie. Bez Mentora
po drugiej stronie zadanie zostawało więc na zawsze w „Sprawdzane".

Na czas dema działa przełącznik `DEMO_SAM_ZATWIERDZA` w
`frontend/src/hub/zadanieWizkora.js`: minutę po wysłaniu dowodu werdykt
przychodzi sam, karta zmienia się na „Nagroda czeka", a monety idą **torem
lokalnym** (`dodajMonety`), bo w bazie ich nie ma. Rozstrzyga o tym `demo`
w zapisie zadania — przy prawdziwym werdykcie flagi nie ma i monety liczy
tylko baza.

Gdy panel Mentora ruszy: `DEMO_SAM_ZATWIERDZA = false` i tyle. Reszta toru
(sprawdzanie, karta w zwoju, ekran nagrody) jest wspólna dla obu dróg.

## Sentry — błędy z produkcji

Wpięte 2026-09-08. Dwa osobne projekty w organizacji `armitiel` (region DE):
`ewolucja-frontend` (przeglądarka dziecka) i `ewolucja-backend` (funkcja Vercela).

| gdzie | plik | zmienna |
|---|---|---|
| front | `frontend/src/services/sentry.js`, importowany PIERWSZĄ linią `main.jsx` | `VITE_SENTRY_DSN` |
| back | `api/sentry.js`, importowany PIERWSZYM importem `api/index.js` | `SENTRY_DSN` |

**Kolejność importu jest wymaganiem, nie stylem.** SDK instrumentuje moduły
(http, express, pg) w chwili `init` — init po imporcie serwera nie objąłby już
żadnej trasy. To samo na froncie: globalne łapacze mają stać przed pierwszym
renderem Reacta.

**Bez DSN oba moduły są no-opem.** Lokalny `npm run dev` nie wysyła nic i nie
wymaga konfiguracji — dlatego w `.env.example` `SENTRY_DSN` jest puste.

**Flush w funkcji Vercela.** `api/index.js` czeka na koniec odpowiedzi
(`finish`/`close`) i dopiero wtedy woła `Sentry.flush(2000)`. Bez tego Vercel
zamraża funkcję, zanim zdarzenie wyjedzie — błąd byłby zgłoszony i przepadł.

**Świadome decyzje — użytkownikiem jest dziecko 6-12 lat:**

- **Session Replay wyłączony.** Nagrywanie ekranu małoletniego to zgoda
  rodzica i wpis w polityce prywatności, nie efekt uboczny wpięcia SDK.
- **`sendDefaultPii: false`** — żadnego IP, ciasteczek ani nagłówków.
- **`tracesSampleRate: 0`** — scena 3D generowałaby lawinę spanów, a darmowy
  plan ma na nie limit.

**Mapy źródłowe.** `@sentry/vite-plugin` wgrywa je przy buildzie i kasuje
z `dist/` (`filesToDeleteAfterUpload`) — same mapy w `dist/` Vercel
serwowałby publicznie, czyli oddawał cały kod źródłowy gry. Wtyczka
i `build.sourcemap` włączają się WYŁĄCZNIE, gdy w środowisku jest
`SENTRY_AUTH_TOKEN` (produkcja Vercela). Bez tokena build przechodzi jak
dotąd, tylko bez map.

**Wtyczka ładuje się dynamicznie, i to nie jest ozdobnik.** Na tej maszynie
`NODE_ENV=production`, więc `npm install` pomija devDependencies — statyczny
`import` z `@sentry/vite-plugin` wywalałby lokalny build komunikatem
o brakującym module, nijak niezwiązanym z prawdziwą przyczyną. Z tego samego
powodu instalacja czegokolwiek deweloperskiego wymaga tu `--include=dev`.

**Region ma znaczenie.** Organizacja siedzi w regionie europejskim, więc
wtyczka dostaje `url: "https://de.sentry.io/"`. Domyślne `https://sentry.io/`
zwraca 404 przy wgrywaniu map.
