#!/bin/bash
# Tiles frames of a recording so a scene list, tap times and screen positions can be read off it.
# Usage: scripts/contact-sheet.sh <name> [start-seconds] [length-seconds] [frames-per-second]
# Tile i (0-based, left to right, top to bottom) is at start + i / fps seconds.
set -euo pipefail
cd "$(dirname "$0")/.."
name="$1"; start="${2:-0}"; len="${3:-30}"; fps="${4:-2}"
mkdir -p out/sheets
out="out/sheets/$name-$start-$fps.png"
rows=$(awk -v l="$len" -v f="$fps" 'BEGIN{n=l*f; r=int((n+12)/13); print (r<1)?1:r}')
ffmpeg -loglevel error -y -ss "$start" -t "$len" -i "public/footage/$name.mp4" \
  -vf "fps=$fps,scale=150:-1,tile=13x$rows:padding=3" -frames:v 1 "$out"
echo "$out"
