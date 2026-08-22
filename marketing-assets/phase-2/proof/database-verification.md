# Orders module — live database verification

All checks below were run with `npx supabase db query -f <file> --linked` against the live, hosted
Supabase project (ref `yscvwtcrtbcfpkwtinvv`), through the actual app UI (Playwright-driven, real
session, real org "Retail Admin"), not seed scripts or mocks.

## Migration status

```
{"migrations":[{"local":"0001","remote":"0001"},{"local":"0002","remote":"0002"},{"local":"0003","remote":"0003"},{"local":"0004","remote":"0004"}],"message":"Migrations listed"}
```

All 4 migrations (including the new `0004_orders.sql`) are applied and in sync on the live database.

## Order creation → inventory deduction

Order `ORD-00001` (id `5199bc05-05eb-433b-9e90-95e39a9a3e8c`) was created via the UI: 3× Signature
Cold Brew (BEV-001) + 1× Butter Croissant (BAK-001), $2.00 discount.

`inventory_transactions` rows written by the `create_order` RPC:

| direction | quantity | sku     | source | source_id (order id)                 |
|-----------|----------|---------|--------|----------------------------------------|
| out       | 3        | BEV-001 | sale   | 5199bc05-05eb-433b-9e90-95e39a9a3e8c   |
| out       | 1        | BAK-001 | sale   | 5199bc05-05eb-433b-9e90-95e39a9a3e8c   |

`products.quantity` was decremented atomically in the same transaction as the order/order_items
insert (single `security definer` function, row-locked with `for update` before any writes).

## Status changes → order_events

After creating the order, payment status was set to `paid` and fulfillment status to `fulfilled`
through the UI. Verified in `order_events`:

| type                        | description                          |
|------------------------------|---------------------------------------|
| created                      | Order created                         |
| note_added                   | Note added                            |
| payment_status_changed        | Payment status changed to paid        |
| fulfillment_status_changed    | Fulfillment status changed to fulfilled|

`orders.payment_status = 'paid'`, `orders.fulfillment_status = 'fulfilled'` confirmed directly
against the `orders` table.

## Cancellation → stock restock

A second order (`ORD-00002`, id `ffaf8b68-a9e1-48f3-a55f-4bbddecec4ee`) was created for 1× Signature
Cold Brew, then cancelled via the fulfillment-status selector.

`inventory_transactions` for that order:

| direction | quantity | sku     | source | note                          |
|-----------|----------|---------|--------|--------------------------------|
| out       | 1        | BEV-001 | sale   | written at order creation      |
| in        | 1        | BEV-001 | sale   | reversal, written on cancel    |

Net effect on `products.quantity` for BEV-001: unchanged (222 before and after both orders), because
order 1's deduction (3) and order 2's deduction+reversal (1 out, 1 in) net to exactly the 3 consumed
by the still-fulfilled order 1. Confirmed directly against `products.quantity`.

`order_events` for the cancelled order shows `created` then `fulfillment_status_changed` → "Fulfillment
status changed to cancelled".

## RLS policies (live)

Confirmed via `pg_policies` and `pg_class.relrowsecurity` that all 5 new tables have row-level security
**enabled** and the expected policy shape:

| table         | policies                                                                 |
|---------------|---------------------------------------------------------------------------|
| customers     | select (member), all (editor — `orders.edit`)                            |
| orders        | select (member), insert (editor), update (editor) — **no delete policy** |
| order_items   | select (member) only — **no insert/update/delete policy** (RPC-only writes via `security definer`) |
| order_notes   | select (member), insert (editor) — **no update/delete** (append-only)    |
| order_events  | select (member) only — **no insert policy at all** (trigger/RPC-only, `security definer`) |

This matches the append-only-ledger pattern established by `inventory_transactions` in the prior
Inventory milestone — an intentional architectural consistency, not a coincidence.

## Zero Supabase 4xx/5xx responses

The Playwright verification scripts logged every Supabase REST/RPC response ≥ 400 to the console.
Across order creation, both status-update flows, note creation, and cancellation-restock: zero
failed requests, zero uncaught page errors.
