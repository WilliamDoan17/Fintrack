import { useState } from "react";
import styles from './Signup.module.css'

const Signup = () => {
    return (
        <>
            <header
            >
                <h1
                >
                    Sign Up
                </h1>
                
            </header>
            <main>
                <form
                    onSubmit = {(e) => e.preventDefault()}
                >
                    <p>
                        <label
                            htmlFor = "username"
                        >
                            Username
                        </label>
                        <input
                            type = "text"
                            name = "username"
                            id = "username"
                            placeholder = "Your Username"
                        ></input>
                    </p>
                    <p>
                        <label
                            htmlFor = "password"
                        >
                            Password
                        </label>
                        <input
                            type = "password"
                            name = "password"
                            id = "password"
                            placeholder = "Your Password"
                        ></input>
                    </p>
                    <p>
                        <label
                            htmlFor = "confirm-password"
                        >
                            Confirm Your Password
                        </label>
                        <input
                            type = "password"
                            name = "confirm-password"
                            id = "confirm-password"
                            placeholder = "Confirm Your Password"
                        ></input>
                    </p>
                    <p
                        className = {`${styles["submit"]}`}
                    >
                        <button
                            type = "submit"
                        >
                            Create Account
                        </button>
                    </p>
                </form>
            </main>
        </>
    )
}

export default Signup;