import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../supabase/auth/useAuth'
import { DataContext } from '../../supabase/database/useDatabase'
import styles from './BudgetListPage.module.css'
import { useNavigate } from 'react-router-dom'

const BudgetListPage = () => {
    const navigate = useNavigate();

    const BudgetCard = ({ budget }) => {
        const { deleteBudget } = useContext(DataContext);

        const handleDelete = async (e) => {
            e.preventDefault();
            const data = await deleteBudget(budget);
            if (data) {
                setBudgets(oldBudgets => oldBudgets.filter(({ id }) => id !== data.id))
            }
        }

        const handleUpdate = async(e) => {
            e.preventDefault();
            setTargetUpdateBudget(budget);
            setDisplayUpdateBudgetModal(true);
        }

        return (
            <>
                <div
                    className = {styles.budgetCard}
                    onClick = {() => 
                        navigate(`/budget/${budget.id}`, {
                            state: {
                                budget: budget
                            }
                        })}
                >
                    <div
                        className = {styles.budgetCardButtonContainer}
                    >
                        <button
                            onClick = {(e) => {
                                e.stopPropagation();
                                handleUpdate(e);
                            }}
                        >
                            Update
                        </button>
                        <button
                            onClick = {(e) => {
                                e.stopPropagation();
                                handleDelete(e);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                    <h2>
                        {budget.name}
                    </h2>
                </div>
            </>
        )
    }

    const [displayAddBudgetModal, setDisplayAddBudgetModal] = useState(false);

    const AddBudgetButton = () => {
        const handleClick = (e) => {
            e.preventDefault();
            setDisplayAddBudgetModal(true);
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
        const containerStyle = {};

        if (displayAddBudgetModal === false) containerStyle.display = "none";

        const handleCloseModal = (e) => {
            e.preventDefault();
            clearInputs();
            setDisplayAddBudgetModal(false);
        }

        const [name, setName] = useState("");

        const handleChangeInput = (value, setter) => {
            setter(value);
        }

        const clearInputs = () => {
            setName("");
        }

        const { addBudget } = useContext(DataContext);

        const handleAddBudget = async (e) => {
            e.preventDefault();
            if (name === "") {
                console.error("Cannot add new blank budget with no name");
                return;
            }
            const newBudget = {
                name: name,
            }
            const data = await addBudget(user, newBudget);
            if (data) {
                setBudgets(oldBudgets => [
                    ...oldBudgets,
                    data
                ]);
                handleCloseModal(e);
            }
        }
        
        return (
            <>
                <div
                    className = {styles.addBudgetModalContainer}
                    style = {containerStyle}
                    onClick = {handleCloseModal}
                >
                    <div
                        className = {styles.addBudgetModal}
                        onClick = {(e) => e.stopPropagation()}
                    >
                        <form
                            className = {styles.addBudgetForm}
                            onSubmit = {handleAddBudget}
                        >
                            <p
                                className = {styles.addBudgetName}
                            >
                                <label
                                    htmlFor = "budgetName"
                                >
                                    Name of your budget:
                                </label>
                                <input
                                    type = "text"
                                    id = "budgetName"
                                    name = "budgetName"
                                    placeholder = "Your budget name"
                                    onChange = {(e) => handleChangeInput(e.target.value, setName)}
                                >
                                </input>
                            </p>
                            <p
                                className = {styles.addBudgetSubmit}
                            >
                                <button
                                    type = "button"
                                    onClick = {handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type = "submit"
                                >
                                    Add Budget
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </>
        )
    }

    const [displayUpdateBudgetModal, setDisplayUpdateBudgetModal] = useState(false);
    const [targetupdateBudget, setTargetUpdateBudget] = useState(null);

    const UpdateBudgetModal = () => {
        const containerStyle = {};

        if (displayUpdateBudgetModal === false) containerStyle.display = "none";

        const handleCloseModal = (e) => {
            e.preventDefault();
            clearInputs();
            setDisplayUpdateBudgetModal(false);
        }

        const [name, setName] = useState("");

        const handleChangeInput = (value, setter) => {
            setter(value);
        }

        const clearInputs = () => {
            setName("");
            setTargetUpdateBudget(null);
        }

        const { updateBudget } = useContext(DataContext);

        const handleUpdateBudget = async (e) => {
            e.preventDefault();
            if (name === "") {
                console.error('Cannot update to blank name!');
            } else {
                const newBudget = {
                    name: name,
                }
                const data = await updateBudget(targetupdateBudget, newBudget);
                if (data) {
                    setBudgets(oldBudget => oldBudget.map((budget) => {
                        if (budget.id === data.id) {
                            return data;
                        } else {
                            return budget;
                        }
                    }))
                    handleCloseModal(e);
                }
            }
        }
        
        return (
            <>
                <div
                    className = {styles.updateBudgetModalContainer}
                    style = {containerStyle}
                    onClick = {handleCloseModal}
                >
                    <div
                        className = {styles.updateBudgetModal}
                        onClick = {(e) => e.stopPropagation()}
                    >
                        <form
                            className = {styles.updateBudgetForm}
                            onSubmit = {handleUpdateBudget}
                        >
                            <p
                                className = {styles.updateBudgetName}
                            >
                                <label
                                    htmlFor = "budgetName"
                                >
                                    Name of your budget:
                                </label>
                                <input
                                    type = "text"
                                    id = "budgetName"
                                    name = "budgetName"
                                    placeholder = "Your budget name"
                                    onChange = {(e) => handleChangeInput(e.target.value, setName)}
                                >
                                </input>
                            </p>
                            <p
                                className = {styles.updateBudgetSubmit}
                            >
                                <button
                                    type = "button"
                                    onClick = {handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type = "submit"
                                >
                                    Update Budget
                                </button>
                            </p>
                        </form>
                    </div>
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
            <UpdateBudgetModal></UpdateBudgetModal>
        </>
    )
}

export default BudgetListPage;