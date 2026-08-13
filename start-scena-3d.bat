@echo off
REM ------------------------------------------------------------
REM  EwolucJA - lokalny podglad modulu 3D (mapka + postac)
REM  Klik 2x: startuje maly serwer i otwiera przegladarke.
REM ------------------------------------------------------------
cd /d "%~dp0"
where node >/dev/null 2>nul
if errorlevel 1 (
  echo Nie znalazlem Node.js w PATH - zainstaluj Node albo uruchom przez "npm run dev".
  pause
  exit /b 1
)
echo.
echo  Scena:  http://127.0.0.1:5173/scena-3d/?panel=0
echo  Zatrzymanie: zamknij to okno albo Ctrl+C
echo.
node scripts\scena-3d-serwer.mjs frontend\public 5173
pause
