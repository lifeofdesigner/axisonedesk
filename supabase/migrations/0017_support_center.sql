-- Support Center: tickets + threaded messages (customer-visible replies and
-- platform-admin-only internal notes in the same thread, distinguished by
-- is_internal). Scoped tightly to what's genuinely useful this pass —
-- impersonation needs the same service_role/session-swap mechanism already
-- deferred to scripts/admin-tool/ for identity actions; knowledge base
-- fits the CMS module (later in this build order) better than duplicating
-- content management here; bug reports are just tickets with a category.

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  created_by uuid not null references auth.users(id),
  assigned_to uuid references auth.users(id),
  subject text not null,
  category text not null default 'general' check (category in ('general', 'bug', 'billing', 'feature_request')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();

create table public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;

-- Tenant members can see and create tickets for their own org; platform
-- admins can see every ticket across every org.
create policy "support_tickets_select" on public.support_tickets
  for select using (
    public.is_platform_admin(auth.uid())
    or org_id in (select public.current_org_ids())
  );

create policy "support_tickets_insert_member" on public.support_tickets
  for insert with check (org_id in (select public.current_org_ids()) and created_by = auth.uid());

-- Only platform admins change status/priority/assignment — a tenant member
-- shouldn't be able to close or reprioritize their own ticket.
create policy "support_tickets_update_admin" on support_tickets
  for update using (public.is_platform_admin(auth.uid()));

-- Messages: tenant members see only non-internal messages on their org's
-- tickets; platform admins see everything including internal notes.
create policy "support_ticket_messages_select" on public.support_ticket_messages
  for select using (
    public.is_platform_admin(auth.uid())
    or (
      not is_internal
      and ticket_id in (
        select id from public.support_tickets where org_id in (select public.current_org_ids())
      )
    )
  );

-- Tenant members can reply (never internal) on their own org's tickets;
-- platform admins can reply or add internal notes on any ticket.
create policy "support_ticket_messages_insert" on public.support_ticket_messages
  for insert with check (
    author_id = auth.uid()
    and (
      public.is_platform_admin(auth.uid())
      or (
        not is_internal
        and ticket_id in (
          select id from public.support_tickets where org_id in (select public.current_org_ids())
        )
      )
    )
  );

create or replace function public.platform_list_tickets()
returns table (
  id uuid, org_id uuid, org_name text, subject text, category text, status text, priority text,
  created_by_name text, assigned_to_name text, message_count bigint, created_at timestamptz, updated_at timestamptz
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
    select
      t.id, t.org_id, o.name, t.subject, t.category, t.status, t.priority,
      creator.full_name, assignee.full_name,
      (select count(*) from public.support_ticket_messages m where m.ticket_id = t.id),
      t.created_at, t.updated_at
    from public.support_tickets t
    join public.organizations o on o.id = t.org_id
    left join public.profiles creator on creator.id = t.created_by
    left join public.profiles assignee on assignee.id = t.assigned_to
    order by t.updated_at desc;
end;
$$;

grant execute on function public.platform_list_tickets() to authenticated;

create or replace function public.platform_update_ticket(
  p_ticket_id uuid, p_status text, p_priority text, p_assigned_to uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.support_tickets
    set status = p_status, priority = p_priority, assigned_to = p_assigned_to
    where id = p_ticket_id
    returning org_id into v_org_id;

  perform public.log_audit_event(v_org_id, 'platform.ticket_updated', 'support_ticket', p_ticket_id,
    jsonb_build_object('status', p_status, 'priority', p_priority));
end;
$$;

grant execute on function public.platform_update_ticket(uuid, text, text, uuid) to authenticated;
