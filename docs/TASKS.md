# TASKS

Daily log of tasks worked on. One `<details>` block per day, newest on top.

<details>
  <summary>Jun 08, 2026</summary>

- [x] refactor to use `tanstack-query`
  - [x] open branch `refactor/tanstack-query`
  - [x] rewrite plan (this entry)
  - [x] update related docs (`HOOKS.md`)
    - commit: `docs: update hooks for tanstack-query refactor`
  - [x] implement — one commit per domain:
    - `feat: tanstack-query setup` ✅
    - `feat: tanstack-query for auth` ✅
    - `feat: tanstack-query for budgets` ✅
    - `feat: tanstack-query for transactions` ✅
    - `feat: tanstack-query for transfers` ✅
  - [x] fix ts import errors — none (tsc clean)
  - [x] push, open PR, confirm merge, delete branch

  ***

  **Query keys**

  | hook                           | key                              |
  | ------------------------------ | -------------------------------- |
  | `useSpendingBudgets(parentId)` | `['spending-budgets', parentId]` |
  | `useBudget(id)`                | `['budget', id]`                 |
  | `useIncomeBudget()`            | `['income-budget']`              |
  | `useSpendingBudgetStructure()` | `['spending-budget-structure']`  |
  | `useTransactions(budgetId)`    | `['transactions', budgetId]`     |
  | `useTransfers(budgetId)`       | `['transfers', budgetId]`        |

  **Invalidation strategy — broad prefix invalidation**

  Because budget balance propagates up the tree (via `apply_balance_delta`), and because budget moves change parent relationships, surgical per-key invalidation is fragile. All mutation hooks use broad prefix invalidation:
  - Budget mutations invalidate: `['spending-budgets']`, `['budget']`, `['income-budget']`, `['spending-budget-structure']`
  - Transaction mutations invalidate: `['transactions']`, `['budget']`, `['spending-budgets']`
  - Transfer mutations invalidate: `['transfers']`, `['budget']`, `['spending-budgets']`

  **Naming decisions**
  - Mutation hooks follow service verbs: `useCreateBudget`, `useUpdateBudget`, `useDeleteBudget`, `useCreateTransaction`, `useUpdateTransaction`, `useDeleteTransaction`, `useCreateTransfer`, `useUpdateTransfer`, `useDeleteTransfer`
  - UI component names are unchanged (`AddTransactionModal`, `CreateTransferModal`, etc.)

  **Hook signatures**

  `hooks/auth.ts`
  - `useAuth()` → `{ user, loading, error }` — no change; uses Supabase auth state subscription

  `hooks/budgets.ts`
  - `useSpendingBudgets(parentId: string | null)` → `{ budgets, isLoading, error }` — `parentId = null` calls `getRootSpendingBudgets()`, else `getChildBudgets(parentId)`
  - `useBudget(id: string | null)` → `{ budget, isLoading, error }` — fetches a single budget; query disabled when `id` is null
  - `useIncomeBudget()` → `{ budget, isLoading, error }`
  - `useSpendingBudgetStructure()` → `{ structure, isLoading, error }`
  - `useCreateBudget()` → `UseMutationResult` — calls `createBudget`
  - `useUpdateBudget()` → `UseMutationResult` — calls `updateBudget`
  - `useDeleteBudget()` → `UseMutationResult` — calls `deleteBudget`

  `hooks/transactions.ts`
  - `useTransactions(budgetId: string | null)` → `{ transactions, isLoading, error }` — `budgetId = null` calls `getAllTransactions()`, else `getBudgetTransactions(budgetId)`
  - `useCreateTransaction()` → `UseMutationResult`
  - `useUpdateTransaction()` → `UseMutationResult`
  - `useDeleteTransaction()` → `UseMutationResult`

  `hooks/transfers.ts`
  - `useTransfers(budgetId: string | null)` → `{ transfers, isLoading, error }` — `budgetId = null` calls `getAllTransfers()`, else `getBudgetTransfers(budgetId)`
  - `useCreateTransfer()` → `UseMutationResult`
  - `useUpdateTransfer()` → `UseMutationResult`
  - `useDeleteTransfer()` → `UseMutationResult`

  **Component blast radius**

  Mutation hooks handle invalidation internally, so `refetch` no longer needs to be prop-drilled. The `onSuccess` prop used by modals to trigger a parent refetch is removed; modals call mutation hooks directly and close via `onClose` on success. Query-result props passed to display components are also removed; those components call hooks internally.

  Components that gain internal mutation hooks (remove service call + `onSuccess`/`refetch` prop):
  - `CreateBudgetModal` — remove `spendingBudgetQuery` prop; use `useCreateBudget()`
  - `AddTransactionModal` — remove `transactionQuery` prop; use `useCreateTransaction()`
  - `UpdateTransactionModal` — remove `onSuccess` prop; use `useUpdateTransaction()`
  - `DeleteTransactionConfirmModal` — remove `onSuccess` prop; use `useDeleteTransaction()`
  - `MoveTransactionModal` — remove `onSuccess` prop; use `useUpdateTransaction()`
  - `UpdateBudgetNameInput` — remove `onSuccess` prop; use `useUpdateBudget()`
  - `MoveBudgetModal` — remove `onSuccess` prop; use `useUpdateBudget()`
  - `DeleteBudgetConfirmModal` — remove `onSuccess` prop; use `useDeleteBudget()`
  - `CreateTransferModal` — remove `onSuccess` prop; use `useCreateTransfer()`
  - `UpdateTransferModal` — remove `onSuccess` prop; use `useUpdateTransfer()`
  - `DeleteTransferConfirmModal` — remove `onSuccess` prop; use `useDeleteTransfer()`

  Components that become self-sufficient (remove query-result props):
  - `SpendingBudgetContainer` — remove `spendingBudgetQuery` prop; call `useSpendingBudgets(parentId)` internally (receives only `parentId`)
  - `BudgetContainer` — remove `spendingBudgetQuery` prop; call `useSpendingBudgets(parentId)` internally
  - `BalanceSummary` — remove `transactionQuery`/`transferQuery` props; call `useTransactions(budgetId)` and `useTransfers(budgetId)` internally
  - `TransactionContainer` — remove `transactionQuery`/`transferQuery`/`spendingBudgetQuery` props; call hooks internally

  Pages that stop prop-drilling:
  - `Dashboard` — remove all query variable declarations; components self-fetch
  - `BudgetDetail` — remove `spendingBudgetQuery`, `transactionQuery`, `transferQuery`; keep `useBudget(budgetId)` for page-level budget info
  - `IncomeBudgetDetail` / `IncomeBudgetDetailContent` — remove `transactionQuery`, `transferQuery`
      </details>

