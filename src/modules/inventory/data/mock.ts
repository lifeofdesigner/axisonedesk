import type {
  ActivityLogEntry,
  Category,
  Product,
  ProductVariant,
  StockMovement,
  Supplier,
} from "@/modules/inventory/types";

const img = (name: string) => `/demo/products/${name}.svg`;

export const categories: Category[] = [
  {
    id: "cat-beverages",
    name: "Beverages",
    color: "chart-1",
    icon: "CupSoda",
    description: "Ready-to-serve drinks — hot and iced",
  },
  {
    id: "cat-bakery",
    name: "Bakery",
    color: "chart-4",
    icon: "Croissant",
    description: "Fresh-baked pastries and snacks",
  },
  {
    id: "cat-coffee-tea",
    name: "Coffee & Tea",
    color: "chart-2",
    icon: "Coffee",
    description: "Whole bean, ground, and loose leaf",
  },
  {
    id: "cat-dairy",
    name: "Dairy & Alternatives",
    color: "chart-3",
    icon: "Milk",
    description: "Milk and plant-based alternatives",
  },
  {
    id: "cat-packaging",
    name: "Packaging",
    color: "chart-5",
    icon: "Package",
    description: "Cups, lids, and to-go supplies",
  },
  {
    id: "cat-syrups",
    name: "Syrups & Add-ons",
    color: "chart-4",
    icon: "Droplet",
    description: "Flavor syrups and extras",
  },
];

export const suppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Primary Coffee Supplier",
    contactName: "Alex Rivera",
    email: "orders@coffeesupplier.example",
    phone: "+1 (555) 201-4478",
  },
  {
    id: "sup-2",
    name: "Bakery Distribution Co.",
    contactName: "Jamie Chen",
    email: "orders@bakerydistribution.example",
    phone: "+1 (555) 330-9021",
  },
  {
    id: "sup-3",
    name: "Regional Dairy Co.",
    contactName: "Morgan Lee",
    email: "orders@regionaldairy.example",
    phone: "+1 (555) 442-7710",
  },
  {
    id: "sup-4",
    name: "Packaging Supply Co.",
    contactName: "Taylor Brooks",
    email: "orders@packagingsupply.example",
    phone: "+1 (555) 118-6602",
  },
];

interface ProductSeed {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  supplierId: string;
  image: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderPoint: number;
  unit: string;
  location: string;
  description: string;
}

