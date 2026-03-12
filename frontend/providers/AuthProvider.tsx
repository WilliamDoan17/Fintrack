import AuthContext from '../contexts/AuthContext'
import useAuth from '../hooks/useAuth';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

export default AuthProvider
