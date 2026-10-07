#!/bin/bash
# Renders the given compositions into out/ (videos as .mp4, stills as .png), then checks them.
# Usage: scripts/render.sh <target> Video1 Video2 … [-- Shot1 Shot2 …]
# (bash 3.2-safe: empty arrays are expanded with ${a[@]+…} because of set -u)
#   target: appstore | play | social  (what scripts/check.sh checks against)
set -euo pipefail
cd "$(dirname "$0")/.."
target="$1"; shift
videos=(); stills=(); into=videos
for a in "$@"; do
  if [ "$a" = "--" ]; then into=stills; continue; fi
  if [ $into = videos ]; then videos+=("$a"); else stills+=("$a"); fi
done
files=()
for id in ${videos[@]+"${videos[@]}"}; do
  npx remotion render "$id" "out/$id.mp4" --codec=h264 --crf=16 \
    --enforce-audio-track --audio-codec=aac --audio-bitrate=256k
  files+=("out/$id.mp4")
done
for id in ${stills[@]+"${stills[@]}"}; do
  npx remotion still "$id" "out/$id.png"
  files+=("out/$id.png")
done
./scripts/check.sh "$target" "${files[@]}"
