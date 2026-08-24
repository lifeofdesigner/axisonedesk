import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePlatformOrganizations, useSetOrganizationStatus } from "@/core/platform-admin/hooks";
import type { OrganizationStatus } from "@/core/platform-admin/api";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<OrganizationStatus, string> = {
  active: "bg-success/10 text-success border-success/20",
  trialing: "bg-info/10 text-info border-info/20",
  past_due: "bg-warning/10 text-warning border-warning/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  canceled: "bg-muted text-muted-foreground border-border",
  archived: "bg-muted text-muted-foreground border-border",
};

export function TenantsListPage() {
  const { data: orgs, isLoading } = usePlatformOrganizations();
  const setStatus = useSetOrganizationStatus();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = (orgs ?? []).filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  async function handleStatusChange(orgId: string, status: OrganizationStatus) {
    try {
      await setStatus.mutateAsync({ orgId, status });
      toast.success("Tenant status updated");
    } catch {
      toast.error("Couldn't update tenant status");
    }
  }

  return (
    <div>
      <PageHeader title="Tenants" description="Every company on the platform." />

      <Input
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-xs"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No tenants found" description="No companies match your search." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-44">Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="text-muted-foreground">{org.planName ?? "—"}</TableCell>
                  <TableCell className="tabular-nums">{org.memberCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select value={org.status} onValueChange={(v) => handleStatusChange(org.id, v as OrganizationStatus)}>
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue>
                          <Badge variant="outline" className={cn("font-normal capitalize", statusStyles[org.status])}>
                            {org.status.replace("_", " ")}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="trialing">Trialing</SelectItem>
                        <SelectItem value="past_due">Past due</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/platform-admin/tenants/${org.id}`)}>
                      View
                    </Button>
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
