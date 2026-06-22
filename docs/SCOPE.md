# Scope

Fintrack is a personal finance web application focused on clarity, control, and an honest view of financial condition. It follows a strict separation between income management and spending management, designed for future integration with bank APIs and liability tracking.

## Budget Management

- Create, update, and delete spending budgets and sub-budgets
- View and organize budgets in a navigable hierarchy/tree
- Set spending limits with configurable warnings and alerts
- View real-time balance on each budget
- Move budgets between parents
- Manage budgets across multiple currencies

## Incomes

- Log income entries as independent records (not tied to a budget)
- Update and delete income entries
- View income history and totals on the /income page
- Unallocated balance: income minus all allocations to budgets

## Allocations

- Allocate income to spending budgets (the sole entry point for money into budgets)
- Update and delete allocations
- View allocation history per income source and per budget
- Enforce that budget balance only grows through allocations (strict envelope model)

## Transactions

- Log spending transactions on spending budgets only
- Update and delete transactions
- View recent transactions and total balances per budget
- Move transactions between budgets
- Paginate and search/filter transactions (by amount, name, etc.)
- Schedule one-time and recurring transactions (AutoPay)
- Split bills and track participant shares

## Transfers

- Transfer money between spending budgets
- Update and delete transfers
- View transfer history per budget (with from/to context)

## Liabilities *(planned)*

- Track loans and debts (money lent and owed)
- Link liabilities to transactions
- Mark liabilities as settled, view outstanding overview

## User Interface & Experience

- Fully responsive UI for seamless use on both desktop and mobile devices
- Light and dark mode toggle with persistent theme preference
- Collapsible sidebar with quick access to features
- Modal dialogs for all create, edit, and delete flows
- Skeleton loaders and optimized loading states for a smooth experience
- Toast notification system for immediate feedback on actions

## User Accounts & Security

- Secure sign up, login, and logout
- Account and session management (list active sessions, revoke access, device information)
- User profile management (avatar, display name, account settings)
- Protected routes and layouts to enforce user authentication

## Analytics & Insights

- Budget spending dashboard with charts and breakdowns
- Per-budget analytics, category breakdowns, and time-based spending charts
- Income versus allocated/spent analysis
- Budget limits and low-balance warnings

## Advanced & Collaboration

- Bill splitting among multiple participants, with per-user transaction tracking
- Data export/import (CSV), backup, and restore
- Onboarding flow for new users
- Budget sharing (collaborative/group budgets)

## AI Assistance

- Integrated AI agent for budget analysis, spending insights, and planning recommendations
- (Planned) Secure agent-driven automation to create/move budgets and transactions, with confirmation flows

## Bank Integration *(planned)*

- Link bank accounts via Plaid or similar APIs
- Auto-import bank statements as income entries
- Reconcile imported records with manual entries
