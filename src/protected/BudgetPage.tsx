import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../supabase/database/useDatabase'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './BudgetPage.module.css'
import { AuthContext } from '../../supabase/auth/useAuth'

const BudgetPage = () => {
    const { state } = useLocation();
    const { user } = useContext(AuthContext);
    const [budget, setBudget] = useState(state?.budget || null);
    const { getBudgets, getAllSubBudgets } = useContext(DataContext);
    const [subBudgets, setSubBudgets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setSubBudgets([]);
        if (state?.budget) {
            setBudget(state.budget);
        }
    }, [state]);

    useEffect(() => {
        if (!user || !budget) return;

        const loadSubBudgets = async () => {
            const subBudgets = await getBudgets(user, budget);
            const allSubBudgets = await getAllSubBudgets(user, budget);
            console.log(allSubBudgets);
            setSubBudgets(subBudgets);
        };
        
        loadSubBudgets();
    }, [user]);

    const BudgetCard = ({ budget }) => {
        const handleClick = (e) => {
            navigate(`/budget/${budget.id}`,
                {
                    state: {
                        budget: budget,
                    },
                }
            )
        };

        const { deleteBudget } = useContext(DataContext);

        const handleDelete = async (e) => {
            e.preventDefault();
            const data = await deleteBudget(budget);
            if (data) {
                setSubBudgets(oldSubBudgets => oldSubBudgets.filter(({ id }) => id !== data.id))
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
                    onClick = {handleClick}
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
            const data = await addBudget(user, newBudget, budget);
            if (data) {
                setSubBudgets(oldSubBudgets => [
                    ...oldSubBudgets,
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
                    setSubBudgets(oldSubBudgets => oldSubBudgets.map((budget) => {
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

    const handleAddBudget = (e) => {
        e.preventDefault();
        setDisplayAddBudgetModal(true);
    }

    return (
        <>
            <header
                className = {styles.header}
            >
                <h1>
                    {budget.name}
                </h1>
            </header>  
            <main
                className = {styles.main}
            >
                <div
                    className = {styles.transactionContainer}
                >
                    
                </div>
                <h2>
                    SubBudgets
                </h2>
                <div
                    className = {styles.subbudgetsContainer}
                >
                    <button
                        className = {`${styles.budgetCard} ${styles.addBudgetButton}`}
                        onClick = {handleAddBudget}
                    >
                        +
                    </button>
                    {subBudgets.map( subBudget => {
                        return (
                            <BudgetCard
                                key = {subBudget.id}
                                budget = {subBudget}
                            >
                            </BudgetCard>
                        )
                    })}
                </div>
            </main>
            <AddBudgetModal></AddBudgetModal>
            <UpdateBudgetModal></UpdateBudgetModal>
        </>
    )
}

export default BudgetPage;