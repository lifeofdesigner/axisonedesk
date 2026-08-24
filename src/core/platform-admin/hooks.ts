import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/api";
import { useAuth } from "@/core/auth/AuthProvider";

export const platformAdminKeys = {
  isAdmin: (userId: string | null) => ["platform-admin", "is-admin", userId] as const,
  stats: () => ["platform-admin", "stats"] as const,
  organizations: () => ["platform-admin", "organizations"] as const,
  organization: (id: string) => ["platform-admin", "organization", id] as const,
  auditLogs: () => ["platform-admin", "audit-logs"] as const,
};

export function useIsPlatformAdmin() {
  const { user, loading: authLoading } = useAuth();
  const query = useQuery({
    queryKey: platformAdminKeys.isAdmin(user?.id ?? null),
    queryFn: api.checkIsPlatformAdmin,
    enabled: Boolean(user),
  });
  return { isPlatformAdmin: query.data ?? false, isLoading: authLoading || query.isLoading };
}

export function usePlatformDashboardStats() {
  return useQuery({ queryKey: platformAdminKeys.stats(), queryFn: api.getDashboardStats });
}

export function usePlatformOrganizations() {
  return useQuery({ queryKey: platformAdminKeys.organizations(), queryFn: api.listOrganizations });
}

export function usePlatformOrganization(id: string) {
  return useQuery({
    queryKey: platformAdminKeys.organization(id),
    queryFn: () => api.getOrganizationDetail(id),
    enabled: Boolean(id),
  });
}

export function useSetOrganizationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, status }: { orgId: string; status: api.OrganizationStatus }) =>
      api.setOrganizationStatus(orgId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
  });
}

export function useArchiveOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orgId: string) => api.archiveOrganization(orgId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-admin"] }),
  });
}

export function useRestoreOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orgId: string) => api.restoreOrganization(orgId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-admin"] }),
  });
}

export function usePlatformAuditLogs(limit = 100) {
  return useQuery({
    queryKey: platformAdminKeys.auditLogs(),
    queryFn: () => api.listAuditLogs(limit),
  });
}
