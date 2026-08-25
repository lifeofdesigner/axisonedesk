---
title: Performance Checklist
---
# PERFORMANCE_CHECKLIST

See [16_PLAYBOOKS/PERFORMANCE_PLAYBOOK.md](../16_PLAYBOOKS/PERFORMANCE_PLAYBOOK.md).

- [ ] Measured before optimizing (not guessed)
- [ ] New tenant table's `org_id` (and other filter columns) indexed
- [ ] Large lists use virtualization or pagination, not unbounded rendering
- [ ] No N+1 query pattern introduced
- [ ] Re-measured after the change to confirm improvement
