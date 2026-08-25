import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/cms-api";

const KEY = ["platform-admin", "cms-pages"] as const;

export function useCmsPages() {
  return useQuery({ queryKey: KEY, queryFn: api.listCmsPages });
}

export function useUpsertCmsPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpsertCmsPageInput) => api.upsertCmsPage(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteCmsPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCmsPage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
