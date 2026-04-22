import { supabase } from "../supabase";
import type { Transaction, TransactionInput } from '../types/transactions'

export type * from '../types/transactions'


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
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// - **updateTransaction(transaction_id, updates)** → `void`
//   - throws on failure
//   - parameters:
//     - `transaction_id`: uuid
//     - `updates`: Partial<TransactionInput>
// - **deleteTransaction(transaction_id)** → `void`
//   - throws on failure
//   - parameters:
//     - `transaction_id`: uuid


export const updateTransaction = async (transactionId: string, updates: Partial<TransactionInput>): Promise<void> => {
  const { error } = await supabase
    .from('transactions')
    .update(updates)
    .eq("id", transactionId)
  if (error) throw error
}

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq("id", transactionId)
  if (error) throw error
}

