#!/bin/bash
# Converts a device screen recording (HEVC, variable frame rate) into the 30 fps H.264
# file a composition reads, and prints its size and length.
# Usage: scripts/import-footage.sh ~/Downloads/rec.MP4 <name>   → public/footage/<name>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/footage
ffmpeg -loglevel error -y -i "$1" -an -r 30 -c:v libx264 -crf 14 -pix_fmt yuv420p "public/footage/$2.mp4"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height:format=duration \
  -of default=nw=1 "public/footage/$2.mp4"
