# TRIGGERS
This document describes the PostgreSQL triggers in Fintrack's Supabase database.

---

## Conventions
- Triggers call dedicated trigger functions (one function per responsibility)
- Balance updates always walk up the full ancestor tree recursively via `apply_balance_delta()` (see DB_FUNCTIONS.md)
- Triggers are the sole source of truth for budget balance — never update balance manually

---

## Transaction Balance Trigger

**Function:** `update_budget_balance_on_transaction()`

A single trigger handles all balance-affecting changes to transactions (INSERT, DELETE, and UPDATE of amount, type, or budget_id).

**Operation handling:**

- **On INSERT:** computes delta from `type` and `amount` (`+amount` for 'add', `-amount` for 'withdraw'), calls `apply_balance_delta(NEW.budget_id, delta)`

- **On DELETE:** reverses the effect — computes delta from `OLD` values, calls `apply_balance_delta(OLD.budget_id, -delta)`

- **On UPDATE:** intelligently handles three possible balance-affecting changes:
  - **Budget moved** (`budget_id` changed): removes old effect from original budget tree, applies new effect to new budget tree
  - **Amount or type changed** (same budget): calculates net change (new_effect - old_effect) and applies it to the same budget tree
  - **Metadata only** (name, created_at, etc.): no action taken

**Trigger:**
- `on_transaction_change` — fires `AFTER INSERT OR DELETE OR UPDATE ON transactions`

**Why one trigger instead of multiple?** A single trigger ensures all balance-affecting changes (amount, type, budget_id) are caught. Multiple triggers with `WHEN` clauses would miss updates to amount or type.

---

## Transfer Balance Trigger

**Function:** `update_budget_balance_on_transfer()`

**Operation handling:**

- **On INSERT:** applies withdrawal from source and deposit to destination — calls `apply_balance_delta(from_budget_id, -amount)` then `apply_balance_delta(to_budget_id, +amount)`

- **On DELETE:** reverses both operations — calls `apply_balance_delta(from_budget_id, +amount)` then `apply_balance_delta(to_budget_id, -amount)`

**Trigger:**
- `on_transfer_change` — fires `AFTER INSERT OR DELETE ON transfers`

**Note:** Transfers are immutable by design — no UPDATE trigger exists. To modify a transfer, users must delete and recreate it. This simplifies the trigger logic and maintains audit trail integrity.
