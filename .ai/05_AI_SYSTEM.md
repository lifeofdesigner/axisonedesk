---
title: AI System Playbook
---

# 05 — AI System

## Purpose
Define how to take the AI Assistant from a disabled config-only shell to a working, multi-provider, industry-aware AI layer.

## Business Objective
A functioning AI Assistant is core to the product's differentiation; today it's a visibly disabled UI element, which is a credibility gap for any demo or launch.

## Scope
Provider Registry integration, model routing, prompt library + versioning, context management, embeddings/knowledge base/RAG, usage limits, permissions, agent registry, industry-specific AI behavior selection.

## Out of Scope
Workspace/Collaboration AI features like meeting transcription (see [05_WORKSPACE_COLLABORATION.md](05_WORKSPACE_COLLABORATION.md)) — related but a distinct, larger track.

## Current Implementation
Verified 2026-08-25: `src/modules/ai-assistant/AiAssistantOverview.tsx` is a disabled shell (input/button `disabled`, explicit "not connected" copy). Config layer exists: `ai_providers`, `ai_prompt_templates`, `ai_usage_logs` (`0021_ai_provider_management.sql`), managed via `/ai-providers` in the Platform Owner Portal. **No code calls an LLM API anywhere in the repo.** No Supabase Edge Function exists for this (`supabase/functions/` has only an empty `_shared/`). See [docs/06_AI/INDEX.md](../docs/06_AI/INDEX.md).

## Architecture Dependencies
Must not ship provider API keys to the client — per ARCHITECTURE.md §15's stated design intent (not yet built), calls must go through a server-mediated Edge Function. Reuses the existing `ai_providers` config table rather than a parallel credential store; should eventually fold into the generic Provider Registry from [07_INTEGRATIONS.md](07_INTEGRATIONS.md) rather than staying a special case.

## Required Documentation
Update [docs/06_AI/INDEX.md](../docs/06_AI/INDEX.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) as each phase ships.

## Required Database Changes
`ai_providers`/`ai_prompt_templates`/`ai_usage_logs` already exist and are likely sufficient for Phase 1-2. A `knowledge_base_documents`/embeddings table (likely `pgvector`) is needed for Phase 4 (RAG) — not yet designed in detail.

## Migration Strategy
Additive. RAG/embeddings phase requires enabling the `pgvector` extension if not already enabled — verify via `supabase/config.toml` before assuming.

## Implementation Phases
1. **Edge Function call path**: build `supabase/functions/ai-assistant` (or equivalent) that reads `ai_providers` config server-side, calls the configured provider, returns a response. Wire the existing disabled UI to it.
2. **Provider abstraction**: support the provider list in [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (OpenAI, Anthropic, Gemini, xAI, DeepSeek, Mistral, OpenRouter, Azure OpenAI, Ollama, custom) behind one interface so switching providers is config, not code.
3. **Prompt library + versioning**: formalize `ai_prompt_templates` usage, add version history.
4. **Usage limits + cost tracking**: enforce per-org/per-plan limits using `ai_usage_logs`.
5. **Knowledge base / RAG**: org-scoped document embeddings for grounded answers.
6. **Industry-aware prompt selection**: depends on [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) existing first.
7. **Agent registry**: multi-agent capability catalog, once single-turn assistant is solid.

## Implementation Order
1 → 2 → 3 → 4, then 5-7 by product priority. Do not build 6 before the Industry Engine's registry exists.

## Testing Strategy
Manual verification against at least two providers to confirm the abstraction isn't leaking provider-specific assumptions. No automated suite exists project-wide yet.

## Rollback Strategy
Keep the UI's disabled state as a feature-flaggable fallback if the Edge Function has an outage — fail closed to "not connected," never fail open to an unauthenticated/unscoped call.

## Risks
Cost overrun without usage limits (Phase 4 should not be deferred indefinitely). Prompt injection / data leakage across tenants if the Edge Function doesn't scope RAG queries by `org_id` — treat this with the same rigor as RLS.

## Definition of Done
User can type into the AI Assistant and get a real, provider-backed response, scoped to their org, within configured usage limits, with the API key never exposed client-side.

## Future Enhancements
Multi-agent workflows, AI-driven module recommendations, voice input.

## References
[docs/06_AI/INDEX.md](../docs/06_AI/INDEX.md) · [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) · [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md)
