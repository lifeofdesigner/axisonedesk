import { ScrollText } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { usePlatformAuditLogs } from "@/core/platform-admin/hooks";

export function AuditLogPage() {
  const { data: logs, isLoading } = usePlatformAuditLogs();

  return (
    <div>
      <PageHeader title="Audit log" description="Every platform-level action, who did it, and when." />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !logs || logs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No audit events yet"
          description="Platform actions like status changes will appear here."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.orgName ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{log.actorName ?? "System"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
