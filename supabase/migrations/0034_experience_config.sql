-- Industry Module Engine Phase 4, slice 1: Dynamic Experience Engine
-- foundation. Per docs/00_ADOS/AI_INSTRUCTIONS.md's no-duplicate-registry
-- rule, this does NOT create separate kpi/quick-action/empty-state/report
-- tables — it adds ONE jsonb column to the existing organization_types
-- registry (0027_industry_registry.sql), extensible for every config shape
-- this phase and future ones need, without another migration per concept.
--
-- Scope, deliberately bounded — see ADR-011 (docs/00_ADOS/DECISIONS.md) for
-- full reasoning on everything NOT built this slice (dashboard layout/widget
-- rendering, KPI value computation, Reports Engine, Search Engine, AI
-- Experience, Demo Data Engine, Onboarding Tasks Engine, Platform Owner
-- config UI). What IS seeded here: quickActions and emptyStates for the 6
-- industries the user gave concrete real examples for (restaurant, hotel,
-- retail, wholesale [mapped from "Warehouse" per the same reasoning as
-- ADR-009's business_type mapping], manufacturing, healthcare) — content
-- taken directly from those examples, not invented. kpis are stored as
-- DEFINITIONS (key/label only, no computed values) for the same 6
-- industries; nothing renders them yet (see ADR-011 on why not).
--
-- The other 8 seeded organization_types (wholesale is used for "Warehouse"
-- above but construction/pharmacy/logistics/agriculture/education/
-- professional-services/e-commerce/custom remain) get NULL
-- experience_config — the rendering layer must treat that as "no
-- industry-specific experience yet," never as an error, and never
-- synthesize a plausible-sounding default.

alter table public.organization_types
  add column experience_config jsonb;

update public.organization_types set experience_config = '{
  "kpis": [
    {"key": "todays_revenue", "label": "Today''s Revenue"},
    {"key": "active_tables", "label": "Active Tables"},
    {"key": "kitchen_orders", "label": "Kitchen Orders"},
    {"key": "reservations", "label": "Reservations"},
    {"key": "food_cost", "label": "Food Cost"},
    {"key": "low_ingredients", "label": "Low Ingredients"}
  ],
  "quickActions": [
    {"key": "new_order", "label": "New Order", "route": "/orders/new"},
    {"key": "reservation", "label": "Reservation", "route": "/bookings"},
    {"key": "kitchen", "label": "Kitchen", "route": "/orders"},
    {"key": "menu", "label": "Menu", "route": "/inventory/products"}
  ],
  "emptyStates": {
    "inventory": "Create your first menu item."
  }
}'::jsonb
where key = 'restaurant';

update public.organization_types set experience_config = '{
  "kpis": [
    {"key": "occupancy_rate", "label": "Occupancy Rate"},
    {"key": "check_ins", "label": "Check-ins"},
    {"key": "check_outs", "label": "Check-outs"},
    {"key": "housekeeping", "label": "Housekeeping"},
    {"key": "maintenance", "label": "Maintenance"},
    {"key": "revenue", "label": "Revenue"}
  ],
  "quickActions": [
    {"key": "check_in", "label": "Check-in", "route": "/bookings"},
    {"key": "reservation", "label": "Reservation", "route": "/bookings"},
    {"key": "housekeeping", "label": "Housekeeping", "route": "/bookings"},
    {"key": "maintenance", "label": "Maintenance", "route": "/bookings"}
  ],
  "emptyStates": {}
}'::jsonb
where key = 'hotel';

update public.organization_types set experience_config = '{
  "kpis": [
    {"key": "sales", "label": "Sales"},
    {"key": "orders", "label": "Orders"},
    {"key": "customers", "label": "Customers"},
    {"key": "returns", "label": "Returns"},
    {"key": "inventory_value", "label": "Inventory Value"}
  ],
  "quickActions": [
    {"key": "new_sale", "label": "New Sale", "route": "/orders/new"},
    {"key": "customer", "label": "Customer", "route": "/crm/customers"},
    {"key": "inventory", "label": "Inventory", "route": "/inventory/products"},
    {"key": "purchase_order", "label": "Purchase Order", "route": "/purchasing/new"}
  ],
  "emptyStates": {
    "inventory": "Add your first product."
  }
}'::jsonb
where key = 'retail';

update public.organization_types set experience_config = '{
  "kpis": [
    {"key": "receiving", "label": "Receiving"},
    {"key": "picking", "label": "Picking"},
    {"key": "shipping", "label": "Shipping"},
    {"key": "inventory_accuracy", "label": "Inventory Accuracy"},
    {"key": "stock_value", "label": "Stock Value"}
  ],
  "quickActions": [
    {"key": "receive_shipment", "label": "Receive Shipment", "route": "/purchasing/new"},
    {"key": "pick_order", "label": "Pick Order", "route": "/orders"},
    {"key": "cycle_count", "label": "Cycle Count", "route": "/inventory/adjustments"}
  ],
  "emptyStates": {
    "inventory": "Receive your first shipment."
  }
}'::jsonb
where key = 'wholesale';

update public.organization_types set experience_config = '{
  "kpis": [
    {"key": "production_orders", "label": "Production Orders"},
    {"key": "machine_utilization", "label": "Machine Utilization"},
    {"key": "work_orders", "label": "Work Orders"},
    {"key": "raw_materials", "label": "Raw Materials"},
    {"key": "quality_control", "label": "Quality Control"}
  ],
  "quickActions": [],
  "emptyStates": {}
}'::jsonb
where key = 'manufacturing';

update public.organization_types set experience_config = '{
  "kpis": [
    {"key": "appointments", "label": "Appointments"},
    {"key": "patients", "label": "Patients"},
    {"key": "doctors", "label": "Doctors"},
    {"key": "revenue", "label": "Revenue"},
    {"key": "pending_followups", "label": "Pending Follow-ups"}
  ],
  "quickActions": [],
  "emptyStates": {
    "bookings": "Schedule your first appointment."
  }
}'::jsonb
where key = 'healthcare';
