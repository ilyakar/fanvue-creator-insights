/* ------------------------------------------------------------
Reads existing analysis progress and offers explicit start or retry controls.
---------------------------------------------------------------*/

import { redirect } from 'next/navigation'

import { getAudienceFeedback } from '@/lib/data/audience'
import { requireAccount } from '@/lib/server/session'
import { getCurrentAnalysis } from '@/lib/server/saved-analysis'
import Brand from '@/app/Components/Brand/Brand'
import AnalysisProgress from '@/app/Components/AnalysisProgress/AnalysisProgress'

export const dynamic = 'force-dynamic'

// Reads existing analysis progress and offers explicit start or retry controls.
const AnalysisPage = async ({ searchParams }: { searchParams: Promise<{ start?: string }> }) => {
  const requestedStart = (await searchParams).start === '1'
  const account = await requireAccount()
  const job = await getCurrentAnalysis(account.id, await getAudienceFeedback(account.audience_creator_id))

  if (job?.status === 'complete') {
    redirect('/dashboard')
  }

  return (
    <div className="onboarding-page">
      <header>
        <Brand />
      </header>

      <main id="main-content">
        <AnalysisProgress
          initialStage={job?.status || 'idle'}
          initialError={job?.error || null}
          shouldStart={requestedStart || job?.status === 'queued'}
        />
      </main>
    </div>
  )
}

export default AnalysisPage
