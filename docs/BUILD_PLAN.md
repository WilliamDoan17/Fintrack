# BUILD PLAN
This document outlines the full development plan for Fintrack.

## Scope

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

---

## Development Philosophy
- Vertical phases — one complete feature at a time
- CR (Create + Read) before UD (Update + Delete)
- Backend (RLS + services) before frontend (UI)
- Optimistic updates on the frontend — rollback on failure via try/catch
- Test each phase via UI + Supabase dashboard before moving on

---

## MVP Phases

### Phase 1: Auth ✅
**Services:**
- `signupWithEmailAndPassword(email, password)` → void
- `loginWithEmailAndPassword(email, password)` → void
- `logout()` → void

**Tasks:**
- Link Supabase to the project
- Write auth services
- Set up protected routes

**Pages:**
- `Auth.tsx` — fully functional (signup, login, tab switching, wired to services)

---

### Phase 2: Create + View Budgets ✅
**Services:**
- `createBudget(BudgetInput)` → void
- `getRootBudgets()` → Budget[]

**Tasks:**
- Write RLS policies for budget INSERT, SELECT
- Write budget services

**Pages:**
- `Dashboard.tsx` — root budgets list, create budget modal

---

### Phase 3: Budget Detail ✅
**Services:**
- `getBudget(budget_id)` → Budget
- `getChildBudgets(parent_id)` → Budget[]

**Tasks:**
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — budget name, sub-budgets list, create sub-budget modal

---

### Phase 4: Create + View Transactions + Balance ✅
**Services:**
- `createTransaction(TransactionInput)` → void
- `getBudgetTransactions(budget_id)` → Transaction[]
- `getAllTransactions()` → Transaction[]

**Tasks:**
- Write RLS policies for transaction INSERT, SELECT
- Write transaction services
- Write `get_budget_transactions` PostgreSQL recursive function

**Pages:**
- `BudgetDetail.tsx` — add transaction form, transaction list (recursive), budget balance
- `Dashboard.tsx` — recent transactions list, overall balance

---

### Phase 5: Update + Delete Budgets ✅
**Services:**
- `updateBudget(budget_id, Partial<BudgetInput>)` → void
- `deleteBudget(budget_id)` → void

**Tasks:**
- Write RLS policies for budget UPDATE, DELETE
- Fixed bug in budget UPDATE RLS `with check` — `parent_id` now checked against user's own budgets
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — edit budget name inline, delete budget with confirmation modal

---

### Phase 6: Update + Delete Transactions ✅
**Services:**
- `updateTransaction(transaction_id, Partial<TransactionInput>)` → void
- `deleteTransaction(transaction_id)` → void

**Tasks:**
- Write RLS policies for transaction UPDATE, DELETE
- Transaction UPDATE `with check` verifies new `budget_id` still belongs to user
- Write transaction services

**Pages:**
- `BudgetDetail.tsx` — edit/delete actions on transaction list
- `Dashboard.tsx` — edit/delete actions on recent transactions

---

### Phase 7: Polish ✅
**Tasks:**
- Add Toast notification system (NotificationContext + NotificationProvider)
- Wire Toast to all mutations across all modals
- Add collapsible Sidebar with user info + logout
- Add NavigationArrow with NavigationContext for in-app back navigation
- Add ProtectedLayout wrapping all protected pages
- Add Landing page (`/`)
- Polish BalanceSummary — 30% width, max height
- Skeleton loaders for BudgetContainer and TransactionContainer
- TransactionContainer expanded overlay — show all transactions
- Deploy to Vercel — SPA routing fix via `vercel.json`

---

## Stage 2 — UI & Core Features

### S2-1: useReactQuery ⬜
**Tasks:**
- Refactor `useBudgets` to use React Query
- Refactor `useTransactions` to use React Query
- Refactor `useAuth` to use React Query
- Remove manual `useState/useEffect` patterns from hooks
- Test caching and automatic refetch behavior

---

### S2-2: Dark / Light Mode ⬜
**Tasks:**
- Create `ThemeContext` + `ThemeProvider`
- Add toggle button to Sidebar
- Update all Tailwind classes to support light mode variants
- Persist preference to localStorage

---

### S2-3: Responsive UI ⬜
**Tasks:**
- Audit all pages for mobile breakpoints
- Sidebar auto-collapses on small screens
- Update Dashboard and BudgetDetail grids for mobile
- Test on common breakpoints (sm, md, lg)

---

