    import { useState, useEffect, createContext, Provider, Children } from 'react'
    import { supabase } from '../supabaseConfig';

    export const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
        const [loading, setLoading] = useState(false);
        const [email, setEmail] = useState("");

        const [session, setSession] = useState(null);

        useEffect(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
                console.log('Initial session:', session);
                setSession(session);
            });

            const {data: { subscription }} = supabase.auth.onAuthStateChange(
                (event, session) => {
                    console.log(event, session);
                    if (event === 'SIGNED_OUT') {
                        setSession(null)
                    } else if (session) {
                        setSession(session)
                }
            })
            return () => {
                subscription.unsubscribe()
            }
        }, [])

        useEffect(() => {
            console.log('Session updated:', session);
            if (session?.user) {
                console.log('User:', session.user);
                console.log('User ID:', session.user.id);
                console.log('User email:', session.user.email);
            }
        }, [session]);

        const signUpWithEmailAndPassword = async (email : string, password : string) => {
            return await supabase.auth.signUp({
                email: email,
                password: password,
            })
        }

        const value = {
            session,
            email,
            signUpWithEmailAndPassword
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