# BUILD PLAN
This document outlines the development plan for Fintrack MVP.

## Scope
Users can:
- Create, update, delete budgets
- Create, update, delete sub-budgets inside another budget
- View their budgets
- Log, update, delete transactions in a budget
- View recent transactions
- View their balance and stats

## Development Philosophy
- Vertical slices — one complete feature at a time
- CR (Create + Read) before UD (Update + Delete)
- Backend (RLS + services) before frontend (UI)
- Optimistic updates on the frontend — rollback on failure via try/catch
- Test each phase via UI + Supabase dashboard before moving on

## Phases

### Phase 1: Auth
**Services:**
- `signup_with_email_and_password(email, password)` → void
- `login_with_email_and_password(email, password)` → void
- `logout()` → void
- `get_current_user()` → User

**Tasks:**
- Link Supabase to the project
- Write auth services
- Set up protected routes

**Pages:**
- `Auth.tsx` — fully functional (signup, login, tab switching, wired to services)

---

### Phase 2: Create + View Budgets
**Services:**
- `create_budget(BudgetInput)` → void
- `get_root_budgets()` → Budget[]

**Tasks:**
- Write RLS policies for budget INSERT, SELECT
- Write budget services

**Pages:**
- `Dashboard.tsx` — root budgets list, create budget modal

---

### Phase 3: Budget Detail
**Services:**
- `get_budget(budget_id)` → Budget
- `get_child_budgets(parent_id)` → Budget[]

**Tasks:**
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — budget name, sub-budgets list, create sub-budget modal

---

### Phase 4: Create + View Transactions + Balance
**Services:**
- `create_transaction(TransactionInput)` → void
- `get_budget_transactions(budget_id)` → Transaction[]
- `get_all_transactions()` → Transaction[]

**Tasks:**
- Write RLS policies for transaction INSERT, SELECT
- Write transaction services

**Pages:**
- `BudgetDetail.tsx` — add transaction form, transaction list (recursive), budget balance
- `Dashboard.tsx` — recent transactions list, overall balance

---

### Phase 5: Update + Delete Budgets
**Services:**
- `update_budget(budget_id, BudgetInput)` → void
- `delete_budget(budget_id)` → void

**Tasks:**
- Write RLS policies for budget UPDATE, DELETE
- Write budget services

**Pages:**
- `Dashboard.tsx` — edit/delete actions on root budgets
- `BudgetDetail.tsx` — edit/delete actions on sub-budgets

---

### Phase 6: Update + Delete Transactions
**Services:**
- `update_transaction(transaction_id, TransactionInput)` → void
- `delete_transaction(transaction_id)` → void

**Tasks:**
- Write RLS policies for transaction UPDATE, DELETE
- Write transaction services

**Pages:**
- `BudgetDetail.tsx` — edit/delete actions on transaction list
- `Dashboard.tsx` — edit/delete actions on recent transactions
