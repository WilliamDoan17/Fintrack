# TRIGGERS

This document describes the PostgreSQL triggers in Fintrack's Supabase database.

---

## Conventions

- Triggers call dedicated trigger functions (one function per responsibility)

---

## Income Budget Creation Trigger

**Function:** `create_income_budget_for_new_user()`

Automatically creates a single income budget for every new user upon signup.

**Operation handling:**

- **On INSERT (auth.users):** inserts a new budget row with `is_income = true`, `name = 'Income'`, `parent_id = null`, and `balance = 0` for the new user

**Trigger:**

- `on_new_user_create_income_budget` — fires `AFTER INSERT ON auth.users`

**Why a trigger instead of the app layer?** Guarantees every user has an income budget regardless of signup method (email, OAuth, etc.) and removes any risk of it being skipped.

> To be removed in AM-3j when `is_income` budgets are dropped entirely.

---

## Update Trigger (AM-4)

**Function**: `on_update()`

**Handling**:

- **On UPDATE**: fires — updates the `updated_at` column of the row to `now()`
