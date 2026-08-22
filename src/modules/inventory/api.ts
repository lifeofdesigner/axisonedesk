/**
 * Supabase-backed data layer for the Inventory module. Every function is
 * explicitly org-scoped (orgId is always the first argument) — callers get
 * that id from useCurrentOrganization() in hooks.ts, never from here.
 *
 * All Supabase errors are normalized via toAppError before leaving this file;
 * components/hooks never see a raw PostgrestError.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type {
  ActivityLogEntry,
  Category,
  Product,
  ProductVariant,
  StockMovement,
  StockMovementType,
  Supplier,
} from "@/modules/inventory/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type SupplierRow = Database["public"]["Tables"]["suppliers"]["Row"];
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
type StockAdjustmentRow = Database["public"]["Tables"]["stock_adjustments"]["Row"];

// ---------------------------------------------------------------------------
// Row -> domain mappers
// ---------------------------------------------------------------------------
function mapProduct(row: ProductRow, images: string[]): Product {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    barcode: row.barcode,
    description: row.description,
    categoryId: row.category_id,
    supplierId: row.supplier_id,
    images,
    costPrice: Number(row.cost_price),
    sellingPrice: Number(row.selling_price),
    quantity: row.quantity,
    reorderPoint: row.reorder_point,
    unit: row.unit,
    location: row.location,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon,
    description: row.description,
  };
}

function mapSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
  };
}

function mapVariant(row: ProductVariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    sku: row.sku,
    priceDelta: Number(row.price_delta),
    quantity: row.quantity,
  };
}

function mapStockAdjustment(
  row: StockAdjustmentRow & { profiles: { full_name: string | null } | null },
): StockMovement {
  return {
    id: row.id,
    productId: row.product_id,
    type: row.type,
    quantity: row.quantity,
    reason: row.reason,
    notes: row.notes,
    performedBy: row.profiles?.full_name ?? "Unknown",
    resultingQuantity: row.resulting_quantity,
    fromLocation: row.from_location ?? undefined,
    toLocation: row.to_location ?? undefined,
    createdAt: row.created_at,
  };
}

async function fetchImagesByProductIds(productIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (productIds.length === 0) return map;

  const { data, error } = await supabase
    .from("product_images")
    .select("product_id, url, sort_order")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  if (error) throw toAppError(error);

  for (const row of data as Pick<ProductImageRow, "product_id" | "url" | "sort_order">[]) {
    const existing = map.get(row.product_id) ?? [];
    existing.push(row.url);
    map.set(row.product_id, existing);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: "in_stock" | "low_stock" | "out_of_stock";
}

export async function listProducts(orgId: string, filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (filters.search) {
    const term = filters.search.replace(/[%_]/g, "\\$&");
    query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.status) {
    query = query.eq("stock_status", filters.status);
  }

  const { data, error } = await query;
  if (error) throw toAppError(error);

  const rows = data as ProductRow[];
  const imagesByProduct = await fetchImagesByProductIds(rows.map((r) => r.id));
  return rows.map((row) => mapProduct(row, imagesByProduct.get(row.id) ?? []));
}

export async function getProduct(orgId: string, id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("org_id", orgId)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw toAppError(error);
  if (!data) return undefined;

  const imagesByProduct = await fetchImagesByProductIds([data.id]);
  return mapProduct(data as ProductRow, imagesByProduct.get(data.id) ?? []);
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

function generateBarcode(): string {
  return `8${Math.floor(400000000000 + Math.random() * 90000000000)}`;
}

export async function createProduct(orgId: string, input: CreateProductInput): Promise<Product> {
  const { data: productRow, error: productError } = await supabase
    .from("products")
    .insert({
      org_id: orgId,
      name: input.name,
      sku: input.sku,
      barcode: generateBarcode(),
      description: input.description,
      category_id: input.categoryId || null,
      supplier_id: input.supplierId || null,
      cost_price: input.costPrice,
      selling_price: input.sellingPrice,
      quantity: input.quantity,
      reorder_point: input.reorderPoint,
      unit: input.unit,
      location: input.location,
    })
    .select("*")
    .single();

  if (productError) throw toAppError(productError);
  const product = productRow as ProductRow;

  const images = input.images.length ? input.images : [];
  if (images.length) {
    const { error: imagesError } = await supabase.from("product_images").insert(
      images.map((url, index) => ({
        org_id: orgId,
        product_id: product.id,
        url,
        sort_order: index,
      })),
    );
    if (imagesError) throw toAppError(imagesError);
  }

  if (input.variants.length) {
    const { error: variantsError } = await supabase.from("product_variants").insert(
      input.variants.map((v) => ({
        org_id: orgId,
        product_id: product.id,
        name: v.name,
        sku: v.sku,
        price_delta: v.priceDelta,
        quantity: v.quantity,
      })),
    );
    if (variantsError) throw toAppError(variantsError);
  }

  return mapProduct(product, images);
}

export async function deleteProduct(orgId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("org_id", orgId)
    .eq("id", id);

  if (error) throw toAppError(error);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function listCategories(
  orgId: string,
): Promise<(Category & { productCount: number })[]> {
  const { data: categoryRows, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (categoriesError) throw toAppError(categoriesError);

  const { data: countRows, error: countError } = await supabase
    .from("products")
    .select("category_id")
    .eq("org_id", orgId)
    .is("deleted_at", null);

  if (countError) throw toAppError(countError);

  const counts = new Map<string, number>();
  for (const row of countRows as Pick<ProductRow, "category_id">[]) {
    if (!row.category_id) continue;
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return (categoryRows as CategoryRow[]).map((row) => ({
    ...mapCategory(row),
    productCount: counts.get(row.id) ?? 0,
  }));
}

export interface CategoryInput {
  name: string;
  color: string;
  icon: string;
  description: string;
}

export async function createCategory(orgId: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({ org_id: orgId, ...input })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapCategory(data as CategoryRow);
}

export async function updateCategory(
  orgId: string,
  id: string,
  input: CategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("org_id", orgId)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapCategory(data as CategoryRow);
}

export async function deleteCategory(orgId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("org_id", orgId)
    .eq("id", id);

  if (error) throw toAppError(error);
}

// ---------------------------------------------------------------------------
// Stock adjustments (the "stock history" the UI shows) + the ledger they feed
// ---------------------------------------------------------------------------
export async function listStockMovements(orgId: string, productId: string): Promise<StockMovement[]> {
  const { data, error } = await supabase
    .from("stock_adjustments")
    .select("*, profiles(full_name)")
    .eq("org_id", orgId)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);
  return (data as (StockAdjustmentRow & { profiles: { full_name: string | null } | null })[]).map(
    mapStockAdjustment,
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

/**
 * Runs as a single atomic Postgres transaction via the `adjust_stock` RPC
 * (see supabase/migrations/0003_adjust_stock_rpc.sql) rather than as
 * sequential client-side reads/writes — the ledger insert and the quantity
 * update either both commit or neither does. Per ARCHITECTURE.md §16, this
 * is where multi-step transactional operations belong.
 */
