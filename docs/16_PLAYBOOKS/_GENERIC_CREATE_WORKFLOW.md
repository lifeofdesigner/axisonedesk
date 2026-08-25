---
title: Generic CREATE_* Workflow
---

# Generic CREATE_* Workflow

Every `CREATE_*` playbook in this folder is a short delta on this shared workflow — read this once, then each individual playbook only states what's different for that artifact type. This exists specifically so the ~55 `CREATE_*` playbooks don't each repeat the same nine steps (per the no-duplication rule in [docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md)).

## Purpose
One consistent, auditable process for adding any new artifact to AxisOneDesk, so quality and documentation don't depend on who's doing the work or which artifact type it is.

## Prerequisites
- [docs/00_ADOS/SESSION_START.md](../00_ADOS/SESSION_START.md) completed for this session.
- You've read the ADOS section covering the area you're extending (e.g. adding a module → read [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md) first).

## Required Documentation
The matching template in [docs/17_TEMPLATES/INDEX.md](../17_TEMPLATES/INDEX.md), if one exists for this artifact type.

## Audit Steps
1. Search for an existing artifact that already does this (check the relevant ADOS doc, [18_REFERENCE](../18_REFERENCE/INDEX.md) registries, and grep the codebase) — do not create a duplicate.
2. Confirm the extension point you're using (table, RPC, hook pattern, route convention) matches an established pattern in [23_EXAMPLES](../23_EXAMPLES/INDEX.md) — don't invent a new pattern for something that already has one.

## Implementation Workflow
1. Scaffold following the matching template.
2. Wire it into the existing system at its natural extension point (a new module route goes in `src/router.tsx` next to its siblings; a new table gets a migration following the numbering in [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md); a new permission goes through the RBAC tables, not a parallel system).
3. Apply RLS/permission checks using the existing primitives (`current_org_ids()`, `has_permission()`) — never client-side-only enforcement for anything tenant-scoped.

## Validation
- `pnpm build` passes.
- `pnpm lint` passes.
- Manually exercised in the browser for anything user-facing (per [docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md)).

## Testing
If a test suite exists for this area by the time you're reading this, it must pass; if not, note the gap in [docs/00_ADOS/TECHNICAL_DEBT.md](../00_ADOS/TECHNICAL_DEBT.md) rather than silently skipping (see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md) for current state).

## Documentation Updates
- The relevant `docs/0X_*/INDEX.md` (what now exists).
- The relevant `docs/18_REFERENCE/*` registry, if this artifact type has one.
- [docs/00_ADOS/PROGRESS.md](../00_ADOS/PROGRESS.md) and, if it changes roadmap status, [docs/00_ADOS/ROADMAP.md](../00_ADOS/ROADMAP.md).

## Definition of Done
Matches [docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md) in full.

## Commit Requirements
One commit (or a small coherent set) per artifact, message states why not just what, per the repo's git conventions (see recent `git log`).
