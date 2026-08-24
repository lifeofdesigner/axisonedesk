/**
 * Supabase-backed data layer for Purchasing. Reads `suppliers`/`products`
 * directly (owned by inventory) rather than importing Inventory module code
 * — a shared data store, not shared code. Receiving is atomic via the
 * `receive_purchase_order` RPC (supabase/migrations/0007_purchasing.sql).
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type {
  PurchasableProduct,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
} from "@/modules/purchasing/types";

type PORow = Database["public"]["Tables"]["purchase_orders"]["Row"];
type POItemRow = Database["public"]["Tables"]["purchase_order_items"]["Row"];

function mapPO(row: PORow, total = 0): PurchaseOrder {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    status: row.status as PurchaseOrder["status"],
    expectedDate: row.expected_date,
    notes: row.notes,
    createdAt: row.created_at,
    total,
  };
}

function mapItem(row: POItemRow): PurchaseOrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    sku: row.sku,
    quantity: row.quantity,
    unitCost: Number(row.unit_cost),
    lineTotal: Number(row.line_total),
  };
}

export async function listSuppliers(orgId: string): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return data as Supplier[];
}

export async function listPurchasableProducts(orgId: string): Promise<PurchasableProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, sku, cost_price")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return (data as { id: string; name: string; sku: string; cost_price: number }[]).map((r) => ({
    id: r.id,
    name: r.name,
    sku: r.sku,
    costPrice: Number(r.cost_price),
  }));
}

export async function listPurchaseOrders(orgId: string): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("*, purchase_order_items(line_total)")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);

  const rows = data as (PORow & { purchase_order_items: { line_total: number }[] })[];
  return rows.map((row) =>
    mapPO(
      row,
      row.purchase_order_items.reduce((sum, item) => sum + Number(item.line_total), 0),
    ),
  );
}

export async function getPurchaseOrder(orgId: string, id: string): Promise<PurchaseOrder | null> {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("*, purchase_order_items(line_total)")
    .eq("org_id", orgId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw toAppError(error);
  if (!data) return null;
  const row = data as PORow & { purchase_order_items: { line_total: number }[] };
  return mapPO(
    row,
    row.purchase_order_items.reduce((sum, item) => sum + Number(item.line_total), 0),
  );
}

export async function listPurchaseOrderItems(orgId: string, poId: string): Promise<PurchaseOrderItem[]> {
  const { data, error } = await supabase
    .from("purchase_order_items")
    .select("*")
    .eq("org_id", orgId)
    .eq("purchase_order_id", poId)
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);
  return (data as POItemRow[]).map(mapItem);
}

export interface CreatePurchaseOrderInput {
  supplierId: string | null;
  expectedDate: string | null;
  notes: string | null;
  items: { productId: string; productName: string; sku: string; quantity: number; unitCost: number }[];
}

export async function createPurchaseOrder(orgId: string, input: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
  const { data: userData } = await supabase.auth.getUser();

  const { data: po, error: poError } = await supabase
    .from("purchase_orders")
    .insert({
      org_id: orgId,
      supplier_id: input.supplierId,
      expected_date: input.expectedDate,
      notes: input.notes,
      status: "ordered",
      created_by: userData.user?.id,
    })
    .select("*")
    .single();

  if (poError) throw toAppError(poError);
  const poRow = po as PORow;

  const { error: itemsError } = await supabase.from("purchase_order_items").insert(
    input.items.map((item) => ({
      org_id: orgId,
      purchase_order_id: poRow.id,
      product_id: item.productId,
      product_name: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unit_cost: item.unitCost,
    })),
  );

  if (itemsError) throw toAppError(itemsError);

  return mapPO(poRow, input.items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0));
}

export async function receivePurchaseOrder(orgId: string, id: string): Promise<void> {
  const { error } = await supabase.rpc("receive_purchase_order", {
    p_org_id: orgId,
    p_purchase_order_id: id,
  });

  if (error) throw toAppError(error);
}
