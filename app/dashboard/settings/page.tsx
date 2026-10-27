/* ------------------------------------------------------------
Checks connection freshness without fetching any real creator comments.
---------------------------------------------------------------*/

import { requireAccount } from '@/lib/server/session'
import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { getFanvueAccessToken } from '@/lib/server/fanvue'
import SettingsContent from '@/app/Components/SettingsContent/SettingsContent'

// Checks connection freshness without fetching any real creator comments.
const SettingsPage = async () => {
  const account = await requireAccount()
  await getFanvueAccessToken(account.id).catch(() => undefined)

  const connection = unwrapDatabase(
    await getDatabase().from('fanvue_connections').select('needs_reconnect').eq('user_id', account.id).maybeSingle()
  )

  return (
    <SettingsContent account={account} isPreview={false} needsReconnect={!connection || connection.needs_reconnect} />
  )
}

export default SettingsPage
