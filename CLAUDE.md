# EwolucJA — instrukcje dla agentów

## ⚠️ PRZED JAKIMKOLWIEK DEPLOYEM — przeczytaj

**[AGENT_DEPLOY_INSTRUCTIONS.md](./AGENT_DEPLOY_INSTRUCTIONS.md)** zawiera kompletny przewodnik:
- git + Vercel workflow (push na `v2-postgres-vercel` = auto-deploy w ~60s)
- Pułapki: mount sync (pliki same się ucinają), git locks, polskie znaki w commit message
- Windows vs Linux bash — co gdzie działa
- Pełen flow naprawy gdy plik został ucięty

Pominięcie tego pliku = stracona godzina na debugowanie znanych problemów.

## Stack — szybka referencja

- **Frontend:** Vite + React 18 + react-router-dom v6 (`frontend/`)
- **Backend:** Express jako Vercel Function (`api/index.js` → `backend/src/server.js`)
- **DB:** Neon Postgres (`POSTGRES_URL` w Vercel env)
- **TTS:** ElevenLabs (`ELEVENLABS_*`)
- **AI (tekst):** Claude API (`ANTHROPIC_API_KEY`) — narracja, profile
- **AI (obrazy):** patrz sekcja „Generowanie grafik" niżej — są DWA generatory
- **Production URL:** https://ewolucja-azure.vercel.app
- **Production branch:** `v2-postgres-vercel` (NIE `main`)
- **Repo:** github.com/armitiel/EwolucJa

## Konwencje kodu

- **Stan globalny:** `frontend/src/contexts/AppData.jsx` (player, cycle, mission preloaded raz przy starcie — zakładki nie powinny refetchować)
- **Top/Tab nav:** `TopBar` i `TabBar` są `position: fixed`. Spacer wewnątrz komponentu trzyma miejsce w flow. Nie modyfikuj bez zrozumienia rubber-band efektu.
- **Scroll wewnętrzny:** klasa `.screen-scroll` (overflow-y:auto + overscroll-behavior contain). Padding `12px 18px 52px` daje "oddech" na granicach.
- **Kolory:** `#4e4d76` zamiast czarnego w UI (var `--p-ink`). Brak czarnych elementów.
- **Czcionki:** Display = Baloo 2, Body = Nunito, Handwritten = Caveat/Fredoka.
- **Styl 3D:** Stylized Claymorphism / Pixar — obłe kształty, żywe kolory, matowe tekstury.

## Zasady GAMA-1 (z project_instructions)

1. **Profilowanie:** 6 archetypów (EM, ST, KR, LD, DT, MD), po quizie maks 7-8 pts każdy (balans).
2. **Krainy:** Dolina Selfie, Las Pytań, Jaskinia Emocji, Wyspa Talentów, Przystań Współpracy, Góra Podsumowania.
3. **Język:** Dzieci 6-12 lat, ciepły, tajemniczy, pełen przygód. Narrator w rodzaju żeńskim.
4. **Ewolucja awatara:** Po każdej misji info o zdobytym ekwipunku (np. Gogle Wynalazcy dla KR).
5. **Stan gry JSON:** Generuj wewnętrznie po każdej interakcji (ukryty od gracza).

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

## Scena 3D — zmiany wchodzą przez skrypty, nie przez edycję bundla

`frontend/public/scena-3d/scena3d.js` i `scena3d.esm.js` to **zminifikowane
bundle**, a nie kod źródłowy. Nie da się ich czytać z diffa. Każda zmiana
wchodzi przez skrypt z `frontend/narzedzia/`, który podmienia konkretne
łańcuchy i **przerywa pracę, jeśli wzorzec nie trafi dokładnie raz**. Te
skrypty są jedyną czytelną dokumentacją tego, co siedzi w bundlu ponad
oryginalny build — patrz `frontend/narzedzia/README.md`.

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
