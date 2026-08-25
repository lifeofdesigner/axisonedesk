-- White-label & Branding: platform-level branding (name, logo, colors —
-- "White-label Defaults" per the Platform Owner spec) and per-tenant
-- branding overrides. Uses a dedicated storage bucket
-- (`axiondesk-assets`) — the existing `branding` bucket in this project
-- belongs to the unrelated FactoryMVP app (see its fmvp_-prefixed storage
-- policies) and must not be touched or reused.

insert into storage.buckets (id, name, public)
values ('axiondesk-assets', 'axiondesk-assets', true)
on conflict (id) do nothing;

create policy "axiondesk_assets_public_read" on storage.objects
  for select using (bucket_id = 'axiondesk-assets');

create policy "axiondesk_assets_admin_write" on storage.objects
  for insert with check (bucket_id = 'axiondesk-assets' and public.is_platform_admin(auth.uid()));

create policy "axiondesk_assets_admin_update" on storage.objects
  for update using (bucket_id = 'axiondesk-assets' and public.is_platform_admin(auth.uid()));

create policy "axiondesk_assets_admin_delete" on storage.objects
  for delete using (bucket_id = 'axiondesk-assets' and public.is_platform_admin(auth.uid()));

-- Platform branding: a singleton row (id fixed to a constant so there's
-- never more than one). Readable by anyone — the login/signup pages need
-- platform name/logo before a user has an org, or even a session.
create table public.platform_settings (
  id boolean primary key default true,
  platform_name text not null default 'AxisOneDesk',
  logo_url text,
  favicon_url text,
  primary_color text not null default '#8484f5',
  secondary_color text not null default '#191d2b',
  accent_color text not null default '#3ee0a0',
  support_email text,
  default_company_logo_url text,
  updated_at timestamptz not null default now(),
  constraint platform_settings_singleton check (id = true)
);

insert into public.platform_settings (id) values (true) on conflict (id) do nothing;

create trigger set_platform_settings_updated_at
  before update on public.platform_settings
  for each row execute function public.set_updated_at();

alter table public.platform_settings enable row level security;

create policy "platform_settings_select_all" on public.platform_settings
  for select using (true);

-- No client write policy at all — only update_platform_settings() writes.
create or replace function public.update_platform_settings(p_updates jsonb)
returns public.platform_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.platform_settings;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.platform_settings set
    platform_name = coalesce(p_updates->>'platform_name', platform_name),
    logo_url = coalesce(p_updates->>'logo_url', logo_url),
    favicon_url = coalesce(p_updates->>'favicon_url', favicon_url),
    primary_color = coalesce(p_updates->>'primary_color', primary_color),
    secondary_color = coalesce(p_updates->>'secondary_color', secondary_color),
    accent_color = coalesce(p_updates->>'accent_color', accent_color),
    support_email = coalesce(p_updates->>'support_email', support_email),
    default_company_logo_url = coalesce(p_updates->>'default_company_logo_url', default_company_logo_url)
  where id = true
  returning * into result;

  perform public.log_audit_event(null, 'platform.branding_updated', 'platform_settings', null, p_updates);

  return result;
end;
$$;

grant execute on function public.update_platform_settings(jsonb) to authenticated;

-- Per-tenant white-label overrides.
alter table public.organizations add column logo_url text;
alter table public.organizations add column primary_color text;

create or replace function public.platform_update_org_branding(p_org_id uuid, p_logo_url text, p_primary_color text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.organizations set logo_url = p_logo_url, primary_color = p_primary_color where id = p_org_id;

  perform public.log_audit_event(p_org_id, 'platform.org_branding_updated', 'organization', p_org_id,
    jsonb_build_object('logo_url', p_logo_url, 'primary_color', p_primary_color));
end;
$$;

grant execute on function public.platform_update_org_branding(uuid, text, text) to authenticated;
