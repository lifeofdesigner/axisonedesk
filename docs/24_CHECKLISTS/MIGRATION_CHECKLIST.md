---
title: Migration Checklist
---
# MIGRATION_CHECKLIST

See [16_PLAYBOOKS/CREATE_MIGRATION.md](../16_PLAYBOOKS/CREATE_MIGRATION.md).

- [ ] Next sequential number confirmed (not assumed)
- [ ] Header comment states purpose
- [ ] One concern per file
- [ ] Wrapped in `begin`/`commit`
- [ ] RLS enabled + policies included if new tenant table
- [ ] `updated_at` trigger uses existing `set_updated_at()`
- [ ] Applies cleanly to a fresh database, not just incrementally
- [ ] `database.types.ts` regenerated and committed
- [ ] `docs/03_DATABASE/INDEX.md` migration log updated
