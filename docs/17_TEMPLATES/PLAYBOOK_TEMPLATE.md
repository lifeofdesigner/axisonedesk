---
title: Playbook Template
---
# PLAYBOOK_TEMPLATE

Copy this skeleton for any new file in [docs/16_PLAYBOOKS](../16_PLAYBOOKS/INDEX.md).

```markdown
---
title: <Playbook Title>
---
# <PLAYBOOK_NAME>

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) if applicable.

## Purpose
<one or two sentences>

## Prerequisites
<what must already be true/exist>

## Required Documentation
<links to the ADOS docs this playbook depends on>

## Audit Steps
<how to confirm current state before implementing>

## Implementation Workflow
<numbered steps, delta from the generic workflow only>

## Validation
<how to confirm it works>

## Testing
<what test coverage applies, or the honest gap>

## Documentation Updates
<which ADOS files must be updated>

## Definition of Done
<link to docs/00_ADOS/DEFINITION_OF_DONE.md plus anything specific>

## Commit Requirements
<any commit-message or splitting conventions specific to this artifact type>
```
