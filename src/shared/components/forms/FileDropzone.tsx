import { useCallback, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

export interface DroppedImage {
  id: string;
  url: string;
  file?: File;
}

export function FileDropzone({
  images,
  onChange,
  maxImages = 6,
}: {
  images: DroppedImage[];
  onChange: (images: DroppedImage[]) => void;
  maxImages?: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const next: DroppedImage[] = imageFiles
        .slice(0, Math.max(0, maxImages - images.length))
        .map((file) => ({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
          url: URL.createObjectURL(file),
          file,
        }));
      if (next.length) onChange([...images, ...next]);
    },
    [images, onChange, maxImages],
  );

  function removeImage(id: string) {
    onChange(images.filter((img) => img.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          isDragging ? "border-primary bg-accent" : "border-border hover:bg-muted/40",
          images.length >= maxImages ? "pointer-events-none opacity-50" : "cursor-pointer",
        )}
      >
        <div className="bg-muted flex size-11 items-center justify-center rounded-full">
          <ImagePlus className="text-muted-foreground size-5" />
        </div>
        <p className="text-sm font-medium">Drag and drop images, or click to browse</p>
        <p className="text-muted-foreground text-xs">
          PNG or JPG, up to {maxImages} images · {images.length}/{maxImages} added
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border">
              <img src={image.url} alt="" className="size-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
                aria-label="Remove image"
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
