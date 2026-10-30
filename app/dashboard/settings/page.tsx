/* ------------------------------------------------------------
Renders settings immediately while streaming the account connection check separately.
---------------------------------------------------------------*/

import { Suspense } from 'react'

import { requireAccount } from '@/lib/server/session'
import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { getFanvueAccessToken } from '@/lib/server/fanvue'
import SettingsContent from '@/app/Components/SettingsContent/SettingsContent'
import SettingsConnectionDetails from '@/app/Components/SettingsContent/SettingsConnectionDetails'

// Shows static settings and actions before the private connection details are available.
const SettingsPage = () => (
  <SettingsContent
    isPreview={false}
    connectionDetails={
      <Suspense fallback={<SettingsConnectionDetails status="checking" />}>
        <SettingsConnection />
      </Suspense>
    }
  />
)

// Validates the account before checking its connection without blocking the rest of settings.
const SettingsConnection = async () => {
  const account = await requireAccount()

  return Promise.resolve()
    .then(async () => {
      await getFanvueAccessToken(account.id).catch(() => undefined)

      const connection = unwrapDatabase(
        await getDatabase().from('fanvue_connections').select('needs_reconnect').eq('user_id', account.id).maybeSingle()
      )

      return (
        <SettingsConnectionDetails
          account={account}
          status={!connection || connection.needs_reconnect ? 'reconnect' : 'connected'}
        />
      )
    })
    .catch(() => <SettingsConnectionDetails account={account} status="unavailable" />)
}

export default SettingsPage
