---
title: Create RLS Policy
---
# CREATE_RLS_POLICY

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Enforce tenant isolation correctly on any new tenant-scoped table — this is the single most security-critical playbook in the library.

## Required Documentation
[docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md) RLS pattern section; [docs/10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md).

## Workflow (delta)
1. `alter table <table> enable row level security;` — always, no exceptions, on every new tenant table.
2. Select policy: `org_id in (select current_org_ids())` — reuse the existing function, don't reimplement org-membership logic.
3. Write/manage policy: `has_permission(org_id, '<module>.<action>')` — reuse the existing function; add a new permission row first if needed (see [CREATE_PERMISSION.md](CREATE_PERMISSION.md)).
4. For platform-admin cross-tenant access, do **not** add a policy that bypasses tenant scoping — instead route through a `security definer` RPC with an explicit `is_platform_admin(auth.uid())` check (see [CREATE_SUPABASE_RPC.md](CREATE_SUPABASE_RPC.md) and the real example in `supabase/migrations/0011_platform_admin_rpcs.sql`).

## Validation
Manually verify as two different test users in two different orgs that neither can see or write the other's rows — do this by direct query, not just by checking the UI hides it.

## Documentation Updates (delta)
Add the table to [docs/18_REFERENCE/RLS_POLICY_REGISTRY.md](../18_REFERENCE/RLS_POLICY_REGISTRY.md).

## Definition of Done
Generic DoD, plus: cross-tenant isolation verified by direct query, not just UI behavior.
