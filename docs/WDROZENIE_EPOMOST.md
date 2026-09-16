# Wdrożenie na ePomost — jak wychodzi nowa wersja

Od 15.09.2026 gra żyje w DWÓCH miejscach naraz. Ten plik opisuje drugie
z nich. Bez sekretów: klucze i connection stringi są tylko na serwerze
i w Neonie.

| | Vercel | ePomost |
|---|---|---|
| adres | https://ewolucja-azure.vercel.app | https://sec.naszpomost.pl (DEV, za Basic Auth „Przygoda DEV") |
| dla kogo | wersja samodzielna | „Przygoda on Max" w Portalu naszpomost.pl (iframe) |
| logowanie | kod ucznia / Mentor | kontem Portalu (PKCE, `backend/src/api/epomost.js`) + konto testowe na DEV |
| baza | Neon `neon-lime-kite` (produkcja) | Neon `ewolucja-dev` — **osobna, nie łączyć** |
| jak wydajemy | `git push` na `v2-postgres-vercel` → auto-deploy | **ręcznie**: build → `scripts/deploy-dev.sh` → (backend) scp + restart |
| gdzie opisane | `AGENT_DEPLOY_INSTRUCTIONS.md` | ten plik |

## Krok po kroku — front (najczęstszy przypadek)

Uruchamiać na maszynie autora, w Git Bash (skrypt używa `ssh.exe`/`scp.exe`
z Git for Windows i klucza `~/.ssh/id_ed25519`).

1. Upewnij się, że zmiana jest zacommitowana (żeby Vercel i ePomost dostały
   to samo) i że `WERSJA_SCENY` jest podbita, jeśli ruszałeś scenę 3D.
2. Zbuduj front — **nie** `npm run build` (na tej maszynie potrafi wyjść
   z kodem 1 bez komunikatu), tylko:
   ```
   cd frontend
   node ./node_modules/vite/bin/vite.js build
   ```
   Wynik ląduje w `frontend/dist/`.
3. Wyślij:
   ```
   sh scripts/deploy-dev.sh
   ```
   Skrypt pakuje `dist` do `tmp/dist.tgz`, wysyła na VPS
   (`adventure-dev@54.37.135.229`), robi backup starego `public`
   (`/srv/adventure/dev/data/public-backup-<data>.tgz`) i podmienia
   `/srv/adventure/dev/public`. Zmiana jest widoczna od razu — nginx
   serwuje ten katalog statycznie, nic nie trzeba restartować.
4. Sprawdź: `https://sec.naszpomost.pl` (Basic Auth), w konsoli brak błędów,
   `https://sec.naszpomost.pl/api/health` odpowiada.

## Krok po kroku — backend (gdy zmieniło się coś w `backend/`)

1. Wgraj źródła na VPS do `/srv/adventure/dev/source/backend` (scp/rsync
   katalogu `backend/`, bez `node_modules` i bez `.env`; jeśli doszły
   zależności — `npm install` na serwerze, Node jest w
   `~/.local/node-v20.17.0-linux-x64`).
2. Zrestartuj usługę (użytkownik `adventure-dev`, `systemd --user`,
   Linger włączony — przeżywa rozłączenie):
   ```
   XDG_RUNTIME_DIR=/run/user/$(id -u) systemctl --user restart ewolucja-dev.service
   XDG_RUNTIME_DIR=/run/user/$(id -u) systemctl --user status ewolucja-dev.service
   ```
3. Backend słucha na `127.0.0.1:4310`; nginx kieruje tam `/api/*`.
   Zmienne środowiskowe czyta z `/srv/adventure/dev/data/backend.env`
   (baza) i `epomost-sdk.env` (klucz SDK) — **nie kopiować ich do repo**.
4. Schemat bazy zakłada się sam przy starcie (`initDatabase()` →
   `ensureSchema()`, `CREATE TABLE IF NOT EXISTS`), więc nowa tabela nie
   wymaga ręcznej migracji na DEV.

## Rzeczy, które trzeba wiedzieć, pisząc kod pod ePomost

- **Środowisko poznaje się po `EDU_EXTERNAL_APP_ENV`, nie po `NODE_ENV`** —
  na serwerze DEV `NODE_ENV=production` bywa ustawione (tryb Express).
  Konto testowe (`POST /api/epomost/dev-login`) jest włączone tylko poza
  produkcją ePomost (`EDU_TEST_LOGIN` nadpisuje).
- SDK Portalu (`https://dev-games-edu.naszpomost.pl/_sdk/eduportal.js`)
  ładujemy dynamicznym importem w runtime — **nie bundlować, nie forkować**.
- Tożsamość: Portal daje `subject` (stały klucz konta) → tabela
  `epomost_identities` mapuje go na naszego gracza; sesja to nagłówek
  `X-Adventure-Session`, a każdy prywatny odczyt robi świeży `introspect`.
- Prawdziwe konta Portalu da się sprawdzić dopiero, gdy operator ePomost
  włączy przycisk „Przygoda" w ich DEV Portalu (iframe). Po naszej stronie
  wszystko jest gotowe; do tego czasu testujemy kontem testowym.
- Produkcyjne logowanie ePomost jest dziś wyłączone; DEV paruje tylko
  z DEV/Preview Portalem.

## Co jeszcze nie jest ustalone (do domknięcia z ePomost)

- Jak będzie wyglądać wydanie PRODUKCYJNE w Portalu (osobny VPS/katalog?
  kto podmienia? czy przez ich CI?). Na razie wszystko powyżej dotyczy DEV.
- Aktualizacja backendu jest ręczna i bez skryptu — warto dopisać
  `scripts/deploy-dev-backend.sh` po pierwszym udanym przejściu.
- `tmp/deploy-dev.sh` był pierwotnie w `tmp/` (katalog logu Postgresa) —
  kopia żyje w `scripts/deploy-dev.sh`; z niej korzystamy.
