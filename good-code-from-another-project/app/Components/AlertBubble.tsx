'use client'

import { AlertType } from '../AlertProvider'
import '@styles/components/alertBubble.scss'

interface AlertBubbleProps {
  message: string
  type: AlertType
  visible: boolean
  onClose: () => void
}

// Displays a temporary alert message that fades away when clicked
const AlertBubble = ({ message, type, visible, onClose }: AlertBubbleProps) => {
  return (
    <div className={`alert-bubble ${type} ${visible ? 'visible' : ''}`} onClick={onClose}>
      {message}
    </div>
  )
}

export default AlertBubble
