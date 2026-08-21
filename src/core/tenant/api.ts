import { supabase } from "@/core/supabase/client";

export interface CreateOrganizationInput {
  name: string;
  businessType: string;
}

export async function createOrganization(input: CreateOrganizationInput) {
  const slug = `${slugify(input.name)}-${crypto.randomUUID().slice(0, 6)}`;

  const { data, error } = await supabase.rpc("create_organization_with_owner", {
    org_name: input.name,
    org_slug: slug,
    org_business_type: input.businessType,
  });

  if (error) throw error;
  return data;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
