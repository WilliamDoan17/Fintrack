import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllTransfers,
  getBudgetTransfersIn,
  getBudgetTransfersOut,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from '../backend/services/transfers'
import type { Transfer, TransferInput } from '../backend/types/transfers'

export const useTransfersIn = (budgetId: string | null) => {
  const { data: transfers = [], isLoading, error } = useQuery<Transfer[]>({
    queryKey: ['transfersIn', budgetId],
    queryFn: () => getBudgetTransfersIn(budgetId!),
    enabled: !!budgetId,
  })
  return { transfers, isLoading, error }
}

export const useTransfersOut = (budgetId: string | null) => {
  const { data: transfers = [], isLoading, error } = useQuery<Transfer[]>({
    queryKey: ['transfersOut', budgetId],
    queryFn: () => getBudgetTransfersOut(budgetId!),
    enabled: !!budgetId,
  })
  return { transfers, isLoading, error }
}

// Display list: every transfer when no budget, else in + out for the budget's subtree.
// A transfer inside the subtree appears in both results, so dedupe by id.
export const useTransferList = (budgetId: string | null) => {
  const all = useQuery<Transfer[]>({
    queryKey: ['transfers'],
    queryFn: getAllTransfers,
    enabled: !budgetId,
  })
  const transfersIn = useTransfersIn(budgetId)
  const transfersOut = useTransfersOut(budgetId)

  if (!budgetId) {
    return { transfers: all.data ?? [], isLoading: all.isLoading, error: all.error }
  }

  const byId = new Map<string, Transfer>()
  ;[...transfersIn.transfers, ...transfersOut.transfers].forEach(t => byId.set(t.id, t))
  const transfers = [...byId.values()].sort((a, b) => b.created_at.localeCompare(a.created_at))

  return {
    transfers,
    isLoading: transfersIn.isLoading || transfersOut.isLoading,
    error: transfersIn.error || transfersOut.error,
  }
}

const TRANSFER_INVALIDATION_KEYS = [
  ['transfers'],
  ['transfersIn'],
  ['transfersOut'],
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
