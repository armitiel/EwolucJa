@echo off
chcp 65001 >nul
title EwolucJA - wyslij zmiany na git
cd /d "%~dp0"
setlocal enabledelayedexpansion

echo.
echo  ================================================
echo    EwolucJA  -  wysylka zmian na git
echo  ================================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo  [BLAD] To nie jest repozytorium git: %cd%
  goto :koniec
)

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set GALAZ=%%b
echo  Galaz: !GALAZ!
echo.

rem ---- 1. co sie zmienilo -------------------------------------------------
rem 2>nul zdejmuje ostrzezenia "LF will be replaced by CRLF" - to normalne
rem zachowanie gita na Windowsie, a nie blad, i tylko zasmieca ekran.
echo  --- ZMIENIONE PLIKI (juz sledzone przez git) -----------------
git diff --name-status 2>nul
git diff --cached --name-status 2>nul
echo.

set ZMIANY=0
for /f %%x in ('git diff --name-only 2^>nul ^| find /c /v ""') do set ZMIANY=%%x
set ZMIANY_S=0
for /f %%x in ('git diff --cached --name-only 2^>nul ^| find /c /v ""') do set ZMIANY_S=%%x
set /a RAZEM=!ZMIANY!+!ZMIANY_S!

echo  --- NOWE PLIKI (git ich jeszcze nie zna) ---------------------
git ls-files --others --exclude-standard
echo.
echo  Uwaga: nowe pliki NIE ida automatycznie. Jesli ktorys ma pojsc,
echo  dopisz go recznie: git add sciezka/do/pliku
echo.

if "!RAZEM!"=="0" (
  echo  Nic do wyslania - brak zmian w sledzonych plikach.
  goto :pchnij_pytanie
)

rem ---- 2. bezpiecznik: zadnych sekretow ------------------------------------
rem Repo ma niesledzone kopie backend/.env.bak-* i .gitignore ich NIE lapie.
rem `git add -u` dodaje tylko pliki juz sledzone, wiec kopie .env sie nie zalapia,
rem ale i tak sprawdzamy - jesli cokolwiek z .env trafilo do indeksu, stop.
git diff --cached --name-only 2>nul > "%TEMP%\ewol-idx.txt"
git diff --name-only 2>nul >> "%TEMP%\ewol-idx.txt"
findstr /i /c:".env" "%TEMP%\ewol-idx.txt" >nul 2>&1
if not errorlevel 1 (
  echo.
  echo  [STOP] Wsrod zmian jest plik z ".env" w nazwie.
  echo  To moze byc plik z kluczami. Nic nie wysylam - sprawdz to recznie.
  del "%TEMP%\ewol-idx.txt" >nul 2>&1
  goto :koniec
)
del "%TEMP%\ewol-idx.txt" >nul 2>&1

rem ---- 3. potwierdzenie + opis zmiany --------------------------------------
echo  Zmienionych plikow: !RAZEM!
echo.
echo  UWAGA: pojda WSZYSTKIE zmienione pliki z listy powyzej.
echo  Jesli cos jest w trakcie roboty i ma jeszcze zostac - przerwij (n).
echo.
set ZGODA=t
set /p ZGODA="  Zapisac te zmiany? (t/n, Enter = tak): "
if /i not "!ZGODA!"=="t" (
  echo  Anulowane. Nic nie zostalo zapisane.
  goto :koniec
)
echo.
set OPIS=
set /p OPIS="  Opisz zmiane (Enter = opis automatyczny): "
if "!OPIS!"=="" (
  for /f "tokens=1-3 delims=." %%d in ("%date%") do set DZIS=%%d.%%e.%%f
  set OPIS=zmiany z !DZIS! (!RAZEM! plikow^)
)

echo.
echo  Dodaje zmienione pliki...
git add -u
if errorlevel 1 goto :blad

echo  Zapisuje commit: !OPIS!
git commit -m "!OPIS!"
if errorlevel 1 (
  echo  [INFO] Commit nie powstal - byc moze nie bylo czego zapisac.
)

:pchnij_pytanie
echo.
set DO_WYSLANIA=0
for /f %%x in ('git log --oneline origin/!GALAZ!..HEAD 2^>nul ^| find /c /v ""') do set DO_WYSLANIA=%%x
echo  Commitow czekajacych na wyslanie: !DO_WYSLANIA!
if "!DO_WYSLANIA!"=="0" (
  echo  Wszystko jest juz na serwerze. Nic nie wysylam.
  goto :koniec
)
git log --oneline origin/!GALAZ!..HEAD
echo.
set ODP=t
set /p ODP="  Wyslac na git? (t/n, Enter = tak): "
if /i not "!ODP!"=="t" (
  echo  Anulowane. Commity zostaja lokalnie - mozesz wyslac pozniej.
  goto :koniec
)

echo.
echo  Wysylam na origin/!GALAZ! ...
git push origin !GALAZ!
if errorlevel 1 goto :blad

echo.
echo  ================================================
echo    GOTOWE. Zmiany sa na git.
echo    Vercel zaraz odswiezy strone.
echo  ================================================
goto :koniec

:blad
echo.
echo  [BLAD] Cos poszlo nie tak - przeczytaj komunikat wyzej.
echo  Nic nie zostalo skasowane; pliki sa bezpieczne.

:koniec
echo.
pause
endlocal
