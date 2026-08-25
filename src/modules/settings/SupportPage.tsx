import { useState } from "react";
import { toast } from "sonner";
import { Loader2, LifeBuoy, Plus } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Textarea } from "@/shared/components/ui/textarea";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { useOrgTickets } from "@/core/support/hooks";
import { useAddTicketMessage, useTicketMessages } from "@/core/support/hooks";
import { NewTicketDialog } from "@/modules/settings/components/NewTicketDialog";

function TicketThread({ ticketId }: { ticketId: string }) {
  const { data: messages, isLoading } = useTicketMessages(ticketId);
  const addMessage = useAddTicketMessage();
  const [reply, setReply] = useState("");

  async function handleSend() {
    if (!reply.trim()) return;
    try {
      await addMessage.mutateAsync({ ticketId, body: reply.trim(), isInternal: false });
      setReply("");
    } catch {
      toast.error("Couldn't send message");
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      {isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        messages?.map((msg) => (
          <div key={msg.id} className="rounded-lg border p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">{msg.authorName}</span>
              <span className="text-muted-foreground text-xs">{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm">{msg.body}</p>
          </div>
        ))
      )}
      <div className="flex gap-2">
        <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2} placeholder="Add a reply..." />
        <Button size="sm" onClick={handleSend} disabled={addMessage.isPending || !reply.trim()}>
          {addMessage.isPending ? <Loader2 className="size-4 animate-spin" /> : "Send"}
        </Button>
      </div>
    </div>
  );
}

export function SupportPage() {
  const { data: tickets, isLoading } = useOrgTickets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Support"
        description="Reach the AxisOneDesk team and track your open conversations."
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New ticket
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : !tickets || tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No support tickets yet"
          description="Submit a ticket and the AxisOneDesk team will respond here."
          action={
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              New ticket
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader
                className="cursor-pointer flex-row items-center justify-between"
                onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
              >
                <CardTitle className="text-sm">{ticket.subject}</CardTitle>
                <Badge variant="outline" className="font-normal capitalize">
                  {ticket.status.replace("_", " ")}
                </Badge>
              </CardHeader>
              {expandedId === ticket.id ? (
                <CardContent>
                  <TicketThread ticketId={ticket.id} />
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <NewTicketDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
