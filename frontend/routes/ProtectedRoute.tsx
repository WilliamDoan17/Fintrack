import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import PageLoader from '../components/loaders/PageLoader'

const ProtectedRoutes = () => {
  const { user, loading, error } = useContext(AuthContext)
  if (loading) return <PageLoader />
  if (error || !user) return <Navigate to="/" replace />
  return <Outlet />
}

export default ProtectedRoutes
