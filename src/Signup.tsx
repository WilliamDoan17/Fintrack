import { useState, useContext } from "react";
import styles from './Signup.module.css'
import { AuthContext } from "./useAuth";


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
            <header
            >
                <h1
                >
                    Sign Up
                </h1>
                
            </header>
            <main>
                <form
                    onSubmit = {handleSignUp}
                >
                    <p>
                        <label
                            htmlFor = "email"
                        >
                            Email
                        </label>
                        <input
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
                            htmlFor = "password"
                        >
                            Password
                        </label>
                        <input
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
                            htmlFor = "confirm-password"
                        >
                            Confirm Your Password
                        </label>
                        <input
                            type = "password"
                            name = "confirm-password"
                            id = "confirm-password"
                            placeholder = "Confirm Your Password"
                            onChange = {(e) => handleChange(e.target.value, setConfirmPassword)}
                            value = {confirmPassword}
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