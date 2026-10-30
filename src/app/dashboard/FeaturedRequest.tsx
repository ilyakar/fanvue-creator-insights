'use client'

/* ------------------------------------------------------------
Highlights the strongest audience request and opens its original evidence.
---------------------------------------------------------------*/

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faAsterisk, faStar, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

import type { Dataset, Insight } from '@/lib/types'
import { getEvidence, getInsightCounts } from '@/lib/insights'
import InsightDrawer from '@/app/Components/InsightDrawer/InsightDrawer'

// Keeps the featured request and its evidence interaction together on the overview.
const FeaturedRequest = ({
  audienceFeedback,
  insights,
  basePath
}: {
  audienceFeedback: Dataset
  insights: Insight[]
  basePath: string
}) => {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false)

  const featuredInsight = insights
    .filter(insight => insight.category === 'requests')
    .sort(
      (firstInsight, secondInsight) =>
        getInsightCounts(secondInsight, audienceFeedback).fans - getInsightCounts(firstInsight, audienceFeedback).fans
    )[0]
  const featuredComment = featuredInsight ? getEvidence(featuredInsight, audienceFeedback)[0] : null
  const featuredFan = audienceFeedback.fans.find(fan => fan.id === featuredComment?.fanId)

  // Opens the highlighted request's evidence.
  const _handleFeaturedOpen = () => setIsEvidenceOpen(true)

  // Restores focus to the request after dismissing its evidence.
  const _handleClose = useCallback(() => setIsEvidenceOpen(false), [])

  return (
    <>
      {featuredInsight && (
        <section className="featured-insight">
          <div className="featured-copy">
            <span className="eyebrow">
              <FontAwesomeIcon icon={faWandMagicSparkles} /> A GOOD PLACE TO START
            </span>

            <h2>Your next idea? It’s in the comments.</h2>
            <p>{featuredInsight.opportunity || featuredInsight.summary}</p>

            <button className="text-button" onClick={_handleFeaturedOpen}>
              See what fans are asking for <FontAwesomeIcon icon={faArrowRight} />
            </button>
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
      )}

      {isEvidenceOpen && featuredInsight && (
        <InsightDrawer
          insight={featuredInsight}
          audienceFeedback={audienceFeedback}
          basePath={basePath}
          onClose={_handleClose}
        />
      )}
    </>
  )
}

export default FeaturedRequest
