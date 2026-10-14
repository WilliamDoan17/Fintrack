# Fintrack

Personal finance app: strict envelope budgeting plus tracking of money owed. Built as a
tool I use first and a portfolio piece second. React + Vite + TypeScript + Tailwind +
React Query on the frontend, Supabase (Postgres + RLS) behind it, deployed on Vercel.

## Read first

- `docs/SCOPE.md` — purpose, thesis, ordered roadmap, non-goals
- `docs/ARCHITECTURE.md` — data model and why, layout rules, conventions, flows
- `docs/SPRINTS.md` — current sprint, backlog, retros
- `docs/FRICTION.md` — raw complaints from real use; input to sprint triage

Don't recreate docs that list components, hooks, types, services or schema. The code and
`supabase/migrations/` are the source of truth for those.

## Layout

- `frontend/` — the Vite app (run npm commands from here)
  - `backend/services/` — the only layer that imports `supabase`
  - `hooks/` wrap services in React Query; `components/` call hooks; pages compose
- `supabase/migrations/` — the database, as SQL. Source of truth for schema, RLS,
  triggers and functions
- `docs/` — the four docs above, nothing else

## Commands

From `frontend/`: `npm run dev`, `npm run build` (runs `tsc -b`), `npm run lint`.
From the repo root: `npx supabase migration new <name>`, `npx supabase db push`.

## Rules that aren't obvious from the code

- **Balances are derived, never stored.** No `balance` column anywhere. Formulas are in
  `ARCHITECTURE.md`. Don't add one, and don't add triggers to maintain one.
- **Money enters a budget only through `allocations`.** A new path breaks the envelope
  guarantee; stop and raise it instead of building it.
- Services and hooks **never accept `user_id`**. Services read it via
  `supabase.auth.getUser()`; RLS enforces it.
- Mutations invalidate at **prefix level** (`['transactions']`), because a change affects
  every ancestor budget's balance.
- Keep vocabulary identical across layers (`allocations` table, `allocations.ts`,
  `hooks/allocations.ts`, `components/allocations/`) so one grep returns a whole vertical.
- No optimistic updates: pending, invalidate, refetch.

## Database changes

- Every schema change is a new migration file. **Never edit a migration that has been
  applied.** Write a new one.
- Don't suggest changing the schema in the Supabase dashboard. If it happens, run
  `npx supabase db pull` afterward.
- Apply additive migrations before deploying code that uses them, and drop old things last.
- Pushing to git does not touch the database. `db push` is a separate, manual step.

## Working style

- One feature per sprint; the sprint's flow sketch goes in `SPRINTS.md` before coding
  when the work crosses layers or touches money math.
- When I report an annoyance while using the app, add it to `docs/FRICTION.md` instead
  of fixing it on the spot, unless it blocks recording money.
- Don't rewrite docs unprompted. Update `SPRINTS.md` and `FRICTION.md` as work
  happens; touch `SCOPE.md` only when the roadmap order changes.
