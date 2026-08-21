/**
 * In-memory data layer for the Inventory module.
 *
 * Shaped like a real API client (async functions, plain DTOs) so swapping the
 * body of each function for a Supabase call later is a contained change —
 * nothing above this file (hooks, components) needs to know the difference.
 */
import {
  activityLog as seedActivityLog,
  categories as seedCategories,
  productVariants as seedVariants,
  products as seedProducts,
  stockMovements as seedStockMovements,
  suppliers as seedSuppliers,
} from "@/modules/inventory/data/mock";
import type {
  ActivityLogEntry,
  Category,
  Product,
  ProductVariant,
  StockMovement,
  StockMovementType,
  Supplier,
} from "@/modules/inventory/types";

let products: Product[] = structuredClone(seedProducts);
let categories: Category[] = structuredClone(seedCategories);
let variants: ProductVariant[] = structuredClone(seedVariants);
let stockMovements: StockMovement[] = structuredClone(seedStockMovements);
let activityLog: ActivityLogEntry[] = structuredClone(seedActivityLog);
const suppliers: Supplier[] = structuredClone(seedSuppliers);

const LATENCY = 350;
const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), LATENCY));

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: "in_stock" | "low_stock" | "out_of_stock";
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let result = products;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.status) {
    result = result.filter((p) => {
      const status =
        p.quantity <= 0 ? "out_of_stock" : p.quantity <= p.reorderPoint ? "low_stock" : "in_stock";
      return status === filters.status;
    });
  }

  return delay(result.slice().sort((a, b) => a.name.localeCompare(b.name)));
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return delay(products.find((p) => p.id === id));
}

export interface CreateProductInput {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  supplierId: string;
  images: string[];
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderPoint: number;
  unit: string;
  location: string;
  variants: Omit<ProductVariant, "id" | "productId">[];
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const id = nextId("prod");
  const nowIso = new Date().toISOString();
  const product: Product = {
    id,
    name: input.name,
    sku: input.sku,
    barcode: `8${Math.floor(400000000000 + Math.random() * 90000000000)}`,
    description: input.description,
    categoryId: input.categoryId,
    supplierId: input.supplierId,
    images: input.images.length ? input.images : ["/demo/products/cold-brew.svg"],
    costPrice: input.costPrice,
    sellingPrice: input.sellingPrice,
    quantity: input.quantity,
    reorderPoint: input.reorderPoint,
    unit: input.unit,
    location: input.location,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  products = [product, ...products];

  variants = [
    ...variants,
    ...input.variants.map((v) => ({ ...v, id: nextId("var"), productId: id })),
  ];

  activityLog = [
    {
      id: nextId("act"),
      productId: id,
      action: "created",
      description: "Product added to inventory",
      actor: "You",
      createdAt: nowIso,
    },
    ...activityLog,
  ];

  return delay(product);
}

export async function deleteProduct(id: string): Promise<void> {
  products = products.filter((p) => p.id !== id);
  return delay(undefined);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function listCategories(): Promise<(Category & { productCount: number })[]> {
  const withCounts = categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.categoryId === c.id).length,
  }));
  return delay(withCounts);
}

export interface CategoryInput {
  name: string;
  color: string;
  icon: string;
  description: string;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const category: Category = { id: nextId("cat"), ...input };
  categories = [...categories, category];
  return delay(category);
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  categories = categories.map((c) => (c.id === id ? { ...c, ...input } : c));
  return delay(categories.find((c) => c.id === id)!);
}

export async function deleteCategory(id: string): Promise<void> {
  categories = categories.filter((c) => c.id !== id);
  return delay(undefined);
}

// ---------------------------------------------------------------------------
// Stock movements / adjustments
// ---------------------------------------------------------------------------
export async function listStockMovements(productId: string): Promise<StockMovement[]> {
  return delay(
    stockMovements
      .filter((m) => m.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

export interface AdjustStockInput {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  notes: string;
  toLocation?: string;
}

export async function adjustStock(input: AdjustStockInput): Promise<Product> {
  const product = products.find((p) => p.id === input.productId);
  if (!product) throw new Error("Product not found");

  const delta =
    input.type === "increase" ? input.quantity : input.type === "decrease" ? -input.quantity : 0;
  const resultingQuantity = Math.max(product.quantity + delta, 0);

  product.quantity = resultingQuantity;
  product.updatedAt = new Date().toISOString();

  const movement: StockMovement = {
    id: nextId("mv"),
    productId: input.productId,
    type: input.type,
    quantity: input.quantity,
    reason: input.reason,
    notes: input.notes,
    performedBy: "You",
    resultingQuantity,
    fromLocation: input.type === "transfer" ? product.location : undefined,
    toLocation: input.type === "transfer" ? input.toLocation : undefined,
    createdAt: new Date().toISOString(),
  };
  stockMovements = [movement, ...stockMovements];

  activityLog = [
    {
      id: nextId("act"),
      productId: input.productId,
      action: "stock_adjusted",
      description: `Stock ${input.type === "increase" ? "increased" : input.type === "decrease" ? "decreased" : "transferred"} by ${input.quantity} — ${input.reason}`,
      actor: "You",
      createdAt: new Date().toISOString(),
    },
    ...activityLog,
  ];

  return delay(product);
}

// ---------------------------------------------------------------------------
// Activity log, variants, suppliers
// ---------------------------------------------------------------------------
export async function listActivityLog(productId: string): Promise<ActivityLogEntry[]> {
  return delay(
    activityLog
      .filter((a) => a.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

export async function listVariants(productId: string): Promise<ProductVariant[]> {
  return delay(variants.filter((v) => v.productId === productId));
}

export async function listSuppliers(): Promise<Supplier[]> {
  return delay(suppliers);
}
