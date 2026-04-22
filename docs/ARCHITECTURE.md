# ARCHITECTURE
This document describes the structure and conventions of the Fintrack frontend.

---

## Folder Layout

```
frontend/
├── src/
│   ├── main.tsx            — React entry point
│   ├── App.tsx             — router + provider composition
│   └── pages/              — top-level route components (see PAGES.md)
├── components/
│   ├── budgets/            — budget UI (cards, modals, buttons)
│   ├── transactions/       — transaction UI (cards, modals, balance summary)
│   ├── protected-layout/   — Sidebar, NavigationArrow, ProtectedLayout wrapper
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
3. **Hooks** — one per domain (`useBudgets`, `useTransactions`, `useAuth`, `useBudgetStructure`). Encapsulate fetch + state; expose `{ data, loading, error, refetch }`-style query objects.
4. **Contexts + Providers** — shared cross-cutting state: `AuthContext`, `NavigationContext` (in-app back button target), `NotificationContext` (toasts).
5. **Services** — stateless functions that call Supabase. Never accept `user_id`. Throw on failure.
6. **Types** — shared interfaces used by both services and UI.

---

## Conventions

### Data fetching
- One hook per domain. Pass a scoping id (e.g. `useBudgets(budgetId | null)` — null for root).
- Hooks expose a query object (`budgetQuery`, `transactionQuery`) passed down to containers and modals.
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

### Optimistic updates
- Mutation services throw on failure.
- UI updates immediately (optimistic), refetches to reconcile, rolls back inside `catch` if the call fails.

### Naming
- Components: `<Domain><Action><Kind>.tsx` — e.g. `CreateBudgetModal`, `DeleteTransactionButton`.
- Button + Modal pairs are co-located in the same domain folder.

### Routing
- Routes composed in `src/App.tsx`.
- Protected routes nested under `ProtectedLayout` (sidebar + auth gate).
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
