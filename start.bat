@echo off
REM ============================================================
REM  EwolucJA - start wersji lokalnej. JEDNO klikniecie.
REM
REM  Wersja lokalna to TRZY procesy, nie dwa. O Postgresa najlatwiej
REM  zapomniec, a bez niego backend nie wchodzi w LISTENING i gra stoi
REM  na bialym ekranie - w logu leci wtedy ECONNREFUSED 127.0.0.1:5432.
REM  Dlatego baza jest tu krokiem pierwszym, a nie zalozeniem.
REM ============================================================
title EwolucJA - start lokalny
cd /d C:\Users\DELL\EwolucJA
if not exist tmp mkdir tmp

set "PGBIN=C:\Users\DELL\scoop\apps\postgresql\current\bin"
set "PGDATA_DIR=C:\Users\DELL\scoop\persist\postgresql\data"

echo.
echo  [1/3] Postgres :5432
netstat -ano | findstr "LISTENING" | findstr ":5432" >nul
if errorlevel 1 (
  REM -w = czekaj, az baza naprawde przyjmuje polaczenia. Bez tego backend
  REM startuje szybciej niz Postgres i pierwsze zapytania i tak padaja.
  "%PGBIN%\pg_ctl.exe" -D "%PGDATA_DIR%" -l "%CD%\tmp\pg.log" -w start
  if errorlevel 1 (
    echo        NIE UDALO SIE. Zajrzyj do tmp\pg.log
    pause
    exit /b 1
  )
) else (
  echo        juz dziala
)

REM Baza `ewolucja` moze nie istniec po swiezej instalacji Postgresa.
REM Schemat (15 tabel) backend tworzy sobie sam, wiec wystarczy pusta baza.
"%PGBIN%\psql.exe" -U postgres -h 127.0.0.1 -lqt 2>nul | findstr /C:"ewolucja" >nul
if errorlevel 1 (
  echo        tworze baze ewolucja...
  "%PGBIN%\createdb.exe" -U postgres -h 127.0.0.1 ewolucja
)

echo  [2/3] Backend :3001
start "EwolucJA Backend" cmd /k "cd /d C:\Users\DELL\EwolucJA\backend && npm run dev"

echo  [3/3] Frontend :3000
start "EwolucJA Frontend" cmd /k "cd /d C:\Users\DELL\EwolucJA\frontend && npm run dev"

echo.
echo  Czekam, az Vite wstanie...
timeout /t 6 /nobreak >nul
start "" http://localhost:3000/swiat

echo.
echo  Gotowe. Gra: http://localhost:3000/swiat
echo  Logi backendu i frontendu masz w dwoch otwartych oknach.
echo  Zamkniecie tego okna NIE gasi serwerow - do tego jest stop.bat.
timeout /t 4 /nobreak >nul
exit
