/* ------------------------------------------------------------
Consumes one matching OAuth attempt before creating an authenticated app session.
---------------------------------------------------------------*/

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'node:crypto'
import { decryptSecret, hashSecret } from '@/lib/server/crypto'
import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { getAppOrigin } from '@/lib/server/config'
import { enqueueAnalysis } from '@/lib/server/analysis'
import { createSession } from '@/lib/server/session'
import { exchangeFanvueTokens, getFanvueProfile, saveFanvueConnection } from '@/lib/server/fanvue'

// Consumes one matching OAuth attempt before creating an authenticated app session.
export const GET = async (request: NextRequest) => {
  const cookieStore = await cookies()
  const expectedState = cookieStore.get('fanvue_oauth_state')?.value
  cookieStore.delete('fanvue_oauth_state')

  return Promise.resolve()
    .then(async () => {
      const state = request.nextUrl.searchParams.get('state')
      const code = request.nextUrl.searchParams.get('code')

      if (
        !state ||
        !expectedState ||
        state.length !== expectedState.length ||
        !timingSafeEqual(Buffer.from(state), Buffer.from(expectedState))
      ) {
        throw new Error('Invalid callback state.')
      }

      // Consume the matching attempt once, before contacting Fanvue.
      const database = getDatabase()

      const attempt = unwrapDatabase(
        await database
          .from('oauth_attempts')
          .delete()
          .eq('state_hash', hashSecret(state))
          .gt('expires_at', new Date().toISOString())
          .select()
          .maybeSingle()
      )

      if (!attempt || !code || request.nextUrl.searchParams.has('error')) {
        throw new Error('Authorization was not completed.')
      }

      // Exchange the original verifier and read the creator's stable identity.
      const tokens = await exchangeFanvueTokens(
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${getAppOrigin()}/api/auth/callback`,
          code_verifier: decryptSecret(attempt.verifier)
        })
      )

      const profile = await getFanvueProfile(tokens.access_token)

      if (!profile.isCreator) {
        throw new Error('A creator account is required.')
      }

      // Reuse the internal account associated with this Fanvue identity.
      const account = unwrapDatabase(
        await database
          .from('app_users')
          .upsert(
            {
              fanvue_id: profile.uuid,
              username: profile.handle || 'creator',
              display_name: profile.displayName || profile.handle || 'Creator',
              avatar_url: profile.avatarUrl || null
            },
            { onConflict: 'fanvue_id' }
          )
          .select()
          .single()
      )

      // Save credentials before creating the session and preparing the first analysis.
      await saveFanvueConnection(account.id, tokens)
      await createSession(account.id)
      await enqueueAnalysis(account.id)

      return NextResponse.redirect(`${getAppOrigin()}/analysis`)
    })
    .catch(() => NextResponse.redirect(`${getAppOrigin()}/connect?reason=connection`))
}
