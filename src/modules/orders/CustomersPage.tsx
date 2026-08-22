import { useState } from "react";
import { Plus, Users } from "lucide-react";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useCustomers } from "@/modules/orders/hooks";
import { NewCustomerDialog } from "@/modules/orders/components/NewCustomerDialog";

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Everyone who's ordered from you."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New customer
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !customers?.length ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer, or create one directly from a new order."
          action={
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              New customer
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <NewCustomerDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={() => {}} />
    </div>
  );
}
