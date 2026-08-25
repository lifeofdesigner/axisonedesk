---
title: Create Storage Provider
---
# CREATE_STORAGE_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/STORAGE_PROVIDER_TEMPLATE.md](../17_TEMPLATES/STORAGE_PROVIDER_TEMPLATE.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (Storage Providers section).

## Purpose
Add an alternative storage backend (S3, R2, etc.) alongside the default Supabase Storage.

## Current state
Only Supabase Storage is used (`axiondesk-assets` bucket + branding bucket). No abstraction layer exists to swap providers — `src/modules/*` code that touches storage calls the Supabase client directly.

## Workflow (delta)
1. Introduce a storage abstraction (upload/download/delete/signed-URL interface) before wiring a second provider — don't special-case a second provider directly into `files`/Media Library code.
2. Credentials via the Provider Registry (once built) — server-only.
3. Existing `files` table / Media Library UI should work unchanged regardless of which provider backs a given file — add a `provider` column if needed rather than a parallel table.

## Definition of Done
Generic DoD.
