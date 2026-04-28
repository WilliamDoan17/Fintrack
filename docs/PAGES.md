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
Main overview page for authenticated users. Shows:
- Balance summary
- Recent transactions preview — clicking a transaction or "View all" navigates to `/transactions`
- All root budgets with a create budget button

---

## `/transactions` — Transactions (`src/pages/Transactions.tsx`)
Full transaction history for authenticated users. Shows:
- All transactions across all budgets (paginated, searchable, filterable)
- Edit/delete/move actions per transaction

---

## `/budgets` — Budgets (`src/pages/Budgets.tsx`)
Budget management page for authenticated users. Shows:
- Full budget hierarchy as a navigable tree
- Create, rename, move, and delete budgets

---

## `/income` — Income (`src/pages/Income.tsx`)
Protected page for the user's income budget. Shows:
- Income budget name (inline editable, cannot be deleted)
- Total income balance (unallocated funds available to distribute)
- Log income form — adds an `add` transaction to the income budget
- Income transaction history (paginated, searchable, filterable)
- Allocate button — opens transfer modal to move funds from income to a spending budget

---

## `/budget/:id` — Budget Detail (`src/pages/BudgetDetail.tsx`)
Detail page for a specific budget. Shows:
- Budget name (inline editable) with rename, move, and delete actions
- Balance summary for the budget (recursive — includes sub-budgets)
- Transactions for the budget and all sub-budgets (paginated, searchable, filterable) with add/edit/delete/move actions
- Sub-budgets list with a create sub-budget button
- Back navigation via `NavigationContext`
