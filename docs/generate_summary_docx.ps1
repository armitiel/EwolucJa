# Generuje EwolucJA_Podsumowanie.docx bez Word COM
# Buduje plik .docx jako ZIP z minimalnym OOXML (Office Open XML)
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$outPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'EwolucJA_Podsumowanie.docx'
if (Test-Path $outPath) { Remove-Item $outPath -Force }

# ────────────────────────────────────────────────────────────────────
#  Budowanie body w OOXML
# ────────────────────────────────────────────────────────────────────
$body = New-Object System.Text.StringBuilder

function Esc($s) {
    return ([string]$s).Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;')
}

function Add-Title($text) {
    [void]$body.AppendLine(@"
<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t xml:space="preserve">$(Esc $text)</w:t></w:r></w:p>
"@)
}
function Add-Subtitle($text) {
    [void]$body.AppendLine(@"
<w:p><w:pPr><w:pStyle w:val="Subtitle"/></w:pPr><w:r><w:t xml:space="preserve">$(Esc $text)</w:t></w:r></w:p>
"@)
}
function Add-Heading($text, $level) {
    [void]$body.AppendLine(@"
<w:p><w:pPr><w:pStyle w:val="Heading$level"/></w:pPr><w:r><w:t xml:space="preserve">$(Esc $text)</w:t></w:r></w:p>
"@)
}
function Add-Para($text) {
    [void]$body.AppendLine(@"
<w:p><w:r><w:t xml:space="preserve">$(Esc $text)</w:t></w:r></w:p>
"@)
}
function Add-Bullet($text) {
    [void]$body.AppendLine(@"
<w:p><w:pPr><w:pStyle w:val="ListBullet"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">$(Esc $text)</w:t></w:r></w:p>
"@)
}
function Add-Code($text) {
    $lines = $text -split "`r?`n"
    foreach ($ln in $lines) {
        [void]$body.AppendLine(@"
<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">$(Esc $ln)</w:t></w:r></w:p>
"@)
    }
}
function Add-Spacer { [void]$body.AppendLine('<w:p/>') }

# ────────────────────────────────────────────────────────────────────
#  Treść
# ────────────────────────────────────────────────────────────────────

Add-Title 'EwolucJA / GAMA-1'
Add-Subtitle 'Podsumowanie projektu — architektura, stack, struktura repo'
Add-Para ('Wygenerowano: ' + (Get-Date -Format 'yyyy-MM-dd'))
Add-Spacer

# 1
Add-Heading '1. Czym jest projekt' 1
Add-Para 'EwolucJA (kryptonim systemu agentów: GAMA-1) to gra fabularna PWA dla dzieci w wieku 6-12 lat, wspierająca rozwój kompetencji miękkich. Gracz przechodzi przez sześć krain fantasy i podejmuje wybory, które w tle są analizowane przez system agentów AI (Claude API) oraz mapowane na sześć profili psychologicznych.'
Add-Para 'Narrator prowadzi gracza przez przygodę językiem przystępnym dla dzieci, a obserwator psychologiczny w tle przyznaje punkty profilom kompetencyjnym i nigdy nie ujawnia tego procesu graczowi w trakcie gry.'

# 2
Add-Heading '2. Stack technologiczny' 1
Add-Bullet 'Frontend: React + Vite (PWA), port 3000, proxy /api -> :3001'
Add-Bullet 'Backend: Node.js + Express (ESM), port 3001'
Add-Bullet 'Baza danych: SQLite (better-sqlite3, WAL mode), plik backend/ewolucja.db'
Add-Bullet 'AI: Claude API (Anthropic, model claude-sonnet-4-20250514)'
Add-Bullet 'Generacja obrazów: fal.ai (karta bohatera, avatar)'
Add-Bullet 'TTS: własny serwis (backend/src/services/ttsService.js)'
Add-Bullet 'Specyfikacje agentów: agents/prompts/*.txt + agents/schemas/*.json'

# 3
Add-Heading '3. Model domeny — sześć profili kompetencji' 1
Add-Para 'Każdy profil może zdobyć maksymalnie 10 punktów w całej rozgrywce:'
Add-Bullet 'EM — Empata (wrażliwość, życzliwość, dekodowanie emocji)'
Add-Bullet 'ST — Strateg (logika, planowanie, odraczanie gratyfikacji)'
Add-Bullet 'KR — Kreator (myślenie nieszablonowe, elastyczność poznawcza)'
Add-Bullet 'LD — Lider (odwaga, inicjatywa, gotowość do ryzyka)'
Add-Bullet 'DT — Detektyw (dociekliwość, eksploracja, ciekawość poznawcza)'
Add-Bullet 'MD — Mediator (sprawiedliwość, godzenie konfliktów, praca zespołowa)'
Add-Para 'Końcowo: dwa najwyższe profile = profil dominujący -> tytuł hybrydowy -> karta bohatera + raporty (uczeń w języku przygody, nauczyciel w terminologii CASEL/VIA).'

# 4
Add-Heading '4. Krainy (sekwencja gry)' 1
Add-Bullet '1. dolina_selfie — Dolina Selfie'
Add-Bullet '2. las_decyzji — Las Decyzji'
Add-Bullet '3. jaskinia_emocji — Jaskinia Emocji'
Add-Bullet '4. wyspa_talentow — Wyspa Talentów'
Add-Bullet '5. przystan_wspolpracy — Przystań Współpracy'
Add-Bullet '6. gora_podsumowania — Góra Podsumowania'
Add-Para 'Zadanie 7 (kreatywne) ocenia osobny CreativityAgent.'

# 5
Add-Heading '5. Struktura repozytorium' 1
$tree = @"
EwolucJA/
  frontend/                       # React PWA (Vite)
    src/
      App.jsx                     # główna logika gry (single-file)
      growthData.js               # GROWTH_TIPS, DAILY_MISSIONS per profil
      components/                 # AvatarBuilder, AvatarSVG, AvatarBoy,
                                  # AvatarDisplay, AvatarAI,
                                  # NarratorVoice, LandTransition
      services/                   # ttsPlayer.js, bgMusic.js, agentAPI.js
      utils/                      # detectGender.js

  backend/
    src/
      server.js                   # Express, CORS, init DB
      database/db.js              # SQLite, tabela `players`
      api/                        # players.js, game.js, agents.js,
                                  # tts.js, images.js
      agents/
        BaseAgent.js              # wrapper na Claude API + retry
        GameOrchestrator.js       # koordynator pięciu agentów
        NarratorAgent.js          # narracja krain
        ProfilerAgent.js          # mikro / makro analiza wyborów
        CreativityAgent.js        # ocena zadania kreatywnego
        ReportAgent.js            # raport ucznia + nauczyciela
        AvatarAgent.js            # opis ekwipunku, prompt do fal.ai
      services/                   # ttsService.js, falService.js

  agents/                         # specyfikacje (nie kod runtime)
    prompts/                      # system_prompt.txt, lands_scenarios.txt
    schemas/                      # player_profile.json,
                                  # narrator_response.json,
                                  # teacher_report.json
    game_master.py                # wcześniejszy prototyp Python

  docs/                           # psychologia_baza.md, scenariusz_pelny.md
  GAMA-1_Dokument_Operacyjny.docx
"@
Add-Code $tree

# 6
Add-Heading '6. Architektura przepływu' 1
$flow = @"
Frontend (React)
   |  agentAPI.js  -->  POST /api/game/* /api/agents/*
   v
Express routes  -->  GameOrchestrator
                       |-- NarratorAgent     (narracja, wybory)
                       |-- ProfilerAgent     (scoring, mikro-analiza, profil)
                       |-- CreativityAgent   (ocena zadania otwartego)
                       |-- ReportAgent       (student_report, teacher_report)
                       \-- AvatarAgent       (opis ekwipunku, prompt obrazu)
                                                |
                            fal.ai  <-----------/   (karta bohatera)
   |
   v
SQLite (backend/ewolucja.db)
   tabela `players` z kolumnami JSON:
   avatar_json, scores_json, choices_log_json, final_profile_json
"@
Add-Code $flow

# 7
Add-Heading '7. Schemat bazy danych' 1
Add-Para 'Tabela players:'
Add-Bullet 'id (TEXT PK), name (TEXT)'
Add-Bullet 'avatar_json — konfiguracja awatara'
Add-Bullet 'scores_json — {EM, ST, KR, LD, DT, MD} (domyślnie zera)'
Add-Bullet 'current_land (TEXT, domyślnie "dolina_selfie")'
Add-Bullet 'completed_lands_json — lista ukończonych krain'
Add-Bullet 'choices_log_json — log wszystkich wyborów'
Add-Bullet 'final_profile_json — profil końcowy (po Górze Podsumowania)'
Add-Bullet 'created_at, updated_at (datetime)'

# 8
Add-Heading '8. Kluczowe API endpointy' 1
Add-Bullet '/api/players — CRUD profili gracza'
Add-Bullet '/api/game — enterLand, processChoice, transitionLand, finalize'
Add-Bullet '/api/agents — bezpośrednie wywołania agentów (np. opis postaci)'
Add-Bullet '/api/tts — text-to-speech narracji'
Add-Bullet '/api/images — generacja obrazu awatara / karty bohatera'
Add-Bullet '/api/health — health check'

# 9
Add-Heading '9. Uruchomienie lokalne' 1
$run = @"
# Backend
cd backend
npm install
npm run dev          # -> http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev          # -> http://localhost:3000  (proxy /api -> :3001)

# Wymagane zmienne środowiskowe (.env w backend/):
ANTHROPIC_API_KEY=...
FAL_KEY=...          # opcjonalnie — bez tego fallback bez obrazu
"@
Add-Code $run

# 10
Add-Heading '10. Stan aktualny (gałąź main)' 1
Add-Para 'Ostatni commit:'
Add-Code '55f9de0  Ulepsz UI: kolory podsumowania, opóźnienie wyborów, opis postaci, timer, hero card, tranzycje krain'
Add-Para 'Niezacommitowane zmiany:'
Add-Bullet 'frontend/src/App.jsx'
Add-Bullet 'frontend/src/growthData.js'
Add-Bullet 'frontend/src/services/ttsPlayer.js'
Add-Bullet 'frontend/public/avatar_boy.svg'

$bodyXml = $body.ToString()

# ────────────────────────────────────────────────────────────────────
#  Pliki XML pakietu .docx
# ────────────────────────────────────────────────────────────────────

$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
$bodyXml
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$stylesXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pl-PL"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="240" w:after="60"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri Light" w:hAnsi="Calibri Light"/><w:b/><w:sz w:val="56"/><w:color w:val="2E74B5"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr><w:i/><w:sz w:val="28"/><w:color w:val="595959"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="360" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri Light" w:hAnsi="Calibri Light"/><w:b/><w:sz w:val="32"/><w:color w:val="2E74B5"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="60"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri Light" w:hAnsi="Calibri Light"/><w:b/><w:sz w:val="26"/><w:color w:val="2E74B5"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:ind w:left="360" w:hanging="360"/><w:spacing w:after="60"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:shd w:val="clear" w:color="auto" w:fill="F4F4F4"/><w:ind w:left="120"/></w:pPr><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/></w:rPr></w:style>
</w:styles>
'@

$numberingXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol"/></w:rPr></w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>
'@

$contentTypesXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>
'@

$rootRelsXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@

$documentRelsXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>
'@

# ────────────────────────────────────────────────────────────────────
#  Pakowanie do ZIP / .docx
# ────────────────────────────────────────────────────────────────────

$utf8 = New-Object System.Text.UTF8Encoding $false
$fs = [System.IO.File]::Open($outPath, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)

function Add-ZipEntry($zip, $name, $content, $enc) {
    $entry = $zip.CreateEntry($name, [System.IO.Compression.CompressionLevel]::Optimal)
    $stream = $entry.Open()
    $writer = New-Object System.IO.StreamWriter($stream, $enc)
    $writer.Write($content)
    $writer.Flush()
    $writer.Dispose()
    $stream.Dispose()
}

Add-ZipEntry $zip '[Content_Types].xml' $contentTypesXml $utf8
Add-ZipEntry $zip '_rels/.rels' $rootRelsXml $utf8
Add-ZipEntry $zip 'word/document.xml' $documentXml $utf8
Add-ZipEntry $zip 'word/_rels/document.xml.rels' $documentRelsXml $utf8
Add-ZipEntry $zip 'word/styles.xml' $stylesXml $utf8
Add-ZipEntry $zip 'word/numbering.xml' $numberingXml $utf8

$zip.Dispose()
$fs.Dispose()

Write-Output "OK: $outPath"
Write-Output ("Size: " + (Get-Item $outPath).Length + " bytes")
