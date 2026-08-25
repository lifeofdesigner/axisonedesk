---
title: Hotfix Checklist
---
# HOTFIX_CHECKLIST

See [16_PLAYBOOKS/HOTFIX_PLAYBOOK.md](../16_PLAYBOOKS/HOTFIX_PLAYBOOK.md).

- [ ] Confirmed genuinely urgent (production broken or unsafe)
- [ ] Root-caused, not just symptom-patched
- [ ] Smallest possible diff
- [ ] `pnpm build` + `pnpm lint` still run (not skipped)
- [ ] Verified fix in production after deploy, not just locally
- [ ] Full documentation catch-up done same session
