import { useEffect, useState, useCallback } from 'react'
import { getBudget } from '../backend/services/budgets'
import type { Budget } from '../backend/types/budgets'

const useBudgetInfo = (budgetId: string | null) => {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBudget = useCallback(async (): Promise<void> => {
    if (!budgetId) return
    setLoading(true)
    try {
      const data = await getBudget(budgetId)
      setBudget(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [budgetId])

  useEffect(() => {
    fetchBudget()
  }, [fetchBudget])

  return { budget, loading, error, refetch: fetchBudget }
}

export default useBudgetInfo