const seeds: ProductSeed[] = [
  {
    id: "prod-1",
    name: "Signature Cold Brew",
    sku: "BEV-001",
    categoryId: "cat-beverages",
    supplierId: "sup-1",
    image: img("cold-brew"),
    costPrice: 2.1,
    sellingPrice: 4.5,
    quantity: 120,
    reorderPoint: 30,
    unit: "cup",
    location: "Main Counter",
    description:
      "Slow-steeped for 18 hours using our house dark roast, served over ice. Our best-selling drink year-round.",
  },
  {
    id: "prod-2",
    name: "Iced Caramel Latte",
    sku: "BEV-002",
    categoryId: "cat-beverages",
    supplierId: "sup-1",
    image: img("caramel-latte"),
    costPrice: 2.4,
    sellingPrice: 5.25,
    quantity: 95,
    reorderPoint: 25,
    unit: "cup",
    location: "Main Counter",
    description: "Espresso, cold milk, and house caramel sauce over ice, finished with a drizzle.",
  },
  {
    id: "prod-3",
    name: "Chai Latte",
    sku: "BEV-003",
    categoryId: "cat-beverages",
    supplierId: "sup-1",
    image: img("chai-latte"),
    costPrice: 2.2,
    sellingPrice: 4.95,
    quantity: 60,
    reorderPoint: 20,
    unit: "cup",
    location: "Main Counter",
    description: "Spiced black tea concentrate steamed with milk of choice.",
  },
  {
    id: "prod-4",
    name: "Hot Chocolate",
    sku: "BEV-004",
    categoryId: "cat-beverages",
    supplierId: "sup-1",
    image: img("hot-chocolate"),
    costPrice: 1.8,
    sellingPrice: 4.25,
    quantity: 40,
    reorderPoint: 15,
    unit: "cup",
    location: "Main Counter",
    description: "Belgian dark chocolate melted into steamed whole milk, topped with whipped cream.",
  },
  {
    id: "prod-5",
    name: "Sparkling Water 330ml",
    sku: "BEV-005",
    categoryId: "cat-beverages",
    supplierId: "sup-4",
    image: img("sparkling-water"),
    costPrice: 0.6,
    sellingPrice: 2.5,
    quantity: 200,
    reorderPoint: 50,
    unit: "bottle",
    location: "Fridge Display",
    description: "Locally bottled sparkling mineral water.",
  },
  {
    id: "prod-6",
    name: "Iced Green Tea",
    sku: "BEV-006",
    categoryId: "cat-beverages",
    supplierId: "sup-1",
    image: img("iced-tea"),
    costPrice: 1.5,
    sellingPrice: 3.75,
    quantity: 18,
    reorderPoint: 20,
    unit: "cup",
    location: "Main Counter",
    description: "Cold-brewed sencha green tea, lightly sweetened, served over ice.",
  },
  {
    id: "prod-7",
    name: "Butter Croissant",
    sku: "BAK-001",
    categoryId: "cat-bakery",
    supplierId: "sup-2",
    image: img("croissant"),
    costPrice: 1.1,
    sellingPrice: 3.25,
    quantity: 42,
    reorderPoint: 15,
    unit: "piece",
    location: "Pastry Case",
    description: "Classic all-butter croissant, baked fresh every morning.",
  },
  {
    id: "prod-8",
    name: "Almond Croissant",
    sku: "BAK-002",
    categoryId: "cat-bakery",
    supplierId: "sup-2",
    image: img("almond-croissant"),
    costPrice: 1.4,
    sellingPrice: 3.75,
    quantity: 8,
    reorderPoint: 15,
    unit: "piece",
    location: "Pastry Case",
    description: "Twice-baked croissant filled with almond cream, topped with sliced almonds.",
  },
  {
    id: "prod-9",
    name: "Blueberry Muffin",
    sku: "BAK-003",
    categoryId: "cat-bakery",
    supplierId: "sup-2",
    image: img("blueberry-muffin"),
    costPrice: 1.2,
    sellingPrice: 3.5,
    quantity: 0,
    reorderPoint: 12,
    unit: "piece",
    location: "Pastry Case",
    description: "Moist muffin loaded with wild blueberries, topped with turbinado sugar.",
  },
  {
    id: "prod-10",
    name: "Espresso Beans 1kg",
    sku: "COF-001",
    categoryId: "cat-coffee-tea",
    supplierId: "sup-1",
    image: img("espresso-beans"),
    costPrice: 9.0,
    sellingPrice: 18.0,
    quantity: 4,
    reorderPoint: 15,
    unit: "bag",
    location: "Back Storage",
    description: "House-blend dark roast whole bean, sourced from our roasting partner.",
  },
  {
    id: "prod-11",
    name: "Loose Leaf Green Tea 250g",
    sku: "COF-002",
    categoryId: "cat-coffee-tea",
    supplierId: "sup-1",
    image: img("green-tea"),
    costPrice: 7.5,
    sellingPrice: 14.0,
    quantity: 25,
    reorderPoint: 10,
    unit: "bag",
    location: "Back Storage",
    description: "Single-origin sencha green tea, hand-picked and shade-grown.",
  },
  {
    id: "prod-12",
    name: "Oat Milk 1L",
    sku: "DAI-001",
    categoryId: "cat-dairy",
    supplierId: "sup-3",
    image: img("oat-milk"),
    costPrice: 1.6,
    sellingPrice: 3.2,
    quantity: 7,
    reorderPoint: 20,
    unit: "carton",
    location: "Fridge Storage",
    description: "Barista-formulated oat milk that steams and froths like dairy.",
  },
  {
    id: "prod-13",
    name: "Whole Milk 1L",
    sku: "DAI-002",
    categoryId: "cat-dairy",
    supplierId: "sup-3",
    image: img("oat-milk"),
    costPrice: 0.9,
    sellingPrice: 2.1,
    quantity: 55,
    reorderPoint: 20,
    unit: "carton",
    location: "Fridge Storage",
    description: "Locally sourced whole milk from our regional dairy supplier.",
  },
  {
    id: "prod-14",
    name: "Almond Milk 1L",
    sku: "DAI-003",
    categoryId: "cat-dairy",
    supplierId: "sup-3",
    image: img("oat-milk"),
    costPrice: 1.9,
    sellingPrice: 3.6,
    quantity: 33,
    reorderPoint: 15,
    unit: "carton",
    location: "Fridge Storage",
    description: "Unsweetened almond milk, low-calorie dairy alternative.",
  },
  {
    id: "prod-15",
    name: "Paper Cups 12oz (100pk)",
    sku: "PKG-001",
    categoryId: "cat-packaging",
    supplierId: "sup-4",
    image: img("paper-cups"),
    costPrice: 8.5,
    sellingPrice: 12.99,
    quantity: 2,
    reorderPoint: 10,
    unit: "pack",
    location: "Back Storage",
    description: "Compostable 12oz hot cups, kraft brown, sleeve of 100.",
  },
  {
    id: "prod-16",
    name: "Takeaway Lids 12oz (100pk)",
    sku: "PKG-002",
    categoryId: "cat-packaging",
    supplierId: "sup-4",
    image: img("paper-cups"),
    costPrice: 6.0,
    sellingPrice: 10.99,
    quantity: 40,
    reorderPoint: 15,
    unit: "pack",
    location: "Back Storage",
    description: "Compostable sip-through lids matched to our 12oz cups.",
  },
  {
    id: "prod-17",
    name: "Vanilla Syrup 750ml",
    sku: "SYR-001",
    categoryId: "cat-syrups",
    supplierId: "sup-1",
    image: img("vanilla-syrup"),
    costPrice: 6.2,
    sellingPrice: 11.5,
    quantity: 5,
    reorderPoint: 12,
    unit: "bottle",
    location: "Main Counter",
    description: "Classic Madagascar vanilla flavoring syrup for espresso drinks.",
  },
  {
    id: "prod-18",
    name: "Caramel Syrup 750ml",
    sku: "SYR-002",
    categoryId: "cat-syrups",
    supplierId: "sup-1",
    image: img("vanilla-syrup"),
    costPrice: 6.2,
    sellingPrice: 11.5,
    quantity: 30,
    reorderPoint: 12,
    unit: "bottle",
    location: "Main Counter",
    description: "Buttery caramel flavoring syrup for espresso drinks and lattes.",
  },
];

