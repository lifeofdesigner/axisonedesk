---
title: Emergency Release Runbook
---
# EMERGENCY_RELEASE

Mechanical steps for shipping under [16_PLAYBOOKS/HOTFIX_PLAYBOOK.md](../16_PLAYBOOKS/HOTFIX_PLAYBOOK.md)'s process.

1. Smallest possible diff.
2. `pnpm build` + `pnpm lint` — still run, still fast, still mandatory.
3. Push directly to `main` (no separate release branch process exists in this repo).
4. [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) immediately after deploy.
5. Full documentation catch-up per [docs/00_ADOS/SESSION_END.md](../00_ADOS/SESSION_END.md) within the same session — urgency compresses the timeline, it doesn't skip the step.

## Definition of Done
Production issue resolved and verified; documentation caught up.
