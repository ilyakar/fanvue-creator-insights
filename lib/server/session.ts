/* ------------------------------------------------------------
Resolves identity solely from an unexpired server-side session.
---------------------------------------------------------------*/

import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDatabase, unwrapDatabase } from './database'
import { createSecret, hashSecret } from './crypto'
import { sessionCookieName } from './config'
import type { Account } from '../types'

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
}

// Resolves identity solely from an unexpired server-side session.
export const getCurrentAccount = async (): Promise<Account | null> => {
  const identifier = (await cookies()).get(sessionCookieName)?.value

  if (!identifier || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  const session = unwrapDatabase(
    await getDatabase()
      .from('app_sessions')
      .select('user_id')
      .eq('token_hash', hashSecret(identifier))
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()
  )

  if (!session) {
    return null
  }

  return unwrapDatabase(await getDatabase().from('app_users').select('*').eq('id', session.user_id).single()) as Account
}

// Guards authenticated routes without exposing user identifiers to request parameters.
export const requireAccount = async () => {
  const account = await getCurrentAccount()

  if (!account) {
    redirect('/connect?reason=session')
  }

  return account
}

// Creates a fresh database session and rotates the browser's previous identifier.
export const createSession = async (userId: string) => {
  const cookieStore = await cookies()
  const previousIdentifier = cookieStore.get(sessionCookieName)?.value

  // Rotate the browser's previous session instead of leaving it active.
  if (previousIdentifier) {
    unwrapDatabase(await getDatabase().from('app_sessions').delete().eq('token_hash', hashSecret(previousIdentifier)))
  }

  // Store a digest in the database; only the browser receives the reusable identifier.
  const identifier = createSecret()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  unwrapDatabase(
    await getDatabase()
      .from('app_sessions')
      .insert({ user_id: userId, token_hash: hashSecret(identifier), expires_at: expiresAt.toISOString() })
  )

  cookieStore.set(sessionCookieName, identifier, { ...cookieOptions, expires: expiresAt })
}

// Invalidates the current session in both the database and the browser.
export const destroySession = async () => {
  const cookieStore = await cookies()
  const identifier = cookieStore.get(sessionCookieName)?.value

  if (identifier) {
    unwrapDatabase(await getDatabase().from('app_sessions').delete().eq('token_hash', hashSecret(identifier)))
  }

  cookieStore.delete(sessionCookieName)
}
