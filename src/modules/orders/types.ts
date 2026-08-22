export type PaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";
export type FulfillmentStatus = "unfulfilled" | "partially_fulfilled" | "fulfilled" | "cancelled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * A read-only, order-relevant projection of a product. Orders queries the
 * `products` table directly (a shared data store, not shared code) rather
 * than importing Inventory's hooks/components — see ARCHITECTURE.md §2:
 * modules never depend on each other's code directly.
 */
export interface SellableProduct {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  quantityAvailable: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string | null;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderNote {
  id: string;
  orderId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export type OrderEventType =
  | "created"
  | "payment_status_changed"
  | "fulfillment_status_changed"
  | "note_added"
  | "cancelled";

export interface OrderEvent {
  id: string;
  orderId: string;
  type: OrderEventType;
  description: string;
  actorName: string;
  createdAt: string;
}

export function formatOrderNumber(orderNumber: number): string {
  return `ORD-${String(orderNumber).padStart(5, "0")}`;
}
