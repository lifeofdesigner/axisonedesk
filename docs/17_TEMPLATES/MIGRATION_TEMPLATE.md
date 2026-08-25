---
title: Migration Template
---
# MIGRATION_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_MIGRATION.md](../16_PLAYBOOKS/CREATE_MIGRATION.md). File: `supabase/migrations/NNNN_short_description.sql`.

```sql
-- NNNN_short_description.sql
--
-- Purpose: <what this migration does and why>
-- Implements: <ARCHITECTURE.md section / ADR reference, if applicable>

begin;

-- schema changes here

commit;
```

Next number: check the highest existing file in `supabase/migrations/` (25 as of 2026-08-25, see [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)) — don't assume, verify.
