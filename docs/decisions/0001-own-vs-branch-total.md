# 0001 — Every budget has two numbers: Own and Branch total

Status: accepted (being built in sprint 3)
Date: 2026-11-17 · Sprint: 2 (decided), 3 (built)

## Context

Budgets nest via `parent_id`. `get_budget_transactions` was already recursive, but
allocations and transfers were read for the budget alone, so a parent's balance
subtracted its children's spending without adding their funding (Known drift #2).

Sprint 2 made every input recursive (rollup RPCs `get_budget_allocations`,
`get_budget_transfers_in`, `get_budget_transfers_out`). Trying it in the app showed the
flaw: a parent → child transfer is internal to the branch, so the parent's rolled-up
number didn't move while the child's rose. A parent could move any amount to a child, the
child showed money nothing backed, and the parent's number hid it. One word, "balance",
meant two things.

## Decision

Every budget has two numbers, always labelled, never styled alike:

- **Own (Available):** `allocations − transactions + transfers_in − transfers_out`,
  counting only rows where this budget itself is the target or source. What the budget
  can spend or transfer. **The only number that decides whether an action is allowed or
  warned** (transaction warnings, transfer warnings).
- **Branch total:** the same formula over the whole subtree. Reporting only.

Both come from the same rollup RPC results. The RPCs return whole rows and their subtree
includes the budget itself, so Own is a client-side filter of those rows (`to_budget_id`,
`budget_id`, `from_budget_id` equal to this budget). No separate non-recursive reads, no
extra query keys.

Display: cards show Branch total, labelled. The budget page shows Own as the main number
and Branch total as secondary, only when the budget has children.

Reconciliation identity, which must hold on the dashboard:
`Unallocated + Σ(top-level Branch totals) = Overall (I − T)`.
Transfers cancel across the tree, so a failure here means a bug in the balance code.

Worked example: Home (parent) Own 100, Bills (child) Own 0. Transfer 60 Home → Bills:
Home Own 40, Bills Own 60, Home Branch total 100. Transfer 500 instead: Home Own −400
(the warning fires), Bills Own 500, Home Branch total still 100.

## Alternatives rejected

- **Rollup only (one number = whole subtree).** Built in sprint 2 and dropped: hides
  parent → child transfers and lets a parent spend its children's money unwarned.
- **Own only (no rollup).** Loses the "how much is in this branch" view, which is what
  cards are for.
- **Parents are groups that hold no money** (only leaves get allocations, transactions,
  transfers). One number per budget and simpler UI, but parent → child transfers stop
  meaning anything and existing parent rows would need moving. Rejected: parents holding
  their own money is wanted.
- **Separate non-recursive reads for Own** (the revision's first plan). Works, but adds
  services and query keys, and lets Own and Branch total refetch at different times.

## Consequences

- `useBudgetBalance` returns `own` and `branch` with no top-level `balance`, so every
  caller has to choose.
- A parent page fetches its whole subtree's rows even to show Own. Fine at personal scale
  (see the cost note on derived balances in `ARCHITECTURE.md`).
- Rollup transfer totals include internal transfers, so in/out totals shown for a branch
  are larger than what crossed its boundary. The balance is still right. The budget page
  shows Own in/out totals for this reason.
- The UI must keep the two numbers visually distinct, or the model fails in practice.
