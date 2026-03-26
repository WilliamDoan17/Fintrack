# FINTRACK PROJECT CONTEXT
A comprehensive summary of all decisions, architecture, and progress made in the Fintrack project.

---

## Project Overview
Fintrack is a personal finance web app built around budget-based money allocation. Every dollar has a purpose — split into budgets, tracked through transactions, visualized on a dashboard.

**Built for:** Anyone who wants clarity over their finances, starting with the developer himself.

---

## Tech Stack
- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS (pure, no shadcn)
- **Backend:** Supabase (Auth + PostgreSQL + RLS)

---

## Design Decisions
- **Dark mode only**
- **Color scheme:**
  - Background: `gray-950`
  - Surface/card: `gray-900`
  - Primary accent: `emerald-500`
  - Hover accent: `emerald-400`
  - Active/pressed: `emerald-600`
  - Borders: `gray-700` / `gray-800`
  - Text primary: `white`
  - Text secondary: `gray-400` / `gray-500`
  - Negative/withdraw: `red-400` / `red-500`
- **Layout:** `max-w-6xl mx-auto px-8 py-12` centered container
- **Cards:** `rounded-xl`, `border border-gray-800`, subtle emerald glow on hover
- **Buttons:** `cursor-pointer`, `hover:scale-[1.02]`, `active:scale-[0.98]`, `transition-all`
- **Inputs:** `bg-gray-800`, `border-gray-700`, `focus:border-emerald-400`
- **Philosophy:** Flat and minimal — effects only on interactions

---

## Folder Structure
```
frontend/
  src/
    backend/
      services/
        auth.ts
        budgets.ts
        transactions.ts
      supabase.ts
    frontend/
      pages/
        Landing.tsx
        Auth.tsx
        Dashboard.tsx
        BudgetDetail.tsx
      components/
        loaders/
          PageLoader.tsx
        protected-layout/
          ProtectedLayout.tsx
          Sidebar.tsx
          NavigationArrow.tsx
        budgets/
          BudgetCard.tsx
          BudgetContainer.tsx
          CreateBudgetModal.tsx
          CreateBudgetButton.tsx
          UpdateBudgetNameInput.tsx
          UpdateBudgetNameButton.tsx
          DeleteBudgetButton.tsx
          DeleteBudgetConfirmModal.tsx
        transactions/
          TransactionCard.tsx
          TransactionContainer.tsx
          AddTransactionModal.tsx
          AddTransactionButton.tsx
          UpdateTransactionModal.tsx
          UpdateTransactionButton.tsx
          DeleteTransactionConfirmModal.tsx
          DeleteTransactionButton.tsx
          BalanceSummary.tsx
        Toast.tsx
      hooks/
        useAuth.ts
        useBudgets.ts
        useTransactions.ts
      contexts/
        AuthContext.tsx
        NotificationContext.ts
        NavigationContext.ts
      providers/
        AuthProvider.tsx
        NotificationProvider.tsx
        NavigationProvider.tsx
    App.tsx
```

---

## Data Schema

### budgets
```sql
create table budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  name text not null check(name <> ''),
  parent_id uuid references budgets(id) on delete cascade
);
```

### transactions
```sql
create type transaction_type as enum('add', 'withdraw');

create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  budget_id uuid not null references budgets(id) on delete cascade,
  type transaction_type default 'add',
  amount numeric(15, 2) check(amount > 0) not null,
  name text check(name <> '') not null,
  created_at timestamptz default now() not null
);
```

---

## RLS Policies

### budgets
```sql
-- SELECT
create policy "users can select own budgets" on budgets for select
using (user_id = auth.uid());

-- INSERT
create policy "users can insert own budgets" on budgets for insert
with check (
  user_id = auth.uid() and
  (parent_id is null or exists (
    with new_budget as (select parent_id as pid)
    select 1 from budgets b, new_budget
    where b.id = new_budget.pid and b.user_id = auth.uid()
  ))
);

-- UPDATE
create policy "users can update own budgets" on budgets for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid() and
  (parent_id is null or exists (
    select 1 from budgets b
    where b.id = parent_id and b.user_id = auth.uid()
  ))
);

-- DELETE
create policy "users can delete own budgets" on budgets for delete
using (user_id = auth.uid());
```

