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
- **signup_with_email_and_password(email, password)** → `void`
  - throws on failure
  - parameters:
    - `email`: string
    - `password`: string
- **login_with_email_and_password(email, password)** → `void`
  - throws on failure
  - parameters:
    - `email`: string
    - `password`: string
- **logout()** → `void`
  - throws on failure
- **get_current_user()** → `User`

## budgets

### Interfaces
- **Budget**
  - interface object defining what a budget object looks like
- **BudgetInput**
  - interface object defining what a budget object passed to mutation functions looks like
  - usage: `create_budget`, `update_budget`

### Services
- **create_budget(BudgetInput)** → `void`
  - throws on failure
- **update_budget(budget_id, BudgetInput)** → `void`
  - throws on failure
  - parameters:
    - `budget_id`: uuid
    - `BudgetInput`: BudgetInput
- **delete_budget(budget_id)** → `void`
  - throws on failure
  - parameters:
    - `budget_id`: uuid
- **get_budget(budget_id)** → `Budget`
  - parameters:
    - `budget_id`: uuid
- **get_all_budgets()** → `Budget[]`
- **get_root_budgets()** → `Budget[]`
- **get_child_budgets(parent_id)** → `Budget[]`
  - parameters:
    - `parent_id`: uuid
## transactions

### Interfaces
- **Transaction**
  - interface object defining what a transaction object looks like
- **TransactionInput**
  - interface object defining what a transaction object passed to mutation functions looks like
  - usage: `create_transaction`, `update_transaction`

### Services
- **create_transaction(TransactionInput)** → `void`
  - throws on failure
- **update_transaction(transaction_id, TransactionInput)** → `void`
  - throws on failure
  - parameters:
    - `transaction_id`: uuid
    - `TransactionInput`: TransactionInput
- **delete_transaction(transaction_id)** → `void`
  - throws on failure
  - parameters:
    - `transaction_id`: uuid
- **get_transaction(transaction_id)** → `Transaction`
  - parameters:
    - `transaction_id`: uuid
- **get_all_transactions()** → `Transaction[]`
- **get_budget_transactions(budget_id)** → `Transaction[]`
  - fetches all transactions from the budget and all its sub-budgets recursively
  - parameters:
    - `budget_id`: uuid
