import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./transactions";
import { useState, createContext, Provider, Children, useContext } from 'react';
import { AuthContext } from '../auth/useAuth';
import { getBudgets, addBudget, deleteBudget, updateBudget } from './budgets'
import { supabase } from "../supabaseConfig";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

    class Node {
        constructor(data) {
            this.next = null;
            this.data = data;
        }
    };

    class Queue {
        constructor() {
            this.front = null;
            this.tail = null;
            this.size = 0;
        }

        isEmpty() {
            return this.size === 0;
        }

        push(data) {
            const newNode = new Node(data);
            if (this.isEmpty()) {
                this.front = newNode;
                this.rear = newNode;
            } else {
                this.rear.next = newNode;
                this.rear = newNode;
            }
            this.size++;
            return newNode;
        }

        getFront(data) {
            return this.isEmpty() ? null : this.front;
        }

        pop(data) {
            const targetNode = this.getFront();
            if (targetNode !== null) {
                
            }
        }
    }

    const getAllSubbudgets = async (budget) => {
        const result = [];

    }

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
        getAllSubbudgets,
    }

    return (
        <DataContext.Provider 
            value = {value}
        >
            {children}
        </DataContext.Provider>
    )
}
