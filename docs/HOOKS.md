# HOOKS

This document describes the React hooks in Fintrack's frontend.

## Conventions

- Hooks never accept `user_id` as a parameter
- Query hooks use `@tanstack/react-query` (`useQuery`) and return `{ data, isLoading, error }`
- Mutation hooks use `@tanstack/react-query` (`useMutation`) and handle cache invalidation internally
- All mutation hooks invalidate broadly (prefix-level) to account for balance propagation up the budget tree
- Hooks call services directly — no raw Supabase calls inside hooks

---

## Query Keys

| Hook                             | Key                          |
| -------------------------------- | ---------------------------- |
| `useBudgets(parentId)`           | `['budgets', parentId]`      |
| `useBudget(id)`                  | `['budget', id]`             |
| `useBudgetStructure()`           | `['budget-structure']`       |
| `useTransactions(budgetId)`      | `['transactions', budgetId]` |
| `useTransfers(budgetId)`         | `['transfers', budgetId]`    |
| `useIncomes()`                   | `['incomes']`                |
| `useAllocations()`               | `['allocations']`            |
| `useBudgetAllocations(budgetId)` | `['allocations', budgetId]`  |
| `useAllocation(id)`              | `['allocation', id]`         |

---

## Auth Hooks (`hooks/auth.ts`)

### `useAuth()`

Returns the current authenticated user via Supabase auth state subscription. Does not use tanstack-query.

**Returns:** `{ user, loading, error }`

**Used by:** `AuthProvider`

---

## Budget Hooks (`hooks/budgets.ts`)

### `useBudgets(parentId: string | null)`

Fetches spending budgets.

- `parentId = null` → calls `getRootSpendingBudgets()`
- `parentId = id` → calls `getChildBudgets(id)`

**Returns:** `{ budgets, isLoading, error }`

**Used by:** `BudgetContainer`, `BudgetContainer`

---

### `useBudget(id: string | null)`

Fetches a single budget by id. Query is disabled when `id` is null.

**Returns:** `{ budget, isLoading, error }`

**Used by:** `BudgetDetail`

---

### `useBudgetBalance(budgetId: string)`

Derives the balance for a spending budget from cached query data. Composes `useTransactions`, `useTransfers`, and `useBudgetAllocations` — no new query key.

**Formula:** `allocationsIn - expenses + transfersIn - transfersOut`

- `allocationsIn` — sum of all allocations where `to_budget_id === budgetId`
- `expenses` — sum of all transactions for the budget (recursive, via `get_budget_transactions`)
- `transfersIn` — sum of transfers where `to_budget_id === budgetId`
- `transfersOut` — sum of transfers where `from_budget_id === budgetId`

**Returns:** `{ balance, incomes, expenses, transfersIn, transfersOut, isLoading, error }`

**Used by:** `BalanceSummary` (BudgetDetail), `BudgetCard`

---

### `useBudgetStructure()`

Builds a path-based tree of all spending budgets for use as move targets.

**Returns:** `{ structure: { budgetIdToPath, pathToBudgetId, paths }, isLoading, error }`

**Used by:** `MoveBudgetModal`

---

### `useCreateBudget()`

Creates a new spending budget. Invalidates `['budgets']`, `['budget']`, `['budget-structure']` on success.

**Returns:** `UseMutationResult<void, Error, BudgetInput>`

**Used by:** `CreateBudgetModal`

---

### `useUpdateBudget()`

Updates an existing budget (name, parent). Invalidates `['budgets']`, `['budget']`, `['budget-structure']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<BudgetInput> }>`

**Used by:** `UpdateBudgetNameInput`, `MoveBudgetModal`

---

### `useDeleteBudget()`

Deletes a budget and its sub-budgets. Invalidates `['budgets']`, `['budget']`, `['budget-structure']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

**Used by:** `DeleteBudgetConfirmModal`

---

## Transaction Hooks (`hooks/transactions.ts`)

### `useTransactions(budgetId: string | null)`

Fetches transactions.

- `budgetId = null` → calls `getAllTransactions()`
- `budgetId = id` → calls `getBudgetTransactions(id)`

**Returns:** `{ transactions, isLoading, error }`

**Used by:** `TransactionContainer`, `BalanceSummary`

---

### `useCreateTransaction()`

Creates a new transaction. Invalidates `['transactions']`, `['budget']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, TransactionInput>`

**Used by:** `AddTransactionModal`

---

### `useUpdateTransaction()`

Updates an existing transaction. Invalidates `['transactions']`, `['budget']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<TransactionInput> }>`

**Used by:** `UpdateTransactionModal`, `MoveTransactionModal`

---

### `useDeleteTransaction()`

Deletes a transaction. Invalidates `['transactions']`, `['budget']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

**Used by:** `DeleteTransactionConfirmModal`

---

## Transfer Hooks (`hooks/transfers.ts`)

### `useTransfers(budgetId: string | null)`

Fetches transfers.

- `budgetId = null` → calls `getAllTransfers()`
- `budgetId = id` → calls `getBudgetTransfers(id)`

**Returns:** `{ transfers, isLoading, error }`

**Used by:** `TransferContainer`, `BalanceSummary`

---

### `useCreateTransfer()`

Creates a new transfer between budgets. Invalidates `['transfers']`, `['budget']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, TransferInput>`

**Used by:** `CreateTransferModal`

---

### `useUpdateTransfer()`

Updates an existing transfer. Invalidates `['transfers']`, `['budget']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<TransferInput> }>`

**Used by:** `UpdateTransferModal`

---

### `useDeleteTransfer()`

Deletes a transfer. Invalidates `['transfers']`, `['budget']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

**Used by:** `DeleteTransferConfirmModal`

---

## Income Hooks (`hooks/incomes.ts`)

### `useIncomes()`

Fetches all income logs for the current user. Uses `getAllIncomes()`.

**Returns:** `{ incomes, isLoading, error }`

---

### `useCreateIncome()`

Creates a new income log. Invalidates `['incomes']` on success.

**Returns:** `UseMutationResult<void, Error, IncomeInput>`

---

### `useUpdateIncome()`

Updates an existing income log. Invalidates `['incomes']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<IncomeInput> }>`

---

### `useDeleteIncome()`

Deletes an income log. Invalidates `['incomes']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

---

## Allocation Hooks (`hooks/allocations.ts`)

### `useAllocations()`

Fetches all allocations for the current user. Uses `getAllAllocations()`.

**Returns:** `{ allocations, isLoading, error }`

---

### `useBudgetAllocations(budgetId: string)`

Fetches allocations for a specific budget. Uses `getBudgetAllocations(budgetId)`.

**Returns:** `{ allocations, isLoading, error }`

---

### `useAllocation(allocationId: string | null)`

Fetches a single allocation by id. Query is disabled when `allocationId` is null.

**Returns:** `{ allocation, isLoading, error }`

---

### `useCreateAllocation()`

Creates a new allocation. Invalidates `['allocations']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, AllocationInput>`

---

### `useUpdateAllocation()`

Updates an existing allocation. Invalidates `['allocations']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<AllocationInput> }>`

---

### `useDeleteAllocation()`

Deletes an allocation. Invalidates `['allocations']`, `['budgets']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

---
