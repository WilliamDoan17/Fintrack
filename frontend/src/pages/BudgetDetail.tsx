import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import { getBudget, type Budget } from "../../backend/services/budgets";
import useBudgets from "../../hooks/useBudgets";
import { error } from "console";
import PageLoader from "../../components/PageLoader";

const BudgetDetail = () => {
  const { id: budgetId } = useParams();

  const [budgetInfo, setBudgetInfo] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const budgetQuery = useBudgets(budgetId);

  useEffect(() => {
    if (budgetId)
      getBudget(budgetId)
        .then(setBudgetInfo)
        .catch(setError)
        .finally(() => setLoading(false))
  }, [budgetId])

  if (loading) return PageLoader
  if (error) return <div>Cannot find budget info</div>

  return (
    <div
    >
      <h1>
        {budgetInfo?.name}
      </h1>
      <button></button>
    </div>
  )
}

export default BudgetDetail
