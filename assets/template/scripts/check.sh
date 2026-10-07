#!/bin/bash
# Checks rendered files against a store's specs before upload.
# Usage: scripts/check.sh appstore|play|social <files…>
#   appstore  video 886x1920 (or 1080x1920 / 750x1334 for older sizes), ≤30 fps, 15–30 s,
#             H.264, stereo AAC 44.1/48 kHz, <500 MB; screenshot 1320x2868 (or 1290x2796), no alpha
#   play      video: any size, uploaded to YouTube (public/unlisted, ads off); first 30 s autoplay
#             screenshot 320–3840 px per side, long side ≤ 2× short side, no alpha
#   social    video 1080x1920, ≤60 s, H.264 + AAC
set -uo pipefail
target="$1"; shift
fail=0
probe() { ffprobe -v error -select_streams "$1" -show_entries "$2" -of csv=p=0 "$3"; }
within() { awk -v x="$1" -v lo="$2" -v hi="$3" 'BEGIN{exit !(x >= lo && x <= hi)}'; }
for f in "$@"; do
  ok=1; size=$(probe v:0 stream=width,height "$f"); w=${size%,*}; h=${size#*,}
  case "$f" in
  *.mp4)
    fps=$(probe v:0 stream=avg_frame_rate "$f"); codec=$(probe v:0 stream=codec_name "$f")
    audio=$(probe a:0 stream=codec_name,sample_rate,channels "$f")
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
    mb=$(( $(stat -f%z "$f") / 1048576 ))
    [ "$codec" = h264 ] || ok=0
    [[ "$audio" =~ ^aac,(44100|48000),2$ ]] || ok=0
    case "$target" in
      appstore)
        [[ "$size" =~ ^(886,1920|1080,1920|750,1334)$ ]] || ok=0
        awk -v r="$fps" 'BEGIN{split(r,a,"/"); exit !(a[1]/a[2] <= 30)}' || ok=0
        within "$dur" 15 30 || ok=0; [ "$mb" -lt 500 ] || ok=0 ;;
      play) within "$dur" 1 600 || ok=0 ;;
      social) [ "$size" = "1080,1920" ] || ok=0; within "$dur" 1 60 || ok=0 ;;
    esac
    info="fps=$fps codec=$codec audio=$audio dur=$dur MB=$mb" ;;
  *.png|*.jpg)
    pix=$(probe v:0 stream=pix_fmt "$f")
    [[ "$pix" =~ ^(rgb24|yuvj420p|yuvj444p)$ ]] || ok=0   # no alpha channel
    case "$target" in
      appstore) [[ "$size" =~ ^(1320,2868|1290,2796)$ ]] || ok=0 ;;
      play)
        within "$w" 320 3840 || ok=0; within "$h" 320 3840 || ok=0
        awk -v a="$w" -v b="$h" 'BEGIN{l=(a>b)?a:b; s=(a>b)?b:a; exit !(l <= 2*s)}' || ok=0 ;;
    esac
    info="pix=$pix" ;;
  esac
  [ "$ok" = 1 ] && v=PASS || { v=FAIL; fail=1; }
  printf '%-4s %-24s size=%s %s\n' "$v" "$(basename "$f")" "$size" "$info"
done
exit $fail
