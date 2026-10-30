/* ------------------------------------------------------------
Streams the audience date range and saved insights beneath the shared overview heading.
---------------------------------------------------------------*/

import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { requireAccount } from '@/lib/server/session'
import { getAudienceFeedback } from '@/lib/data/audience'
import { getCurrentAnalysis } from '@/lib/server/saved-analysis'
import type { Account, Dataset } from '@/lib/types'
import AudienceInsights from '@/app/Components/AudienceInsights/AudienceInsights'
import Skeleton from '@/app/Components/Skeleton/Skeleton'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

import DashboardView, { AudienceDateRange } from './DashboardView'
import FeaturedRequest from './FeaturedRequest'

// Starts one feedback read while the heading remains visible.
const DashboardPage = () => {
  const accountPromise = requireAccount()
  const audienceFeedbackPromise = accountPromise.then(account => getAudienceFeedback(account.audience_creator_id))

  return (
    <DashboardView
      dateRange={
        <Suspense fallback={<Skeleton className="date-placeholder" />}>
          <AudienceDateRange audienceFeedbackPromise={audienceFeedbackPromise} />
        </Suspense>
      }>
      <Suspense fallback={<ContentSkeleton />}>
        <DashboardInsights accountPromise={accountPromise} audienceFeedbackPromise={audienceFeedbackPromise} />
      </Suspense>
    </DashboardView>
  )
}

// Requires saved analysis without creating a run as a side effect of opening the dashboard.
const DashboardInsights = async ({
  accountPromise,
  audienceFeedbackPromise
}: {
  accountPromise: Promise<Account>
  audienceFeedbackPromise: Promise<Dataset>
}) => {
  const [account, audienceFeedback] = await Promise.all([accountPromise, audienceFeedbackPromise])
  const analysisJob = await getCurrentAnalysis(account.id, audienceFeedback)
  const savedAnalysis = analysisJob?.status === 'complete' ? analysisJob.result : null

  if (!savedAnalysis) {
    redirect('/analysis')
  }

  return (
    <AudienceInsights
      audienceFeedback={audienceFeedback}
      savedAnalysis={savedAnalysis}
      isPreview={false}
      featuredRequest={<FeaturedRequest audienceFeedback={audienceFeedback} insights={savedAnalysis.insights} />}
    />
  )
}

export default DashboardPage
