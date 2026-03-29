import { useContext, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import PageLoader from '../loaders/PageLoader'
import Sidebar from './Sidebar'
import NavigationArrow from './NavigationArrow'

const ProtectedLayout = () => {
  const { user, loading, error } = useContext(AuthContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) return <PageLoader />
  if (error || !user) return <Navigate to="/" replace />

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless menu is open */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onCollapse={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 pt-16 md:pt-8">
          <NavigationArrow />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default ProtectedLayout
