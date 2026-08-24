import { useState } from "react";
import { Plus, UserRound } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { KpiCard } from "@/shared/components/data/KpiCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useShifts, useStaff } from "@/modules/hr-staff/hooks";
import { NewStaffDialog } from "@/modules/hr-staff/components/NewStaffDialog";
import { LogHoursDialog } from "@/modules/hr-staff/components/LogHoursDialog";

export function HrOverview() {
  const { data: staff, isLoading } = useStaff();
  const { data: shifts } = useShifts();
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [logHoursFor, setLogHoursFor] = useState<string | null>(null);

  const upcomingShifts = (shifts ?? []).filter((s) => new Date(s.startsAt) >= new Date());
  const activeStaff = (staff ?? []).filter((s) => s.status === "active");

  return (
    <div>
      <PageHeader
        title="HR & Staff"
        description="Your team directory, shifts, and hours."
        actions={
          <Button size="sm" onClick={() => setStaffDialogOpen(true)}>
            <Plus className="size-4" />
            Add staff
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Active staff" value={String(activeStaff.length)} caption="on the team" />
        <KpiCard label="Upcoming shifts" value={String(upcomingShifts.length)} caption="scheduled" />
        <KpiCard
          label="Avg. hourly rate"
          value={
            activeStaff.length
              ? `$${(activeStaff.reduce((s, m) => s + (m.hourlyRate ?? 0), 0) / activeStaff.length).toFixed(2)}`
              : "—"
          }
          caption="across active staff"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !staff || staff.length === 0 ? (
          <EmptyState
            icon={UserRound}
            title="No staff yet"
            description="Add your first team member to get started."
            action={
              <Button size="sm" onClick={() => setStaffDialogOpen(true)}>
                <Plus className="size-4" />
                Add staff
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="w-32" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{member.roleTitle ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal capitalize">
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {member.hourlyRate ? `$${member.hourlyRate.toFixed(2)}/hr` : "—"}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setLogHoursFor(member.id)}>
                        Log hours
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <NewStaffDialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen} />
      {logHoursFor ? (
        <LogHoursDialog staffId={logHoursFor} open={Boolean(logHoursFor)} onOpenChange={() => setLogHoursFor(null)} />
      ) : null}
    </div>
  );
}
