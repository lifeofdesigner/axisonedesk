---
title: Dependencies
last_updated: 2026-08-25
---

# Key Dependencies

From `package.json`, 2026-08-25 — full detail in [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md) Stack section (this file is the quick-lookup list, not a duplicate).

**Core**: React 19.2.8, React Router 7.18.2, TypeScript ~6.0.2, Vite 8.2.0
**Data**: `@supabase/supabase-js` 2.112.3, TanStack Query 5.101.4, TanStack Table 8.21.3
**Forms**: react-hook-form 7.85, zod 4.4.3, `@hookform/resolvers`
**UI**: Tailwind CSS v4, shadcn/ui, framer-motion, sonner, cmdk, next-themes, lucide (icons)
**Data viz**: recharts
**Misc**: date-fns, react-barcode
**Package manager**: pnpm

Notably absent: no test framework, no analytics SDK, no error-tracking SDK, no payment SDK, no LLM SDK — see [docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md).

## References
[docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)
