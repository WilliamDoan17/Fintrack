# SCOPE

## Purpose

Fintrack is a personal finance app built primarily as a **tool I actually use** to
manage my own money, and secondarily as a portfolio project.

That ordering decides arguments. When a feature would look good in a demo but I
wouldn't use it on a Tuesday, it loses.

## Thesis

Envelope budgeting is good at telling you what money you **have**. It is bad at
money that is **owed** — to you or by you. A friend owes you for dinner, you owe
a roommate for rent, a card statement isn't due yet. Every envelope app either
ignores this or makes you fake it with a placeholder envelope.

**Fintrack is envelope budgeting that knows about money in transit.**

Everything in the roadmap either strengthens the envelope core or tracks a claim.
Nothing else earns a place.

## Outcomes

What "working" means, stated as things I can do rather than features that exist:

1. I can see, in one number, how much money is actually free to spend.
2. Every unit of money is either unallocated or sitting in exactly one envelope —
   the app makes it impossible to spend money I never assigned.
3. I can log a transaction on my phone, standing at a register, in under 15 seconds.
4. I know who owes me and who I owe, without keeping it in my head or a notes app.
5. I stop hand-typing transactions that my bank already has a record of.

## Current state

The envelope core works end to end: incomes, allocations, budgets (nested),
transactions, transfers, derived balances, and per-budget alert thresholds.
See [ARCHITECTURE.md](ARCHITECTURE.md) for the data model and why it looks like this.

Outcome 2 is not met yet: nothing stops spending from an unfunded budget (see
[FRICTION.md](FRICTION.md), 2026-10-09). Outcome 1 depends on which number counts as
"free to spend", which is undecided. The app is deployed (Vercel), so outcome 3 is reachable but
unproven: it hasn't yet tracked real money from a phone. Outcomes 4 and 5 are
not started.

## Roadmap

In order. The order is the point — each item is either required by the next or
unblocks feedback.

| #   | Item                                    | Why now                                                                                                                                                                                          |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Phone UI pass, then use it for real** | Outcome 3. Deployed but never dogfooded. Use is the only feedback source, so real use runs in the background of every sprint after this one, feeding [FRICTION.md](FRICTION.md).                 |
| 2   | **Month boundaries**                    | The missing envelope primitive. Allocations are currently timeless; real envelope budgeting funds envelopes per month and rolls over or reassigns what's left. Schema-adjacent, so design first. |
| 3   | **Liabilities**                         | Outcome 4, and the first half of the claims thesis. One counterparty, one direction, settle/unsettle.                                                                                            |
| 4   | **Bill splits**                         | Second half of claims — reuses the liabilities table. Conditional: build only if I'm actually splitting bills regularly, otherwise it's scope creep wearing a thesis.                            |
| 5   | **CSV / statement import**              | Outcome 5 without depending on anyone's approval. Parse the file the bank already gives me, match against existing transactions, confirm the rest.                                               |
| 6   | **Bank API auto-import**                | Same destination as 5, behind the same import path. Last because it's gated by things outside my control (production API access, whether my bank is supported at all).                           |

Deferred, not rejected: dark/light toggle, stats and charts, transaction
scheduling and recurrence.

## Non-goals

Cut deliberately. Each of these was on an earlier plan.

| Not doing                                   | Because                                                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Multi-currency                              | I hold one currency. Pure complexity — it touches every balance calculation in the app for zero personal benefit.      |
| AI agent / assistant                        | Doesn't serve the thesis. An agent that writes transactions for me is a trust problem I don't want in my own finances. |
| Budget sharing / collaborative budgets      | Single-user tool. Splits cover the shared-money case without a permissions model.                                      |
| User profiles, avatars, display names       | I know who I am.                                                                                                       |
| Session management UI (device list, revoke) | Supabase auth already handles the security part; a UI for it is resume garnish.                                        |
| Onboarding flow                             | One user, already onboarded.                                                                                           |

---

**Review cadence:** revisit this doc at the end of any sprint that changes the
roadmap order, not on a schedule. If a non-goal keeps coming back, that's evidence
the thesis is wrong — change the thesis, not the list.
