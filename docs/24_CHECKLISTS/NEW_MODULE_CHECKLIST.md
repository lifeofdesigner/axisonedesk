---
title: New Module Checklist
---
# NEW_MODULE_CHECKLIST

See [16_PLAYBOOKS/CREATE_MODULE.md](../16_PLAYBOOKS/CREATE_MODULE.md) for the full process.

- [ ] Confirmed no existing module already covers this
- [ ] Migration(s) with RLS in the same migration
- [ ] `api.ts` + `hooks.ts` + `components/` following the established pattern
- [ ] Route registered, gated by `RequireModuleEnabled`
- [ ] Feature flag row created
- [ ] Permissions created if module needs view/edit distinction
- [ ] Navigation entry added
- [ ] `database.types.ts` regenerated
- [ ] `docs/04_MODULES/INDEX.md` updated
- [ ] `pnpm build` + `pnpm lint` pass
- [ ] Manually exercised in browser (empty state + happy path)
