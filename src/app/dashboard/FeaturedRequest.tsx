'use client'

/* ------------------------------------------------------------
Highlights the strongest audience request and opens its supporting insight details.
---------------------------------------------------------------*/

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import type { Dataset, Insight, PostTheme } from '@/lib/types'
import { getEvidence, getInsightCounts } from '@/lib/insights'
import InsightDrawer from '@/app/Components/InsightDrawer/InsightDrawer'

// Keeps the featured request and its evidence drawer together on the overview.
const FeaturedRequest = ({
  audienceFeedback,
  insights,
  basePath,
  postThemes
}: {
  audienceFeedback: Dataset
  insights: Insight[]
  basePath: string
  postThemes?: PostTheme[]
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

  // Opens the highlighted theme's supporting evidence.
  const _handleFeaturedOpen = () => setIsEvidenceOpen(true)

  // Restores focus to the theme control after dismissing its evidence.
  const _handleClose = useCallback(() => setIsEvidenceOpen(false), [])

  if (!featuredInsight) {
    return null
  }

  return (
    <>
      <section className="featured-insight">
        <div className="featured-copy">
          <span className="eyebrow">MOST REQUESTED BY FANS</span>
          <h2>{featuredInsight.opportunity || featuredInsight.title}</h2>
          <p>{featuredInsight.summary}</p>

          <button className="text-button" onClick={_handleFeaturedOpen}>
            View insight <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        <div className="featured-visual" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />

          <div className="floating-comment">
            <span className="mini-avatar">{featuredFan?.displayName.slice(0, 1)}</span>

            <span className="quote">
              <span>“{featuredComment?.text}”</span>
            </span>
          </div>
        </div>
      </section>

      {isEvidenceOpen && (
        <InsightDrawer
          insight={featuredInsight}
          audienceFeedback={audienceFeedback}
          basePath={basePath}
          postThemes={postThemes}
          onClose={_handleClose}
        />
      )}
    </>
  )
}

export default FeaturedRequest
