# HOOKS
This document describes the React hooks in Fintrack's frontend.

## Conventions
- Hooks never accept `user_id` as a parameter
- All data fetching hooks return `{ data, loading, error, refetch }`
- Hooks call services directly — no raw Supabase calls inside hooks

---

## Budget Hooks

### `useSpendingBudgets(parentId: string | null)`
Fetches spending budgets. Replaces `useBudgets`.
- `parentId = null` → calls `getRootSpendingBudgets()` (top-level spending budgets)
- `parentId = id` → calls `getChildBudgets(id)` (children are always spending budgets)

**Returns:** `{ budgets, loading, error, refetch }`

**Used by:** `SpendingBudgetContainer`, `Dashboard`, `BudgetDetail`

---

### `useIncomeBudget()`
Fetches the current user's single income budget.

**Returns:** `{ budget, loading, error, refetch }`

**Used by:** `Dashboard`, `IncomeBudgetDetail`

---

### `useBudgetInfo(budgetId: string | null)`
Fetches a single budget by id. Shared between spending and income detail pages.

**Returns:** `{ budget, loading, error, refetch }`

**Used by:** `BudgetDetail`, `IncomeBudgetDetail`

---

### `useSpendingBudgetStructure()`
Builds a path-based tree of all spending budgets. Replaces `useBudgetStructure`. Excludes the income budget so it cannot be used as a move target.

**Returns:** `{ structure: { budgetIdToPath, pathToBudgetId, paths }, loading, error }`

**Used by:** `MoveBudgetModal`

---

## Transaction Hooks

### `useTransactions(budgetId: string | null)`
Fetches transactions. `budgetId = null` fetches all transactions for the user.

**Returns:** `{ transactions, loading, error, refetch }`

---

## Transfer Hooks

### `useTransfers(budgetId: string | null)`
Fetches transfers. `budgetId = null` fetches all transfers for the user.

**Returns:** `{ transfers, loading, error, refetch }`
