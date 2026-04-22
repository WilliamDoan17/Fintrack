# Fintrack
A web app for tracking and managing personal finances through budget-based money allocation.

## Overview
Fintrack is built around the concept of splitting money into purpose-driven budgets — giving every dollar a role so you always know where your money is going. It automates transaction tracking and visualizes budget flow, making it easy to monitor spending habits over time.

Built for anyone who wants clarity over their finances, starting with myself.

## Demo
Coming soon

## Running Locally
1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Create a `.env` file with your Supabase credentials:
```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLIC_URL=your_supabase_anon_key
```
5. Start the dev server: `npm run dev`

## Current Features (MVP)
- **Budget management** — create, update, and delete budgets with support for nested sub-budgets
- **Transaction tracking** — add, edit, and delete transactions per budget, categorized as income or withdrawal
- **Recursive balance** — balance calculations roll up through sub-budgets automatically
- **Dashboard** — overview of total balance, recent transactions, and all budgets at a glance
- **Toast notifications** — real-time feedback on all mutations
- **Collapsible sidebar** — persistent navigation with user info and logout
- **Authentication** — secure sign up and login via Supabase Auth

## Roadmap

### Stage 2 — UI & Core Features
- useReactQuery for caching and automatic refetch
- Dark / light mode toggle
- Responsive UI for mobile
- Balance display on each BudgetCard
- Pagination for transactions
- Transaction search and filter
- Budget manager with hierarchy tree view
- Move budgets and transactions between parents
- Transfer money between budgets
- Income as a special budget
- Budget limits with warnings and low balance alerts
- Stats page — spending over time, per-budget breakdown, income vs expenses

### Stage 3 — Advanced & Scale
- Multi-currency support
- Scheduled and recurring transactions (AutoPay)
- Session management
- Bill splitter
- Loan and owes tracking
- Profiles
- AI Agent — planning assistant and write operations

## Tech Stack
- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase
  - Authentication (Supabase Auth)
  - PostgreSQL Database
  - Row Level Security (RLS)

## Documentation
All project docs live in [`docs/`](./docs/):

| File | Purpose |
|------|---------|
| [SCOPE.md](./docs/SCOPE.md) | Full feature scope by category |
| [BUILD_PLAN.md](./docs/BUILD_PLAN.md) | Development philosophy, stages, and per-phase task breakdown |
| [PROGRESS.md](./docs/PROGRESS.md) | Status of each phase (✅ / ⬜ / Partial) |
| [TASKS.md](./docs/TASKS.md) | Daily task log |
| [PAGES.md](./docs/PAGES.md) | Routes and page-level features |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Frontend structure (hooks, contexts, components, conventions) |
| [SERVICES.md](./docs/SERVICES.md) | Backend service functions (auth, budgets, transactions) |
| [TYPES.md](./docs/TYPES.md) | TypeScript types used across the frontend |
| [SCHEMA.md](./docs/SCHEMA.md) | Database tables, types, and indexes |
| [RLS.md](./docs/RLS.md) | Row Level Security policies |
