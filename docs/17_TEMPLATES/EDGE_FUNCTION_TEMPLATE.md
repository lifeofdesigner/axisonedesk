---
title: Edge Function Template
---
# EDGE_FUNCTION_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_EDGE_FUNCTION.md](../16_PLAYBOOKS/CREATE_EDGE_FUNCTION.md). No real example exists in the repo yet (see that playbook's Current state) — this is a from-scratch skeleton, not extracted from existing code.

```ts
// supabase/functions/<name>/index.ts
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const secret = Deno.env.get("<PROVIDER>_SECRET_KEY"); // never client-supplied

  // ...logic...

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```
