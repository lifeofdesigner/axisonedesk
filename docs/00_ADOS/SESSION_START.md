---
title: Session Start Procedure
---

# Session Start

Run this procedure at the start of every AxisOneDesk engineering session, before writing or editing any application code.

1. Read [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md).
2. Read [PROJECT_STATE.md](PROJECT_STATE.md).
3. Read [ROADMAP.md](ROADMAP.md).
4. Read [PROGRESS.md](PROGRESS.md).
5. Read [NEXT_TASK.md](NEXT_TASK.md).
6. Read [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
7. Read [DECISIONS.md](DECISIONS.md).
8. For the specific area you're about to touch, open the matching `docs/0X_*/INDEX.md` and diff its claims against the actual code (grep the module, check the migration, open the component). Documentation drift is expected to happen — catching it here is the checkpoint.
9. If you find drift: fix the doc inline as part of your change (preferred), or add a line to [KNOWN_ISSUES.md](KNOWN_ISSUES.md) if you can't resolve it now.
10. Resume the task named in `NEXT_TASK.md`, unless the user has given you a different, more specific instruction — user instructions always take precedence over `NEXT_TASK.md`.
11. If the task is large or architecturally significant (new module, schema change, new external integration), check whether a matching playbook exists in `.ai/` and read it before designing your approach.

Do not begin implementation before step 10/11 completes. If you're only answering a question or doing read-only exploration, steps 1-7 are still worth doing but the "refuse to implement" constraint doesn't apply — there's nothing to implement.
