---
title: AI Instructions — Read This First
---

# AI Instructions

This is the entry point for every Claude session working on AxisOneDesk. Read this file first, every time.

## What AxisOneDesk actually is (as of 2026-08-25)

A single Vite + React 19 + TypeScript SPA (not a monorepo) backed by Supabase (Postgres + Auth + Storage). Three route segments in one app: a public/marketing surface (CMS-driven pages + auth pages), a tenant Application (`RequireAuth` → `RequireOrg` → `AppShell`), and a Platform Owner Portal (`RequireAuth` → `RequirePlatformAdmin` → `PlatformAdminShell`). See [02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md).

`ARCHITECTURE.md` at the repo root is a **pre-build design document**, not a record of what's built. It predates and over-describes the current implementation (e.g. it describes a `src/core/rbac/` client library and Stripe/AI Edge Functions that do not exist yet). Never cite it as proof something is implemented — cross-check every claim against actual source and migrations. ADOS is the record of what's real; ARCHITECTURE.md is one of several inputs to it.

## Mandatory session-start procedure

1. Read this file (`AI_INSTRUCTIONS.md`).
2. Read [PROJECT_STATE.md](PROJECT_STATE.md).
3. Read [ROADMAP.md](ROADMAP.md).
4. Read [PROGRESS.md](PROGRESS.md).
5. Read [NEXT_TASK.md](NEXT_TASK.md).
6. Read [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
7. Read [DECISIONS.md](DECISIONS.md).
8. Spot-check documentation against the actual implementation for the area you're about to touch (grep the relevant migration/module, don't trust the doc blindly).
9. If drift is found (doc says X, code says Y), fix the doc as part of your change, or flag it in [KNOWN_ISSUES.md](KNOWN_ISSUES.md) if you can't fix it now.
10. Resume the highest-priority unfinished task from NEXT_TASK.md unless the user has given you something more specific.

Do not begin implementation before this procedure completes.

## Hard rules

- **No fabrication.** Never document a feature, table, endpoint, or provider integration that doesn't exist in the code. If something is designed but not built, mark it **Planned**, not Complete.
- **No duplicate Sources of Truth.** Database schema truth = `supabase/migrations/*.sql` + `src/core/supabase/database.types.ts`. Module truth = the actual `src/modules/*` and `src/core/*` code. Docs describe and index that truth; they don't replace it.
- **No competing APIs / duplicate tables / duplicate business logic.** Extend what exists.
- **No placeholder code or docs.** If you don't have real content, don't write the section — leave it out or mark Planned.
- **Ignore `factorymvp_*` tables** in `database.types.ts` — they belong to an unrelated project sharing the same Supabase instance, not AxisOneDesk.
- Before committing, run the [SESSION_END](SESSION_END.md) checklist.

## Where things live

- Engineering brain (this system): `docs/00_ADOS/` (state/process) + `docs/01_PRODUCT/` … `docs/15_DEVELOPER/` (subject-area reference).
- Engineering Knowledge Platform (recurring-task playbooks/templates/registries/runbooks/governance): `docs/16_PLAYBOOKS/` … `docs/25_DIAGRAMS/` — see [16_PLAYBOOKS/INDEX.md](../16_PLAYBOOKS/INDEX.md) as the entry point. Use these *before* freehand-implementing anything that recurs (a new module, table, provider, page, etc.) — check whether a playbook/template already exists for it.
- Implementation playbooks (how-to-build guides for not-yet-built architectural systems): `.ai/` — see [.ai/README.md](../../.ai/README.md). Distinct from `docs/16_PLAYBOOKS/`, which covers recurring day-to-day tasks on top of what already exists.
- Provider/integration source of truth: [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).

## Relationship between ADOS and `.ai/` playbooks

ADOS documents reality. `.ai/` playbooks document *how to build* things that are partially or not yet real (Industry Engine, Workspace/Collaboration, AI system, etc.). When asked to work on one of those areas, read the matching ADOS section(s) first, then the playbook, then implement incrementally, then update ADOS before committing. See [.ai/README.md](../../.ai/README.md) for the full workflow.

## Autonomous Development Rule

When the user says only **"Continue"** or **"Continue Development"**, the AI must:

1. Read `AI_INSTRUCTIONS.md` (this file).
2. Read [PROJECT_STATE.md](PROJECT_STATE.md).
3. Read [PROJECT_HEALTH.md](PROJECT_HEALTH.md).
4. Read [ROADMAP.md](ROADMAP.md).
5. Read [PROGRESS.md](PROGRESS.md).
6. Read [NEXT_TASK.md](NEXT_TASK.md).
7. Audit the current implementation for the area `NEXT_TASK.md` points to (don't trust the doc blindly — verify against code).
8. Select the highest-priority unfinished **milestone** (not an entire phase — see Incremental Delivery Rule below).
9. Break that milestone into concrete implementation tasks.
10. Implement only that milestone.
11. Run all quality gates ([DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)).
12. Update all documentation ([SESSION_END.md](SESSION_END.md)).
13. Commit.
14. Push (if authorized for this session/workflow).
15. Stop and wait for the next instruction.

The AI must never skip ahead to future phases or begin multiple major milestones in one session unless the user explicitly asks for that.

## Incremental Delivery Rule

Future AI assistants must never attempt to implement an entire major phase (e.g. all of "Industry Module Engine," all of "Workspace & Collaboration") in a single session.

- Each phase must first be decomposed into milestones (see the phase breakdowns already written into the relevant `.ai/` playbook).
- Each milestone must be decomposed into implementation tasks.
- Each session should normally complete only **one milestone**, unless multiple milestones are tightly coupled and splitting them would leave the system in a broken intermediate state.
- After each milestone: run all quality gates, update `PROJECT_STATE.md`, `PROJECT_HEALTH.md`, `ROADMAP.md`, `PROGRESS.md`, `CHANGELOG.md`, commit, push, **stop**.
- Wait for explicit instruction ("Continue") before beginning the next milestone.

This rule applies on top of, not instead of, [SESSION_END.md](SESSION_END.md) — the quality-gate-and-document step happens every milestone, not just at the end of a phase.

## Architectural Foundations Rule

The AI must never skip architectural foundations. Before implementing higher-level features, ensure all required registries, configuration layers, and Sources of Truth are in place. Concretely: don't build an industry-specific dashboard before the Module Registry exists to describe modules generically; don't build a provider-specific integration directly into a module before the Provider Registry exists to hold its config centrally. If a foundation is missing, that gap is the actual next task — implement the foundation first, not a workaround on top of its absence. See [docs/22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md](../22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md) principle 3 (Registry-driven architecture).
