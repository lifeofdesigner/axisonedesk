---
title: Create Automation
---
# CREATE_AUTOMATION

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [CREATE_EVENT.md](CREATE_EVENT.md)/[CREATE_BACKGROUND_JOB.md](CREATE_BACKGROUND_JOB.md).

## Purpose
Wire a trigger → action automation (e.g. "when an order ships, notify the customer").

## Current state
No dedicated automation/rules engine exists. Today's equivalent is ad hoc: Postgres trigger functions per event (see [CREATE_EVENT.md](CREATE_EVENT.md)) that directly perform the follow-up action (e.g. `notify_on_ticket_message()` in `0019_notifications.sql`).

## Workflow (delta)
1. For a one-off, fixed trigger→action pair: a Postgres trigger function is sufficient — don't build a generic rules engine for a single automation.
2. For genuinely configurable automation (user-defined trigger/action pairs), that's a larger system not yet designed — raise it as a candidate for [.ai/13_FUTURE_IDEAS.md](../../.ai/13_FUTURE_IDEAS.md) rather than building a one-off "rules engine" inside a single feature.

## Definition of Done
Generic DoD.
