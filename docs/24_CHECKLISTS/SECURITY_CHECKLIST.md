---
title: Security Checklist
---
# SECURITY_CHECKLIST

See [16_PLAYBOOKS/SECURITY_PLAYBOOK.md](../16_PLAYBOOKS/SECURITY_PLAYBOOK.md) and [16_PLAYBOOKS/CREATE_RLS_POLICY.md](../16_PLAYBOOKS/CREATE_RLS_POLICY.md).

- [ ] Every new tenant table has RLS enabled with select + write policies
- [ ] Cross-tenant access (if any) goes through a `security definer` RPC with an explicit `is_platform_admin()` check
- [ ] No secret/credential appears in client-side code or network requests (checked in devtools, not just source)
- [ ] Verified isolation by direct query as two different org users, not just by UI behavior
- [ ] No new permission silently ships unenforced (or is explicitly documented as declared-not-enforced, per [docs/18_REFERENCE/PERMISSIONS_MATRIX.md](../18_REFERENCE/PERMISSIONS_MATRIX.md)'s existing gap)
