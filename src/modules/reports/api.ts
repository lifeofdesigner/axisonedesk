/**
 * Reports: cross-module aggregation over `orders`, `order_items`, `products`,
 * `customers` — all shared tables read directly (see ARCHITECTURE.md §2/§4),
 * no new schema needed. Every report is real data computed client-side from
 * live query results, exportable as CSV.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface SalesReportRow {
  date: string;
  orders: number;
  revenue: number;
}

export interface InventoryValuationRow {
  name: string;
  sku: string;
  quantity: number;
  costPrice: number;
  value: number;
}

export interface TopCustomerRow {
  customerName: string;
  orderCount: number;
  totalSpent: number;
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function getSalesReport(orgId: string, days = 30): Promise<SalesReportRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at")
    .eq("org_id", orgId)
    .neq("fulfillment_status", "cancelled")
    .gte("created_at", daysAgoIso(days))
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);

  const byDay = new Map<string, { orders: number; revenue: number }>();
  for (const row of data as { total: number; created_at: string }[]) {
    const key = new Date(row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const entry = byDay.get(key) ?? { orders: 0, revenue: 0 };
    entry.orders += 1;
    entry.revenue += Number(row.total);
    byDay.set(key, entry);
  }

  return Array.from(byDay.entries()).map(([date, v]) => ({ date, ...v }));
}

export async function getInventoryValuationReport(orgId: string): Promise<InventoryValuationRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("name, sku, quantity, cost_price")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);

  return (data as { name: string; sku: string; quantity: number; cost_price: number }[]).map((r) => ({
    name: r.name,
    sku: r.sku,
    quantity: r.quantity,
    costPrice: Number(r.cost_price),
    value: r.quantity * Number(r.cost_price),
  }));
}

export async function getTopCustomersReport(orgId: string): Promise<TopCustomerRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("total, customer_id")
    .eq("org_id", orgId)
    .neq("fulfillment_status", "cancelled")
    .not("customer_id", "is", null);

  if (error) throw toAppError(error);

  const rows = data as { total: number; customer_id: string }[];
  const byCustomer = new Map<string, { orderCount: number; totalSpent: number }>();
  for (const row of rows) {
    const entry = byCustomer.get(row.customer_id) ?? { orderCount: 0, totalSpent: 0 };
    entry.orderCount += 1;
    entry.totalSpent += Number(row.total);
    byCustomer.set(row.customer_id, entry);
  }

  const customerIds = Array.from(byCustomer.keys());
  if (customerIds.length === 0) return [];

  const { data: customers, error: custError } = await supabase
    .from("customers")
    .select("id, name")
    .in("id", customerIds);

  if (custError) throw toAppError(custError);
  const namesById = new Map((customers ?? []).map((c) => [c.id, c.name]));

  return Array.from(byCustomer.entries())
    .map(([id, v]) => ({ customerName: namesById.get(id) ?? "Customer", ...v }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

export function toCsv<T extends object>(rows: T[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0] as object);
  const lines = [headers.join(",")];
  for (const row of rows) {
    const record = row as Record<string, unknown>;
    lines.push(headers.map((h) => JSON.stringify(record[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
