---
title: Release Checklist
---
# RELEASE_CHECKLIST

See [16_PLAYBOOKS/RELEASE_PLAYBOOK.md](../16_PLAYBOOKS/RELEASE_PLAYBOOK.md).

- [ ] Corresponds to one completed milestone (not a grab-bag of unrelated changes)
- [ ] `pnpm build` + `pnpm lint` pass
- [ ] Manually smoke-tested (no automated suite exists yet)
- [ ] Pending migrations applied before deploy
- [ ] `docs/00_ADOS/PROJECT_STATE.md`, `PROGRESS.md`, `ROADMAP.md`, `CHANGELOG.md` updated
- [ ] Deployed and [19_RUNBOOKS/PRODUCTION_VERIFICATION.md](../19_RUNBOOKS/PRODUCTION_VERIFICATION.md) passed
