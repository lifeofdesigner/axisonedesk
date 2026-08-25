import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/branding-api";
import { usePlatformSettings } from "@/core/platform-settings/hooks";

export { usePlatformSettings };

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: api.UpdatePlatformSettingsInput) => api.updatePlatformSettings(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-settings"] }),
  });
}

export function useUpdateOrgBranding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, logoUrl, primaryColor }: { orgId: string; logoUrl: string | null; primaryColor: string | null }) =>
      api.updateOrgBranding(orgId, logoUrl, primaryColor),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-admin"] }),
  });
}

export function useUploadBrandingAsset() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: string }) => api.uploadBrandingAsset(file, folder),
  });
}
