// ### budgets
// #### Properties
// - id:
//   - type: uuid
//   - primary key
//   - defaults to gen_random_uuid()
//   - Unique identifier for each budget
// - user_id:
//   - type: uuid
//   - foreign key, references auth.users(id)
//   - constraints:
//     - not null
//     - on delete cascade
//   - Tells us which user the budget belongs to
// - created_at:
//   - type: timestamptz
//   - defaults to now()
//   - constraints:
//     - not null
//   - Records when the budget was created
// - name:
//   - type: text
//   - constraints:
//     - not null
//     - check: name <> ''
//   - The display name of the budget
// - parent_id:
//   - type: uuid
//   - foreign key, references budgets(id)
//   - defaults to null
//   - constraints:
//     - on delete cascade
//   - References the parent budget, null if this is a root budget
// #### Implementation
// ```postgres
// create table budgets (
//   id uuid default gen_random_uuid() primary key,
//   user_id uuid not null references auth.users(id) on delete cascade,
//   created_at timestamptz default now() not null,
//   name text not null check(name <> ''),
//   parent_id uuid references budgets(id) on delete cascade
// );
//
//
//

export interface Budget {
  id: string,
  user_id: string,
  created_at: string,
  name: string,
  parent_id: string | null,
}

export type BudgetInput = Omit<Budget, 'id' | 'created_at'>;
