import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, LifeBuoy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePlatformTickets, useUpdateTicket } from "@/core/platform-admin/support-hooks";
import { useAddTicketMessage, useTicketMessages } from "@/core/support/hooks";
import { cn } from "@/shared/lib/utils";

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { data: tickets, isLoading: ticketsLoading } = usePlatformTickets();
  const { data: messages, isLoading: messagesLoading } = useTicketMessages(ticketId ?? "");
  const updateTicket = useUpdateTicket();
  const addMessage = useAddTicketMessage();

  const ticket = tickets?.find((t) => t.id === ticketId);
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  async function handleReply() {
    if (!ticketId || !reply.trim()) return;
    try {
      await addMessage.mutateAsync({ ticketId, body: reply.trim(), isInternal });
      setReply("");
      toast.success(isInternal ? "Internal note added" : "Reply sent");
    } catch {
      toast.error("Couldn't send message");
    }
  }

  async function handleFieldChange(field: "status" | "priority", value: string) {
    if (!ticket) return;
    try {
      await updateTicket.mutateAsync({
        ticketId: ticket.id,
        status: field === "status" ? value : ticket.status,
        priority: field === "priority" ? value : ticket.priority,
        assignedTo: null,
      });
      toast.success("Ticket updated");
    } catch {
      toast.error("Couldn't update ticket");
    }
  }

  if (ticketsLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!ticket) {
    return (
      <EmptyState
        icon={LifeBuoy}
        title="Ticket not found"
        description="This ticket may have been removed."
        action={
          <Button size="sm" onClick={() => navigate("/platform-admin/tickets")}>
            Back to tickets
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate("/platform-admin/tickets")}>
        <ArrowLeft className="size-4" />
        Back to tickets
      </Button>

      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{ticket.subject}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {ticket.orgName} · opened by {ticket.createdByName ?? "Unknown"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {messagesLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-lg border p-3",
                      msg.isInternal && "border-warning/30 bg-warning/5",
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.authorName}</span>
                      {msg.isInternal ? (
                        <Badge variant="outline" className="border-warning/30 text-warning font-normal">
                          Internal note
                        </Badge>
                      ) : null}
                      <span className="text-muted-foreground ml-auto text-xs">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.body}</p>
                  </div>
                ))
              )}

              <div className="flex flex-col gap-2 border-t pt-4">
                <Textarea
                  placeholder="Write a reply or internal note..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={isInternal} onCheckedChange={(v) => setIsInternal(Boolean(v))} />
                    Internal note (not visible to the customer)
                  </label>
                  <Button size="sm" onClick={handleReply} disabled={addMessage.isPending || !reply.trim()}>
                    {addMessage.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs">Status</span>
                <Select value={ticket.status} onValueChange={(v) => handleFieldChange("status", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs">Priority</span>
                <Select value={ticket.priority} onValueChange={(v) => handleFieldChange("priority", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Category</span>
                <span className="text-sm capitalize">{ticket.category.replace("_", " ")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
