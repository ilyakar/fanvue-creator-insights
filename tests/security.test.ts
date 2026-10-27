/* ------------------------------------------------------------
Verifies authenticated encryption rejects tampering and randomises repeated secrets.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'
import { createSecret, hashSecret, encryptSecret, decryptSecret } from '../lib/server/crypto'
import { requireSameOrigin } from '../lib/server/http'
import { exchangeFanvueTokens, getFanvueProfile } from '../lib/server/fanvue'

// Verifies authenticated encryption rejects tampering and randomises repeated secrets.
test('credentials are encrypted with unique nonces and reject modifications', () => {
  process.env.TOKEN_ENCRYPTION_KEY = 'ab'.repeat(32)
  const encrypted = encryptSecret('private-refresh-token')
  assert.equal(decryptSecret(encrypted), 'private-refresh-token')
  assert.notEqual(encrypted, encryptSecret('private-refresh-token'))
  const segments = encrypted.split('.')
  segments[1] = Buffer.alloc(16).toString('base64url')
  assert.throws(() => decryptSecret(segments.join('.')))
  assert.ok(!encrypted.includes('private-refresh-token'))
})

// Ensures stored session digests are not reusable browser identifiers.
test('session identifiers are random and stored as digests', () => {
  const identifier = createSecret()
  assert.ok(identifier.length >= 43)
  assert.notEqual(identifier, createSecret())
  assert.notEqual(identifier, hashSecret(identifier))
  assert.equal(hashSecret(identifier).length, 64)
})

// Prevents another site from initiating account mutations with an ambient session cookie.
test('account mutations require the configured origin', () => {
  process.env.APP_URL = 'http://127.0.0.1:3000'
  assert.doesNotThrow(() =>
    requireSameOrigin(
      new Request('http://127.0.0.1:3000/api/account', { headers: { Origin: 'http://127.0.0.1:3000' } })
    )
  )
  assert.throws(
    () =>
      requireSameOrigin(
        new Request('http://127.0.0.1:3000/api/account', { headers: { Origin: 'https://other.example' } })
      ),
    /from the app/
  )
  assert.throws(() => requireSameOrigin(new Request('http://127.0.0.1:3000/api/account')), /from the app/)
})

// Checks the OAuth request against Fanvue's official client_secret_basic contract using a stub.
test('OAuth exchanges use Basic auth, PKCE and validated token lifetimes', async (context) => {
  process.env.FANVUE_CLIENT_ID = 'test-client'
  process.env.FANVUE_CLIENT_SECRET = 'test-secret'
  context.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    assert.equal(url, 'https://auth.fanvue.com/oauth2/token')
    const headers = options.headers as Record<string, string>
    assert.equal(headers.Authorization, `Basic ${Buffer.from('test-client:test-secret').toString('base64')}`)
    assert.equal((options.body as URLSearchParams).get('code_verifier'), 'test-verifier')
    assert.equal((options.body as URLSearchParams).get('client_secret'), null)
    return Response.json({ access_token: 'access', refresh_token: 'refresh', expires_in: '3600' })
  })
  const tokens = await exchangeFanvueTokens(
    new URLSearchParams({ grant_type: 'authorization_code', code: 'test-code', code_verifier: 'test-verifier' })
  )
  assert.equal(tokens.expires_in, 3600)
})

// Protects the callback against accepting the wrong profile envelope or a missing stable identity.
test('profile parsing matches the official unwrapped v1 user response', async (context) => {
  context.mock.method(globalThis, 'fetch', async () =>
    Response.json({
      uuid: '3bbe6394-2830-4646-a8ba-4a0a05426947',
      handle: 'sample_creator',
      displayName: 'Sample Creator',
      isCreator: true,
      avatarUrl: null
    })
  )
  const profile = await getFanvueProfile('test-access')
  assert.equal(profile.handle, 'sample_creator')
  assert.equal(profile.isCreator, true)
})
