/* ------------------------------------------------------------
Checks the connected Fanvue credentials and reads the existing reconnection flag.
---------------------------------------------------------------*/

import type { Account } from '@/lib/types'

import { getDatabase, unwrapDatabase } from './database'
import { getFanvueAccessToken } from './fanvue'

// Preserves the existing refresh attempt and fallback status without changing connection error handling.
export const getConnectionStatus = (account: Account) =>
  getFanvueAccessToken(account.id)
    .catch(() => undefined)
    .then(async () => {
      const connection = unwrapDatabase(
        await getDatabase().from('fanvue_connections').select('needs_reconnect').eq('user_id', account.id).maybeSingle()
      )

      return !connection || connection.needs_reconnect ? ('reconnect' as const) : ('connected' as const)
    })
    .catch(() => 'unavailable' as const)
