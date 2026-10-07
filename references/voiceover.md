# Voice-over

## Script
- One line per scene, starting ~0.3 s after the scene does. Pace ≈ 2.3 words per second, so a
  3 s scene takes ~7 words. Shorter is better.
- Same honesty rules as captions. Spoken numbers count as prices on the App Store.
- Write it into `voiceover/SCRIPT.md` as a table: #, starts at, line.

## Recording checklist (for the owner)
1. Voice Memos → Settings → Audio Quality → **Lossless** (the default "Compressed" records
   24 kHz at ~64 kbps).
2. The quietest, softest room available — a wardrobe of clothes is ideal; fans and AC off.
3. Phone ~20 cm away, slightly to the side of the mouth (no breath pops).
4. One take per video, a little slower than normal speech, **a full one-second pause after every
   line** — the pauses are how lines get cut apart.

## Judge the take — `scripts/voice-check.sh take.m4a`
| Measure | Good | Problem |
|---|---|---|
| Sample rate | 48 kHz | 24 kHz = compressed setting |
| Noise in pauses vs speech | ≥ 40 dB lower | ~20 dB = noisy room; clean-up can't separate it |
| Pauses ≥ 0.6 s | after every line | lines run together; can't be split |
| Transcript | close to the script | mostly wrong = unclear (a small model also mishears accents — say so) |

Report the numbers and a plain verdict. If it isn't usable, say exactly what to change; offer an
AI voice as the alternative if the owner doesn't want to re-record.

## Clean, split, place
`scripts/voice.sh take.m4a <video>` → high-pass, gentle noise reduction, de-ess, presence lift,
compression, −16 LUFS; then cuts at pauses into `public/voice/<video>-N.wav` and prints each
line's length. Place with:
```tsx
<Soundtrack track="close-up.mp3" underVoice />
<VoiceOver lines={[{ file: "send-1.wav", at: 0.3 }, { file: "send-2.wav", at: 2.9 }]} />
```
If a line runs past the next scene's start, push later lines back rather than overlapping.
No pitch correction ("autotune") — it makes speech robotic.
