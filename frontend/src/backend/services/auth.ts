import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export const signupWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
