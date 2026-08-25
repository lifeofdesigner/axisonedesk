---
title: Create Security Feature
---
# CREATE_SECURITY_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md), [docs/10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md), and [.ai/10_SECURITY.md](../../.ai/10_SECURITY.md).

## Purpose
Add a security-relevant feature (2FA, rate limiting, key rotation UI, etc.).

## Workflow (delta)
Follow [.ai/10_SECURITY.md](../../.ai/10_SECURITY.md)'s phase order — check whether Supabase Auth's native capability (e.g. MFA) already covers the need before building custom. Any new security feature must itself pass [SECURITY_PLAYBOOK.md](SECURITY_PLAYBOOK.md) review before shipping.

## Definition of Done
Generic DoD, plus [24_CHECKLISTS/SECURITY_CHECKLIST.md](../24_CHECKLISTS/SECURITY_CHECKLIST.md).
