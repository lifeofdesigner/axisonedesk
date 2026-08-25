import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
}

export async function listMyNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    readAt: r.read_at,
    createdAt: r.created_at,
  }));
}

export async function markAsRead(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  if (error) throw toAppError(error);
}

export async function markAllAsRead(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .in("id", ids);
  if (error) throw toAppError(error);
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: string;
}

export async function listActiveAnnouncements(): Promise<Announcement[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, body, severity")
    .eq("is_active", true)
    .lte("starts_at", now)
    .or(`ends_at.is.null,ends_at.gte.${now}`);

  if (error) throw toAppError(error);
  return data ?? [];
}

export async function getMaintenanceStatus(): Promise<{ enabled: boolean; message: string | null }> {
  const { data, error } = await supabase
    .from("platform_settings")
    .select("maintenance_mode, maintenance_message")
    .eq("id", true)
    .single();

  if (error) throw toAppError(error);
  return { enabled: data.maintenance_mode, message: data.maintenance_message };
}
