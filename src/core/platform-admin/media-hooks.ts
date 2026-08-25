import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/media-api";

const KEY = ["platform-admin", "media-files"] as const;

export function useMediaFiles() {
  return useQuery({ queryKey: KEY, queryFn: api.listFiles });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: string }) => api.uploadFile(file, folder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bucket, path }: { id: string; bucket: string; path: string }) => api.deleteFile(id, bucket, path),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
