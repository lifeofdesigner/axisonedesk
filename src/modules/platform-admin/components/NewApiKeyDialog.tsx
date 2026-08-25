import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCreateApiKey } from "@/core/platform-admin/developer-tools-hooks";

export function NewApiKeyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createKey = useCreateApiKey();
  const [label, setLabel] = useState("");
  const [rawKey, setRawKey] = useState<string | null>(null);

  async function handleCreate() {
    if (!label.trim()) {
      toast.error("Give the key a label");
      return;
    }
    try {
      const result = await createKey.mutateAsync(label);
      setRawKey(result.rawKey);
    } catch {
      toast.error("Couldn't create API key");
    }
  }

  function handleClose(next: boolean) {
    if (!next) {
      setLabel("");
      setRawKey(null);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rawKey ? "Key created" : "New API key"}</DialogTitle>
          {!rawKey ? (
            <DialogDescription>
              Not yet enforced by an API gateway — this issues and stores a real, hashed, revocable key for future
              use, but no request-handling layer currently validates it.
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {rawKey ? (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm">
              Copy this now — it won't be shown again. Only its hash is stored.
            </p>
            <div className="flex gap-2">
              <Input readOnly value={rawKey} className="font-mono text-xs" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(rawKey);
                  toast.success("Copied");
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. internal reporting script" />
          </div>
        )}
        <DialogFooter>
          {rawKey ? (
            <Button onClick={() => handleClose(false)}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createKey.isPending}>
                {createKey.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Create key
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
