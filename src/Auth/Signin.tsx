import { useState, useContext } from 'react'
import styles from './Auth.module.css'
import { AuthContext } from '../../supabase/auth/useAuth'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const { signInWithEmailAndPassword } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        const { data, error } = await signInWithEmailAndPassword(email, password);
        if (error) {
            console.error(error);
        } else {
            navigate('/dashboard');
        }
    }

    const handleChange = (value, setter) => {
        setter(value);
    }

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
                <form
                    className = {styles.authForm}
                    onSubmit = {handleSignin}
                >
                    <p>
                        <label
                            className = {styles.authLabel}
                            htmlFor = "email"
                        >
                            Email
                        </label>
                        <input
                            className = {styles.authInput}
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
                            className = {styles.authLabel}
                            htmlFor = "password"
                        >
                            Password
                        </label>
                        <input
                            className = {styles.authInput}
                            type = "password"
                            name = "password"
                            id = "password"
                            placeholder = "Password"
                            onChange = {(e) => handleChange(e.target.value, setPassword)}
                            value = {password}
                        ></input>
                    </p>
                    <p
                        className = {styles.authSubmit}
                    >
                        <button
                            className = {styles.authButton}
                            type = "submit"
                        >Log In to Your Account</button>
                    </p>
                </form>
            </main>
        </>
    )
}

export default Signin