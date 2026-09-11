---
description: Wypchnij zmiany na produkcję (gałąź v2-postgres-vercel)
---

Użyj subagenta `deploy`.

Przed pushem obowiązkowo:
1. Przeczytaj `AGENT_DEPLOY_INSTRUCTIONS.md`.
2. `git status` i `git diff` **gitem Windows**, nie przez mount — CRLF przez
   mount robi fałszywe „M" i wciąga do commita kilkadziesiąt przypadkowych plików.
3. `node --check` na każdym zmienionym pliku JS/JSX (ucięte pliki to realny
   problem w tym repo).
4. Komunikat commita **bez polskich znaków** albo przez `git commit -F plik`.
5. Push na `v2-postgres-vercel` — NIE na `main`.
6. Potwierdź, że build na Vercelu przeszedł. Nie kończ na „wypchnięte".

$ARGUMENTS
