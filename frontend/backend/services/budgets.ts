import { supabase } from '../supabase'

export interface Budget {
  id: string,
  user_id: string,
  created_at: string,
  name: string,
  parent_id: string | null,
}

export type BudgetInput = Omit<Budget, 'id' | 'created_at'>;

export const createBudget = async (input: BudgetInput) => {
  const { error } = await supabase
    .from('budgets')
    .insert(input)
  if (error) throw error
}

export const getAllBudgets = async (): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')

  if (error) throw error
  return data ?? []
}

export const getRootBudgets = async (): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .is('parent_id', null)

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
