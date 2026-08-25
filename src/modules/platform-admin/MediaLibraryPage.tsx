import { useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useDeleteFile, useMediaFiles, useUploadFile } from "@/core/platform-admin/media-hooks";
import type { MediaFile } from "@/core/platform-admin/media-api";

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryPage() {
  const { data: files, isLoading } = useMediaFiles();
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    for (const file of Array.from(fileList)) {
      try {
        await uploadFile.mutateAsync({ file, folder: "media" });
      } catch {
        toast.error(`Couldn't upload ${file.name}`);
      }
    }
    toast.success(`Uploaded ${fileList.length} file${fileList.length > 1 ? "s" : ""}`);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteFile.mutateAsync({ id: deleteTarget.id, bucket: deleteTarget.bucket, path: deleteTarget.path });
      toast.success("File deleted");
    } catch {
      toast.error("Couldn't delete file");
    } finally {
      setDeleteTarget(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  return (
    <div>
      <PageHeader
        title="Media library"
        description="Every uploaded asset, tracked and reusable across the platform."
        actions={
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadFile.isPending}>
            {uploadFile.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Upload
          </Button>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : !files || files.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media yet"
          description="Upload images, documents, or brand assets to reuse across the platform."
          action={
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Upload
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {files.map((file) => (
            <div key={file.id} className="group relative overflow-hidden rounded-lg border">
              <div className="bg-muted flex aspect-square items-center justify-center overflow-hidden">
                {file.mimeType?.startsWith("image/") ? (
                  <img src={file.url} alt={file.filename} className="size-full object-cover" />
                ) : (
                  <ImageIcon className="text-muted-foreground size-8" />
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium">{file.filename}</p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge variant="outline" className="font-normal text-[10px]">
                    {formatSize(file.sizeBytes)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="size-6" onClick={() => copyUrl(file.url)}>
                      <Copy className="size-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-6" onClick={() => setDeleteTarget(file)}>
                      <Trash2 className="text-destructive size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {deleteTarget?.filename} from storage. Anything referencing this URL will break.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
