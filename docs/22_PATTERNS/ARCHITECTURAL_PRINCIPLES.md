---
title: Architectural Principles
last_updated: 2026-08-25
---

# Architectural Principles

These govern all future AxisOneDesk development. Each principle notes how it shows up in the codebase today (real, verified) and/or where it's a target not yet fully realized.

1. **Configuration over hardcoding.** Real today for feature flags (`feature_flags`/`org_feature_flags`) and branding (`platform_settings`). Not yet real for module availability (hardcoded in `router.tsx`) or industry behavior — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md).
2. **Single Source of Truth.** Database schema truth = migrations + `database.types.ts`. Doc truth = ADOS. Never let a second table/doc/API silently become an alternate truth for the same fact.
3. **Registry-driven architecture.** Real for RBAC (`permissions`/`roles` tables consumed by `has_permission()`). Not yet real for modules/industries/providers — see [docs/18_REFERENCE/MODULE_REGISTRY.md](../18_REFERENCE/MODULE_REGISTRY.md) and [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md), [.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md).
4. **Module-driven architecture.** Real: each feature is a self-contained module (`api.ts`/`hooks.ts`/components/route). Target: modules described by a registry, not just convention.
5. **Industry-driven architecture.** Target only — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md).
6. **Organization-driven architecture.** Target only — Organization Type Library, same playbook.
7. **White-label architecture.** Real for branding (`platform_settings` platform-default + per-tenant override).
8. **Multi-tenant isolation.** Real and load-bearing — RLS via `current_org_ids()`/`has_permission()` on every tenant table (see [docs/18_REFERENCE/RLS_POLICY_REGISTRY.md](../18_REFERENCE/RLS_POLICY_REGISTRY.md)). This is the one principle with zero tolerance for exceptions.
9. **Provider abstraction.** Real only for AI config (`ai_providers`, still no live call path). Target for every other category — see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).
10. **Feature flags.** Real — `feature_flags`/`org_feature_flags`, two-table global-default + per-org-override model.
11. **Extensibility.** Partial — module pattern makes adding modules straightforward; Marketplace/plugin extensibility for third parties doesn't exist (see [.ai/08_MARKETPLACE.md](../../.ai/08_MARKETPLACE.md)).
12. **Backward compatibility.** Real practice — migrations are additive, never edited post-ship (see [docs/21_GOVERNANCE/MIGRATION_STANDARDS.md](../21_GOVERNANCE/MIGRATION_STANDARDS.md)).
13. **Security by default.** Real — RLS enabled on every tenant table by convention; platform-admin access via narrow `security definer` RPCs, never relaxed RLS.
14. **Auditability.** Real — `audit_logs` table exists and is used across platform-admin operations.
15. **Observability.** Weak — only in-app `error_logs`, no external error tracking/analytics (see [docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md)).
16. **Scalability.** Largely untested — no load testing has been performed; architecture (RLS-scoped Postgres queries, TanStack Query caching, lazy-loaded routes) is sound in principle but unverified under real load (see [.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md)).

## Never skip architectural foundations

Before implementing a higher-level feature, confirm its required registry/configuration layer/Source of Truth already exists. Building on top of a hardcoded stand-in (rather than the eventual registry) creates a second migration burden later. This principle is now also stated as a permanent rule in [docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md).

## References
[docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md) · [docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md)
