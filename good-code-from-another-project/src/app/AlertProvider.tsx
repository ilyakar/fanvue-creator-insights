'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'
import AlertBubble from './Components/AlertBubble'

export type AlertType = 'danger' | 'warning' | 'success'

const AlertContext = createContext<(message: string, type?: AlertType, timeout?: number) => void>(() => {})

// Wraps the app in a context that can display dismissible alert bubbles
const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<AlertType>('danger')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Clears any active timeout that hides the alert
  const clearTimers = () => {
    if (!timerRef.current) {
      return
    }

    clearTimeout(timerRef.current)
    timerRef.current = null
  }

  // Hides the alert bubble
  const hideAlert = useCallback(() => {
    clearTimers()
    setVisible(false)
  }, [])

  // Shows the alert bubble
  // Optional type: default red - danger
  // Optional timeout: default 7s
  const showAlert = useCallback(
    (message: string, alertType: AlertType = 'danger', timeout: number = 7000) => {
      setMessage(message)
      setType(alertType)
      setVisible(true)
      timerRef.current = setTimeout(hideAlert, timeout)
    },
    [hideAlert]
  )

  useEffect(() => () => clearTimers(), [])

  return (
    <AlertContext.Provider value={showAlert}>
      <AlertBubble message={message} type={type} visible={visible} onClose={hideAlert} />
      {children}
    </AlertContext.Provider>
  )
}

// Hook to access the alert context from any component
export const useAlert = () => useContext(AlertContext)
export default AlertProvider
