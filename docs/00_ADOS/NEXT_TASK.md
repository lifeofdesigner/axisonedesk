---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: needs a human, not more AI-driven implementation

All the code for Industry Module Engine Phase 3b is shipped and live: full onboarding field collection, registry-driven module-defaults application, audit logging, all gated behind `onboarding.industry_registry_picker` (currently OFF). See [ROADMAP.md](ROADMAP.md) and ADR-009/ADR-010 in [DECISIONS.md](DECISIONS.md).

**What's genuinely blocking further automated progress**: flipping the flag to default-on requires a real end-to-end signup through the actual browser UI, confirming:
1. A new org gets `organization_type_key` set correctly (both via the new registry picker and via the legacy picker's automatic mapping fallback).
2. `org_feature_flags` rows match the selected organization type's `organization_type_modules` defaults.
3. The `organization.created` audit log entry appears correctly in `audit_logs`.
4. The full-profile fields (company size, employees, branches, warehouses, country, timezone, currency, language) persist correctly.
5. The legacy flow (flag off) still works completely unchanged.

This needs a human with legitimate access to a test account against a database it's safe to write test data to (confirm whether "Axis" — the live project this app currently points at — is safe for that, or whether a separate test/staging project should be used instead). Once confirmed:
```sql
update public.feature_flags set default_enabled = true where key = 'onboarding.industry_registry_picker';
```
or via the Platform Owner Portal's Feature Flags UI (`/feature-flags`).

## After the flag is flipped and confirmed working

**Industry Module Engine Phase 4**: Platform Owner Portal "Industries" management UI + Navigation/Dashboard generation from the registry. Per current instruction, this was explicitly not started this session ("do not begin Navigation Generation. do not begin Module Registry rendering"). This is also where "Dashboard Configuration" (requested but not built in Phase 3b — see ADR-010) would actually get designed and built, once there's a real navigation/dashboard system for it to configure.

**Do not start Phase 4 without explicit instruction.**

## Also worth doing, not yet prioritized

- Cosmetic follow-up: `OrgSwitcher.tsx`, `SidebarNav.tsx`, `TenantDetailPage.tsx` still display the legacy `businessType` label — deliberately deferred to avoid restyling twice once Phase 4 navigation exists (ADR-009 item 5).
- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md). Note: an actual test suite with a seeded test database would have let this session verify the onboarding flow end-to-end without needing a human — worth weighing against other priorities.
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md).
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
