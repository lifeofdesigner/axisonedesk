import { useNavigate } from "react-router-dom";
import { LifeBuoy } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { usePlatformTickets } from "@/core/platform-admin/support-hooks";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<string, string> = {
  open: "bg-info/10 text-info border-info/20",
  in_progress: "bg-warning/10 text-warning border-warning/20",
  resolved: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-border",
};

const priorityStyles: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-muted text-muted-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

export function TicketsPage() {
  const { data: tickets, isLoading } = usePlatformTickets();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Support tickets" description="Every conversation across every tenant." />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No tickets yet" description="Tickets submitted by tenants will show up here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer" onClick={() => navigate(`/platform-admin/tickets/${ticket.id}`)}>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.orgName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal capitalize", statusStyles[ticket.status])}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal capitalize", priorityStyles[ticket.priority])}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{ticket.messageCount}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
