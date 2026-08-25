---
title: Create Organization Type
---
# CREATE_ORGANIZATION_TYPE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [CREATE_INDUSTRY.md](CREATE_INDUSTRY.md) — "organization type" and "industry" share the same underlying `organization_types` table design in the plan; this playbook covers creating an entirely new type (e.g. "Law Firm," "Church") outside the initial shipped template set, without any code change once the system exists.

## Current state
Does not exist — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md).

## Workflow (delta, once the system exists)
Identical to [CREATE_INDUSTRY.md](CREATE_INDUSTRY.md) — the whole point of the Organization Type Library design is that a net-new type (not one of the initially shipped templates) requires the exact same configuration workflow as any other, with zero application code changes. If adding a new type ever requires touching `src/`, that's a sign the registry-driven design has a gap — treat it as a bug in the Industry Engine implementation, not a one-off exception.

## Definition of Done
N/A until [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) ships. Once it does: a new org type is fully usable after only Platform Owner Portal configuration — no deploy required.
