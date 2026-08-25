---
title: Report Template
---
# REPORT_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_REPORT.md](../16_PLAYBOOKS/CREATE_REPORT.md).

```tsx
// src/modules/reports/components/<Name>Report.tsx
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/shared/components/data/DataTable";

export function <Name>Report() {
  const { data } = useQuery({
    queryKey: ["report", "<name>", orgId],
    queryFn: () => fetch<Name>ReportData(orgId),
  });
  return <DataTable columns={columns} data={data ?? []} />;
}
```

Verify the underlying query is `org_id`-scoped — reports are a common place to accidentally aggregate across tenants.
