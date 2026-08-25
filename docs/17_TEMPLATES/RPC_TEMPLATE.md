---
title: RPC Template
---
# RPC_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_SUPABASE_RPC.md](../16_PLAYBOOKS/CREATE_SUPABASE_RPC.md).

**Tenant-scoped (relies on caller's RLS):**
```sql
create or replace function public.<name>(p_org_id uuid, p_arg text)
returns void
language plpgsql
security invoker
as $$
begin
  -- relies on RLS for tenant isolation
end;
$$;
```

**Platform-admin cross-tenant (`security definer`):**
```sql
create or replace function public.platform_<name>(p_arg text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;
  -- privileged operation
end;
$$;

grant execute on function public.platform_<name>(text) to authenticated;
```
