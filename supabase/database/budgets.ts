import { supabase } from '../supabaseConfig'

export interface budget {
    id: string,
    created_at: string,
    user_id: string,
    parent_id: string,
}

export type budgetInput = Omit<budget, 'id' | 'created_at' | 'user_id' | 'parent_id'>

export const getBudgets = async (user, parent = null) => {
    try {
        let query = supabase
            .from('budgets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (parent === null) {
            query = query.is('parent_id', null);
        } else {
            query = query.eq('parent_id', parent.id);
        }

        const { data, error } = await query;
        if (error) {
            console.error(error);
        }
        return data || [];
    } catch (error) {
        console.error(error);
    }
}

export const addBudget = async (user, budgetInput : budgetInput, parent = null) => {
    try {
        const newBudget = {
            ...budgetInput,
            user_id: user.id,
            parent_id: parent?.id,
        };
        const { data, error } = await supabase
            .from('budgets')
            .insert(newBudget)
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

export const deleteBudget = async (targetBudget) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', targetBudget.id)
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

export const updateBudget = async (targetBudget, updatedBudget) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .update(updatedBudget)
            .eq('id', targetBudget.id)
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
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
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
            this.front = targetNode.next;
            this.size--;
        }
        return targetNode;
    }
}


export const getAllSubBudgets = async (user, budget = null) => {
    let result = [budget];
    const queue = new Queue();
    queue.push(budget);
    while (!queue.isEmpty()) {
        const currentBudget = queue.pop().data;
        const data = await getBudgets(user, currentBudget);
        data.forEach(budget => queue.push(budget));
        result = [
            ...result,
            ...data,
        ]
    }
    return result;
}