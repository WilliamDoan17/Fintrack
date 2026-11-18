# Decisions

Architecture Decision Records: one short file per decision that is expensive to reverse
(schema, money math, layering rules). The reasoning behind the code, kept next to it.

Work in progress (sprints, backlog, friction, draft sketches) lives in Notion. When a
decision settles there, it gets promoted here. Test: will someone reading the code in six
months need this to understand why it's this way? If yes, it belongs here.

`ARCHITECTURE.md` holds the current model and rules. An ADR holds why one of them was
chosen and what was rejected. When an ADR changes a formula or a rule, update
`ARCHITECTURE.md` in the same commit.

## Index

| #                                         | Decision                                              | Status                       |
| ----------------------------------------- | ----------------------------------------------------- | ---------------------------- |
| [0001](0001-own-vs-branch-total.md)       | Every budget has two numbers: Own and Branch total    | Accepted, building (sprint 3) |
| [0002](0002-transaction-warning.md)       | Overspend warning: advisory, three options            | Accepted, not built          |
| [0003](0003-available-and-unallocated.md) | "Available" number, Unallocated derived, no income card | Accepted, not built          |

## Template

```
# NNNN — <decision as a statement>

Status: proposed | accepted | superseded by NNNN
Date: YYYY-MM-DD · Sprint: <n>

## Context
What forced the decision. Facts, not the solution.

## Decision
What we do now. Formulas and rules exactly.

## Alternatives rejected
What else was considered, and why not.

## Consequences
What this costs, what it makes easy, what it makes hard.
```

Never rewrite an accepted ADR's decision. If it changes, write a new one and mark the old
one superseded.
