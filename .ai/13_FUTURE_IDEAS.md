---
title: Future Ideas (Unscoped)
---

# 13 — Future Ideas

Ideas worth remembering but not yet worth a dedicated playbook — either too speculative, too far downstream of unbuilt dependencies, or not yet prioritized. When one of these gets real product intent behind it, promote it to its own numbered playbook and remove it from this list.

- AI-suggested industry detection at signup (depends on [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) + [05_AI_SYSTEM.md](05_AI_SYSTEM.md) both existing).
- Cross-organization industry benchmarking dashboards (would require aggregate, anonymized cross-tenant queries — needs its own privacy/security review given the RLS model is built entirely around tenant isolation).
- Shared whiteboards in Workspace (explicitly deferred in [05_WORKSPACE_COLLABORATION.md](05_WORKSPACE_COLLABORATION.md)).
- SIP integration / voicemail for Workspace voice (deferred in the same playbook).
- Per-industry marketplace add-ons, once both the Industry Engine and Marketplace ([08_MARKETPLACE.md](08_MARKETPLACE.md)) exist.
- Revenue share model for third-party marketplace developers.
- SOC 2 readiness program (see [10_SECURITY.md](10_SECURITY.md) Future Enhancements).
- Offline-first mobile architecture for low-connectivity field use in Agriculture/Logistics industry templates.
- Headless CMS migration if `cms_pages` outgrows a single-table model.

## How to use this file

Add an idea with a one-line rationale and, if known, which playbook it's downstream of. Don't write implementation detail here — that's what promoting it to a real playbook is for. Remove ideas that turn out to be wrong or superseded.
