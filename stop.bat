@echo off
REM ============================================================
REM  EwolucJA - gasi wersje lokalna. Postgres ZOSTAJE:
REM  wstaje wolno, a nikomu nie przeszkadza w tle.
REM  Zeby zgasic i jego: pg_ctl -D <data> stop
REM ============================================================
title EwolucJA - stop
echo.
echo  Gasze backend (:3001) i frontend (:3000)...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":3001"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":3000"') do taskkill /F /PID %%a >nul 2>&1

echo  Zrobione. Postgres dziala dalej.
timeout /t 3 /nobreak >nul
exit
