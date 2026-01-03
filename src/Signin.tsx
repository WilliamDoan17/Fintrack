import { useState, useContext } from 'react'
import styles from './Auth.module.css'
import { AuthContext } from './useAuth'

const Signin = () => {
    return (
        <>
            <header>
                <h1
                    className = {styles.authH1}
                >
                    Sign In
                </h1>
            </header>
            <main
                className = {styles.authMain}
            >

            </main>
        </>
    )
}

export default Signin