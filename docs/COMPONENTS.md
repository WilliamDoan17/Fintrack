# COMPONENTS

This document describes the React components in Fintrack's frontend.

Source files live in `frontend/components/`.

---

## Budget Components (`components/budgets/`)

### `SpendingBudgetContainer`

Grid container for spending budgets. Renders a local `SpendingBudgetCard` for each budget — card navigates to `/budget/:id` on click, displays an inline Alert tag (`bg-red-900/50 text-red-400`) when `balance ≤ balance_threshold`. Accepts an optional `parentId` to scope to sub-budgets. Handles loading skeleton and empty state.

**Props:** `{ parentId?: string | null }`

**Used by:** `Dashboard`, `BudgetDetail` (sub-budget grid)

---

### `CreateBudgetModal`

Modal form for creating a new spending budget.

**Props:** `{ onClose: () => void, parentId?: string | null }`

---

### `DeleteBudgetConfirmModal`

Confirmation modal for deleting a spending budget (cascades to sub-budgets).

**Props:** `{ budgetId, budgetName, onClose }`

---

### `MoveBudgetModal`

Modal with path-based autocomplete for moving a spending budget to a new parent. Uses `useSpendingBudgetStructure` — income budget is excluded from valid move targets.

**Props:** `{ budget: Budget, onClose: () => void }`

---

### `UpdateBudgetNameInput`

Inline form for editing a budget's name.

**Props:** `{ budgetId, budgetName, onSuccess, setIsOpen }`

---

## Transaction Components (`components/transactions/`)

### `TransactionCard`

Single transaction row. Displays name, type label, amount (emerald for add, red for withdraw), and edit / delete action buttons. Renders a Move button only when `onMove` is provided. Edit and delete are local icon button functions (`EditButton`, `DeleteButton`) defined inside the file.

**Props:** `{ transaction: Transaction, onEdit: () => void, onDelete: () => void, onMove?: () => void }`

**Used by:** `TransactionContainer`

---

### `TransactionContainer`

Preview of recent transactions for a budget. Renders up to `limit` items (default 3).

`viewAll` controls overflow behavior:

- `'link'` (default) — renders a "View all spending →" link to `/spending` when there are more items than `limit`
- `'expand'` — renders a "View all N transactions" button that opens `ExpandedView`

`hideMoveButton` — when true, suppresses the Move button on transaction rows. Used on income pages where transactions cannot be reassigned to a spending budget.

`ExpandedView` is an internal modal with search, type filter, amount range, and paginated results (10/page).

**Props:** `{ budgetId?: string, limit?: number, viewAll?: 'link' | 'expand', hideMoveButton?: boolean }`

**Used by:** `Dashboard` (`viewAll='link'`), `BudgetDetail` (`viewAll='expand'`), `IncomeDetail` (`viewAll='expand'`, `hideMoveButton`)

---

### `AddTransactionModal`

Modal form for adding a transaction. `budgetType` determines the transaction type and hides the type selector:

- `'spending'` — type is always `withdraw`
- `'income'` — type is always `add`

**Props:** `{ onClose: () => void, budgetId: string, budgetType: 'spending' | 'income' }`

**Used by:** `BudgetDetail`, `IncomeDetail`

---

### `UpdateTransactionModal`

Modal form for editing an existing transaction's name, type, and amount.

**Props:** `{ transaction: Transaction, onClose: () => void }`

---

### `DeleteTransactionConfirmModal`

Confirmation modal for deleting a transaction. Action is irreversible.

**Props:** `{ transaction: Transaction, onClose: () => void }`

---

### `MoveTransactionModal`

Modal with path-based autocomplete for reassigning a transaction to a different spending budget. Pre-fills with the transaction's current budget path. Uses `useSpendingBudgetStructure`.

**Props:** `{ transaction: Transaction, onClose: () => void }`

---

---

## Transfer Components (`components/transfers/`)

### `CreateTransferModal`

Modal for creating a transfer between two budgets. Uses path-based autocomplete via `useSpendingBudgetStructure`.

**Props:** `{ budget: Budget, onClose: () => void }`

---

### `TransferContainer`

Standalone container for displaying transfers for a specific budget. Shows from/to budget names on each row using `useSpendingBudgetStructure` for path lookups. Manages its own update/delete modal state.

`TransferCard` is exported for reuse if needed.

**Props:** `{ budgetId: string }`

**Used by:** `BudgetDetail`

---

### `UpdateTransferModal`

Modal form for editing an existing transfer. Displays `from_budget` read-only (by name), provides path-based autocomplete for changing `to_budget`, and allows editing name and amount. Uses `useSpendingBudgetStructure`.

**Props:** `{ transfer: Transfer, onClose: () => void }`

---

### `DeleteTransferConfirmModal`

Confirmation modal for deleting a transfer. Deletion reverses the balance on both budgets.

**Props:** `{ transfer: Transfer, onClose: () => void }`

---

## Loaders (`components/loaders/`)

### `PageLoader`

Full-screen centered spinner. Used as a suspense/loading fallback during page-level data fetches.

**Props:** none

**Used by:** `IncomeDetail`, `BudgetDetail`

---

## Shared (`components/`)

### `Toast`

Notification toast for success and error states. Renders a check icon (emerald) or info icon (red) with a message.

**Props:** `{ notification: Notification }`

**Used by:** `NotificationProvider`

---
