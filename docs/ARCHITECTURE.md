# ARCHITECTURE

How Fintrack is built, why it's built that way, and the paths a user action takes
through it. Conventions live here too — this is the one implementation doc.

Inventory (what components/hooks/types exist) is deliberately **not** here. That's
what the code is for, and a hand-maintained copy only tells the truth on the day
it's written.

---

## Data model

Strict separation between money entering the system and money being spent. Each
table has exactly one job.

| Table                     | Job                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `incomes`                 | Money entering the system. Independent records, not tied to a budget.                  |
| `allocations`             | Move money from income into a budget. **The only way money enters a budget.**          |
| `budgets`                 | Spending envelopes. Nestable via `parent_id`. Optional `balance_threshold` for alerts. |
| `transactions`            | Spending, logged against one budget.                                                   |
| `transfers`               | Move money between two budgets. Internal — never changes net worth.                    |
| `liabilities` _(planned)_ | Money owed to or by me.                                                                |

### Why this model

- **No dual-role columns.** The old model had `transactions.type: 'add' | 'withdraw'`
  and an `is_income` flag on budgets, so one table meant two things and one row type
  meant two concepts. Every read had to branch on it.
- **Income and spending are decoupled**, which is what makes an honest "what's
  actually free" number possible.
- **Allocations enforce the envelope method** at the schema level: money must be
  deliberately assigned before it can be spent. This is a product decision, not a
  technical one — see [SCOPE.md](SCOPE.md).
- **Bank imports anchor to `incomes`** cleanly, with no type disambiguation.

The migration away from the old model (`type`, `is_income`, stored `.balance`) is
complete. It cost a 23-step migration across dev and prod, which is the practical
argument for sketching a flow before building one.

### Balance is derived, never stored

No table has a `balance` column. Every balance is computed client-side from
React Query cached data:

| Balance     | Formula                                                        | Where                                        |
| ----------- | -------------------------------------------------------------- | -------------------------------------------- |
| Overall     | `SUM(incomes) − SUM(all transactions)`                         | `BalanceSummary` in `Dashboard.tsx`          |
| Unallocated | `SUM(incomes) − SUM(all allocations)`                          | `IncomeBalanceSummary` in `IncomeDetail.tsx` |
| Per budget  | `allocations_in − transactions + transfers_in − transfers_out` | `useBudgetBalance` in `hooks/budgets.ts`     |

Transfers are excluded from the overall balance because they're internal moves —
money changing envelopes doesn't change how much money exists.

**Why derived:** a stored balance needs a trigger on every income, allocation,
transfer, and transaction mutation. That's four write surfaces per balance, each of
which can silently drift. Derived balance is correct by construction.

**Cost of this choice:** balances need every contributing row in the cache, so a
budget page fetches its transactions, transfers, and allocations before it can show
a number. Fine at personal scale; would need reconsidering at thousands of rows
per budget.

---

## Layout

```
frontend/
  src/
    main.tsx              React entry
    App.tsx               router + provider composition
    pages/                one file per route
  layouts/                ProtectedLayout — app shell (sidebar, back arrow, Outlet)
  routes/                 ProtectedRoute — auth guard
  components/             grouped by domain: budgets/ transactions/ transfers/
                          incomes/ allocations/ loaders/ + shared (Tabs, Pagination, Toast)
  hooks/                  one file per domain; wraps services in React Query
  contexts/               context definitions (Auth, Navigation, Notification)
  providers/              provider implementations, paired 1:1 with contexts
  backend/
    supabase.ts           the client
    services/             one file per table; the ONLY layer that touches supabase
    types/                one file per table
  utils/
supabase/
  migrations/             schema, RLS, triggers, functions — the DB's source of truth
```

**Placement rules** — the part `ls` can't tell you:

- A new table adds one file each to `services/`, `types/`, `hooks/`, plus a migration.
- **Only `backend/services/` imports `supabase`.** Hooks call services; components
  call hooks. A component importing a service or the client is a layering bug.
- Hooks and services **never accept `user_id`**. Services read it internally via
  `supabase.auth.getUser()`; RLS enforces it server-side.
- Button + modal pairs are co-located in their domain folder.
- Keep vocabulary identical across layers: `allocations` table → `allocations.ts`
  service → `hooks/allocations.ts` → `components/allocations/`. This is what makes
  `grep -r allocation` return a whole vertical, and it's why the inventory docs
  weren't needed.

---

## Layers

```
page  →  component  →  hook  →  service  →  supabase  →  RLS / trigger
```

1. **Pages** own modal state and compose containers. Page-local summary components
   (`BalanceSummary`, `IncomeBalanceSummary`) live in the page file, not `components/`,
   because they're not reused.
2. **Components** are grouped by domain. Modals own form state and call mutation hooks.
3. **Hooks** wrap React Query. Queries return `{ <domain>, isLoading, error }`;
   mutations return the `useMutation` object and invalidate on success.
4. **Contexts + providers** carry cross-cutting state: auth user, back-button target,
   toasts.
5. **Services** are stateless async functions. They throw on failure and return
   `void` for mutations.
6. **Types** are shared between services and UI.

Provider nesting in `App.tsx`, outer to inner:
`AuthProvider → NotificationProvider → NavigationProvider → BrowserRouter`

---

## Conventions

### Query keys and invalidation

| Hook                                            | Key                                       |
| ----------------------------------------------- | ----------------------------------------- |
| `useBudgets(parentId)`                          | `['budgets', parentId]`                   |
| `useBudget(id)`                                 | `['budget', id]`                          |
| `useBudgetStructure()`                          | `['budget-structure']`                    |
| `useTransactions(budgetId \| null)`             | `['transactions', budgetId]`              |
| `useTransfers(budgetId \| null)`                | `['transfers', budgetId]`                 |
| `useAllocations()` / `useBudgetAllocations(id)` | `['allocations']` / `['allocations', id]` |
| `useIncomes()`                                  | `['incomes']`                             |

