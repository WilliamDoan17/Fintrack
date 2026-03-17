# BUILD PLAN
This document outlines the development plan for Fintrack MVP.

## Scope
Users can:
- Create, update, delete budgets
- Create, update, delete sub-budgets inside another budget
- View their budgets
- Log, update, delete transactions in a budget
- View recent transactions
- View their balance

## Development Philosophy
- Vertical phases — one complete feature at a time
- CR (Create + Read) before UD (Update + Delete)
- Backend (RLS + services) before frontend (UI)
- Optimistic updates on the frontend — rollback on failure via try/catch
- Test each phase via UI + Supabase dashboard before moving on

## Phases

### Phase 1: Auth ✅
**Services:**
- `signupWithEmailAndPassword(email, password)` → void
- `loginWithEmailAndPassword(email, password)` → void
- `logout()` → void
- `getCurrentUser()` → User

**Tasks:**
- Link Supabase to the project
- Write auth services
- Set up protected routes

**Pages:**
- `Auth.tsx` — fully functional (signup, login, tab switching, wired to services)

---

### Phase 2: Create + View Budgets ✅
**Services:**
- `createBudget(BudgetInput)` → void
- `getRootBudgets()` → Budget[]

**Tasks:**
- Write RLS policies for budget INSERT, SELECT
- Write budget services

**Pages:**
- `Dashboard.tsx` — root budgets list, create budget modal

---

### Phase 3: Budget Detail ✅
**Services:**
- `getBudget(budget_id)` → Budget
- `getChildBudgets(parent_id)` → Budget[]

**Tasks:**
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — budget name, sub-budgets list, create sub-budget modal

---

### Phase 4: Create + View Transactions + Balance ✅
**Services:**
- `createTransaction(TransactionInput)` → void
- `getBudgetTransactions(budget_id)` → Transaction[]
- `getAllTransactions()` → Transaction[]

**Tasks:**
- Write RLS policies for transaction INSERT, SELECT
- Write transaction services
- Write `get_budget_transactions` PostgreSQL recursive function

**Pages:**
- `BudgetDetail.tsx` — add transaction form, transaction list (recursive), budget balance
- `Dashboard.tsx` — recent transactions list, overall balance

---

### Phase 5: Update + Delete Budgets ✅
**Services:**
- `updateBudget(budget_id, Partial<BudgetInput>)` → void
- `deleteBudget(budget_id)` → void

**Tasks:**
- Write RLS policies for budget UPDATE, DELETE
- Write budget services

**Pages:**
- `BudgetDetail.tsx` — edit budget name inline, delete budget with confirmation modal

---

### Phase 6: Update + Delete Transactions ⬜
**Services:**
- `updateTransaction(transaction_id, Partial<TransactionInput>)` → void
- `deleteTransaction(transaction_id)` → void

**Tasks:**
- Write RLS policies for transaction UPDATE, DELETE
- Write transaction services

**Pages:**
- `BudgetDetail.tsx` — edit/delete actions on transaction list
- `Dashboard.tsx` — edit/delete actions on recent transactions

---

### Phase 7: Polish ⬜
**Tasks:**
- Add NotiToast for mutation notifications
- DeleteBudgetButton: re-style the size
- Polish BalanceSummary: 30% full width, give it a max height
- Add navigation arrows for each page
- Polish the spinner for page navigation
- Loader for components (BudgetContainer)
- TransactionContainerExtended: show all transactions
- Log out button
