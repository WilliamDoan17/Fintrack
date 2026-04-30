# SERVICES
This document defines the services for Fintrack.

## Conventions
- Services never accept `user_id` as a parameter
- `user_id` is always retrieved internally via `supabase.auth.getUser()`
- RLS handles user-level data protection
- Mutations (`create`, `update`, `delete`) return `void` on success, throw on failure
- UI uses optimistic updates: state updated immediately, refetch reconciles with server, rollback on failure via try/catch

---

## auth

- **signupWithEmailAndPassword(email, password)** → `void` — creates a new user account
- **loginWithEmailAndPassword(email, password)** → `void` — signs in an existing user
- **logout()** → `void` — signs out the current user
- **getCurrentUser()** → `User` — returns the currently authenticated user

---

## budgets

- **createBudget(input: BudgetInput)** → `void` — creates a new budget for the current user (`is_income` is always false, enforced by RLS)
- **updateBudget(budget_id, updates: Partial<BudgetInput>)** → `void` — updates fields on an existing budget (cannot flip `is_income`, enforced by RLS)
- **deleteBudget(budget_id)** → `void` — deletes a budget and all its sub-budgets (cascade); fails if target is the income budget (enforced by RLS)
- **getBudget(budget_id)** → `Budget` — fetches a single budget by id
- **getIncomeBudget()** → `Budget` — fetches the current user's income budget (`is_income = true`)
- **getAllBudgets()** → `Budget[]` — fetches all budgets (income + spending) for the current user
- **getAllSpendingBudgets()** → `Budget[]` — fetches all spending budgets (`is_income = false`) for the current user
- **getRootSpendingBudgets()** → `Budget[]` — fetches top-level spending budgets (no parent, `is_income = false`) for the current user
- **getChildBudgets(parent_id)** → `Budget[]` — fetches direct children of a given budget

---

## transactions

- **createTransaction(input: TransactionInput)** → `void` — creates a new transaction on a budget
- **updateTransaction(transaction_id, updates: Partial<TransactionInput>)** → `void` — updates fields on an existing transaction
- **deleteTransaction(transaction_id)** → `void` — deletes a transaction
- **getTransaction(transaction_id)** → `Transaction` — fetches a single transaction by id
- **getAllTransactions()** → `Transaction[]` — fetches all transactions for the current user
- **getBudgetTransactions(budget_id)** → `Transaction[]` — fetches all transactions for a budget and its sub-budgets recursively

---

## transfers

- **createTransfer(input: TransferInput)** → `void` — creates a new transfer between two budgets
- **updateTransfer(transfer_id, updates: Partial<TransferInput>)** → `void` — updates fields on an existing transfer
- **deleteTransfer(transfer_id)** → `void` — deletes a transfer
- **getTransfer(transfer_id)** → `Transfer` — fetches a single transfer by id
- **getAllTransfers()** → `Transfer[]` — fetches all transfers for the current user
- **getBudgetTransfers(budget_id)** → `Transfer[]` — fetches transfers where the budget is the source or destination (not recursive)
