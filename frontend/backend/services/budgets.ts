// ### Services
//   - ** createBudget(BudgetInput) ** → `void`
//     - throws on failure
//       - ** updateBudget(budget_id, updates) ** → `void`
//         - throws on failure
//           - parameters:
// - `budget_id`: uuid
//   - `updates`: Partial < BudgetInput >
// - ** deleteBudget(budget_id) ** → `void`
//   - throws on failure
//     - parameters:
// - `budget_id`: uuid
//   - ** getBudget(budget_id) ** → `Budget`
//     - parameters:
// - `budget_id`: uuid
//   - ** getAllBudgets() ** → `Budget[]`
//     - ** getRootBudgets() ** → `Budget[]`
//       - ** getChildBudgets(parent_id) ** → `Budget[]`
//         - parameters:
// - `parent_id`: uuid
//
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
