import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { MessageSquare } from "lucide-react";
import { useAddCustomerNote, useCustomerNotes } from "@/modules/crm/hooks";

export function CustomerNotesPanel({ customerId }: { customerId: string }) {
  const { data: notes, isLoading } = useCustomerNotes(customerId);
  const addNote = useAddCustomerNote();
  const [body, setBody] = useState("");

  async function handleAdd() {
    if (!body.trim()) return;
    try {
      await addNote.mutateAsync({ customerId, body: body.trim() });
      setBody("");
    } catch {
      toast.error("Couldn't add note");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a note about this customer..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
        />
        <Button onClick={handleAdd} disabled={addNote.isPending || !body.trim()}>
          {addNote.isPending ? <Loader2 className="size-4 animate-spin" /> : "Add"}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : !notes || notes.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No notes yet" description="Notes you add will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border p-3">
              <p className="text-sm">{note.body}</p>
              <p className="text-muted-foreground mt-1.5 text-xs">
                {note.authorName} · {new Date(note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
