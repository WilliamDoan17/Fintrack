import { useState, useContext } from "react";
import { AuthContext } from "./useAuth";
import { Routes, Route } from "react-router-dom";
import styles from './Signup.module.css'

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signUpWithEmailAndPassword } = useContext(AuthContext);

    const handleChange = (value, setter) => {
        setter(value);
    }

    const handleSignUp = async (e) => {
        e.preventDefault(); 
        if (password !== confirmPassword) {
            console.log("Error: Confirm Password doesn't match Password");
        } else {
            const { data, error } = await signUpWithEmailAndPassword(email, password);
            if (error) {
                console.error(error);
            } else {
                console.log("Result: ", data);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            }
        }
    }

    return (
        <>
            <header>
                <h1
                    className = {styles.signupH1}
                >
                    Sign Up
                </h1>
            </header>
            <main
                className = {styles.signupMain}
            >
                <form
                    className = {styles.signupForm}
                    onSubmit = {handleSignUp}
                >
                    <p>
                        <label
                            className = {styles.signupLabel}
                            htmlFor = "email"
                        >
                            Email
                        </label>
                        <input
                            className = {styles.signupInput}
                            type = "email"
                            name = "email"
                            id = "email"
                            placeholder = "Your Email"
                            onChange = {(e) => handleChange(e.target.value, setEmail)}
                            value = {email}
                        ></input>
                    </p>
                    <p>
                        <label
                            className = {styles.signupLabel}
                            htmlFor = "password"
                        >
                            Password
                        </label>
                        <input
                            className = {styles.signupInput}
                            type = "password"
                            name = "password"
                            id = "password"
                            placeholder = "Your Password"
                            onChange = {(e) => handleChange(e.target.value, setPassword)}
                            value = {password}
                        ></input>
                    </p>
                    <p>
                        <label
                            className = {styles.signupLabel}
                            htmlFor = "confirm-password"
                        >
                            Confirm Your Password
                        </label>
                        <input
                            className = {styles.signupInput}
                            type = "password"
                            name = "confirm-password"
                            id = "confirm-password"
                            placeholder = "Confirm Your Password"
                            onChange = {(e) => handleChange(e.target.value, setConfirmPassword)}
                            value = {confirmPassword}
                        ></input>
                    </p>
                    <p
                        className = {styles.signupSubmit}
                    >
                        <button
                            className = {styles.signupButton}
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