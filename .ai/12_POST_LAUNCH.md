---
title: Post-Launch Operations Playbook
---

# 12 — Post-Launch

## Purpose
Guide for operating AxisOneDesk once it has real paying customers — a state not yet reached (no live payment provider, see [docs/08_BILLING/INDEX.md](../docs/08_BILLING/INDEX.md)).

## Business Objective
Sustain reliability and support quality once uptime and response time have real customer consequences.

## Scope
Incident response, on-call, SLA/status page, customer support escalation, growth-loop instrumentation.

## Out of Scope
Pre-launch hardening work itself (see [10_SECURITY.md](10_SECURITY.md), [09_PERFORMANCE.md](09_PERFORMANCE.md), [11_RELEASE_PROCESS.md](11_RELEASE_PROCESS.md) — this playbook assumes those exist).

## Current Implementation
Support Center (tickets + threaded messages, `0017_support_center.sql`) and System Health (in-app `error_logs`, `0022_system_health_monitoring.sql`) exist and give a foundation. Migration `0022`'s comment explicitly notes Sentry is not connected and a formal SLA/status page is out of scope at that time — still true as of 2026-08-25. No on-call rotation tooling, no status page, no incident postmortem process exists.

## Architecture Dependencies
Builds on Support Center and System Health rather than replacing them.

## Required Documentation
New `docs/` allocation when this track becomes active (not yet numbered — could extend `10_SECURITY` or get its own folder depending on scope at the time).

## Required Database Changes
An `incidents` table if formal incident tracking is built beyond ad hoc ticket handling.

## Migration Strategy
Additive.

## Implementation Phases
1. External error tracking (Sentry or equivalent) — closes the gap noted in `0022`'s migration comment.
2. Public status page (can be a simple CMS page initially, reusing `cms_pages`, before investing in a dedicated status-page product).
3. On-call rotation + escalation policy (process, not necessarily new code, unless paging integration is needed).
4. Formal incident postmortem template and process.
5. Growth-loop instrumentation (activation funnels, retention) — depends on analytics provider wiring from [07_INTEGRATIONS.md](07_INTEGRATIONS.md).

## Implementation Order
1 → 2 → 3 → 4, with 5 in parallel once analytics exists.

## Testing Strategy
Incident response process should be dry-run tested (a tabletop exercise) before being trusted for a real incident.

## Rollback Strategy
N/A — this is operational process, not code that ships/reverts.

## Risks
Premature investment here before there are real customers is wasted effort — sequence this after, not before, launch readiness work in [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md).

## Definition of Done
Not a single checkpoint — ongoing operational maturity.

## Future Enhancements
Customer-facing uptime SLA commitments once reliability data justifies them.

## References
[docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md) · [docs/05_PLATFORM_OWNER/INDEX.md](../docs/05_PLATFORM_OWNER/INDEX.md)
