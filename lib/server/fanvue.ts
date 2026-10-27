/* ------------------------------------------------------------
Exchanges a code or refresh token using Fanvue's required confidential-client method.
---------------------------------------------------------------*/

import { z } from 'zod'

import { getDatabase, unwrapDatabase } from './database'
import { createSecret, decryptSecret, encryptSecret } from './crypto'
import { requireSetting } from './config'

const tokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.coerce.number().positive(),
  scope: z.string().optional()
})

export const profileSchema = z.object({
  uuid: z.string().uuid(),
  handle: z.string(),
  displayName: z.string(),
  isCreator: z.boolean(),
  avatarUrl: z.string().nullable().optional()
})

export class ReconnectRequired extends Error {}

// Exchanges a code or refresh token using Fanvue's required confidential-client method.
export const exchangeFanvueTokens = async (parameters: URLSearchParams) => {
  const authorization = Buffer.from(
    `${requireSetting('FANVUE_CLIENT_ID')}:${requireSetting('FANVUE_CLIENT_SECRET')}`
  ).toString('base64')

  // Fanvue requires confidential client credentials in the HTTP authorization header.
  const response = await fetch('https://auth.fanvue.com/oauth2/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${authorization}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: parameters,
    cache: 'no-store',
    signal: AbortSignal.timeout(20000)
  })

  if (!response.ok) {
    const failure = await response.json().catch(() => ({}))

    if (failure.error === 'invalid_grant') {
      throw new ReconnectRequired('Please reconnect your Fanvue account.')
    }

    throw new Error('Fanvue could not complete the connection.')
  }

  return tokenSchema.parse(await response.json())
}

// Reads the connected identity without retrieving any creator content.
export const getFanvueProfile = async (accessToken: string) => {
  const response = await fetch('https://api.fanvue.com/v1/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Fanvue-API-Version': process.env.FANVUE_API_VERSION || '2025-06-26'
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(20000)
  })

  if (!response.ok) {
    throw new Error('Your Fanvue profile could not be read.')
  }

  return profileSchema.parse(await response.json())
}

// Saves each rotated token pair together so a stale refresh token is never reused.
export const saveFanvueConnection = async (userId: string, tokens: z.infer<typeof tokenSchema>) => {
  unwrapDatabase(
    await getDatabase()
      .from('fanvue_connections')
      .upsert({
        user_id: userId,
        access_token: encryptSecret(tokens.access_token),
        refresh_token: encryptSecret(tokens.refresh_token),
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scopes: tokens.scope || '',
        needs_reconnect: false,
        refresh_lease: null,
        refresh_lease_until: null
      })
  )
}

// Serialises refreshes across server instances using a database lease.
export const getFanvueAccessToken = async (userId: string): Promise<string> => {
  const database = getDatabase()

  for (let attemptNumber = 0; attemptNumber < 20; attemptNumber += 1) {
    const connection = unwrapDatabase(
      await database.from('fanvue_connections').select('*').eq('user_id', userId).single()
    )

    if (!connection || connection.needs_reconnect) {
      throw new ReconnectRequired('Please reconnect your Fanvue account.')
    }

    const isAccessTokenFresh = new Date(connection.expires_at).getTime() > Date.now() + 60000

    if (isAccessTokenFresh) {
      return decryptSecret(connection.access_token)
    }

    // Only the lease holder may rotate this account's single-use refresh token.
    const lease = createSecret()

    const claimed = unwrapDatabase(
      await database.rpc('claim_fanvue_refresh', { account_identifier: userId, lease_identifier: lease })
    )

    // Another request is refreshing the connection; wait for its stored token pair.
    if (!claimed) {
      await new Promise(resolve => setTimeout(resolve, 500))

      continue
    }

    return exchangeFanvueTokens(
      new URLSearchParams({ grant_type: 'refresh_token', refresh_token: decryptSecret(connection.refresh_token) })
    )
      .then(async tokens => {
        const updated = unwrapDatabase(
          await database
            .from('fanvue_connections')
            .update({
              access_token: encryptSecret(tokens.access_token),
              refresh_token: encryptSecret(tokens.refresh_token),
              expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
              refresh_lease: null,
              refresh_lease_until: null
            })
            .eq('user_id', userId)
            .eq('refresh_lease', lease)
            .select('user_id')
        )

        if (!updated?.length) {
          throw new ReconnectRequired('Please reconnect your Fanvue account.')
        }

        return tokens.access_token
      })
      .catch(async error => {
        // An ambiguous refresh failure cannot safely reuse the previous single-use credential.
        unwrapDatabase(
          await database
            .from('fanvue_connections')
            .update({ needs_reconnect: true, refresh_lease: null, refresh_lease_until: null })
            .eq('user_id', userId)
            .eq('refresh_lease', lease)
        )

        throw error
      })
  }

  throw new Error('Your connection is being refreshed. Please try again.')
}
