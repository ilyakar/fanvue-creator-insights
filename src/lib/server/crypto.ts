/* ------------------------------------------------------------
Generates opaque identifiers that cannot be guessed from user information.
---------------------------------------------------------------*/

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

import { requireSetting } from './config'

// Generates opaque identifiers that cannot be guessed from user information.
export const createSecret = () => randomBytes(32).toString('base64url')

// Stores a digest instead of a reusable browser session identifier.
export const hashSecret = (value: string) => createHash('sha256').update(value).digest('hex')

// Requires a separate encryption key rather than reusing a database credential.
const getEncryptionKey = () => {
  const secret = requireSetting('TOKEN_ENCRYPTION_KEY')

  if (!/^[a-f0-9]{64}$/i.test(secret)) {
    throw new Error('TOKEN_ENCRYPTION_KEY must contain 64 hexadecimal characters.')
  }

  return Buffer.from(secret, 'hex')
}

// Encrypts credentials with authenticated encryption and a fresh nonce per value.
export const encryptSecret = (value: string) => {
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), nonce)
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])

  return [nonce, cipher.getAuthTag(), ciphertext].map(part => part.toString('base64url')).join('.')
}

// Rejects modified ciphertext before returning a stored credential.
export const decryptSecret = (value: string) => {
  const [nonce, authenticationTag, ciphertext] = value.split('.').map(part => Buffer.from(part, 'base64url'))

  if (!nonce || !authenticationTag || !ciphertext) {
    throw new Error('Invalid encrypted credential.')
  }

  // Authentication must succeed before a stored credential can be returned.
  const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), nonce)
  decipher.setAuthTag(authenticationTag)

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}
