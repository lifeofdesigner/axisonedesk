---
title: Enterprise Workspace & Collaboration Playbook
---

# 05 — Workspace & Collaboration

This is an engineering blueprint for a future platform, not implementation. It is not a Source of Truth on its own — see [docs/07_WORKSPACE/INDEX.md](../docs/07_WORKSPACE/INDEX.md) for the current (empty) state, which this playbook must not be confused with.

## Purpose
Define the target architecture for a Teams/Slack/Discord-class collaboration platform deeply integrated with AxisOneDesk's ERP, so it feels native rather than bolted on.

## Business Objective
Reduce tool-switching for customers by keeping communication next to the business data it's about (messages linkable to orders/tickets/CRM records, tasks creatable from conversations).

## Scope
Channels (public/private/team/department/project), DMs, group conversations, threads, announcements, company feed, guest/external collaboration, presence, reactions/editing/pinning/mentions, rich text, files & media, voice/video/meetings, AI collaboration features, task/ERP integration, notifications, enterprise search, permissions, realtime architecture, database design.

## Out of Scope
General AI system plumbing (see [05_AI_SYSTEM.md](05_AI_SYSTEM.md), a prerequisite for the AI Collaboration section here) and the Industry Engine (see [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md)).

## Current Implementation: none

Verified 2026-08-25: no `channels`, `messages`, `conversations`, or any collaboration-related table exists in the schema. No corresponding module exists under `src/modules/`. This entire playbook describes **Future Vision**, not partially-built functionality. Do not represent any part of this section as implemented until it actually ships — update [docs/07_WORKSPACE/INDEX.md](../docs/07_WORKSPACE/INDEX.md) module-by-module as real code lands.

## Architecture Dependencies

- Tenant isolation must use the existing RLS pattern (`current_org_ids()`, `has_permission()`) — no parallel isolation mechanism.
- Permissions must extend the existing `roles`/`permissions`/`role_permissions` model, not introduce a separate permission system (see Permissions section below).
- Notifications should integrate with the existing `notifications`/`notification_channels` tables (`0019_notifications.sql`) rather than duplicating them.
- File attachments should reuse the Media Library's `files` table / `axiondesk-assets` bucket pattern (`0018_media_library.sql`) where practical, extended for message-scoped attachments.
- Realtime needs Supabase Realtime (Postgres logical replication over the existing Supabase project) as the default transport — no separate realtime infrastructure unless load requires it.

## Target Architecture

### Messaging & Channels
Team/public/private channels, department/project channels, DMs, group conversations, threaded replies, announcements, company feed. Cross-org collaboration and guest/external users are explicitly future — design the schema so `channel_members` can reference a user without requiring `organization_members` membership (a "guest" concept), but don't build guest auth flows in Phase 1.

### Presence & Interaction
Online status, typing indicators, read receipts, reactions, edit/delete, pinned/saved/draft messages, mentions, hashtags, bookmarks, rich text (Markdown), code blocks, emoji, GIFs, polls, forms, shared notes/wikis. Whiteboards are explicitly future, not in the phased plan below.

### Files & Media
Images/video/audio/documents, drag-drop, multi-attachment, preview, version history, shared folders, storage quotas, media gallery — extends Media Library patterns, org-scoped quotas likely live on `organizations` or a new `workspace_settings` table.

### Voice & Video
1:1 and group voice/video, screen/window/presentation sharing, recording, meeting chat, waiting rooms, meeting links, calendar scheduling, live captions, call history. This is the largest scope item — likely requires a third-party SFU/media server (not something to build from scratch); treat as its own multi-phase effort (Phases 4-6 below), and consider whether integrating an existing video provider (see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Video Providers: Zoom, Google Meet, Microsoft Teams) is a faster path to value than building native voice/video before native messaging is proven.

### AI Collaboration
Meeting notes/summary/action-item extraction/task creation, conversation summary, smart replies, translation, grammar suggestions, knowledge search, voice transcription, speaker ID. Depends entirely on [05_AI_SYSTEM.md](05_AI_SYSTEM.md)'s provider abstraction existing first — do not build bespoke AI calls here.

### Tasks & Productivity Integration
Create tasks from messages; link messages to ERP records (orders, CRM deals, tickets). Requires a generic "linkable record" pattern — likely a `message_links` join table (message_id, linked_table, linked_id) rather than a foreign key per ERP table, to stay extensible without schema churn as more modules exist.

### Notifications
In-app (extend existing), push, email, SMS (future), desktop, mention/channel-specific preferences, quiet hours, digests. Depends on [07_INTEGRATIONS.md](07_INTEGRATIONS.md) for email/SMS/push provider wiring.

### Search
Messages, channels, files, users, tasks, projects, CRM/inventory/orders, AI semantic search, filters, saved searches — likely Postgres full-text search initially (`tsvector`), with semantic/AI search deferred to align with [05_AI_SYSTEM.md](05_AI_SYSTEM.md)'s embeddings phase.

### Permissions
Channel create/delete/moderate, voice/video, screen share, uploads, guest access, recording, AI usage, administration — all as new `permissions` rows consumed by the existing `has_permission()` function and RLS policies. No new permission engine.

### Realtime Architecture
Supabase Realtime (Postgres CDC) for message delivery, presence, typing. Needs an explicit retry/reconnect strategy for mobile/flaky connections and an offline-write queue design (messages composed offline sync on reconnect) — not yet designed in detail.

