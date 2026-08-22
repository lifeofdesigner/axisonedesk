import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Product thumbnail with a graceful fallback. Product images are currently
 * stored as-is (including ephemeral blob: URLs from the Add Product upload
 * step — see ARCHITECTURE.md §14, Supabase Storage isn't wired yet), so a
 * broken URL is an expected case, not just a network hiccup.
 */
export function ProductThumb({
  src,
  alt,
  className,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-lg",
          className,
        )}
      >
        <Package className="size-1/2" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-lg object-cover", className)}
    />
  );
}
