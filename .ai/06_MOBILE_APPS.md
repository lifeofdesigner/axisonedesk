---
title: Mobile Playbook
---

# 06 — Mobile Apps

## Purpose
Guide for a future native/hybrid mobile client.

## Business Objective
Field staff (inventory, deliveries, HR check-in) benefit more from mobile than office roles do — mobile is likely valuable before it's necessary for every persona.

## Scope
Mobile architecture choice, offline support, push notifications, camera, barcode scanner, file uploads, sync, auth, security, deep linking, app store release.

## Out of Scope
Building the web app's feature parity — mobile should consume the same Supabase backend, not a parallel one.

## Current Implementation: none
No mobile project (React Native, Capacitor, Flutter, or native) exists in this repo as of 2026-08-25.

## Architecture Dependencies
Must reuse the existing Supabase Auth session model and RLS — no separate mobile-only backend. `react-barcode` is already a web dependency (label generation, not scanning) — a real scanning capability is a new addition.

## Required Documentation
New `docs/` area if this track starts (not yet allocated a folder — extend the numbering when it does).

## Required Database Changes
Likely none initially — mobile consumes existing tables/RPCs. A `push_tokens` table would be needed for push notifications, extending the `notification_channels` pattern from `0019_notifications.sql`.

## Migration Strategy
Additive (`push_tokens` table) when that phase starts.

## Implementation Phases
1. Framework decision (React Native/Expo vs. Capacitor wrapping the existing Vite app vs. native) — evaluate against team skillset and how much of `src/shared/` and `src/modules/*/api.ts` can be reused.
2. Auth + core read-only views (Dashboard, Inventory lookup).
3. Camera/barcode scanning for Inventory.
4. Offline queue + sync for field operations.
5. Push notifications (needs a Communication Provider, see [07_INTEGRATIONS.md](07_INTEGRATIONS.md)).
6. App store / Play store release process.

## Implementation Order
1 → 2 → 3, then 4-6 as usage justifies the investment.

## Testing Strategy
Device-matrix manual testing initially; no automated mobile test suite exists.

## Rollback Strategy
Mobile is additive — a failed release doesn't affect the web app.

## Risks
Framework choice lock-in; offline sync conflict resolution is a genuinely hard problem — don't underscope it.

## Definition of Done
Not applicable until Phase 1 is chosen — this playbook is planning-stage only.

## Future Enhancements
Offline-first architecture for low-connectivity field use (agriculture, logistics industries).

## References
[docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) · [docs/02_ARCHITECTURE/INDEX.md](../docs/02_ARCHITECTURE/INDEX.md)
