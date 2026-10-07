#!/bin/bash
# Cleans one voice-over take and cuts it into lines at the pauses.
# Usage: scripts/voice.sh take.m4a <video-name>
# Writes public/voice/<name>-1.wav, -2.wav, … and prints each line's length.
set -euo pipefail
cd "$(dirname "$0")/.."
in="$1"; name="$2"; tmp="$(mktemp -d)"
# Rumble and hiss out, gentle noise reduction, de-ess, a little presence,
# even out the level, then broadcast loudness (-16 LUFS, -1.5 dBTP).
ffmpeg -loglevel error -y -i "$in" -ac 1 -ar 48000 -af "\
highpass=f=80,lowpass=f=13000,afftdn=nr=12:nf=-40,deesser=i=0.4,\
equalizer=f=200:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1.2:g=2.5,\
acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=4dB,\
loudnorm=I=-16:TP=-1.5:LRA=7" "$tmp/clean.wav"
# Cut at pauses of 0.6 s or more.
ffmpeg -hide_banner -i "$tmp/clean.wav" -af silencedetect=noise=-38dB:d=0.6 -f null - 2>&1 \
  | awk '/silence_start/{s=$NF} /silence_end/{print s, $5}' > "$tmp/gaps"
rm -f public/voice/"$name"-*.wav
start=0; n=0
total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$tmp/clean.wav")
while read -r gs ge; do
  if awk -v a="$start" -v b="$gs" 'BEGIN{exit !(b - a > 0.3)}'; then
    n=$((n + 1))
    ffmpeg -loglevel error -y -i "$tmp/clean.wav" -ss "$start" -to "$gs" \
      -af "afade=t=in:d=0.02,areverse,afade=t=in:d=0.08,areverse" "public/voice/$name-$n.wav"
  fi
  start=$ge
done < <(cat "$tmp/gaps"; echo "$total $total")
for f in public/voice/"$name"-*.wav; do
  printf '%s %.2fs\n' "$(basename "$f")" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
done
rm -rf "$tmp"
