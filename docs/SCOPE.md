# Scope

Fintrack is a personal finance web application focused on clarity, control, and flexibility in budget-based money management. This document summarizes the complete feature scope for the application.

## Budget Management

- Create, update, and delete budgets and sub-budgets
- View and organize budgets in a navigable hierarchy/tree
- Set spending limits with configurable warnings and alerts
- Designate an income budget as the primary source of funds
- View real-time balance on each budget
- Move budgets between parents
- Transfer money between budgets
- Manage budgets across multiple currencies

## Transactions

- Log income transactions (`add`) on the income budget only — the sole entry point for money into the system
- Log spending transactions (`withdraw`) on regular budgets only
- Update and delete transactions
- View recent transactions and total balances
- Move transactions between budgets
- Paginate and search/filter transactions (by type, amount, name, etc.)
- Schedule one-time and recurring transactions (AutoPay)
- Split bills and track participant shares
- Track and link loans or debts to transactions

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
- Income versus expenses analysis and highlights of spending habits
- Budget limits and low-balance warnings

## Advanced & Collaboration

- Bill splitting among multiple participants, with per-user transaction tracking
- Loan & owes dashboard (money lent, owed, marked as settled, outstanding overview)
- Data export/import (CSV), backup, and restore
- Onboarding flow for new users
- Budget sharing (collaborative/group budgets)

## AI Assistance

- Integrated AI agent for budget analysis, spending insights, and planning recommendations
- (Planned) Secure agent-driven automation to create/move budgets and transactions, with confirmation flows

