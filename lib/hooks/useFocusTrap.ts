'use client'

/* ------------------------------------------------------------
Contains modal focus, locks background scrolling and restores the previous focus on close.
---------------------------------------------------------------*/

import { useEffect, type RefObject } from 'react'

// Contains modal focus, locks background scrolling and restores the previous focus on close.
export const useFocusTrap = (
  containerReference: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isActive) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const container = containerReference.current
    const firstControl = container?.querySelector<HTMLElement>('button:not([disabled]), a[href]')
    ;(firstControl || container)?.focus()

    // Traps Tab navigation and makes Escape consistently dismiss the active modal.
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = container?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, [tabindex="0"]'
      )
      if (!focusable?.length) {
        event.preventDefault()
        return
      }
      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    document.addEventListener('keydown', handleKeyboard)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyboard)
      previousFocus?.focus()
    }
  }, [containerReference, isActive, onClose])
}
