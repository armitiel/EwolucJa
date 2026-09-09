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

rem ---- 4. proba budowania DOKLADNIE tak, jak zrobi to Vercel ---------------
rem Po co: Vercel klonuje repozytorium, wiec widzi TYLKO pliki zapisane w
rem gicie. Plik lezacy na dysku, ale nieskomitowany (te z listy "NOWE PLIKI"
rem wyzej), nie istnieje dla niego wcale. Zdarzylo sie juz dwa razy, ze
rem komponent szedl w imporcie, a sam plik zostawal na dysku: lokalnie
rem wszystko dzialalo, a deploy padal na "Could not resolve".
rem Dlatego rozpakowujemy `git archive HEAD` (czyli czysta zawartosc gita)
rem do katalogu tymczasowego, podpinamy istniejace node_modules zlaczem
rem katalogow i budujemy tam. Trwa to kilkanascie sekund i wylapuje ten blad
rem ZANIM cokolwiek pojdzie na serwer.
set SPRAWDZ=%TEMP%\ewol-build
if exist "!SPRAWDZ!\frontend\node_modules" rmdir "!SPRAWDZ!\frontend\node_modules" >nul 2>&1
if exist "!SPRAWDZ!" rmdir /s /q "!SPRAWDZ!" >nul 2>&1

if not exist "%cd%\frontend\node_modules" (
  echo  [UWAGA] Brak frontend\node_modules - pomijam probe budowania.
  goto :po_probie
)

echo  Probuje zbudowac projekt tak, jak zrobi to Vercel...
mkdir "!SPRAWDZ!" >nul 2>&1
git archive -o "!SPRAWDZ!\repo.tar" HEAD
if errorlevel 1 (
  echo  [UWAGA] Nie udalo sie zrobic archiwum gita - pomijam probe.
  goto :po_probie
)
tar -x -f "!SPRAWDZ!\repo.tar" -C "!SPRAWDZ!"
if errorlevel 1 (
  echo  [UWAGA] Nie udalo sie rozpakowac archiwum - pomijam probe.
  goto :po_probie
)
rem Bez ">nul 2>&1": jesli zlacze sie nie uda, MUSIMY to zobaczyc. Gdy go nie ma,
rem `npx` nie znajduje vite lokalnie, probuje go SCIAGNAC i pyta "Ok to proceed?".
rem To pytanie leci do build.log razem z reszta wyjscia, wiec okno stoi puste
rem i czeka na klawisz, ktorego nikt nie widzi. Tak wyglada "skrypt sie zawiesil".
mklink /J "!SPRAWDZ!\frontend\node_modules" "%cd%\frontend\node_modules"
if not exist "!SPRAWDZ!\frontend\node_modules\.bin\vite.cmd" (
  echo  [UWAGA] Nie widze vite w podpietym node_modules - pomijam probe budowania.
  goto :po_probie
)

pushd "!SPRAWDZ!\frontend"
rem Vite wolany WPROST, a nie przez `npx`: npx przy braku pakietu siega do sieci
rem i pyta o zgode, a tu nie ma komu odpowiedziec.
call "!SPRAWDZ!\frontend\node_modules\.bin\vite.cmd" build > "!SPRAWDZ!\build.log" 2>&1
set BLAD_BUDOWANIA=!errorlevel!
popd

if not "!BLAD_BUDOWANIA!"=="0" (
  echo.
  echo  ================================================
  echo    [STOP] Projekt NIE buduje sie z tego, co jest w gicie.
  echo  ================================================
  echo.
  findstr /i /c:"Could not resolve" /c:"error" "!SPRAWDZ!\build.log"
  echo.
  echo  Najczestsza przyczyna: plik jest na dysku, ale nie zostal dodany
  echo  do gita. Sprawdz liste "NOWE PLIKI" wyzej i dopisz brakujacy:
  echo      git add sciezka/do/pliku
  echo  Potem uruchom ten skrypt jeszcze raz.
  echo.
  echo  Pelny log: !SPRAWDZ!\build.log
  echo  Nic nie zostalo wyslane.
  goto :koniec
)
echo  Build przeszedl. Mozna wysylac.

rem Sprzatanie: najpierw zlacze katalogow, potem reszta - inaczej `rmdir /s`
rem poszloby po zlaczu i skasowalo prawdziwe node_modules.
if exist "!SPRAWDZ!\frontend\node_modules" rmdir "!SPRAWDZ!\frontend\node_modules" >nul 2>&1
rmdir /s /q "!SPRAWDZ!" >nul 2>&1

:po_probie
echo.
set ODP=t
set /p ODP="  Wyslac na git? (t/n, Enter = tak): "
if /i not "!ODP!"=="t" (
  echo  Anulowane. Commity zostaja lokalnie - mozesz wyslac pozniej.
  goto :koniec
)

echo.
echo  Wysylam na origin/!GALAZ! ...
rem PIERWSZA PROBA JEST NIEINTERAKTYWNA - i to jest cala poprawka na "wisi bez
rem komunikatu". W Menedzerze poswiadczen Windows lezy kilka kont GitHub, wiec
rem Git Credential Manager otwiera okno "wybierz konto". Gdy to okno wyjdzie za
rem innymi oknami albo w ogole sie nie pokaze, push stoi w nieskonczonosc, a na
rem ekranie nie ma ANI JEDNEGO napisu. Z ponizszymi przelacznikami git zwraca
rem blad od razu - i dopiero wtedy swiadomie pytamy o logowanie.
set GIT_TERMINAL_PROMPT=0
git -c credential.interactive=never push origin !GALAZ!
set BLAD_PUSH=!errorlevel!
set GIT_TERMINAL_PROMPT=
if not "!BLAD_PUSH!"=="0" (
  echo.
  echo  [UWAGA] Git nie mial gotowego logowania do GitHuba.
  echo  Zaraz MOZE otworzyc sie okno logowania. Jesli go nie widzisz -
  echo  sprawdz pasek zadan, okno nalezy do "git-credential-manager".
  echo.
  echo  Jesli to sie powtarza, ustaw raz na zawsze, ktore konto brac:
  echo      git config --global credential.https://github.com.username armitiel
  echo.
  git push origin !GALAZ!
  if errorlevel 1 goto :blad
)

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
