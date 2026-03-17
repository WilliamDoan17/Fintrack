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
        Auth.tsx
        Dashboard.tsx
        BudgetDetail.tsx
      components/
        PageLoader.tsx
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
          BalanceSummary.tsx
      hooks/
        useAuth.ts
        useBudgets.ts
        useTransactions.ts
      contexts/
        AuthContext.tsx
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

-- INSERT (with CTE to avoid scope ambiguity)
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
with check (user_id = auth.uid());

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
with check (user_id = auth.uid());

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
- `getCurrentUser()` → `User | null`

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
- Sets up `onAuthStateChange` listener
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

## Auth Architecture
- `AuthContext` + `AuthProvider` — global user state
- `useAuth` hook — sets up `onAuthStateChange`, exposes `user`, `loading`, `error`
- `ProtectedRoutes` — uses React Router layout route pattern with `<Outlet />`
- `PublicRoutes` — redirects authenticated users to `/dashboard`
- `PageLoader` — shown while auth state resolves

---

## Pages

### Auth (`/auth`)
- Single page with tab state (`login` | `signup`)
- `LoginForm` and `SignupForm` inline components
- Error and loading state per form
- Redirects to `/dashboard` on success (via `PublicRoutes`)

### Dashboard (`/dashboard`)
- `BalanceSummary` + `TransactionContainer` in two-column grid
- `BudgetContainer` below
- `CreateBudgetModal` triggered by `CreateBudgetButton`
- `transactionQuery = useTransactions(null)` — all user transactions
- `budgetQuery = useBudgets(null)` — root budgets only

### BudgetDetail (`/budget/:id`)
- Header: budget name + `UpdateBudgetNameButton` + `DeleteBudgetButton`
- `UpdateBudgetNameInput` replaces header when editing
- `BalanceSummary` + `TransactionContainer` in two-column grid (recursive transactions)
- `BudgetContainer` for sub-budgets
- `CreateBudgetModal` with `parentId = budgetId`
- `AddTransactionModal` + `DeleteBudgetConfirmModal`

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

### Limit on TransactionContainer
- `useTransactions` fetches ALL transactions — no limit on service
- `TransactionContainer` accepts optional `limit` prop — slices for display
- `BalanceSummary` uses full transaction list for accurate calculations

### Balance calculation
- Derived from transaction list on the frontend — no extra DB call
- `BalanceSummary` takes `transactionQuery` — handles its own loading/error
- Auto-updates when `transactionQuery` refetches

---

## Build Plan

### Phase 1: Auth ✅
**Services:** `signupWithEmailAndPassword`, `loginWithEmailAndPassword`, `logout`, `getCurrentUser`

**Tasks:**
- Link Supabase to the project
- Write auth services
- Set up protected routes

**Pages:**
- `Auth.tsx` — fully functional (signup, login, tab switching, wired to services)

---

### Phase 2: Create + View Budgets ✅
**Services:** `createBudget`, `getRootBudgets`

**Tasks:**
- Write RLS policies for budget INSERT, SELECT
- Write budget services

**Pages:**
- `Dashboard.tsx` — root budgets list, create budget modal

---

### Phase 3: Budget Detail ✅
**Services:** `getBudget`, `getChildBudgets`

**Tasks:**
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — budget name, sub-budgets list, create sub-budget modal

---

### Phase 4: Create + View Transactions + Balance ✅
**Services:** `createTransaction`, `getBudgetTransactions`, `getAllTransactions`

**Tasks:**
- Write RLS policies for transaction INSERT, SELECT
- Write transaction services
- Write `get_budget_transactions` PostgreSQL recursive function

**Pages:**
- `BudgetDetail.tsx` — add transaction form, transaction list (recursive), budget balance
- `Dashboard.tsx` — recent transactions list, overall balance

---

### Phase 5: Update + Delete Budgets ✅
**Services:** `updateBudget`, `deleteBudget`

**Tasks:**
- Write RLS policies for budget UPDATE, DELETE
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — edit budget name inline, delete budget with confirmation modal

---

### Phase 6: Update + Delete Transactions ⬜
**Services:** `updateTransaction`, `deleteTransaction`

**Tasks:**
- Write RLS policies for transaction UPDATE, DELETE
- Write transaction services

**Pages:**
- `BudgetDetail.tsx` — edit/delete actions on transaction list
- `Dashboard.tsx` — edit/delete actions on recent transactions

---

### Phase 7: Polish ⬜
**Tasks:**
- Add NotiToast for mutation notifications
- DeleteBudgetButton: re-style the size
- Polish BalanceSummary: 30% full width, give it a max height
- Add navigation arrows for each page
- Polish the spinner for page navigation
- Loader for components (BudgetContainer)
- TransactionContainerExtended: show all transactions
- Log out button

---

## Post-MVP Notes
1. **Budget card balance** — add `balance` column to `budgets` table, maintained by a PostgreSQL trigger that walks up the budget tree on transaction INSERT/UPDATE/DELETE
2. **Stats page** — dropped for MVP
3. **Move budgets** — change `parent_id` via drag and drop or parent selector UI
4. **React Query** — replace manual `useState/useEffect` hooks for caching and automatic refetch
5. **Pagination** — add limit/offset to `getAllTransactions` when transaction count grows
6. **Materialized view** — pre-computed budget balances for fast reads at scale
