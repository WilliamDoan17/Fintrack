import { transaction, transactionInput, getTransactions, addTransaction, deleteTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const value = { 
        getTransactions,
        addTransaction,
        deleteTransaction
    }

    return (
        <DataContext.Provider 
            value = {value}
        >
            {children}
        </DataContext.Provider>
    )
}
