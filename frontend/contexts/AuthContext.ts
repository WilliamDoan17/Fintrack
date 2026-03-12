import { createContext } from 'react';
import type { User } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null,
  loading: boolean,
  error: Error | null,
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
})

export default AuthContext
