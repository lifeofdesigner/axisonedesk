---
title: Known Issues
last_updated: 2026-08-25
---

# Known Issues

Verified gaps between what exists and what a launch-ready product needs. Not speculative — each line is confirmed against source.

| Issue | Area | Severity | Notes |
|---|---|---|---|
| No automated tests exist | Quality | High | `tests/unit`, `tests/e2e`, `tests/docs` are empty scaffold folders; no test framework in `package.json`. See [11_TESTING/INDEX.md](../11_TESTING/INDEX.md). |
| No CI/CD pipeline | DevOps | High | No `.github/workflows`. Only `vercel.json` exists (SPA rewrite). See [12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md). |
| AI Assistant is a disabled shell | AI | Medium | `src/modules/ai-assistant/AiAssistantOverview.tsx` explicitly disables input — no LLM provider wired. Config tables exist, no call path. See [06_AI/INDEX.md](../06_AI/INDEX.md). |
| No live payment provider | Billing | High (blocks real revenue) | `plans`/`subscriptions`/`coupons`/`invoices` are DB-managed only; migration `0014` comment confirms no Stripe integration. See [08_BILLING/INDEX.md](../08_BILLING/INDEX.md). |
| `src/core/rbac/` is empty | Auth | Medium | ARCHITECTURE.md describes a `usePermission`/`<Can>` client library that was never built; permission enforcement today is DB-side (`has_permission()`) plus ad hoc UI checks. |
| No Supabase Edge Functions deployed | Backend | Medium | `supabase/functions/` has only an empty `_shared/`. `platform_edge_functions` table (from Developer Tools) is a registry/catalog, not actual deployed functions. |
| POS module scaffolded but not routed | Modules | Low | `src/modules/pos/` exists with no route in `src/router.tsx` and no page in `src/pages/`. |
| No error tracking / analytics wired | Observability | Medium | No Sentry, PostHog, or similar in dependencies despite being named in ARCHITECTURE.md. System Health module only reads in-app `error_logs`. |
| `factorymvp_*` tables in generated types | Data hygiene | Low | Unrelated project sharing the same Supabase instance. Never attribute these tables to AxisOneDesk in docs or code. |
| ARCHITECTURE.md overstates implementation | Documentation | Medium | It's a pre-build design doc ("Approved", dated 2026-08-21) describing intended structure, not always what's built. Always verify against code before citing it. |
| Migration `0026_module_registry.sql` not applied to any live database | Database | Medium | Written 2026-08-25 (Industry Engine Phase 1); this environment has no authenticated Supabase CLI access to the actual linked project. See [docs/00_ADOS/NEXT_TASK.md](NEXT_TASK.md) for the resolution steps. `database.types.ts` additions for `modules` were hand-authored pending CLI regeneration. |

Add new entries here as discovered. Remove entries once fixed and note the fixing commit in [CHANGELOG.md](CHANGELOG.md).
