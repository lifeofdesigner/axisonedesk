---
title: API (module api.ts) Template
---
# API_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_API.md](../16_PLAYBOOKS/CREATE_API.md). Mirrors `src/modules/inventory/api.ts`'s pattern.

```ts
// src/modules/<name>/api.ts
import { supabase } from "@/core/supabase/client";
import type { Tables } from "@/core/supabase/database.types";

export type <Name> = Tables<"<table_name>">;

export async function list<Name>s(orgId: string) {
  const { data, error } = await supabase
    .from("<table_name>")
    .select("*")
    .eq("org_id", orgId);
  if (error) throw error;
  return data;
}

export async function create<Name>(orgId: string, input: Partial<<Name>>) {
  const { data, error } = await supabase
    .from("<table_name>")
    .insert({ ...input, org_id: orgId })
    .select()
    .single();
  if (error) throw error;
  return data;
}
```
