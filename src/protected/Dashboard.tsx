import { useState, useContext, useEffect } from "react";
import styles from './Dashboard.module.css'
import { AuthContext } from "../../supabase/auth/useAuth";
import { DataContext } from '../../supabase/database/useDatabase';



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

    const transactionDisplayColumns = ['purpose', 'value'];

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
                    
                </div>
            </main> 
        </>
    )
}

export default Dashboard;