/**
 * Supabase-backed data layer for Settings. Reads/writes `organizations`,
 * `organization_members`, and `roles` directly — all core tables from
 * migration 0001, not owned by any feature module (see ARCHITECTURE.md §4).
 *
 * Scope note: email invites are NOT implemented here. `profiles` has no
 * email column and the client cannot query `auth.users.email` — a real
 * invite-by-email flow needs a `service_role`-backed Edge Function
 * (`auth.admin.inviteUserByEmail`) plus a transactional email provider,
 * neither of which is deployed in this environment (see ARCHITECTURE.md §6,
 * §13 — provider selection is explicitly deferred). Member/role management
 * for existing members is fully functional.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type { Member, OrgProfile, Role } from "@/modules/settings/types";

type OrgRow = Database["public"]["Tables"]["organizations"]["Row"];
type RoleRow = Database["public"]["Tables"]["roles"]["Row"];

export async function getOrgProfile(orgId: string): Promise<OrgProfile> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();

  if (error) throw toAppError(error);
  const row = data as OrgRow;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    businessType: row.business_type,
    timezone: row.timezone,
    currency: row.currency,
    status: row.status,
  };
}

export interface UpdateOrgProfileInput {
  name: string;
  timezone: string;
  currency: string;
}

export async function updateOrgProfile(orgId: string, input: UpdateOrgProfileInput): Promise<void> {
  const { error } = await supabase
    .from("organizations")
    .update({ name: input.name, timezone: input.timezone, currency: input.currency })
    .eq("id", orgId);

  if (error) throw toAppError(error);
}

export async function listRoles(orgId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .or(`org_id.eq.${orgId},org_id.is.null`)
    .order("is_system_role", { ascending: false });

  if (error) throw toAppError(error);
  return (data as RoleRow[]).map((r) => ({ id: r.id, name: r.name, isSystemRole: r.is_system_role }));
}

export async function listMembers(orgId: string): Promise<Member[]> {
  // organization_members.user_id references auth.users, not public.profiles
  // directly, so PostgREST can't auto-embed profiles here (it can embed
  // roles, which IS a direct FK). Profiles are looked up separately, same
  // pattern as Orders/Dashboard resolving customer names.
  const { data, error } = await supabase
    .from("organization_members")
    .select("id, user_id, role_id, status, joined_at, roles(name)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);

  const rows = data as unknown as {
    id: string;
    user_id: string;
    role_id: string;
    status: string;
    joined_at: string | null;
    roles: { name: string } | null;
  }[];

  const userIds = rows.map((r) => r.user_id);
  let namesById = new Map<string, string | null>();
  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);
    if (profileError) throw toAppError(profileError);
    namesById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  }

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    fullName: namesById.get(r.user_id) ?? null,
    roleId: r.role_id,
    roleName: r.roles?.name ?? "Unknown",
    status: r.status,
    joinedAt: r.joined_at,
  }));
}

export async function updateMemberRole(orgId: string, memberId: string, roleId: string): Promise<void> {
  const { error } = await supabase
    .from("organization_members")
    .update({ role_id: roleId })
    .eq("org_id", orgId)
    .eq("id", memberId);

  if (error) throw toAppError(error);
}
