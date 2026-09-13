@echo off
REM ============================================================
REM  EwolucJA - PLANETA: podglad samej sceny 3D (bez logowania, bez huba).
REM  Uruchamia frontend (Vite :3000), jesli nie dziala, i otwiera
REM  http://localhost:3000/scena-3d/index.html?mapa=w2 (swiat W2 = mapa-w2.json)
REM  Backend ani Postgres nie sa potrzebne - scena czyta tylko mapa.json.
REM ============================================================
title EwolucJA - planeta
cd /d C:\Users\DELL\EwolucJA

netstat -ano | findstr "LISTENING" | findstr ":3000" >nul
if errorlevel 1 (
  echo  Startuje frontend :3000 ...
  start "EwolucJA Frontend" cmd /k "cd /d C:\Users\DELL\EwolucJA\frontend && npm run dev"
  echo  Czekam, az Vite wstanie...
  timeout /t 6 /nobreak >nul
) else (
  echo  Frontend juz dziala.
)

start "" "http://localhost:3000/scena-3d/index.html?mapa=w2&panel=0&postac=fox"
echo.
echo  Planeta W2: http://localhost:3000/scena-3d/index.html?mapa=w2^&panel=0^&postac=fox
echo  Strojenie w adresie: ^&zoom=0.7  ^&kula=11
echo  (Ctrl+Shift+R w przegladarce, gdyby scena wygladala staro)
timeout /t 4 /nobreak >nul
exit
