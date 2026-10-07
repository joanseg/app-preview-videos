#!/bin/bash
# Judges a voice-over take before any clean-up: format, level, background noise,
# pauses between lines, and what a speech recogniser hears.
# Usage: scripts/voice-check.sh take.m4a
# Good take: 48 kHz (Voice Memos → Audio Quality → Lossless), peaks around -6 to -3 dBFS,
# pause noise ≥40 dB below speech, a ≥0.6 s pause after every line, transcript close to the script.
set -uo pipefail
in="$1"; tmp="$(mktemp -d)"
ffprobe -v error -show_entries stream=codec_name,sample_rate,channels,bit_rate:format=duration -of compact "$in"
ffmpeg -hide_banner -i "$in" -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | grep -E "^\s+(I|Peak):" 
stats=$(ffmpeg -hide_banner -i "$in" -af astats=metadata=0 -f null - 2>&1 | grep -E "RMS level dB|Noise floor dB" | head -2)
rms=$(echo "$stats" | grep "RMS level" | awk '{print $NF}'); floor=$(echo "$stats" | grep "Noise floor" | awk '{print $NF}')
awk -v r="$rms" -v n="$floor" 'BEGIN{printf "  Speech RMS %.1f dB, noise floor %.1f dB → %.0f dB apart (want ≥ 40)\n", r, n, r - n}'
echo "Pauses ≥0.6 s (at -40 dB):"
ffmpeg -hide_banner -i "$in" -af silencedetect=noise=-40dB:d=0.6 -f null - 2>&1 \
  | grep -oE "silence_(start|end): [0-9.]+" | paste -sd' ' - | sed 's/^/  /'
model=""
for m in ~/whisper-models/ggml-*.bin ~/.cache/whisper-cpp/ggml-*.bin; do [ -f "$m" ] && model="$m" && break; done
if command -v whisper-cli >/dev/null && [ -n "$model" ]; then
  ffmpeg -loglevel error -y -i "$in" -ar 16000 -ac 1 "$tmp/16k.wav"
  echo "Transcript (forced speech; a weak model also mishears accents):"
  whisper-cli -m "$model" -f "$tmp/16k.wav" -sns -nth 0.9 2>/dev/null | grep "^\[" | sed 's/^/  /'
else
  echo "No whisper-cli + ggml model found; skipping transcript."
fi
rm -rf "$tmp"
