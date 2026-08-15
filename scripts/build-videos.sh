#!/usr/bin/env bash
# Otimiza os depoimentos em vídeo pra produção (re-executável):
#   assets-src/videos-src/*.{mp4,mov} (originais, fora do deploy)
#   -> public/assets/videos/*.mp4 (H.264 720px, faststart)
#   -> public/assets/videos/*.webp (poster do frame em 1s)
#
# Rode: bash scripts/build-videos.sh
# Precisa: ffmpeg no PATH (ou defina FFMPEG=/caminho/ffmpeg).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/assets-src/videos-src"
OUT="$ROOT/public/assets/videos"
FFMPEG="${FFMPEG:-ffmpeg}"
mkdir -p "$OUT"

shopt -s nullglob nocaseglob
for f in "$SRC"/*.mp4 "$SRC"/*.mov; do
  [ -e "$f" ] || continue
  base="$(basename "$f")"
  name="${base%.*}"
  out_mp4="$OUT/$name.mp4"
  out_poster="$OUT/$name.webp"
  in_size=$(du -h "$f" | cut -f1)

  echo "== $name ($in_size) =="
  "$FFMPEG" -y -i "$f" \
    -vf "scale=720:-2" -c:v libx264 -preset medium -crf 25 -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 1 \
    -movflags +faststart \
    "$out_mp4" -hide_banner -loglevel error -stats

  "$FFMPEG" -y -ss 1 -i "$f" -frames:v 1 -vf "scale=720:-2" "$out_poster" -hide_banner -loglevel error

  out_size=$(du -h "$out_mp4" | cut -f1)
  echo "   $in_size -> $out_size"
done

echo "== total public/assets/videos =="
du -sh "$OUT"
