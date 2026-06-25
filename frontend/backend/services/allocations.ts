import { supabase } from '../supabase'
import type { Allocation, AllocationInput } from '../types/allocations'

export type * from '../types/allocations'

export const createAllocation = async (input: AllocationInput): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('allocations')
    .insert({ ...input, user_id: user.id })
  if (error) throw error
}

export const updateAllocation = async (allocationId: string, updates: Partial<AllocationInput>): Promise<void> => {
  const { error } = await supabase
    .from('allocations')
    .update(updates)
    .eq('id', allocationId)
  if (error) throw error
}

export const deleteAllocation = async (allocationId: string): Promise<void> => {
  const { error } = await supabase
    .from('allocations')
    .delete()
    .eq('id', allocationId)
  if (error) throw error
}

export const getAllocation = async (allocationId: string): Promise<Allocation> => {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .eq('id', allocationId)
    .single()
  if (error) throw error
  return data
}

export const getAllAllocations = async (): Promise<Allocation[]> => {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export const getBudgetAllocations = async (budgetId: string): Promise<Allocation[]> => {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .eq('to_budget_id', budgetId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
