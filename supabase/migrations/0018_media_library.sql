-- Media Library: the `files` table sketched in ARCHITECTURE.md §14 since
-- Phase 0 ("indexes uploads for querying/listing without hitting Storage
-- APIs directly") but never built — same gap pattern as audit_logs,
-- plans/subscriptions, and feature_flags before it. Backs a general-purpose
-- file manager UI on top of the axiondesk-assets bucket already created in
-- 0013_branding.sql, rather than inventing a second storage system.

create table public.files (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  bucket text not null default 'axiondesk-assets',
  path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  folder text not null default 'general',
  uploaded_by uuid references auth.users(id),
  entity_type text,
  entity_id uuid,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

alter table public.files enable row level security;

-- org_id null = a platform-level shared asset, visible to every member
-- (mirrors how platform_settings/plans work — global rows readable by all).
create policy "files_select" on public.files
  for select using (
    org_id is null
    or public.is_platform_admin(auth.uid())
    or org_id in (select public.current_org_ids())
  );

-- Writes are platform-admin only for now — the axiondesk-assets bucket's
-- own storage.objects policies already restrict actual file writes to
-- platform admins (0013_branding.sql), so this metadata table follows the
-- same boundary directly rather than needing a security-definer RPC.
create policy "files_write_admin" on public.files
  for all using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));
