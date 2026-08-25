import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/industries/api";
import type { OrganizationType, OrganizationTypeModule } from "@/core/industries/api";

const KEYS = {
  organizationTypes: ["organization-types"] as const,
  organizationTypeModules: (organizationTypeKey: string) =>
    ["organization-types", organizationTypeKey, "modules"] as const,
};

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
