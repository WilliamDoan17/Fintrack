# TRIGGERS

This document describes the PostgreSQL triggers in Fintrack's Supabase database.

---

## Conventions

- Triggers call dedicated trigger functions (one function per responsibility)

---

## Timestamp Update Trigger

**Function:** `update_timestamp_on_update()`

Keeps `updated_at` current on every row mutation without requiring callers to pass the value.

**Operation handling:**

- **On UPDATE**: sets `NEW.updated_at = now()` and returns `NEW`

**Trigger:**

- `on_update` — fires `BEFORE UPDATE` on `budgets`, `transactions`, `transfers`, `incomes`, `allocations`, FOR EACH ROW
