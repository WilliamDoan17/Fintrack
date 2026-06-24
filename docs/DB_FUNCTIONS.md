# DB FUNCTIONS
This document describes the PostgreSQL functions in Fintrack's Supabase database.

---

## Conventions
- Functions exposed to the frontend are called via Supabase RPC (`supabase.rpc(fn_name, params)`)

---

## RPC Functions

### `get_budget_transactions(p_budget_id uuid)`

**Returns:** `SETOF transactions`

**What it does:**
Recursively fetches all transactions belonging to the given budget and all of its descendant sub-budgets. Uses a recursive CTE to walk down the budget tree, then joins against the `transactions` table.

**Used by:** `getBudgetTransactions(budget_id)` service

---

## Trigger Functions

### `create_income_budget_for_new_user()`

**Returns:** `trigger`

**What it does:**
Automatically creates an income budget for a user upon signup. Inserts a row into `budgets` with `name = 'Income'`, `is_income = true`, `parent_id = null`, and `balance = 0`, linked to the new user's ID.

**Used by triggers:**
- `on_new_user_create_income_budget` — fires `AFTER INSERT ON auth.users`

> To be removed in AM-3j when `is_income` budgets are dropped entirely.
