# COMPONENTS
This document describes the React components in Fintrack's frontend.

Source files live in `frontend/components/`.

---

## Budget Components (`components/budgets/`)

### `SpendingBudgetCard`
Spending budget card. Navigates to `/budget/:id` on click. When `balance_threshold` is set on the budget, displays a small inline **Alert** tag (`bg-red-900/50 text-red-400`) in the top-right corner when `balance ≤ balance_threshold`.

Tag is rendered inline, not extracted as a separate component.

**Props:** `{ budget: Budget }`

**Used by:** `SpendingBudgetContainer`

---

### Alert Banner (`BudgetDetail` inline)
Displayed between the header and main content on `BudgetDetail` when `balance_threshold` is set and `balance ≤ balance_threshold`. Full-width banner (`bg-red-900/20 border border-red-900/50 text-red-400`) with the message: `"Balance has reached the alert threshold."`. Rendered inline, not extracted as a separate component.

---

### `SpendingBudgetContainer`
Grid container for spending budgets using `SpendingBudgetCard`. Accepts an optional `parentId` to scope to sub-budgets. Handles loading skeleton and empty state.

**Props:** `{ parentId?: string | null }`

**Used by:** `Dashboard`, `BudgetDetail` (sub-budget grid)

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

**Props:** `{ onClose: () => void, parentId?: string | null }`

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

**Props:** `{ setIsOpen: Dispatch<SetStateAction<boolean>> }`

---

### `UpdateBudgetNameInput`
Inline form for editing a budget's name.

**Props:** `{ budgetId, budgetName, onSuccess, setIsOpen }`

---

## Transaction Components (`components/transactions/`)

### `TransactionCard`
Single transaction row. Displays name, type label, amount (emerald for add, red for withdraw), and Move / edit / delete action buttons.

**Props:** `{ transaction: Transaction, onEdit: () => void, onDelete: () => void, onMove: () => void }`

**Used by:** `TransactionContainer`

---

### `TransactionContainer`
Merged preview of recent transactions and transfers for a budget, sorted descending by date. Renders up to `limit` items (default 3).

`viewAll` controls overflow behavior:
- `'link'` (default) — renders a "View all spending →" link to `/spending` when there are more items than `limit`
- `'expand'` — renders a "View all N transactions" button that opens `ExpandedView`

`ExpandedView` is an internal modal with search, type filter, amount range, and paginated results (10/page).

**Props:** `{ budgetId?: string, limit?: number, viewAll?: 'link' | 'expand' }`

**Used by:** `Dashboard` (`viewAll='link'`), `BudgetDetail` / `IncomeBudgetDetail` (`viewAll='expand'`)

---

### `AddTransactionButton`
Icon button that triggers the add transaction modal.

**Props:** `{ onClick: () => void }`

---

### `AddTransactionModal`
Modal form for adding a transaction. `budgetType` determines the transaction type and hides the type selector:
- `'spending'` — type is always `withdraw`
- `'income'` — type is always `add`

**Props:** `{ onClose: () => void, budgetId: string, budgetType: 'spending' | 'income' }`

**Used by:** `BudgetDetail`, `IncomeBudgetDetail`

---

### `UpdateTransactionButton`
Edit icon button (pencil) that triggers the update transaction modal.

**Props:** `{ onClick: () => void }`

---

### `UpdateTransactionModal`
Modal form for editing an existing transaction's name, type, and amount.

**Props:** `{ transaction: Transaction, onClose: () => void }`

---

### `DeleteTransactionButton`
Trash icon button that triggers the delete confirmation modal.

**Props:** `{ onClick: () => void }`

---

### `DeleteTransactionConfirmModal`
Confirmation modal for deleting a transaction. Action is irreversible.

**Props:** `{ transaction: Transaction, onClose: () => void }`

---

### `MoveTransactionModal`
Modal with path-based autocomplete for reassigning a transaction to a different spending budget. Pre-fills with the transaction's current budget path. Uses `useSpendingBudgetStructure`.

