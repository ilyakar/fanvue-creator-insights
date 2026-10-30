'use client'

/* ------------------------------------------------------------
Keeps connection management and data controls focused on the working MVP.
---------------------------------------------------------------*/

import { useCallback, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faDatabase, faLink, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

import { useAlert } from '@/app/AlertProvider'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

import SettingsConnectionDetails from './SettingsConnectionDetails'

// Keeps connection management and data controls focused on the working MVP.
const SettingsContent = ({ isPreview, connectionDetails }: { isPreview: boolean; connectionDetails?: ReactNode }) => {
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const router = useRouter()
  const showAlert = useAlert()

  const confirmationReference = useRef<HTMLDivElement>(null)

  // Dismisses the confirmation without changing any saved information.
  const _handleConfirmationClose = useCallback(() => setPendingAction(null), [])
  useFocusTrap(confirmationReference, Boolean(pendingAction), _handleConfirmationClose)

  // Opens an explicit confirmation before removing saved analysis or account access.
  const _handleRequestAction = (action: string) => {
    if (isPreview) {
      showAlert('You’re in the design preview', 'Data controls become available after connecting your Fanvue account.')

      return
    }

    setPendingAction(action)
  }

  // Cancels the pending data change without contacting the server.
  const _handleCancel = () => setPendingAction(null)

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
    <div className="settings-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR WORKSPACE, YOUR WAY</span>
          <h1>A few things, taken care of.</h1>
          <p>Your connection, your information, and a little peace of mind.</p>
        </div>
      </div>

      <section className="settings-panel">
        <div className="panel-heading">
          <span className="settings-icon">
            <FontAwesomeIcon icon={faLink} />
          </span>

          <div>
            <h2>Your Fanvue connection</h2>
            <p>One account. No extra passwords.</p>
          </div>
        </div>

        {connectionDetails || <SettingsConnectionDetails status={isPreview ? 'preview' : 'checking'} />}

        <div className="settings-action">
          <p>
            Disconnecting removes this app’s stored account, credentials and analysis. You can also revoke consent in
            your Fanvue settings.
          </p>

          <button className="button secondary" onClick={() => _handleRequestAction('disconnect')}>
            Disconnect account
          </button>
        </div>
      </section>

      <section className="settings-panel">
        <div className="panel-heading">
          <span className="settings-icon">
            <FontAwesomeIcon icon={faDatabase} />
          </span>

          <div>
            <h2>Your data, in your hands</h2>
            <p>Keep what’s useful. Clear what you don’t need.</p>
          </div>
        </div>

        <div className="settings-action">
          <div>
            <h3>Clear saved analysis</h3>
            <p>Remove your saved insights. Your Fanvue account and its content won’t be changed.</p>
          </div>

          <button className="button secondary" onClick={() => _handleRequestAction('clear-analysis')}>
            Clear analysis
          </button>
        </div>
      </section>

      <section className="sample-explainer">
        <span className="sample-pill">
          <span />
          Sample data
        </span>

        <h2>A real connection. A sample audience.</h2>

        <p>
          This prototype uses fictional posts, fans and comments. After you connect, a real AI model analyses that
          sample content. We never present it as feedback from your actual audience.
        </p>

        <Link className="text-button" href="/privacy">
          How we handle your information <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </section>

      <p className="settings-privacy">
        <FontAwesomeIcon icon={faShieldHalved} /> Account credentials stay encrypted on the server.
      </p>

      {pendingAction && (
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
              <button className="button secondary" onClick={_handleCancel} disabled={isPending}>
                Keep it
              </button>

              <button className="button danger" onClick={_handleConfirm} disabled={isPending}>
                {isPending ? 'One moment…' : 'Yes, continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsContent
