---
title: Hotfix Playbook
---
# HOTFIX_PLAYBOOK

## Purpose
Ship an urgent fix for a production-breaking issue faster than the normal [RELEASE_PLAYBOOK.md](RELEASE_PLAYBOOK.md), without skipping the checks that actually matter for correctness.

## Prerequisites
Confirm it's genuinely urgent (production is broken or actively unsafe) — not just "would be nice to ship fast." Most fixes should go through the normal [BUG_FIX_PLAYBOOK.md](BUG_FIX_PLAYBOOK.md) + [DEPLOYMENT_PLAYBOOK.md](DEPLOYMENT_PLAYBOOK.md).

## Required Documentation
[24_CHECKLISTS/HOTFIX_CHECKLIST.md](../24_CHECKLISTS/HOTFIX_CHECKLIST.md).

## Audit Steps
Root-cause the issue even under time pressure — a hotfix that papers over a symptom often causes a second incident.

## Implementation Workflow
Smallest possible fix that resolves the production issue. `pnpm build` + `pnpm lint` still run — these are fast and catch real breakage; do not skip them even under urgency. Skip only what's genuinely non-blocking (e.g. broader refactor cleanup, non-critical doc polish) and note what was skipped.

## Validation
Verify the specific production issue is resolved, in production, after deploy — not just locally.

## Testing
Same bar as [DEPLOYMENT_PLAYBOOK.md](DEPLOYMENT_PLAYBOOK.md) — no automated suite exists yet, so manual verification of the exact broken path is mandatory.

## Documentation Updates
Full [docs/00_ADOS/SESSION_END.md](../00_ADOS/SESSION_END.md) checklist still applies — hotfix urgency doesn't exempt documentation, it just compresses the timeline. Do it immediately after the fix ships, not "later."

## Definition of Done
Production issue confirmed resolved; documentation caught up within the same session.

## Commit Requirements
Commit message clearly marked as a hotfix, with the production impact stated.
