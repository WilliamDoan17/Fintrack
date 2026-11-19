CREATE OR REPLACE FUNCTION 
public.get_budget_allocations(budget_id uuid)
  RETURNS SETOF public.allocations
  LANGUAGE plpgsql
  STABLE
  SET search_path = public
AS $$
BEGIN
  WITH RECURSIVE budget_tree AS (
    SELECT b.id FROM budgets b WHERE b.id = $1

    UNION ALL
    SELECT c.id FROM budgets c
    JOIN budget_tree bt ON c.parent_id = bt.id
  )

  SELECT a.* FROM allocations a 
  WHERE a.to_budget_id IN (SELECT id FROM budget_tree);
END;
$$;
