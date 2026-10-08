---
name: app-preview-videos
description: Turns phone screen recordings of an app into store-ready promo videos and screenshots — App Store app previews (886×1920, 15–30 s), Google Play promo videos and screenshots, and 9:16 social cuts — with branded kinetic captions, tap rings, personal data painted out so it leaves no trace, licensed music, an end card, optional cleaned-up voice-over, and a spec check before upload. Use this whenever someone wants App Store or Play Store previews, "app preview video", store screenshots, a demo reel or motion-graphics video of their app's screens, captions over an app recording, or asks what to record for one — even if they only say "make a video of the send flow" or "screenshots for the app submission".
---

# App preview videos

Recordings of the real app in, finished store assets out. The work is mostly judgment —
what each clip honestly shows, what must be hidden, what the captions may claim — wrapped
around a Remotion template that does the rendering. Build incrementally and look at
rendered frames after every change; most defects here are only visible in pixels.

## 0. Intake

Settle these before touching footage (ask the owner if the conversation doesn't say):

- **Targets.** App Store, Google Play, social, or several. Read `references/platform-specs.md`
  for sizes, limits and content rules. App Store allows **3 previews per language** — if the
  owner wants more flows than that, say so and help them pick.
- **Flows.** One video per user story ("top up", "send by email"). Each must tell one story
  in 15–30 s.
- **Brand.** Find the app's tokens (a DESIGN.md, a tokens file, the asset catalog, the
  marketing site): background colours, ink, accent, font file, wordmark casing, tagline.
- **Recordings.** If they don't exist yet, give the owner `references/recording-guide.md`'s
  checklist, tailored to their flows. If they do, still check them against it.
- **Platform match.** Store assets must show that platform's app: Play screenshots and the
  Play promo video need Android footage; App Store assets need iOS footage. iPhone footage
  is fine for social. If the owner offers the wrong one, make drafts but say they can't be
  submitted as they are.

## 1. Set up the project

```bash
~/.claude/skills/app-preview-videos/scripts/new-project.sh <repo>/AppStore/previews
```

