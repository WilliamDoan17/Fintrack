import { supabase } from '../supabase'
import type { Income, IncomeInput } from '../types/incomes'

export type * from '../types/incomes'

export const createIncome = async (input: IncomeInput): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('incomes')
    .insert({ ...input, user_id: user.id })
  if (error) throw error
}

export const updateIncome = async (incomeId: string, updates: Partial<IncomeInput>): Promise<void> => {
  const { error } = await supabase
    .from('incomes')
    .update(updates)
    .eq('id', incomeId)
  if (error) throw error
}

export const deleteIncome = async (incomeId: string): Promise<void> => {
  const { error } = await supabase
    .from('incomes')
    .delete()
    .eq('id', incomeId)
  if (error) throw error
}

export const getIncome = async (incomeId: string): Promise<Income> => {
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('id', incomeId)
    .single()
  if (error) throw error
  return data
}

export const getAllIncomes = async (): Promise<Income[]> => {
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
