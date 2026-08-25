---
title: Deployment Checklist
---
# DEPLOYMENT_CHECKLIST

See [16_PLAYBOOKS/DEPLOYMENT_PLAYBOOK.md](../16_PLAYBOOKS/DEPLOYMENT_PLAYBOOK.md).

- [ ] `pnpm build` clean locally
- [ ] `pnpm lint` clean locally
- [ ] Migrations applied to target Supabase project before pushing frontend that depends on them
- [ ] `database.types.ts` matches live schema
- [ ] Pushed to `main`
- [ ] [19_RUNBOOKS/PRODUCTION_VERIFICATION.md](../19_RUNBOOKS/PRODUCTION_VERIFICATION.md) run post-deploy
