import { useState, useEffect } from "react"
import { supabase } from "../backend/supabase";
import type { User } from '@supabase/supabase-js'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { data: { subscription }, error: _error } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      setError(_error)
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
