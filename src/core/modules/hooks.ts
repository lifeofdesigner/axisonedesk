import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/modules/api";
import type { ModuleDefinition } from "@/core/modules/api";

const KEYS = {
  modules: ["module-registry"] as const,
};

/** Module Registry metadata — see docs/18_REFERENCE/MODULE_REGISTRY.md. */
export function useModuleRegistry() {
  return useQuery({ queryKey: KEYS.modules, queryFn: api.listModules });
}

export function useUpsertModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ModuleDefinition) => api.upsertModule(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.modules }),
  });
}
