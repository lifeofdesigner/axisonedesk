import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  useAdminAnnouncements,
  useDeleteAnnouncement,
  useNotificationChannels,
  useSetMaintenanceMode,
} from "@/core/platform-admin/notifications-hooks";
import { useMaintenanceStatus } from "@/core/notifications/hooks";
import { AnnouncementDialog } from "@/modules/platform-admin/components/AnnouncementDialog";
import type { Announcement } from "@/core/platform-admin/notifications-api";

export function NotificationsAdminPage() {
  const { data: announcements, isLoading } = useAdminAnnouncements();
  const deleteAnnouncement = useDeleteAnnouncement();
  const { data: channels } = useNotificationChannels();
  const { data: maintenance } = useMaintenanceStatus();
  const setMaintenanceMode = useSetMaintenanceMode();

  const [dialog, setDialog] = useState<{ open: boolean; announcement: Announcement | null }>({ open: false, announcement: null });
  const [maintenanceMessage, setMaintenanceMessage] = useState(maintenance?.message ?? "");

  async function handleDelete(id: string) {
    try {
      await deleteAnnouncement.mutateAsync(id);
      toast.success("Announcement removed");
    } catch {
      toast.error("Couldn't remove announcement");
    }
  }

  async function handleToggleMaintenance(enabled: boolean) {
    try {
      await setMaintenanceMode.mutateAsync({ enabled, message: maintenanceMessage || null });
      toast.success(enabled ? "Maintenance mode enabled" : "Maintenance mode disabled");
    } catch {
      toast.error("Couldn't update maintenance mode");
    }
  }

  return (
    <div>
      <PageHeader title="Notifications" description="Announcements, maintenance mode, and notification channel status." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Maintenance mode</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Show maintenance banner to every tenant</p>
              <p className="text-muted-foreground text-xs">Does not block access — a visible warning banner only.</p>
            </div>
            <Switch checked={maintenance?.enabled ?? false} onCheckedChange={handleToggleMaintenance} />
          </div>
          <Input
            placeholder="Maintenance message shown to tenants..."
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Announcements</CardTitle>
          <Button size="sm" onClick={() => setDialog({ open: true, announcement: null })}>
            <Plus className="size-4" />
            New announcement
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : !announcements || announcements.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">No announcements yet.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.title}</span>
                    <Badge variant="outline" className="font-normal capitalize">
                      {a.severity}
                    </Badge>
                    {!a.isActive ? (
                      <Badge variant="outline" className="font-normal">
                        Inactive
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{a.body}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setDialog({ open: true, announcement: a })}>
                    Edit
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notification channels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {channels?.map((c) => (
            <div key={c.key} className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">{c.label}</span>
              <Badge variant="outline" className="font-normal">
                {c.isConnected ? "Connected" : "Ready for connection"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {dialog.open ? (
        <AnnouncementDialog
          open={dialog.open}
          onOpenChange={(open) => setDialog({ open, announcement: open ? dialog.announcement : null })}
          announcement={dialog.announcement}
        />
      ) : null}
    </div>
  );
}
