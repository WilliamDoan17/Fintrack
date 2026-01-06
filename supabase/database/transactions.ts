import { User } from '@supabase/supabase-js'
import { supabase } from '../supabaseConfig'

export interface transaction {
    id: string,
    created_at: string,
    user_id: string,
    purpose: string,
    value: number,
}

export type transactionInput = Omit<transaction, 'id' | 'user_id' | 'created_at'>

export const getTransactions = async (user: User) => {
  try {
    if (!user?.id) return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching transactions:', error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('Unexpected error fetching transactions:', err);
    return [];
  }
};

export const addTransaction = async (user: User, transactionInput: transactionInput) => {
  try  {
    if (!user?.id) return;
    const newTransaction = {
      ...transactionInput,
      user_id: user.id,
    }
    const { data, error } = await supabase
      .from('transactions')
      .insert(newTransaction)
      .select()
      .single();
    if (error) {
      console.error(error);
    } else {
      return data;
    }
  } catch(error) {
    console.error(error);
  }
}

export const deleteTransaction = async (transaction) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transaction.id)
      .select()
      .single();
    if (error) {
      console.error(error);
    } else {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}