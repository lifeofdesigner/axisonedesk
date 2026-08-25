import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string | null;
}

export async function listAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    severity: r.severity,
    isActive: r.is_active,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
  }));
}

export interface UpsertAnnouncementInput {
  id: string | null;
  title: string;
  body: string;
  severity: string;
  isActive: boolean;
  endsAt: string | null;
}

export async function upsertAnnouncement(input: UpsertAnnouncementInput): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (input.id) {
    const { error } = await supabase
      .from("announcements")
      .update({ title: input.title, body: input.body, severity: input.severity, is_active: input.isActive, ends_at: input.endsAt })
      .eq("id", input.id);
    if (error) throw toAppError(error);
  } else {
    const { error } = await supabase.from("announcements").insert({
      title: input.title,
      body: input.body,
      severity: input.severity,
      is_active: input.isActive,
      ends_at: input.endsAt,
      created_by: userData.user?.id,
    });
    if (error) throw toAppError(error);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw toAppError(error);
}

export interface NotificationChannel {
  key: string;
  label: string;
  isConnected: boolean;
}

export async function listChannels(): Promise<NotificationChannel[]> {
  const { data, error } = await supabase.from("notification_channels").select("*").order("key");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({ key: r.key, label: r.label, isConnected: r.is_connected }));
}

export async function setMaintenanceMode(enabled: boolean, message: string | null): Promise<void> {
  const { error } = await supabase.rpc("update_platform_settings", {
    p_updates: { maintenance_mode: enabled, maintenance_message: message } as unknown as Record<string, string>,
  });
  if (error) throw toAppError(error);
}