<details>
  <summary>May 14, 2026</summary>

- Rename `budgetQuery` → `spendingBudgetQuery` across all components ✅
  - `SpendingBudgetContainer`, `BudgetContainer`, `CreateBudgetModal`, `Dashboard`, `BudgetDetail`
  - `TransactionContainer`: renamed + made optional (only needed for spending budget move refetch)
- Merge `feature/income-budget` → `main` (PR #2) ✅
- Fix flickering content on `/income` ✅
  - Root cause: `useTransactions(null)` fires on first render, then re-fires with real budget ID once `useIncomeBudget` resolves — two loading phases cause a flicker
  - Fix: split `IncomeBudgetDetail` into loader shell + `IncomeBudgetDetailContent` — dependent queries only mount after budget ID is ready
- Refactor UI (PR #3) ✅
  - Dashboard redesigned as financial overview:
    - Summary row: `BalanceSummary` + `IncomeBudgetCard` side by side at equal height
    - Recent Transactions full-width below
    - Spending Budgets full-width at bottom
  - `IncomeBudgetCard`: compact fixed width (`md:w-56`), budget name as small gray label top-center, balance centered in remaining space
  - `IncomeBudgetDetail`: layout changed to vertical stack (Balance → Transactions)
- Update docs ✅

</details>

<details>
  <summary>Apr 30, 2026</summary>

- Income — Schema, backfill, trigger
  - Add column `is_income` to `budgets` ✅
  - for every user, add a budget named `Income` with `is_income` = `true` ✅
    - function `add_income_budget_to_all_users` (supabase functions) ✅
    - run function ✅
  - Write and activate trigger `on_new_user_create_income_budget` ✅
    - Write function `create_income_budget_for_new_user` ✅
    - Write trigger ✅
- Income — RLS ✅
  - Update RLS for `income` ✅
- Update on frontend ✅
  - Rename and rewrite budget services to split into spending budgets and income budgets ✅
    - Update `SERVICES.md` ✅
    - `getRootSpendingBudgets` ✅
    - `getIncomeBudget` ✅
    - `getAllSpendingBudgets` ✅
    - `getAllBudgets` ✅

  - Write `HOOKS.md` to keep track of hooks ✅
  - Rename and rewrite hooks ✅
    - Update `HOOKS.md` ✅
    - `useSpendingBudgets` — replaces `useBudgets`, filters `is_income = false` ✅
    - `useIncomeBudget` — fetches the single income budget ✅
    - `useBudgetInfo` — shared between `BudgetDetail` and `IncomeBudgetDetail`, fetches a single budget by id ✅
    - `useSpendingBudgetStructure` — replaces `useBudgetStructure`, excludes income budget from move target tree ✅

  - Write `COMPONENTS.md` to keep track of components ✅
  - Add new page `/income` ✅
  - Add nav links to `Sidebar` (Dashboard, Income) ✅
  - Rename and rewrite components to split into `SpendingBudget` and `IncomeBudget` ✅
    - Update `COMPONENTS.md` ✅
    - `SpendingBudgetContainer` ✅
    - `SpendingBudgetCard` ✅
    - `AddTransactionModal`: pass `budgetType` prop ✅
      - spending budgets: hide `add` type (only `withdraw`) ✅
      - income budget: hide `withdraw` type (only `add`) ✅
    - `IncomeBudgetCard` ✅
    - `IncomeBudgetDetail`: wire to `/income`, no DeleteBudgetButton, MoveBudgetButton, CreateBudgetButton ✅
  - Wire into pages ✅
    - `SpendingBudgetCard` wires to `SpendingBudgetContainer` ✅
    - `SpendingBudgetContainer` wires to `Dashboard` and `BudgetDetail` ✅
    - `IncomeBudgetCard` wires to `Dashboard` ✅

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
- tasks for Transferring between budgets feature - Define `transfers` table schema (`id`, `user_id`,`from_budget_id`,`to_budget_id`, `amount`, `name`, `created_at`) ✅ - update the server triggers and functions: - implement `apply_balance_delta(p_budget_id uuid, p_delta numeric)` ✅ - delete old update_budget_balance triggers ✅ - implement new update_budget_balance_on_transaction() ✅ - Update SCHEMA.md with transfers table ✅ - implement create table transfers ✅ - Write RLS for transfers (both budget IDs must be owned by user) ✅ - implement RLS on supabase ✅ - Update TRIGGERS.md ✅ - Update DB_FUNCTIONS.md ✅ - implement `update_budget_balance_on_transfer()` ✅ - implement `on_transfer_insert_delete` & `on_transfers_update` ✅ - Update SERVICES.md and TYPES.md ✅ - write transfer types ✅ - write transfer services ✅ - Add transfer button to `BudgetDetail` ✅ - Write useTranfers(budget_id) (hook for getting and updating state) ✅ - Write `CreateTransferModal` + `TransferCard` components ✅ - wire `TransferCard` to `TransactionContainer` ✅ - Write `UpdateTransferModal` + `UpdateTranferButton` and wire ✅ - Write `DeleteTransferButton` + `DeleteTransferModal` and wire ✅ - Test

</details>
