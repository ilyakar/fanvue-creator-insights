/* ------------------------------------------------------------
Protects every dashboard route with the creator's server-side session.
---------------------------------------------------------------*/

import { requireAccount } from '@/lib/server/session'
import AppShell from '../Components/AppShell/AppShell'

export const dynamic = 'force-dynamic'

// Protects every dashboard route with the creator's server-side session.
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const account = await requireAccount()

  return (
    <AppShell account={account} isPreview={false}>
      {children}
    </AppShell>
  )
}

export default DashboardLayout
