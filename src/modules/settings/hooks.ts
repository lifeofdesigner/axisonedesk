import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/settings/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const settingsKeys = {
  orgProfile: (orgId: string | null) => ["settings", "org-profile", orgId] as const,
  roles: (orgId: string | null) => ["settings", "roles", orgId] as const,
  members: (orgId: string | null) => ["settings", "members", orgId] as const,
};

export function useOrgProfile() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: settingsKeys.orgProfile(activeOrgId),
    queryFn: () => api.getOrgProfile(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useUpdateOrgProfile() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpdateOrgProfileInput) => api.updateOrgProfile(activeOrgId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.orgProfile(activeOrgId) });
    },
  });
}

export function useRoles() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: settingsKeys.roles(activeOrgId),
    queryFn: () => api.listRoles(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useMembers() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: settingsKeys.members(activeOrgId),
    queryFn: () => api.listMembers(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useUpdateMemberRole() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, roleId }: { memberId: string; roleId: string }) =>
      api.updateMemberRole(activeOrgId!, memberId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.members(activeOrgId) });
    },
  });
}
