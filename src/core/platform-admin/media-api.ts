import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface MediaFile {
  id: string;
  orgId: string | null;
  bucket: string;
  path: string;
  filename: string;
  mimeType: string | null;
  sizeBytes: number | null;
  folder: string;
  createdAt: string;
  url: string;
}

function mapFile(row: {
  id: string; org_id: string | null; bucket: string; path: string; filename: string;
  mime_type: string | null; size_bytes: number | null; folder: string; created_at: string;
}): MediaFile {
  const { data } = supabase.storage.from(row.bucket).getPublicUrl(row.path);
  return {
    id: row.id,
    orgId: row.org_id,
    bucket: row.bucket,
    path: row.path,
    filename: row.filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    folder: row.folder,
    createdAt: row.created_at,
    url: data.publicUrl,
  };
}

export async function listFiles(): Promise<MediaFile[]> {
  const { data, error } = await supabase.from("files").select("*").order("created_at", { ascending: false });
  if (error) throw toAppError(error);
  return (data ?? []).map(mapFile);
}

export async function uploadFile(file: File, folder: string): Promise<MediaFile> {
  const { data: userData } = await supabase.auth.getUser();
  const path = `${folder}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("axiondesk-assets").upload(path, file);
  if (uploadError) throw toAppError(uploadError);

  const { data: row, error } = await supabase
    .from("files")
    .insert({
      bucket: "axiondesk-assets",
      path,
      filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      folder,
      uploaded_by: userData.user?.id,
    })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapFile(row);
}

export async function deleteFile(id: string, bucket: string, path: string): Promise<void> {
  const { error: storageError } = await supabase.storage.from(bucket).remove([path]);
  if (storageError) throw toAppError(storageError);

  const { error } = await supabase.from("files").delete().eq("id", id);
  if (error) throw toAppError(error);
}
