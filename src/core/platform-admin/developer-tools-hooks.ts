import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/developer-tools-api";

const KEYS = {
  apiKeys: ["platform-admin", "api-keys"] as const,
  webhooks: ["platform-admin", "webhooks"] as const,
  edgeFunctions: ["platform-admin", "edge-functions"] as const,
};

export function useApiKeys() {
  return useQuery({ queryKey: KEYS.apiKeys, queryFn: api.listApiKeys });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (label: string) => api.createApiKey(label),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.apiKeys }),
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.revokeApiKey(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.apiKeys }),
  });
}

export function useWebhooks() {
  return useQuery({ queryKey: KEYS.webhooks, queryFn: api.listWebhooks });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.createWebhook>[0]) => api.createWebhook(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.webhooks }),
  });
}

export function useSetWebhookActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.setWebhookActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.webhooks }),
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteWebhook(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.webhooks }),
  });
}

export function useEdgeFunctions() {
  return useQuery({ queryKey: KEYS.edgeFunctions, queryFn: api.listEdgeFunctions });
}

export function useSetEdgeFunctionDeployed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, isDeployed }: { key: string; isDeployed: boolean }) => api.setEdgeFunctionDeployed(key, isDeployed),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.edgeFunctions }),
  });
}
