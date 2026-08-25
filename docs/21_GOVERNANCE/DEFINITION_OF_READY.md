---
title: Definition of Ready
---
# Definition of Ready

A task is ready to start when:

- [ ] The problem/feature is stated concretely enough to know what "done" looks like (pairs with [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)).
- [ ] It's clear whether this is a new artifact (has a matching [16_PLAYBOOKS](../16_PLAYBOOKS/INDEX.md) entry) or an extension of an existing one — checked against [docs/18_REFERENCE](../18_REFERENCE/INDEX.md) and the relevant `docs/0X_*/INDEX.md` so no duplicate is built.
- [ ] Required dependencies exist — e.g. don't start a task that needs the Module Registry if [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 1 hasn't shipped yet (see [docs/22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md](../22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md) — never skip architectural foundations).
- [ ] Scope is small enough to be one milestone, per [docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md)'s Incremental Delivery Rule — if it isn't, it needs to be decomposed first.
- [ ] [docs/00_ADOS/SESSION_START.md](../00_ADOS/SESSION_START.md) has been run so current state is understood, not assumed.

If any box can't be checked, the task isn't ready — decompose or research further before implementing.
