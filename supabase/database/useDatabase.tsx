import { transaction, transactionInput, getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const value = { 
        getTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
    }

    return (
        <DataContext.Provider 
            value = {value}
        >
            {children}
        </DataContext.Provider>
    )
}
