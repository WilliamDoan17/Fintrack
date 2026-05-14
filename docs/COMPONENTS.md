# COMPONENTS
This document describes the React components in Fintrack's frontend.

Source files live in `frontend/components/`.

---

## Budget Components (`components/budgets/`)

### `SpendingBudgetCard`
Displays a single spending budget card. Navigates to `/budget/:id` on click.

**Props:** `{ budget: Budget }`

**Used by:** `SpendingBudgetContainer`

---

### `SpendingBudgetContainer`
Grid container for spending budgets. Handles loading skeleton and empty state.

**Props:** `{ spendingBudgetQuery: ReturnType<typeof useSpendingBudgets> }`

**Used by:** `Dashboard`, `BudgetDetail`

---

### `IncomeBudgetCard`
Compact card displaying the income budget balance. Budget name renders as a small gray uppercase label at the top-center; balance is centered in the remaining space. Distinct emerald border styling. Navigates to `/income` on click.

**Props:** `{ budget: Budget }`

**Used by:** `Dashboard`

---

### `CreateBudgetButton`
Icon button that triggers the create budget modal.

**Props:** `{ onClick: () => void }`

---

### `CreateBudgetModal`
Modal form for creating a new spending budget.

**Props:** `{ spendingBudgetQuery, parentId?, onClose }`

---

### `DeleteBudgetButton`
Icon button that triggers the delete confirmation modal. Not used in income budget views.

**Props:** `{ onClick: () => void }`

---

### `DeleteBudgetConfirmModal`
Confirmation modal for deleting a spending budget (cascades to sub-budgets).

**Props:** `{ budgetId, budgetName, onClose }`

---

### `MoveBudgetButton`
Icon button that triggers the move budget modal. Not used in income budget views.

**Props:** `{ budget: Budget | null, onClick: () => void }`

---

### `MoveBudgetModal`
Modal with path-based autocomplete for moving a spending budget to a new parent. Uses `useSpendingBudgetStructure` — income budget is excluded from valid move targets.

**Props:** `{ budget: Budget, onClose: () => void }`

---

### `UpdateBudgetNameButton`
Edit icon button that toggles inline name editing.

**Props:** `{ setIsOpen: (v: boolean) => void }`

---

### `UpdateBudgetNameInput`
Inline form for editing a budget's name.

**Props:** `{ budgetId, budgetName, onSuccess, setIsOpen }`

---

## Transaction Components (`components/transactions/`)

### `AddTransactionModal`
Modal form for adding a transaction. `budgetType` determines the transaction type and hides the type selector:
- `'spending'` — type is always `withdraw`
- `'income'` — type is always `add`

**Props:** `{ transactionQuery, budgetId, budgetType: 'spending' | 'income', onClose }`

**Used by:** `BudgetDetail`, `IncomeBudgetDetail`

---

### `AddTransactionButton`
Icon button that triggers the add transaction modal.

**Props:** `{ onClick: () => void }`

---

### `TransactionContainer`
Lists transactions and transfers for a budget. Supports pagination, search, and type/amount filters via an expanded overlay.

**Props:** `{ transactionQuery, transferQuery?, spendingBudgetQuery?, budgetId?, limit? }`

`spendingBudgetQuery` is optional — only needed when the container is used in a spending budget context and needs to refetch budgets after a transaction is moved.

---

### `BalanceSummary`
Displays balance, income, expenses, and transfer totals for a budget.

**Props:** `{ transactionQuery, transferQuery?, budgetId? }`

---

## Transfer Components (`components/transfers/`)

### `CreateTransferButton`
Icon button that triggers the create transfer modal.

**Props:** `{ onClick: () => void }`

---

### `CreateTransferModal`
Modal for creating a transfer between two budgets.

**Props:** `{ budget: Budget, onSuccess, onClose }`

---

### `UpdateTransferModal` / `UpdateTransferButton`
Inline edit for an existing transfer.

---

### `DeleteTransferButton` / `DeleteTransferModal`
Delete flow for an existing transfer.

---

## Pages (`src/pages/`)

### `Dashboard`
Financial overview page. Layout top-to-bottom:
1. Summary row — `BalanceSummary` (flex-1) + `IncomeBudgetCard` (fixed width) side by side at equal height
2. Recent Transactions (full width)
3. Spending Budgets (full width) with create button

**Route:** `/dashboard`

---

### `BudgetDetail`
Detail page for a spending budget. Shows balance, transactions, transfers, sub-budgets, and all budget actions (rename, move, delete, create sub-budget, add transaction, create transfer).

**Route:** `/budget/:id`

---

### `IncomeBudgetDetail`
Detail page for the income budget. Split into a loader shell (`IncomeBudgetDetail`) and content component (`IncomeBudgetDetailContent`) — dependent queries only mount after the income budget ID is available, preventing a two-phase loading flicker.

Layout is vertically stacked: `BalanceSummary` on top, then income transactions below.

No delete, move, or create sub-budget actions.

**Route:** `/income`
