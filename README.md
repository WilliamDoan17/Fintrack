# Fintrack
A web app for tracking and managing personal finances through budget-based money allocation.

## Overview
Fintrack is built around the concept of splitting money into purpose-driven budgets — giving every dollar a role so you always know where your money is going. It automates transaction tracking and visualizes budget flow, making it easy to monitor spending habits over time.

Built for anyone who wants clarity over their finances, starting with myself.

## Demo
Coming soon

## Installation
Coming soon

## Features
- **Budget management** — create, update, and delete budgets with support for nested sub-budgets
- **Transaction tracking** — add, edit, and delete transactions per budget, categorized as income or withdrawal
- **Recursive balance** — balance calculations roll up through sub-budgets automatically
- **Dashboard** — overview of total balance, recent transactions, and all budgets at a glance
- **Toast notifications** — real-time feedback on all mutations
- **Collapsible sidebar** — persistent navigation with user info and logout
- **Authentication** — secure sign up and login via Supabase Auth

## Tech Stack
- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase
  - Authentication (Supabase Auth)
  - PostgreSQL Database
  - Row Level Security (RLS)
