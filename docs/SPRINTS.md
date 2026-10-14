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

  <summary>#2 - </summary>
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