### S2-4: BudgetCard Balance ✅
**Tasks:**
- Add `balance` column to `budgets` table ✅
- Write function to update budgets balance ✅
- update_all_budgets_balance run ⬜ (needs to be run in Supabase)
- Write PostgreSQL trigger to update balance on transaction INSERT/UPDATE/DELETE ⬜ (planned)
- Trigger walks up budget tree to update parent balances ⬜ (planned)
- Update `Budget` interface to include `balance` ✅
- Display balance on `BudgetCard` ✅

---

### S2-5: Pagination for Transactions ✅
**Tasks:**
- Add pagination UI to `TransactionContainer` ✅

---

### S2-6: Transaction Search / Filter ✅
**Tasks:**
- Add search input to `TransactionContainer` ✅
- Add type filter (all / add / withdraw) ✅
- Add amount range filter ✅
- Filters apply on top of pagination ✅

---

### S2-7: Budget Manager (Hierarchy Tree) ⬜
**Tasks:**
- Create `/budgets` page
- Write recursive tree component
- Support expand/collapse per node
- Add route to `App.tsx` and link to Sidebar

---

### S2-8: Move Budget ⬜
**Tasks:**
- Update budget UPDATE RLS to allow `parent_id` changes
- Create `BudgetSelector` component
- Add move option to `BudgetDetail` header
- Wire to `updateBudget` service

---

### S2-9: Move Transaction ⬜
**Tasks:**
- Add budget selector to `UpdateTransactionModal`
- Wire to `updateTransaction` service
- Refetch transaction list on success

---

### S2-10: Transfer Money Between Budgets ⬜
**Tasks:**
- Design transfer as two transactions: withdraw from source, add to destination
- Create `TransferModal` component
- Write `transferMoney` service (atomic — both or neither)
- Handle rollback if one side fails
- Add transfer button to `BudgetDetail`

---

### S2-11: Income as Special Budget ⬜
**Tasks:**
- Add `is_income` flag to `budgets` table
- Update RLS for income budget rules
- Show income budget distinctly in Dashboard and Budget Manager
- Income transfers to other budgets via Transfer feature

---

### S2-12: Budget Limits + Warnings + Alerts ⬜
**Tasks:**
- Add `limit` and `reset_period` columns to `budgets` table
- Calculate current spend from transactions filtered by reset period
- Show limit and current spend on `BudgetCard` and `BudgetDetail`
- Warning UI at 80% of limit
- Alert UI when limit is exceeded
- Alert UI when balance falls below threshold

---

### S2-13: Stats Page ⬜
**Tasks:**
- Create `/stats` page
- Spending over time chart (by week/month)
- Per-budget breakdown chart
- Income vs expenses chart
- Add route to `App.tsx` and link to Sidebar

---

## Stage 3 — Advanced & Scale

### S3-1: Multi-Currency ⬜
**Tasks:**
- Add `currency` field to `transactions` and `budgets`
- Integrate exchange rate API
- Currency selector on transaction forms
- Convert to base currency for balance calculations

---

### S3-2: Scheduled & Recurring Transactions (AutoPay) ⬜
**Tasks:**
- Create `scheduled_transactions` table
- Write RLS policies
- Set up Supabase Edge Function or cron scheduler
- Create `/scheduled` page with card + create modal
- One-time and recurring transaction support
- Reminders before scheduled run

---

### S3-3: Session Management ⬜
**Tasks:**
- List active sessions in Settings page
- Revoke individual and all other sessions
- Show device info + last active per session
- Wire to Supabase auth session API

---

### S3-4: Bill Splitter ⬜
**Tasks:**
- Create `BillSplit` modal
- Input total amount + participants
- Split equally or custom amounts
- Generate split transactions per participant
- Track who has paid

---

### S3-5: Loan & Owes Tracking ⬜
**Tasks:**
- Create `loans` table
- Track money lent and money owed
- Mark loans as settled
- View outstanding loans/owes dashboard
- Link loans to transactions

---

### S3-6: Profiles ⬜
**Tasks:**
- Create `profiles` table
- Plan and execute data migration
- Profile page (`/profile`) — avatar, display name, settings
- Update RLS policies for profile-aware queries

---

### S3-7: AI Agent ⬜
**Tasks:**
- Phase 1 — Read only
  - Integrate Anthropic API
  - Chat interface component
  - Agent reads budgets and transactions
  - Agent gives spending insights and planning advice
- Phase 2 — Write operations
  - Define tools: `create_budget`, `create_transaction`, `move_budget`, `transfer_money`
  - Action confirmation UI before agent executes writes

---

## Post Stage 3 — Noted for Later
- Onboarding — first time user guided setup flow
- Data management — CSV export/import, backup & restore
- Social/Sharing — shared budgets between users (couples, families, roommates)
