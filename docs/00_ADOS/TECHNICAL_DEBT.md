---
title: Technical Debt
last_updated: 2026-08-25
---

# Technical Debt

Deliberate or discovered shortcuts, tracked so they don't silently become permanent.

| Item | Area | Why it's debt | Payoff plan |
|---|---|---|---|
| No automated tests | Quality | 20 modules shipped with zero regression coverage; every change risks silent breakage | See [.ai/](../../.ai/) — no dedicated testing playbook yet; add one before large refactors begin |
| No CI | DevOps | Build/lint/typecheck only run manually, if at all | Add `.github/workflows/ci.yml` running `pnpm build` + `pnpm lint` on PRs |
| `src/core/rbac/` empty | Auth | Permission checks are DB-side only or ad hoc in UI; no reusable `usePermission`/`<Can>` | Build per ARCHITECTURE.md's original design once a concrete UI need forces the issue |
| Billing has no payment provider | Billing | Plans/subscriptions/invoices are manually managed; can't actually charge a customer | See [08_BILLING/INDEX.md](../08_BILLING/INDEX.md) and [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) |
| AI Assistant has no live provider | AI | UI shell exists, disabled; config tables exist, unused | See [06_AI/INDEX.md](../06_AI/INDEX.md) |
| `platform_edge_functions` is a registry, not real functions | Backend | Developer Tools module implies deployed Edge Functions exist; they don't | Either deploy real functions matching the registry, or relabel the UI to make clear it's a catalog |
| POS module scaffolded, unrouted | Modules | Dead code risk — `src/modules/pos/` with no route | Either finish and route it, or remove it if abandoned |
| ARCHITECTURE.md diverges from implementation in places | Documentation | Risk of future sessions trusting stale design intent as fact | ADOS (this system) is now the check against that drift — every session must verify, not just cite |

Remove a row once resolved; note the resolving commit in [CHANGELOG.md](CHANGELOG.md).
