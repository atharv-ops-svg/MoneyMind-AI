import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'

import { useNotification } from '../../context/useNotification'
import type { NotificationType } from '../../context/NotificationContextValue'

const notificationIcons: Record<NotificationType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div
      className="notification-container"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {notifications.map(notification => {
        const Icon = notificationIcons[notification.type]

        return (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
            role={notification.type === 'error' ? 'alert' : 'status'}
          >
            <Icon size={20} />

            <span>{notification.message}</span>

            <button
              type="button"
              onClick={() => removeNotification(notification.id)}
              aria-label="Dismiss notification"
              className="notification-close"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationContainer