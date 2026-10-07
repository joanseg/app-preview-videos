# app-preview-videos

A [Claude Code](https://claude.com/claude-code) skill that turns phone screen recordings of
your app into store-ready promo videos and screenshots.

Ask for it in plain words — *"make an App Store preview of the send flow from
~/Downloads/send.mp4, hide the email domain"* — and Claude:

- maps the recording into scenes and taps, and speeds up the waits
- covers personal data (emails, phone numbers, card details) and cuts failure screens
- frames the app under kinetic captions in your brand's colours and font
- adds tap rings, licensed background music and an end card with the required disclosures
- renders App Store previews (886×1920, 15–30 s), Google Play screenshots and 9:16 social cuts
- checks every file against the store's specs before you upload
- optionally checks and cleans a voice-over you record

It also tells you what to record, and what the footage can't honestly claim.

## Install

```bash
git clone https://github.com/joanseg/app-preview-videos ~/.claude/skills/app-preview-videos
```

Needs Node 20+, `ffmpeg`, and for the optional voice check `whisper-cli` with a ggml model.
Rendering uses [Remotion](https://www.remotion.dev) — free for individuals and companies of up
to three people; larger companies need a [Remotion licence](https://www.remotion.dev/license).

## What's inside

- `SKILL.md` — the workflow Claude follows
- `references/` — store specs and content rules, a recording checklist, footage mapping, voice-over
- `assets/template/` — the Remotion project each run starts from (captions in four styles,
  redaction, tap rings, end card, screenshots, spec check, voice clean-up)
- `scripts/new-project.sh` — creates a project from the template

Music is fetched from [Mixkit](https://mixkit.co) under its free licence; the bundled
Schibsted Grotesk font is under the SIL Open Font License.

## License

MIT
