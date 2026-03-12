import { useState, useEffect, useCallback } from 'react'
import { getRootBudgets, getChildBudgets, Budget } from '../backend/services/budgets'

const useBudgets = (parentId: string | null) => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBudgets = useCallback(async (): Promise<void> => {
    if (parentId) {
      getChildBudgets(parentId)
        .then(setBudgets)
        .catch(setError)
        .finally(() => {
          setLoading(false)
        })
    } else {
      getRootBudgets()
        .then(setBudgets)
        .catch(setError)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [parentId])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets
  }
}

export default useBudgets
