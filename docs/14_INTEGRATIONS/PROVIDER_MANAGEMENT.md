---
title: Provider Management
last_updated: 2026-08-25
---

# Provider Management

This is the permanent Source of Truth for all third-party provider integrations used by AxisOneDesk — current state and target architecture. **Read this before implementing or modifying any integration.** It is part of the mandatory [SESSION_START](../00_ADOS/SESSION_START.md) reading set for any session touching integrations.

## Provider Management Overview

**Philosophy**: every external provider must be centrally managed from the Platform Owner Portal. No provider credentials are ever hardcoded in application code or committed to the repo. Every provider is configurable by authorized Platform Owners. The application resolves provider configuration from a centralized Provider Registry, not scattered per-feature config files.

**Current reality**: only one piece of this exists today — the AI Providers config layer (`ai_providers`, `ai_prompt_templates`, `ai_usage_logs` tables from `0021_ai_provider_management.sql`, managed via `/ai-providers` in the Platform Owner Portal). It stores provider config but nothing calls a live LLM with it yet (see [06_AI/INDEX.md](../06_AI/INDEX.md)). Every other category below — Payment, Communication, Authentication, Storage, Analytics, Maps, Video, File — has **no implementation** in the current codebase. This document defines the target architecture per category so future work builds toward one coherent registry instead of N incompatible ones.

## AI Providers

**Current**: `ai_providers` table exists (enable/disable, credentials, config). No live call path.

**Target — providers to support**: OpenAI, Anthropic, Google Gemini, xAI (Grok), DeepSeek, Mistral, OpenRouter, Azure OpenAI, Ollama, custom OpenAI-compatible endpoints.

**Per-provider config fields**: Enable/Disable, API Key, Organization ID, Project ID, Base URL, Available Models, Default Model, Temperature, Max Tokens, Timeout, Retry Policy, Usage Limits, Cost Tracking, Test Connection, Health Monitoring, Audit History, Credential Rotation.

Implementation guidance: [.ai/05_AI_SYSTEM.md](../../.ai/05_AI_SYSTEM.md).

## Payment Providers

**Current**: none integrated. `plans`/`subscriptions`/`coupons`/`invoices` are DB-managed only (`0009_billing.sql`, `0014_subscription_licensing.sql`).

**Target — providers to support**: Stripe, Paystack, Korapay, Flutterwave, PayPal, Razorpay, Square, Manual Bank Transfer.

**Per-provider config fields**: Public Key, Secret Key, Webhook Secret, Merchant ID, Sandbox Mode, Live Mode, Supported Currencies, Supported Countries, Health Status, Test Connection, Audit Log, Credential Rotation.

Multiple providers may coexist; Platform Owners define Default Provider, Fallback Provider, and country-/industry-/organization-specific overrides — all configuration, no code changes. See [08_BILLING/INDEX.md](../08_BILLING/INDEX.md).

## Communication Providers

**Current**: none integrated. `notification_channels` table exists (`0019_notifications.sql`) but no outbound email/SMS/WhatsApp/push provider is wired — in-app notifications only today.

**Target — providers to support**: Twilio, Vonage, MessageBird, WhatsApp Cloud API, Meta Business Messaging, SendGrid, Mailgun, Amazon SES, Resend, Postmark. Channels: Email, SMS, WhatsApp, Push.

## Authentication Providers

**Current**: Supabase Auth, email/password only. No social/SSO providers configured.

**Target — providers to support**: Google, Microsoft, Apple, GitHub, Facebook, LinkedIn, SAML, OpenID Connect.

## Storage Providers

**Current**: Supabase Storage only (`axiondesk-assets` bucket + branding bucket).

**Target — providers to support**: Supabase Storage (default), AWS S3, Cloudflare R2, Azure Blob, Google Cloud Storage, DigitalOcean Spaces, Backblaze B2.

## Analytics Providers

**Current**: none integrated. No analytics dependency found in `package.json`.

**Target — providers to support**: Google Analytics, Google Tag Manager, Meta Pixel, Mixpanel, PostHog, Microsoft Clarity, LinkedIn Insight.

## Maps Providers

**Current**: none integrated.

**Target — providers to support**: Google Maps, Mapbox, HERE Maps, OpenStreetMap.

## Video Providers

**Current**: none integrated.

**Target — providers to support**: Zoom, Google Meet, Microsoft Teams. (Also see [.ai/05_WORKSPACE_COLLABORATION.md](../../.ai/05_WORKSPACE_COLLABORATION.md) for native voice/video, a separate track from third-party meeting integrations.)

## File Providers

**Current**: none integrated.

**Target — providers to support**: Google Drive, Dropbox, OneDrive, Box.

## Provider Registry

**Current**: no unified registry exists — the AI Providers table is the only provider-config table, and it's category-specific rather than a generic registry. Developer Tools' `platform_webhooks`/`platform_api_keys` (`0024_developer_tools.sql`) are adjacent but separate (they're for AxisOneDesk's own outbound webhooks/API keys, not third-party provider credentials).

**Target**: a single Provider Registry with per-provider metadata: Name, Category, Description, Enabled Status, Configuration Status, Environment, Supported Features, Required Secrets, Default Provider, Health Status, Last Tested, Last Updated. Navigation, AI, billing, auth, storage, messaging, and analytics code should all resolve provider config from this registry rather than category-specific tables like today's `ai_providers`. Migrating `ai_providers` into the generic registry (rather than keeping it as a special case) should be part of implementing this.

## Security Requirements

- Secrets encrypted at rest.
- Secrets never exposed to frontend/client code — server-only (Edge Function or equivalent), matching the pattern already stated for AI keys in ARCHITECTURE.md §15.
- Secrets display masked after saving.
- Secure credential rotation supported.
- Every credential change audited (extend `audit_logs`, already established in `0010_platform_admin.sql`).
- Only authorized Platform Owner roles may manage providers (reuse existing RBAC — `roles`/`permissions`/`has_permission()`, not a parallel permission system).

## Platform Owner Portal — Integrations Section

**Current**: only `/ai-providers` exists. A general "Integrations" section covering the other 7 categories does not exist.

**Target**: Platform Owners can add/edit/archive/enable/disable/test providers, rotate credentials, view health, view audit history, monitor usage, and configure defaults — all without code changes, for every category above.

## Future Expansion

New providers should be addable via configuration + migration + a provider adapter, not a major application rewrite. This is the same future-proofing principle applied throughout the planned Industry Module Engine (see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)) — config-driven extension over hardcoded branching.

## Cross-references

[06_AI/INDEX.md](../06_AI/INDEX.md) · [08_BILLING/INDEX.md](../08_BILLING/INDEX.md) · [10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md) · [05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md) · [02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md) · [15_DEVELOPER/INDEX.md](../15_DEVELOPER/INDEX.md)
