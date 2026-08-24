export type PurchaseOrderStatus = "draft" | "ordered" | "received" | "cancelled";

export interface Supplier {
  id: string;
  name: string;
}

export interface PurchasableProduct {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string | null;
  status: PurchaseOrderStatus;
  expectedDate: string | null;
  notes: string | null;
  createdAt: string;
  total: number;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string | null;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}
