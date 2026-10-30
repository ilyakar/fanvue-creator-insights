'use client'

/* ------------------------------------------------------------
Presents a readable theme with counts calculated from its original evidence.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faComment, faUserGroup } from '@fortawesome/free-solid-svg-icons'

import { getInsightCounts } from '@/lib/insights'
import type { Dataset, Insight } from '@/lib/types'

// Presents a readable theme with counts calculated from its original evidence.
const InsightCard = ({
  insight,
  audienceFeedback,
  postId,
  onOpen
}: {
  insight: Insight
  audienceFeedback: Dataset
  postId?: string
  onOpen: (insight: Insight) => void
}) => {
  const counts = getInsightCounts(insight, audienceFeedback, postId)
  const summary = postId ? insight.postSummaries.find(entry => entry.postId === postId)?.summary : insight.summary

  // Opens the selected theme's original supporting comments.
  const _handleOpen = () => onOpen(insight)

  return (
    <button
      className={`insight-card ${insight.category}`}
      onClick={_handleOpen}
      aria-label={`${insight.title}, ${counts.fans} fans, view insight`}>
      <div className="card-heading">
        <h3>{insight.title}</h3>
        <FontAwesomeIcon icon={faArrowRight} />
      </div>

      <p>{summary}</p>

      <div className="evidence-counts">
        <span>
          <FontAwesomeIcon icon={faUserGroup} />
          <strong>{counts.fans}</strong> fans
        </span>

        <span>
          <FontAwesomeIcon icon={faComment} />
          {counts.comments} comments
        </span>
      </div>
    </button>
  )
}

export default InsightCard
