---
title: Secret Rotation Runbook
---
# SECRET_ROTATION

Distinct from [CREDENTIAL_ROTATION.md](CREDENTIAL_ROTATION.md) (third-party provider credentials) — this covers AxisOneDesk's own secrets: the Supabase service role key, webhook signing secrets, any future session/JWT signing configuration.

1. Supabase service role key: rotate via the Supabase dashboard; update everywhere it's used server-side (Edge Function env, any CI secret store once CI exists) — this key must **never** exist in client-side code or `VITE_`-prefixed env vars.
2. Webhook signing secrets (once outbound webhooks are built — see [16_PLAYBOOKS/CREATE_WEBHOOK.md](../16_PLAYBOOKS/CREATE_WEBHOOK.md)): rotate with a grace-period dual-secret window so in-flight signed payloads from before rotation still verify.
3. Confirm no secret is referenced in `docs/`, `.ai/`, or committed config after rotation — grep the repo for the literal old value if there's any doubt it was ever accidentally committed, and treat any hit as its own security incident ([SECURITY_INCIDENT.md](SECURITY_INCIDENT.md)).

## Definition of Done
Old secret confirmed non-functional; new secret confirmed functional; rotation logged.
