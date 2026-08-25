---
title: Incident Response Runbook
---
# INCIDENT_RESPONSE

No formal on-call/incident process exists yet (see [.ai/12_POST_LAUNCH.md](../../.ai/12_POST_LAUNCH.md)) — this is the minimum viable procedure until one is built.

1. **Assess**: is this a [PERFORMANCE_INCIDENT.md](PERFORMANCE_INCIDENT.md) or [SECURITY_INCIDENT.md](SECURITY_INCIDENT.md)? Route accordingly — they have different first steps.
2. **Check System Health** (`/platform-admin/system-health`) and `error_logs` for related errors.
3. **Contain**: if a specific feature/module is the cause, disable it via [feature flag](../18_REFERENCE/FEATURE_FLAG_REGISTRY.md) if that stops the bleeding faster than a code fix.
4. **Fix**: [16_PLAYBOOKS/HOTFIX_PLAYBOOK.md](../16_PLAYBOOKS/HOTFIX_PLAYBOOK.md) if urgent, otherwise [16_PLAYBOOKS/BUG_FIX_PLAYBOOK.md](../16_PLAYBOOKS/BUG_FIX_PLAYBOOK.md).
5. **Verify**: [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md).
6. **Record**: add to [docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md) and, if a lesson worth generalizing, [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md).

No formal postmortem template exists yet — see [.ai/12_POST_LAUNCH.md](../../.ai/12_POST_LAUNCH.md) Phase 4.
