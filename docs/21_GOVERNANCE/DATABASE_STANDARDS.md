---
title: Database Standards (pointer)
---
# DATABASE_STANDARDS

See [MIGRATION_STANDARDS.md](MIGRATION_STANDARDS.md) and [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md) — not duplicated here. Core rule: every tenant table has `org_id` + RLS in the same migration that creates it.
