import { useCallback, useEffect, useState } from "react"
import { getAllTransfers, getBudgetTransfers } from '../backend/services/transfers'
import type { Transfer } from "../backend/types/transfers"

const useTransfers = (budgetId: string | null = null) => {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTransfers = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = budgetId
        ? await getBudgetTransfers(budgetId)
        : await getAllTransfers()
      setTransfers(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [budgetId])

  useEffect(() => {
    fetchTransfers()
  }, [fetchTransfers])

  return {
    transfers,
    loading,
    error,
    refetch: fetchTransfers
  }
}

export default useTransfers
