import { useState, useEffect } from "react"
import { getCurrentUser } from '../../backend/services/auth'
import { supabase } from "../../backend/supabase";
import { User } from '@supabase/supabase-js'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      getCurrentUser()
        .then(user => setUser(user))
        .catch(error => setError(error))
        .finally(() => setLoading(false))
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    error
  }
}

export default useAuth
