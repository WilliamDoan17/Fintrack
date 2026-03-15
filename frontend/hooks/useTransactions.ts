import { useCallback, useEffect, useState } from "react"
import { getAllTransactions, getBudgetTransactions, type Transaction } from '../backend/services/transactions'

const useTransactions = (budgetId: string | null = null, limit: number = 10) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTransactions = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = budgetId
        ? await getBudgetTransactions(budgetId, limit)
        : await getAllTransactions(limit);
      setTransactions(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [budgetId, limit])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  }
}

export default useTransactions
