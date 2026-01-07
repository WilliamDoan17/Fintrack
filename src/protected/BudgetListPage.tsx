import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../supabase/auth/useAuth'
import { DataContext } from '../../supabase/database/useDatabase'
import styles from './BudgetListPage.module.css'

const BudgetListPage = () => {
    const { user } = useContext(AuthContext);
    const { getBudgets } = useContext(DataContext);
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        if (!user) return;
        const loadBudgets = async () => {
            const data = await getBudgets(user);
            setBudgets(data);
            console.log(data);
        }
        loadBudgets();
    }, [user])

    return (
        <>
            <div>
                <header
                    className = {styles.header}
                >
                    <h1
                        className = {styles.h1}
                    >
                        Your Budgets
                    </h1>
                </header>
                <main
                    className = {styles.main}
                >
                    <div
                        className = {styles.budgetList}
                    >

                    </div>
                </main>
            </div>
        </>
    )
}

export default BudgetListPage;