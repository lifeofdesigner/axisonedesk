# Devlog recording — shot script

Self-record these 6 clips (I couldn't reliably automate screen capture on this machine
without risking grabbing your real desktop — see note at the bottom). Suggested tool:
**Xbox Game Bar** (`Win+Alt+R` to start/stop, records the focused window) or any
recorder you prefer. Vertical framing: resize the window to roughly **608×1080** or
similar portrait ratio before recording, positioned wherever's convenient — Game Bar
records the window, not a fixed screen region, so exact position doesn't matter.

Save each clip into `marketing-assets/devlog/raw-clips/` as you go, named per the table
below. Once they're there, tell me and I'll write the real `INDEX.md` from the actual
files (durations, etc.) — not before, since I don't want to describe clips that don't
exist yet.

## Before you start

- Close any tabs/panels/notifications you don't want visible.
- If your terminal has any env vars or shell history with tokens, clear scrollback
  first (`clear` / `Ctrl+L`) so nothing old is visible when the terminal panel opens.
- Turn off notification popups (Slack/email/etc.) for the few minutes you're recording.

## Clip 1 — `01-architecture-scroll.mp4` (10–12s)

1. Open `ARCHITECTURE.md` (Ctrl+P, type it, Enter).
2. Let it render for a beat.
3. Scroll slowly from top to bottom — pause ~1s on each `##` heading, keep the rest
   moving at a steady, unhurried pace. Don't scroll past the end; stop near the bottom.

## Clip 2 — `02-explorer.mp4` (8–10s)

1. Open Explorer (Ctrl+Shift+E) if not already open.
2. Scroll/click to briefly expand: `src`, then within it `modules`, `core`, `shared`,
   then scroll down to `supabase`. A couple seconds on each is enough — don't drill
   into individual files, just show the folder shapes.

## Clip 3 — `03-source-control.mp4` (6–8s)

1. Open Source Control (Ctrl+Shift+G).
2. Let the changed-files / commit graph render.
3. Slight scroll through recent commits if the list is long enough to scroll.

## Clip 4 — `04-terminal.mp4` (12–15s)

1. Open the integrated terminal (`` Ctrl+` ``).
2. Run, one at a time, letting each finish before the next:
   ```
   git status
   pnpm exec eslint . --quiet
   pnpm exec tsc -b
   npx supabase migration list --linked
   ```
3. **Before recording**, double check nothing in your shell history/prompt shows a
   token, `.env` value, or path you don't want public — the four commands above don't
   print any secrets themselves, but your prompt or scrollback might have older stuff.

## Clip 5 — `05-github-repo.mp4` (8–10s)

1. Open `https://github.com/lifeofdesigner/axisonedesk` in a fresh tab/window.
2. Slow scroll down through the README/file list, pause briefly near the top.

## Clip 6 — `06-gist.mp4` (8–10s)

1. Open `https://gist.github.com/lifeofdesigner/ec45156c968be6531c0983388904a6d9`.
2. Slow scroll through the Phase 1 / Phase 2 sections, pausing on section headers.

## Why I'm not automating this

I built a screen-recording pipeline (ffmpeg + scripted mouse/keyboard) and hit three
separate near-misses where it captured your *actual* live desktop instead of the
intended app — once with no safety check at all, twice more even after I added
verification, because the checks I wrote (window bounds, then process name) weren't
strict enough to rule out your own already-open windows. Each time I caught it before
anything left this session and deleted the clip immediately, but I don't trust the
approach enough to keep iterating on it against your real screen. Self-recording with
Game Bar sidesteps the whole problem — it only ever captures the window you point it at.
