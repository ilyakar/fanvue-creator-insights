/* ------------------------------------------------------------
Applies an authenticated account action without trusting a supplied user identifier.
---------------------------------------------------------------*/

import { NextResponse } from 'next/server'
import { getCurrentAccount, destroySession } from '@/lib/server/session'
import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { requireSameOrigin, errorResponse, RequestError } from '@/lib/server/http'

// Applies an authenticated account action without trusting a supplied user identifier.
export const POST = async (request: Request) =>
  Promise.resolve()
    .then(async () => {
      requireSameOrigin(request)
      const account = await getCurrentAccount()
      if (!account) throw new RequestError('Please reconnect to continue.', 401)
      const { action } = await request.json()
      const database = getDatabase()
      if (action === 'logout') await destroySession()
      else if (action === 'clear-analysis')
        unwrapDatabase(await database.from('analysis_jobs').delete().eq('user_id', account.id))
      else if (action === 'disconnect') {
        // Remove all stored credentials and sessions. Fanvue consent can also be revoked in Fanvue settings.
        unwrapDatabase(await database.from('app_users').delete().eq('id', account.id))
        await destroySession()
      } else throw new RequestError('That action is unavailable.', 400)
      return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
    })
    .catch(errorResponse)
