---
title: Migration Standards
last_updated: 2026-08-25
---

# Migration Standards

Extends [16_PLAYBOOKS/CREATE_MIGRATION.md](../16_PLAYBOOKS/CREATE_MIGRATION.md).

- Sequential numbering, one concern per file, header comment stating purpose (established convention across all 25 existing migrations).
- Never edit a shipped migration — always a new one, even for a fix (see `0016_fix_platform_list_users.sql`'s real precedent).
- Every new tenant table gets RLS enabled and policies in the *same* migration that creates it — never a follow-up migration that leaves a window with RLS disabled.
- Wrap in `begin`/`commit` for atomicity (see [17_TEMPLATES/MIGRATION_TEMPLATE.md](../17_TEMPLATES/MIGRATION_TEMPLATE.md)).
- `database.types.ts` regenerated and committed in the same PR/commit as the migration that changed schema — never let them drift apart.

## References
[16_PLAYBOOKS/CREATE_MIGRATION.md](../16_PLAYBOOKS/CREATE_MIGRATION.md) · [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)
