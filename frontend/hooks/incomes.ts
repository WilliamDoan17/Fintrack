import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../backend/services/incomes'
import type { Income, IncomeInput } from '../backend/types/incomes'

export const useIncomes = () => {
  const { data: incomes = [], isLoading, error } = useQuery<Income[]>({
    queryKey: ['incomes'],
    queryFn: getAllIncomes,
  })
  return { incomes, isLoading, error }
}

const INCOME_INVALIDATION_KEYS = [
  ['incomes'],
]

export const useCreateIncome = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, IncomeInput>({
    mutationFn: createIncome,
    onSuccess: () => { INCOME_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useUpdateIncome = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, { id: string; updates: Partial<IncomeInput> }>({
    mutationFn: ({ id, updates }) => updateIncome(id, updates),
    onSuccess: () => { INCOME_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useDeleteIncome = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteIncome,
    onSuccess: () => { INCOME_INVALIDATION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}
