# 0002 — Overspend warning: advisory, three options

Status: accepted (not built)
Date: 2026-10 · Sprint: 2

## Context

Nothing stopped spending from a budget that was never allocated to. Doing so lowered the
dashboard's Overall (`I − T`) but not Unallocated (`I − A`), so the two numbers disagreed
and the envelope rule (spend only what is assigned) wasn't visible anywhere.

At the same time, real money does go negative. An app that refuses to record a real
purchase gets abandoned, which is why the existing transaction guards are warn-only
(`ARCHITECTURE.md`, "Log a transaction").

## Decision

One warning dialog before a transaction is saved, triggered by a single condition:

`newBalance <= (balance_threshold ?? 0)`, where `newBalance` is the budget's **Own**
balance after the transaction (see 0001).

This covers both overspending (`< 0`) and dropping to or below the alert threshold, and
fires for funded-but-low budgets as well as never-funded ones.

Warning line, chosen by case:

- `newBalance < 0`: "This will put {budget} at −$X, which is more than you've assigned
  to it."
- `0 <= newBalance <= threshold`: "This will leave {budget} at $X, at or below its alert
  threshold of $T."
- extra line when `unallocated = 0`: "There is no unallocated income to cover this."

Three options:

1. **Cancel.**
2. **Allocate $S and add**, with `S = min(unallocated, max(0, threshold) − newBalance)`.
   Disabled when `unallocated = 0`.
3. **Add without allocating.** Allowed; the gap then shows up in the numbers (see 0003).

Rules:

- The decision to warn lives client-side (service layer and modal). The database does not
  re-decide it.
- Option 2 writes the allocation and the transaction in **one DB transaction**, through an
  RPC `create_transaction_with_allocation` (`SECURITY INVOKER`, `user_id` from
  `auth.uid()`). Two separate hook calls could leave a stray allocation if the second
  insert failed.
- Compute S when the dialog opens and again at confirm, so a background refetch can't
  change the amount silently. Submit stays disabled until the budget balance and
  Unallocated have both loaded.

## Alternatives rejected

- **Block the transaction.** Refuses to record reality.
- **Enforce in the database** (constraint or trigger). The DB can't offer "allocate and
  add", and a hard constraint is a block.
- **Two hook calls for option 2.** Not atomic.

## Consequences

- Option 2 creates a second path that writes to `allocations`, but money still enters the
  budget only as an allocation, so the envelope guarantee holds.
- The transfer warning (sprint 3) uses the same condition on the source budget's Own, so
  both warnings behave alike.
- Option 2 is convenience, not correctness. The advisory warning alone already prevents
  silent overspending, so the dialog can ship without option 2 first.
