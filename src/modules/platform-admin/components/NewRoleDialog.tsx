import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useCreateRole, usePlatformPermissions } from "@/core/platform-admin/users-hooks";

export function NewRoleDialog({
  orgId,
  open,
  onOpenChange,
}: {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: permissions } = usePlatformPermissions();
  const createRole = useCreateRole();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const grouped = new Map<string, typeof permissions>();
  for (const perm of permissions ?? []) {
    const list = grouped.get(perm.moduleKey) ?? [];
    list.push(perm);
    grouped.set(perm.moduleKey, list);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Enter a role name");
      return;
    }
    try {
      await createRole.mutateAsync({ orgId, name: name.trim(), permissionIds: Array.from(selected) });
      toast.success("Role created");
      setName("");
      setSelected(new Set());
      onOpenChange(false);
    } catch {
      toast.error("Couldn't create role");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New custom role</DialogTitle>
          <DialogDescription>Grant exactly the permissions this role needs.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Role name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shift Supervisor" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from(grouped.entries()).map(([moduleKey, perms]) => (
              <div key={moduleKey}>
                <p className="text-muted-foreground mb-1.5 text-xs font-medium uppercase tracking-wide">{moduleKey}</p>
                <div className="flex flex-col gap-1.5">
                  {perms?.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={selected.has(perm.id)} onCheckedChange={() => toggle(perm.id)} />
                      <span>{perm.description ?? perm.key}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createRole.isPending}>
            {createRole.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Create role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
