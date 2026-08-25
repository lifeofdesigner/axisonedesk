import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface SystemHealthSnapshot {
  organizationsCount: number;
  usersCount: number;
  activeSubscriptionsCount: number;
  ordersCount: number;
  productsCount: number;
  openTicketsCount: number;
  unresolvedErrorCount: number;
  checkedAt: string;
  dbLatencyMs: number;
}

export async function getSystemHealth(): Promise<SystemHealthSnapshot> {
  const start = performance.now();
  const { data, error } = await supabase.rpc("platform_system_health").single();
  const dbLatencyMs = Math.round(performance.now() - start);
  if (error) throw toAppError(error);
  return {
    organizationsCount: Number(data.organizations_count),
    usersCount: Number(data.users_count),
    activeSubscriptionsCount: Number(data.active_subscriptions_count),
    ordersCount: Number(data.orders_count),
    productsCount: Number(data.products_count),
    openTicketsCount: Number(data.open_tickets_count),
    unresolvedErrorCount: Number(data.unresolved_error_count),
    checkedAt: data.checked_at,
    dbLatencyMs,
  };
}

export interface ErrorLogEntry {
  id: string;
  message: string;
  stack: string | null;
  url: string | null;
  userId: string | null;
  resolved: boolean;
  createdAt: string;
}

export async function listErrorLogs(): Promise<ErrorLogEntry[]> {
  const { data, error } = await supabase
    .from("error_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    message: r.message,
    stack: r.stack,
    url: r.url,
    userId: r.user_id,
    resolved: r.resolved,
    createdAt: r.created_at,
  }));
}

export async function resolveErrorLog(id: string, resolved: boolean): Promise<void> {
  const { error } = await supabase.rpc("platform_resolve_error_log", { p_id: id, p_resolved: resolved });
  if (error) throw toAppError(error);
}

export interface PlatformIntegration {
  key: string;
  label: string;
  category: string;
  docsUrl: string | null;
  isConnected: boolean;
}

export async function listPlatformIntegrations(): Promise<PlatformIntegration[]> {
  const { data, error } = await supabase.from("platform_integrations").select("*").order("label");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    key: r.key,
    label: r.label,
    category: r.category,
    docsUrl: r.docs_url,
    isConnected: r.is_connected,
  }));
}

export async function setIntegrationConnected(key: string, isConnected: boolean): Promise<void> {
  const { error } = await supabase.rpc("platform_set_integration_connected", {
    p_key: key,
    p_is_connected: isConnected,
  });
  if (error) throw toAppError(error);
}
