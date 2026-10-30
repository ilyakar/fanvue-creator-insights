/* ------------------------------------------------------------
Shows editorial sample insights in the shared overview without creating an account or analysis run.
---------------------------------------------------------------*/

import { Suspense } from 'react'

import { getPreviewAnalysis } from '@/lib/data/preview'
import DashboardView, { AudienceDateRange } from '@/app/dashboard/DashboardView'
import FeaturedRequest from '@/app/dashboard/FeaturedRequest'
import AudienceInsights from '@/app/Components/AudienceInsights/AudienceInsights'
import Skeleton from '@/app/Components/Skeleton/Skeleton'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Shares one sample snapshot between the date range and editorial insights.
const PreviewDashboardPage = () => {
  const previewAnalysisPromise = getPreviewAnalysis()
  const audienceFeedbackPromise = previewAnalysisPromise.then(previewAnalysis => previewAnalysis.audienceFeedback)

  return (
    <DashboardView
      dateRange={
        <Suspense fallback={<Skeleton className="date-placeholder" />}>
          <AudienceDateRange audienceFeedbackPromise={audienceFeedbackPromise} />
        </Suspense>
      }>
      <Suspense fallback={<ContentSkeleton />}>
        <PreviewInsights previewAnalysisPromise={previewAnalysisPromise} />
      </Suspense>
    </DashboardView>
  )
}

// Labels the shared insight UI as editorial preview content.
const PreviewInsights = async ({
  previewAnalysisPromise
}: {
  previewAnalysisPromise: ReturnType<typeof getPreviewAnalysis>
}) => {
  const { audienceFeedback, savedAnalysis } = await previewAnalysisPromise

  return (
    <AudienceInsights
      audienceFeedback={audienceFeedback}
      savedAnalysis={savedAnalysis}
      isPreview
      featuredRequest={
        <FeaturedRequest audienceFeedback={audienceFeedback} insights={savedAnalysis.insights} basePath="/preview" />
      }
    />
  )
}

export default PreviewDashboardPage
