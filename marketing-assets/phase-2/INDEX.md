# Phase 2 — Orders Module — Content Package

This package documents the Orders module built for AxisOneDesk: order creation with live
inventory validation and deduction, payment/fulfillment status tracking, cancellation-restock,
customer management, order timeline, and notes — all against the real hosted Supabase project.

## What's here

```
marketing-assets/phase-2/
├── INDEX.md                          — this file
├── screenshots/                      — 20 real, live-captured screenshots
│   ├── desktop-light-*.png  (5)      — 1440×900, light mode
│   ├── desktop-dark-*.png   (5)      — 1440×900, dark mode
│   ├── mobile-light-*.png   (5)      — 390×844, light mode
│   └── mobile-dark-*.png    (5)      — 390×844, dark mode
└── proof/
    ├── build-typecheck-lint.txt      — tsc -b + eslint + vite build, raw output
    ├── database-verification.md      — live SQL verification of orders/inventory/RLS
    ├── bugs-found.md                 — 3 real bugs caught during this milestone, root cause + fix
    └── query-order-events.sql        — one of the verification queries used, for reproducibility
```

## What was NOT produced, and why

This milestone explicitly asked for 15s/30s/60s vertical/walkthrough videos and GIF-worthy
moments. **No video or GIF was produced.** This environment has no `ffmpeg` or any video/GIF
encoder available — there is no way to actually render one, and fabricating a description of a
video that doesn't exist would violate the "do not fabricate" instruction directly. What exists
instead is the full set of static screenshots below, each genuinely captured via a live,
Playwright-driven browser session against the real running app and real database — not mocked,
not staged with fake data.

If video capability becomes available in a future session, the shot list below is written so a
screen recording could follow it directly.

## Screenshots — descriptions & recommended use

| File | Description | Recommended use |
|---|---|---|
| `desktop-light-orders-overview.png` | Orders dashboard: 4 KPI cards (Total orders, Awaiting payment, Awaiting fulfillment, Revenue) + recent orders table, 2 real orders with different statuses | **Hero image** — most complete single view of the feature |
| `desktop-dark-orders-overview.png` | Same view, dark mode | Dark-mode proof / theme-toggle comparison post |
| `desktop-light-order-detail.png` | Full order detail: line items, 4-event timeline, status selectors, summary, customer card | Best "depth" shot — shows the whole feature surface in one frame |
| `desktop-dark-order-detail.png` | Same, dark mode | Pair with the light version for a before/after-style split post |
| `desktop-light-create-order.png` | Empty create-order form: customer combobox, product search, discount/tax/shipping, live totals | Good for a "how it works" carousel first slide |
| `desktop-dark-create-order.png` | Same, dark mode | — |
| `desktop-light-orders-list.png` / `-dark-` | All-orders list view with search/filter controls | Supporting slide, not hero material |
| `desktop-light-customers.png` / `-dark-` | Customer list | Supporting slide |
| `mobile-*-order-detail.png` (4 variants) | Order detail on a 390px viewport — cards stack vertically, timeline and status controls fully usable | **Best mobile-responsive proof** — most information-dense mobile view |
| `mobile-*-orders-overview.png`, `-orders-list.png`, `-customers.png`, `-create-order.png` | Remaining mobile views | Fill-in content for a "works everywhere" carousel |

**Zoom/crop moments** (if editing for social): the KPI-card row on
`desktop-light-orders-overview.png`, and the 4-event timeline column on
`desktop-light-order-detail.png` — both read clearly even cropped tightly.

**Cover image recommendation:** `desktop-dark-order-detail.png`, full-page. It's the single frame
that shows the most real, working functionality at once — line items, badges, a real multi-event
timeline, live status controls, and computed totals — without needing explanation.

## Suggested posting sequence

1. **Hero post** — `desktop-light-orders-overview.png`, caption focused on the KPI cards being
   real-time and computed from live data, not static.
2. **Depth post** — `desktop-light-order-detail.png` next to `mobile-light-order-detail.png`,
   captioned around the order timeline (a real audit trail: every status change and note is
   logged, not just displayed).
3. **Dark mode post** — `desktop-dark-order-detail.png`, captioned as the theme-toggle proof.
4. **"Under the hood" post** — pull 2–3 lines from `proof/database-verification.md` (the
   inventory-deduction table showing exact `inventory_transactions` rows), framed as "an order
   isn't just a database row — it's atomic with your stock count."
5. **Engineering post** (developer-facing platforms only) — `proof/bugs-found.md` bug #1 (the
   missing `security definer`), framed honestly as "here's a bug that would have broken
   cancellations in production, caught before it shipped."

## Platform notes

- Desktop screenshots (16:9-ish, 1440×900) suit LinkedIn/X/blog embeds.
- Mobile screenshots (390×844, ~9:19.5) suit Instagram/TikTok static posts if a video is produced
  later; as static images they work as carousel slides on any platform.
- No video exists yet — do not schedule a video-format post from this package.
