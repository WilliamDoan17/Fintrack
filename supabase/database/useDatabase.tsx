import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';
import { getBudgets, addBudget, deleteBudget, updateBudget, getAllSubBudgets, getBudgetAndAllSubBudgets } from './budgets'
import { supabase } from "../supabaseConfig";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const getAllTransactions = async (user, budget) => {
    try {
      const allBudgetIds = (await getAllSubBudgets(user, budget)).map(budget => budget.id);
      const query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .in('budget_id', allBudgetIds)
        .order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) {
        console.error(error);
      }
      return data || [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  const getAllTransactionsFromBudget = async (budget = null) => {
    try {
      const { data, error } = await supabase.rpc('get_all_transactions_from_budget', {
        b_id: budget?.id || null,
      });
      if (error) {
        console.error(error);
      }
      return data || [];
    } catch (err) {
      console.error(err);
    }
  }

  const value = {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getBudgets,
    addBudget,
    deleteBudget,
    updateBudget,
    getAllTransactions,
    getAllSubBudgets,
    getAllTransactionsFromBudget,
    getBudgetAndAllSubBudgets,
  }

  return (
    <DataContext.Provider
      value={value}
    >
      {children}
    </DataContext.Provider>
  )
}
