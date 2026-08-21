import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { steps } from "@/modules/inventory/components/add-product/schema";

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-1 sm:gap-2">
      {steps.map((step, i) => {
        const isComplete = i < current;
        const isActive = i === current;
        return (
          <li key={step.key} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center gap-1.5 sm:flex-1">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "border-primary text-primary border-2"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-center text-[11px] font-medium sm:block",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div className={cn("h-px flex-1", isComplete ? "bg-primary" : "bg-border")} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
