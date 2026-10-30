/* ------------------------------------------------------------
Highlights the strongest audience request and links to the audience insights section.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faAsterisk, faStar } from '@fortawesome/free-solid-svg-icons'

import type { Dataset, Insight } from '@/lib/types'
import { getEvidence, getInsightCounts } from '@/lib/insights'

// Keeps the featured request and its audience insights link together on the overview.
const FeaturedRequest = ({ audienceFeedback, insights }: { audienceFeedback: Dataset; insights: Insight[] }) => {
  const featuredInsight = insights
    .filter(insight => insight.category === 'requests')
    .sort(
      (firstInsight, secondInsight) =>
        getInsightCounts(secondInsight, audienceFeedback).fans - getInsightCounts(firstInsight, audienceFeedback).fans
    )[0]
  const featuredComment = featuredInsight ? getEvidence(featuredInsight, audienceFeedback)[0] : null
  const featuredFan = audienceFeedback.fans.find(fan => fan.id === featuredComment?.fanId)

  return (
    featuredInsight && (
      <section className="featured-insight">
        <div className="featured-copy">
          <h2>Most requested by fans</h2>
          <p>{featuredInsight.opportunity || featuredInsight.summary}</p>

          <a className="text-button" href="#audience-themes-title">
            See what fans are asking for <FontAwesomeIcon icon={faArrowDown} />
          </a>
        </div>

        <div className="featured-visual" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />

          <div className="floating-comment">
            <span className="mini-avatar">{featuredFan?.displayName.slice(0, 1)}</span>

            <span className="quote">
              <span>“{featuredComment?.text}”</span>
              <small>From the original comments.</small>
            </span>

            <span className="spark">
              <FontAwesomeIcon icon={faStar} />
            </span>
          </div>

          <span className="decorative-star">
            <FontAwesomeIcon icon={faAsterisk} />
          </span>
        </div>
      </section>
    )
  )
}

export default FeaturedRequest
