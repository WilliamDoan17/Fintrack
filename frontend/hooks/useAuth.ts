import { useState, useEffect } from "react"
import { getCurrentUser } from '../backend/services/auth'
import { supabase } from "../backend/supabase";
import type { User } from '@supabase/supabase-js'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
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
