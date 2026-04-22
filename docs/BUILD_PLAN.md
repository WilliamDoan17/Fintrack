# BUILD PLAN
This document outlines the full development plan for Fintrack.

## Stages

### MVP (Completed)
Users can:
- Create, update, delete budgets and sub-budgets
- Log, update, delete transactions in a budget
- View recent transactions and balance
- Navigate between budgets and sub-budgets
- Log in and out securely

### Stage 2 — UI & Core Features
Users can:
- View balance on each BudgetCard
- Search and filter transactions
- Navigate budgets as a hierarchy tree
- Move budgets and transactions between parents
- Transfer money between budgets
- Set spending limits with warnings and alerts
- Designate an income budget as the source of all money
- View spending stats and charts
- Toggle dark/light mode
- Use the app on mobile (responsive UI)

### Stage 3 — Advanced & Scale
Users can:
- Track transactions in multiple currencies
- Schedule one-time and recurring transactions (AutoPay)
- Manage active sessions and revoke access
- Split bills with others
- Track loans and owes
- Manage their profile
- Interact with an AI agent that can read, plan, and execute financial actions

### Post Stage 3 — Noted for Later
- Onboarding — first time user guided setup flow
- Data management — CSV export/import, backup & restore
- Social/Sharing — shared budgets between users (couples, families, roommates)

---

## Development Philosophy
- Vertical phases — one complete feature at a time
- CR (Create + Read) before UD (Update + Delete)
- Backend (RLS + services) before frontend (UI)
- Optimistic updates on the frontend — rollback on failure via try/catch
- Test each phase via UI + Supabase dashboard before moving on

