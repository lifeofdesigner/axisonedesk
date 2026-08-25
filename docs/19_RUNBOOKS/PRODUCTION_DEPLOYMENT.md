---
title: Production Deployment Runbook
---
# PRODUCTION_DEPLOYMENT

See [16_PLAYBOOKS/DEPLOYMENT_PLAYBOOK.md](../16_PLAYBOOKS/DEPLOYMENT_PLAYBOOK.md) for the full process — this runbook is the compressed step list for executing it under time pressure.

1. `pnpm build` + `pnpm lint` clean locally.
2. Apply pending Supabase migrations (CLI, against the linked project) — schema before code.
3. Regenerate + commit `database.types.ts` if schema changed.
4. Push to `main` → Vercel auto-deploys.
5. Run [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md).
6. If verification fails: [ROLLBACK_PROCEDURE.md](ROLLBACK_PROCEDURE.md).
