import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/notifications/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function useMyNotifications() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["notifications", "mine", activeOrgId] as const,
    queryFn: api.listMyNotifications,
    enabled: Boolean(activeOrgId),
    refetchInterval: 30_000,
  });
}

export function useMarkAllRead() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => api.markAllAsRead(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "mine", activeOrgId] }),
  });
}

export function useActiveAnnouncements() {
  return useQuery({
    queryKey: ["notifications", "announcements"] as const,
    queryFn: api.listActiveAnnouncements,
    staleTime: 60_000,
  });
}

export function useMaintenanceStatus() {
  return useQuery({
    queryKey: ["notifications", "maintenance"] as const,
    queryFn: api.getMaintenanceStatus,
    staleTime: 60_000,
  });
}
