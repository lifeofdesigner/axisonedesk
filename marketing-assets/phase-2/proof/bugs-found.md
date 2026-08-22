# Bugs found and fixed during Phase 2 (Orders)

Three issues were caught during implementation and verification. All three were caught before or
during live testing — none shipped to the final state.

## 1. `update_order_status` RPC missing `security definer`

**Where:** `supabase/migrations/0004_orders.sql`, `update_order_status()` function.

**Root cause:** The function needs to restock inventory (update `products.quantity`, insert
reversal rows into `inventory_transactions`) when an order transitions to `cancelled`. Both of
those writes are gated by RLS policies that don't grant a plain authenticated user direct write
access — `inventory_transactions` has zero client insert policy at all, and `products` updates
require the `inventory.edit` permission, not `orders.edit`. Without `security definer`, the
function would have executed as the calling user and failed with a permission-denied error the
first time a cancellation tried to restock.

**Fix:** Added `security definer set search_path = public` plus an explicit
`if not has_permission(p_org_id, 'orders.edit') then raise exception ... end if;` check at the top
of the function body (mirroring the identical pattern already used in `create_order`), so the
function's elevated privilege is deliberately scoped and re-validated rather than silently
inherited.

**Why it mattered:** Caught before the migration was applied to the live database — but had it
shipped as written, every cancellation would have failed at the exact moment a merchant needed
stock restored, with a confusing RLS error instead of a clear failure.

## 2. Cross-module import violating the architecture boundary

**Where:** `src/modules/orders/hooks.ts` (initial draft).

**Root cause:** `useCreateOrder`/`useUpdateOrderStatus` need to invalidate Inventory's cached
product/movement data after an order changes stock. The first draft did this by importing
`inventoryKeys` from `@/modules/inventory/hooks` directly — a straight violation of
ARCHITECTURE.md §2 ("a module may depend on core and shared, never on another module directly").

**Fix:** Removed the import; replaced both call sites with literal query-key array prefixes
(`["inventory", "products"]`, `["inventory", "movement-trend"]`) passed straight to
`queryClient.invalidateQueries`. This achieves the same cache invalidation through the shared
TanStack Query cache — a legitimate shared resource — without a code-level dependency between
modules. The same reasoning was applied to product selection: `orders/api.ts` queries the
`products` table directly instead of importing Inventory's `ProductCombobox`/hooks, since the
`products` table is shared data, not shared code.

**Why it mattered:** Caught by self-review before typecheck/lint ran, so it never reached a commit.
Documented here because it's the kind of violation that's easy to reintroduce in a future module —
the fix pattern (invalidate by literal key prefix, read shared tables directly) is now the
established precedent for any future cross-module cache/data need.

## 3. Playwright selector bug during E2E verification (test-only, not app code)

**Where:** `orders_status_check.mjs` (live-verification script), not shipped application code.

**Root cause:** The script tried to select the "Paid" option in a payment-status `<Select>` using
`[role="option"]:has-text("Paid")`. Because `has-text` does substring matching, this locator also
matched the "Unpaid" option (which appears first in the list and contains "Paid" as a substring),
so the click landed on the already-selected "Unpaid" item and silently no-opped — no error, no
mutation call, no toast. The first verification pass consequently and incorrectly suggested the
status-update feature might be broken (no `order_events` rows were written).

**Fix:** Switched to `page.getByRole("option", { name: "Paid", exact: true })`, which matches the
accessible name exactly instead of doing substring containment. Re-ran verification and confirmed
the feature was correct all along — the bug was entirely in the test script's selector, not the
product code. Documented here in the interest of "be honest, don't fabricate verification": the
first verification run genuinely failed, and it's worth recording why, rather than quietly
re-running until green without explanation.
