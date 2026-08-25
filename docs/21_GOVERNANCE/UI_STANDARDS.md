---
title: UI Standards
last_updated: 2026-08-25
---

# UI Standards

- shadcn/ui + Tailwind v4 exclusively — no second component library, no inline styles for anything a Tailwind utility covers.
- `next-themes` for light/dark — every new surface must be checked in both themes, not just the one the developer happens to be using.
- Loading and empty states are mandatory for any data-driven view, not optional polish — a new org with zero data is a real, common state, not an edge case (see [16_PLAYBOOKS/CREATE_WIDGET.md](../16_PLAYBOOKS/CREATE_WIDGET.md)).
- Icons: lucide only, via the existing `createLucideIcon` usage pattern.
- Responsive by default — verify at mobile width, not just desktop.

## References
[16_PLAYBOOKS/CREATE_FORM.md](../16_PLAYBOOKS/CREATE_FORM.md) · [24_CHECKLISTS/ACCESSIBILITY_CHECKLIST.md](../24_CHECKLISTS/ACCESSIBILITY_CHECKLIST.md)
