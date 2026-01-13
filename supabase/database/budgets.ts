import { supabase } from '../supabaseConfig'

export interface budget {
    id: string,
    created_at: string,
    user_id: string,
    children_ids: string[],
    transaction_ids: string[],
}

export type budgetInput = Omit<budget, 'id' | 'created_at' | 'user_id'>

export const getBudgets = async (user) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
        if (error) {
            console.error(error);
        } else {
            return data || [];
        }
    } catch (error) {
        console.error(error);
    }
}

export const addBudget = async (user, budgetInput : budgetInput) => {
    try {
        const newBudget = {
            ...budgetInput,
            user_id: user.id,
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

