# 0003 — "Available" number, Unallocated derived, no total-income card

Status: accepted (not built)
Date: 2026-10 · Sprint: 2

## Context

The dashboard's Income card shows the sum of every income row. That is not a number I act
on. Meanwhile, spending without allocating (allowed by 0002, option 3) lowers Overall
(`I − T`) but not Unallocated (`I − A`), so neither number alone says how much is actually
free to spend (SCOPE outcome 1).

## Decision

- **Remove the total-income card.** If a card stays in that slot, it shows Unallocated.
- **Unallocated is a derived hook,** `useUnallocated()`, composing the existing incomes and
  allocations queries. It is not its own query key.
- **Add "Available"**, a derived hook `useAvailable()`:
  `Available = min(Unallocated, Overall)`.
  Shown with a small "N budgets overspent" line, so a gap between Available and
  Unallocated has a visible reason.
- Name it **Available**, not "Balance": Overall already means `I − T`.

`min` is exact only when one envelope is overspent. The exact form is
`Unallocated − Σ max(0, −Own_b)` over all budgets. Start with `min`; switch to the exact
form if the difference ever shows up in real use.

## Alternatives rejected

- **Unallocated as a query key.** It would need invalidating from both income and
  allocation mutations. That is the drift "derived, never stored" exists to avoid.
- **Keep the total-income card.** Shows a number nobody acts on, next to ones they do.
- **Block spending without allocating,** so Overall and Unallocated always agree. Rejected
  in 0002: refuses to record reality.

## Consequences

- Overall, Unallocated and Available all derive from cached queries. No new tables or
  columns.
- Uses each budget's Own balance (0001) for the overspent count, so it depends on 0001.
- `ARCHITECTURE.md` gets an "Available" row in the balance table when this is built.
