#!/usr/bin/env bash
# Wizkor — z MP4 z Higgsfield do przezroczystej pętli dla popupu.
#
# Uruchamiam to ja, w środowisku Claude (ffmpeg 6.x z libvpx-vp9 i libwebp).
# Plik leży tutaj, żeby było widać CO dokładnie dzieje się z materiałem —
# nie musisz tego odpalać u siebie.
#
# Użycie:  ./post-produkcja.sh surowe/wizkor-super.mp4 super 0.8 1.2
#                              ^plik wejściowy        ^nazwa ^start ^długość
set -euo pipefail

IN="${1:?podaj plik mp4}"
NAZWA="${2:?podaj nazwę wyjścia, np. super}"
START="${3:-0}"        # sekunda, od której zaczyna się gest (przed nim model zwykle "rozgrzewa" obraz)
DLUGOSC="${4:-1.2}"    # tyle zostawiamy — popup nie potrzebuje więcej

ZIELEN="0x00B140"      # ten sam kolor co w klatce źródłowej
FPS=15                 # 15 kl/s wystarczy na mrugnięcie i gest; 24 to +60% wagi bez zysku
SZER=512               # popup rysuje obrazek w ~280 px, 512 daje zapas na ekrany 2x

mkdir -p gotowe podglad

# Wycięcie zieleni:
#   chromakey  — działa w YUV, łagodniej traktuje antyaliasing kreski niż colorkey
#   0.16       — tolerancja: niżej = zostają zielone obwódki, wyżej = zjada cień brody
#   0.03       — miękkość krawędzi
#   despill    — zdejmuje zielony refleks, który wchodzi w biel brody i złoto
KEY="format=yuva420p,chromakey=${ZIELEN}:0.16:0.03,despill=type=green:mix=0.5:expand=0.3"

# ---------------------------------------------------------------- 1. animowany WebP (GŁÓWNY)
# Jeden <img>, alfa działa we wszystkich przeglądarkach, zero polityk autoplay na iOS.
ffmpeg -y -ss "$START" -t "$DLUGOSC" -i "$IN" \
  -vf "${KEY},fps=${FPS},scale=${SZER}:-1:flags=lanczos,format=rgba" \
  -c:v libwebp_anim -lossless 0 -q:v 72 -compression_level 6 -loop 0 \
  -an -fps_mode passthrough "gotowe/wizkor-${NAZWA}.webp"

# ---------------------------------------------------------------- 2. WebM z alfą (zapas)
# Płynniejszy i lżejszy od WebP, ale Safari odtworzy go BEZ przezroczystości —
# więc idzie do gry tylko razem z fallbackiem.
ffmpeg -y -ss "$START" -t "$DLUGOSC" -i "$IN" \
  -vf "${KEY},fps=${FPS},scale=${SZER}:-1:flags=lanczos" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 34 -row-mt 1 \
  -an "gotowe/wizkor-${NAZWA}.webm"

# Uwaga: MP4/HEVC z alfą dla Safari wymaga enkodera VideoToolbox (macOS).
# Nie da się go zrobić tutaj — i dlatego głównym formatem jest WebP, a nie <video>.

# ---------------------------------------------------------------- 3. sprite sheet (awaryjnie)
# Gdyby pętla WebP gdzieś zacinała: PNG z klatkami w rzędzie + CSS steps().
KLATKI=$(awk -v f="$FPS" -v d="$DLUGOSC" 'BEGIN{printf "%d", f*d}')
ffmpeg -y -ss "$START" -t "$DLUGOSC" -i "$IN" \
  -vf "${KEY},fps=${FPS},scale=256:-1:flags=lanczos,tile=${KLATKI}x1" \
  -frames:v 1 "gotowe/wizkor-${NAZWA}-sprite.png"
echo "sprite: ${KLATKI} klatek w rzędzie -> animation: wizkor ${DLUGOSC}s steps(${KLATKI}) infinite"

# ---------------------------------------------------------------- 4. podgląd do oceny
# Klatki co 0.1 s na szachownicy — widać od razu, gdzie dłoń się rozpływa
# i czy pierwsza klatka skleja się z ostatnią.
ffmpeg -y -ss "$START" -t "$DLUGOSC" -i "$IN" \
  -vf "${KEY},fps=10,scale=200:-1,tile=6x2" \
  -frames:v 1 "podglad/wizkor-${NAZWA}-klatki.png"

ls -la gotowe
