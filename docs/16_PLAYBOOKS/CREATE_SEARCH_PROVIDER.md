---
title: Create Search Provider
---
# CREATE_SEARCH_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add or swap the search backend for cross-entity search (Workspace, CRM, Inventory, etc.).

## Current state
No dedicated search infrastructure exists. [.ai/05_WORKSPACE_COLLABORATION.md](../../.ai/05_WORKSPACE_COLLABORATION.md)'s Search section recommends starting with Postgres full-text search (`tsvector`) before adopting a dedicated search provider (Algolia, Meilisearch, Elasticsearch, etc.) or AI semantic search (which depends on [.ai/05_AI_SYSTEM.md](../../.ai/05_AI_SYSTEM.md)'s embeddings phase).

## Workflow (delta)
1. Default to Postgres `tsvector`/`GIN` index scoped by `org_id` — no new infrastructure needed, and RLS applies naturally since it's a normal table query.
2. Only introduce an external search provider once query volume/relevance needs genuinely exceed what Postgres full-text search can do — don't add infrastructure speculatively.

## Definition of Done
Generic DoD, plus: search results are verified org-scoped (no cross-tenant leakage), same as any other query.
