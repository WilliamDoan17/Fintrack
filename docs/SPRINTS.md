# SPRINTS

Working log. Newest sprint on top.

**A sprint is one feature, not a fixed period.** Opened when work starts, closed when
the feature is usable. Dates are recorded to see elapsed time, not to hit a target.

**Cap, not deadline.** Each sprint declares a session budget up front. When the budget
is spent the sprint closes — leftover work moves to the backlog. Scope slips, the
sprint doesn't. If a sprint stays open past ~2 weeks of active calendar time, the
feature was too big: split it and close the entry.

**Entry structure**

```
### <n> — <title>
Opened / Closed / Budget
**Triage:** what the friction log said when this sprint opened, and what I picked
**Outcome:** what I can do when this is done, in user terms
**Flow sketch:** (only if it crosses layers or touches money math — write BEFORE coding)
**Work:** checklist
**Review:** what actually shipped
**Retro:** what worked / what didn't / what the sketch got wrong / one change
```

The **delta between the sketch and what shipped** is the most valuable line in the
entry. That's the thing no plan could have told me.

---

<details>
  <summary>## 1 — Phone UI + new workflow</summary>

**Opened:** 2026-09-29
**Closed:** —
**Budget:** 3 sessions

**Triage:** none yet. [FRICTION.md](FRICTION.md) starts empty, this sprint seeds it.

**Outcome:** the app is pleasant enough on a phone that I'll use it for real money,
and the repo is organized for the new workflow: database in version control, three
docs instead of fifteen, friction log ready to collect.

Fintrack is already deployed to Vercel, so this is not a deployment sprint. It has two
halves. The UI half is the first real run of the friction-log-and-triage loop. The
workflow half finishes the move away from the waterfall doc set.

**Part A — Phone UI**

- [ ] Walk each screen on the actual phone and log every problem in
      [FRICTION.md](FRICTION.md) (do not fix anything yet):
  - [ ] `/auth`
  - [ ] `/dashboard`
  - [ ] `/income`
  - [ ] `/spending`
  - [ ] Modals opened from each screen
  - [ ] `/budget/:id`
- [ ] Triage the log (group, rank by hits, pick)
- [ ] Fix the picked items, worst first. What doesn't fit stays `open` in the log.

Unverified suspects from a grep for files with no responsive classes: `pages/Auth.tsx`,
`components/Tabs.tsx`, `components/Pagination.tsx`, `components/Toast.tsx`,
`MoveBudgetModal`, `MoveTransactionModal`, `UpdateBudgetNameInput`. Guesses only. Trust
the phone over this list.

**Part B — Workflow**

- [x] Pull the database into the repo, at `supabase/migrations/` (repo root, not
      inside `frontend/`)
  - [ ] Commit `supabase/config.toml` and `supabase/migrations/`. No service-role key.
- [x] Read the pulled SQL and confirm it covers every table, RLS policy, trigger and
      function that `SCHEMA.md`, `RLS.md`, `TRIGGERS.md` and `DB_FUNCTIONS.md` describe
- [x] Read `get_budget_transactions` in the pulled SQL. Does it recurse into
      sub-budgets? If so, `useBudgetBalance` is inconsistent (see Known drift below).
      Result: it recurses, and the bug is real. Logged in `ARCHITECTURE.md` Known drift #2
- [x] Write `CLAUDE.md` at the repo root: ~10 lines pointing at the three docs
- [x] Delete the documents that duplicate code or are replaced:
  - [x] Now: `COMPONENTS.md`, `HOOKS.md`, `SERVICES.md`, `TYPES.md`, `PAGES.md`,
        `PROGRESS.md`, `TASKS.md`, `BUILD_PLAN.md`, `TEMP_NOTES.txt`
  - [x] Only after the SQL check above passes: `SCHEMA.md`, `RLS.md`,
        `TRIGGERS.md`, `DB_FUNCTIONS.md`
- [ ] Update `README.md` to state the thesis in `SCOPE.md` (optional, cosmetic)

**Session plan** (a guide, not a promise): 1 = walk the screens and triage, 2 = fix the
picked items, 3 = Part B.

**Review:**

**Retro:**

  <summary>#2 — Envelope numbers agree + sidebar fix</summary>

**Opened:** 2026-10-14
**Closed:** —
**Budget:** 2 sessions (adjust)

**Triage:** FRICTION.md had 10 open entries (3 broken, 1 missing, 6 cosmetic) when the sprint
opened. Nearly all at Hits = 1, so frequency doesn't separate them; picked by severity
and by what blocks trusting the numbers. One more `broken` entry was added mid-sprint
(below).

