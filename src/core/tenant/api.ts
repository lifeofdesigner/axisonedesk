import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface CreateOrganizationInput {
  name: string;
  businessType: string;
  /**
   * organization_types.key, set when the onboarding.industry_registry_picker
   * flag is on (see OnboardingForm) — otherwise omitted, matching pre-Phase-3b
   * behavior exactly. See docs/00_ADOS/DECISIONS.md ADR-009.
   */
  organizationTypeKey?: string;
  /**
   * Full-profile fields from 0032_onboarding_full_profile.sql — only
   * collected/sent when the registry picker flag is on (see OnboardingForm).
   * All optional; the RPC persists whatever is provided.
   */
  companySize?: string;
  employeeCount?: number;
  branchCount?: number;
  warehouseCount?: number;
  country?: string;
  timezone?: string;
  currency?: string;
  preferredLanguage?: string;
}

export async function createOrganization(input: CreateOrganizationInput) {
  const slug = `${slugify(input.name)}-${crypto.randomUUID().slice(0, 6)}`;

  const { data, error } = await supabase.rpc("create_organization_with_owner", {
    org_name: input.name,
    org_slug: slug,
    org_business_type: input.businessType,
    p_organization_type_key: input.organizationTypeKey,
    p_company_size: input.companySize,
    p_employee_count: input.employeeCount,
    p_branch_count: input.branchCount,
    p_warehouse_count: input.warehouseCount,
    p_country: input.country,
    p_timezone: input.timezone,
    p_currency: input.currency,
    p_preferred_language: input.preferredLanguage,
  });

  if (error) throw toAppError(error);
  return data;
}

export interface MyOrganization {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  /**
   * Canonical organization classification (docs/00_ADOS/DECISIONS.md
   * ADR-009) — always set for every org since 0031_canonical_organization_
   * type.sql's backfill + create_organization_with_owner's fallback
   * mapping. businessType above is legacy-compatibility only; prefer this.
   */
  organizationTypeKey: string | null;
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
    .select("organizations(id, name, slug, business_type, organization_type_key, status)")
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
      organizationTypeKey: org.organization_type_key,
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
