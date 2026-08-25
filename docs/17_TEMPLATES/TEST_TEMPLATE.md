---
title: Test Template (aspirational — no framework installed yet)
---
# TEST_TEMPLATE

Pair with [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md). **No test framework is installed** as of 2026-08-25 — this template shows the recommended shape (Vitest + React Testing Library) for when one is adopted; it is not runnable against the current repo.

```ts
// src/modules/<name>/__tests__/<name>.test.ts (recommended location, not yet created)
import { describe, it, expect } from "vitest";

describe("<thing under test>", () => {
  it("does the expected behavior", () => {
    expect(true).toBe(true); // replace with real assertion
  });
});
```

For RLS-sensitive logic specifically, prefer a test that exercises two distinct org contexts and asserts isolation, per [16_PLAYBOOKS/CREATE_RLS_POLICY.md](../16_PLAYBOOKS/CREATE_RLS_POLICY.md) Validation guidance.
