ALTER TABLE public.transfers
  ADD CONSTRAINT transfers_distinct_budgets_check
  CHECK (from_budget_id <> to_budget_id);
