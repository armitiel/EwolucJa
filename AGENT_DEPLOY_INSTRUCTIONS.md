# Instrukcja dla agentów — deploy w projekcie EwolucJA

Dokument opisuje **jakie narzędzia i triki** pozwalają agentowi w sandboxie skutecznie modyfikować pliki, commitować i deployować na produkcję `ewolucja-azure.vercel.app`.

---

## TL;DR — szybki workflow

```
1. Edit/Write na plikach (Windows path: C:\Users\DELL\EwolucJA\...)
2. node --check (jeśli backend) lub powershell -Command "Get-Content" (verify, że plik kompletny)
3. Desktop Commander start_process + interact_with_process → cmd → git add + commit + push
4. Push na branch v2-postgres-vercel = AUTO-DEPLOY produkcji w ~60s
   (production branch zmieniony z main na v2-postgres-vercel)
```

Bez ręcznego `vercel promote` — Vercel automatycznie deployuje każdy push na `v2-postgres-vercel`.

---

## Środowiska

Agent ma dostęp do DWÓCH środowisk wykonania:

### 1. Windows (preferowane do git / Vercel CLI / npm)

**Tool:** `mcp__Desktop_Commander__start_process` + `interact_with_process`

```js
// Otwórz shell
start_process({ command: "cmd", shell: "cmd", timeout_ms: 5000 })

// Wykonaj
interact_with_process({
  pid: <pid>,
  input: "cd /d C:\\Users\\DELL\\EwolucJA && git status",
  timeout_ms: 10000
})
```

**Dlaczego Windows do git:**
- Git ma skonfigurowany credential helper z tokenem GitHub
- `git push` działa bez pytania o hasło
- Vercel CLI zalogowany lokalnie (`C:\Users\DELL\AppData\Roaming\com.vercel.cli\Data\auth.json`)

**Pitfalle:**
- Każdy `start_process` to nowa sesja — `cd` nie utrzymuje się między wywołaniami. Zawsze używaj `cd /d` + `&&`
- `findstr` zamiast `grep`. Pipe `|` musi być w cudzysłowie czasem
- `del /Q .git\HEAD.lock 2>NUL` — bo pliki lock potrafią się zacinać
- Polskie znaki w komentarzach git commit mogą się rozsypać → używaj bez polskich znaków w `-m`
- Niektóre długie komendy się wieszają (np. `npm install`) — użyj `start /B` w tle z logiem

### 2. Linux bash (do filesystem manipulations + bulk find/replace)

**Tool:** `mcp__workspace__bash`

```bash
# Ścieżki na Linux: /sessions/cool-gifted-allen/mnt/EwolucJA/...
# (Windows C:\Users\DELL\EwolucJA == Linux /sessions/.../mnt/EwolucJA)
```

**Dobre do:**
- `sed -i 's/foo/bar/g'` — globalne podmiany w wielu plikach
- `grep -rn "pattern"` — szybkie wyszukiwanie
- `find . -name "*.jsx"` — listing
- `cat > file << 'EOF' ... EOF` — pisanie całego pliku
- `git show HEAD:path/to/file` — odczyt z historii

**Pitfalle (KRYTYCZNE!):**
- ❌ `git push` z Linuxa NIE DZIAŁA — credentials zablokowane przez AppContainer (`fatal: could not read Username for 'https://github.com'`)
- ❌ `rm` na plikach w mount często `Operation not permitted`
- ❌ **Mount sync delay** — po Edit/Write z Windowsa Linux mount może widzieć stary stan przez kilka sekund. Sprawdź `wc -l` przed commitowaniem!
- ❌ npm install w workspace bash często wisi (Linux side nie ma node_modules)
- ❌ `nohup ... &` po `disown` może nie skończyć — log może być pusty mimo że proces działa
- Workspace boot timeout: pierwsza komenda po nieaktywności potrzebuje retry

---

## Krytyczne pułapki

### Mount sync — pliki "ucinają się" same

**Objaw:** Edit zwraca sukces, plik na Windowsie wygląda dobrze, ale po commicie Linux side i Vercel zobaczą uciętą wersję.

**Wykrywanie:**
```bash
# Linux check
wc -l /sessions/cool-gifted-allen/mnt/EwolucJA/frontend/src/pages/Foo.jsx
tail -3 /sessions/cool-gifted-allen/mnt/EwolucJA/frontend/src/pages/Foo.jsx
```

Lub w Windows:
```cmd
powershell -NoProfile -Command "Get-Content path\to\file.jsx | Measure-Object -Line"
```

**Naprawa:** Przepisz plik via bash heredoc — bezpośrednie I/O omija mount sync:
```bash
cat > /sessions/cool-gifted-allen/mnt/EwolucJA/frontend/src/pages/Foo.jsx << 'EOF'
... pełna zawartość pliku ...
EOF
```

**Prewencja:**
- Po większych Edit/Write zrób `git show HEAD:path | wc -l` żeby sprawdzić co git widzi vs co lokalnie
- Jeśli różnica → przepisz plik bash heredoc PRZED commitem
- Nie używaj sed-a na wielu plikach JSX naraz (truncuje pliki przez race condition)

### Git locks

```cmd
del /Q .git\HEAD.lock 2>NUL & del /Q .git\index.lock 2>NUL
```

Zawsze przed commitem jeśli wcześniej coś wisiało.

### Trailing \r\n w env vars

`vercel env add` przez pipe (`echo value | vercel env add`) dodaje `\r\n` na końcu. Rozwiązanie:
```cmd
<NUL set /p="VALUE_BEZ_NEWLINE" | vercel env add KEY production
```

Po naszej stronie też defensywnie: `.trim()` na wszystkim co czytamy z `process.env.*`.

---

