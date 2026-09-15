@echo off
REM ============================================================
REM  EwolucJA - AKTUALIZACJA BUILDA. Jedno klikniecie.
REM
REM  Do czego to jest:
REM  Lokalna gra (start.bat) chodzi na `npm run dev` i widzi zmiany
REM  od razu - tam TEGO SKRYPTU NIE POTRZEBUJESZ. Ten plik jest do
REM  wersji produkcyjnej: `frontend/dist`, czyli to, co jedzie na
REM  Vercela i na ePomost.
REM
REM  Dlaczego dwa kroki, a nie jeden:
REM  Scena 3D NIE JEST czescia builda Vite. Mieszka w `public/` jako
REM  gotowy plik, wiec `npm run build` tylko go KOPIUJE - nie buduje.
REM  Jesli zmienily sie zrodla w `scena-3d-src/`, a nikt nie odpalil
REM  ich builda, Vite w dobrej wierze skopiuje do dist STARA scene.
REM  Dokladnie to sie stalo 15.09.2026 i kosztowalo pol godziny
REM  szukania winy w przegladarce.
REM ============================================================
title EwolucJA - aktualizacja builda
cd /d "%~dp0\frontend"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  BLAD: nie znalazlem Node.js w PATH.
  echo.
  pause
  exit /b 1
)

echo.
echo  ============================================================
echo   [1/3] Scena 3D  (scena-3d-src  --^>  public/scena-3d)
echo  ============================================================
call node scena-3d-src\build.mjs
if errorlevel 1 (
  echo.
  echo  BLAD przy budowaniu sceny. Dalej nie ide - dist zostalby ze stara scena.
  echo.
  pause
  exit /b 1
)

echo.
echo  ============================================================
echo   [2/3] Frontend  (vite build  --^>  dist)
echo  ============================================================
call npm run build
if errorlevel 1 (
  echo.
  echo  BLAD przy budowaniu frontendu.
  echo.
  pause
  exit /b 1
)

echo.
echo  ============================================================
echo   [3/3] Kontrola: czy dist ma TE SAMA scene, co public
echo  ============================================================
REM  Suma kontrolna zamiast wiary. Jesli te dwie linie sie roznia,
REM  w dist siedzi inna scena niz zbudowana przed chwila.
for /f "skip=1 tokens=* delims=" %%h in ('certutil -hashfile "public\scena-3d\scena3d.esm.js" MD5 ^| findstr /v ":"') do (
  if not defined H_PUB set "H_PUB=%%h"
)
for /f "skip=1 tokens=* delims=" %%h in ('certutil -hashfile "dist\scena-3d\scena3d.esm.js" MD5 ^| findstr /v ":"') do (
  if not defined H_DIST set "H_DIST=%%h"
)
echo   public : %H_PUB%
echo   dist   : %H_DIST%
if /i "%H_PUB%"=="%H_DIST%" (
  echo   ZGADZA SIE.
) else (
  echo   ROZNE - dist ma inna scene niz public. Odpal skrypt jeszcze raz.
)

echo.
echo  ------------------------------------------------------------
echo   Gotowe. Build lezy w: frontend\dist
echo.
echo   PAMIETAJ: po zmianie w public\scena-3d\ podbij WERSJA_SCENY
echo   w src\components\Scena3D.jsx - bez tego przegladarka poda
echo   scene ze swojego cache, mimo ze plik na dysku jest nowy.
echo  ------------------------------------------------------------
echo.

REM  Skrot na pulpicie - zakladany raz, przy pierwszym uruchomieniu.
set "SKROT=%USERPROFILE%\Desktop\EwolucJA - aktualizuj build.lnk"
if not exist "%SKROT%" (
  powershell -NoProfile -Command ^
    "$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%SKROT%');" ^
    "$s.TargetPath='%~f0';" ^
    "$s.WorkingDirectory='%~dp0';" ^
    "$s.IconLocation='%~dp0ewolucja.ico';" ^
    "$s.Description='Przebudowuje scene 3D i frontend do frontend\dist';" ^
    "$s.Save()" >nul 2>nul
  if exist "%SKROT%" echo   Zalozylem skrot na pulpicie: "EwolucJA - aktualizuj build"
)

pause
