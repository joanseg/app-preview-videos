# Mapping footage: times, taps and boxes

## Timeline
`scripts/contact-sheet.sh <name> <start> <len> <fps>` tiles 13 frames per row; tile *i* is at
`start + i / fps` s. Start at 2 fps over the whole clip, then 4 fps over each transition you need
exactly. Note per screen: when it settles, when the tap lands (the frame before the next screen
starts moving), and any wait to speed up.

## Coordinates
Everything inside `<Screen>` is laid out as if the recording filled an 886 × 1920 frame:
- `TapRing x y` take **fractions** (0–1) of width and height.
- `Redact` boxes take **pixels on that 886 × 1920 frame**.

Measure from a full-size frame:
```bash
ffmpeg -ss 20.3 -i public/footage/send.mp4 -frames:v 1 -vf scale=886:-1 out/f.png
ffmpeg -i out/f.png -vf crop=886:500:0:450 out/f-crop.png   # zoom on a band; add 450 back to y
```
**Measuring text by eye is 25–45 px off** — enough to leave two letters of a domain showing.
Overlay a 10 px grid on a tight crop and read the edges from it:
```bash
ffmpeg -i out/f.png -vf "crop=500:120:100:480,scale=1000:-1,drawgrid=w=20:h=20:c=red@0.4" out/zoom.png
```
(no `drawgrid`/`drawtext` in some ffmpeg builds — then render the frame through Remotion with a
temporary outline on the `Redact` boxes instead). After building, **render the frame and crop
the box** to confirm every glyph is covered.

Recordings at a different aspect than 886:1920 (e.g. 1170 × 2532) are close enough to fit
`cover`; set `source` in `brand.ts` so the framed screen keeps the right shape.

## Redaction gotchas
- Boxes are static. If the screen scrolls or slides while a box is up, the content moves out
  from under it. Hard-cut past the motion (two inner `<Sequence>`s), or end the box's
  `<Sequence>` before the motion starts.
- Text that fades (a collapsing title, a scrolled-away line) is still readable at 30 % opacity —
  cover it too.
- Pad boxes ~6 px each side; recompression shifts edges.
- Verify with every frame around every cut:
  `ffmpeg -i out/X.mp4 -vf "select='between(n,158,174)',crop=…,scale=350:-1,tile=13x2" -vsync vfr out/check.png`
