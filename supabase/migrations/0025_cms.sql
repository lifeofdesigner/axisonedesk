-- CMS. Not sketched anywhere in ARCHITECTURE.md — a genuinely new capability.
-- Per the explicit instruction to not generate marketing assets yet, this
-- builds the content-management infrastructure (table, RLS, publish
-- workflow, a real public rendering route) with empty starter pages, not
-- authored marketing/legal copy — the platform owner (or a later marketing
-- pass) fills in real content through this editor.
create table public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  page_type text not null default 'other' check (page_type in ('legal', 'help', 'marketing', 'other')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_description text,
  created_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_pages enable row level security;

-- Published pages are genuinely public (e.g. a Terms link on the signup
-- page needs to work for a logged-out visitor) — same posture as
-- announcements. Drafts are never exposed outside the admin portal.
create policy "cms_pages_select_published" on public.cms_pages
  for select using (status = 'published');

create policy "cms_pages_all_admin" on public.cms_pages
  for all using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

create index cms_pages_status_idx on public.cms_pages (status);

create or replace function public.platform_list_cms_pages()
returns setof public.cms_pages
language sql
security definer
set search_path = public
as $$
  select * from public.cms_pages
  where public.is_platform_admin(auth.uid())
  order by updated_at desc;
$$;

create or replace function public.platform_upsert_cms_page(
  p_id uuid, p_slug text, p_title text, p_body text, p_page_type text,
  p_status text, p_meta_description text
)
returns public.cms_pages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.cms_pages;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  if p_id is null then
    insert into public.cms_pages (slug, title, body, page_type, status, meta_description, created_by, published_at)
    values (p_slug, p_title, p_body, p_page_type, p_status, p_meta_description, auth.uid(),
            case when p_status = 'published' then now() else null end)
    returning * into v_row;

    perform public.log_audit_event(null, 'platform.cms_page_created', 'cms_page', v_row.id, jsonb_build_object('slug', p_slug));
  else
    update public.cms_pages
    set slug = p_slug,
        title = p_title,
        body = p_body,
        page_type = p_page_type,
        status = p_status,
        meta_description = p_meta_description,
        updated_at = now(),
        published_at = case
          when p_status = 'published' and published_at is null then now()
          when p_status = 'draft' then null
          else published_at
        end
    where id = p_id
    returning * into v_row;

    perform public.log_audit_event(null, 'platform.cms_page_updated', 'cms_page', v_row.id, jsonb_build_object('slug', p_slug, 'status', p_status));
  end if;

  return v_row;
end;
$$;

create or replace function public.platform_delete_cms_page(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  delete from public.cms_pages where id = p_id;

  perform public.log_audit_event(null, 'platform.cms_page_deleted', 'cms_page', p_id, '{}'::jsonb);
end;
$$;
