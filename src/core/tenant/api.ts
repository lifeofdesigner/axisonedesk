import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

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

  if (error) throw toAppError(error);
  return data;
}

export interface MyOrganization {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  status: string;
}

/**
 * Every organization the signed-in user is an active member of. Backs org
 * resolution/switching in OrganizationProvider — never call `organizations`
 * directly from a component.
 */
export async function listMyOrganizations(): Promise<MyOrganization[]> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organizations(id, name, slug, business_type, status)")
    .eq("status", "active");

  if (error) throw toAppError(error);

  return (data ?? [])
    .map((row) => row.organizations)
    .filter((org): org is NonNullable<typeof org> => org !== null)
    .map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      businessType: org.business_type,
      status: org.status,
    }));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
