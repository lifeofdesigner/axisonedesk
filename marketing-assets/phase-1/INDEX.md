# Phase 1 Content Package — Inventory Module (Live Supabase)

Every asset here was captured from the real running app against the live Supabase
project (see `ARCHITECTURE.md` and the engineering Gist for the technical writeup),
using a seeded demo workspace ("Retail Admin"). Nothing in this folder is a mockup.

**Two honest limitations, flagged rather than faked:**
- No video-editing tool is available in this environment, so the 15s/30s/60s clips
  below are each a *separately scripted recording* timed to that length — not one
  master video cut three ways. Good enough to post as-is; trim further if you want tighter cuts.
- No `.gif` encoder is available (no ffmpeg), so "GIF-worthy moments" are documented
  as timestamp ranges into the videos below, not delivered as `.gif` files. Any
  screen-to-GIF tool (ScreenToGif, Kap, ezgif.com) can cut these directly from the
  `.webm` files using the timestamps given.

---

## 1. Videos — `01-videos/`

| File | Format | Length | Contents |
|---|---|---|---|
| `demo-15s-vertical.webm` | 720×1280 (9:16) | ~13s | Inventory overview → Products → Product detail → stock adjustment toast |
| `demo-30s-vertical.webm` | 720×1280 (9:16) | ~26s | Dashboard → Inventory (mobile menu) → Products → Product detail + Activity log → stock adjustment → Overview |
| `demo-60s-walkthrough.webm` | 1440×900 (16:9) | ~48s | Full tour: Dashboard → Inventory → dark mode toggle → Categories → Products → Product detail (both tabs) → full Add Product wizard → stock adjustment → Overview with updated chart |

**Platform use**: 15s → WhatsApp Status, Instagram/Facebook Story. 30s → Instagram Reel, Facebook Reel, TikTok. 60s → LinkedIn native video, YouTube Short, X video post.

### GIF-worthy moments (cut from the videos above with any screen-recorder GIF tool)

| Moment | Source | Approx. timestamp | Why |
|---|---|---|---|
| Toast: "Stock updated" appearing | `demo-15s-vertical.webm` | ~0:10–0:13 | Payoff moment — instant, satisfying confirmation |
| Chart bar appearing after adjustment | `demo-60s-walkthrough.webm` | ~0:44–0:48 | Visually proves the data is live, not static |
| Add Product wizard step transitions | `demo-60s-walkthrough.webm` | ~0:18–0:30 | Smooth multi-step UI, good for "look how clean this is" |
| Dark mode toggle | `demo-60s-walkthrough.webm` | ~0:06–0:08 | Quick, satisfying UI flex |

---

## 2. Screenshots — Desktop, Light — `02-screenshots-desktop-light/`

| File | Screen |
|---|---|
| `01-dashboard.png` | Business dashboard (revenue, orders, recent activity) |
| `02-inventory-overview.png` | Inventory KPIs + stock movement chart + categories panel |
| `03-products.png` | Products table — search, filters, pagination |
| `04-product-detail.png` | Product detail — pricing, inventory, supplier, stock history, barcode |
| `05-categories.png` | Categories grid with live product counts |
| `06-add-product.png` | Add Product wizard, step 1 |
| `07-stock-adjustment.png` | Stock adjustment form + history panel |
| `08-login.png` | Sign-in screen |
| `09-signup.png` | Create-account screen |

## 3. Screenshots — Desktop, Dark — `03-screenshots-desktop-dark/`

Same core screens (`01`–`05`) rendered in dark mode — full theme parity, not an inverted afterthought.

## 4. Screenshots — Mobile — `04-screenshots-mobile/`

390×844 viewport. `01`–`05` cover dashboard, inventory overview, products, product detail, and login; `06` is the dashboard in dark mode on mobile.

## 5. Hero shots — `05-hero/`

Above-the-fold crops (no scroll), for use as a link preview image / cover image / first frame of a carousel.

- `hero-inventory-overview.png` — **recommended primary hero**: KPIs + live chart in one frame, immediately reads as "working system"
- `hero-product-detail.png` — alternate hero, good for "look at the detail" framing

## 6. Before / After — `06-before-after/`

