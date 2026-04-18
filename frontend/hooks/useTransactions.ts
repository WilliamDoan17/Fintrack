import { useCallback, useEffect, useState } from "react"
import { getAllTransactions, getBudgetTransactions } from '../backend/services/transactions'
import type { Transaction } from "../backend/types/transactions"

const useTransactions = (budgetId: string | null = null) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTransactions = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = budgetId
        ? await getBudgetTransactions(budgetId)
        : await getAllTransactions();
      setTransactions(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [budgetId])

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
