import { supabase } from '../supabase'

export interface Budget {
  id: string,
  user_id: string,
  created_at: string,
  name: string,
  parent_id: string | null,
}

export type BudgetInput = Omit<Budget, 'id' | 'created_at' | 'user_id'>;

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

export const getBudget = async (id: string): Promise<Budget | null> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

//  - **updateBudget(budget_id, updates)** → `void`
//   - throws on failure
//   - parameters:
//     - `budget_id`: uuid
//     - `updates`: Partial<BudgetInput>
// - **deleteBudget(budget_id)** → `void`
//   - throws on failure
//   - parameters:
//     - `budget_id`: uuid


export const updateBudget = async (id: string, updates: Partial<BudgetInput>): Promise<void> => {
  const { error } = await supabase
    .from('budgets')
    .update(updates)
    .eq("id", id)
  if (error) throw error
}


