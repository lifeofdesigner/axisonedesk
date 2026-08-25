---
title: Release Playbook
---
# RELEASE_PLAYBOOK

## Purpose
Ship a normal (non-urgent) batch of changes.

## Prerequisites
See [24_CHECKLISTS/RELEASE_CHECKLIST.md](../24_CHECKLISTS/RELEASE_CHECKLIST.md).

## Required Documentation
[docs/13_RELEASES/INDEX.md](../13_RELEASES/INDEX.md), [.ai/11_RELEASE_PROCESS.md](../../.ai/11_RELEASE_PROCESS.md).

## Audit Steps
Review everything going out together — per [docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md)'s Incremental Delivery Rule, a release should correspond to one completed milestone, not an accumulation of unrelated half-finished work.

## Implementation Workflow
Follow [DEPLOYMENT_PLAYBOOK.md](DEPLOYMENT_PLAYBOOK.md). No formal versioning/tagging exists yet (see [docs/13_RELEASES/INDEX.md](../13_RELEASES/INDEX.md)) — if adopting one, bump `package.json` version and tag per [.ai/11_RELEASE_PROCESS.md](../../.ai/11_RELEASE_PROCESS.md) Phase 3.

## Validation
[19_RUNBOOKS/PRODUCTION_VERIFICATION.md](../19_RUNBOOKS/PRODUCTION_VERIFICATION.md).

## Testing
Per [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md) current state.

## Documentation Updates
Full [docs/00_ADOS/SESSION_END.md](../00_ADOS/SESSION_END.md) checklist, plus [docs/00_ADOS/CHANGELOG.md](../00_ADOS/CHANGELOG.md) release entry.

## Definition of Done
[24_CHECKLISTS/RELEASE_CHECKLIST.md](../24_CHECKLISTS/RELEASE_CHECKLIST.md) fully checked.

## Commit Requirements
Standard, per [docs/00_ADOS/WORKFLOW.md](../00_ADOS/WORKFLOW.md).
