-- Atomic stock adjustment RPC.
--
-- The original client code did this as 5 sequential round trips (read user,
-- read product, insert adjustment, update product, read images) — a partial
-- failure (network hiccup, client navigating away) between the adjustment
-- insert and the product update left the ledger and the product's quantity
-- inconsistent. ARCHITECTURE.md §16 already specifies that multi-step
-- transactional operations belong in a Postgres function called via
-- supabase.rpc(), not assembled client-side; this was a deviation from that,
-- now corrected.
--
-- Not security definer: runs as the calling (authenticated) role, so the
-- existing RLS policies on stock_adjustments (inventory.adjust_stock) and
-- products (inventory.edit) still gate it exactly as before.
create or replace function public.adjust_stock(
  p_org_id uuid,
  p_product_id uuid,
  p_type public.stock_adjustment_type,
  p_quantity integer,
  p_reason text,
  p_notes text default '',
  p_to_location text default null
)
returns public.products
language plpgsql
as $$
declare
  v_product public.products;
  v_delta integer;
  v_resulting integer;
begin
  select * into v_product
  from public.products
  where org_id = p_org_id and id = p_product_id and deleted_at is null
  for update;

  if not found then
    raise exception 'Product not found';
  end if;

  v_delta := case p_type
    when 'increase' then p_quantity
    when 'decrease' then -p_quantity
    else 0
  end;
  v_resulting := greatest(v_product.quantity + v_delta, 0);

  insert into public.stock_adjustments (
    org_id, product_id, type, quantity, reason, notes, performed_by,
    resulting_quantity, from_location, to_location
  ) values (
    p_org_id, p_product_id, p_type, p_quantity, p_reason, p_notes, auth.uid(),
    v_resulting,
    case when p_type = 'transfer' then v_product.location else null end,
    case when p_type = 'transfer' then p_to_location else null end
  );

  update public.products
  set
    quantity = v_resulting,
    location = case
      when p_type = 'transfer' then coalesce(p_to_location, v_product.location)
      else v_product.location
    end
  where id = p_product_id
  returning * into v_product;

  return v_product;
end;
$$;

grant execute on function public.adjust_stock(
  uuid, uuid, public.stock_adjustment_type, integer, text, text, text
) to authenticated;
