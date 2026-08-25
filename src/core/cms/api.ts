import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface PublicCmsPage {
  slug: string;
  title: string;
  body: string;
  metaDescription: string | null;
  publishedAt: string | null;
}

export async function getPublishedPage(slug: string): Promise<PublicCmsPage | null> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("slug, title, body, meta_description, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    body: data.body,
    metaDescription: data.meta_description,
    publishedAt: data.published_at,
  };
}
