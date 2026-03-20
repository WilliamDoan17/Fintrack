import type { Notification } from '../contexts/NotificationContext'

const Toast = ({ notification }: { notification: Notification }) => {
  const isSuccess = notification.type === 'success'

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl transition-all
      ${isSuccess
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}
    >
      {isSuccess
        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
      }
      <p className="text-sm font-medium">{notification.message}</p>
    </div>
  )
}

export default Toast
