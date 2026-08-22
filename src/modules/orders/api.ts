/**
 * Supabase-backed data layer for the Orders module. Same conventions as
 * src/modules/inventory/api.ts: every function is org-scoped (orgId first),
 * every error normalized via toAppError, and the multi-step "create an
 * order" / "cancel an order" operations go through the create_order /
 * update_order_status RPCs (see supabase/migrations/0004_orders.sql) rather
 * than being assembled client-side.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type {
  Customer,
  FulfillmentStatus,
  Order,
  OrderEvent,
  OrderItem,
  OrderNote,
  PaymentStatus,
  SellableProduct,
} from "@/modules/orders/types";

type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

function mapCustomer(row: CustomerRow): Customer {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone };
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    subtotal: Number(row.subtotal),
    discountAmount: Number(row.discount_amount),
    taxAmount: Number(row.tax_amount),
    shippingAmount: Number(row.shipping_amount),
    total: Number(row.total ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    sku: row.sku,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total ?? 0),
  };
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
export async function listCustomers(orgId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return (data as CustomerRow[]).map(mapCustomer);
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
}

export async function createCustomer(orgId: string, input: CustomerInput): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({ org_id: orgId, ...input })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapCustomer(data as CustomerRow);
}

// ---------------------------------------------------------------------------
// Sellable products (for the order builder — see SellableProduct doc comment)
// ---------------------------------------------------------------------------
export async function listSellableProducts(orgId: string): Promise<SellableProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, sku, selling_price, quantity")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    sku: row.sku,
    sellingPrice: Number(row.selling_price),
    quantityAvailable: row.quantity,
  }));
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export interface OrderFilters {
  search?: string;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
}

export async function listOrders(orgId: string, filters: OrderFilters = {}): Promise<Order[]> {
  let query = supabase
    .from("orders")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("order_number", { ascending: false });

  if (filters.paymentStatus) query = query.eq("payment_status", filters.paymentStatus);
  if (filters.fulfillmentStatus) query = query.eq("fulfillment_status", filters.fulfillmentStatus);

  const { data, error } = await query;
  if (error) throw toAppError(error);

  let orders = (data as OrderRow[]).map(mapOrder);

  if (filters.search) {
    const term = filters.search.trim().toLowerCase();
    const asNumber = term.replace(/^ord-?/i, "").replace(/^0+/, "");
    orders = orders.filter((o) => String(o.orderNumber).includes(asNumber));
  }

  return orders;
}

export async function getOrder(orgId: string, id: string): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("org_id", orgId)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw toAppError(error);
  return data ? mapOrder(data as OrderRow) : undefined;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: string | null;
  items: CreateOrderItemInput[];
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
}

export async function createOrder(orgId: string, input: CreateOrderInput): Promise<Order> {
  const { data, error } = await supabase.rpc("create_order", {
    p_org_id: orgId,
    p_customer_id: input.customerId as unknown as string,
    p_items: input.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
    p_discount_amount: input.discountAmount,
    p_tax_amount: input.taxAmount,
    p_shipping_amount: input.shippingAmount,
  });

  if (error) throw toAppError(error);
  return mapOrder(data as OrderRow);
}

export interface UpdateOrderStatusInput {
  orderId: string;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
}

export async function updateOrderStatus(
  orgId: string,
  input: UpdateOrderStatusInput,
): Promise<Order> {
  const { data, error } = await supabase.rpc("update_order_status", {
    p_org_id: orgId,
    p_order_id: input.orderId,
    p_payment_status: input.paymentStatus,
    p_fulfillment_status: input.fulfillmentStatus,
  });

  if (error) throw toAppError(error);
  return mapOrder(data as OrderRow);
}

export async function listOrderItems(orgId: string, orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("org_id", orgId)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);
  return (data as OrderItemRow[]).map(mapOrderItem);
}

// ---------------------------------------------------------------------------
// Notes + timeline
// ---------------------------------------------------------------------------
export async function listOrderNotes(orgId: string, orderId: string): Promise<OrderNote[]> {
  const { data, error } = await supabase
    .from("order_notes")
    .select("*, profiles(full_name)")
    .eq("org_id", orgId)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);

  return (
    data as (Database["public"]["Tables"]["order_notes"]["Row"] & {
      profiles: { full_name: string | null } | null;
    })[]
  ).map((row) => ({
    id: row.id,
    orderId: row.order_id,
    authorName: row.profiles?.full_name ?? "Unknown",
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function addOrderNote(orgId: string, orderId: string, body: string): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw toAppError(userError);

  const { error } = await supabase.from("order_notes").insert({
    org_id: orgId,
    order_id: orderId,
    body,
    author_id: userData.user?.id,
  });
  if (error) throw toAppError(error);
}

export async function listOrderEvents(orgId: string, orderId: string): Promise<OrderEvent[]> {
  const { data, error } = await supabase
    .from("order_events")
    .select("*, profiles(full_name)")
    .eq("org_id", orgId)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);

  return (
    data as (Database["public"]["Tables"]["order_events"]["Row"] & {
      profiles: { full_name: string | null } | null;
    })[]
  ).map((row) => ({
    id: row.id,
    orderId: row.order_id,
    type: row.type as OrderEvent["type"],
    description: row.description,
    actorName: row.profiles?.full_name ?? "System",
    createdAt: row.created_at,
  }));
}
