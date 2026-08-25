import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/industries/api";
import type { OrganizationType, OrganizationTypeModule } from "@/core/industries/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

const KEYS = {
  organizationTypes: ["organization-types"] as const,
  organizationTypeModules: (organizationTypeKey: string) =>
    ["organization-types", organizationTypeKey, "modules"] as const,
  experienceConfig: (organizationTypeKey: string) => ["organization-types", organizationTypeKey, "experience"] as const,
};

/**
 * The active org's Dynamic Experience Engine config (Phase 4 slice 1) — or
 * null if the org has no organization_type_key, or that type has no
 * experience_config yet (8 of 14 industries don't; this is the expected,
 * normal case, not an error). Every consumer must render a sensible
 * fallback for null, never assume content exists.
 */
export function useActiveOrgExperienceConfig() {
  const { activeOrg } = useCurrentOrganization();
  const organizationTypeKey = activeOrg?.organizationTypeKey ?? null;
  return useQuery({
    queryKey: KEYS.experienceConfig(organizationTypeKey ?? "none"),
    queryFn: () => api.getExperienceConfig(organizationTypeKey!),
    enabled: !!organizationTypeKey,
  });
}

export function useOrganizationTypes() {
  return useQuery({ queryKey: KEYS.organizationTypes, queryFn: api.listOrganizationTypes });
}

export function useOrganizationTypeModules(organizationTypeKey: string) {
  return useQuery({
    queryKey: KEYS.organizationTypeModules(organizationTypeKey),
    queryFn: () => api.listOrganizationTypeModules(organizationTypeKey),
    enabled: !!organizationTypeKey,
  });
}

export function useUpsertOrganizationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<OrganizationType, "archivedAt">) => api.upsertOrganizationType(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.organizationTypes }),
  });
}

export function useArchiveOrganizationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => api.archiveOrganizationType(key),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.organizationTypes }),
  });
}

export function useRestoreOrganizationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => api.restoreOrganizationType(key),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.organizationTypes }),
  });
}

export function useSetOrganizationTypeModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OrganizationTypeModule) => api.setOrganizationTypeModule(input),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: KEYS.organizationTypeModules(variables.organizationTypeKey) }),
  });
}
