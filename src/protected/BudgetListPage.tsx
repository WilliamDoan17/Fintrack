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

    const [displayAddBudgetModal, setDisplayBudgetModal] = useState(false);

    const AddBudgetButton = () => {
        const handleClick = (e) => {
            e.preventDefault();
            setDisplayBudgetModal(true);
        }

        return (
            <>
                <button
                    className = {styles.addBudgetButton}
                    onClick = {handleClick}
                >
                    <h2>+</h2>
                </button>
            </>
        )
    }

    const AddBudgetModal = () => {
        const containerStyle = {
        };

        if (displayAddBudgetModal === false) containerStyle.display = "none";

        const handleCloseModal = (e) => {
            e.preventDefault();
            setDisplayBudgetModal(false);
        }

        return (
            <>
                <div
                    className = {styles.addBudgetModalContainer}
                    style = {containerStyle}
                    onClick = {handleCloseModal}
                >
                    
                </div>
            </>
        )
    }

    const BudgetTable = () => {
        return (
            <div
                className = {styles.budgetTable}
            >
                <AddBudgetButton></AddBudgetButton>
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
            <AddBudgetModal></AddBudgetModal>
        </>
    )
}

export default BudgetListPage;