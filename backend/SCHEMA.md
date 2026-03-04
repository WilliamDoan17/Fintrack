# SCHEMA
This document states the data schema for Fintrack project

## Conventions:
- Follows Supabase PostgreSQL conventions for types, naming and usage

## Data Schema

### transactions

#### Properties
- id:
  -- primary key
  -- type: uuid
- user_id:
  -- foreign key (references auth.users)
  -- type: uuid
  -- constraints:
    --- not null
    --- on delete cascade
  -- Tells us which user the transaction belongs to
- type:
  -- type: transaction_type (ENUM('add', 'withdraw'))
  -- defaults to 'add'
  -- Determines if the transaction is an addition or withdrawal
- amount:
  -- type: numeric(15, 2)
  -- constraints:
    --- not null
    --- check: amount > 0
  -- Value of the transaction, with 2 decimal places precision
- name:
  -- type: text
  -- constraints:
    --- not null
    --- check: name <> ''
  -- Name of the transaction, could be about purpose or message
- created_at:
  -- type: timestamptz
  -- defaults to now()
  -- Records when the transaction was logged

#### Implementation
```postgres
create type transaction_type as ENUM ('add', 'withdraw');

create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type transaction_type default 'add',
  amount numeric(15, 2) check(amount > 0) not null,
  name text check(name <> '') not null,
  created_at timestamptz default now()
);
```
