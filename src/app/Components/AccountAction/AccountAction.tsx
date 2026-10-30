'use client'

/* ------------------------------------------------------------
Confirms and applies one explicit account action while keeping its dialog state together.
---------------------------------------------------------------*/

import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

import { useAlert } from '@/app/AlertProvider'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

type AccountActionType = 'disconnect' | 'clear-analysis'

// Owns the trigger, confirmation, request and focus restoration for an account action.
const AccountAction = ({ action, isPreview }: { action: AccountActionType; isPreview: boolean }) => {
  const [pendingAction, setPendingAction] = useState<AccountActionType | null>(null)
  const [isPending, setIsPending] = useState(false)

  const router = useRouter()
  const showAlert = useAlert()

  const confirmationReference = useRef<HTMLDivElement>(null)

  // Dismisses the confirmation without changing any saved information.
  const _handleConfirmationClose = useCallback(() => setPendingAction(null), [])
  useFocusTrap(confirmationReference, Boolean(pendingAction), _handleConfirmationClose)

  // Opens an explicit confirmation before removing saved analysis or account access.
  const _handleRequestAction = () => {
    if (isPreview) {
      showAlert('You’re in the design preview', 'Data controls become available after connecting your Fanvue account.')

      return
    }

    setPendingAction(action)
  }

  // Applies the confirmed data action and refreshes the authenticated view.
  const _handleConfirm = () => {
    setIsPending(true)

    fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: pendingAction })
    })
      .then(async response => {
        const body = await response.json()

        if (!response.ok) {
          throw new Error(body.error)
        }

        return body
      })
      .then(() => {
        if (pendingAction === 'disconnect') {
          window.location.assign('/')

          return
        }

        setPendingAction(null)
        showAlert('Saved analysis cleared', 'You can prepare your insights again whenever you’re ready.')
        router.refresh()
      })
      .catch(error => showAlert('Couldn’t complete that action', error.message || 'Please try again.'))
      .finally(() => setIsPending(false))
  }

  return (
    <>
      <button className="button secondary" onClick={_handleRequestAction}>
        {action === 'disconnect' ? 'Disconnect account' : 'Clear analysis'}
      </button>

      {/* Keep confirmation styling independent from the compact settings action row. */}
      {pendingAction &&
        createPortal(
          <div
            className="confirmation"
            role="alertdialog"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
            aria-modal="true">
            <div className="confirmation-card" ref={confirmationReference} tabIndex={-1}>
              <h2 id="confirmation-title">
                {pendingAction === 'disconnect' ? 'Disconnect your account?' : 'Clear your saved analysis?'}
              </h2>

              <p id="confirmation-description">
                {pendingAction === 'disconnect'
                  ? 'Your stored connection, sessions and insights will be removed. You can reconnect at any time.'
                  : 'Your saved insights will be removed. You can run a fresh analysis afterwards.'}
              </p>

              <div>
                <button className="button secondary" onClick={_handleConfirmationClose} disabled={isPending}>
                  Keep it
                </button>

                <button className="button danger" onClick={_handleConfirm} disabled={isPending}>
                  {isPending ? 'One moment…' : 'Yes, continue'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default AccountAction
