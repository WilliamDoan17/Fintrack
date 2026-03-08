# POLICIES
This document defines the Row Level Security (RLS) policies for Fintrack's Supabase database.

## Conventions
- All tables have RLS enabled
- A user can only perform operations on their own data via `user_id = auth.uid()`
- `USING` checks the existing row before an operation
- `WITH CHECK` checks the resulting row after an operation

## budgets

- **SELECT**: `user_id = auth.uid()`
- **INSERT**:
  - `user_id = auth.uid()`
  - `parent_id` is null OR the parent budget is owned by `auth.uid()`
- **UPDATE**:
  - `USING`: `user_id = auth.uid()`
  - `WITH CHECK`: `user_id = auth.uid()`
- **DELETE**: `user_id = auth.uid()`

## transactions

- **SELECT**: `user_id = auth.uid()`
- **INSERT**:
  - `user_id = auth.uid()`
  - the referenced `budget_id` is owned by `auth.uid()`
- **UPDATE**:
  - `USING`: `user_id = auth.uid()`
  - `WITH CHECK`: `user_id = auth.uid()` AND the new `budget_id` is owned by `auth.uid()`
- **DELETE**: `user_id = auth.uid()`
