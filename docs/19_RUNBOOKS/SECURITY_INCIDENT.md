---
title: Security Incident Runbook
---
# SECURITY_INCIDENT

1. **Contain first, investigate second** if there's active exploitation — disable the affected feature via feature flag, or revoke the affected credential per [CREDENTIAL_ROTATION.md](CREDENTIAL_ROTATION.md)/[SECRET_ROTATION.md](SECRET_ROTATION.md), before fully understanding root cause if containment can't wait.
2. Assess scope: does this affect tenant data isolation (RLS bypass)? Check `audit_logs` and `error_logs` for evidence of what was accessed.
3. If credentials were exposed (e.g. accidentally committed): rotate immediately per [SECRET_ROTATION.md](SECRET_ROTATION.md) or [CREDENTIAL_ROTATION.md](CREDENTIAL_ROTATION.md), regardless of whether exploitation is confirmed.
4. Fix root cause per [16_PLAYBOOKS/SECURITY_PLAYBOOK.md](../16_PLAYBOOKS/SECURITY_PLAYBOOK.md).
5. If tenant data was actually exposed to another tenant, this is a customer-notification-worthy event — that decision is a business/legal call, not an engineering one; flag it clearly rather than deciding unilaterally.

## Definition of Done
Vulnerability closed and verified closed (re-attempt the exploit path); incident recorded; [docs/00_ADOS/RISK_REGISTER.md](../00_ADOS/RISK_REGISTER.md) updated if it reveals a new risk category.
