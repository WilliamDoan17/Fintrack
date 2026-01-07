import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../supabase/auth/useAuth'
import { DataContext } from '../../supabase/database/useDatabase'
import styles from './BudgetListPage.module.css'

const BudgetListPage = () => {
    return (
        <>
            <div>
                <header
                    className = {styles.header}
                >
                    
                </header>
            </div>
        </>
    )
}

export default BudgetListPage;