---
title: Credential Rotation Runbook
---
# CREDENTIAL_ROTATION

Applies to any provider credential once [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)'s Provider Registry exists — today, only Supabase's own keys (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) and any `ai_providers` config are relevant.

1. Generate the new credential at the provider's dashboard — don't reuse/extend the old one.
2. Update the credential in the Platform Owner Portal (once the general Provider Registry exists) or Supabase project settings/Vercel env vars for platform-level credentials — never commit a credential to the repo.
3. Verify the new credential works (test-connection functionality, once built per [.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md)) before revoking the old one.
4. Revoke the old credential at the provider.
5. Log the rotation in `audit_logs` (extend the existing table, don't create a parallel log).

See [SECRET_ROTATION.md](SECRET_ROTATION.md) for the distinction between provider credentials (this runbook) and AxisOneDesk's own signing secrets/tokens.
