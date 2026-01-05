import { useState, useContext, useEffect } from "react";
import styles from './Dashboard.module.css'
import { AuthContext } from "../../supabase/auth/useAuth";
import { DataContext } from '../../supabase/database/useDatabase';

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
                            <>
                                <p
                                    key = {column}
                                    className = {`${styles.transactionCell} ${styles[column]}`}
                                >
                                    {transaction[column]}
                                </p>
                            </>
                        )
                    })
                }
            </div>
        </>
    )
}

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { getTransactions } = useContext(DataContext);
    
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        if (authLoading) return;

        const loadTransactions = async () => {
            const data = await getTransactions(user);
            setTransactions(data);
            console.log(data);
        }

        loadTransactions();
    }, [user, authLoading])

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
        </>
    )
}

export default Dashboard;