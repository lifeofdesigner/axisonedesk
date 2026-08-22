import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ProductThumb } from "@/modules/inventory/components/ProductThumb";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted flex aspect-square items-center justify-center overflow-hidden rounded-xl border">
        <ProductThumb src={images[active] ?? images[0]} alt={name} className="size-full" />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent",
              )}
            >
              <ProductThumb src={src} alt={`${name} ${i + 1}`} className="size-full" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
