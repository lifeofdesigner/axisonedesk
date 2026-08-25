---
title: Accessibility Standards
last_updated: 2026-08-25
---

# Accessibility Standards

No formal accessibility audit has been performed on AxisOneDesk as of 2026-08-25 — this is a target standard, not a verified-compliant status.

- shadcn/ui primitives (Dialog, AlertDialog, Select, Tabs, etc. — see `src/shared/components/ui`) are Radix-based and accessible by default; don't override their built-in keyboard/focus/ARIA behavior without strong reason.
- Every form field needs an associated label (react-hook-form + the existing form components in `src/shared/components/forms` should handle this — verify per new form).
- Color contrast: verify new UI against WCAG AA at minimum, especially for both light and dark themes (`next-themes` is in use — check both).
- Icons (lucide, via `createLucideIcon`) used without accompanying text need an `aria-label`.

## References
[24_CHECKLISTS/ACCESSIBILITY_CHECKLIST.md](../24_CHECKLISTS/ACCESSIBILITY_CHECKLIST.md)
