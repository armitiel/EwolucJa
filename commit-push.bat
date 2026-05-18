@echo off
REM Add + commit + push: fix zwoj.svg - usuniety DOCTYPE Adobe Illustrator (renderowal sie jako tekst "]>" w UI)
cd /d "%~dp0"

set GIT="C:\Program Files\Git\cmd\git.exe"
if not exist %GIT% set GIT="C:\Program Files\Git\bin\git.exe"
if not exist %GIT% set GIT=git

echo === [1/3] git add zwoj.svg ===
%GIT% add frontend/src/assets/zwoj.svg
echo.

echo === [2/3] git commit ===
%GIT% commit -m "fix(MissionScroll): wyczyszczony zwoj.svg z DOCTYPE Adobe Illustrator - nie renderuje juz ]> jako tekst wpychajacy zwoj w dol kontenera"
echo.

echo === [3/3] git push origin v2-postgres-vercel ===
%GIT% push origin v2-postgres-vercel
set PUSH_CODE=%ERRORLEVEL%
echo.

if %PUSH_CODE% NEQ 0 (
  echo [BLAD] push nie powiodl sie ^(kod %PUSH_CODE%^).
) else (
  echo [OK] commit + push gotowy.
)

echo.
pause
