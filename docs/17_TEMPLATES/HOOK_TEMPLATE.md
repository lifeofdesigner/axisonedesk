---
title: Hook Template
---
# HOOK_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_HOOK.md](../16_PLAYBOOKS/CREATE_HOOK.md). Mirrors `src/modules/inventory/hooks.ts`'s pattern.

```ts
// src/modules/<name>/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { list<Name>s, create<Name> } from "./api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function use<Name>s() {
  const { orgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["<name>", orgId],
    queryFn: () => list<Name>s(orgId!),
    enabled: !!orgId,
  });
}

export function useCreate<Name>() {
  const { orgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<<Name>>) => create<Name>(orgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["<name>", orgId] }),
  });
}
```
