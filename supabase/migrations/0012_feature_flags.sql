-- Feature Flags: sketched in ARCHITECTURE.md §9 since Phase 0
-- ("feature_flags (global definitions) + org_feature_flags (per-org
-- override) tables") but never built until now — same gap pattern already
-- found and fixed for plans/subscriptions and audit_logs.
--
-- Two distinguished uses per §9: release flags (short-lived,
-- engineering-controlled) and entitlement flags (long-lived, plan/business
-- tied). Seeded here with one flag per real, shipped module — these are
-- entitlement-style flags a platform admin can use to gate module access
-- per tenant, which is exactly what §3's "Module Architecture" already
-- specifies (`enabled_modules` computed per org) but never had a real flags
-- table backing it. module_key matches the module's actual route slug.

create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module_key text,
  description text not null,
  default_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_feature_flags_updated_at
  before update on public.feature_flags
  for each row execute function public.set_updated_at();

create table public.org_feature_flags (
  org_id uuid not null references public.organizations(id) on delete cascade,
  flag_id uuid not null references public.feature_flags(id) on delete cascade,
  enabled boolean not null,
  updated_at timestamptz not null default now(),
  primary key (org_id, flag_id)
);

create trigger set_org_feature_flags_updated_at
  before update on public.org_feature_flags
  for each row execute function public.set_updated_at();

alter table public.feature_flags enable row level security;
alter table public.org_feature_flags enable row level security;

-- Every authenticated user can read flag definitions and their own org's
-- overrides — the client needs this to compute enabled_modules (§3). Writes
-- are platform-admin only via RPCs (below), matching the RPC pattern
-- established for tenant lifecycle actions.
create policy "feature_flags_select_all" on public.feature_flags
  for select using (true);

create policy "org_feature_flags_select_member_or_admin" on public.org_feature_flags
  for select using (
    public.is_platform_admin(auth.uid())
    or org_id in (select public.current_org_ids())
  );

insert into public.feature_flags (key, module_key, description, default_enabled) values
  ('module.inventory', 'inventory', 'Inventory module', true),
  ('module.orders', 'orders', 'Orders module', true),
  ('module.crm', 'crm', 'CRM module', true),
  ('module.bookings', 'bookings', 'Bookings module', true),
  ('module.purchasing', 'purchasing', 'Purchasing module', true),
  ('module.hr_staff', 'hr-staff', 'HR & Staff module', true),
  ('module.reports', 'reports', 'Reports module', true),
  ('module.ai_assistant', 'ai-assistant', 'AI Assistant module', true)
on conflict (key) do nothing;

create or replace function public.platform_set_flag_default(p_flag_id uuid, p_enabled boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.feature_flags set default_enabled = p_enabled where id = p_flag_id;

  perform public.log_audit_event(null, 'platform.flag_default_changed', 'feature_flag', p_flag_id,
    jsonb_build_object('enabled', p_enabled));
end;
$$;

grant execute on function public.platform_set_flag_default(uuid, boolean) to authenticated;

create or replace function public.platform_set_org_flag_override(p_org_id uuid, p_flag_id uuid, p_enabled boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  insert into public.org_feature_flags (org_id, flag_id, enabled)
  values (p_org_id, p_flag_id, p_enabled)
  on conflict (org_id, flag_id) do update set enabled = excluded.enabled;

  perform public.log_audit_event(p_org_id, 'platform.flag_override_changed', 'feature_flag', p_flag_id,
    jsonb_build_object('enabled', p_enabled));
end;
$$;

grant execute on function public.platform_set_org_flag_override(uuid, uuid, boolean) to authenticated;

create or replace function public.platform_clear_org_flag_override(p_org_id uuid, p_flag_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  delete from public.org_feature_flags where org_id = p_org_id and flag_id = p_flag_id;

  perform public.log_audit_event(p_org_id, 'platform.flag_override_cleared', 'feature_flag', p_flag_id, '{}'::jsonb);
end;
$$;

grant execute on function public.platform_clear_org_flag_override(uuid, uuid) to authenticated;
