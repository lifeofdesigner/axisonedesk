import { AlertTriangle, Info, OctagonAlert, Wrench } from "lucide-react";
import { useActiveAnnouncements, useMaintenanceStatus } from "@/core/notifications/hooks";
import { cn } from "@/shared/lib/utils";

const severityStyles: Record<string, string> = {
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const severityIcons: Record<string, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: OctagonAlert,
};

export function AnnouncementBanner() {
  const { data: announcements } = useActiveAnnouncements();
  const { data: maintenance } = useMaintenanceStatus();

  if (!announcements?.length && !maintenance?.enabled) return null;

  return (
    <div className="flex flex-col gap-2 px-4 pt-4 sm:px-6 lg:px-8">
      {maintenance?.enabled ? (
        <div className="border-warning/20 bg-warning/10 text-warning flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm">
          <Wrench className="size-4 shrink-0" />
          {maintenance.message ?? "Scheduled maintenance is in progress — some features may be temporarily unavailable."}
        </div>
      ) : null}
      {announcements?.map((a) => {
        const Icon = severityIcons[a.severity] ?? Info;
        return (
          <div
            key={a.id}
            className={cn("flex items-start gap-2 rounded-lg border px-4 py-2.5 text-sm", severityStyles[a.severity])}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <div>
              <span className="font-medium">{a.title}</span>
              <span className="ml-1.5 opacity-90">{a.body}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
