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

### Stage 2 — UI & Core Features
Users can:
- View balance on each BudgetCard
- Search and filter transactions
- Navigate budgets as a hierarchy tree
- Move budgets and transactions between parents
- Transfer money between budgets
- Set spending limits with warnings and alerts
- Designate an income budget as the source of all money
- View spending stats and charts
- Toggle dark/light mode
- Use the app on mobile (responsive UI)

### Stage 3 — Advanced & Scale
Users can:
- Track transactions in multiple currencies
- Schedule one-time and recurring transactions (AutoPay)
- Manage active sessions and revoke access
- Split bills with others
- Track loans and owes
- Manage their profile
- Interact with an AI agent that can read, plan, and execute financial actions

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

---

## Phases (Detailed Breakdown)

Each phase lists the tasks, services, and pages it touches. Status is tracked in `PROGRESS.md`.

### MVP

#### Phase 1: Auth
- **Tasks:** link Supabase; write auth services; set up protected routes
- **Services:** `signupWithEmailAndPassword`, `loginWithEmailAndPassword`, `logout`
- **Pages:** `Auth.tsx`

#### Phase 2: Create + View Budgets
- **Tasks:** RLS for budget INSERT/SELECT; budget services
- **Services:** `createBudget`, `getRootBudgets`
- **Pages:** `Dashboard.tsx` — root budgets list, create modal

#### Phase 3: Budget Detail
- **Services:** `getBudget`, `getChildBudgets`
- **Pages:** `BudgetDetail.tsx` — budget name, sub-budgets list, create sub-budget modal

#### Phase 4: Create + View Transactions + Balance
- **Tasks:** RLS for transaction INSERT/SELECT; transaction services; `get_budget_transactions` recursive PL/pgSQL function
- **Services:** `createTransaction`, `getBudgetTransactions`, `getAllTransactions`
- **Pages:** `BudgetDetail.tsx` (add tx form, tx list recursive, balance), `Dashboard.tsx` (recent tx, overall balance)

#### Phase 5: Update + Delete Budgets
- **Tasks:** RLS for budget UPDATE/DELETE
- **Services:** `updateBudget`, `deleteBudget`
- **Pages:** `BudgetDetail.tsx` — inline rename, delete with confirm modal

#### Phase 6: Update + Delete Transactions
- **Tasks:** RLS for transaction UPDATE/DELETE
- **Services:** `updateTransaction`, `deleteTransaction`
- **Pages:** `BudgetDetail.tsx`, `Dashboard.tsx` — edit/delete actions on transaction list

#### Phase 7: Polish
- **Tasks:** Toast notification system; collapsible Sidebar with user info + logout; NavigationArrow + NavigationContext; ProtectedLayout; Landing page; BalanceSummary polish; skeleton loaders; TransactionContainer expanded overlay; Vercel deployment with SPA routing fix

---

### Stage 2

#### S2-1: useReactQuery
- Refactor `useBudgets`, `useTransactions`, `useAuth` to React Query
- Remove manual `useState/useEffect` patterns from hooks
- Test caching and automatic refetch behavior

#### S2-2: Dark / Light Mode
- `ThemeContext` + `ThemeProvider`
- Toggle button in Sidebar
- Light mode Tailwind variants across components
- Persist preference to localStorage

#### S2-3: Responsive UI
- Audit all pages for mobile breakpoints
- Sidebar auto-collapse on small screens
- Update Dashboard and BudgetDetail grids for mobile
- Test on sm/md/lg breakpoints

#### S2-4: BudgetCard Balance
- Add `balance` column to `budgets`
- Function to update budgets balance
- PostgreSQL trigger on transaction INSERT/UPDATE/DELETE that walks up budget tree
- Update `Budget` interface + display balance on `BudgetCard`

#### S2-5: Pagination for Transactions
- Add pagination UI to `TransactionContainer`

#### S2-6: Transaction Search / Filter
- Search input, type filter (all/add/withdraw), amount range filter on `TransactionContainer`
- Filters apply on top of pagination

#### S2-7: Move Budget
- Update budget UPDATE RLS to allow `parent_id` changes (avoid circular)
- `useBudgetStructure` hook
- `MoveBudgetModal` + `MoveBudgetButton`
- Add move option to `BudgetDetail` header; wire to `updateBudget`

#### S2-8: Move Transaction
- Update transactions UPDATE RLS to allow `budget_id` changes (target must be user-owned)
- `MoveTransactionModal` + `MoveTransactionButton`
- Wire `useBudgetStructure` to the modal
- Add move option to `TransactionCard`; wire to `updateTransaction`; refetch on success

#### S2-9: Transfer Money Between Budgets
- Extend `TransactionType` with `'transfer'`; allow negative amount when type = 'transfer'
- `createTransfer` service (creates two transactions; rollback on partial failure)
- `filterNonTransfers` / `filterTransfers` helpers
- `TransferModal`, `TransferCard` components
- `BalanceSummary` uses `filterNonTransfers`
- `TransactionContainer` renders `TransferCard` vs `TransactionCard` per type
- Transfer button on `BudgetDetail`

#### S2-10: Income as Special Budget
- Add `is_income` flag to `budgets`
- Update RLS for income budget rules
- Distinct UI on Dashboard and Budget Manager
- Income flows to other budgets via Transfer feature

#### S2-11: Budget Manager (Hierarchy Tree)
- `/budgets` page with recursive tree component
- Expand/collapse per node
- Route in `App.tsx` + Sidebar link

#### S2-12: Budget Limits + Warnings + Alerts
- Add `limit` and `reset_period` columns to `budgets`
- Compute current spend from transactions filtered by reset period
- Show limit + current spend on `BudgetCard` and `BudgetDetail`
- Warning UI at 80% of limit; alert UI when exceeded; alert when balance below threshold

#### S2-13: Stats Page
- `/stats` page: spending over time, per-budget breakdown, income vs expenses
- Route in `App.tsx` + Sidebar link

---

### Stage 3

#### S3-1: Multi-Currency
- `currency` field on `transactions` and `budgets`
- Integrate exchange rate API
- Currency selector on transaction forms
- Convert to base currency for balance calculations

#### S3-2: Scheduled & Recurring Transactions (AutoPay)
- `scheduled_transactions` table + RLS
- Supabase Edge Function or cron scheduler
- `/scheduled` page with card + create modal
- One-time and recurring support; pre-run reminders

#### S3-3: Session Management
- List active sessions in Settings page
- Revoke individual / all other sessions
- Device info + last-active per session
- Wire to Supabase auth session API

#### S3-4: Bill Splitter
- `BillSplit` modal: total + participants
- Split equally or custom; per-participant transactions
- Track who has paid

#### S3-5: Loan & Owes Tracking
- `loans` table; track lent vs owed
- Mark as settled; outstanding dashboard
- Link loans to transactions

#### S3-6: Profiles
- `profiles` table + data migration
- `/profile` page — avatar, display name, settings
- RLS policies for profile-aware queries

#### S3-7: AI Agent
- Phase 1 — Read only: integrate Anthropic API, chat interface, agent reads budgets/transactions, gives spending insights
- Phase 2 — Write: tools (`create_budget`, `create_transaction`, `move_budget`, `transfer_money`) + action confirmation UI
