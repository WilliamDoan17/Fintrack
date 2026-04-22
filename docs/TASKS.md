# TASKS
Daily log of tasks worked on. One `<details>` block per day, newest on top.

<details>
  <summary>Apr 22, 2026</summary>
  - update the docs for better logging of development ✅
  - tasks for Transferring between budgets feature
    - Define `transfers` table schema (`from_budget_id`, `to_budget_id`, `amount`, `name`, `created_at`) ✅
    - update the server triggers and functions: 
      - implement `apply_balance_delta(p_budget_id uuid, p_delta numeric)` ✅
      - delete old update_budget_balance triggers ✅
      - implement new update_budget_balance_on_transaction() ✅
    - Update SCHEMA.md with transfers table
    - implement create table transfers
    - Write RLS for transfers (`user_id = auth.uid()`, both budget IDs must be owned by user)
    - implment RLS on supabase
    - Write separate trigger functions for transfer balance updates (walk up both budget trees)
    - Update TRIGGERS.md
    - implement `update_budget_balance_on_transfer()`
    - Write `createTransfer` service
    - Update SERVICES.md and TYPES.md
    - Add transfer button to `BudgetDetail`
    - Write `TransferModal` + `TransferCard` components
    - Test
</details>
