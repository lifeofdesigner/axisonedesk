import { useQuery } from "@tanstack/react-query";
import * as api from "@/core/cms/api";

export function usePublishedPage(slug: string) {
  return useQuery({
    queryKey: ["cms", "page", slug],
    queryFn: () => api.getPublishedPage(slug),
    enabled: Boolean(slug),
  });
}
