import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useMembers, useRoles, useUpdateMemberRole } from "@/modules/settings/hooks";

export function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const { data: roles } = useRoles();
  const updateRole = useUpdateMemberRole();
  const [inviteOpen, setInviteOpen] = useState(false);

  async function handleRoleChange(memberId: string, roleId: string) {
    try {
      await updateRole.mutateAsync({ memberId, roleId });
      toast.success("Role updated");
    } catch {
      toast.error("Couldn't update role");
    }
  }

  return (
    <div>
      <PageHeader
        title="Members & roles"
        description="Who has access to this organization, and what they can do."
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Invite member
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-48">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.fullName ?? "Unnamed member"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal capitalize">
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.roleId}
                      onValueChange={(v) => handleRoleChange(member.id, v)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              Email invites need a signed server-side function (to create the auth user and send
              the email) plus a transactional email provider — neither is configured in this
              environment yet. ARCHITECTURE.md §6/§13 documents this as a deferred decision, not
              an oversight. Role management above for existing members is fully functional.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
