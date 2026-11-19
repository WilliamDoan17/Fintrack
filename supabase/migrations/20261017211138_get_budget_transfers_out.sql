CREATE OR REPLACE FUNCTION 
get_budget_transfers_out(budget_id uuid)
  RETURNS SETOF public.transfers
  LANGUAGE sql
  STABLE
  SET search_path = public
AS $$
  WITH RECURSIVE budget_tree AS (
    SELECT id FROM budgets b
    WHERE b.id = $1

    UNION ALL 
    SELECT c.id FROM budget_tree bt
    JOIN budgets c ON c.parent_id = bt.id
  )

  SELECT t.* FROM transfers t
  WHERE t.from_budget_id IN (SELECT id FROM budget_tree);
$$;

