# Fintrack Progress

---

## MVP Phases

| Phase | Description                          | Status |
| ----- | ------------------------------------ | ------ |
| 1     | Auth                                 | ✅     |
| 2     | Create + View Budgets                | ✅     |
| 3     | Budget Detail                        | ✅     |
| 4     | Create + View Transactions + Balance | ✅     |
| 5     | Update + Delete Budgets              | ✅     |
| 6     | Update + Delete Transactions         | ✅     |
| 7     | Polish                               | ✅     |

---

## Stage 2 — UI & Core Features

| Phase  | Description                                                                                                | Status  |
| ------ | ---------------------------------------------------------------------------------------------------------- | ------- |
| S2-1   | useReactQuery                                                                                              | ✅      |
| S2-2   | Dark / Light Mode                                                                                          | ⬜      |
| S2-3   | Responsive UI                                                                                              | ⬜      |
| S2-4   | BudgetCard Balance                                                                                         | ✅      |
| S2-5   | Pagination for Transactions                                                                                | ✅      |
| S2-6   | Transaction Search / Filter                                                                                | ✅      |
| S2-7   | Move Budget                                                                                                | Partial |
| S2-8   | Move Transaction                                                                                           | ✅      |
| S2-9   | Transfer Money Between Budgets                                                                             | ✅      |
| S2-10a | Income — Schema, backfill, trigger                                                                         | ✅      |
| S2-10b | Income — RLS                                                                                               | ✅      |
| S2-10c | Income — Services + Types                                                                                  | ✅      |
| S2-10d | /spending page                                                                                             | ✅      |
| S2-11  | Budget breadcrumbs                                                                                         | ✅      |
| S2-10e | Income — UI (income page + allocate flow)                                                                  | ✅      |
| S2-10f | Income — Enforce strict envelope (restrict add to income budget only)                                      | ✅      |
| S2-10g | Income — Fix flicker on /income (component split pattern)                                                  | ✅      |
| S2-10h | UI Refactor — Dashboard as financial overview, IncomeBudgetCard compact, IncomeBudgetDetail vertical stack | ✅      |
| S2-12  | Budget Limits + Warnings + Alerts                                                                          | ⬜      |
| S2-13  | Stats Page                                                                                                 | ⬜      |

---

## Architecture Migration — Clean Data Model

| Phase  | Description                                                                                                                                                                            | Status |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AM-0   | Frontend fixes — TransferCard from/to names, UpdateTransferModal to_budget editable, split containers                                                                                  | ✅     |
| AM-0.5 | Document rewrite — SCOPE, BUILD_PLAN, PROGRESS, ARCHITECTURE updated for new model                                                                                                     | ✅     |
| AM-1a  | Incomes — schema, RLS, triggers                                                                                                                                                        | ⬜     |
| AM-1b  | Incomes — services + types + hooks                                                                                                                                                     | ⬜     |
| AM-1c  | Incomes — migrate `type: 'add'` transactions (dev)                                                                                                                                     | ⬜     |
| AM-1d  | Incomes — UI on /income page                                                                                                                                                           | ⬜     |
| AM-2a  | Remove transaction type — drop from database, schema, types                                                                                                                            | ⬜     |
| AM-2b  | Remove transaction type — update create/update transaction UI                                                                                                                          | ⬜     |
| AM-2c  | `BudgetBalanceSummary` — derive budget balance as `-transactions + transfers_in - transfers_out` client-side; drop `.balance` column and all balance calculation function and triggers | ⬜     |
| AM-3a  | Allocations — schema, RLS, triggers                                                                                                                                                    | ⬜     |
| AM-3b  | Allocations — services + types + hooks                                                                                                                                                 | ⬜     |
| AM-3c  | Allocations — migrate income transfers → allocations                                                                                                                                   | ⬜     |
| AM-3d  | `IncomeBalanceSummary` — derive income balance as `SUM(incomes) − SUM(allocations out)` on /income                                                                                     | ⬜     |
| AM-3e  | `BudgetBalanceSummary` - derive budget balance as `allocations_in - transactions + transfers_in - transfers_out`                                                                       | ⬜     |
| AM-3f  | Allocations — remove `is_income` budgets and column                                                                                                                                    | ⬜     |
| AM-3g  | Allocations — UI on /income (create, view, delete + unallocated balance)                                                                                                               | ⬜     |
| AM-3h  | `OverallBalanceSummary`— derive dashboard balance as`SUM(incomes) − SUM(all transactions)`                                                                                             | ⬜     |
| AM-4   | `updated_at` column on every table and use trigger for update                                                                                                                          | ⬜     |

---

## Stage 3 — Advanced & Scale

| Phase | Description                                     | Status |
| ----- | ----------------------------------------------- | ------ |
| S3-1  | Multi-Currency                                  | ⬜     |
| S3-2  | Scheduled & Recurring Transfers (AutoTransfers) | ⬜     |
| S3-3  | Session Management                              | ⬜     |
| S3-4  | Loan & Owes Tracking (Liabilities)              | ⬜     |
| S3-5  | Bill Splitter                                   | ⬜     |
| S3-6  | Profiles                                        | ⬜     |
| S3-7  | AI Agent                                        | ⬜     |

---

## Stage 4 — Bank Integration

| Phase | Description                                    | Status |
| ----- | ---------------------------------------------- | ------ |
| S4-1  | Bank account linking (Plaid or equivalent)     | ⬜     |
| S4-2  | Auto-import bank statements as income entries  | ⬜     |
| S4-3  | Reconcile imported records with manual entries | ⬜     |

---

**Last updated:** Sun Jun 22 2026
