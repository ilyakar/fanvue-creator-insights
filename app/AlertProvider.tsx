'use client'

/* ------------------------------------------------------------
Presents consistent accessible notices across sample links and account actions.
---------------------------------------------------------------*/

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons'

interface Notice {
  title: string
  description?: string
}

const AlertContext = createContext<(title: string, description?: string) => void>(() => undefined)

// Presents consistent accessible notices across sample links and account actions.
const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [notice, setNotice] = useState<Notice | null>(null)

  const timeoutReference = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Replaces the previous notice and starts one dismissal timer.
  const showNotice = useCallback((title: string, description?: string) => {
    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current)
    }

    setNotice({ title, description })
    timeoutReference.current = setTimeout(() => setNotice(null), 5500)
  }, [])

  // Cleans up the timeout when the app provider unmounts.
  useEffect(
    () => () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current)
      }
    },
    []
  )

  // Allows a user to dismiss the current notice immediately.
  const _handleDismiss = () => setNotice(null)

  return (
    <AlertContext.Provider value={showNotice}>
      {children}

      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {notice && (
          <div className="toast">
            <FontAwesomeIcon icon={faCircleInfo} />

            <div>
              <strong>{notice.title}</strong>
              {notice.description && <p>{notice.description}</p>}
            </div>

            <button className="icon-button" aria-label="Dismiss notification" onClick={_handleDismiss}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}
      </div>
    </AlertContext.Provider>
  )
}

// Exposes the shared notice function to interactive components.
export const useAlert = () => useContext(AlertContext)
export default AlertProvider
