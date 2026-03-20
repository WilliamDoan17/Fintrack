import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import PageLoader from '../loaders/PageLoader'
import Sidebar from './Sidebar'
import NavigationArrow from './NavigationArrow'

const ProtectedLayout = () => {
  const { user, loading, error } = useContext(AuthContext)

  if (loading) return <PageLoader />
  if (error || !user) return <Navigate to="/auth" replace />

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="px-8 pt-8">
          <NavigationArrow />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default ProtectedLayout
