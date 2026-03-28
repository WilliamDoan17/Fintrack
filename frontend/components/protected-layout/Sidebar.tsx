import AuthContext from '../../contexts/AuthContext'
import { useContext, useState } from 'react'
import { logout } from '../../backend/services/auth'
import { useNotification } from '../../contexts/NotificationContext'

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

  const handleLogout = () => {
    setLoading(true)
    logout()
      .then(() => notify('Logged out', 'success'))
      .catch((err) => notify(err.message, 'error'))
      .finally(() => setLoading(false))
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

      {/* Top — app name + toggle */}
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

      {/* Bottom — user + logout */}
      <div className="border-t border-gray-800">
        <UserCard isCollapsed={isCollapsed} />
        <LogoutButton isCollapsed={isCollapsed} />
      </div>

    </div>
  )
}

export default Sidebar
