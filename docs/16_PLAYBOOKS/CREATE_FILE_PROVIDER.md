---
title: Create File Provider
---
# CREATE_FILE_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (target list: Google Drive, Dropbox, OneDrive, Box — distinct from Storage Providers, which are the backend for AxisOneDesk's own file storage; File Providers are for importing/linking a user's external files).

## Purpose
Let a tenant connect an external file service for import/link (not for AxisOneDesk's own storage — see [CREATE_STORAGE_PROVIDER.md](CREATE_STORAGE_PROVIDER.md) for that).

## Workflow (delta)
OAuth-based per-tenant connection (each org authorizes its own Drive/Dropbox/etc., not a single platform-wide credential) — this is a different credential model from every other provider category in [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md), which are mostly platform-owner-configured. Design the registry entry to support per-org OAuth tokens, not just a single platform-level secret.

## Definition of Done
Generic DoD.
