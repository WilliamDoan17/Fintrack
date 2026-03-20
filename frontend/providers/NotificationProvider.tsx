import { NotificationContext, type Notification, type NotificationType } from '../contexts/NotificationContext'
import Toast from '../components/Toast'
import { useState } from 'react'

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = (message: string, type: NotificationType) => {
    const id = crypto.randomUUID()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  return (
    <NotificationContext.Provider value={{ notifications, notify }}>
 <div className="fixed top-4 right-4 flex flex-col gap-2 z-[100]">       {notifications.map(noti => (
          <Toast key={noti.id} notification={noti} />
        ))}
      </div>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
