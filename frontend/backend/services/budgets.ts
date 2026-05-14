import { supabase } from '../supabase'
import type { Budget, BudgetInput } from '../types/budgets'

export const createBudget = async (input: BudgetInput) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('budgets')
    .insert({
      ...input,
      user_id: user.id,
    })
  if (error) throw error
}

export const getAllBudgets = async (): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')

  if (error) throw error
  return data ?? []
}

export const getIncomeBudget = async (): Promise<Budget> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('is_income', true)
    .single()
  if (error) throw error
  return data
}

export const getAllSpendingBudgets = async (): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('is_income', false)

  if (error) throw error
  return data ?? []
}

export const getRootSpendingBudgets = async (): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .is('parent_id', null)
    .eq('is_income', false)

  if (error) throw error
  return data ?? []
}

export const getChildBudgets = async (parentId: string): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('parent_id', parentId)

  if (error) throw error
  return data ?? []
}

export const getBudget = async (id: string): Promise<Budget | null> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const updateBudget = async (id: string, updates: Partial<BudgetInput>): Promise<void> => {
  const { error } = await supabase
    .from('budgets')
    .update(updates)
    .eq("id", id)
  if (error) throw error
}

export const deleteBudget = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq("id", id)
  if (error) throw error
}
