#!/bin/bash
# Writes a test-pattern clip so compositions render before real recordings exist.
# Usage: scripts/make-placeholder.sh <name> [width] [height] [seconds]
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/footage
ffmpeg -loglevel error -y -f lavfi -i "testsrc2=s=${2:-1180}x${3:-2556}:r=30:d=${4:-40}" \
  -c:v libx264 -pix_fmt yuv420p -crf 30 "public/footage/$1.mp4"
echo "public/footage/$1.mp4"
