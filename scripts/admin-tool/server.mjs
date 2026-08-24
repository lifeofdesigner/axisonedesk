// Standalone LOCAL-ONLY admin bootstrap tool. Uses the service_role key to
// create users and grant platform-admin / org roles directly against the
// live Supabase project — this is how the very first platform admin gets
// created, since nothing in the main app can safely self-grant that.
//
// This must NEVER be deployed publicly. The service_role key it reads from
// .env.local bypasses every RLS policy in the database. It never touches
// src/ and never ships in the Vite app bundle.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This tool never uses Supabase Realtime, but supabase-js's client
// constructor eagerly requires a WebSocket implementation to exist even so.
// Node 20 has no native WebSocket global (that lands in Node 22), so stub
// one out — it's never actually invoked since we never call .channel(...).
if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class NoopWebSocket {
    close() {}
  };
}

function loadEnvLocal() {
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(
      "Missing scripts/admin-tool/.env.local — copy .env.local.example and fill in SUPABASE_SERVICE_ROLE_KEY.",
    );
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

const env = loadEnvLocal();
if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is empty in .env.local");
  process.exit(1);
}

const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PORT = 5959;

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function listEverything() {
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (usersError) throw usersError;

  const { data: profiles } = await admin.from("profiles").select("id, full_name");
  const { data: platformAdmins } = await admin.from("platform_admins").select("user_id");
  const { data: orgs } = await admin.from("organizations").select("id, name, status").is("deleted_at", null);
  const { data: members } = await admin
    .from("organization_members")
    .select("user_id, org_id, role_id, roles(name)");
  const { data: roles } = await admin.from("roles").select("id, org_id, name, is_system_role");

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  const adminIds = new Set((platformAdmins ?? []).map((a) => a.user_id));
  const membersByUser = new Map();
  for (const m of members ?? []) {
    const list = membersByUser.get(m.user_id) ?? [];
    list.push({ orgId: m.org_id, roleName: m.roles?.name ?? "Unknown" });
    membersByUser.set(m.user_id, list);
  }

  const users = usersData.users.map((u) => ({
    id: u.id,
    email: u.email,
    createdAt: u.created_at,
    fullName: profileById.get(u.id) ?? null,
    isPlatformAdmin: adminIds.has(u.id),
    orgMemberships: membersByUser.get(u.id) ?? [],
  }));

  return { users, orgs: orgs ?? [], roles: roles ?? [] };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === "GET" && url.pathname === "/") {
      const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/state") {
      const state = await listEverything();
      return sendJson(res, 200, state);
    }

    if (req.method === "POST" && url.pathname === "/api/create-user") {
      const { email, password, fullName } = await readJson(req);
      if (!email || !password) return sendJson(res, 400, { error: "email and password required" });
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName || null },
      });
      if (error) return sendJson(res, 400, { error: error.message });
      return sendJson(res, 200, { userId: data.user.id });
    }

    if (req.method === "POST" && url.pathname === "/api/grant-platform-admin") {
      const { userId } = await readJson(req);
      if (!userId) return sendJson(res, 400, { error: "userId required" });
      const { error } = await admin.from("platform_admins").insert({ user_id: userId });
      if (error) return sendJson(res, 400, { error: error.message });
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/revoke-platform-admin") {
      const { userId } = await readJson(req);
      if (!userId) return sendJson(res, 400, { error: "userId required" });
      const { error } = await admin.from("platform_admins").delete().eq("user_id", userId);
      if (error) return sendJson(res, 400, { error: error.message });
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/assign-org-role") {
      const { userId, orgId, roleId } = await readJson(req);
      if (!userId || !orgId || !roleId) return sendJson(res, 400, { error: "userId, orgId, roleId required" });
      const { error } = await admin
        .from("organization_members")
        .upsert(
          { user_id: userId, org_id: orgId, role_id: roleId, status: "active", joined_at: new Date().toISOString() },
          { onConflict: "org_id,user_id" },
        );
      if (error) return sendJson(res, 400, { error: error.message });
      return sendJson(res, 200, { ok: true });
    }

    sendJson(res, 404, { error: "not found" });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: String(err) });
  }
});

server.listen(PORT, () => {
  console.log(`Admin bootstrap tool running at http://localhost:${PORT}`);
  console.log("Local-only. Do not expose this port publicly.");
});
