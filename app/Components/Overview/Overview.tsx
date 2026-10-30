/* ------------------------------------------------------------
Keeps the overview heading visible while its date range and insights stream independently.
---------------------------------------------------------------*/

import { Suspense } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import type { DashboardModel } from '@/lib/types'
import { formatDate } from '@/lib/insights'
import DashboardContent from '@/app/Components/DashboardContent/DashboardContent'
import Skeleton from '@/app/Components/Skeleton/Skeleton'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Defines overview copy once for both its ready page and navigation fallback.
const Overview = ({ model }: { model?: Promise<DashboardModel> }) => (
  <div className="dashboard-content">
    <div className="page-heading">
      <div>
        <span className="eyebrow">YOUR AUDIENCE, A LITTLE CLEARER</span>
        <h1>Good things start with listening.</h1>
        <p>The little things they love. The ideas they’re hoping for. All in one place.</p>
      </div>

      <Suspense fallback={<Skeleton className="date-placeholder" />}>
        {model ? <OverviewDateRange model={model} /> : <Skeleton className="date-placeholder" />}
      </Suspense>
    </div>

    <Suspense fallback={<ContentSkeleton />}>
      {model ? <OverviewInsights model={model} /> : <ContentSkeleton />}
    </Suspense>
  </div>
)

// Populates the date range from the same model promise used by the insight section.
const OverviewDateRange = async ({ model }: { model: Promise<DashboardModel> }) => {
  const { dataset } = await model
  const firstPost = dataset.posts[0]
  const lastPost = dataset.posts[dataset.posts.length - 1]

  if (!firstPost || !lastPost) {
    return null
  }

  return (
    <span className="date-range">
      <FontAwesomeIcon icon={faCalendarDays} />
      {formatDate(firstPost.publishedAt)} to {formatDate(lastPost.publishedAt, true)}
    </span>
  )
}

// Replaces the insight placeholders only after the server has prepared the model.
const OverviewInsights = async ({ model }: { model: Promise<DashboardModel> }) => (
  <DashboardContent model={await model} />
)

export default Overview
