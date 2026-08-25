---
title: Rollback Procedure Runbook
---
# ROLLBACK_PROCEDURE

See [16_PLAYBOOKS/ROLLBACK_PLAYBOOK.md](../16_PLAYBOOKS/ROLLBACK_PLAYBOOK.md) for the decision process — this is the mechanical execution steps.

**Frontend-only rollback**:
1. Vercel dashboard → deployment history → promote the prior known-good deployment.
2. Follow up with a `git revert` commit on `main` so source history matches what's live.

**Schema-involved rollback**: see [FAILED_MIGRATION.md](FAILED_MIGRATION.md) — do not attempt to blindly revert a migration that's already written data; write a corrective migration instead.

## Definition of Done
[PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) passes at the rolled-back state.
