# TYPES

This document defines the TypeScript types used in Fintrack's frontend (client-side coding reference).

Source files live in `frontend/backend/types/`.

---

## budgets (`frontend/backend/types/budgets.ts`)

### `Budget`

| Field             | Type                   |
| ----------------- | ---------------------- |
| id                | string (uuid)          |
| user_id           | string (uuid)          |
| created_at        | string (ISO timestamp) |
| name              | string                 |
| parent_id         | string \| null         |
| balance_threshold | number \| null         |

### `BudgetInput`

Shape passed to `createBudget` / `updateBudget`. Equivalent to `Omit<Budget, 'id' \| 'created_at' \| 'user_id'>`:

| Field             | Type           |
| ----------------- | -------------- |
| name              | string         |
| parent_id         | string \| null |
| balance_threshold | number \| null |

---

## transactions (`frontend/backend/types/transactions.ts`)

### `Transaction`

| Field      | Type                   |
| ---------- | ---------------------- |
| id         | string (uuid)          |
| user_id    | string (uuid)          |
| budget_id  | string (uuid)          |
| type       | TransactionType        |
| amount     | number                 |
| name       | string                 |
| created_at | string (ISO timestamp) |

### `TransactionInput`

Shape passed to `createTransaction` / `updateTransaction`. Equivalent to `Omit<Transaction, 'id' \| 'user_id' \| 'created_at'>`:

| Field     | Type            |
| --------- | --------------- |
| budget_id | string (uuid)   |
| type      | TransactionType |
| amount    | number          |
| name      | string          |

---

## transfers (`frontend/backend/types/transfers.ts`)

### `Transfer`

| Field          | Type                   |
| -------------- | ---------------------- |
| id             | string (uuid)          |
| user_id        | string (uuid)          |
| from_budget_id | string (uuid)          |
| to_budget_id   | string (uuid)          |
| amount         | number                 |
| name           | string                 |
| created_at     | string (ISO timestamp) |

### `TransferInput`

Shape passed to `createTransfer` / `updateTransfer`. Equivalent to `Omit<Transfer, 'id' \| 'user_id' \| 'created_at'>`:

| Field          | Type          |
| -------------- | ------------- |
| from_budget_id | string (uuid) |
| to_budget_id   | string (uuid) |
| amount         | number        |
| name           | string        |

---

## incomes

### Income

| Field      | Type                   |
| ---------- | ---------------------- |
| id         | string (uuid)          |
| user_id    | string (uuid)          |
| name       | string                 |
| amount     | number                 |
| created_at | string (ISO timestamp) |

### IncomeInput

Shape passed to `createIncome` and `updateIncome`. Equivalent to `Omit<Income, 'id' \| 'user_id' \| 'created_at'>`

| Field  | Type   |
| ------ | ------ |
| name   | string |
| amount | number |

---

## allocations

### Allocation

| Field        | Type                   |
| ------------ | ---------------------- |
| id           | string (uuid)          |
| user_id      | string (uuid)          |
| to_budget_id | string (uuid)          |
| amount       | number                 |
| created_at   | string (ISO timestamp) |

### AllocationInput

Shape passed to `createAllocation` and `updateAllocation`. Equivalent to `Omit<Allocation, 'id' \| 'user_id' \| 'created_at'>`

| Field        | Type          |
| ------------ | ------------- |
| to_budget_id | string (uuid) |
| amount       | number        |

---
