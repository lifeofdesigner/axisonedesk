---
title: Deployment
last_updated: 2026-08-25
---

# 12_DEPLOYMENT

## Current state

- **Build**: `pnpm build` → `tsc -b && vite build`.
- **Deploy target**: Vercel. `vercel.json` at repo root contains only an SPA rewrite (so client-side routes resolve on refresh/deep-link) — no custom build config.
- **CI/CD**: **none exists.** No `.github/workflows` directory. Builds/lints are run manually, if at all.
- **Environment variables**: only two, both public/client-safe (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, per `.env.example`). No server-only secrets exist yet because no live third-party providers are integrated (see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)).
- **Database migrations**: applied via Supabase CLI against a linked project (`supabase/config.toml`, `supabase/.temp/`) — no automated migration-on-deploy pipeline observed.

## Gaps

No CI means a broken build or lint failure can reach `main` unnoticed. Recommended minimum: a GitHub Actions workflow running `pnpm build` + `pnpm lint` on every PR, before any test suite even exists. See [00_ADOS/RISK_REGISTER.md](../00_ADOS/RISK_REGISTER.md).
