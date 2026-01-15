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
        } else {
            return data || [];
        }
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