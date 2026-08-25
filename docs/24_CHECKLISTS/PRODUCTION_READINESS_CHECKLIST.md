---
title: Production Readiness Checklist
---
# PRODUCTION_READINESS_CHECKLIST

See [docs/00_ADOS/PROJECT_HEALTH.md](../00_ADOS/PROJECT_HEALTH.md) for the current live score against this list.

- [ ] Automated test coverage for critical paths (auth, RLS isolation, payments once live)
- [ ] CI running build+lint (and tests, once they exist) on every change
- [ ] At least one live payment provider, if monetizing
- [ ] Error tracking wired (currently only in-app `error_logs`)
- [ ] Disaster recovery plan drill-tested at least once (currently untested)
- [ ] Security review of RLS coverage complete (see [docs/18_REFERENCE/RLS_POLICY_REGISTRY.md](../18_REFERENCE/RLS_POLICY_REGISTRY.md))
- [ ] Documentation (this system) reflects actual shipped state, verified not assumed
