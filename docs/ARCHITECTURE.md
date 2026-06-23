# ARCHITECTURE
This document describes the structure and conventions of the Fintrack frontend.

---

## Data Model

Fintrack uses a strict separation between income management and spending management. Each domain has a single clear purpose:

| Domain | Purpose |
| --- | --- |
| **Incomes** | Independent records that log money entering the system (from salary, freelance, etc.) |
| **Allocations** | Move money from an income source into a spending budget (the sole entry point for budget funds) |
| **Budgets** | Spending-only envelopes; balance grows only via allocations, shrinks via transactions and outgoing transfers |
| **Transactions** | Spending records logged against a budget |
| **Transfers** | Move money between spending budgets |
| **Liabilities** *(planned)* | Track loans and debts |

**Why this model:**
- Each table has an unambiguous purpose — no dual-role types (e.g. `type: 'add' | 'withdraw'`)
- Income and spending are fully decoupled, giving an honest view of financial condition
- Bank API imports anchor cleanly to the Incomes table
- Allocations mirror the envelope method: money must be deliberately assigned before it can be spent

**Previous architecture (deprecated):**
The original model used a single `transactions` table with a `type: 'add' | 'withdraw'` column and a special `is_income` flag on budgets. This created ambiguity between income tracking and spending tracking, made bank API integration awkward, and conflated two distinct financial concepts into one table.

---

## Folder Layout

```
frontend/
├── src/
│   ├── main.tsx            — React entry point
│   ├── App.tsx             — router + provider composition
│   └── pages/              — top-level route components (see PAGES.md)
├── layouts/
│   └── ProtectedLayout.tsx — app shell (Sidebar, NavigationArrow, Outlet)
├── routes/
│   └── ProtectedRoute.tsx  — auth guard; redirects unauthenticated users to /
├── components/
│   ├── budgets/            — budget UI (cards, modals, containers)
│   ├── transactions/       — transaction UI (cards, modals, containers)
│   ├── transfers/          — transfer UI (cards, modals, containers)
│   ├── incomes/            — income UI (cards, modals, containers)
│   ├── allocations/        — allocation UI (cards, modals, containers)
│   ├── loaders/            — PageLoader, skeleton loaders
│   └── Toast.tsx           — rendered by NotificationProvider
├── hooks/                  — data-fetching hooks (one per domain)
├── contexts/               — React Context definitions
├── providers/              — Provider implementations paired with contexts
└── backend/
    ├── supabase.ts         — Supabase client
    ├── services/           — API calls (see SERVICES.md)
    └── types/              — TypeScript types (see TYPES.md)
```

---

## Layers

1. **Pages** — route-level components. Own modal state (`ModalState` discriminated union), call hooks for data, compose containers and buttons.
2. **Components** — grouped by domain. Buttons trigger modal state changes in the parent page; modals mutate via services and call query refetches.
3. **Hooks** — one per domain (`useBudgets`, `useTransactions`, `useTransfers`, `useIncomes`, `useAllocations`). Encapsulate fetch + state; expose `{ data, loading, error, refetch }`-style query objects.
4. **Contexts + Providers** — shared cross-cutting state: `AuthContext`, `NavigationContext` (in-app back button target), `NotificationContext` (toasts).
5. **Services** — stateless functions that call Supabase. Never accept `user_id`. Throw on failure.
6. **Types** — shared interfaces used by both services and UI.

---

## Conventions

### Data fetching
- One hook per domain. Pass a scoping id (e.g. `useTransactions(budgetId | null)` — null for all).
- Hooks expose a query object passed down to containers and modals.
- Mutations happen in service calls from within modals; on success, call `query.refetch()`.

### Modal state pattern
Pages own a single `ModalState` discriminated union:
```ts
type ModalState =
  | { type: 'createBudget' }
  | { type: 'addTransaction' }
  | { type: 'deleteBudgetConfirm' }
  | { type: 'moveBudget' }
```
Buttons set `modalState`; modals render conditionally and close via `setModalState(null)`. Keeps only one modal open at a time.

### Balance calculation

Balance is never stored as a column — it is always derived client-side from React Query cached data.

- **Income balance** — `SUM(incomes) - SUM(allocations out)`
- **Budget balance** — `SUM(allocations in) - SUM(transactions)`
- **Overall balance** — `SUM(incomes) - SUM(all transactions)`

Computation happens inside the relevant `BalanceSummary` component, reading from hooks that are already cached on the page. No intermediate balance hooks (`useIncomeBalance`, etc.) are created unless the same calculation is needed in multiple places.

**Why:** storing `.balance` requires triggers on every income, allocation, transfer, and transaction mutation — multiple surfaces that can silently drift. Derived balance is always correct by construction and eliminates an entire class of stale-data bugs.

---

### Optimistic updates
- Mutation services throw on failure.
- UI updates immediately (optimistic), refetches to reconcile, rolls back inside `catch` if the call fails.

### Naming
- Components: `<Domain><Action><Kind>.tsx` — e.g. `CreateBudgetModal`, `DeleteTransactionButton`.
- Button + Modal pairs are co-located in the same domain folder.

### Routing
- Routes composed in `src/App.tsx`.
- `ProtectedRoute` (`routes/`) guards auth; `ProtectedLayout` (`layout/`) wraps the app shell (sidebar + back arrow).
- `NavigationContext.setBackTo(path)` powers the in-app back arrow; pages set it on mount, clear on unmount.

### Styling
- Tailwind CSS utility classes, dark theme (`bg-gray-950`, `text-emerald-400` accent).
- Responsive: `md:` for tablet, `lg:` for desktop. Mobile-first.

### Error & loading states
- `PageLoader` for full-page loads.
- Skeleton loaders inside containers (`BudgetContainer`, `TransactionContainer`).
- Errors from services surface via toasts (`NotificationContext`) on mutations, or inline messages on page-level fetches.

---

## Providers (from outer to inner in `App.tsx`)
1. `NotificationProvider` — toasts
2. `AuthProvider` — current user, auth state
3. `NavigationProvider` — back-button target
4. `Router` — routes
