import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllAllocations,
  getBudgetAllocations,
  getAllocation,
  createAllocation,
  updateAllocation,
  deleteAllocation,
} from '../backend/services/allocations'
import type { Allocation, AllocationInput } from '../backend/types/allocations'

export const useAllocations = () => {
  const { data: allocations = [], isLoading, error } = useQuery<Allocation[]>({
    queryKey: ['allocations'],
    queryFn: getAllAllocations,
  })
  return { allocations, isLoading, error }
}

export const useBudgetAllocations = (budgetId: string) => {
  const { data: allocations = [], isLoading, error } = useQuery<Allocation[]>({
    queryKey: ['allocations', budgetId],
    queryFn: () => getBudgetAllocations(budgetId),
  })
  return { allocations, isLoading, error }
}

export const useAllocation = (allocationId: string | null) => {
  const { data: allocation, isLoading, error } = useQuery<Allocation>({
    queryKey: ['allocation', allocationId],
    queryFn: () => getAllocation(allocationId!),
    enabled: allocationId !== null,
  })
  return { allocation, isLoading, error }
}

export const useCreateAllocation = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, AllocationInput>({
    mutationFn: createAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useUpdateAllocation = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, { id: string; updates: Partial<AllocationInput> }>({
    mutationFn: ({ id, updates }) => updateAllocation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useDeleteAllocation = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
