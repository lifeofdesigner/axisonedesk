import { Sparkles, Lock } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

const plannedCapabilities = [
  "Natural-language reporting queries (\"what were my top sellers last week?\")",
  "Inventory reorder suggestions",
  "Customer/CRM note summarization",
  "Demand forecasting for retail and restaurant verticals",
];

export function AiAssistantOverview() {
  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Server-mediated AI capabilities, additive to the core product."
      />

      <div className="bg-muted/50 mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm">
        <Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-muted-foreground">
          Not connected in this environment — there's no LLM provider API key configured, and per
          ARCHITECTURE.md §15 that key must live only in a server-mediated Edge Function, never
          shipped to the client. This is the real, intended shell UI, not a working assistant. The
          input below is disabled rather than faking a response.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Ask AxisOneDesk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="What were my top sellers last week?" disabled />
            <Button disabled>
              <Sparkles className="size-4" />
              Ask
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Planned capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
            {plannedCapabilities.map((cap) => (
              <li key={cap} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0" />
                {cap}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