## Vercel — workflow

### Production branch (KLUCZOWE)

**Production branch = `v2-postgres-vercel`** (zmieniony przez REST API z domyślnego `main`).

Każdy push na tę gałąź → AUTO-DEPLOY na produkcję `ewolucja-azure.vercel.app`.

### Zmiana production branch (jeśli kiedyś trzeba)

CLI nie ma tego polecenia. Użyj REST API:

```cmd
curl -s -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID/branch?teamId=TEAM_ID" ^
  -H "Authorization: Bearer VERCEL_TOKEN" ^
  -H "Content-Type: application/json" ^
  --data-raw "{\"branch\":\"v2-postgres-vercel\"}"
```

Token: `C:\Users\DELL\AppData\Roaming\com.vercel.cli\Data\auth.json` → pole `token`.

Project ID: `prj_EGXYVEd3ugHn8h0MnahaDuCjjVFL`
Team ID: `team_KAUZlLAHzqVYHny5BARcJdh4`
(można też dostać przez `vercel project ls` + `vercel inspect`)

### Status deploya

```cmd
vercel ls --scope armitiels-projects 2>&1 | findstr /R /C:"^  [0-9]m\|^  [0-9]s"
```

Najnowszy preview powinien być **Ready** w ~60s po pushu. Production aliasuje do najnowszego `Ready Production` deploya.

### Logi runtime (jeśli 500)

```cmd
vercel logs https://ewolucja-azure.vercel.app --scope armitiels-projects 2>&1
```

Otrzymujesz live tail. Wywołaj API w drugim shellu by zobaczyć log.

### Promote ręczny (rzadko potrzebne, bo auto-deploy)

```cmd
echo y | vercel promote https://ewolucja-XXX-armitiels-projects.vercel.app --scope armitiels-projects --yes
```

---

## Workflow plików — Edit vs Write vs bash heredoc

| Rozmiar zmiany | Tool | Notatki |
|---|---|---|
| Drobna edycja (1-3 linie) | `Edit` | Najbezpieczniejsze |
| Średnia (5-30 linii nowych) | `Edit` z dużym `old_string` + `new_string` | Sprawdzaj `wc -l` po |
| Duża rewriting (>50 linii) lub nowy plik | `Write` + sprawdzenie `git show HEAD:path \| wc -l` | Po commit, sprawdź na Linuxie |
| Krytyczny plik (config.js, package.json) | `bash heredoc` | Omija mount sync |
| Bulk find/replace 2-3 pliki | `Edit replace_all` | OK |
| Bulk find/replace 5+ plików | NIE → ryzyko truncacji | Lepiej osobno każdy |

---

## Sprawdzanie syntax

### JS (non-JSX)
```cmd
node --check path\to\file.js
```

### JSX (Node nie obsługuje)
Brak natywnego — sprawdzaj na deploy. Albo:
- Lokalnie `npm run build` (jeśli nie wisi)
- Lub commit i poczekaj na Vercel build (jeśli błąd, log pokaże linię)

### Sprawdzanie czy plik nie ucięty (heuristic)
```bash
# Linux
tail -1 path/to/file | grep -E '[}\)\;]$'
```
```cmd
:: Windows
powershell -NoProfile -Command "(Get-Content path -Tail 1).Trim()"
```

Brak `}`, `)` lub `;` na końcu = podejrzenie ucięcia.

---

## Workflow dla typowej zmiany

```
1. Edit file na Windows path
2. Verify: bash → wc -l + tail -3 + grep "specific_change"
3. Jeśli plik ucięty → cat > path << 'EOF' z pełną zawartością
4. Otwórz cmd shell (Desktop Commander)
5. cd /d C:\Users\DELL\EwolucJA && del /Q .git\HEAD.lock 2>NUL & del /Q .git\index.lock 2>NUL
6. git add <pliki>
7. git commit -m "krotka wiadomosc bez polskich znakow w cudzyslowach"
8. git push origin v2-postgres-vercel
9. Wait ~60s → Vercel auto-deploy
10. curl -s https://ewolucja-azure.vercel.app/api/health → 200 = OK
```

---

## Środowisko produkcji — referencja

- **Frontend:** Vite + React 18, deployed to Vercel
- **Backend:** Express jako Vercel Function (`api/index.js` → `backend/src/server.js`)
- **DB:** Neon Postgres (env: `POSTGRES_URL`, etc.)
- **TTS:** ElevenLabs (env: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL`)
- **Narrative:** Claude API (env: `ANTHROPIC_API_KEY`)
- **Production URL:** `https://ewolucja-azure.vercel.app`
- **Production branch:** `v2-postgres-vercel`
- **Repo:** `github.com/armitiel/EwolucJa`

---

## Co ZAWSZE robić przed pushem

1. ✅ `wc -l` na zmienionych plikach (porównaj z `git show HEAD:path | wc -l`)
2. ✅ `tail -3` żeby zobaczyć czy plik kończy się sensownie (`}`, `;`, `</file>` etc.)
3. ✅ Dla JS — `node --check` jeśli nie JSX
4. ✅ `del /Q .git\HEAD.lock 2>NUL` przed commitem (na wypadek)
5. ✅ Commit message bez polskich znaków w `-m "..."` (escape issues)

## Co NIGDY nie robić

1. ❌ `git push` z Linux bash — zwraca `fatal: could not read Username`
2. ❌ `sed -i` na wielu plikach JSX naraz — truncuje
3. ❌ `npm install` w workspace bash bez `&` i logfile → wisi
4. ❌ Commit message z polskimi znakami w double-quotes z escaped quotes → łamie składnię cmd
5. ❌ Zaufać że Edit zsynchronizował mount — zawsze sprawdź `wc -l` przed commitem
