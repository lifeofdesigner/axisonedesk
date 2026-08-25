---
title: Create Map Provider
---
# CREATE_MAP_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (target list: Google Maps, Mapbox, HERE, OpenStreetMap).

## Purpose
Wire a maps/geocoding provider — currently **not implemented**, no location/geocoding feature exists in any module yet.

## Workflow (delta)
1. Confirm an actual product need first (e.g. Logistics/delivery industry template, once it exists) before adding — this is a provider category with no current consumer in the codebase.
2. API key handling: some map providers (e.g. Mapbox client tokens scoped to a domain) are safe to expose client-side by design — verify per-provider whether it needs the server-only treatment in [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) or has its own scoped-token model; don't assume all providers need identical secret handling.

## Definition of Done
Generic DoD.
