import { useEffect, useState, useCallback } from 'react'
import { getRootSpendingBudgets, getChildBudgets } from '../backend/services/budgets'
import type { Budget } from '../backend/types/budgets'

const useSpendingBudgets = (parentId: string | null = null) => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBudgets = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = parentId
        ? await getChildBudgets(parentId)
        : await getRootSpendingBudgets()
      setBudgets(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [parentId])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  return { budgets, loading, error, refetch: fetchBudgets }
}

export default useSpendingBudgets