### transactions
```sql
-- SELECT
create policy "user can select own transactions" on transactions for select
using (user_id = auth.uid());

-- INSERT
create policy "user can insert own transactions" on transactions for insert
with check (
  user_id = auth.uid() and
  exists (
    with t as (select budget_id as bid)
    select 1 from budgets b, t
    where t.bid = b.id and b.user_id = auth.uid()
  )
);

-- UPDATE
create policy "user can update own transactions" on transactions for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid() and
  exists (
    select 1 from budgets b
    where b.id = budget_id and b.user_id = auth.uid()
  )
);

-- DELETE
create policy "user can delete own transactions" on transactions for delete
using (user_id = auth.uid());
```

---

## PostgreSQL Functions

### get_budget_transactions(budget_id uuid)
Recursively fetches all transactions from a budget and its sub-budgets.
```sql
create or replace function get_budget_transactions(budget_id uuid)
returns setof transactions as
$$
begin
  return query
  with recursive budget_tree as (
    select id from budgets where id = budget_id
    union all
    select b.id from budgets b
    inner join budget_tree bt on b.parent_id = bt.id
  )
  select t.* from transactions t
  where t.budget_id in (select id from budget_tree);
end;
$$ language plpgsql;
```

---

## Services

### Conventions
- Services never accept `user_id` as a parameter — retrieved internally via `supabase.auth.getUser()`
- RLS handles user-level data protection
- Mutations return `void` on success, throw on failure
- UI uses optimistic updates where applicable — refetch on success, catch on failure
- All service functions use camelCase naming

### auth.ts
- `signupWithEmailAndPassword(email, password)` → `void`
- `loginWithEmailAndPassword(email, password)` → `void`
- `logout()` → `void`

### budgets.ts
- `Budget` interface: `id`, `user_id`, `created_at`, `name`, `parent_id`
- `BudgetInput` type: `Omit<Budget, 'id' | 'created_at'>` with `parent_id?`
- `createBudget(input)` → `void`
- `updateBudget(id, Partial<BudgetInput>)` → `void`
- `deleteBudget(id)` → `void`
- `getBudget(id)` → `Budget | null`
- `getRootBudgets()` → `Budget[]`
- `getChildBudgets(parentId)` → `Budget[]`

### transactions.ts
- `Transaction` interface: `id`, `user_id`, `budget_id`, `type`, `amount`, `name`, `created_at`
- `TransactionInput` type: `Omit<Transaction, 'id' | 'user_id' | 'created_at'>`
- `TransactionType`: `'add' | 'withdraw'`
- `createTransaction(input)` → `void`
- `updateTransaction(id, Partial<TransactionInput>)` → `void`
- `deleteTransaction(id)` → `void`
- `getAllTransactions()` → `Transaction[]` (ordered by `created_at` desc)
- `getBudgetTransactions(budgetId)` → `Transaction[]` (recursive via RPC)

---

## Hooks

### useAuth
- Returns: `{ user, loading, error }`
- Sets up `onAuthStateChange` listener only — no `getCurrentUser` call
- Used by `AuthContext`

### useBudgets(parentId: string | null)
- Returns: `{ budgets, loading, error, refetch }`
- `parentId = null` → fetches root budgets
- `parentId = string` → fetches child budgets
- Uses `useCallback` + `useEffect` pattern

### useTransactions(budgetId: string | null)
- Returns: `{ transactions, loading, error, refetch }`
- `budgetId = null` → `getAllTransactions()`
- `budgetId = string` → `getBudgetTransactions()` (recursive)

---

## Contexts & Providers

### AuthContext + AuthProvider
- Global user state
- `useAuth` hook — sets up `onAuthStateChange`, exposes `user`, `loading`, `error`

### NotificationContext + NotificationProvider
- Global toast notification state
- `useNotification` hook — exposes `notify(message, type)`
- Auto-dismisses toasts after 3 seconds
- Mounted in `App.tsx` — available everywhere

### NavigationContext + NavigationProvider
- Global back navigation state
- `useNavigation` hook — exposes `backTo`, `setBackTo`
- `BudgetDetail` sets `backTo` on mount, clears on unmount
- `NavigationArrow` reads `backTo` — returns null on Dashboard

---

## Auth Architecture
- `AuthContext` + `AuthProvider` — global user state
- `useAuth` hook — sets up `onAuthStateChange` only, exposes `user`, `loading`, `error`
- `PublicRoutes` — redirects authenticated users to `/dashboard`
- `ProtectedLayout` — layout component with Sidebar + NavigationArrow + Outlet, handles auth gating
- `PageLoader` — shown while auth state resolves