**Props:** `{ transaction: Transaction, onClose: () => void }`

---

### `BalanceSummary`
Displays balance, income, expenses, and transfer totals. Calls `useTransactions` and `useTransfers` internally. When `budgetId` is omitted, summarizes across all transactions/transfers. Transfer in/out rows only render when non-zero.

**Props:** `{ budgetId?: string }`

**Used by:** `Dashboard`, `BudgetDetail`, `IncomeBudgetDetail`

---

## Spending Components (`components/spending/`)

### `SpendingRow`
Single row for the Spending page. Displays transaction name, budget path (gray), amount (red), and date.

**Props:** `{ transaction: Transaction, budgetPath: string }`

**Used by:** `Spending` page

---

## Spending Components (`components/spending/`)

### `SpendingRow`
Single row for the Spending page. Displays transaction name, budget path, amount (red), and date.

**Props:** `{ transaction: Transaction, budgetPath: string }`

**Used by:** `Spending` page

---

## Transfer Components (`components/transfers/`)

### `TransferCard`
Single transfer row. Shows transfer name and "transfer in" / "transfer out" label relative to `budgetId`. Amount is emerald for in, red for out. Has edit and delete action buttons.

**Props:** `{ transfer: Transfer, budgetId: string, onEdit: () => void, onDelete: () => void }`

**Used by:** `TransactionContainer`

---

### `CreateTransferButton`
Icon button that triggers the create transfer modal.

**Props:** `{ onClick: () => void }`

---

### `CreateTransferModal`
Modal for creating a transfer between two budgets.

**Props:** `{ budget: Budget, onSuccess, onClose }`

---

### `UpdateTransferButton` / `UpdateTransferModal`
Inline edit for an existing transfer.

---

### `DeleteTransferButton` / `DeleteTransferConfirmModal`
Delete flow for an existing transfer. Deletion reverses the balance on both budgets.

---

## Loaders (`components/loaders/`)

### `PageLoader`
Full-screen centered spinner. Used as a suspense/loading fallback during page-level data fetches.

**Props:** none

**Used by:** `IncomeBudgetDetail`, `BudgetDetail`

---

## Shared (`components/`)

### `Toast`
Notification toast for success and error states. Renders a check icon (emerald) or info icon (red) with a message.

**Props:** `{ notification: Notification }`

**Used by:** `NotificationProvider`

---

## Pages (`src/pages/`)

### `Dashboard`
Financial overview page. Layout top-to-bottom:
1. Summary row — `BalanceSummary` (flex-1) + `IncomeBudgetCard` (fixed width) side by side at equal height
2. Recent Transactions (full width) — `TransactionContainer` with `viewAll='link'`
3. Spending Budgets (full width) — `SpendingBudgetContainer` with create button

**Route:** `/dashboard`

---

### `BudgetDetail`
Detail page for a spending budget. Shows balance, transactions/transfers, sub-budgets, and all budget actions (rename, move, delete, create sub-budget, add transaction, create transfer). Uses `TransactionContainer` with `viewAll='expand'`.

**Route:** `/budget/:id`

---

### `IncomeBudgetDetail`
Detail page for the income budget. Split into a loader shell (`IncomeBudgetDetail`) and content component (`IncomeBudgetDetailContent`) — dependent queries only mount after the income budget ID is available, preventing a two-phase loading flicker.

Layout is vertically stacked: `BalanceSummary` on top, then income transactions below. Uses `TransactionContainer` with `viewAll='expand'`.

No delete, move, or create sub-budget actions.

**Route:** `/income`

---

### `Spending`
Full spending ledger — all `withdraw` transactions across all budgets. Paginated at 25/page. Supports filters:
- Name search
- Amount range (min/max)
- Date range (from/to)
- Budget path autocomplete (prefix match via `useSpendingBudgetStructure`)

Header shows total count and total amount spent for the current filter set.

**Route:** `/spending`
