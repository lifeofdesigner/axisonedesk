# Architecture Milestone — Content Package

This package documents the **Architecture & Source of Truth milestone** — the design phase
that came before any feature code, and the fact that two real feature milestones (Inventory,
Orders) shipped since without a schema rewrite or a broken module boundary.

**This is a documentation milestone, not a feature milestone** — there's no live app UI to
demo here (that's what `marketing-assets/phase-1/` and `marketing-assets/phase-2/` are for).
Instead, everything in this package is generated directly from real project artifacts:
`ARCHITECTURE.md`'s actual text, the real git log, the real folder tree, the real migration
files and line counts, a real `tsc`/`eslint`/`build` run, and — for the before/after and final
app slides — genuine screenshots already captured live in the Phase 1 and Phase 2 milestones.

## How this was made (read this before judging the videos as "AI slides")

Every video in this package is real content, rendered and animated — not a screen recording,
and not a fabricated demo. The pipeline: (1) real project data was pulled directly from the
repo — `ARCHITECTURE.md`, `git log`, migration files, a fresh `pnpm build`; (2) that data was
laid into a set of designed HTML pages (dark "engineering dossier" aesthetic, real content, no
lorem ipsum); (3) each page was rendered to a PNG via a headless browser; (4) the PNGs were
assembled into video with ffmpeg — a slow Ken Burns zoom on each slide, crossfade transitions
between them. No audio is included (see the voice-over script below if you want to add
narration yourself) and no desktop/screen recording was used anywhere in this package.

## What's here

```
marketing-assets/architecture/
├── INDEX.md                                    — this file
├── videos/
│   ├── architecture-15s-vertical.mp4           — 14.9s, 1080×1920
│   ├── architecture-30s-vertical.mp4           — 30.0s, 1080×1920
│   └── architecture-60s-landscape.mp4          — 57.3s, 1920×1080
└── screenshots/
    ├── hero/                    (3 images)     — cold-open / summary frames
    ├── architecture/            (5 images)     — tenant isolation, module boundaries, ER diagram
    ├── repository/              (2 images)     — folder tree, portrait + landscape
    ├── documentation/           (4 images)     — ARCHITECTURE.md excerpts, stack, migrations
    ├── git-history/             (2 images)     — commit log, doc→code timeline
    ├── terminal-proof/          (1 image)      — real tsc/eslint/build output
    └── before-after/            (1 image)      — schema sketch vs. shipped (embeds a real Phase 1 screenshot)
```

## Video contents, beat by beat

**`architecture-15s-vertical.mp4`** (6 slides, ~2.5s each): title → ARCHITECTURE.md opening →
module boundaries → folder tree → terminal proof → milestone summary. The fast cut for feed
scroll-past attention spans.

**`architecture-30s-vertical.mp4`** (all 10 slides, ~3s each): adds the technology stack, the
tenant-isolation/RLS principle, the real git log, and the migrations breakdown to the 15s cut.

**`architecture-60s-landscape.mp4`** (9 slides, ~6.3s each): the full walkthrough — title,
module boundaries (two-column, with the real cross-module-import bug caught during Orders
called out), folder organization, a database ER-style diagram of the `orders` →
`inventory_transactions` → `order_events` relationship, migrations, the documentation→git-history
timeline, a real before/after screenshot (mock data → live Supabase from Phase 1), the
architecture running in the actual shipped app (a real Phase 2 screenshot), and the closing
milestone summary.

## Voice-over script (optional — no audio is baked into the videos)

If you want to add narration in your editor, here's a script timed loosely to the 60s cut
(~9-10 words per 6s slide, conversational pace):

> [Title] "This is AxisOneDesk — a multi-tenant business OS. Before any code, we wrote this
> down." [Module boundaries] "Rule one: a module never imports another module directly — only
> core and shared." [Folders] "Feature-based structure — every module owns its own components,
> hooks, and API calls." [Database] "Every table is org-scoped. Money and stock events write to
> append-only ledgers, never edited in place." [Migrations] "Four migrations, nearly a thousand
> lines of SQL, every one applied and verified against the live database." [Doc-to-code] "The
> doc was approved first. Every commit since traces back to it." [Before/after] "The schema
> sketched in the doc became the schema running in production." [Final app] "Two modules,
> Inventory and Orders, both live on the exact same tenant-isolation layer this document
> specifies." [Closing] "Two milestones in, zero schema rewrites, zero broken boundaries. The
> architecture held."

For the 15s/30s cuts, use the corresponding sentences only (title, module boundaries, folders,
terminal proof or migrations, closing).

## Suggested captions

- **15s**: "We wrote the architecture doc before we wrote a single line of code. Two shipped
  modules later, it still holds up. 🧱 #softwarearchitecture #buildinpublic"
- **30s**: "Source-of-truth-first development, in one minute: the stack, the tenant-isolation
  rule, the folder structure, and the real git history proving the doc came first."
- **60s**: "A full walkthrough of the architecture behind AxisOneDesk — module boundaries,
  database design, and the exact moment a real bug (a cross-module import) got caught because
  the rule was written down first."

## Platform recommendations

| Asset | Platform | Notes |
|---|---|---|
| `architecture-15s-vertical.mp4` | Instagram Reels, TikTok, WhatsApp Status | Fastest cut, works with sound off (all text is on-screen) |
| `architecture-30s-vertical.mp4` | Instagram Reels, LinkedIn (vertical video post) | Best "one-stop summary" length |
| `architecture-60s-landscape.mp4` | YouTube, LinkedIn (landscape), X | The only cut with the database diagram and before/after — use where viewers will actually stop to read |
| `screenshots/hero/hero-landscape-title.png` | LinkedIn/X link-preview cover image | Reads well as a static cover |
| `screenshots/before-after/schema-sketch-vs-shipped.png` | Any platform, as a standalone post | Strongest single "proof" image in the set |
| `screenshots/terminal-proof/build-lint-typecheck.png` | Developer-facing platforms (dev.to, X dev community) | Pairs well with an engineering-process caption |

## Posting sequence (chronological)

1. Hero post — `hero-landscape-title.png` or the 15s video, "the doc before the code" framing.
2. `architecture-30s-vertical.mp4` — the fuller summary, 1-2 days later.
3. `before-after/schema-sketch-vs-shipped.png` as a standalone "proof" post.
4. `architecture-60s-landscape.mp4` on YouTube/LinkedIn as the deep-dive.
5. Engineering-audience post: `terminal-proof/build-lint-typecheck.png` + a caption about the
   cross-module-import bug caught during the Orders milestone specifically because the "never
   depend on another module" rule was written down in advance.

## CapCut edit guide (if you want to hand-edit further)

The videos are delivered as finished cuts, but if you want to remix them in CapCut/Premiere:

1. **Import the individual slide PNGs**, not just the finished MP4 — for higher-quality
   re-editing, ask for the `out-vertical`/`out-landscape` source PNGs (not included in this
   package by default to keep it lean; the finished MP4s already have the Ken Burns motion
   baked in).
2. **Match the pacing**: 2.5-3s per slide (15s/30s cuts), ~6.3s per slide (60s cut) — matches
   an unhurried but not sluggish reading pace for the amount of text per slide.
3. **Transitions**: all cuts use a simple 0.5-0.6s crossfade. If re-editing, avoid swipe/spin
   transitions — they fight the "engineering dossier" tone; a hard cut or crossfade both work.
4. **Add narration**: use the voice-over script above, roughly one bracketed line per slide.
5. **Captions/subtitles**: all key text is already burned into the slide art (headlines,
   stats, code) — auto-caption tools will mostly just re-transcribe on-screen text, which is
   fine/redundant but not harmful for accessibility.
6. **Color**: no color grading needed — the palette (near-black navy background, indigo/violet
   accent, mint-green success color) is final as rendered.

## Honesty notes

- No screen recording of any kind was used anywhere in this package (see the note at the top
  of this file for why — the source-of-truth section of this repo's history covers the earlier
  attempt and why it was abandoned).
- The terminal-proof slide's `tsc`/`eslint`/`build` output is real, run fresh during this
  milestone's build — not fabricated. Raw text is transcribed exactly, not paraphrased.
- The before/after and final-app slides embed **actual screenshots** captured live during the
  Phase 1 and Phase 2 milestones (found in `marketing-assets/phase-1/` and `phase-2/`) — not
  new fabricated mockups.
- No audio/narration is included in any video — the voice-over script above is provided as
  text for you to record yourself if desired, not synthesized or implied to exist already.
