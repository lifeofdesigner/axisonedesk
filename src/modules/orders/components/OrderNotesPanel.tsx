import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAddOrderNote, useOrderNotes } from "@/modules/orders/hooks";

export function OrderNotesPanel({ orderId }: { orderId: string }) {
  const { data: notes, isLoading } = useOrderNotes(orderId);
  const addNote = useAddOrderNote();
  const [body, setBody] = useState("");

  async function handleSubmit() {
    if (!body.trim()) return;
    try {
      await addNote.mutateAsync({ orderId, body: body.trim() });
      setBody("");
      toast.success("Note added");
    } catch {
      toast.error("Couldn't add note", { description: "Please try again." });
    }
  }

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a note about this order…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={addNote.isPending || !body.trim()} className="self-end">
          {addNote.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !notes?.length ? (
        <EmptyState icon={MessageSquare} title="No notes yet" description="Notes about this order will appear here." />
      ) : (
        <div className="flex flex-col divide-y">
          {notes.map((note) => (
            <div key={note.id} className="py-3">
              <p className="text-sm">{note.body}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {note.authorName} ·{" "}
                {new Date(note.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
