---
title: Service Template
---
# SERVICE_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_SERVICE.md](../16_PLAYBOOKS/CREATE_SERVICE.md).

```ts
// src/shared/lib/<name>.ts — pure function, no React/Supabase dependency
export function <functionName>(input: <InputType>): <OutputType> {
  // pure logic, unit-testable in isolation
}
```

If the logic needs Supabase access, it belongs in a module's `api.ts` (see [API_TEMPLATE.md](API_TEMPLATE.md)) instead — this template is specifically for dependency-free shared logic.
