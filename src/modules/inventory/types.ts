export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Category {
  id: string;
  name: string;
  color: string; // one of the chart/status token names used for the swatch + badge
  icon: string; // lucide icon name, resolved via the icon registry
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  priceDelta: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  categoryId: string | null;
  supplierId: string | null;
  images: string[];
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderPoint: number;
  unit: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type StockMovementType = "increase" | "decrease" | "transfer";

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  notes: string;
  performedBy: string;
  resultingQuantity: number;
  fromLocation?: string;
  toLocation?: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  productId: string;
  action: string;
  description: string;
  actor: string;
  createdAt: string;
}

export function getStockStatus(product: Pick<Product, "quantity" | "reorderPoint">): StockStatus {
  if (product.quantity <= 0) return "out_of_stock";
  if (product.quantity <= product.reorderPoint) return "low_stock";
  return "in_stock";
}
