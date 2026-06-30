# DB FUNCTIONS
This document describes the PostgreSQL functions in Fintrack's Supabase database.

---

## Conventions
- Functions exposed to the frontend are called via Supabase RPC (`supabase.rpc(fn_name, params)`)

---

## Trigger Functions

### `update_timestamp_on_update()`

**Returns:** `trigger`

**What it does:**
Sets `NEW.updated_at = now()` and returns `NEW`. Attached as a `BEFORE UPDATE` trigger on every table so that `updated_at` is always current without the caller needing to pass it.

**Used by triggers:**
- `on_update` — fires `BEFORE UPDATE` on `budgets`, `transactions`, `transfers`, `incomes`, `allocations`

---

## RPC Functions

### `get_budget_transactions(p_budget_id uuid)`

**Returns:** `SETOF transactions`

**What it does:**
Recursively fetches all transactions belonging to the given budget and all of its descendant sub-budgets. Uses a recursive CTE to walk down the budget tree, then joins against the `transactions` table.

**Used by:** `getBudgetTransactions(budget_id)` service

---

