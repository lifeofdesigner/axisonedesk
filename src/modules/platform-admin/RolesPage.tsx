import { useState } from "react";
import { toast } from "sonner";
import { Plus, ShieldQuestion } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePlatformOrganizations } from "@/core/platform-admin/hooks";
import { useOrgRoles, usePlatformPermissions, useUpdateRolePermissions } from "@/core/platform-admin/users-hooks";
import { NewRoleDialog } from "@/modules/platform-admin/components/NewRoleDialog";

export function RolesPage() {
  const { data: orgs } = usePlatformOrganizations();
  const { data: permissions } = usePlatformPermissions();
  const [orgId, setOrgId] = useState("");
  const { data: roles, isLoading: rolesLoading } = useOrgRoles(orgId);
  const updatePermissions = useUpdateRolePermissions();
  const [dialogOpen, setDialogOpen] = useState(false);

  const grouped = new Map<string, typeof permissions>();
  for (const perm of permissions ?? []) {
    const list = grouped.get(perm.moduleKey) ?? [];
    list.push(perm);
    grouped.set(perm.moduleKey, list);
  }

  async function togglePermission(roleId: string, currentIds: string[], permId: string) {
    const next = currentIds.includes(permId) ? currentIds.filter((id) => id !== permId) : [...currentIds, permId];
    try {
      await updatePermissions.mutateAsync({ roleId, permissionIds: next, orgId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update role");
    }
  }

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        description="Dynamic RBAC — create custom roles and grant exactly the permissions each one needs."
        actions={
          orgId ? (
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              New role
            </Button>
          ) : undefined
        }
      />

      <Select value={orgId} onValueChange={setOrgId}>
        <SelectTrigger className="mb-6 w-full max-w-xs">
          <SelectValue placeholder="Select a company" />
        </SelectTrigger>
        <SelectContent>
          {orgs?.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!orgId ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center text-sm">
          <ShieldQuestion className="size-6" />
          Select a company to view and edit its roles.
        </div>
      ) : rolesLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {roles?.map((role) => (
            <Card key={role.id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm">{role.name}</CardTitle>
                {role.isSystemRole ? (
                  <Badge variant="outline" className="font-normal">
                    System role
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-normal">
                    Custom
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {role.isSystemRole ? (
                  <p className="text-muted-foreground text-xs">
                    System roles have every permission and can't be edited.
                  </p>
                ) : (
                  Array.from(grouped.entries()).map(([moduleKey, perms]) => (
                    <div key={moduleKey}>
                      <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">{moduleKey}</p>
                      <div className="flex flex-col gap-1">
                        {perms?.map((perm) => (
                          <label key={perm.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={role.permissionIds.includes(perm.id)}
                              onCheckedChange={() => togglePermission(role.id, role.permissionIds, perm.id)}
                            />
                            <span>{perm.description ?? perm.key}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {orgId ? <NewRoleDialog orgId={orgId} open={dialogOpen} onOpenChange={setDialogOpen} /> : null}
    </div>
  );
}
