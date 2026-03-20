import { createContext, useContext } from 'react'

export type NotificationType = 'error' | 'success'

export interface Notification {
  id: string,
  message: string,
  type: NotificationType 
}

interface NotificationContextType {
  notifications: Notification[]
  notify: (message: string, type: NotificationType) => void
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notify: () => {}
})

export const useNotification = () => useContext(NotificationContext)
