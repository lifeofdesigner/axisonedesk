---
title: Security
last_updated: 2026-08-25
---

# 10_SECURITY

## Authentication

Supabase Auth (email/password per `/login`, `/signup`, `/forgot-password`). No social/SSO providers wired — see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Authentication Providers section for the target architecture (Google, Microsoft, Apple, GitHub, Facebook, LinkedIn, SAML, OIDC), none implemented today.

## Authorization / tenant isolation

- Row Level Security is the enforcement boundary. `current_org_ids()` scopes reads to the caller's orgs (via `organization_members`); `has_permission(org_id, key)` scopes writes to permission-holding roles. See [03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md).
- Platform-admin cross-tenant access is a **separate, narrow surface**: `security definer` RPCs (`0011_platform_admin_rpcs.sql`) each explicitly re-check `is_platform_admin(auth.uid())` inside the function body. This is the correct pattern to preserve — RLS is never relaxed for platform-admin use, a dedicated bypass path is used instead.
- Client-side RBAC enforcement (`usePermission`/`<Can>`) described in ARCHITECTURE.md is **not built** — `src/core/rbac/` is empty. Today's UI-level permission checks (where present) are ad hoc, not a shared library. This is a gap: enforcement correctness currently depends entirely on the RLS layer, which is correct for data access but means UI elements may not always hide/disable correctly based on permission.

## Audit logging

`audit_logs` table exists since `0010_platform_admin.sql`, naming convention fixed in `0023_security_center.sql` (`platform.` prefix). Viewable via the Platform Owner Portal's Audit Log and Security sections.

## Secrets

No secrets are currently stored in the app beyond `.env.example`'s two public, RLS-protected values (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). No provider API keys exist yet client- or server-side — `ai_providers` table exists for future credential storage but is not yet populated with a functioning integration. When real provider credentials are added, they must follow [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)'s security requirements (server-only storage, masked display, audited rotation, never shipped to the client).

## Not implemented

Rate limiting, 2FA, formal compliance program, penetration testing, disaster recovery runbook, key rotation tooling. Implementation guidance: [.ai/10_SECURITY.md](../../.ai/10_SECURITY.md).
