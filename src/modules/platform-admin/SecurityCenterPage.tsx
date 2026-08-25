import { Link } from "react-router-dom";
import { ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useRlsCoverage, useSecurityEvents } from "@/core/platform-admin/security-hooks";
import { usePlatformUsers } from "@/core/platform-admin/users-hooks";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return seconds <= 1 ? "just now" : `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const ACTION_LABELS: Record<string, string> = {
  "platform.admin_granted": "Platform admin granted",
  "platform.admin_revoked": "Platform admin revoked",
  "platform.role_created": "Custom role created",
  "platform.role_permissions_updated": "Role permissions updated",
  "platform.member_status_changed": "Member status changed",
};

export function SecurityCenterPage() {
  const { data: coverage, isLoading: coverageLoading } = useRlsCoverage();
  const { data: events, isLoading: eventsLoading } = useSecurityEvents();
  const { data: users, isLoading: usersLoading } = usePlatformUsers();

  const admins = users?.filter((u) => u.isPlatformAdmin) ?? [];
  const uncoveredTables = coverage?.filter((t) => !t.rlsEnabled || t.policyCount === 0) ?? [];

  return (
    <div>
      <PageHeader
        title="Security Center"
        description="Live RLS coverage, platform admin roster, and a security-focused slice of the audit log."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Row-level security coverage</CardTitle>
        </CardHeader>
        <CardContent>
          {coverageLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg border p-3 ${
                  uncoveredTables.length > 0 ? "border-destructive/40 bg-destructive/5" : ""
                }`}
              >
                {uncoveredTables.length > 0 ? (
                  <ShieldAlert className="text-destructive size-4 shrink-0" />
                ) : (
                  <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
                )}
                <p className="text-sm font-medium">
                  {uncoveredTables.length > 0
                    ? `${uncoveredTables.length} table${uncoveredTables.length === 1 ? "" : "s"} without RLS policies`
                    : `All ${coverage?.length ?? 0} tables have RLS enabled with at least one policy`}
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>RLS enabled</TableHead>
                      <TableHead>Policies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverage?.map((t) => (
                      <TableRow key={t.tableName}>
                        <TableCell className="font-mono text-xs">{t.tableName}</TableCell>
                        <TableCell>
                          <Badge variant={t.rlsEnabled ? "outline" : "destructive"} className="font-normal">
                            {t.rlsEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums">{t.policyCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Platform admins</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {usersLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : admins.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">No platform admins.</p>
          ) : (
            admins.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{u.fullName ?? u.email}</p>
                  <p className="text-muted-foreground text-xs">{u.email}</p>
                </div>
                <Badge variant="outline" className="font-normal">
                  Platform admin
                </Badge>
              </div>
            ))
          )}
          <Link to="/platform-admin/users" className="text-primary mt-1 inline-flex items-center gap-1 text-xs hover:underline">
            Manage grants in Users <ExternalLink className="size-3" />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Security events</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {eventsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : !events || events.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No admin-grant, role, or permission changes recorded yet.
            </p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{ACTION_LABELS[e.action] ?? e.action}</p>
                  <p className="text-muted-foreground text-xs">{e.actorEmail ?? "System"}</p>
                </div>
                <span className="text-muted-foreground text-xs">{timeAgo(e.createdAt)}</span>
              </div>
            ))
          )}
          <Link to="/platform-admin/audit-log" className="text-primary mt-1 inline-flex items-center gap-1 text-xs hover:underline">
            View full audit log <ExternalLink className="size-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
