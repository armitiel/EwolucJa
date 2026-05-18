@echo off
REM Naprawa: re-add WorldHub.jsx z hosta (bez null-padding z mount'a),
REM amend commit i force-push na origin/v2-postgres-vercel.

cd /d "%~dp0"

set GIT="C:\Program Files\Git\cmd\git.exe"
if not exist %GIT% set GIT="C:\Program Files\Git\bin\git.exe"
if not exist %GIT% set GIT=git

echo === [1/4] git add WorldHub.jsx (czysty z hosta) ===
%GIT% add frontend/src/pages/WorldHub.jsx
echo.

echo === [2/4] git status po add ===
%GIT% status --short
echo.

echo === [3/4] git commit --amend --no-edit ===
%GIT% commit --amend --no-edit
echo.

echo === [4/4] git push --force-with-lease origin v2-postgres-vercel ===
%GIT% push --force-with-lease origin v2-postgres-vercel
set PUSH_CODE=%ERRORLEVEL%
echo.

if %PUSH_CODE% NEQ 0 (
  echo [BLAD] push nie powiodl sie ^(kod %PUSH_CODE%^).
) else (
  echo [OK] amend + force-push gotowy.
)

echo.
pause
