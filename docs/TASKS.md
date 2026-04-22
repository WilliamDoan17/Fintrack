# TASKS
Daily log of tasks worked on. One `<details>` block per day, newest on top.

<details>
  <summary>Apr 22, 2026</summary>
  - update the docs for better logging of development ✅
  - tasks for Transferring between budgets feature
    - Define `transfers` table schema (`id`, `user_id`,`from_budget_id`,`to_budget_id`, `amount`, `name`, `created_at`) ✅
    - update the server triggers and functions: 
      - implement `apply_balance_delta(p_budget_id uuid, p_delta numeric)` ✅
      - delete old update_budget_balance triggers ✅
      - implement new update_budget_balance_on_transaction() ✅
    - Update SCHEMA.md with transfers table ✅
    - implement create table transfers ✅
    - Write RLS for transfers (both budget IDs must be owned by user) ✅
    - implement RLS on supabase ✅
    - Update TRIGGERS.md ✅
    - Update DB_FUNCTIONS.md ✅
    - implement `update_budget_balance_on_transfer()` ✅
    - implement `on_transfer_insert_delete` & `on_transfers_update` ✅
    - Update SERVICES.md and TYPES.md ✅
    - write transfer types ✅
    - write transfer services ✅
    - Add transfer button to `BudgetDetail`
    - Write `TransferModal` + `TransferCard` components
    - Test
</details>
