#Requires -Version 5.0
<#
  push-design-branch.ps1 — wrzuca cały redesign Ghibli/Claymorphism na nową gałąź.

  Tworzy gałąź v2-design-ghibli zawierającą:
   • całą logikę V2 (archetyp, cykl tygodniowy, Game Master, dev tools)
   • redesign UI w stylu Ghibli/Claymorphism (styles.css, art SVG, 11 ekranów)
   • naprawy bugów (Rules of Hooks, TTS auto-unlock, truncacja Edit-tool)
   • settings konta na ekranie Profilu (logout / nowa postać / ekran startowy)

  ZACHOWUJE:
   • main (wersja produkcyjna 1.0)
   • v2-hybrid-rpg (poprzednia gałąź V2 logiki, przed redesignem)

  Użycie:
    1. Otwórz PowerShell w C:\Users\DELL\EwolucJA
    2. .\push-design-branch.ps1
    (Jeśli polityka blokuje: Set-ExecutionPolicy -Scope Process Bypass)
#>

$ErrorActionPreference = "Stop"
Set-Location -Path "C:\Users\DELL\EwolucJA"

Write-Host "→ Sprzątam ewentualny lock file po sandboxie..." -ForegroundColor Cyan
if (Test-Path ".git\index.lock") {
    Remove-Item ".git\index.lock" -Force
    Write-Host "  Usunięto .git\index.lock" -ForegroundColor Green
}

Write-Host "→ Aktualna gałąź:" -ForegroundColor Cyan
$current = git branch --show-current
Write-Host "  $current" -ForegroundColor Green

if ($current -ne "v2-hybrid-rpg") {
    Write-Host "→ Przełączam na v2-hybrid-rpg (baza)..." -ForegroundColor Cyan
    git checkout v2-hybrid-rpg
}

Write-Host "→ Tworzę nową gałąź v2-design-ghibli z aktualnego stanu..." -ForegroundColor Cyan
# Jeśli gałąź już istnieje lokalnie, dodaj '-B' zamiast '-b'
$existsLocal = git branch --list v2-design-ghibli
if ($existsLocal) {
    git checkout v2-design-ghibli
    Write-Host "  Gałąź już istnieje lokalnie, przełączyłem się." -ForegroundColor Yellow
} else {
    git checkout -b v2-design-ghibli
    Write-Host "  Stworzyłem nową gałąź v2-design-ghibli." -ForegroundColor Green
}

Write-Host "→ Stage wszystkich zmian..." -ForegroundColor Cyan
git add -A

Write-Host "→ Commit..." -ForegroundColor Cyan
$msg = @"
feat: V2 redesign Ghibli/Claymorphism + naprawy stabilności

REDESIGN UI (na podstawie handoff Claude Design):
- styles/ewolucja.css: paleta basniowa, fontów Fredoka/Nunito/Caveat,
  klasy .card-paper, .scroll-rod, .pin, .prog magic, animacje float/pop/shimmer
- components/art.jsx: biblioteka SVG (Avatar 5 rodzajów, RegionIcon 6 krain,
  Artifact 6 typów, MoonPhase 6 faz, WorldMap pergamin, TabIcons, Cloud,
  FakeQR, Sparkle) z aurą i ewolucją awatara
- components/PageShell.jsx + components/TabBar.jsx — wspólna otoczka ekranów
  z dryfującymi chmurami w tle
- public/assets/: zwoj-closed.png, zwoj-open.png, krysztal.png, wiz.png

REWRITE EKRANÓW:
- Landing: hero Lis-Tropiciel, EwolucJA fontowe, dwa przyciski (Bohater / Mentor)
- Onboarding: 3 kroki (imię z magenta border, quiz 5 pytań, reveal archetypu)
- WorldHub: topbar z avatarem, karta cyklu z księżycami PN-PT, scroll-mission,
  szept Mentora, quick-linki Mapa/Plecak, zaproszenie GM z grafiką wiza
- MissionView: 4-fazowy flow (zwój zamknięty → unroll animation 1.9s →
  otwarty z treścią → form z Caveat textarea)
- MapView (NOWY): pergaminowa mapa z 6 krainami + karta wybranej krainy
- Backpack (NOWY): siatka artefaktów (zdobyte + nieodkryte placeholders)
- Profile (NOWY): avatar + ścieżka 4 etapów ewolucji + statystyki +
  USTAWIENIA KONTA (ekran startowy / zaproś Mentora / nowa postać)
- Reward (NOWY): petal burst + glowing crystal + 'awatar dojrzewa'
- GMPanel: 3 zakładki (Tropiciele / Ten cykl / Ton i tempo) z dawn sky
- InviteGM: card-paper z FakeQR + RUNICZNY KOD + Udostępnij/Skopiuj

NAPRAWY:
- Rules of Hooks fix w WorldHub (useMemo przed early returns)
- TTS auto-unlock: globalny one-shot listener łapie pierwszy gest i
  odblokowuje audio (działa po refreshu /world, /mission)
- Voice 'mentor' w ttsService — osobny TTS dla Mentora
- DevTools floating widget (logout, wipe, link do /dev) na każdej stronie
- DevPanel /dev z inspektorem quizu (full punktacja) i dump JSON gracza
- index.html + main.jsx z Google Fonts (Fredoka, Nunito, Caveat) i routerem
  z 11 trasami + future flags v7

NOTATKI: Stary App.jsx zostaje na /play jako tryb klasyczny.
Główne 'ekran startowy + onboarding' są na: '/' → klik 'Jestem bohaterem' → '/onboarding'.
W UI: zakładka Profil (TabBar) → karta 'Ustawienia konta' → 'Ekran startowy' lub
'Wyloguj — zacznij nową postać'.
"@

git commit -m $msg

Write-Host "→ Push do origin..." -ForegroundColor Cyan
git push -u origin v2-design-ghibli

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✓ GOTOWE." -ForegroundColor Green
Write-Host ""
Write-Host "  Aktywna gałąź dev: v2-design-ghibli (najnowsza)" -ForegroundColor Green
Write-Host "  Backup #1:         v2-hybrid-rpg (V2 logika bez redesignu)" -ForegroundColor Yellow
Write-Host "  Backup #2:         main         (oryginalna wersja produkcyjna)" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Otwórz PR:" -ForegroundColor Cyan
Write-Host "  https://github.com/armitiel/EwolucJa/pull/new/v2-design-ghibli" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Green
