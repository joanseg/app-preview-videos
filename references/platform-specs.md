# Platform specs and content rules

Re-check the official pages if a submission is near — the numbers below were verified
October 2026.

## App Store (Apple)
Sources: developer.apple.com/help/app-store-connect/reference/app-preview-specifications/,
developer.apple.com/support/app-previews/, App Review Guidelines 2.3.3–2.3.4.

| Asset | Spec |
|---|---|
| App preview, 6.9"/6.5"/6.3" iPhone | 886 × 1920 portrait (1920 × 886 landscape) |
| App preview, 6.1" home-button / 5.5" | 1080 × 1920 / 750 × 1334 |
| Length | 15–30 s |
| Frame rate | ≤ 30 fps |
| Format | H.264 .mov/.m4v/.mp4, or ProRes 422 HQ .mov; ≤ 500 MB |
| Audio | stereo AAC 256 kbps, 44.1 or 48 kHz (render with an audio track even if silent) |
| Count | up to 3 previews per device size per language |
| Screenshots | 6.9": 1320 × 2868 (or 1290 × 2796); PNG/JPEG, no alpha |

Content rules:
- Only screen captures of the app itself; narration and text/design overlays allowed;
  touch hotspots allowed.
- **No device frames, no hands, no people**, no over-the-shoulder footage.
- No specific prices in overlays; no seasonal or dated references.
- Disclose sign-in, subscription or in-app purchase requirements (end frame is fine).
- Transitions must not imply features the app lacks — use fades and dissolves.
- Previews autoplay muted; a poster frame shows when autoplay is off (chosen in App Store Connect).
- Showing the recording smaller on a branded background (no bezel) is not a device frame,
  but it is a judgment call — tell the owner.

## Google Play
Source: support.google.com/googleplay/android-developer/answer/9866151.

| Asset | Spec |
|---|---|
| Promo video | a **YouTube URL** (public or unlisted, ads off, not age-restricted); first 30 s autoplay; portrait or landscape |
| Feature graphic | 1024 × 500, JPEG or 24-bit PNG, no alpha (required) |
| Screenshots | 2–8 per device type; each side 320–3840 px, long side ≤ 2× short; 9:16 or 16:9; no alpha; 4+ at ≥1080 px for promotion eligibility |
| Icon | 512 × 512 PNG |

Assets must show the **Android** app — iPhone footage (status bar, "Checked on this iPhone",
Apple Pay) is a rejection risk. Content rules: no device frames, no people using devices, no "Best", "#1", "Top", "New",
"Discount", "Sale", "Million downloads", no calls to action ("Download now"); **text overlays
≤ 20 % of the image** — the template's caption band is 380/1920 ≈ 20 %, and the screenshot
headline area is larger, so pass `headlineArea={470}` to `Screenshot` for Play. `check.sh play`
does not measure text area — check it by eye.

## Social (Reels, TikTok, Shorts, LinkedIn)
`formats.socialVertical` = 1080 × 1920, H.264 + AAC, ≤ 60 s for a clean fit everywhere.
Keep captions clear of the bottom ~20 % (platform UI covers it) — the top band layout already does.
