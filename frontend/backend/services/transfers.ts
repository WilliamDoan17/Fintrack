import { supabase } from "../supabase";
import type { Transfer, TransferInput } from '../types/transfers'
export type * from '../types/transfers'

export const createTransfer = async (input: TransferInput): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('transfers')
    .insert({ ...input, user_id: user.id })
  if (error) throw error
}

export const updateTransfer = async (transferId: string, updates: Partial<TransferInput>): Promise<void> => {
  const { error } = await supabase
    .from('transfers')
    .update(updates)
    .eq('id', transferId)
  if (error) throw error
}

export const deleteTransfer = async (transferId: string): Promise<void> => {
  const { error } = await supabase
    .from('transfers')
    .delete()
    .eq('id', transferId)
  if (error) throw error
}

export const getTransfer = async (transferId: string): Promise<Transfer> => {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .eq('id', transferId)
    .single()
  if (error) throw error
  return data
}

export const getAllTransfers = async (): Promise<Transfer[]> => {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  console.log(data);
  return data ?? []
}

export const getBudgetTransfersIn = async (budgetId: string): Promise<Transfer[]> => {
  const { data, error } = await supabase
    .rpc('get_budget_transfers_in', { budget_id: budgetId})
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export const getBudgetTransfersOut = async (budgetId: string): Promise<Transfer[]> => {
  const { data, error } = await supabase
    .rpc('get_budget_transfers_out', { budget_id: budgetId})
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
