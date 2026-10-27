/* ------------------------------------------------------------
Starts the real Fanvue authorization flow with server-stored PKCE and state.
---------------------------------------------------------------*/

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHash } from 'node:crypto'
import { createSecret, encryptSecret, hashSecret } from '@/lib/server/crypto'
import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { getMissingConfiguration, getAppOrigin, requireSetting } from '@/lib/server/config'
import { cookieOptions } from '@/lib/server/session'

// Starts the real Fanvue authorization flow with server-stored PKCE and state.
export const GET = async () => {
  if (getMissingConfiguration().length) {
    return NextResponse.redirect(`${getAppOrigin()}/connect?reason=configuration`)
  }

  return Promise.resolve()
    .then(async () => {
      const state = createSecret()
      const verifier = createSecret()
      const database = getDatabase()

      // Expired attempts cannot be reused and do not need to remain in storage.
      unwrapDatabase(await database.from('oauth_attempts').delete().lt('expires_at', new Date().toISOString()))

      unwrapDatabase(
        await database.from('oauth_attempts').insert({
          state_hash: hashSecret(state),
          verifier: encryptSecret(verifier),
          expires_at: new Date(Date.now() + 600000).toISOString()
        })
      )

      // Bind this one-time authorization attempt to the initiating browser.
      const cookieStore = await cookies()

      cookieStore.set('fanvue_oauth_state', state, { ...cookieOptions, maxAge: 600 })
      // Send only the public challenge; the encrypted verifier stays on the server.
      const authorizationUrl = new URL('https://auth.fanvue.com/oauth2/auth')

      authorizationUrl.search = new URLSearchParams({
        client_id: requireSetting('FANVUE_CLIENT_ID'),
        redirect_uri: `${getAppOrigin()}/api/auth/callback`,
        response_type: 'code',
        scope: 'openid offline_access offline read:self',
        state,
        code_challenge: createHash('sha256').update(verifier).digest('base64url'),
        code_challenge_method: 'S256'
      }).toString()

      return NextResponse.redirect(authorizationUrl)
    })
    .catch(() => NextResponse.redirect(`${getAppOrigin()}/connect?reason=connection`))
}
