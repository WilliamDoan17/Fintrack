# FRICTION

Raw complaints from actually using Fintrack. This is the input to every sprint's
triage. It is not a to-do list: an entry here is evidence, not a commitment.

## Rules

- **Log first, fix later.** One line, the moment it annoys me. Don't fix it on the
  spot unless it blocks me from recording money.
- **Log where and what, not the solution.** "Amount field opens the full keyboard" is
  data. "Add inputMode numeric" is a guess about the fix.
- **Bump Hits, don't add a duplicate.** If it happens again, increment the count.
  Frequency is what ranks entries at triage.
- **Every sprint opens with triage** (30 min, in `SPRINTS.md` under **Triage**):
  1. Group each open entry: `broken` (doesn't work), `slow` (works, costs effort),
     `missing` (wanted something that isn't there), `cosmetic` (looks wrong, works)
  2. Rank by Hits, not by how bad it felt once
  3. Pick what goes into the sprint; mark those `sprint <n>`
  4. Anything left stays `open`. Anything I decide not to do gets `dropped` and a reason.
- **Empty log = I'm not really using the app**, not that the app is fine.

**Where** uses the route or component: `/`, `/dashboard`, `/income`, `/spending`,
`/budget/:id`, `/auth`, or a modal name. **Device** is `phone` or `desktop`.

## Open

| Date       | Device | Where                     | What happened                                                                                                                                                                                                           | Hits | Group    | Status |
| ---------- | ------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------- | ------ |
| 2026-09-29 | Laptop | `/landing`                | the scrollbar area has large margin to the page                                                                                                                                                                         | 1    | cosmetic | open   |
| 2026-09-29 | All    | `/auth`                   | failed login redirects user to landing                                                                                                                                                                                  | 1    | cosmetic | open   |
| 2026-09-29 | Phone  | `/auth`                   | auth login/signup doesn't have a margin to the screen                                                                                                                                                                   | 1    | cosmetic | open   |
| 2026-09-29 | Phone  | `/auth`                   | auth page doesn't have a return button for navigation                                                                                                                                                                   | 1    | cosmetic | open   |
| 2026-09-29 | Phone  | sidebar                   | The menu button and the collapse button appears at the same time, causing confusion (pressing collapse for the first time closes sidebar and toggle collapsed permanently)                                              | 1    | cosmetic | sprint 2 |
| 2026-10-04 | All    | Budget Search Bar         | Current using budget paths for budgets, needs to move to budget_name (budget_path)                                                                                                                                      | 1    | cosmetic | open   |
| 2026-10-09 | All    | `/income` vs `/dashboard` | Adding a transaction to a budget that was never allocated to leaves Unallocated unchanged but lowers the dashboard Balance. The envelope rule (spend only what is assigned) isn't enforced, so the two numbers disagree | 1    | broken   | sprint 2 |
| 2026-10-09 | All    | `/dashboard`              | Income card shows the total of every income row, not the unallocated amount. Unclear which number it should show                                                                                                        | 1    | missing  | sprint 2 |
| 2026-10-14 | All    | `/budget/:id`            | A budget's balance doesn't include its sub-budgets' balances | 2    | broken   | sprint 2 |
| 2026-10-14 | All    | budget create (sub-budget) | Creating a sub-budget fails; `on_budgets_insert` RLS check compares `b.id = b.parent_id` so it's never true for a non-null parent | 1    | broken   | sprint 2 |
| 2026-11-05 | All    | CreateTransferModal       | Can't transfer from a parent budget to its own child. The budget structure picker blocks the budget's own name, so the parent can't be chosen as source | 1    | broken   | sprint 2 |
| 2026-11-05 | All    | `CreateTransferModal`     | Transferring more than the source budget's balance triggers no warning | 1    | broken   | open |

## Notes for triage

Guesses about fixes, kept apart from the evidence above so the table stays honest. Not
commitments; read them at triage, then delete or move them into a sprint.

- 2026-11-05 `CreateTransferModal` (parent → child): allow the budget's own name in the
  structure picker, then disable the transfer button when source and destination are the
  same budget.

## Closed

Fixed or dropped. Kept so a returning problem is recognizable.

| Date | Where | What happened | Outcome | Sprint |
| ---- | ----- | ------------- | ------- | ------ |
| —    | —     | —             | —       | —      |
