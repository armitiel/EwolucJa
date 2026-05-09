#Requires -Version 5.0
<#
  push-v2-branch.ps1 — finalizuje commit + push gałęzi v2-hybrydowy RPG.
  Użycie:
    1. Otwórz PowerShell w folderze C:\Users\DELL\EwolucJA
    2. Uruchom: .\push-v2-branch.ps1
    (Jeżeli system blokuje skrypt: Set-ExecutionPolicy -Scope Process Bypass)
#>

$ErrorActionPreference = "Stop"
Set-Location -Path "C:\Users\DELL\EwolucJA"

Write-Host "→ Sprzątam lock file (jeśli został po sandboxie)..." -ForegroundColor Cyan
if (Test-Path ".git\index.lock") {
    Remove-Item ".git\index.lock" -Force
    Write-Host "  Usunięto .git\index.lock" -ForegroundColor Green
}

Write-Host "→ Sprawdzam aktualny branch..." -ForegroundColor Cyan
$current = git branch --show-current
Write-Host "  Jesteś na: $current" -ForegroundColor Green

if ($current -ne "v2-hybrid-rpg") {
    Write-Host "→ Przełączam na v2-hybrid-rpg..." -ForegroundColor Cyan
    git checkout v2-hybrid-rpg
}

Write-Host "→ Stage wszystkich zmian (na wypadek niedokończonego git add)..." -ForegroundColor Cyan
git add -A

Write-Host "→ Wykonuję commit..." -ForegroundColor Cyan
$msg = @"
feat: V2 hybrydowy RPG — archetyp, cykl tygodniowy, Game Master, dev tools

ARCHITEKTURA (zgodnie z V2 koncepcją):
- 1 archetyp na MVP (Tropiciel Tajemnic / DT) zamiast 6 dynamicznych awatarów
- Profil przypisywany natychmiast po quizie wstępnym (5 pytań)
- Cykl tygodniowy: rolling start od dnia rejestracji, deadline w piątek
- Game Master: jedna persona widziana przez dziecko, wiele kont dorosłych
  (rodzic + nauczyciel) podpiętych przez kody parowania

BACKEND:
- db.js: 5 nowych tabel (cycles, missions, gm_accounts, gm_pairings, pairing_codes)
  + migracja in-place kolumn na players (archetype, current_cycle_id, backpack, ...)
- api/onboarding.js: GET /quiz, POST /submit, GET /quiz-debug (dev)
- api/cycles.js: cykle tygodniowe + biblioteka 5 misji seed dla DT
- api/gm.js: rejestracja Mentora, kody parowania, weryfikacja misji
- ttsService.js: dodany glos 'mentor' (osobny voice ID dla rodzica/nauczyciela)
- .env.example: udokumentowane ELEVENLABS_API_KEY + voice IDs

FRONTEND:
- main.jsx: react-router-dom z 8 trasami (V1 zachowane na /play)
- pages/Landing.jsx: wybor sciezki dziecko/Mentor
- pages/Onboarding.jsx: quiz + reveal archetypu (z TTS)
- pages/WorldHub.jsx: hub spojnego swiata (cykl, misja, plecak, TTS)
- pages/MissionView.jsx: szczegoly misji + submit dowodu (TTS)
- pages/InviteGM.jsx: generowanie kodu parowania
- pages/GMPanel.jsx: panel weryfikacji misji dla Mentora
- pages/DevPanel.jsx: inspektor quizu + dump stanu + skroty
- components/DevTools.jsx: plywajaca pinetka (logout, wipe, /dev)
- services/ttsPlayer.js: globalny auto-unlock na pierwszy gest (fix po refreshu)
- config.js: definicje 6 archetypow + helper countdown do piatku

AGENTS:
- system_prompt.txt: przepisany pod V2 (jeden swiat, generator misji, Mentor)
- schemas: player_profile.json rozszerzony, dodane weekly_mission.json + gm_account.json

NOTKA: Stary App.jsx zachowany na /play jako tryb klasyczny - zadnej regresji.
Main pozostaje nietkniety jako backup.
"@

git commit -m $msg

Write-Host "→ Push branch'a do origin..." -ForegroundColor Cyan
git push -u origin v2-hybrid-rpg

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✓ GOTOWE. Branch v2-hybrid-rpg wepchany na GitHub." -ForegroundColor Green
Write-Host "  Main pozostaje nietkniety jako backup." -ForegroundColor Green
Write-Host "  Otworz PR na: https://github.com/armitiel/EwolucJa/pull/new/v2-hybrid-rpg" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
