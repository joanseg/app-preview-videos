#!/bin/bash
# Downloads Mixkit tracks into public/music/. Mixkit Stock Music Free License: commercial use
# including online ads, no attribution; not for CDs/DVDs/games/broadcast, not to be resold.
# Usage: scripts/fetch-music.sh <mixkit-id>:<file-name> …   e.g. 1167:close-up
# Find ids on mixkit.co/free-stock-music/tag/<tag>/ — each track's JSON-LD has its mp3 url.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/music
for p in "$@"; do
  id="${p%%:*}"; name="${p#*:}"
  curl -sfL -A "Mozilla/5.0" -o "public/music/$name.mp3" "https://assets.mixkit.co/music/$id/$id.mp3"
  echo "public/music/$name.mp3 $(ffprobe -v error -show_entries format=duration -of csv=p=0 "public/music/$name.mp3")s"
done
