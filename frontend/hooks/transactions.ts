import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllTransactions,
  getBudgetTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../backend/services/transactions'
import type { Transaction, TransactionInput } from '../backend/types/transactions'

export const useTransactions = (budgetId: string | null = null) => {
  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions', budgetId],
    queryFn: () => budgetId ? getBudgetTransactions(budgetId) : getAllTransactions(),
  })
  return { transactions, isLoading, error }
}

const TRANSACTION_INVALIDATION_KEYS = [
  ['transactions'],
  ['budget'],
  ['budgets'],
]

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, TransactionInput>({
    mutationFn: createTransaction,
    onSuccess: () => { TRANSACTION_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, { id: string; updates: Partial<TransactionInput> }>({
    mutationFn: ({ id, updates }) => updateTransaction(id, updates),
    onSuccess: () => { TRANSACTION_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteTransaction,
    onSuccess: () => { TRANSACTION_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}
