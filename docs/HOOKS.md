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

| Hook | Key |
|---|---|
| `useSpendingBudgets(parentId)` | `['spending-budgets', parentId]` |
| `useBudget(id)` | `['budget', id]` |
| `useIncomeBudget()` | `['income-budget']` |
| `useSpendingBudgetStructure()` | `['spending-budget-structure']` |
| `useTransactions(budgetId)` | `['transactions', budgetId]` |
| `useTransfers(budgetId)` | `['transfers', budgetId]` |

---

## Auth Hooks (`hooks/auth.ts`)

### `useAuth()`
Returns the current authenticated user via Supabase auth state subscription. Does not use tanstack-query.

**Returns:** `{ user, loading, error }`

**Used by:** `AuthProvider`

---

## Budget Hooks (`hooks/budgets.ts`)

### `useSpendingBudgets(parentId: string | null)`
Fetches spending budgets.
- `parentId = null` → calls `getRootSpendingBudgets()`
- `parentId = id` → calls `getChildBudgets(id)`

**Returns:** `{ budgets, isLoading, error }`

**Used by:** `SpendingBudgetContainer`, `BudgetContainer`

---

### `useBudget(id: string | null)`
Fetches a single budget by id. Query is disabled when `id` is null.

**Returns:** `{ budget, isLoading, error }`

**Used by:** `BudgetDetail`, `IncomeBudgetDetail`

---

### `useIncomeBudget()`
Fetches the current user's single income budget.

**Returns:** `{ budget, isLoading, error }`

**Used by:** `Dashboard`, `IncomeBudgetDetail`

---

### `useSpendingBudgetStructure()`
Builds a path-based tree of all spending budgets for use as move targets.

**Returns:** `{ structure: { budgetIdToPath, pathToBudgetId, paths }, isLoading, error }`

**Used by:** `MoveBudgetModal`

---

### `useCreateBudget()`
Creates a new spending budget. Invalidates `['spending-budgets']`, `['budget']`, `['spending-budget-structure']` on success.

**Returns:** `UseMutationResult<void, Error, BudgetInput>`

**Used by:** `CreateBudgetModal`

---

### `useUpdateBudget()`
Updates an existing budget (name, parent). Invalidates `['spending-budgets']`, `['budget']`, `['income-budget']`, `['spending-budget-structure']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<BudgetInput> }>`

**Used by:** `UpdateBudgetNameInput`, `MoveBudgetModal`

---

### `useDeleteBudget()`
Deletes a budget and its sub-budgets. Invalidates `['spending-budgets']`, `['budget']`, `['spending-budget-structure']` on success.

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
Creates a new transaction. Invalidates `['transactions']`, `['budget']`, `['spending-budgets']` on success.

**Returns:** `UseMutationResult<void, Error, TransactionInput>`

**Used by:** `AddTransactionModal`

---

### `useUpdateTransaction()`
Updates an existing transaction. Invalidates `['transactions']`, `['budget']`, `['spending-budgets']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<TransactionInput> }>`

**Used by:** `UpdateTransactionModal`, `MoveTransactionModal`

---

### `useDeleteTransaction()`
Deletes a transaction. Invalidates `['transactions']`, `['budget']`, `['spending-budgets']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

**Used by:** `DeleteTransactionConfirmModal`

---

## Transfer Hooks (`hooks/transfers.ts`)

### `useTransfers(budgetId: string | null)`
Fetches transfers.
- `budgetId = null` → calls `getAllTransfers()`
- `budgetId = id` → calls `getBudgetTransfers(id)`

**Returns:** `{ transfers, isLoading, error }`

**Used by:** `TransactionContainer`, `BalanceSummary`

---

### `useCreateTransfer()`
Creates a new transfer between budgets. Invalidates `['transfers']`, `['budget']`, `['spending-budgets']` on success.

**Returns:** `UseMutationResult<void, Error, TransferInput>`

**Used by:** `CreateTransferModal`

---

### `useUpdateTransfer()`
Updates an existing transfer. Invalidates `['transfers']`, `['budget']`, `['spending-budgets']` on success.

**Returns:** `UseMutationResult<void, Error, { id: string; updates: Partial<TransferInput> }>`

**Used by:** `UpdateTransferModal`

---

### `useDeleteTransfer()`
Deletes a transfer. Invalidates `['transfers']`, `['budget']`, `['spending-budgets']` on success.

**Returns:** `UseMutationResult<void, Error, string>`

**Used by:** `DeleteTransferConfirmModal`
