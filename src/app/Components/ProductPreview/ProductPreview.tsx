/* ------------------------------------------------------------
Shows an explicitly illustrative product snapshot using the same sample evidence as the app.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faChartSimple,
  faCommentDots,
  faGear,
  faLayerGroup,
  faUserGroup,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

import { categoryLabels, getDatasetCounts, getEvidence, getInsightCounts } from '@/lib/insights'
import type { Dataset, Insight } from '@/lib/types'
import { categoryIcons } from '@/app/Components/CategoryIcon/CategoryIcon'
import Brand from '@/app/Components/Brand/Brand'

// Shows an explicitly illustrative product snapshot using the same sample evidence as the app.
const ProductPreview = ({ audienceFeedback, insights }: { audienceFeedback: Dataset; insights: Insight[] }) => {
  const counts = getDatasetCounts(audienceFeedback)
  const previewInsights = (['love', 'requests', 'improve'] as const)
    .map(category => insights.find(insight => insight.category === category))
    .filter((insight): insight is Insight => Boolean(insight))
  const featuredInsight = insights
    .filter(insight => insight.category === 'requests')
    .sort(
      (firstInsight, secondInsight) =>
        getInsightCounts(secondInsight, audienceFeedback).fans - getInsightCounts(firstInsight, audienceFeedback).fans
    )[0]
  const featuredComment = featuredInsight ? getEvidence(featuredInsight, audienceFeedback)[0] : null
  const featuredFan = audienceFeedback.fans.find(fan => fan.id === featuredComment?.fanId)

  return (
    <div className="product-preview" aria-label="Illustrative dashboard preview with sample data">
      <aside className="preview-sidebar">
        <div className="preview-logo">
          <Brand isStatic />
        </div>

        <span className="preview-workspace">
          S <span>Sample creator</span>
        </span>

        <span className="mini-nav active">
          <FontAwesomeIcon icon={faChartSimple} />
          Overview
        </span>

        <span className="mini-nav">
          <FontAwesomeIcon icon={faLayerGroup} />
          Posts
        </span>

        <span className="mini-nav">
          <FontAwesomeIcon icon={faCommentDots} />
          Messages
        </span>

        <span className="mini-nav">
          <FontAwesomeIcon icon={faGear} />
          Settings
        </span>
      </aside>

      <div className="preview-main">
        <div className="preview-topbar">
          <span>
            Your workspace <span>/</span> Overview
          </span>

          <span className="sample-pill">
            <span />
            Sample data
          </span>
        </div>

        <div className="preview-body">
          <h3>Audience overview</h3>
          <p>See what fans love, request and want improved across your posts.</p>

          <div className="preview-metrics">
            {[
              { value: counts.comments, label: 'Comments analysed', icon: faCommentDots },
              { value: counts.fans, label: 'Distinct fans', icon: faUserGroup },
              { value: insights.length, label: 'Audience themes', icon: faWandMagicSparkles },
              { value: counts.posts, label: 'Posts analysed', icon: faLayerGroup }
            ].map(metric => (
              <div key={metric.label}>
                <span>
                  <FontAwesomeIcon icon={metric.icon} />
                  {metric.label}
                </span>

                <strong>{metric.value}</strong>
                <small>In the sample dataset</small>
              </div>
            ))}
          </div>

          {featuredInsight && (
            <div className="preview-highlight">
              <div className="copy">
                <span className="eyebrow">MOST REQUESTED BY FANS</span>
                <h4>{featuredInsight.opportunity || featuredInsight.title}</h4>
                <p>{featuredInsight.summary}</p>

                <span className="view-insight">
                  View insight <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </div>

              {featuredComment && (
                <div className="visual">
                  <span className="orbit" aria-hidden="true" />
                  <span className="orbit outer" aria-hidden="true" />

                  <div className="comment">
                    <span className="avatar" aria-hidden="true">
                      {featuredFan?.displayName.slice(0, 1)}
                    </span>

                    <p>“{featuredComment.text}”</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="preview-theme-heading">
            Audience insights <span>Illustrative insights</span>
          </div>

          <div className="preview-insights">
            {previewInsights.map(insight => (
              <div className={`preview-column ${insight.category}`} key={insight.id}>
                <span className="mini-category">
                  <FontAwesomeIcon icon={categoryIcons[insight.category]} />
                  {categoryLabels[insight.category]}
                </span>

                <div className="preview-card">
                  <h4>{insight.title}</h4>
                  <p>{insight.summary}</p>

                  <span>
                    <strong>{getInsightCounts(insight, audienceFeedback).fans}</strong> fans{' '}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPreview
