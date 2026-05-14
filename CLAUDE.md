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
- **AI:** Claude API (`ANTHROPIC_API_KEY`) — narracja, profile
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
