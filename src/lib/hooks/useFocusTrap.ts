'use client'

/* ------------------------------------------------------------
Contains modal focus, locks background scrolling and restores the previous focus on close.
---------------------------------------------------------------*/

import { useEffect, type RefObject } from 'react'

// Contains modal focus, locks background scrolling and restores the previous focus on close.
export const useFocusTrap = (
  containerReference: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void,
  initialFocus: 'first-control' | 'container' = 'first-control'
) => {
  useEffect(() => {
    if (!isActive) {
      return
    }

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow

    // Freeze the page only while this focus container owns the interaction.
    document.body.style.overflow = 'hidden'

    const container = containerReference.current
    const firstControl = container?.querySelector<HTMLElement>('button:not([disabled]), a[href]')
    const focusTarget = initialFocus === 'container' ? container : firstControl || container

    focusTarget?.focus()

    // Traps Tab navigation and makes Escape consistently dismiss the active modal.
    const _handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()

        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = container?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, [tabindex="0"]'
      )

      if (!focusable?.length) {
        event.preventDefault()

        return
      }

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === container)) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && (document.activeElement === lastElement || document.activeElement === container)) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', _handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', _handleKeyDown)
      previousFocus?.focus()
    }
  }, [containerReference, isActive, onClose, initialFocus])
}