---

## Pages

### Landing (`/`)
- Hero section with headline + CTA → `/auth`
- Features section (3 cards)
- Navbar with Log in button

### Auth (`/auth`)
- Single page with tab state (`login` | `signup`)
- `LoginForm` and `SignupForm` inline components
- Error and loading state per form
- Redirects to `/dashboard` on success (via `PublicRoutes`)

### Dashboard (`/dashboard`)
- `BalanceSummary` (30% width) + `TransactionContainer` side by side
- `BudgetContainer` below
- `CreateBudgetModal` triggered by `CreateBudgetButton`
- `transactionQuery = useTransactions(null)` — all user transactions
- `budgetQuery = useBudgets(null)` — root budgets only

### BudgetDetail (`/budget/:id`)
- Header: budget name + `UpdateBudgetNameButton` + `DeleteBudgetButton`
- `UpdateBudgetNameInput` replaces header when editing
- `BalanceSummary` (30% width) + `TransactionContainer` side by side (recursive transactions)
- `BudgetContainer` for sub-budgets
- `CreateBudgetModal` with `parentId = budgetId`
- `AddTransactionModal` + `DeleteBudgetConfirmModal`
- Sets `backTo` in `NavigationContext` on mount

---

## Key Architecture Decisions

### Component naming pattern
- `budgetQuery` / `transactionQuery` — groups hook result as single prop
- `ReturnType<typeof useBudgets>` — TypeScript infers prop type from hook
- `refetch` — exposed from hooks, called after mutations

### Refetch pattern
- Mutations return `void`, throw on failure
- On success: call `refetch()` to update UI
- No optimistic updates for create (server generates `id`, `created_at`)
- Modal closes on success, stays open on error

### Modal state pattern
- Pages and containers use a union type `ModalState` instead of multiple booleans
- Invalid states (two modals open) are unrepresentable by design
- `TransactionContainer` uses `{ type, transaction }` collapsed union — transaction always present

### Toast notification pattern
- `notify(message, type)` called inside `.then()` and `.catch()` of mutations
- Inline `error` state kept as visual fallback on forms
- `NotificationProvider` owns toast array, auto-dismisses via `setTimeout`

### Navigation pattern
- `NavigationContext` stores `backTo` path
- `BudgetDetail` sets `backTo` based on `budgetInfo.parent_id`
- `NavigationArrow` returns `null` when `backTo` is null (Dashboard)
- Uses `navigate(backTo, { replace: true })` — in-app navigation, not browser history

### Balance calculation
- Derived from transaction list on the frontend — no extra DB call
- `BalanceSummary` takes `transactionQuery` — handles its own loading/error
- Auto-updates when `transactionQuery` refetches

### Skeleton loaders
- `BudgetContainerSkeleton` — lives at top of `BudgetContainer.tsx`
- `TransactionContainerSkeleton` — lives at top of `TransactionContainer.tsx`
- Replaces text loading states for better UX

---

## Deployment

- **Platform:** Vercel
- **Root directory:** `frontend/`
- **SPA routing fix:** `vercel.json` with rewrite rule `/(.*) → /index.html`
- **Environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## Build Plan

### Phase 1: Auth ✅
### Phase 2: Create + View Budgets ✅
### Phase 3: Budget Detail ✅
### Phase 4: Create + View Transactions + Balance ✅
### Phase 5: Update + Delete Budgets ✅
### Phase 6: Update + Delete Transactions ✅
### Phase 7: Polish ✅

---

## Stage 2 Roadmap
1. useReactQuery
2. Dark/light mode
3. Responsive UI
4. BudgetCard balance
5. Pagination for transactions
6. Transaction search/filter
7. Budget manager (hierarchy tree)
8. Move Budget
9. Move Transaction
10. Transfer money
11. Income as special budget
12. Budget limits + warnings + low balance alerts
13. Stats page

## Stage 3 Roadmap
1. Multi-currency
2. Scheduled & Recurring Transactions (AutoPay) + reminders
3. Session management
4. Bill splitter
5. Loan & owes
6. Profiles
7. AI Agent

## Post Stage 3 — Noted for Later
- Onboarding
- Data management (CSV export/import, backup & restore)
- Social/Sharing (shared budgets)
