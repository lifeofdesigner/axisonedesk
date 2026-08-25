---
title: Testing
last_updated: 2026-08-25
---

# 11_TESTING

## Current state: no test suite exists

- `package.json` has no test runner dependency (no vitest, jest, playwright, @testing-library).
- `tests/unit`, `tests/e2e`, `tests/docs` directories exist but are empty scaffolds.
- No `pnpm test` script.
- No CI to run tests even if they existed (see [12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md)).

This is the single largest quality risk in the project (see [00_ADOS/RISK_REGISTER.md](../00_ADOS/RISK_REGISTER.md)).

## Recommended starting point

Given the RLS-heavy architecture, the highest-value initial coverage is: (1) auth/org-switching flows, (2) RLS-sensitive RPCs (`adjust_stock`, order create/update, platform-admin cross-tenant RPCs), (3) RBAC-gated UI actions. Vitest + React Testing Library fits the existing Vite toolchain; Playwright for e2e once there's enough surface to justify it. No decision has been made on this yet — it's a recommendation, not a committed plan.
