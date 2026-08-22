import { useState } from "react";
import { Check, ChevronsUpDown, Plus, User } from "lucide-react";
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
import { useCustomers } from "@/modules/orders/hooks";
import { NewCustomerDialog } from "@/modules/orders/components/NewCustomerDialog";

export function CustomerCombobox({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (customerId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const { data: customers } = useCustomers();
  const selected = customers?.find((c) => c.id === value);

  return (
    <>
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
                <User className="text-muted-foreground size-4" />
                {selected.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Walk-in customer</span>
            )}
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search customers…" />
            <CommandList>
              <CommandEmpty>No customers found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  <User className="text-muted-foreground size-4" />
                  <span className="flex-1">Walk-in customer</span>
                  <Check className={cn("size-4", value === null ? "opacity-100" : "opacity-0")} />
                </CommandItem>
                {customers?.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.name} ${customer.email}`}
                    onSelect={() => {
                      onChange(customer.id);
                      setOpen(false);
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{customer.name}</p>
                      {customer.email ? (
                        <p className="text-muted-foreground text-xs">{customer.email}</p>
                      ) : null}
                    </div>
                    <Check
                      className={cn("size-4", value === customer.id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t p-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  setNewCustomerOpen(true);
                }}
              >
                <Plus className="size-4" />
                New customer
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <NewCustomerDialog
        open={newCustomerOpen}
        onOpenChange={setNewCustomerOpen}
        onCreated={(customer) => onChange(customer.id)}
      />
    </>
  );
}
