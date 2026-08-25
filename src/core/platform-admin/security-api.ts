import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface RlsCoverageRow {
  tableName: string;
  rlsEnabled: boolean;
  policyCount: number;
}

export async function getRlsCoverage(): Promise<RlsCoverageRow[]> {
  const { data, error } = await supabase.rpc("platform_rls_coverage");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    tableName: r.table_name,
    rlsEnabled: r.rls_enabled,
    policyCount: Number(r.policy_count),
  }));
}

export interface SecurityEvent {
  id: string;
  actorEmail: string | null;
  action: string;
  entityType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export async function listSecurityEvents(limit = 50): Promise<SecurityEvent[]> {
  const { data, error } = await supabase.rpc("platform_security_events", { p_limit: limit });
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    actorEmail: r.actor_email,
    action: r.action,
    entityType: r.entity_type,
    metadata: (r.metadata ?? {}) as Record<string, unknown>,
    createdAt: r.created_at,
  }));
}
