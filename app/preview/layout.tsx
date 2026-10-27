/* ------------------------------------------------------------
Makes editorial design fixtures available only to the local development server.
---------------------------------------------------------------*/

import { notFound } from 'next/navigation'

import AppShell from '@/app/Components/AppShell/AppShell'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

// Makes editorial design fixtures available only to the local development server.
const PreviewLayout = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  return (
    <AppShell account={null} isPreview>
      {children}
    </AppShell>
  )
}

export default PreviewLayout
