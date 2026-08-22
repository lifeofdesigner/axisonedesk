import { useState } from "react";
import { Check, ChevronsUpDown, Package, Search } from "lucide-react";
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
import { useSellableProducts } from "@/modules/orders/hooks";

export function ProductPickerCombobox({
  excludeIds,
  onSelect,
}: {
  excludeIds: string[];
  onSelect: (productId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: products } = useSellableProducts();
  const available = products?.filter((p) => !excludeIds.includes(p.id)) ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
          <span className="text-muted-foreground flex items-center gap-2">
            <Search className="size-4" />
            Add a product…
          </span>
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search products…" />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {available.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.sku}`}
                  disabled={product.quantityAvailable <= 0}
                  onSelect={() => {
                    onSelect(product.id);
                    setOpen(false);
                  }}
                >
                  <Package className="text-muted-foreground size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{product.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {product.sku} · ${product.sellingPrice.toFixed(2)} ·{" "}
                      {product.quantityAvailable <= 0
                        ? "Out of stock"
                        : `${product.quantityAvailable} available`}
                    </p>
                  </div>
                  <Check className={cn("size-4", "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
