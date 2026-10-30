/* ------------------------------------------------------------
Renders settings immediately while streaming the account connection check separately.
---------------------------------------------------------------*/

import { Suspense } from 'react'

import { requireAccount } from '@/lib/server/session'
import { getConnectionStatus } from '@/lib/server/connection-status'
import FanvueConnectionDetails from '@/app/Components/FanvueConnectionDetails/FanvueConnectionDetails'

import SettingsView from './SettingsView'

// Shows static settings and actions before the private connection details are available.
const SettingsPage = () => (
  <SettingsView
    isPreview={false}
    connectionDetails={
      <Suspense fallback={<FanvueConnectionDetails status="checking" />}>
        <SettingsConnection />
      </Suspense>
    }
  />
)

// Validates the account before checking its connection without blocking the rest of settings.
const SettingsConnection = async () => {
  const account = await requireAccount()

  const connectionStatus = await getConnectionStatus(account)

  return <FanvueConnectionDetails account={account} status={connectionStatus} />
}

export default SettingsPage
