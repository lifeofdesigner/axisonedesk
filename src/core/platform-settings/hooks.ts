import { useQuery } from "@tanstack/react-query";
import { getPlatformSettings } from "@/core/platform-settings/api";

export function usePlatformSettings() {
  return useQuery({
    queryKey: ["platform-settings"] as const,
    queryFn: getPlatformSettings,
    staleTime: 5 * 60_000,
  });
}
