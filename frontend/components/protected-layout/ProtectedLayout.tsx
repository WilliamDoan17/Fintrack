import { useContext, useState } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import { useNavigation } from '../../contexts/NavigationContext'
import { useNotification } from '../../contexts/NotificationContext'
import { logout } from '../../backend/services/auth'

const NavigationArrow = () => {
  const navigate = useNavigate()
  const { backTo } = useNavigation()

  if (!backTo) return null

  return (
    <button onClick={() => navigate(backTo, { replace: true })} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  )
}

const UserCard = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { user } = useContext(AuthContext)
  if (isCollapsed) return (
    <div className="flex justify-center p-3">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </span>
    </div>
  )
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      <p className="text-gray-400 text-sm truncate">{user?.email}</p>
    </div>
  )
}

const LogoutButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { notify } = useNotification()
  const navigate = useNavigate()

  const handleLogout = () => {
    setLoading(true)
    logout()
      .then(() => notify('Logged out', 'success'))
      .catch((err) => notify(err.message, 'error'))
      .finally(() => {
        setLoading(false)
        navigate('/')
      })
  }

  if (isCollapsed) return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex justify-center p-3 w-full text-gray-500 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  )

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  )
}

const Sidebar = ({ onCollapse }: { onCollapse?: () => void }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  const handleToggle = () => {
    setIsCollapsed(prev => !prev)
    if (onCollapse) onCollapse()
  }

  return (
    <div className={`flex flex-col justify-between h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>

      <div>
        <div className={`flex items-center border-b border-gray-800 px-4 py-5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <p className="text-white font-bold text-lg">Fintrack</p>}
          <button
            onClick={handleToggle}
            className="text-gray-500 hover:text-white transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isCollapsed
                ? <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                : <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              }
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-2 py-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800/50'} ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          {!isCollapsed && <span className="text-sm">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/income"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800/50'} ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          {!isCollapsed && <span className="text-sm">Income</span>}
        </NavLink>
      </nav>

      <div className="border-t border-gray-800">
        <UserCard isCollapsed={isCollapsed} />
        <LogoutButton isCollapsed={isCollapsed} />
      </div>

    </div>
  )
}

const ProtectedLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

      {/* Sidebar */}
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
