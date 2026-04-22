# SCHEMA
This document states the data schema for Fintrack project.

## Conventions
- Follows Supabase PostgreSQL conventions for types, naming and usage

---

## Data Schema

### budgets

#### Interface
| Field | Type | Constraints |
|-------|------|-------------|
| id | uuid | primary key, default gen_random_uuid() |
| user_id | uuid | not null, FK → auth.users(id) on delete cascade |
| created_at | timestamptz | not null, default now() |
| name | text | not null, check name <> '' |
| parent_id | uuid | null, FK → budgets(id) on delete cascade |
| balance | numeric(15, 2) | not null, default 0 |

#### Indexes
| Name | Column | Method |
|------|--------|--------|
| idx_budgets_parent_id | parent_id | btree |

---

### transactions

#### Types
| Name | Values |
|------|--------|
| transaction_type | 'add', 'withdraw' |

#### Interface
| Field | Type | Constraints |
|-------|------|-------------|
| id | uuid | primary key, default gen_random_uuid() |
| user_id | uuid | not null, FK → auth.users(id) on delete cascade |
| budget_id | uuid | not null, FK → budgets(id) on delete cascade |
| type | transaction_type | default 'add' |
| amount | numeric(15, 2) | not null, check amount > 0 |
| name | text | not null, check name <> '' |
| created_at | timestamptz | not null, default now() |

### transfers

#### Interface
| Field | Type | Constraints |
| --- | --- | --- |
| id | uuid | primary key, default gen_random_uuid |
| from_budget_id | uuid | not null, FK -> budgets(id) on delete cascade |
| to_budget_id | uuid | not null, FK -> budgets(id) on delete cascade |
| 
