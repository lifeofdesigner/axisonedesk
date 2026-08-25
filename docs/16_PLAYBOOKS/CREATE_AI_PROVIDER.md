---
title: Create AI Provider
---
# CREATE_AI_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/AI_PROVIDER_TEMPLATE.md](../17_TEMPLATES/AI_PROVIDER_TEMPLATE.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (AI Providers section — the Source of Truth for the target field list and provider list).

## Purpose
Add a new AI provider option (e.g. Anthropic, OpenAI) to the config layer.

## Current state
`ai_providers` table + `/ai-providers` Platform Owner UI exist and are real. No live call path exists yet — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md) and [.ai/05_AI_SYSTEM.md](../../.ai/05_AI_SYSTEM.md).

## Workflow (delta)
1. Add config row via the existing `/ai-providers` UI / `platform_list_ai_providers` and related RPCs (`0021_ai_provider_management.sql`) — never hardcode a provider's credentials in source.
2. Do not build a provider-specific call path directly in a component — that belongs in the server-mediated integration layer per [.ai/05_AI_SYSTEM.md](../../.ai/05_AI_SYSTEM.md) once it exists.
3. Once the generic Provider Registry ([.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md)) exists, new providers should register there instead of the `ai_providers`-specific table.

## Definition of Done
Generic DoD, plus: credential never appears client-side (check network tab), per [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Security Requirements.
