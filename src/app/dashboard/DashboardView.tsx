/* ------------------------------------------------------------
Shares overview copy between the streamed route, navigation fallback and design preview.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { formatDate } from '@/lib/insights'
import type { Dataset } from '@/lib/types'

// Defines overview copy once for both its ready page and navigation fallback.
const DashboardView = ({ dateRange, children }: { dateRange: React.ReactNode; children: React.ReactNode }) => (
  <div className="dashboard-content">
    <div className="page-heading">
      <div>
        <span className="eyebrow">YOUR AUDIENCE, A LITTLE CLEARER</span>
        <h1>Good things start with listening.</h1>
        <p>The little things they love. The ideas they’re hoping for. All in one place.</p>
      </div>

      {dateRange}
    </div>

    {children}
  </div>
)

// Shows the period covered by the same feedback used for the insights.
export const AudienceDateRange = async ({ audienceFeedbackPromise }: { audienceFeedbackPromise: Promise<Dataset> }) => {
  const audienceFeedback = await audienceFeedbackPromise
  const firstPost = audienceFeedback.posts[0]
  const lastPost = audienceFeedback.posts[audienceFeedback.posts.length - 1]

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

export default DashboardView
