import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Building2, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useArchiveOrganization, usePlatformOrganization, useRestoreOrganization } from "@/core/platform-admin/hooks";

export function TenantDetailPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = usePlatformOrganization(orgId ?? "");
  const archiveOrg = useArchiveOrganization();
  const restoreOrg = useRestoreOrganization();

  async function handleArchive() {
    if (!orgId) return;
    try {
      await archiveOrg.mutateAsync(orgId);
      toast.success("Tenant archived");
    } catch {
      toast.error("Couldn't archive tenant");
    }
  }

  async function handleRestore() {
    if (!orgId) return;
    try {
      await restoreOrg.mutateAsync(orgId);
      toast.success("Tenant restored");
    } catch {
      toast.error("Couldn't restore tenant");
    }
  }

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data) {
    return (
      <EmptyState
        icon={Building2}
        title="Tenant not found"
        description="This company may have been removed."
        action={
          <Button size="sm" onClick={() => navigate("/platform-admin/tenants")}>
            Back to tenants
          </Button>
        }
      />
    );
  }

  const isArchived = data.organization.status === "archived" || Boolean(data.organization.deletedAt);

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate("/platform-admin/tenants")}>
        <ArrowLeft className="size-4" />
        Back to tenants
      </Button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.organization.name}</h1>
            <Badge variant="outline" className="font-normal capitalize">
              {data.organization.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {data.planName ?? "No plan"} · {data.organization.businessType} · created{" "}
            {new Date(data.organization.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isArchived ? (
          <Button variant="outline" onClick={handleRestore} disabled={restoreOrg.isPending}>
            <RotateCcw className="size-4" />
            Restore
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="size-4" />
                Archive tenant
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive this tenant?</AlertDialogTitle>
                <AlertDialogDescription>
                  This soft-deletes {data.organization.name} — its data is preserved and can be restored, but
                  members will lose access immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Members ({data.members.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-2">
          {data.members.length === 0 ? (
            <p className="text-muted-foreground px-4 py-6 text-center text-sm">No members yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.fullName ?? "Unnamed member"}</TableCell>
                      <TableCell className="text-muted-foreground">{m.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal capitalize">
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
