# SERVICES
This document shapes the services for features of Fintrack app

## Conventions
- Services never accept `user_id` as a parameter
- `user_id` is always retrieved internally via `supabase.auth.getUser()`
- RLS (Row Level Security) on Supabase handles user-level data protection
- Mutations (`create`, `update`, `delete`) return `void` on success, throw an error on failure
- UI uses optimistic updates: state is updated immediately, refetch reconciles with server, rollback on failure via try/catch

## auth

### Services
- **signupWithEmailAndPassword(email, password)** → `void`
  - throws on failure
  - parameters:
    - `email`: string
    - `password`: string
- **loginWithEmailAndPassword(email, password)** → `void`
  - throws on failure
  - parameters:
    - `email`: string
    - `password`: string
- **logout()** → `void`
  - throws on failure
- **getCurrentUser()** → `User`

## budgets

### Interfaces
- **Budget**
  - interface object defining what a budget object looks like
- **BudgetInput**
  - interface object defining what a budget object passed to mutation functions looks like
  - usage: `createBudget`, `updateBudget`

### Services
- **createBudget(input)** → `void`
  - throws on failure
- **updateBudget(budget_id, updates)** → `void`
  - throws on failure
  - parameters:
    - `budget_id`: uuid
    - `updates`: Partial<BudgetInput>
- **deleteBudget(budget_id)** → `void`
  - throws on failure
  - parameters:
    - `budget_id`: uuid
- **getBudget(budget_id)** → `Budget`
  - parameters:
    - `budget_id`: uuid
- **getRootBudgets()** → `Budget[]`
- **getChildBudgets(parent_id)** → `Budget[]`
  - parameters:
    - `parent_id`: uuid

## transactions

### Interfaces
- **Transaction**
  - interface object defining what a transaction object looks like
- **TransactionInput**
  - interface object defining what a transaction object passed to mutation functions looks like
  - usage: `createTransaction`, `updateTransaction`

### Services
- **createTransaction(TransactionInput)** → `void`
  - throws on failure
- **updateTransaction(transaction_id, updates)** → `void`
  - throws on failure
  - parameters:
    - `transaction_id`: uuid
    - `updates`: Partial<TransactionInput>
- **deleteTransaction(transaction_id)** → `void`
  - throws on failure
  - parameters:
    - `transaction_id`: uuid
- **getTransaction(transaction_id)** → `Transaction`
  - parameters:
    - `transaction_id`: uuid
- **getAllTransactions()** → `Transaction[]`
- **getBudgetTransactions(budget_id)** → `Transaction[]`
  - fetches all transactions from the budget and all its sub-budgets recursively
  - parameters:
    - `budget_id`: uuid
