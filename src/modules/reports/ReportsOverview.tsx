import { Download } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useInventoryValuationReport, useSalesReport, useTopCustomersReport } from "@/modules/reports/hooks";
import { downloadCsv, toCsv } from "@/modules/reports/api";

export function ReportsOverview() {
  const { data: sales, isLoading: salesLoading } = useSalesReport();
  const { data: valuation, isLoading: valuationLoading } = useInventoryValuationReport();
  const { data: topCustomers, isLoading: customersLoading } = useTopCustomersReport();

  const totalRevenue = (sales ?? []).reduce((s, r) => s + r.revenue, 0);
  const totalValuation = (valuation ?? []).reduce((s, r) => s + r.value, 0);

  return (
    <div>
      <PageHeader title="Reports" description="Real numbers, exportable as CSV." />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Sales (last 30 days)</CardTitle>
              <p className="text-muted-foreground mt-1 text-xs">Total revenue: ${totalRevenue.toFixed(2)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={!sales || sales.length === 0}
              onClick={() => downloadCsv("sales-report.csv", toCsv(sales ?? []))}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="px-0 sm:px-2">
            {salesLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : !sales || sales.length === 0 ? (
              <p className="text-muted-foreground px-4 py-6 text-center text-sm">No sales in this period yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((row) => (
                      <TableRow key={row.date}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.orders}</TableCell>
                        <TableCell className="text-right tabular-nums">${row.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Inventory valuation</CardTitle>
              <p className="text-muted-foreground mt-1 text-xs">Total value: ${totalValuation.toFixed(2)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={!valuation || valuation.length === 0}
              onClick={() => downloadCsv("inventory-valuation.csv", toCsv(valuation ?? []))}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="px-0 sm:px-2">
            {valuationLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : !valuation || valuation.length === 0 ? (
              <p className="text-muted-foreground px-4 py-6 text-center text-sm">No products yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {valuation.slice(0, 10).map((row) => (
                      <TableRow key={row.sku}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.quantity}</TableCell>
                        <TableCell className="text-right tabular-nums">${row.costPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">${row.value.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">Top customers</CardTitle>
            <Button
              size="sm"
              variant="outline"
              disabled={!topCustomers || topCustomers.length === 0}
              onClick={() => downloadCsv("top-customers.csv", toCsv(topCustomers ?? []))}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="px-0 sm:px-2">
            {customersLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : !topCustomers || topCustomers.length === 0 ? (
              <p className="text-muted-foreground px-4 py-6 text-center text-sm">
                No customer orders yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Total spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers.slice(0, 10).map((row) => (
                      <TableRow key={row.customerName}>
                        <TableCell className="font-medium">{row.customerName}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.orderCount}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          ${row.totalSpent.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
