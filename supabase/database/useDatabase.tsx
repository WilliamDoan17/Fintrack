import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';
import { getBudgets, addBudget } from './budgets'

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const value = { 
        getTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getBudgets,
        addBudget
    }

    return (
        <DataContext.Provider 
            value = {value}
        >
            {children}
        </DataContext.Provider>
    )
}
