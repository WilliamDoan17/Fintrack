import { useState, useContext, useEffect } from "react";
import styles from './Dashboard.module.css'
import { AuthContext } from "../../supabase/auth/useAuth";
import { DataContext } from '../../supabase/database/useDatabase';

const AddTransactionModal = ({ displaying, setDisplaying, setTransactions }) => {
    const { user } = useContext(AuthContext);
    const { addTransaction } = useContext(DataContext);

    const [purpose, setPurpose] = useState("");
    const [value, setValue] = useState(0);

    const handleCloseModal = (e) => {
        setDisplaying(false);
    }

    const handleChangeInput = (value, setter) => {
        setter(value);
    }

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!value) {
            console.error('Cannot add transaction with value as 0!')
        } else {
            const newTransactionInput = {
                purpose: purpose,
                value: value,
            }
            const newTransaction = await addTransaction(user, newTransactionInput);

            if (newTransaction) setTransactions(transactions => [
                newTransaction,
                ...transactions
            ]);
        }
    }

    return (
        <>
            <div
                className = {styles.addTransactionModalContainer}
                style = {
                    {
                        display: displaying ? 'flex' : 'none',
                    }
                }
                onClick = {handleCloseModal}
            >
                <div
                    className = {styles.addTransactionModal}
                    onClick = {(e) => e.stopPropagation()}
                >
                    <h2>
                        Add Transaction
                    </h2>
                    <form
                        className = {styles.addTransactionForm}
                        onSubmit = {handleAddTransaction}
                    >
                        <p>
                            <label
                                htmlFor = "transactionPurpose"
                            >
                                Purpose
                            </label>
                            <input
                                type = "text"
                                name = "transactionPurpose"
                                id = "transactionPurpose"
                                value = {purpose}
                                onChange = {(e) => handleChangeInput(e.target.value, setPurpose)}
                            ></input>
                        </p>
                        <p
                            className = {styles.addTransactionValueField}
                        >
                            <label
                                htmlFor =  "transactionValue"
                            >
                                Value
                            </label>
                            <input
                                type = "number"
                                name = "transactionValue"
                                id = "transactionValue"
                                value = {value}
                                onChange = {(e) => handleChangeInput(e.target.value, setValue)}
                            >
                            </input>
                        </p>
                        <p
                            className = {styles.addTransactionFormButtonRow}
                        >
                            <button
                                type = "button"
                                className = {styles.addTransactionCancelButton}
                                onClick = {handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className = {styles.addTransactionSubmitButton}
                                type = "submit"
                            >
                                Add Transaction
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    ) 
}

const TransactionColRow = ({ columns }) => {
    return (
        <div
            className = {styles.transactionRow}
        >
            {columns.map(col => {
                return (
                    <p
                        key = {col}
                        className = {styles.transactionCell}
                    >
                        {col}
                    </p>
                )
            })}
        </div>
    )
}

const TransactionDataRow = ({ transaction, columns }) => {
    return (
        <>
            <div
                className = {styles.transactionRow}
            >
                {
                    columns.map(column => {
                        return (
                            <p
                                key = {column} 
                                className = {`${styles.transactionCell} ${styles.dataCell} ${styles[column]}`}
                            >
                                {transaction[column]}
                            </p>
                        )
                    })

                }
                <div
                    className = {styles.transactionUtilContainer}
                >
                    <button
                        className = {styles.transactionUtilUpdate}
                    >
                        Update
                    </button>
                    <button
                        className = {styles.transactionUtilDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { getTransactions } = useContext(DataContext);
    
    const [transactions, setTransactions] = useState([]);
    const [addingTransaction, setAddingTransaction] = useState(false);
    
    useEffect(() => {
        if (authLoading) return;

        const loadTransactions = async () => {
            const data = await getTransactions(user);
            setTransactions(data);
            console.log(data);
        }

        loadTransactions();
    }, [user, authLoading])

    const handleAddTransaction = (e) => {
        e.preventDefault();
        setAddingTransaction(true);
    }

    const transactionDisplayColumns = ['purpose', 'value']; // when you want to display other columns, just go for this

    return (
        <>
            <header
                className = {styles.header}
            >
                <h1
                    className = {styles.headerH1}
                >
                    Dashboard
                </h1>
            </header>
            <main
                className = {styles.main}
            >
                <h2
                    className = {styles.mainH2}
                >
                    Your Transactions
                </h2>
                <button
                    className = {styles.addTransactionBtn}
                    onClick = {handleAddTransaction}
                >
                    + Add Transaction
                </button>
                <div
                    className = {styles.transactionTable}
                >
                    {
                        transactions.length == 0 
                         ? 
                        <i
                            className = {styles.emptyTable}
                        >
                            There's currently no transaction. Go make one!
                        </i>
                         : 
                         <>
                            <TransactionColRow
                                columns = {transactionDisplayColumns}
                            ></TransactionColRow>
                            {transactions.map(transaction => {
                                return (
                                    <TransactionDataRow
                                        key = {transaction.id}
                                        transaction = {transaction}
                                        columns = {transactionDisplayColumns}
                                    >
                                    </TransactionDataRow>
                                )
                            })}
                         </>
                    }
                </div>
            </main>
            <AddTransactionModal
                displaying = {addingTransaction}
                setDisplaying = {setAddingTransaction}
                setTransactions = {setTransactions}
            >
            </AddTransactionModal> 
        </>
    )
}

export default Dashboard;