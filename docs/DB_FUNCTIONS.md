# DB FUNCTIONS
This document describes the PostgreSQL functions in Fintrack's Supabase database.

---

## Conventions
- Functions exposed to the frontend are called via Supabase RPC (`supabase.rpc(fn_name, params)`)
---

## Helper Functions

### `apply_balance_delta(p_budget_id uuid, p_delta numeric)`

**Returns:** `void`

**What it does:**
Uses a recursive CTE to collect `p_budget_id` and all its ancestors, then applies `p_delta` to each budget's `balance` in one UPDATE. Used internally by all balance-update trigger functions — not called directly from the frontend.

**Used by:** `update_budget_balance_on_transaction()`, `update_budget_balance_on_transfer()`

---

## Server Functions

Functions run directly in Supabase (not called from the frontend). Used for maintenance, backfills, or one-time repairs.

### `update_all_budgets_balance()`

**Returns:** `void`

**What it does:**
Full recalculation of every budget's balance from scratch. Runs in three steps:

1. **Direct balances** — computes each budget's own transaction total (sum of `add` minus `withdraw`) using only transactions directly attached to that budget
2. **Tree expansion** — recursively expands every budget to all its descendants (including itself) via a recursive CTE on `parent_id`
3. **Rollup** — for each ancestor, sums the direct balances of all its descendants and updates `budgets.balance`

**When to run:** after a data migration, bulk import, or any operation that bypasses the incremental triggers. Not needed during normal app operation — triggers keep balances up to date incrementally.

---

## RPC Functions

### `get_budget_transactions(p_budget_id uuid)`

**Returns:** `SETOF transactions`

**What it does:**
Recursively fetches all transactions belonging to the given budget and all of its descendant sub-budgets. Uses a recursive CTE to walk down the budget tree, then joins against the `transactions` table.

**Used by:** `getBudgetTransactions(budget_id)` service

---

## Trigger Functions

Trigger functions are automatically invoked by database events (INSERT, UPDATE, DELETE) and are responsible for maintaining data integrity — specifically keeping budget balances synchronized with transactions and transfers.

### `update_budget_balance_on_transaction()`

**Returns:** `trigger`

**What it does:**
Maintains budget balances whenever transactions are created, deleted, or modified in any way that affects balance (amount, type, or budget assignment).

**Balance effect calculation:** For any transaction, the balance effect is:
- `+amount` when `type = 'add'` (increases budget balance)
- `-amount` when `type = 'withdraw'` (decreases budget balance)

**Operation handling:**

- **On INSERT:** calculates the effect from `type` and `amount`, then calls `apply_balance_delta()` to apply it to the transaction's budget and all its ancestors

- **On DELETE:** calculates the effect from the deleted transaction, then calls `apply_balance_delta()` with the opposite sign to reverse it from the budget tree

- **On UPDATE:** detects which balance-affecting fields changed (`amount`, `type`, or `budget_id`) and applies the appropriate correction:
  - **If budget_id changed:** removes the old effect from the original budget tree, then applies the new effect to the new budget tree
  - **If only amount and/or type changed (same budget):** calculates the net change (new_effect - old_effect) and applies it to the same budget tree
  - **If only name or other metadata changed:** no action taken (balance unaffected)

**Used by trigger:**
- `on_transaction_change` — fires `AFTER INSERT OR DELETE OR UPDATE ON transactions`


---

### `update_budget_balance_on_transfer()`

**Returns:** `trigger`

**What it does:**
Maintains budget balances whenever money is transferred between budgets.

- **On INSERT:** applies a negative delta (withdrawal) to the source budget and a positive delta (deposit) to the destination budget — effectively moving the amount from one budget tree to another
- **On DELETE:** reverses the operation — applies positive delta back to source, negative delta back to destination — restoring the original balances

**Used by trigger:**
- `on_transfer_change` — fires `AFTER INSERT OR DELETE ON transfers`

**Note:** Unlike transactions, transfers are immutable by design — they cannot be updated, only inserted or deleted. This simplifies the trigger logic since there's no UPDATE case to handle.

