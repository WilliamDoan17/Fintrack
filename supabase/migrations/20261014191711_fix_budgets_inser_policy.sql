DROP POLICY "on_budgets_insert" ON public.budgets;

CREATE POLICY "on_budgets_insert"
on public.budgets
for INSERT
to "authenticated"
with check (
  user_id = auth.uid()
  AND (
    parent_id IS NULL
    OR EXISTS (
    SELECT 1 from public.budgets p
    where 
      p.id = budgets.parent_id and p.user_id = auth.uid()
    )
  )
);
