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
      // Reject cross-site requests before reading the signed-in account.
      requireSameOrigin(request)

      const account = await getCurrentAccount()

      if (!account) {
        throw new RequestError('Please reconnect to continue.', 401)
      }

      // Read the requested action only after the session has been checked.
      const { action } = await request.json()
      const database = getDatabase()

      // Signing out ends the current session while keeping saved analysis.
      if (action === 'logout') {
        await destroySession()
      }

      // Clearing analysis leaves the connected account and its sessions intact.
      else if (action === 'clear-analysis') {
        unwrapDatabase(await database.from('analysis_jobs').delete().eq('user_id', account.id))
      }

      // Deleting the account cascades to credentials, analysis and every saved session.
      else if (action === 'disconnect') {
        unwrapDatabase(await database.from('app_users').delete().eq('id', account.id))

        await destroySession()
      }

      // Unsupported actions must not reach any account mutation.
      else {
        throw new RequestError('That action is unavailable.', 400)
      }

      return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
    })
    .catch(errorResponse)
