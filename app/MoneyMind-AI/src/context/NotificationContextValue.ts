import { createContext } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: number
  message: string
  type: NotificationType
}

export interface NotificationContextType {
  notifications: NotificationItem[]
  showNotification: (message: string, type?: NotificationType) => void
  removeNotification: (id: number) => void
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)