import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/system-health-api";

const KEYS = {
  health: ["platform-admin", "system-health"] as const,
  errorLogs: ["platform-admin", "error-logs"] as const,
  integrations: ["platform-admin", "integrations"] as const,
};

export function useSystemHealth() {
  return useQuery({ queryKey: KEYS.health, queryFn: api.getSystemHealth, refetchInterval: 60_000 });
}

export function useErrorLogs() {
  return useQuery({ queryKey: KEYS.errorLogs, queryFn: api.listErrorLogs });
}

export function useResolveErrorLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolved }: { id: string; resolved: boolean }) => api.resolveErrorLog(id, resolved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.errorLogs });
      queryClient.invalidateQueries({ queryKey: KEYS.health });
    },
  });
}

export function usePlatformIntegrations() {
  return useQuery({ queryKey: KEYS.integrations, queryFn: api.listPlatformIntegrations });
}

export function useSetIntegrationConnected() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, isConnected }: { key: string; isConnected: boolean }) =>
      api.setIntegrationConnected(key, isConnected),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.integrations }),
  });
}
