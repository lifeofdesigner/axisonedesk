import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface AiProvider {
  key: string;
  label: string;
  docsUrl: string | null;
  models: string[];
  isConnected: boolean;
  connectedAt: string | null;
  notes: string | null;
}

export async function listAiProviders(): Promise<AiProvider[]> {
  const { data, error } = await supabase.rpc("platform_list_ai_providers");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    key: r.key,
    label: r.label,
    docsUrl: r.docs_url,
    models: Array.isArray(r.models) ? (r.models as string[]) : [],
    isConnected: r.is_connected,
    connectedAt: r.connected_at,
    notes: r.notes,
  }));
}

export async function setAiProviderConnected(key: string, isConnected: boolean, notes: string | null): Promise<void> {
  const { error } = await supabase.rpc("platform_set_ai_provider_connected", {
    p_key: key,
    p_is_connected: isConnected,
    p_notes: notes as unknown as string,
  });
  if (error) throw toAppError(error);
}

export interface AiPromptTemplate {
  id: string;
  key: string;
  label: string;
  description: string | null;
  template: string;
  updatedAt: string;
}

export async function listAiPromptTemplates(): Promise<AiPromptTemplate[]> {
  const { data, error } = await supabase.from("ai_prompt_templates").select("*").order("label");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    key: r.key,
    label: r.label,
    description: r.description,
    template: r.template,
    updatedAt: r.updated_at,
  }));
}

export async function upsertAiPromptTemplate(input: {
  key: string;
  label: string;
  description: string | null;
  template: string;
}): Promise<void> {
  const { error } = await supabase.rpc("platform_upsert_ai_prompt_template", {
    p_key: input.key,
    p_label: input.label,
    p_description: input.description as unknown as string,
    p_template: input.template,
  });
  if (error) throw toAppError(error);
}

export interface AiSettings {
  activeProvider: string | null;
  defaultModel: string | null;
  enabled: boolean;
}

export async function getAiSettings(): Promise<AiSettings> {
  const { data, error } = await supabase
    .from("platform_settings")
    .select("active_ai_provider, ai_default_model, ai_assistant_enabled")
    .single();
  if (error) throw toAppError(error);
  return {
    activeProvider: data.active_ai_provider,
    defaultModel: data.ai_default_model,
    enabled: data.ai_assistant_enabled,
  };
}

export async function updateAiSettings(input: AiSettings): Promise<void> {
  const { error } = await supabase.rpc("platform_update_ai_settings", {
    p_active_provider: input.activeProvider as unknown as string,
    p_default_model: input.defaultModel as unknown as string,
    p_enabled: input.enabled,
  });
  if (error) throw toAppError(error);
}

export interface AiUsageSummaryRow {
  providerKey: string | null;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  callCount: number;
}

export async function getAiUsageSummary(): Promise<AiUsageSummaryRow[]> {
  const { data, error } = await supabase.rpc("platform_ai_usage_summary");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    providerKey: r.provider_key,
    totalInputTokens: Number(r.total_input_tokens),
    totalOutputTokens: Number(r.total_output_tokens),
    totalCostUsd: Number(r.total_cost_usd),
    callCount: Number(r.call_count),
  }));
}
