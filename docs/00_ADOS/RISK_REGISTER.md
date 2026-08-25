---
title: Risk Register
last_updated: 2026-08-25
---

# Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Shipping to production with zero automated tests | High | High | Stand up minimal Vitest/RTL coverage for RLS-sensitive flows (auth, org switching, RBAC-gated actions) before opening to real customers |
| No CI means broken builds can be committed/merged unnoticed | Medium | Medium | Add a CI workflow running `pnpm build` + `pnpm lint` (see [12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md)) |
| Cross-tenant data leakage via a future migration that forgets RLS | Low (pattern is well-established) | Critical | Every new tenant table must follow the `current_org_ids()`/`has_permission()` pattern from `0001_init.sql`; review this specifically in any DB PR |
| Platform-admin `security definer` RPCs are a concentrated privilege-escalation surface | Low | Critical | Every RPC in this class must explicitly re-check `is_platform_admin(auth.uid())` inside the function body; audit this list in [10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md) whenever a new one is added |
| Industry Module Engine build touches onboarding + navigation + RBAC simultaneously | Medium | High | Phase the rollout per [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md); ship Module Registry first as a read-only layer before anything depends on it for gating |
| ARCHITECTURE.md cited as fact by a future session without verification | Medium | Medium | [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md) explicitly flags this; SESSION_START requires cross-checking docs against code |
| Secrets/API keys added to client-side env by mistake once real providers are integrated | Low today (none integrated yet), rises as Provider Management is built | Critical | [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) mandates server-only credential storage, masked display, no client exposure |
