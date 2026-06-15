# PAGES
This document describes the pages of Fintrack.

---

## `/` — Landing (`src/pages/Landing.tsx`)
Public marketing page. Shows the app name, hero section, and a features grid. Has a navbar and CTA buttons that navigate to `/auth`.

---

## `/auth` — Auth (`src/pages/Auth.tsx`)
Public page for signing in or creating an account. Has a tab bar to switch between Login and Signup forms. Redirects to `/dashboard` on success.

---

## `/dashboard` — Dashboard (`src/pages/Dashboard.tsx`)
Financial overview page for authenticated users. Layout top-to-bottom:
- **Summary row** — `BalanceSummary` and `IncomeBudgetCard` side by side at equal height
- **Recent Transactions** — full-width preview; "View all spending →" links to `/spending`
- **Your Budgets** — root spending budgets grid with a create budget button

---

## `/spending` — Spending (`src/pages/Spending.tsx`)
Full spending history for authenticated users. Shows only `withdraw` transactions across all spending budgets. Features:
- **Header** — "Spending" title + total spent (sum of filtered results)
- **Filters** — name search, amount range (min/max), date range (from/to), budget path autocomplete with keyboard navigation
- **List** — `SpendingRow` per transaction (name, budget path, amount, date); 25 per page pagination
- Data: `useTransactions(null)` filtered to `type === 'withdraw'` + `useSpendingBudgetStructure()` for path resolution
- Loading: skeleton rows while data fetches

---

## `/income` — Income Budget Detail (`src/pages/IncomeBudgetDetail.tsx`)
Protected page for the user's income budget. Shows:
- Income budget name (inline editable, cannot be deleted or moved)
- Balance summary (full width)
- Income transactions list with add transaction and create transfer buttons
- Transfers in/out visible alongside transactions

---

## `/budget/:id` — Budget Detail (`src/pages/BudgetDetail.tsx`)
Detail page for a specific budget. Shows:
- Budget name (inline editable) with rename, move, delete, and settings actions
- Balance summary for the budget (recursive — includes sub-budgets)
- Transactions for the budget and all sub-budgets (paginated, searchable, filterable) with add/edit/delete/move actions
- Sub-budgets list with a create sub-budget button
- Back navigation via `NavigationContext`

**Settings modal** (in-file component `SettingsModal`): opened via the Settings button in the header. Contains:
- `balance_threshold` — optional number input; pre-populated with the current value if set, blank otherwise. Saved via `useUpdateBudget`.
