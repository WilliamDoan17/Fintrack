import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../supabase/auth/useAuth'
import { DataContext } from '../../supabase/database/useDatabase'
import styles from './BudgetListPage.module.css'

const BudgetListPage = () => {
    const BudgetCard = ({ budget }) => {
        return (
            <>
                <div
                    className = {styles.budgetCard}
                >
                    <h2>
                        {budget.name}
                    </h2>
                </div>
            </>
        )
    }

    const BudgetTable = () => {
        return (
            <div
                className = {styles.budgetTable}
            >
                {budgets.map(budget => {
                    return (
                        <BudgetCard
                            key = {budget.id}
                            budget = {budget}
                        ></BudgetCard>
                    )
                })}
            </div>
        )
    }

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
                    <BudgetTable></BudgetTable>
                </div>
            </main>
        </>
    )
}

export default BudgetListPage;