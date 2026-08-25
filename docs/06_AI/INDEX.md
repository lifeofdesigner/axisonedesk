---
title: AI System
last_updated: 2026-08-25
---

# 06_AI

## Current state: config-only, no live integration

- **Tenant-facing**: `src/modules/ai-assistant/AiAssistantOverview.tsx` is a UI shell. Input field and Ask button are explicitly `disabled`, with copy stating it's "not connected in this environment — there's no LLM provider API key configured." Per ARCHITECTURE.md §15 (design intent, not yet built), the key is meant to live only in a server-mediated Edge Function, never shipped to the client — and indeed no `supabase/functions/ai-assistant` exists.
- **Platform-facing**: `src/pages/PlatformAiProviderPage.tsx` + `src/core/platform-admin/ai-provider-api.ts`/`ai-provider-hooks.ts` let a Platform Owner configure provider credentials into three tables from `0021_ai_provider_management.sql`: `ai_providers`, `ai_prompt_templates`, `ai_usage_logs`. This is real, working config UI — but nothing in the app currently calls an LLM API with that config.

## Gap

There is no code path from "provider configured in `ai_providers`" to "an actual model call happens." Building that is future work — see [.ai/05_AI_SYSTEM.md](../../.ai/05_AI_SYSTEM.md) for the implementation playbook (provider registry, model routing, prompt library, RAG, agent registry, industry-specific AI behavior).

## Industry-specific AI behavior (planned)

Not implemented — no per-industry prompt selection exists because the Industry Module Engine itself doesn't exist yet. See [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) and [.ai/05_AI_SYSTEM.md](../../.ai/05_AI_SYSTEM.md).

## Cross-references

- [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) — AI Providers section documents the target multi-provider architecture (OpenAI, Anthropic, Gemini, xAI, DeepSeek, Mistral, OpenRouter, Azure OpenAI, Ollama, custom OpenAI-compatible).