This copies `assets/template/`, installs it, fetches a default Mixkit track and writes a
placeholder clip. (The first render also downloads Chrome Headless Shell, ~20 s.) Then fill in `src/brand.ts` (brand, colours, font in `public/fonts/`,
`source` = the recordings' pixel size). Put the project on a feature branch in the app's
repo; `.gitignore` already keeps footage, voice takes and renders out of git — they show a
real account. Optional: `npx skills add remotion-dev/skills` inside the project gives Remotion's
own agent skills. Delete `src/videos/Example.tsx` and its composition once the first real video exists.

## 2. Import and map the footage

```bash
scripts/import-footage.sh ~/Downloads/rec.MP4 send      # HEVC/VFR → 30 fps H.264
scripts/contact-sheet.sh send 0 40 2                     # whole clip, 2 frames/s
scripts/contact-sheet.sh send 12 6 4                     # a stretch, 4 frames/s
```

Read the sheets and write a timeline: when each screen settles, when each tap happens, when
waits start and end. Tile *i* is at `start + i / fps` seconds. For positions, extract a frame
scaled to 886 wide and read pixel coordinates — see `references/footage-mapping.md`.

## 3. Sweep for what must not ship

Before building scenes, list everything in the footage that has to be cut, covered, or
not claimed. This is where previews get rejected or embarrass the owner:

- **Personal data**: emails, phone numbers, names, home addresses, card details, wallet
  balances the owner doesn't want public. Cover with `<Redact>`; for an email the owner may
  want only the domain covered so "typing an email" still reads. `<Redact>` doesn't draw a
  grey or frosted patch — it paints the box with the surface right beside it (a thin strip,
  stretched, feathered), so the detail simply isn't there. A visible box tells viewers
  something was hidden and looks unfinished; the goal is that nobody notices.
- **Words a reviewer will reject**: profanity in an activity list, a contact name, a note.
- **Failure states**: an error sheet, "Payment failed", a declined card. Cut before them, and
  never caption an outcome the footage doesn't show — a top-up that failed cannot end on
  "dollars in your balance".
- **Recording artefacts**: the phone's own screen recorder puts a red dot and Live Activity
  art in the Dynamic Island — `<Screen coverIsland>` paints the island plain black (re-measure
  its box for other devices). Notifications and AutoFill/paste menus: cut past them.
- **Typed vs pasted**: if the story is "just type their email" but the text was pasted or
  AutoFilled, cut from the empty field to the filled one and caption it "enter", not "type";
  tell the owner a re-record would show the typing.
- **Identifiers that are public but personal** — balances, wallet addresses, transaction
  hashes, a first name next to them. Leave them unless the owner says otherwise, but list them.

Tell the owner what you found and what you did about each; ask before cutting a story short.

## 4. Build each video

Copy `src/videos/Example.tsx` per flow and register it in `src/Root.tsx`. The pattern:

- One `TransitionSeries.Sequence` per scene, 12-frame fades between. Each scene shows one
  stretch of the recording (`startAt`, `speed`) inside `<Screen>`, with `TapRing`s at the taps,
  `Redact` boxes over private data, and one `Caption`.
- **Speed up waits** (spinners, "Sending…") with `speed` 2–4; **slow static review screens**
  (0.5–0.8) so fees and checks are readable. Never speed through something the viewer must read.
- **Tap rings**: the tap is the last frame before the screen reacts (not the first tile of the
  next screen — that is ~0.2 s late). Keep each ring's `<Sequence>` ≤ 0.6 s and end it before a
  hard cut, or it lingers on the next screen.
- **Hard-cut past animations that move covered content.** A redaction box is static; a page
  slide drags the row out from under it for a few frames. Two inner `<Sequence>`s in one scene
  (before the slide / after it) remove the problem.
- Composition length = sum of scene frames − 12 × fades. Recompute it in `Root.tsx` whenever a
  scene changes; `check.sh` enforces the store's limits.
- Start on the app's home screen when the story is "from the app you already have".

## 5. Captions

Four styles ship in `src/captions/` — glass pill, **kinetic** (default: words rise one by one,
the key phrase gets a hand-drawn underline), sticker, editorial (kicker + headline). Captions
sit in a band above the framed recording, so they never cover the app's own UI. To let the
owner choose, render `CaptionLab` once per style and tile them:

```bash
for s in glass kinetic sticker editorial; do
  npx remotion render CaptionLab out/styles/$s.mp4 --props="{\"captionStyle\":\"$s\"}"; done
ffmpeg -i out/styles/glass.mp4 -i out/styles/kinetic.mp4 -i out/styles/sticker.mp4 -i out/styles/editorial.mp4 \
  -filter_complex "[0]scale=443:960[a];[1]scale=443:960[b];[2]scale=443:960[c];[3]scale=443:960[d];[a][b][c][d]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0" \
  -c:v libx264 -pix_fmt yuv420p out/styles/caption-styles.mp4
```

The chosen style is the default in `src/captions/types.ts`.

Writing captions:
- One idea per scene, about 22 characters so it fits one line; a `highlight` phrase and,
  for the editorial style, a `kicker` (the flow name).
- **Only claim what the screen shows.** "In seconds" when it took nine is false; "verify once"
  is false if the app re-verifies; "any token" is false if some are refused. Match the app's
  own wording where it exists.
- No prices in captions (App Store), no "best", "#1", "new", "free", "download now" (Play).
- The end card discloses what the store requires — "Sign-in required." always for apps behind
  sign-in; add a risk line only when the video shows that product (a crypto purchase gets
  "Crypto prices can go down as well as up."; a plain send doesn't).

## 5b. Screenshots

`Screenshot.tsx` puts a headline over the backdrop and one frame of the app below. Register each
as a **one-frame `<Composition>` at 30 fps** (see `Root.tsx`), not a `<Still>` — a Still runs at
1 fps, so `at` rounds to whole seconds and misses moments like "amount typed, button enabled".
Use `formats.appStoreScreenshot` or `formats.playScreenshot`; for Play pass `headlineArea={470}`
to keep text under 20 % of the image. Pick moments that tell the story in one glance: the
amount, the review with fees, the result — not loading states.

## 6. Music and voice-over

- **Music**: `scripts/fetch-music.sh <mixkit-id>:<name>`; record each track in
  `public/music/LICENSE.md`. `<Soundtrack track=… />` fades in and out; pass `underVoice`
  when there is narration.
- **Voice-over** is optional — store previews autoplay muted, so captions must carry the story
  alone. If the owner wants it, follow `references/voiceover.md`: script timed to scene starts,
  a recording checklist, `scripts/voice-check.sh` to judge the take honestly, `scripts/voice.sh`
  to clean and split it, `<VoiceOver lines=… />` to place it. Don't promise autotune; on speech
  it sounds robotic.

## 7. Render, check, verify by eye

```bash
scripts/render.sh appstore TopUp Send BuyBtc -- ShotTopUp ShotSend     # or play / social
scripts/render.sh social BuyBtcSocial                                   # videos only is fine
```

`check.sh` must print PASS for every file. Then look: tile each video at 2–3 frames/s, and tile
**every frame** around each cut and redaction (`ffmpeg -vf "select='between(n,158,174)'…"`) —
that's where covered data leaks and captions overlap. Fix and re-render until clean.

## 8. Hand over

Open the renders for the owner (`open out/X.mp4`), commit the project, and report: a table of
files with lengths and PASS, what was covered or cut and why, every caption, anything the
footage couldn't honestly support (and what re-recording would fix), and what's still theirs
to decide (which three to submit, music, voice).
