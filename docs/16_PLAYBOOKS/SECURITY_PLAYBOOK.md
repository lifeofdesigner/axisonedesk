---
title: Security Playbook
---
# SECURITY_PLAYBOOK

## Purpose
Fix or harden a security issue — see [.ai/10_SECURITY.md](../../.ai/10_SECURITY.md) for the broader strategy.

## Prerequisites
Understand the actual attack surface/threat model before fixing — a security fix applied to the wrong layer (e.g. client-side-only validation for something that needs RLS) provides false confidence.

## Required Documentation
[docs/10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md), [.ai/10_SECURITY.md](../../.ai/10_SECURITY.md).

## Audit Steps
1. Confirm the vulnerability is real (reproduce the exploit path, don't assume from a scanner report alone).
2. Check whether it's systemic (does this pattern exist elsewhere? e.g. a missing RLS check on one table often means checking all tables).

## Implementation Workflow
Fix at the correct layer — RLS/permission checks are the tenant-isolation boundary, not client-side checks (see [CREATE_RLS_POLICY.md](CREATE_RLS_POLICY.md)). For credential handling, follow [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Security Requirements.

## Validation
Verify the exploit path is actually closed (attempt it again post-fix), not just that the code looks correct.

## Testing
If a security-relevant test suite exists, extend it with the specific exploit scenario as a regression test.

## Documentation Updates
[docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md) (remove once fixed), [docs/00_ADOS/RISK_REGISTER.md](../00_ADOS/RISK_REGISTER.md) if it changes overall risk posture.

## Definition of Done
[docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md) plus [24_CHECKLISTS/SECURITY_CHECKLIST.md](../24_CHECKLISTS/SECURITY_CHECKLIST.md).

## Commit Requirements
Do not describe the specific exploit in detail in a public commit message if the fix hasn't shipped yet in all environments — describe the fix, not a roadmap for the vulnerability.
