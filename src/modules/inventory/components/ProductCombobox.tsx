import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useProducts } from "@/modules/inventory/hooks";
import { ProductThumb } from "@/modules/inventory/components/ProductThumb";

export function ProductCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (productId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: products } = useProducts();
  const selected = products?.find((p) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal sm:w-80"
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <ProductThumb src={selected.images[0]} alt="" className="size-5" />
              {selected.name}
              <span className="text-muted-foreground">({selected.sku})</span>
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-2">
              <Search className="size-4" />
              Select a product…
            </span>
          )}
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search products…" />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {products?.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.sku}`}
                  onSelect={() => {
                    onChange(product.id);
                    setOpen(false);
                  }}
                >
                  <ProductThumb src={product.images[0]} alt="" className="size-6" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{product.name}</p>
                    <p className="text-muted-foreground text-xs">{product.sku}</p>
                  </div>
                  <Check
                    className={cn("size-4", value === product.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
