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
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useUpsertAiPromptTemplate } from "@/core/platform-admin/ai-provider-hooks";
import type { AiPromptTemplate } from "@/core/platform-admin/ai-provider-api";

export function PromptTemplateDialog({
  open,
  onOpenChange,
  template,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: AiPromptTemplate;
}) {
  const upsert = useUpsertAiPromptTemplate();
  const [body, setBody] = useState(template.template);

  async function handleSave() {
    try {
      await upsert.mutateAsync({
        key: template.key,
        label: template.label,
        description: template.description,
        template: body,
      });
      toast.success("Prompt template saved");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save prompt template");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{template.label}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {template.description ? <p className="text-muted-foreground text-sm">{template.description}</p> : null}
          <div className="flex flex-col gap-1.5">
            <Label>System prompt</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="Not yet written — this will be sent to the model once a provider is connected."
              className="font-mono text-xs"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={upsert.isPending}>
            {upsert.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
