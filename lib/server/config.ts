/* ------------------------------------------------------------
Lists only missing variable names so secret values never leave the server.
---------------------------------------------------------------*/

// Lists only missing variable names so secret values never leave the server.
export const getMissingConfiguration = () =>
  [
    'FANVUE_CLIENT_ID',
    'FANVUE_CLIENT_SECRET',
    'TOKEN_ENCRYPTION_KEY',
    'SUPABASE_URL',
    'SUPABASE_SECRET_KEY',
    'OPENAI_API_KEY'
  ].filter(variableName => !process.env[variableName])

// Reads a mandatory server setting without leaking its contents on failure.
export const requireSetting = (variableName: string) => {
  const value = process.env[variableName]

  if (!value) {
    throw new Error(`Missing server configuration: ${variableName}`)
  }

  return value
}

// Uses a single trusted origin for OAuth redirects and mutation checks.
export const getAppOrigin = () => new URL(process.env.APP_URL || 'http://127.0.0.1:3000').origin

export const sessionCookieName = 'fanvue_insights_session'
