---
title: Database Table Template
---
# DATABASE_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_DATABASE_TABLE.md](../16_PLAYBOOKS/CREATE_DATABASE_TABLE.md).

```sql
create table public.<table_name> (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  -- columns...
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.<table_name>
  for each row execute function public.set_updated_at();

alter table public.<table_name> enable row level security;

create policy "<table_name>_select_member"
  on public.<table_name> for select
  using (org_id in (select public.current_org_ids()));

create policy "<table_name>_manage_permission"
  on public.<table_name> for all
  using (public.has_permission(org_id, '<module>.edit'))
  with check (public.has_permission(org_id, '<module>.edit'));
```
