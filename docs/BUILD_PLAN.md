# BUILD PLAN
This document outlines the full development plan for Fintrack.

## Stages

### MVP (Completed)
Users can:
- Create, update, delete budgets and sub-budgets
- Log, update, delete transactions in a budget
- View recent transactions and balance
- Navigate between budgets and sub-budgets
- Log in and out securely

### Stage 2 — UI & Core Features (Completed)
Users can:
- View balance on each BudgetCard
- Search and filter transactions
- Navigate budgets as a hierarchy tree
- Move budgets and transactions between parents
- Transfer money between budgets
- Set spending limits with warnings and alerts
- Use a designated income budget as the source of funds
- View spending stats and charts
- Toggle dark/light mode
- Use the app on mobile (responsive UI)

### Architecture Migration — Clean Data Model
Motivated by the need for a clear separation between income and spending, bank API readiness, and unambiguous data models. See ARCHITECTURE.md for the full rationale.

**Step 0 — Frontend fixes (no schema changes):**
- TransferCard: show from/to budget names
- UpdateTransferModal: display from_budget (read-only), allow editing to_budget
- Split TransferContainer from TransactionContainer

**Step 0.5 — Document rewrite:**
- Rewrite SCOPE, BUILD_PLAN, PROGRESS, and ARCHITECTURE to reflect the new model

**Step 1 — Introduce Incomes:**
- `incomes` table: schema, RLS, triggers (additive — safe early)
- Incomes services, types, hooks
- Dev migration: `type: 'add'` transactions → incomes (verify on dev first)
- Wire incomes to /income page
- Prod migration: run once confirmed on dev

**Step 2 — Remove transaction type:**
- Stop writing `type` — update services and UI to never send it
- Stop reading `type` — remove from TypeScript types, update all display logic
- `BudgetBalanceSummary` — derive balance client-side as `transfers_in - transfers_out - transactions` (see ARCHITECTURE.md — Balance calculation)
- DB drop (last): `type` column, `.balance` column, balance triggers and functions

**Step 3 — Introduce Allocations:**
- `allocations` table: schema, RLS, triggers (additive — safe early)
- Allocations services, types, hooks
- Dev migration: income transfers → allocations (verify on dev first)
- `IncomeBalanceSummary` — derive income balance as `SUM(incomes) − SUM(allocations out)` on /income
- Update `BudgetBalanceSummary` — `allocations_in + transfers_in - transfers_out - transactions`
- Wire allocation create/view/delete to /income
- `OverallBalanceSummary` — derive dashboard balance as `SUM(incomes) − SUM(all transactions)`
- Remove `is_income` from app — services, hooks, UI
- Prod migration: run once confirmed on dev
- DB drop (last): `is_income` column, income budget row, related triggers

### Stage 3 — Advanced & Scale
Users can:
- Configure per-budget `allow_negative_balance` setting
- Receive budget notifications (threshold alerts, over-limit events)
- Track transactions in multiple currencies
- Schedule one-time and recurring transactions (AutoPay)
- Manage active sessions and revoke access
- Split bills with others
- Track loans and owes (Liabilities)
- Manage their profile
- Interact with an AI agent that can read, plan, and execute financial actions

### Stage 4 — Bank Integration
Users can:
- Link bank accounts via Plaid or similar APIs
- Auto-import bank statements as income entries
- Reconcile imported records with manual entries

### Post Stage 3 — Noted for Later
- Onboarding — first time user guided setup flow
- Data management — CSV export/import, backup & restore
- Social/Sharing — shared budgets between users (couples, families, roommates)

---

## Development Philosophy
- Vertical phases — one complete feature at a time
- CR (Create + Read) before UD (Update + Delete)
- Backend (RLS + services) before frontend (UI)
- Optimistic updates on the frontend — rollback on failure via try/catch
- Test each phase via UI + Supabase dashboard before moving on
- Strict envelope model — all money enters through incomes, is allocated to spending budgets, and is spent via transactions or transferred between budgets