const now = new Date("2026-08-21T18:00:00Z");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

export const products: Product[] = seeds.map((seed, index) => ({
  id: seed.id,
  name: seed.name,
  sku: seed.sku,
  barcode: `8${(400000000000 + index * 731).toString().padStart(12, "0")}`,
  description: seed.description,
  categoryId: seed.categoryId,
  supplierId: seed.supplierId,
  images: [seed.image],
  costPrice: seed.costPrice,
  sellingPrice: seed.sellingPrice,
  quantity: seed.quantity,
  reorderPoint: seed.reorderPoint,
  unit: seed.unit,
  location: seed.location,
  createdAt: daysAgo(180 - index * 3),
  updatedAt: daysAgo(index % 6),
}));

export const productVariants: ProductVariant[] = [
  { id: "var-1", productId: "prod-2", name: "Small (12oz)", sku: "BEV-002-S", priceDelta: -0.5, quantity: 40 },
  { id: "var-2", productId: "prod-2", name: "Medium (16oz)", sku: "BEV-002-M", priceDelta: 0, quantity: 35 },
  { id: "var-3", productId: "prod-2", name: "Large (20oz)", sku: "BEV-002-L", priceDelta: 0.75, quantity: 20 },
  { id: "var-4", productId: "prod-11", name: "250g Pouch", sku: "COF-002-250", priceDelta: 0, quantity: 15 },
  { id: "var-5", productId: "prod-11", name: "500g Pouch", sku: "COF-002-500", priceDelta: 11, quantity: 10 },
];

const reasons = {
  increase: ["Purchase order received", "Return from customer", "Inventory recount"],
  decrease: ["Daily sales", "Waste / spoilage", "Staff consumption", "Damaged in storage"],
  transfer: ["Moved to Main Counter", "Moved to Back Storage", "Transferred to Fridge Display"],
};

function seededHistory(product: Product, seedIndex: number): StockMovement[] {
  const entries: StockMovement[] = [];
  let running = product.quantity;
  const count = 4 + (seedIndex % 3);

  for (let i = 0; i < count; i++) {
    const typeRoll = (seedIndex * 7 + i * 13) % 10;
    const type: StockMovement["type"] =
      typeRoll < 2 ? "transfer" : typeRoll < 6 ? "decrease" : "increase";
    const qty = type === "increase" ? 10 + ((seedIndex + i) % 5) * 6 : 3 + ((seedIndex + i) % 4) * 4;

    if (type === "increase") running -= qty;
    else if (type === "decrease") running += qty;

    entries.unshift({
      id: `mv-${product.id}-${i}`,
      productId: product.id,
      type,
      quantity: qty,
      reason: reasons[type][(seedIndex + i) % reasons[type].length]!,
      notes: i === 0 ? "" : "",
      performedBy: ["Jordan Ellis", "Maya Chen", "Sam Rivera"][(seedIndex + i) % 3]!,
      resultingQuantity: Math.max(running, 0),
      fromLocation: type === "transfer" ? "Back Storage" : undefined,
      toLocation: type === "transfer" ? product.location : undefined,
      createdAt: daysAgo(i * 3 + (seedIndex % 3)),
    });
  }

  return entries.reverse();
}

export const stockMovements: StockMovement[] = products.flatMap((product, i) =>
  seededHistory(product, i),
);

export const activityLog: ActivityLogEntry[] = products.flatMap((product, i) => [
  {
    id: `act-${product.id}-1`,
    productId: product.id,
    action: "created",
    description: "Product added to inventory",
    actor: "Jordan Ellis",
    createdAt: product.createdAt,
  },
  {
    id: `act-${product.id}-2`,
    productId: product.id,
    action: "price_updated",
    description: `Selling price updated to $${product.sellingPrice.toFixed(2)}`,
    actor: "Maya Chen",
    createdAt: daysAgo(20 + (i % 10)),
  },
  {
    id: `act-${product.id}-3`,
    productId: product.id,
    action: "stock_adjusted",
    description: "Stock recounted during weekly audit",
    actor: "Sam Rivera",
    createdAt: daysAgo(6 + (i % 4)),
  },
]);

// 14-day stock-in vs stock-out movement totals, for the inventory dashboard chart.
export const stockMovementTrend = Array.from({ length: 14 }).map((_, i) => {
  const dayLabel = new Date(now.getTime() - (13 - i) * 86_400_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const base = 60 + Math.round(Math.sin(i / 2) * 20);
  return {
    date: dayLabel,
    stockIn: base + (i % 4) * 8,
    stockOut: base - 10 + (i % 3) * 12,
  };
});
