import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface PlatformApiKey {
  id: string;
  label: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export async function listApiKeys(): Promise<PlatformApiKey[]> {
  const { data, error } = await supabase.from("platform_api_keys").select("*").order("created_at", { ascending: false });
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    label: r.label,
    keyPrefix: r.key_prefix,
    createdAt: r.created_at,
    lastUsedAt: r.last_used_at,
    revokedAt: r.revoked_at,
  }));
}

export async function createApiKey(label: string): Promise<{ id: string; rawKey: string }> {
  const { data, error } = await supabase.rpc("platform_create_api_key", { p_label: label }).single();
  if (error) throw toAppError(error);
  return { id: data.id, rawKey: data.raw_key };
}

export async function revokeApiKey(id: string): Promise<void> {
  const { error } = await supabase.rpc("platform_revoke_api_key", { p_id: id });
  if (error) throw toAppError(error);
}

export interface PlatformWebhook {
  id: string;
  label: string;
  url: string;
  secret: string;
  eventTypes: string[];
  isActive: boolean;
  createdAt: string;
}

export async function listWebhooks(): Promise<PlatformWebhook[]> {
  const { data, error } = await supabase.from("platform_webhooks").select("*").order("created_at", { ascending: false });
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    label: r.label,
    url: r.url,
    secret: r.secret,
    eventTypes: r.event_types,
    isActive: r.is_active,
    createdAt: r.created_at,
  }));
}

export async function createWebhook(input: { label: string; url: string; eventTypes: string[] }): Promise<void> {
  const { error } = await supabase.from("platform_webhooks").insert({
    label: input.label,
    url: input.url,
    event_types: input.eventTypes,
  });
  if (error) throw toAppError(error);
}

export async function setWebhookActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("platform_webhooks").update({ is_active: isActive }).eq("id", id);
  if (error) throw toAppError(error);
}

export async function deleteWebhook(id: string): Promise<void> {
  const { error } = await supabase.from("platform_webhooks").delete().eq("id", id);
  if (error) throw toAppError(error);
}

export interface EdgeFunctionStatus {
  key: string;
  label: string;
  description: string;
  isDeployed: boolean;
  docsUrl: string | null;
}

export async function listEdgeFunctions(): Promise<EdgeFunctionStatus[]> {
  const { data, error } = await supabase.from("platform_edge_functions").select("*").order("key");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    key: r.key,
    label: r.label,
    description: r.description,
    isDeployed: r.is_deployed,
    docsUrl: r.docs_url,
  }));
}

export async function setEdgeFunctionDeployed(key: string, isDeployed: boolean): Promise<void> {
  const { error } = await supabase.rpc("platform_set_edge_function_deployed", { p_key: key, p_is_deployed: isDeployed });
  if (error) throw toAppError(error);
}
