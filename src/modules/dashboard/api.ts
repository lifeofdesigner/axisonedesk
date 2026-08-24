/**
 * Supabase-backed data layer for the top-level Dashboard. Queries `orders`,
 * `order_items`, `customers`, and `products` directly rather than importing
 * Orders/Inventory module code — a shared data store, not shared code (see
 * ARCHITECTURE.md §2). Same conventions as every other module's api.ts:
 * org-scoped, errors normalized via toAppError.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface DashboardKpis {
  revenue30d: number;
  revenuePrev30d: number;
  orders30d: number;
  ordersPrev30d: number;
  avgOrderValue30d: number;
  avgOrderValuePrev30d: number;
  activeCustomers30d: number;
  activeCustomersPrev30d: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface DashboardOrder {
  id: string;
  orderNumber: number;
  customerName: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
}

export interface TopProduct {
  productName: string;
  unitsSold: number;
  revenue: number;
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function getDashboardKpis(orgId: string): Promise<DashboardKpis> {
  const since30 = daysAgoIso(30);
  const since60 = daysAgoIso(60);

  const { data, error } = await supabase
    .from("orders")
    .select("total, customer_id, created_at, fulfillment_status")
    .eq("org_id", orgId)
    .neq("fulfillment_status", "cancelled")
    .gte("created_at", since60);

  if (error) throw toAppError(error);

  const rows = (data ?? []) as {
    total: number;
    customer_id: string | null;
    created_at: string;
    fulfillment_status: string;
  }[];

  const current = rows.filter((r) => r.created_at >= since30);
  const previous = rows.filter((r) => r.created_at < since30);

  const sum = (arr: typeof rows) => arr.reduce((s, r) => s + Number(r.total), 0);
  const distinctCustomers = (arr: typeof rows) =>
    new Set(arr.map((r) => r.customer_id).filter((id): id is string => Boolean(id))).size;

  const revenue30d = sum(current);
  const revenuePrev30d = sum(previous);
  const orders30d = current.length;
  const ordersPrev30d = previous.length;

  return {
    revenue30d,
    revenuePrev30d,
    orders30d,
    ordersPrev30d,
    avgOrderValue30d: orders30d ? revenue30d / orders30d : 0,
    avgOrderValuePrev30d: ordersPrev30d ? revenuePrev30d / ordersPrev30d : 0,
    activeCustomers30d: distinctCustomers(current),
    activeCustomersPrev30d: distinctCustomers(previous),
  };
}

export async function getRevenueSeries(orgId: string): Promise<RevenuePoint[]> {
  const since30 = daysAgoIso(30);
  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at")
    .eq("org_id", orgId)
    .neq("fulfillment_status", "cancelled")
    .gte("created_at", since30)
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);

  const byDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    byDay.set(key, 0);
  }

  for (const row of (data ?? []) as { total: number; created_at: string }[]) {
    const key = new Date(row.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    byDay.set(key, (byDay.get(key) ?? 0) + Number(row.total));
  }

  return Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue }));
}

export async function getRecentOrders(orgId: string, limit = 6): Promise<DashboardOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, payment_status, fulfillment_status, total, created_at, customer_id")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw toAppError(error);

  const rows = (data ?? []) as {
    id: string;
    order_number: number;
    payment_status: string;
    fulfillment_status: string;
    total: number;
    created_at: string;
    customer_id: string | null;
  }[];

  const customerIds = Array.from(
    new Set(rows.map((r) => r.customer_id).filter((id): id is string => Boolean(id))),
  );

  let namesById = new Map<string, string>();
  if (customerIds.length > 0) {
    const { data: customers, error: custError } = await supabase
      .from("customers")
      .select("id, name")
      .in("id", customerIds);
    if (custError) throw toAppError(custError);
    namesById = new Map((customers ?? []).map((c) => [c.id, c.name]));
  }

  return rows.map((r) => ({
    id: r.id,
    orderNumber: r.order_number,
    customerName: r.customer_id ? (namesById.get(r.customer_id) ?? "Customer") : "Walk-in customer",
    paymentStatus: r.payment_status,
    fulfillmentStatus: r.fulfillment_status,
    total: Number(r.total),
    createdAt: r.created_at,
  }));
}

export async function getLowStockProducts(orgId: string, limit = 4): Promise<LowStockProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, sku, quantity, reorder_point")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("quantity", { ascending: true })
    .limit(50);

  if (error) throw toAppError(error);

  const rows = (data ?? []) as {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    reorder_point: number;
  }[];

  return rows
    .filter((r) => r.quantity <= r.reorder_point)
    .slice(0, limit)
    .map((r) => ({
      id: r.id,
      name: r.name,
      sku: r.sku,
      quantity: r.quantity,
      reorderPoint: r.reorder_point,
    }));
}

export async function getTopProducts(orgId: string, limit = 4): Promise<TopProduct[]> {
  const since30 = daysAgoIso(30);
  const { data, error } = await supabase
    .from("order_items")
    .select("product_name, quantity, line_total, created_at")
    .eq("org_id", orgId)
    .gte("created_at", since30);

  if (error) throw toAppError(error);

  const rows = (data ?? []) as {
    product_name: string;
    quantity: number;
    line_total: number;
    created_at: string;
  }[];

  const byProduct = new Map<string, { unitsSold: number; revenue: number }>();
  for (const row of rows) {
    const entry = byProduct.get(row.product_name) ?? { unitsSold: 0, revenue: 0 };
    entry.unitsSold += row.quantity;
    entry.revenue += Number(row.line_total);
    byProduct.set(row.product_name, entry);
  }

  return Array.from(byProduct.entries())
    .map(([productName, v]) => ({ productName, ...v }))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit);
}
