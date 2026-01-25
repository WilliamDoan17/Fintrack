import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';
import { getBudgets, addBudget, deleteBudget, updateBudget, getAllSubBudgets } from './budgets'
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
    }

    return (
        <DataContext.Provider 
            value = {value}
        >
            {children}
        </DataContext.Provider>
    )
}
