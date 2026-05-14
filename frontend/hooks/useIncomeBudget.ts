import { useEffect, useState, useCallback } from 'react'
import { getIncomeBudget } from '../backend/services/budgets'
import type { Budget } from '../backend/types/budgets'

const useIncomeBudget = () => {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBudget = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = await getIncomeBudget()
      setBudget(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBudget()
  }, [fetchBudget])

  return { budget, loading, error, refetch: fetchBudget }
}

export default useIncomeBudget
