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
- All transactions (paginated, searchable, filterable) with edit/delete/move actions
- All root budgets with a create budget button

---

## `/budget/:id` — Budget Detail (`src/pages/BudgetDetail.tsx`)
Detail page for a specific budget. Shows:
- Budget name (inline editable) with rename, move, and delete actions
- Balance summary for the budget (recursive — includes sub-budgets)
- Transactions for the budget and all sub-budgets (paginated, searchable, filterable) with add/edit/delete/move actions
- Sub-budgets list with a create sub-budget button
- Back navigation via `NavigationContext`
