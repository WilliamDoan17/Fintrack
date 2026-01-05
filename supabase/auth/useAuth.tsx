import { useState, useEffect, createContext, Provider, Children } from 'react'
import { supabase } from '../supabaseConfig';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session, user } }) => {
            setSession(session);
            setUser(session?.user || null);
            setLoading(false);
        });

        const {data: { subscription }} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user || null);
                setLoading(false);
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [navigate])

    const signUpWithEmailAndPassword = async (email: string, password: string) => {
        return await supabase.auth.signUp({
            email: email,
            password: password,
        })
    }

    const signInWithEmailAndPassword = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
    }

    const signOut = async () => await supabase.auth.signOut();

    const value = {
        user,
        session,
        email,
        loading,
        signUpWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
    }

    return (
        <>
            <AuthContext.Provider
                value = {value}
            >
                {children}
            </AuthContext.Provider>
        </>
    )
}