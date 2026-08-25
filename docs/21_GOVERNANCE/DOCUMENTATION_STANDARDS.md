---
title: Documentation Standards
last_updated: 2026-08-25
---

# Documentation Standards

- **No fabrication** — every claim of "implemented" must be verifiable against actual code/migrations. Unbuilt things are marked Planned, never Complete. This is the single non-negotiable rule of the entire ADOS/EEKP system (see [docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md)).
- **One Source of Truth per fact** — if two docs could describe the same thing, one must reference the other instead of restating it. This is why [18_REFERENCE](../18_REFERENCE/INDEX.md)'s pointer docs exist (e.g. `PROVIDER_REGISTRY.md` just points at `docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md`).
- **Dated freshness** — every doc with state that can go stale carries a `last_updated` frontmatter field; update it whenever the content changes materially, not on every typo fix.
- **Real examples over hypothetical ones** — link to actual files/migrations (see [23_EXAMPLES](../23_EXAMPLES/INDEX.md)) rather than inventing illustrative pseudo-code when a real equivalent exists.
- **Markdown, cross-linked** — relative links between docs, not absolute paths or prose references like "see the database doc" without a link.
- **No placeholder sections** — an empty "TBD" section is worse than no section; either write it or omit it.

## References
[docs/00_ADOS/AI_INSTRUCTIONS.md](../00_ADOS/AI_INSTRUCTIONS.md) · [16_PLAYBOOKS/_GENERIC_CREATE_WORKFLOW.md](../16_PLAYBOOKS/_GENERIC_CREATE_WORKFLOW.md)
