/* ------------------------------------------------------------
Resumes an existing run or queues the authenticated creator's first analysis.
---------------------------------------------------------------*/

import { redirect } from 'next/navigation'

import { requireAccount } from '@/lib/server/session'
import { getCurrentAnalysis } from '@/lib/server/analysis'
import Brand from '@/app/Components/Brand/Brand'
import AnalysisLoading from '@/app/Components/AnalysisLoading/AnalysisLoading'

export const dynamic = 'force-dynamic'

// Resumes an existing run or queues the authenticated creator's first analysis.
const AnalysisPage = async () => {
  const account = await requireAccount()
  const job = await getCurrentAnalysis(account.id)

  if (job?.status === 'complete') {
    redirect('/dashboard')
  }

  return (
    <div className="onboarding-page">
      <header>
        <Brand />
      </header>

      <main id="main-content">
        <AnalysisLoading initialStage={job?.status || 'idle'} initialError={job?.error || null} />
      </main>
    </div>
  )
}

export default AnalysisPage
