/* ------------------------------------------------------------
Creates a server-only database client without any browser authentication state.
---------------------------------------------------------------*/

import { createClient } from '@supabase/supabase-js'
import { requireSetting } from './config'

// Creates a server-only database client without any browser authentication state.
export const getDatabase = () =>
  createClient(requireSetting('SUPABASE_URL'), requireSetting('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false }
  })

// Fails closed when a database operation reports an error.
export const unwrapDatabase = <Result>(response: { data: Result; error: { message: string } | null }): Result => {
  if (response.error) throw new Error('The saved information could not be accessed. Please try again.')
  return response.data
}
