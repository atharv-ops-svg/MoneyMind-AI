import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import { NotificationContext } from './NotificationContextValue'
import type {
  NotificationItem,
  NotificationType,
} from './NotificationContextValue'

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const nextId = useRef(0)

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info') => {
      const id = ++nextId.current

      setNotifications(current => [
        ...current,
        { id, message, type },
      ])
    },
    [],
  )

  const removeNotification = useCallback((id: number) => {
    setNotifications(current =>
      current.filter(notification => notification.id !== id),
    )
  }, [])

  useEffect(() => {
    const timers = notifications.map(notification =>
      window.setTimeout(
        () => removeNotification(notification.id),
        4000,
      ),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [notifications, removeNotification])

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}