Mutations invalidate at **prefix level** (`['transactions']`, not
`['transactions', budgetId]`). This is deliberate: a transaction changes the balance
of its budget _and_ every ancestor budget, so narrow invalidation would leave stale
numbers up the tree. Domains with multiple keys declare a shared
`*_INVALIDATION_KEYS` array at the top of the hook file.

### Modal state

Pages own one `ModalState` discriminated union:

```ts
type ModalState =
  | { type: "createBudget" }
  | { type: "addTransaction" }
  | { type: "moveBudget" };
```

Buttons set it, modals render conditionally, `setModalState(null)` closes. One modal
open at a time, by construction. Simple pages use plain booleans instead
(`IncomeDetail`) — the union is for pages with three or more modals.

### Mutations

No optimistic updates. Mutations are pending → invalidate → refetch, with the submit
button disabled on `isPending`. Chosen for correctness over perceived speed: balances
are derived from several queries at once, so a rollback would have to unwind state
across all of them.

Success and failure both surface as toasts via `useNotification()`, from the modal's
`onSuccess` / `onError` callbacks.

### Errors and loading

- `PageLoader` for full-page loads, skeletons inside containers.
- Mutation errors → toast. Page-level fetch errors → inline message in the component
  that owns the query.

### Naming

- Components: `<Domain><Action><Kind>.tsx` — `CreateBudgetModal`, `DeleteTransactionConfirmModal`.
- Hooks: `use<Domain>` for queries, `use<Action><Domain>` for mutations.

### Styling

Tailwind, dark theme only (`bg-gray-950` surfaces, `text-emerald-400` accent,
`text-red-400` for negative). Mobile-first; `md:` tablet, `lg:` desktop.

---

## Flows

The thing the old implementation docs couldn't show: how one action crosses every
layer. Sketch one of these before building anything that touches money math or spans
layers — then correct it at sprint review and record the delta.

### Auth

```
/ (Landing) or /auth  →  PublicRoutes checks AuthContext
  → authenticated? redirect /dashboard
  → else render Outlet

/dashboard, /budget/:id, /income, /spending
  → ProtectedRoutes guard  →  ProtectedLayout shell  →  page
```

### Log a transaction

```
BudgetDetail  → modalState { type: 'addTransaction' }
  → AddTransactionModal
      pre-submit guards (client-side, warn-only):
        newBalance < 0                    → confirm "negative balance"
        newBalance <= balance_threshold   → confirm "at or below alert threshold"
      reads useBudgetBalance(budgetId) + useBudget(budgetId) for those checks
  → useCreateTransaction
  → transactions.createTransaction()      injects user_id from auth.getUser()
  → INSERT transactions                   RLS: user_id = auth.uid()
  → on_update trigger maintains updated_at
  → invalidate ['transactions'] ['budget'] ['budgets']
  → every visible balance recomputes from fresh cache
```

The threshold guards are **advisory** — the user can confirm past them. There is no
server-side constraint preventing a negative envelope, by design: real money goes
negative, and an app that refuses to record reality gets abandoned.

### Log income

```
IncomeDetail  → CreateIncomeModal
  → useCreateIncome  →  incomes.createIncome()  →  INSERT incomes
  → invalidate ['incomes']
  → Unallocated recomputes: SUM(incomes) − SUM(allocations)
```

### Allocate income to a budget

```
IncomeDetail  → CreateAllocationModal
  → useCreateAllocation  →  allocations.createAllocation()  →  INSERT allocations
  → invalidate ['allocations'] ['budgets']
  → Unallocated drops, target budget balance rises
```

This is the only path money enters a budget. If a future feature adds another one,
the envelope guarantee in [SCOPE.md](SCOPE.md) is broken and the thesis needs revisiting.

### Transfer between budgets

```
BudgetDetail  → CreateTransferModal  (from_budget_id, to_budget_id, amount)
  → useCreateTransfer  →  INSERT transfers
  → invalidate ['transfers'] ['budget'] ['budgets']
  → useBudgetBalance counts it as transfers_out for the source,
    transfers_in for the destination
  → overall balance unchanged (internal move)
```

### Reading a budget's transactions

```
useTransactions(budgetId)
  → transactions.getBudgetTransactions()
  → supabase.rpc('get_budget_transactions', { budget_id })
```

The only RPC in the app. Its definition lives in Supabase, not in the repo — see
Known drift.

---

## Known drift

Things that are true today and shouldn't be. Fix or accept, don't let them rot
silently.

1. **No SQL in the repo.** Schema, RLS, triggers, and `get_budget_transactions` exist
   only in the Supabase dashboard. `supabase/migrations/` above is the target, not
   the current state. Run `supabase db pull` to make it real. Until then the database
   has no version history and dev/prod are hand-synced.
2. **Parent budget balance is wrong when its children are funded.**
   `get_budget_transactions` is recursive (confirmed in the migration): a parent's
   transactions include every descendant's. `getBudgetAllocations` filters on
   `to_budget_id = budgetId` and `getBudgetTransfers` on `from/to_budget_id = budgetId`,
   neither recursive. So `useBudgetBalance` for a parent subtracts the children's
   spending without adding the money allocated or transferred to them. Needs a decision
   on whether a parent's balance rolls up its children or shows only its own.
3. **`AddTransactionModal` takes a dead `budgetType: 'spending' | 'income'` prop.**
   Only ever passed `'spending'` (`BudgetDetail.tsx:306`). Left over from the
   `is_income` era that `AM-3g` was supposed to finish removing. The `'income'` branch
   is unreachable.
