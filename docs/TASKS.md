# TASKS
Daily log of tasks worked on. One `<details>` block per day, newest on top.

<details>
  <summary>Apr 30, 2026</summary>

  - Income — Schema, backfill, trigger
    - Add column `is_income` to `budgets` ✅
    - for every user, add a budget named `Income` with `is_income` = `true` ✅
      - function `add_income_budget_to_all_users` (supabase functions) ✅
      - run function ✅
    - Write and activate trigger `on_new_user_create_income_budget` 
  - Income — RLS 
    - Update RLS for `income`
  - Income — Services + Types
    - Update types (`frontend/backend/types/budgets.ts`)
    - Update services (`frontend/backend/services/budgets.ts`)

</details>

<details>
  <summary>Apr 28, 2026</summary>
  
  - Planning and document for future development (`income`) ✅
</details>

<details>
  <summary>Apr 25, 2026</summary>

  - Make TransactionContainer show transactions and transfers ✅
</details>

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
    - Add transfer button to `BudgetDetail` ✅
    - Write useTranfers(budget_id) (hook for getting and updating state) ✅
    - Write `CreateTransferModal` + `TransferCard` components ✅
    - wire `TransferCard` to `TransactionContainer` ✅
    - Write `UpdateTransferModal` + `UpdateTranferButton` and wire ✅
    - Write `DeleteTransferButton` + `DeleteTransferModal` and wire ✅
    - Test
</details>
