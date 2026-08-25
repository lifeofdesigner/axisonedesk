---
title: Reference Library
last_updated: 2026-08-25
---

# 18_REFERENCE

Searchable, list-form reference material — the "look it up fast" layer. Each doc here is derived from the actual code/migrations (or explicitly marked Planned where the underlying system doesn't exist yet); none of it duplicates the narrative documentation in `docs/01_PRODUCT/` … `docs/15_DEVELOPER/`, it indexes it.

## Built today (derived from real code)

- [PERMISSIONS_MATRIX.md](PERMISSIONS_MATRIX.md)
- [ROLES_MATRIX.md](ROLES_MATRIX.md)
- [ROUTE_REGISTRY.md](ROUTE_REGISTRY.md)
- [API_REGISTRY.md](API_REGISTRY.md)
- [RPC_REGISTRY.md](RPC_REGISTRY.md)
- [RLS_POLICY_REGISTRY.md](RLS_POLICY_REGISTRY.md)
- [STORAGE_BUCKETS.md](STORAGE_BUCKETS.md)
- [FEATURE_FLAG_REGISTRY.md](FEATURE_FLAG_REGISTRY.md)
- [NOTIFICATION_REGISTRY.md](NOTIFICATION_REGISTRY.md)
- [WEBHOOK_REGISTRY.md](WEBHOOK_REGISTRY.md)
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)
- [BUILD_SCRIPTS.md](BUILD_SCRIPTS.md)
- [DEPENDENCIES.md](DEPENDENCIES.md)
- [CONFIGURATION_FILES.md](CONFIGURATION_FILES.md)
- [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) — pointer, see [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)
- [DATABASE_TABLES.md](DATABASE_TABLES.md) — pointer, see [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)
- [THIRD_PARTY_SERVICES.md](THIRD_PARTY_SERVICES.md) — pointer, see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)

## Planned registries (system doesn't exist yet — spec only)

- [MODULE_REGISTRY.md](MODULE_REGISTRY.md)
- [INDUSTRY_REGISTRY.md](INDUSTRY_REGISTRY.md)
- [ORGANIZATION_TYPE_REGISTRY.md](ORGANIZATION_TYPE_REGISTRY.md)
- [PROVIDER_REGISTRY.md](PROVIDER_REGISTRY.md) — pointer, see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)
- [PAYMENT_REGISTRY.md](PAYMENT_REGISTRY.md) — pointer, see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md)
- [AI_REGISTRY.md](AI_REGISTRY.md) — pointer, see [docs/06_AI/INDEX.md](../06_AI/INDEX.md)

None of the "Planned" docs above invent implementation detail — they either point to the authoritative playbook/ADOS doc or define the target shape without claiming it's built.
