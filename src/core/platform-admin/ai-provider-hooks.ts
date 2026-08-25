import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/ai-provider-api";

const KEYS = {
  providers: ["platform-admin", "ai-providers"] as const,
  templates: ["platform-admin", "ai-prompt-templates"] as const,
  settings: ["platform-admin", "ai-settings"] as const,
  usage: ["platform-admin", "ai-usage"] as const,
};

export function useAiProviders() {
  return useQuery({ queryKey: KEYS.providers, queryFn: api.listAiProviders });
}

export function useSetAiProviderConnected() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, isConnected, notes }: { key: string; isConnected: boolean; notes: string | null }) =>
      api.setAiProviderConnected(key, isConnected, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.providers }),
  });
}

export function useAiPromptTemplates() {
  return useQuery({ queryKey: KEYS.templates, queryFn: api.listAiPromptTemplates });
}

export function useUpsertAiPromptTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.upsertAiPromptTemplate>[0]) => api.upsertAiPromptTemplate(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.templates }),
  });
}

export function useAiSettings() {
  return useQuery({ queryKey: KEYS.settings, queryFn: api.getAiSettings });
}

export function useUpdateAiSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.AiSettings) => api.updateAiSettings(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.settings }),
  });
}

export function useAiUsageSummary() {
  return useQuery({ queryKey: KEYS.usage, queryFn: api.getAiUsageSummary });
}