## Proposed Database Design (high-level, not final)

- `workspace_channels` (org-scoped, type: public/private/team/department/project/dm)
- `workspace_channel_members` (channel_id, user_id, role)
- `workspace_messages` (channel_id, author_id, body, parent_message_id for threads, created_at, edited_at, deleted_at)
- `workspace_message_reactions`
- `workspace_message_attachments` (references `files`)
- `workspace_message_links` (generic ERP-record linking, see above)
- `workspace_calls` / `workspace_meetings` / `workspace_call_participants` / `workspace_recordings` (Phase 4+)
- `workspace_presence` (likely ephemeral/Realtime-only, not a persisted table)
- `workspace_notifications` — evaluate reusing the existing `notifications` table with a `source_module` discriminator instead of a new table.

Finalize exact schema against the live `database.types.ts` at implementation time — this is a plan, not a migration.

## Implementation Plan (Phases)

**Phase 1 — Messaging Foundation**
Scope: DMs + basic channel messaging, no threads/reactions yet. Dependencies: none beyond core auth/org. DB: `workspace_channels`, `workspace_channel_members`, `workspace_messages`. APIs: `src/modules/workspace/api.ts` + `hooks.ts` following the established module pattern. UI: minimal chat panel. Testing: manual + RLS verification that a user in org A cannot see org B's channels. Risks: realtime scaling unknowns at this stage are low (small message volume). Rollback: feature-flagged module, disable via `feature_flags`.

**Phase 2 — Channels**
Scope: public/private/team/department/project channel types, channel management UI, permissions (create/delete/moderate). DB: extends Phase 1 tables + `permissions` rows. Risks: permission model correctness — verify against `has_permission()` patterns.

**Phase 3 — Files**
Scope: attachments, previews, shared folders, quotas. DB: `workspace_message_attachments`, extends Media Library. Risks: storage quota enforcement, abuse prevention.

**Phase 4 — Voice**
Scope: 1:1 and group voice calls. Requires selecting a media transport (build vs. integrate — see Voice & Video note above). Risks: highest technical risk in the whole playbook; do not underestimate infra cost.

**Phase 5 — Video**
Scope: 1:1 and group video, screen share.

**Phase 6 — Meetings**
Scope: scheduled meetings, calendar integration, waiting rooms, recording.

**Phase 7 — AI Collaboration**
Scope: meeting notes/summary, smart replies, translation — depends on [05_AI_SYSTEM.md](05_AI_SYSTEM.md) Phase 1-2 being complete first.

**Phase 8 — Enterprise Search**
Scope: cross-entity search including workspace content.

**Phase 9 — External Collaboration**
Scope: guest users, cross-org collaboration. Highest security sensitivity — extends RLS/permission model to a non-member user class; needs its own security review before design, not just before ship.

## Implementation Order
1 → 2 → 3 sequentially (each is low-medium risk and builds naturally). 4-6 (voice/video/meetings) should be evaluated as a make-vs-integrate decision before committing engineering time — do not assume "build" is the default. 7 gated on AI system maturity. 8 can start in parallel with 2-3. 9 last, with a dedicated security review.

## Testing Strategy
No project-wide test framework exists yet (see [docs/11_TESTING/INDEX.md](../docs/11_TESTING/INDEX.md)) — Phase 1 is a reasonable place to introduce the first real test coverage (RLS isolation tests for channels/messages), given the sensitivity of getting tenant isolation right in a new data domain.

## Rollback Strategy
Every phase ships behind a feature flag (reusing `feature_flags`/`org_feature_flags`), consistent with how every other module is gated today.

## Risks
Realtime scaling at growth (Postgres CDC has limits — revisit if message volume grows), voice/video build-vs-buy cost, guest/external collaboration security surface, AI collaboration cost if usage limits aren't enforced (see [05_AI_SYSTEM.md](05_AI_SYSTEM.md)).

## Definition of Done (Phase 1 example)
Two users in the same org can DM each other and see messages in realtime; a user in a different org cannot see or query those messages via any client, verified against RLS directly (not just UI-hidden).

## Future Enhancements
Shared whiteboards, SIP integration, voicemail, cross-org collaboration at scale.

## ADOS Integration
This playbook is referenced from [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md), [docs/00_ADOS/PROJECT_STATE.md](../docs/00_ADOS/PROJECT_STATE.md), [docs/00_ADOS/PROJECT_HEALTH.md](../docs/00_ADOS/PROJECT_HEALTH.md), [docs/00_ADOS/AI_INSTRUCTIONS.md](../docs/00_ADOS/AI_INSTRUCTIONS.md), and [docs/00_ADOS/NEXT_TASK.md](../docs/00_ADOS/NEXT_TASK.md), and [docs/07_WORKSPACE/INDEX.md](../docs/07_WORKSPACE/INDEX.md).

## References
[docs/07_WORKSPACE/INDEX.md](../docs/07_WORKSPACE/INDEX.md) · [05_AI_SYSTEM.md](05_AI_SYSTEM.md) · [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) · [docs/03_DATABASE/INDEX.md](../docs/03_DATABASE/INDEX.md) · [docs/10_SECURITY/INDEX.md](../docs/10_SECURITY/INDEX.md)
