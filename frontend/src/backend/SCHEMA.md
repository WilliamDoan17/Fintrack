# SCHEMA
This document states the data schema for Fintrack project

## Conventions:
- Follows Supabase PostgreSQL conventions for types, naming and usage

## Data Schema

### budgets
#### Properties
- id:
  - type: uuid
  - primary key
  - defaults to gen_random_uuid()
  - Unique identifier for each budget
- user_id:
  - type: uuid
  - foreign key, references auth.users(id)
  - constraints:
    - not null
    - on delete cascade
  - Tells us which user the budget belongs to
- created_at:
  - type: timestamptz
  - defaults to now()
  - constraints:
    - not null
  - Records when the budget was created
- name:
  - type: text
  - constraints:
    - not null
    - check: name <> ''
  - The display name of the budget
- parent_id:
  - type: uuid
  - foreign key, references budgets(id)
  - defaults to null
  - constraints:
    - on delete cascade
  - References the parent budget, null if this is a root budget
#### Implementation
```postgres
create table budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  name text not null check(name <> ''),
  parent_id uuid references budgets(id) on delete cascade
);
```

### transactions
#### Properties
- id:
  - type: uuid
  - primary key
  - defaults to gen_random_uuid()
- user_id:
  - type: uuid
  - foreign key, references auth.users(id)
  - constraints:
    - not null
    - on delete cascade
- budget_id:
  - type: uuid
  - foreign key, references budgets(id)
  - constraints:
    - not null
    - on delete cascade
- type:
  - type: transaction_type (ENUM('add', 'withdraw'))
  - defaults to 'add'
  - Determines if the transaction is an addition or withdrawal
- amount:
  - type: numeric(15, 2)
  - constraints:
    - not null
    - check: amount > 0
  - Value of the transaction, with 2 decimal places precision
- name:
  - type: text
  - constraints:
    - not null
    - check: name <> ''
  - Name of the transaction, could be about purpose or message
- created_at:
  - type: timestamptz
  - defaults to now()
  - constraints:
    - not null

#### Implementation
```postgres
create type transaction_type as ENUM ('add', 'withdraw');

create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  budget_id uuid not null references budgets(id) on delete cascade,
  type transaction_type default 'add',
  amount numeric(15, 2) check(amount > 0) not null,
  name text check(name <> '') not null,
  created_at timestamptz default now() not null
);
```
