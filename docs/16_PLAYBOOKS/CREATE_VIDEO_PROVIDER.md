---
title: Create Video Provider
---
# CREATE_VIDEO_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (target list: Zoom, Google Meet, Microsoft Teams).

## Purpose
Integrate a third-party meeting/video provider — distinct from native voice/video, which is its own much larger track (see [.ai/05_WORKSPACE_COLLABORATION.md](../../.ai/05_WORKSPACE_COLLABORATION.md), Voice & Video section, which explicitly recommends evaluating third-party integration vs. native build).

## Workflow (delta)
1. OAuth or API-key based meeting-link creation, server-side.
2. Store meeting metadata (link, scheduled time) against the relevant ERP/Workspace record it's attached to.
3. Don't conflate this with building native voice/video — that's a separate, much larger effort.

## Definition of Done
Generic DoD.
