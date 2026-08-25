import { toast } from "sonner";
import { Info, Users } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useGrantAdmin, usePlatformUsers, useRevokeAdmin, useSetMemberStatus } from "@/core/platform-admin/users-hooks";
import type { Database } from "@/core/supabase/database.types";

type MemberStatus = Database["public"]["Enums"]["member_status"];

export function UsersPage() {
  const { data: users, isLoading } = usePlatformUsers();
  const grantAdmin = useGrantAdmin();
  const revokeAdmin = useRevokeAdmin();
  const setMemberStatus = useSetMemberStatus();

  async function handleToggleAdmin(userId: string, isAdmin: boolean) {
    try {
      if (isAdmin) {
        await revokeAdmin.mutateAsync(userId);
      } else {
        await grantAdmin.mutateAsync(userId);
      }
      toast.success(isAdmin ? "Platform-admin access revoked" : "Platform-admin access granted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update access");
    }
  }

  async function handleMemberStatusChange(orgId: string, memberId: string, status: MemberStatus) {
    try {
      await setMemberStatus.mutateAsync({ orgId, memberId, status });
      toast.success("Membership status updated");
    } catch {
      toast.error("Couldn't update membership status");
    }
  }

  return (
    <div>
      <PageHeader title="Users" description="Every user across every tenant on the platform." />

      <div className="bg-muted/50 mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm">
        <Info className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-muted-foreground">
          Creating users, resetting passwords, and force logout require Supabase's Admin API
          (service_role) — never exposed to the browser per this project's own security model. Use{" "}
          <code className="bg-background rounded px-1 py-0.5">pnpm admin-tool</code> for those. Platform-admin
          access and org membership status below are managed live from here.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="Users created via the admin tool will show up here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Memberships</TableHead>
                <TableHead className="w-40">Platform admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.fullName ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      {user.memberships.length === 0 ? (
                        <span className="text-muted-foreground text-xs">No memberships</span>
                      ) : (
                        user.memberships.map((m) => (
                          <div key={m.membershipId} className="flex items-center gap-2 text-xs">
                            <span className="font-medium">{m.orgName}</span>
                            <span className="text-muted-foreground">({m.role})</span>
                            <Select
                              value={m.status}
                              onValueChange={(v) =>
                                handleMemberStatusChange(m.orgId, m.membershipId, v as MemberStatus)
                              }
                            >
                              <SelectTrigger className="h-6 w-24 text-[11px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="invited">Invited</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.isPlatformAdmin ? (
                        <Badge className="bg-success/10 text-success border-success/20 font-normal">Admin</Badge>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleAdmin(user.id, user.isPlatformAdmin)}
                        disabled={grantAdmin.isPending || revokeAdmin.isPending}
                      >
                        {user.isPlatformAdmin ? "Revoke" : "Grant"}
                      </Button>
                    </div>
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
