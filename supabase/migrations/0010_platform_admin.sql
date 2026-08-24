-- Platform Owner Portal: platform-admin identity, real audit logging (sketched
-- in ARCHITECTURE.md §11 since Phase 0 but never actually built — same gap
-- pattern already found and fixed for plans/subscriptions in the Billing
-- migration), and tenant lifecycle fields.
--
-- Architecture: platform admins are NOT an organization role — they sit
-- outside the org_id-scoped tenant model entirely, the same way `roles` with
-- org_id null are "global" roles. Cross-tenant reads/writes go through
-- security-definer RPCs that explicitly check is_platform_admin(auth.uid()),
-- exactly the same justification and pattern as create_order,
-- receive_purchase_order, etc. — NOT by adding platform-admin bypass clauses
-- to every existing tenant table's RLS policy, which would mean touching and
-- re-auditing nine migrations' worth of policies. This keeps the tenant
-- security boundary exactly as-is and adds an orthogonal, explicitly-checked
-- privilege layer on top.

create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id)
);

alter table public.platform_admins enable row level security;

create or replace function public.is_platform_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.platform_admins where user_id = p_user_id);
$$;

-- Only platform admins can see who else is a platform admin. No client
-- insert/update/delete policy at all — membership is granted only via the
-- standalone bootstrap tool (service_role) or a future grant_platform_admin
-- RPC, never directly by an authenticated client.
create policy "platform_admins_select_self" on public.platform_admins
  for select using (public.is_platform_admin(auth.uid()));

-- audit_logs: sketched in ARCHITECTURE.md §11 ("append-only, no updates/
-- deletes permitted via RLS") but never created until now. org_id is
-- nullable here — a deliberate deviation from the original sketch, since
-- this ledger now also carries platform-level events (e.g. "tenant
-- suspended") that aren't scoped to the acting org.
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "audit_logs_select_org_member" on public.audit_logs
  for select using (
    public.is_platform_admin(auth.uid())
    or (org_id is not null and org_id in (select public.current_org_ids()))
  );

-- Append-only: zero insert/update/delete policy for clients. Only
-- log_audit_event() (below) writes to this table.
create or replace function public.log_audit_event(
  p_org_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (org_id, actor_id, action, entity_type, entity_id, metadata)
  values (p_org_id, auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata);
end;
$$;

grant execute on function public.log_audit_event(uuid, text, text, uuid, jsonb) to authenticated;

-- Tenant lifecycle: organizations gets deleted_at (every other tenant table
-- already has one; organizations itself was the one exception) and two new
-- status values. ALTER TYPE ... ADD VALUE cannot be used in the same
-- transaction as a statement that references the new value, so the new
-- statuses are added here but not used until later statements/RPCs.
alter table public.organizations add column deleted_at timestamptz;
alter type public.organization_status add value if not exists 'suspended';
alter type public.organization_status add value if not exists 'archived';
