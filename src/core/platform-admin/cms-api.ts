import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  pageType: string;
  status: string;
  metaDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
}

export async function listCmsPages(): Promise<CmsPage[]> {
  const { data, error } = await supabase.rpc("platform_list_cms_pages");
  if (error) throw toAppError(error);
  return (data ?? []).map(mapRow);
}

export interface UpsertCmsPageInput {
  id: string | null;
  slug: string;
  title: string;
  body: string;
  pageType: string;
  status: string;
  metaDescription: string | null;
}

export async function upsertCmsPage(input: UpsertCmsPageInput): Promise<CmsPage> {
  const { data, error } = await supabase
    .rpc("platform_upsert_cms_page", {
      p_id: input.id as unknown as string,
      p_slug: input.slug,
      p_title: input.title,
      p_body: input.body,
      p_page_type: input.pageType,
      p_status: input.status,
      p_meta_description: input.metaDescription as unknown as string,
    })
    .single();
  if (error) throw toAppError(error);
  return mapRow(data);
}

export async function deleteCmsPage(id: string): Promise<void> {
  const { error } = await supabase.rpc("platform_delete_cms_page", { p_id: id });
  if (error) throw toAppError(error);
}

function mapRow(r: {
  id: string;
  slug: string;
  title: string;
  body: string;
  page_type: string;
  status: string;
  meta_description: string | null;
  published_at: string | null;
  updated_at: string;
}): CmsPage {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    body: r.body,
    pageType: r.page_type,
    status: r.status,
    metaDescription: r.meta_description,
    publishedAt: r.published_at,
    updatedAt: r.updated_at,
  };
}
