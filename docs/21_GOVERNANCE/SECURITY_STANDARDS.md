---
title: Security Standards (pointer)
---
# SECURITY_STANDARDS

See [docs/10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md) and [.ai/10_SECURITY.md](../../.ai/10_SECURITY.md) — the Sources of Truth for current posture and implementation plan. Not duplicated here. Quick standard: RLS via `current_org_ids()`/`has_permission()` is the tenant-isolation boundary for every new tenant table, no exceptions (see [16_PLAYBOOKS/CREATE_RLS_POLICY.md](../16_PLAYBOOKS/CREATE_RLS_POLICY.md)).
