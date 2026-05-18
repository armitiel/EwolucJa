@echo off
REM ─────────────────────────────────────────────────────────────
REM  EwolucJA — szybki push na origin (branch: v2-postgres-vercel)
REM  Klik 2x = git status + git push. Okno czeka na klawisz na koncu.
REM ─────────────────────────────────────────────────────────────

cd /d "%~dp0"

set GIT="C:\Program Files\Git\cmd\git.exe"
if not exist %GIT% set GIT="C:\Program Files\Git\bin\git.exe"
if not exist %GIT% set GIT=git

echo ============================================================
echo  EwolucJA / push.bat
echo  Katalog: %CD%
echo ============================================================
echo.

echo --- git status ---
%GIT% status --short --branch
echo.

echo --- git log (3 ostatnie) ---
%GIT% log --oneline -3
echo.

echo --- git push origin v2-postgres-vercel ---
%GIT% push origin v2-postgres-vercel
set PUSH_CODE=%ERRORLEVEL%
echo.

if %PUSH_CODE% NEQ 0 (
  echo [BLAD] push nie powiodl sie ^(kod %PUSH_CODE%^).
  echo  - jesli to problem z autoryzacja: otworz Git Credential Manager
  echo  - jesli to konflikt: zrob 'git pull --rebase origin v2-postgres-vercel'
) else (
  echo [OK] push gotowy.
)

echo.
pause
