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

**Props:** `{ budgetQuery: ReturnType<typeof useSpendingBudgets> }`

**Used by:** `Dashboard`, `BudgetDetail`

---

### `IncomeBudgetCard`
Displays the income budget card with distinct emerald styling. Navigates to `/income` on click.

**Props:** `{ budget: Budget }`

**Used by:** `Dashboard`

---

### `CreateBudgetButton`
Icon button that triggers the create budget modal.

**Props:** `{ onClick: () => void }`

---

### `CreateBudgetModal`
Modal form for creating a new spending budget.

**Props:** `{ budgetQuery, parentId?, onClose }`

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
Lists transactions and transfers for a budget.

**Props:** `{ transactionQuery, transferQuery?, budgetQuery?, budgetId? }`

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
Main overview page. Shows `BalanceSummary`, recent transactions, `IncomeBudgetCard`, and `SpendingBudgetContainer`.

**Route:** `/dashboard`

---

### `BudgetDetail`
Detail page for a spending budget. Shows balance, transactions, transfers, sub-budgets, and all budget actions (rename, move, delete, create sub-budget, add transaction, create transfer).

**Route:** `/budget/:id`

---

### `IncomeBudgetDetail`
Detail page for the income budget. Shows balance, income transactions, and transfers. No delete, move, or create sub-budget actions.

**Route:** `/income`