- Picked: `/income` vs `/dashboard` — spending from a never-allocated budget lowers
  Balance but not Unallocated (broken, money math)
- Picked (FIRST): sub-budget create fails — `on_budgets_insert` RLS policy compares
  `b.id = b.parent_id`, never true for a non-null parent (broken; blocks creating
  sub-budgets and testing the rollup below)
- Picked: `/budget/:id` — a budget's balance doesn't include its sub-budgets' balances
  (broken, money math; same area as Known drift #2 in `ARCHITECTURE.md`)
- Picked: `/dashboard` Income card — shows total of all income rows, unclear whether it
  should show unallocated (missing; a decision that pairs with the one above)
- Added mid-sprint (2026-11-05): can't transfer parent → child in `CreateTransferModal`;
  the structure picker blocks the budget's own name (broken). Pulled in because it
  blocks verifying the rollup through the app (the parent → child transfer is a
  required check) and blocks recording that kind of transfer. Costs one Work slot.
- Picked: sidebar — menu and collapse buttons both visible on phone, first collapse
  press permanently toggles collapsed (cosmetic, but hit on every phone launch)
- Left open: 5 cosmetic entries (`/landing` scrollbar margin, `/auth` x3, budget search
  label)

**Outcome:** the dashboard and `/income` show numbers that agree, and the rule for what
counts as spendable is decided and enforced. The sidebar behaves predictably on a phone.

**Flow sketch:** (write BEFORE coding — touches money math)

- Decide: should a transaction on a budget with no allocation be blocked, warned, or
  allowed? Where is it enforced (service, RPC, or DB)?
  A transaction on a budget with no allocations should be warned, but softly:
  3 cases:
  - user says don't make it
  - user says make it and allocate to
  - user says make it but don't allocate
  => service layer, since using db layer cannot reach this

  **Trigger:** `newBalance <= (balance_threshold ?? 0)`. One condition, so it also
  covers `newBalance < 0`. Fires on funded-but-low budgets too, not only unallocated
  ones.

  **Warnings** (one dialog, one line chosen by case):
  - `newBalance < 0`: "This will put {budget} at −$X, which is more than you've
    assigned to it."
  - `0 <= newBalance <= threshold`: "This will leave {budget} at $X, at or below its
    alert threshold of $T."
  - `unallocated = 0` (added as a second line): "There is no unallocated income to
    cover this."

  **Options** (same three for both warnings):
  1. Cancel: don't make it
  2. Allocate $S and add. S = `min(unallocated, max(0, threshold) − newBalance)`.
     Disabled when `unallocated = 0`.
  3. Add without allocating (case 3, allowed)

  Compute S when the dialog opens and again at confirm, so a background refetch
  can't change the amount silently. Disable submit until budget balance and
  unallocated have both loaded.
- Decide: what does the dashboard Income card show — total income, or unallocated?
  **Decided:** the total-income card should not exist. If a card stays, it shows
  Unallocated only. Total income is not a number I act on; Unallocated is.
  - should it exist, if we can read everything from balance for now? For now, the only
    thing that gives us money is income, so
    balance = min(unallocated, total income − total transactions)
  - Case 3 is shown by the numbers, not blocked: Overall = `I − T` drops, Unallocated
    (`I − A`) doesn't. Add derived `useAvailable()` = `min(Unallocated, Overall)` and a
    small "N budgets overspent" line under it so the gap has a visible reason.
    `min` is exact only for one overspent envelope; the exact form is
    `Unallocated − Σ max(0, −balance_b)`. Name it "Available", not "Balance" (Overall
    already means `I − T`).
- Which formulas in `ARCHITECTURE.md` change?
  - Overall: renamed/complemented by Available (above)
  - Unallocated: unchanged
  - Per budget: changes only if rollup is chosen (allocations + transfers recursive
    like `get_budget_transactions`)

### Log a transaction

```
BudgetDetail  → modalState { type: 'addTransaction' }
  → AddTransactionModal
      pre-submit guard (client-side, warn-only), one dialog:
        newBalance <= (balance_threshold ?? 0)  → warning line by case (see above)
        unallocated = 0                         → extra line, option 2 disabled
        options: cancel | allocate $S and add | add without allocating
      reads useBudgetBalance(budgetId) + useBudget(budgetId) + useUnallocated()
  → one service call → RPC create_transaction_with_allocation (option 2)
      allocation + transaction in one DB transaction; not two hooks in the modal,
      so a failed second insert can't leave a stray allocation
  → useCreateTransaction                                      (options 3)
  → transactions.createTransaction()      injects user_id from auth.getUser()
  → INSERT transactions                   RLS: user_id = auth.uid()
  → on_update trigger maintains updated_at
  → invalidate ['transactions'] ['allocations'] ['budget'] ['budgets']
  → every visible balance recomputes from fresh cache
```

- Decide: how can balance rollup for budget be computed
  **Decided: roll up.** A budget's balance covers its whole subtree, so all three
  inputs (allocations, transactions, transfers) must be subtree-wide. Today only
  transactions are (`get_budget_transactions` recurses).
  Subtree balance = `allocations_in − transactions + transfers_in − transfers_out`,
  with every input taken over the whole subtree. A transfer with both ends inside the
  subtree is counted by both `in` and `out` (+x and −x), so it cancels in
  `transfers_in − transfers_out` and needs no special handling.
  The current `useBudgetBalance` classifies by `from_budget_id === budgetId`, which
  would misfile a transfer between two descendants as "in" with no matching "out".

  **How to get the subtree: RPCs, one definition in SQL**, mirroring
  `get_budget_transactions` (recursive CTE, `SECURITY INVOKER` so RLS applies, takes
  only `budget_id`). No `getDescendantIds` helper, no ids in the query key.
  - `get_budget_allocations(budget_id)`: allocations with `to_budget_id` in the subtree
  - `get_budget_transfers_in(budget_id)`: `to_budget_id` in the subtree
  - `get_budget_transfers_out(budget_id)`: `from_budget_id` in the subtree
  Neither filters the other end. Both must stay unfiltered the same way: filtering only
  one breaks the cancellation and the balance goes wrong.
  Split in/out instead of one transfers RPC with a `direction` column: each returns
  plain `SETOF transfers`, so no column list to keep in sync with the table, and
  `transfersIn` / `transfersOut` are just the sum of each result.
  - Because the key no longer carries the subtree, anything that changes the tree must
    invalidate `['allocations']`, `['transfers']`, `['transactions']`: create/delete
    budget and `MoveBudgetModal`.
  - Additive migrations first, then the code that calls them.
  - Rule: everything that affects balance is recursive. In and out are both
    subtree-wide (the RPCs walk the tree). Transfers with both ends inside appear in
    both results and cancel in the balance.
  - Known side effects, accepted for now, revisit after seeing it in the app:
    - `transfersIn` / `transfersOut` totals on the budget page include internal
      transfers, so each is larger than the money that actually crossed the boundary.
      The balance is still right.
    - `TransferContainer` lists in + out, so an internal transfer shows twice; dedupe by
      transfer id when merging.

**Questions**:

- Should unallocated be a query key? Answer: no, a derived hook `useUnallocated()`
  composing the incomes and allocations queries. A key would need invalidating from
  both mutations, which is the drift "derived, never stored" avoids.
- Hook values: a changed key (`budgetId`) returns the new key's data or `undefined`
  while loading; same key refetched updates and re-renders. Don't copy hook output
  into `useState`; compute in render.

**Work:**

- [x] **FIRST:** fix `on_budgets_insert` policy — new migration
      (`npx supabase migration new fix_budgets_insert_policy`), then `db push`
- [x] Write the flow sketch above
  - [x] Decide no-allocation behavior (warn, three options, service layer)
  - [x] Decide rollup: roll up
  - [x] Decide Income card: no total-income card; Unallocated only
- [ ] Sub-budget balance rollup (do first: the warning below reads this balance)
  - [x] Migration (additive): `get_budget_allocations`, `get_budget_transfers_in`,
        `get_budget_transfers_out`, each recursive like `get_budget_transactions`
  - [x] `npx supabase db push` before deploying the code that calls them
  - [x] Services: `getBudgetAllocations`, `getBudgetTransfersIn`,
        `getBudgetTransfersOut` call the RPCs
  - [x] Hooks (`hooks/allocations.ts`, `hooks/transfers.ts`): wrap them; add
        `useTransfersIn` / `useTransfersOut`
  - [x] `useBudgetBalance`: `transfersIn` / `transfersOut` from the two hooks; drop the
        `from_budget_id === budgetId` classification
  - [x] Invalidate `['allocations']` `['transfers']` `['transactions']` on budget
        create, delete and move
  - [x] `TransferContainer` lists in + out (hook combining the two; dedupe by id
        later if the duplicates look wrong in the app)
  - [ ] Check by hand: parent with a funded child, a transfer parent → child (the
        parent's balance must not change), a transfer child → sibling, a transfer
        from outside into a grandchild
  - [ ] `ARCHITECTURE.md`: update Per budget formula and close Known drift #2
- [ ] Transfer picker: allow a budget's own name in the structure picker, disable the
      transfer button when source and destination are the same budget. Do before the
      rollup hand-check, which needs a parent → child transfer through the app.
- [ ] `useUnallocated()` derived hook, `useAvailable()` = `min(Unallocated, Overall)`
- [ ] Money fix: warning dialog (three options) in `AddTransactionModal`
  - [ ] Migration (additive): RPC `create_transaction_with_allocation`. Takes the
        transaction fields and the allocation amount S from the dialog, uses
        `auth.uid()` for `user_id`, `SECURITY INVOKER`, writes both rows in one DB
        transaction. It does not re-decide the warning; that stays in the service layer.
  - [ ] `db push` before deploying the code that calls it
  - [ ] Service `createTransactionWithAllocation` calls the RPC; hook wraps it
  - [ ] Invalidate `['allocations']` as well
- [ ] Income card: remove, or show Unallocated only
- [ ] Sidebar: one control visible at a time on phone

**Review:**

**Retro:**
</details>

---

## Friction log

Lives in its own file: [FRICTION.md](FRICTION.md).

---

## Backlog

Ordered. Top of the list is the next sprint unless dogfooding says otherwise —
and dogfooding overrules this list, that's the point of it.

### Next

| Item                                               | Notes                                                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Phone punch list, round 2                          | Whatever a week of real use surfaces. Can't be written in advance; that's the feature.              |
| Add to home screen (PWA manifest)                  | Cheap. Makes it feel like an app instead of a bookmark, which affects whether I actually open it.   |
| `supabase db pull` → commit `supabase/migrations/` | The DB currently exists only in the dashboard. No version history, dev/prod hand-synced.            |
| Month boundaries                                   | The missing envelope primitive — allocations are timeless. Schema change, so sketch the flow first. |

### After

| Item                   | Notes                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Liabilities            | First half of the claims thesis. One counterparty, one direction, settle/unsettle. |
| Bill splits            | Reuses liabilities. Build only if I'm actually splitting bills.                    |
| CSV / statement import | Stop hand-typing what the bank already knows. No API approval needed.              |
| Bank API auto-import   | Behind the same import path. Gated by things outside my control.                   |

### Carried over (from the old PROGRESS.md board)

| Item                              | Status                                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Move Budget                       | Was marked in-progress and left there. Finish or drop it — don't leave it hanging.                                                         |
| Budget limits / warnings / alerts | Partly built already: `AddTransactionModal` warns on negative balance and on crossing `balance_threshold`. Remaining scope needs deciding. |
| Dark / light mode toggle          | Deferred. App is dark-only and I don't mind.                                                                                               |
| Stats page                        | Deferred until there's enough real data to make a chart worth reading.                                                                     |

### Known drift (from ARCHITECTURE.md)

| Item                                          | Notes                                                                                                                                                                                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_budget_transactions` may be inconsistent | If the RPC recurses into sub-budgets, `useBudgetBalance` counts descendants' transactions but not their allocations or transfers — parent balances would be wrong. Unverifiable until migrations are in the repo. Check early; it's a money bug if real. |
| Dead `budgetType` prop                        | `AddTransactionModal` takes `'spending' \| 'income'`, only ever passed `'spending'` (`BudgetDetail.tsx:306`). Leftover from `is_income`. Unreachable branch.                                                                                             |

---

## 0 — Architecture migration (closed, reconstructed)

**Opened:** ~2026-06-08 · **Closed:** 2026-06-30 · Ran as waterfall, logged after the fact.

**Outcome achieved:** clean data model — `incomes`, `allocations`, `budgets`,
`transactions`, `transfers`, each with one job. Removed `transactions.type`,
`budgets.is_income`, and all stored `balance` columns and their triggers.

**Retro** (written 2026-09-28, from `TEMP_NOTES.txt` and the old board):

- **What worked:** additive-first sequencing. New tables and RLS went in before
  anything was removed, so the app kept working throughout. Dev migration always
  ran before prod.
- **What didn't:** 23 phases to fix a data-model decision that was wrong from the
  start. The original model (`type: 'add' | 'withdraw'`, `is_income` on budgets) was
  chosen for simplicity and a gentler learning curve, and it was the right call at
  the time — but it reached production before anything tested it, so the correction
  cost a full migration instead of an afternoon.
- **What the sketch got wrong:** there was no sketch. The model was designed in prose
  across four docs and validated only by building on it.
- **One change:** sketch the flow before building anything that touches money math,
  and get a thin version into real use before committing the schema.
