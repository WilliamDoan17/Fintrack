import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllTransfers,
  getBudgetTransfers,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from '../backend/services/transfers'
import type { Transfer, TransferInput } from '../backend/types/transfers'

export const useTransfers = (budgetId: string | null = null) => {
  const { data: transfers = [], isLoading, error } = useQuery<Transfer[]>({
    queryKey: ['transfers', budgetId],
    queryFn: () => budgetId ? getBudgetTransfers(budgetId) : getAllTransfers(),
  })
  return { transfers, isLoading, error }
}

const TRANSFER_INVALIDATION_KEYS = [
  ['transfers'],
  ['budget'],
  ['budgets'],
]

export const useCreateTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, TransferInput>({
    mutationFn: createTransfer,
    onSuccess: () => { TRANSFER_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, { id: string; updates: Partial<TransferInput> }>({
    mutationFn: ({ id, updates }) => updateTransfer(id, updates),
    onSuccess: () => { TRANSFER_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteTransfer,
    onSuccess: () => { TRANSFER_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}
