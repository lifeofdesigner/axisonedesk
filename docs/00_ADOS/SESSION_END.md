---
title: Session End Procedure
---

# Session End

Run this procedure before every commit that changes application code, database migrations, or documentation.

## 1. Quality gate

- `pnpm build` (runs `tsc -b && vite build`) — must pass.
- `pnpm lint` (ESLint flat config) — must pass, or new warnings/errors must be justified.
- Regression tests — **currently none exist** (see [11_TESTING/INDEX.md](../11_TESTING/INDEX.md)); once a test suite exists, it must pass here too. Do not skip this step silently once tests exist — if you added code that should be tested and isn't, note it in [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md).

## 2. Update ADOS

In this order, only touching what actually changed:

- [PROJECT_STATE.md](PROJECT_STATE.md) — version, phase, current module/task, last build/test result, last commit.
- [PROGRESS.md](PROGRESS.md) — append what was actually shipped this session.
- [ROADMAP.md](ROADMAP.md) — flip status (Planned → In Progress → Complete) for anything that moved.
- [CHANGELOG.md](CHANGELOG.md) — human-readable entry.
- [DECISIONS.md](DECISIONS.md) — new ADR if an architecturally significant choice was made.
- [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) — add anything you knowingly deferred.
- [KNOWN_ISSUES.md](KNOWN_ISSUES.md) — add anything discovered, remove anything fixed.
- [NEXT_TASK.md](NEXT_TASK.md) — point at the next concrete task.
- The relevant `docs/0X_*/INDEX.md` (and per-module doc if one exists) — keep it truthful to what's now in the code.
- If module availability, industries, or providers changed: also update [PROJECT_HEALTH.md](PROJECT_HEALTH.md).

## 3. Commit

Only after 1 and 2 are both done. Use a meaningful commit message describing why, not just what.

## 4. Push

Only if the user has asked for it, or has pre-authorized pushes for this session/workflow.
