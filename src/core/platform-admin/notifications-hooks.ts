import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/notifications-api";

const KEYS = {
  announcements: ["platform-admin", "announcements"] as const,
  channels: ["platform-admin", "channels"] as const,
};

export function useAdminAnnouncements() {
  return useQuery({ queryKey: KEYS.announcements, queryFn: api.listAnnouncements });
}

export function useUpsertAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpsertAnnouncementInput) => api.upsertAnnouncement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.announcements });
      queryClient.invalidateQueries({ queryKey: ["notifications", "announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.announcements });
      queryClient.invalidateQueries({ queryKey: ["notifications", "announcements"] });
    },
  });
}

export function useNotificationChannels() {
  return useQuery({ queryKey: KEYS.channels, queryFn: api.listChannels });
}

export function useSetMaintenanceMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enabled, message }: { enabled: boolean; message: string | null }) =>
      api.setMaintenanceMode(enabled, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "maintenance"] }),
  });
}