export async function adjustStock(orgId: string, input: AdjustStockInput): Promise<Product> {
  const { data, error } = await supabase.rpc("adjust_stock", {
    p_org_id: orgId,
    p_product_id: input.productId,
    p_type: input.type,
    p_quantity: input.quantity,
    p_reason: input.reason,
    p_notes: input.notes,
    p_to_location: input.toLocation,
  });
  if (error) throw toAppError(error);

  const imagesByProduct = await fetchImagesByProductIds([input.productId]);
  return mapProduct(data as ProductRow, imagesByProduct.get(input.productId) ?? []);
}

// ---------------------------------------------------------------------------
// Activity log — derived from product timestamps + its stock adjustments.
// There's no separate field-level audit table in this schema (see
// ARCHITECTURE.md §4 reconciliation note); this composes real data rather
// than fabricating entries the app doesn't actually track.
// ---------------------------------------------------------------------------
export async function listActivityLog(orgId: string, productId: string): Promise<ActivityLogEntry[]> {
  const [{ data: productRow, error: productError }, movements] = await Promise.all([
    supabase
      .from("products")
      .select("id, created_at, updated_at")
      .eq("org_id", orgId)
      .eq("id", productId)
      .single(),
    listStockMovements(orgId, productId),
  ]);

  if (productError) throw toAppError(productError);

  const entries: ActivityLogEntry[] = [
    {
      id: `created-${productRow.id}`,
      productId,
      action: "created",
      description: "Product added to inventory",
      actor: "—",
      createdAt: productRow.created_at,
    },
    ...movements.map((m): ActivityLogEntry => ({
      id: `adjustment-${m.id}`,
      productId,
      action: "stock_adjusted",
      description: `Stock ${m.type === "increase" ? "increased" : m.type === "decrease" ? "decreased" : "transferred"} by ${m.quantity} — ${m.reason}`,
      actor: m.performedBy,
      createdAt: m.createdAt,
    })),
  ];

  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---------------------------------------------------------------------------
// Variants, suppliers
// ---------------------------------------------------------------------------
export async function listVariants(orgId: string, productId: string): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("org_id", orgId)
    .eq("product_id", productId)
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);
  return (data as ProductVariantRow[]).map(mapVariant);
}

export async function listSuppliers(orgId: string): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return (data as SupplierRow[]).map(mapSupplier);
}

// ---------------------------------------------------------------------------
// Stock movement chart data — aggregated from the inventory_transactions ledger
// ---------------------------------------------------------------------------
export interface StockMovementDay {
  date: string;
  stockIn: number;
  stockOut: number;
}

export async function getStockMovementTrend(orgId: string, days = 14): Promise<StockMovementDay[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("inventory_transactions")
    .select("direction, quantity, occurred_at")
    .eq("org_id", orgId)
    .gte("occurred_at", since.toISOString())
    .order("occurred_at", { ascending: true });

  if (error) throw toAppError(error);

  const buckets = new Map<string, { stockIn: number; stockOut: number }>();
  const dayKeys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayKeys.push(key);
    buckets.set(key, { stockIn: 0, stockOut: 0 });
  }

  for (const row of data as { direction: "in" | "out"; quantity: number; occurred_at: string }[]) {
    const key = row.occurred_at.slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (row.direction === "in") bucket.stockIn += row.quantity;
    else bucket.stockOut += row.quantity;
  }

  return dayKeys.map((key) => {
    const bucket = buckets.get(key)!;
    const label = new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { date: label, stockIn: bucket.stockIn, stockOut: bucket.stockOut };
  });
}
