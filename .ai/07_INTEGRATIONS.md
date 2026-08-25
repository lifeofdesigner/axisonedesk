---
title: Integrations Implementation Playbook
---

# 07 — Integrations (Provider Registry Implementation)

## Purpose
Implementation guide for building the generic Provider Registry and wiring real providers, as defined in [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (the Source of Truth for what providers/fields are needed — this playbook is the *how*, not a restatement of *what*).

## Business Objective
Unlock billing (revenue), AI (product differentiation), and communications (notifications beyond in-app) — currently all blocked on zero live provider integrations.

## Scope
Generic Provider Registry table + admin UI; adapter pattern per category; first real integrations (one payment provider, the AI provider call path, one communication provider).

## Out of Scope
The AI-specific call logic itself (see [05_AI_SYSTEM.md](05_AI_SYSTEM.md)) — this playbook covers the registry/credential layer underneath it.

## Current Implementation
Only `ai_providers` exists (`0021_ai_provider_management.sql`), and it's category-specific, not generic. See [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) for full current-state detail.

## Architecture Dependencies
Credentials must never reach the client — server-only (Edge Function), matching the AI system's stated design intent. Must reuse `audit_logs` for credential-change auditing and `roles`/`permissions` for who can manage providers.

## Required Documentation
[docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) is updated as each provider category goes live.

## Required Database Changes
`provider_registry` (generic): key, category, name, enabled, config (jsonb, encrypted secrets separated out), environment, health_status, last_tested_at, created_by, updated_at. Consider a separate `provider_secrets` table (or Supabase Vault) so secret values are never in a queryable-by-mistake jsonb blob alongside non-secret config.

## Migration Strategy
Additive `provider_registry` table. Migrate `ai_providers` data into it as a follow-up once the generic registry is proven, rather than day one — avoid breaking the one thing that already works.

## Implementation Phases
1. `provider_registry` table + Platform Owner Portal "Integrations" section (list/add/edit/enable/disable/test-connection), modeled on the existing `/ai-providers` UI pattern.
2. Credential storage hardening (Supabase Vault or equivalent encryption-at-rest, masked display, rotation).
3. First real payment provider (pick one — Stripe is the most-referenced in ARCHITECTURE.md's design intent) wired end-to-end: checkout → webhook → `subscriptions` update.
4. First real communication provider (email, e.g. Resend/SendGrid) for outbound notifications beyond in-app.
5. Migrate `ai_providers` into the generic registry once patterns are proven.
6. Remaining categories (storage, analytics, maps, video, file, auth) by product priority.

## Implementation Order
1 → 2 (security-critical, don't skip) → 3 and 4 can proceed in parallel → 5 → 6.

## Testing Strategy
Test-connection functionality per provider is the primary verification tool; sandbox/test-mode credentials required before any live-mode testing.

## Rollback Strategy
Each provider is independently enable/disable-able from the registry — a bad integration doesn't require a code rollback, just a config toggle.

## Risks
Credential leakage if Phase 2 (hardening) is skipped or rushed — treat this as a hard blocker before any category goes to live-mode credentials, not a nice-to-have.

## Definition of Done
A Platform Owner can add a payment provider's credentials through the UI, test the connection, and a real tenant subscription can be created/charged through it without any code change.

## Future Enhancements
Per-country/per-industry default provider routing (mentioned in PROVIDER_MANAGEMENT.md's Payment Providers section).

## References
[docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) · [docs/08_BILLING/INDEX.md](../docs/08_BILLING/INDEX.md) · [docs/10_SECURITY/INDEX.md](../docs/10_SECURITY/INDEX.md)
