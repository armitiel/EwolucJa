@echo off
echo Starting EwolucJA...
echo.

start "EwolucJA Backend" cmd /k "cd /d C:\Users\DELL\EwolucJA\backend && npm run dev"
start "EwolucJA Frontend" cmd /k "cd /d C:\Users\DELL\EwolucJA\frontend && npm run dev"

echo Backend and Frontend started in separate windows.
