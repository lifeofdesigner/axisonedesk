-- Subscription & Licensing: platform-admin management for the plans/
-- subscriptions tables built in 0009_billing.sql, plus coupons and a manual
-- invoice ledger. No live Stripe integration exists (no secret key, no
-- webhook Edge Function) — invoices here are a real, standalone manual
-- record-keeping ledger a platform admin can use today, with Stripe sync
-- explicitly marked not-connected rather than faked. When Stripe is wired
-- up later, invoices.stripe_invoice_id is already there to link them.

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null,
  max_redemptions int,
  times_redeemed int not null default 0,
  valid_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

create policy "coupons_select_platform_admin" on public.coupons
  for select using (public.is_platform_admin(auth.uid()));

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  invoice_number text not null unique,
  amount numeric(10, 2) not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'void')),
  due_date date,
  paid_at timestamptz,
  stripe_invoice_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

alter table public.invoices enable row level security;

create policy "invoices_select_platform_admin_or_org" on public.invoices
  for select using (
    public.is_platform_admin(auth.uid())
    or org_id in (select public.current_org_ids())
  );

-- Everything below is platform-admin-only, RPC-gated (same pattern as every
-- other platform_* function) — no direct client write policy on any of
-- plans/subscriptions/coupons/invoices.

create or replace function public.platform_upsert_plan(
  p_id uuid,
  p_key text,
  p_name text,
  p_price_monthly numeric,
  p_price_yearly numeric,
  p_seat_limit int,
  p_module_limits jsonb,
  p_is_active boolean
)
returns public.plans
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.plans;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  if p_id is null then
    insert into public.plans (key, name, price_monthly, price_yearly, seat_limit, module_limits, is_active)
    values (p_key, p_name, p_price_monthly, p_price_yearly, p_seat_limit, p_module_limits, p_is_active)
    returning * into result;
    perform public.log_audit_event(null, 'platform.plan_created', 'plan', result.id, jsonb_build_object('key', p_key));
  else
    update public.plans set
      key = p_key, name = p_name, price_monthly = p_price_monthly, price_yearly = p_price_yearly,
      seat_limit = p_seat_limit, module_limits = p_module_limits, is_active = p_is_active
    where id = p_id
    returning * into result;
    perform public.log_audit_event(null, 'platform.plan_updated', 'plan', p_id, jsonb_build_object('key', p_key));
  end if;

  return result;
end;
$$;

grant execute on function public.platform_upsert_plan(uuid, text, text, numeric, numeric, int, jsonb, boolean) to authenticated;

create or replace function public.platform_update_subscription(
  p_org_id uuid,
  p_plan_id uuid,
  p_status text,
  p_seats int,
  p_current_period_end timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.subscriptions set
    plan_id = p_plan_id, status = p_status, seats = p_seats, current_period_end = p_current_period_end
  where org_id = p_org_id;

  perform public.log_audit_event(p_org_id, 'platform.subscription_updated', 'subscription', p_org_id,
    jsonb_build_object('plan_id', p_plan_id, 'status', p_status, 'seats', p_seats));
end;
$$;

grant execute on function public.platform_update_subscription(uuid, uuid, text, int, timestamptz) to authenticated;

create or replace function public.platform_upsert_coupon(
  p_id uuid,
  p_code text,
  p_discount_type text,
  p_discount_value numeric,
  p_max_redemptions int,
  p_valid_until date,
  p_is_active boolean
)
returns public.coupons
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.coupons;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  if p_id is null then
    insert into public.coupons (code, discount_type, discount_value, max_redemptions, valid_until, is_active)
    values (p_code, p_discount_type, p_discount_value, p_max_redemptions, p_valid_until, p_is_active)
    returning * into result;
    perform public.log_audit_event(null, 'platform.coupon_created', 'coupon', result.id, jsonb_build_object('code', p_code));
  else
    update public.coupons set
      code = p_code, discount_type = p_discount_type, discount_value = p_discount_value,
      max_redemptions = p_max_redemptions, valid_until = p_valid_until, is_active = p_is_active
    where id = p_id
    returning * into result;
    perform public.log_audit_event(null, 'platform.coupon_updated', 'coupon', p_id, jsonb_build_object('code', p_code));
  end if;

  return result;
end;
$$;

grant execute on function public.platform_upsert_coupon(uuid, text, text, numeric, int, date, boolean) to authenticated;

create or replace function public.platform_upsert_invoice(
  p_id uuid,
  p_org_id uuid,
  p_invoice_number text,
  p_amount numeric,
  p_status text,
  p_due_date date,
  p_notes text
)
returns public.invoices
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.invoices;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  if p_id is null then
    insert into public.invoices (org_id, invoice_number, amount, status, due_date, notes)
    values (p_org_id, p_invoice_number, p_amount, p_status, p_due_date, p_notes)
    returning * into result;
    perform public.log_audit_event(p_org_id, 'platform.invoice_created', 'invoice', result.id,
      jsonb_build_object('invoice_number', p_invoice_number));
  else
    update public.invoices set
      invoice_number = p_invoice_number, amount = p_amount, status = p_status,
      due_date = p_due_date, notes = p_notes,
      paid_at = case when p_status = 'paid' and status <> 'paid' then now() else paid_at end
    where id = p_id
    returning * into result;
    perform public.log_audit_event(p_org_id, 'platform.invoice_updated', 'invoice', p_id,
      jsonb_build_object('status', p_status));
  end if;

  return result;
end;
$$;

grant execute on function public.platform_upsert_invoice(uuid, uuid, text, numeric, text, date, text) to authenticated;

create or replace function public.platform_list_plans()
returns setof public.plans
language sql
stable
security definer
set search_path = public
as $$
  select * from public.plans order by price_monthly;
$$;

grant execute on function public.platform_list_plans() to authenticated;

create or replace function public.platform_list_coupons()
returns setof public.coupons
language sql
stable
security definer
set search_path = public
as $$
  select * from public.coupons order by created_at desc;
$$;

grant execute on function public.platform_list_coupons() to authenticated;

create or replace function public.platform_list_invoices()
returns table (
  id uuid, org_id uuid, org_name text, invoice_number text, amount numeric,
  status text, due_date date, paid_at timestamptz, notes text, created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  return query
    select i.id, i.org_id, o.name, i.invoice_number, i.amount, i.status, i.due_date, i.paid_at, i.notes, i.created_at
    from public.invoices i
    join public.organizations o on o.id = i.org_id
    order by i.created_at desc;
end;
$$;

grant execute on function public.platform_list_invoices() to authenticated;
