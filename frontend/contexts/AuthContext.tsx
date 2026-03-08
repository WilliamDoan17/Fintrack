import { createContext } from 'react';
import useAuth from '../hooks/useAuth';
import type { User } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null,
  loading: boolean,
  error: Error | null,
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, error } = useAuth();

  const value = {
    user,
    loading,
    error
  }

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

