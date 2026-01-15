import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';
import { getBudgets, addBudget, deleteBudget, updateBudget, getAllSubBudgets } from './budgets'
import { supabase } from "../supabaseConfig";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const getAllTransactionsByBudget = async (budget) => {
        
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
        getAllTransactionsByBudget,
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
