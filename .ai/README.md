---
title: AI Playbook System
---

# .ai/ — Implementation Playbooks

## Purpose

Reusable implementation guides for building systems that are partially or not yet real in AxisOneDesk, so future Claude sessions can execute them without a large prompt each time.

## ADOS vs. Playbooks

- **`docs/00_ADOS/` + `docs/01_PRODUCT/` … `docs/15_DEVELOPER/`** document **reality** — what's actually built, verified against the code. This is the Source of Truth.
- **`.ai/` playbooks** document **how to build** things that don't fully exist yet (Industry Engine, Workspace/Collaboration, live AI integration, marketplace, etc.). They are implementation guides, not a Source of Truth — if a playbook and the code disagree, the code (and ADOS's description of it) wins. Update the playbook or move its content into ADOS once the thing is actually built.

Never duplicate ADOS content inside a playbook — reference it instead.

## How future Claude sessions should use this

1. Read [docs/00_ADOS/AI_INSTRUCTIONS.md](../docs/00_ADOS/AI_INSTRUCTIONS.md).
2. Execute [docs/00_ADOS/SESSION_START.md](../docs/00_ADOS/SESSION_START.md).
3. Read [docs/00_ADOS/PROJECT_STATE.md](../docs/00_ADOS/PROJECT_STATE.md).
4. Read [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md).
5. Read [docs/00_ADOS/PROGRESS.md](../docs/00_ADOS/PROGRESS.md).
6. Read the requested playbook(s) below.
7. Audit the current implementation for that area (don't trust the playbook's "Current Implementation" section blindly — verify).
8. Implement incrementally, in the phase order the playbook specifies.
9. Update ADOS per [docs/00_ADOS/SESSION_END.md](../docs/00_ADOS/SESSION_END.md) before committing.

## Execution order (when starting from zero)

1. [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) — foundational; other playbooks assume module/industry awareness will eventually exist.
2. [10_SECURITY.md](10_SECURITY.md) and [09_PERFORMANCE.md](09_PERFORMANCE.md) — cross-cutting, cheaper to bake in early.
3. Everything else, driven by product priority — see [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md) for current priority order.

## Playbook index

| File | Covers |
|---|---|
| [01_ADOS_MAINTENANCE.md](01_ADOS_MAINTENANCE.md) | Keeping ADOS synchronized with reality |
| [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) | Module Registry, Industry/Org-Type templates, template-driven onboarding |
| [03_PUBLIC_WEBSITE.md](03_PUBLIC_WEBSITE.md) | Marketing site, landing pages, SEO, docs portal |
| [04_MARKETING.md](04_MARKETING.md) | Campaigns, lead capture, CMS-driven content strategy |
| [05_AI_SYSTEM.md](05_AI_SYSTEM.md) | Provider registry, model routing, prompts, RAG, agents |
| [05_WORKSPACE_COLLABORATION.md](05_WORKSPACE_COLLABORATION.md) | Channels, DMs, voice/video, meetings, AI collaboration |
| [06_MOBILE_APPS.md](06_MOBILE_APPS.md) | Mobile architecture, offline, push, app store release |
| [07_INTEGRATIONS.md](07_INTEGRATIONS.md) | Implementing the Provider Registry from [PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) |
| [08_MARKETPLACE.md](08_MARKETPLACE.md) | Module installation, partner apps, publishing workflow |
| [09_PERFORMANCE.md](09_PERFORMANCE.md) | Caching, lazy loading, DB optimization, monitoring |
| [10_SECURITY.md](10_SECURITY.md) | Auth, RLS, secrets, audit, compliance, DR |
| [11_RELEASE_PROCESS.md](11_RELEASE_PROCESS.md) | Versioning, CI/CD, release notes |
| [12_POST_LAUNCH.md](12_POST_LAUNCH.md) | Ops, on-call, incident response, growth loops |
| [13_FUTURE_IDEAS.md](13_FUTURE_IDEAS.md) | Unscoped/speculative ideas not yet worth a full playbook |

Note: `05_AI_SYSTEM.md` and `05_WORKSPACE_COLLABORATION.md` share the numeric prefix `05` intentionally — both were commissioned as parallel "05" playbooks; the index above is the authoritative ordering, not the filename number.
