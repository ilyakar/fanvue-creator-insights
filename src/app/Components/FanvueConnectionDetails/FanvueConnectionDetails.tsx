/* ------------------------------------------------------------
Displays connection details or a compact status while the server checks Fanvue.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCircleCheck,
  faSpinner,
  faTriangleExclamation,
  faUser
} from '@fortawesome/free-solid-svg-icons'

import type { Account } from '@/lib/types'

type ConnectionStatus = 'checking' | 'connected' | 'reconnect' | 'preview' | 'unavailable'

const statusLabels: Record<ConnectionStatus, string> = {
  checking: 'Checking…',
  connected: 'Connected',
  reconnect: 'Reconnect needed',
  preview: 'Preview only',
  unavailable: 'Couldn’t check connection'
}

// Keeps only account-specific text pending while the settings controls remain available.
const FanvueConnectionDetails = ({
  account = null,
  status
}: {
  account?: Account | null
  status: ConnectionStatus
}) => {
  let identityDescription = 'Loading account details…'
  let displayName = 'Fanvue account'
  let statusIcon = faCircleCheck

  if (status === 'preview') {
    displayName = 'Sample creator'
    identityDescription = 'No account connected in design preview'
  } else if (account) {
    displayName = account.display_name
    identityDescription = `@${account.username}`
  }

  if (status === 'checking') {
    statusIcon = faSpinner
  } else if (status === 'reconnect' || status === 'unavailable') {
    statusIcon = faTriangleExclamation
  }

  return (
    <>
      <div className="connection-row">
        <div className="connected-identity">
          <span className="account-avatar">
            {account || status === 'preview' ? displayName.slice(0, 1) : <FontAwesomeIcon icon={faUser} />}
          </span>

          <div>
            <strong>{displayName}</strong>
            <span>{identityDescription}</span>
          </div>
        </div>

        <span className={['connection-status', status].join(' ')} role="status">
          <FontAwesomeIcon icon={statusIcon} spin={status === 'checking'} />
          {statusLabels[status]}
        </span>
      </div>

      {status === 'reconnect' && (
        <a className="button primary" href="/api/auth/fanvue">
          Reconnect Fanvue <FontAwesomeIcon icon={faArrowRight} />
        </a>
      )}
    </>
  )
}

export default FanvueConnectionDetails
