-- Billing module: `plans` and `subscriptions` tables, sketched in
-- ARCHITECTURE.md §4/§8/§12 but never created until now.
--
-- Scope note: this creates the real schema and a real read-only billing UI
-- (current plan, usage, a plan-comparison table), but there is NO live
-- Stripe integration — no Stripe secret key, no webhook Edge Function, no
-- Checkout/Customer Portal session creation. ARCHITECTURE.md §8 already
-- specifies Stripe as the billing engine of record; wiring the actual
-- Stripe Edge Function is real future work that needs a Stripe account and
-- secret key this environment doesn't have. `subscriptions.stripe_*` columns
-- exist per the SOT but stay null until that integration exists.

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  price_monthly numeric(10, 2) not null,
  price_yearly numeric(10, 2) not null,
  module_limits jsonb not null default '{}'::jsonb,
  seat_limit int,
  is_active boolean not null default true
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) unique,
  plan_id uuid not null references public.plans(id),
  status text not null default 'trialing' check (status in ('trialing', 'active', 'past_due', 'canceled')),
  stripe_subscription_id text,
  current_period_end timestamptz,
  seats int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

create policy "plans_select_all" on public.plans
  for select using (true);

create policy "subscriptions_select_member" on public.subscriptions
  for select using (org_id in (select public.current_org_ids()));

create policy "subscriptions_write_admin" on public.subscriptions
  for all using (public.has_permission(org_id, 'billing.manage'))
  with check (public.has_permission(org_id, 'billing.manage'));

insert into public.plans (key, name, price_monthly, price_yearly, module_limits, seat_limit) values
  ('starter', 'Starter', 0, 0, '{"modules": ["inventory", "orders", "dashboard"]}'::jsonb, 3),
  ('growth', 'Growth', 49, 490, '{"modules": ["inventory", "orders", "dashboard", "crm", "bookings", "purchasing"]}'::jsonb, 15),
  ('enterprise', 'Enterprise', 199, 1990, '{"modules": ["*"]}'::jsonb, null)
on conflict (key) do nothing;

-- Backfill: every existing org gets a Starter (trialing) subscription so the
-- billing page has real data to show, not an empty state on first load.
insert into public.subscriptions (org_id, plan_id, status)
select o.id, p.id, 'trialing'
from public.organizations o
cross join lateral (select id from public.plans where key = 'starter' limit 1) p
where not exists (select 1 from public.subscriptions s where s.org_id = o.id);

-- Extend create_organization_with_owner (0001_init.sql) so every NEW org
-- also gets a Starter subscription automatically, not just existing ones.
create or replace function public.create_organization_with_owner(
  org_name text,
  org_slug text,
  org_business_type text
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
  owner_role_id uuid;
  starter_plan_id uuid;
begin
  insert into public.organizations (name, slug, business_type)
  values (org_name, org_slug, org_business_type)
  returning id into new_org_id;

  insert into public.roles (org_id, name, is_system_role)
  values (new_org_id, 'Owner', true)
  returning id into owner_role_id;

  insert into public.role_permissions (role_id, permission_id)
  select owner_role_id, id from public.permissions;

  insert into public.organization_members (org_id, user_id, role_id, status, joined_at)
  values (new_org_id, auth.uid(), owner_role_id, 'active', now());

  select id into starter_plan_id from public.plans where key = 'starter' limit 1;
  if starter_plan_id is not null then
    insert into public.subscriptions (org_id, plan_id, status)
    values (new_org_id, starter_plan_id, 'trialing');
  end if;

  return new_org_id;
end;
$$;