Side-by-side composites: left = Phase 1 (in-memory mock data), right = this milestone (live Postgres). Same UI both sides — the point is the data source changed underneath it, honestly labeled on each frame.

- `before-after-inventory-overview.png`
- `before-after-products-table.png`
- `before-after-product-detail.png`

## 7. Proof — CLI — `07-proof-cli/`

Styled terminal renders of **real command output** captured during this milestone (not literal OS screenshots — this environment has no visible terminal window to screenshot — but every line of text shown is verbatim from the actual commands run).

- `01-migration-list.png` — `supabase migration list`, all 3 migrations applied
- `02-db-push.png` — `supabase db push` applying the inventory migrations

## 8. Proof — Database — `08-proof-database/`

Same styling, real query output. **Not a Supabase Studio dashboard screenshot** — no browser session into supabase.com was available in this environment, so these are the actual `db query` results presented as terminal cards instead of pretending to be the web UI.

- `01-tables-reachable.png` — all 10 application tables returning HTTP 200 on the live REST API
- `02-rls-coverage.png` — RLS enabled + policy counts, queried directly from `pg_policy`
- `03-functions-triggers.png` — every helper function and trigger confirmed present

## 9. Proof — Build — `09-proof-build/`

- `01-typecheck.png` — `tsc -b`, zero errors
- `02-lint.png` — `eslint .`, zero errors (9 pre-existing benign warnings)
- `03-build.png` — `pnpm build`, production build succeeds

## 10. Product showcase — `10-showcase-products/`

- `products-grid-full.png` — clean above-the-fold products table
- `product-detail-activity-log.png` — product detail on the Activity Log tab
- `add-product-review-step.png` — wizard's final review step before submit

## 11. Dashboard showcase — `11-showcase-dashboard/`

- `business-dashboard.png`
- `inventory-dashboard-chart.png`

---

## Chronological asset list (for a social media posting sequence)

Post in this order to tell the story of the milestone, one post per day/session:

1. **Day 1 — the hook**: `05-hero/hero-inventory-overview.png` + 15s vertical video. Caption theme: *"live database, not a mockup."*
2. **Day 2 — the before/after**: all 3 images in `06-before-after/`. Caption theme: *"same screens, real backend now."*
3. **Day 3 — the proof**: `07-proof-cli/`, `08-proof-database/`, `09-proof-build/` as a carousel. Caption theme: *"the unglamorous part that makes it real."*
4. **Day 4 — the walkthrough**: 60s video. Caption theme: *"full tour."*
5. **Day 5 — mobile + dark mode**: `04-screenshots-mobile/` + `03-screenshots-desktop-dark/` as a carousel. Caption theme: *"works everywhere, looks good doing it."*
6. **Day 6 — the product deep-dive**: `10-showcase-products/` carousel + 30s vertical video. Caption theme: *"adding a product, live."*
7. **Day 7 — wrap-up**: `11-showcase-dashboard/` + link to the write-up. Caption theme: *"milestone complete — what's next."*

## Platform quick-reference

| Platform | Best assets | Format notes |
|---|---|---|
| **WhatsApp Status** | 15s vertical video, hero screenshot | Vertical only, keep text minimal |
| **Instagram** | 30s vertical video (Reel), before/after carousel, mobile screenshots | Square/vertical crops preferred for feed posts |
| **Facebook** | 30s vertical (Reel) or 60s (feed video), before/after images | Feed video can be landscape |
| **LinkedIn** | 60s walkthrough, proof screenshots carousel, before/after | Landscape video native upload performs best; pair with the written case-study style caption |
| **X / Threads** | 15s or 30s vertical, single proof screenshot | Keep it terse, thread the details |

## Caption theme reference (honest framing — see engineering Gist for full context)

This is a self-initiated product build (AxisOneDesk), documented as real portfolio work — not a client engagement, not a demo/tutorial. Caption language should read as genuine progress on a real product:

- *"Completed another milestone on my Business OS build — Inventory is now running on a live Supabase database instead of mock data."*
- *"Found and fixed two real bugs testing this live that code review alone wouldn't have caught."*
- *"Row-level security on every table, an atomic stock-adjustment transaction, real-time charts from a real ledger table."*

Avoid implying a paid client relationship exists — the org name shown ("Retail Admin") is placeholder branding, and the product data is realistic seed data, not a real business's records.
