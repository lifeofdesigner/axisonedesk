import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCreateWebhook } from "@/core/platform-admin/developer-tools-hooks";

const EVENT_TYPES = ["tenant.created", "tenant.suspended", "subscription.updated", "support_ticket.created"];

export function NewWebhookDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createWebhook = useCreateWebhook();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  function toggleEvent(event: string) {
    setSelectedEvents((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));
  }

  async function handleSave() {
    if (!label.trim() || !url.trim()) {
      toast.error("Fill in a label and URL");
      return;
    }
    try {
      await createWebhook.mutateAsync({ label, url, eventTypes: selectedEvents });
      toast.success("Webhook created");
      setLabel("");
      setUrl("");
      setSelectedEvents([]);
      onOpenChange(false);
    } catch {
      toast.error("Couldn't create webhook");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New webhook</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Slack alerts" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Target URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.slack.com/..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Events</Label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((event) => (
                <button
                  key={event}
                  type="button"
                  onClick={() => toggleEvent(event)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedEvents.includes(event)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createWebhook.isPending}>
            {createWebhook.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
