---
title: Coding Standards
last_updated: 2026-08-25
---

# Coding Standards

Extends [docs/15_DEVELOPER/INDEX.md](../15_DEVELOPER/INDEX.md) (not duplicated — that doc is the summary, this is the detail).

- TypeScript strict — no `any` for data shapes that exist in `database.types.ts`.
- ESLint flat config (`eslint.config.js`) must pass with no new errors; warnings should trend down, not up.
- Prettier formatting enforced (`prettier-plugin-tailwindcss` sorts Tailwind classes — don't hand-order them differently).
- Module pattern (`api.ts` + `hooks.ts` + `components/`) is mandatory for new modules — see [16_PLAYBOOKS/CREATE_MODULE.md](../16_PLAYBOOKS/CREATE_MODULE.md).
- No comments explaining *what* code does (names should do that) — only comments explaining non-obvious *why* (a workaround, a hidden constraint). This mirrors the standard this documentation system itself was written under.
- No premature abstraction — three similar lines beat a speculative shared helper for a hypothetical third caller that doesn't exist yet.
- No dead code paths behind unused flags — if it's not reachable, remove it rather than leaving it "for later."

## References
[docs/15_DEVELOPER/INDEX.md](../15_DEVELOPER/INDEX.md) · [16_PLAYBOOKS/REFACTOR_PLAYBOOK.md](../16_PLAYBOOKS/REFACTOR_PLAYBOOK.md)
