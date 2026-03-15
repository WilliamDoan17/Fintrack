import { supabase } from "../supabase";

export type TransactionType = 'add' | 'withdraw';

export interface Transaction {
  id: string,
  user_id: string,
  budget_id: string,
  type: TransactionType,
  amount: number,
  name: string,
  created_at: string,
}

export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at'>


export const createTransaction = async (input: TransactionInput): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('transactions')
    .insert({
      ...input,
      user_id: user.id,
    })
  if (error) throw error
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export const getBudgetTransactions = async (budgetId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .rpc("get_budget_transactions", { 'budget_id': budgetId })

  if (error) throw error
  return data ?? []
}







