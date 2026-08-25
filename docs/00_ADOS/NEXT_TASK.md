---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

Industry Module Engine Phase 4 slice 1 (Dynamic Experience Engine foundation) is shipped and live: `organization_types.experience_config`, Quick Actions on the Dashboard, one Empty State instance in Inventory — real, working, verified against the 3 existing `retail`-type organizations. See [ROADMAP.md](ROADMAP.md) and ADR-011 in [DECISIONS.md](DECISIONS.md) for exactly what's built vs. explicitly deferred.

## Two independent threads, either can go first

**Thread A — Phase 3b flag rollout (unchanged blocker from last session, still needs a human)**: click through real signup in a browser, confirm `organization_type_key`/module flags/audit log/full-profile fields all land correctly, then flip `onboarding.industry_registry_picker` on. See the previous entry in [CHANGELOG.md](CHANGELOG.md) for the exact checklist.

**Thread B — Phase 4, next slice**. Recommended order, but not mandated — pick based on product priority:
1. **Sweep Empty States across more modules** — Orders, CRM, Bookings, Purchasing, HR each likely have their own hardcoded empty-state text; only Inventory was wired this slice as a proof of pattern. Low risk, same pattern, just more files.
2. **Navigation generation from the Module Registry** (originally "Phase 4" in the playbook, now "Phase 4 slice 2") — `AppShell` reads enabled modules from `modules`/`org_feature_flags` instead of the current hardcoded nav. Medium risk (every route depends on nav) — ship behind a flag.
3. **KPI value computation, one metric at a time** — pick a single real, computable metric per configured industry (e.g. retail's "Sales" and "Orders" are already computable from existing Orders data) and wire just that, rather than attempting all 5-6 KPIs per industry at once. Metrics with no supporting query yet (Kitchen Orders, Occupancy Rate, Food Cost) need module-level design work first, not just a dashboard change.
4. **Platform Owner Portal**: extend the Industries section (or build it — verify current state, it may not exist as a UI yet, only as RPCs) to edit `experience_config` without SQL.

**Not recommended to start yet, each needs real design work first**: Reports Engine (needs a report-definition concept added to the Module Registry), Search Engine (nothing to extend — would be built from scratch), AI Experience (blocked entirely on live AI integration existing at all — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md)), Demo Data Engine (a content-design project, not just code).

## Also worth doing, not yet prioritized

- Cosmetic follow-up: `OrgSwitcher.tsx`, `SidebarNav.tsx`, `TenantDetailPage.tsx` still display the legacy `businessType` label (ADR-009 item 5) — could now also show the organization type's name via the registry, once this is prioritized.
- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md). A real test suite with a seeded test database would let sessions verify flows like onboarding end-to-end without needing a human — worth weighing against other priorities.
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md). This also unblocks the AI Experience engine.
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
