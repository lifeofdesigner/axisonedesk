---
title: Security Playbook
---

# 10 — Security

## Purpose
Guide for closing the security gaps identified in [docs/10_SECURITY/INDEX.md](../docs/10_SECURITY/INDEX.md).

## Business Objective
Multi-tenant SaaS trust depends on demonstrable tenant isolation and credential hygiene — required before any serious sales motion, especially into regulated industries (Healthcare, Pharmacy in the Industry Engine's target list).

## Scope
Authentication hardening, authorization (client-side RBAC layer), RLS review discipline, secrets management, key rotation, audit logs, rate limiting, 2FA, compliance groundwork, penetration testing, disaster recovery.

## Out of Scope
Provider-specific credential handling mechanics (see [07_INTEGRATIONS.md](07_INTEGRATIONS.md), which implements the storage/rotation UI this playbook requires exist).

## Current Implementation
See [docs/10_SECURITY/INDEX.md](../docs/10_SECURITY/INDEX.md) in full. Summary of what's solid: RLS pattern (`current_org_ids()`/`has_permission()`), narrow `security definer` RPC surface for platform-admin, audit logging (`audit_logs`). Summary of gaps: no client-side RBAC library (`src/core/rbac/` empty), no 2FA, no rate limiting, no formal DR plan, no pen test history.

## Architecture Dependencies
Client-side RBAC library should be built to consume the existing `has_permission()`-equivalent logic (mirrored client-side via a cached permission set per session, not a second source of truth) rather than reimplementing permission logic in JS independently of the DB.

## Required Documentation
[docs/10_SECURITY/INDEX.md](../docs/10_SECURITY/INDEX.md), updated per phase.

## Required Database Changes
None for most phases; a `user_2fa` or equivalent table if 2FA is built without relying entirely on Supabase Auth's built-in MFA support (evaluate that first — it may already cover this).

## Migration Strategy
Additive; no existing security-relevant table should be altered without a reviewed migration and a rollback plan specific to that change.

## Implementation Phases
1. Build the client-side RBAC layer (`usePermission`/`<Can>`) per ARCHITECTURE.md's original design — closes the biggest documented gap between design intent and reality.
2. Enable Supabase Auth MFA (native support) rather than building 2FA from scratch — verify this before treating it as new work.
3. Rate limiting on auth endpoints and any future public-facing API surface.
4. Key rotation tooling as part of [07_INTEGRATIONS.md](07_INTEGRATIONS.md)'s Provider Registry hardening phase.
5. Formal disaster recovery runbook (backup verification, restore drill) — Supabase provides backups; verify restore procedure is actually tested, not just assumed to work.
6. Third-party penetration test once the product has paying customers and something worth testing (payment/AI integrations live).

## Implementation Order
1 → 2 → 3, then 4 (coupled to Integrations work) and 5 in parallel, 6 last (needs a stable target).

## Testing Strategy
Manual security review per phase; no automated security test suite exists. RLS policy review should be a standing checklist item for every new tenant table (see [docs/00_ADOS/DEFINITION_OF_DONE.md](../docs/00_ADOS/DEFINITION_OF_DONE.md)), not a one-time audit.

## Rollback Strategy
Each phase is independently revertible; RBAC library rollout should be additive (old ad hoc checks removed only after the new library is verified, not simultaneously).

## Risks
False sense of security if client-side RBAC is trusted as the enforcement boundary instead of a UX convenience — RLS remains the actual boundary regardless of what the client library does.

## Definition of Done
Per phase, matches [docs/00_ADOS/DEFINITION_OF_DONE.md](../docs/00_ADOS/DEFINITION_OF_DONE.md); overall track is "done" only in the sense of continuous practice, not a final state.

## Future Enhancements
SOC 2 readiness program once customer contracts require it.

## References
[docs/10_SECURITY/INDEX.md](../docs/10_SECURITY/INDEX.md) · [docs/02_ARCHITECTURE/INDEX.md](../docs/02_ARCHITECTURE/INDEX.md) · [07_INTEGRATIONS.md](07_INTEGRATIONS.md)
