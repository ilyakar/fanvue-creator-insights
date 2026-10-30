/* ------------------------------------------------------------
Shows an explicitly illustrative product snapshot using the same sample evidence as the app.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faAsterisk,
  faChartSimple,
  faCommentDots,
  faGear,
  faLayerGroup,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

import { categoryLabels, getDatasetCounts, getInsightCounts } from '@/lib/insights'
import type { Dataset, Insight } from '@/lib/types'
import { categoryIcons } from '@/app/Components/CategoryIcon/CategoryIcon'
import Brand from '@/app/Components/Brand/Brand'

// Shows an explicitly illustrative product snapshot using the same sample evidence as the app.
const ProductPreview = ({ audienceFeedback, insights }: { audienceFeedback: Dataset; insights: Insight[] }) => {
  const counts = getDatasetCounts(audienceFeedback)
  const previewInsights = [insights[0], insights[1], insights[2]]

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

        <div className="preview-sidebar-note">
          <FontAwesomeIcon icon={faWandMagicSparkles} />

          <span>
            A little clarity.
            <br />A lot of possibility.
          </span>
        </div>
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
          <span className="eyebrow">YOUR AUDIENCE, A LITTLE CLEARER</span>
          <h3>Good things start with listening.</h3>
          <p>The little things they love. The ideas they’re hoping for.</p>

          <div className="preview-metrics">
            {[
              { value: counts.comments, label: 'Comments analysed' },
              { value: counts.fans, label: 'Distinct fans' },
              { value: insights.length, label: 'Audience themes' }
            ].map(metric => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="preview-highlight">
            <FontAwesomeIcon icon={faWandMagicSparkles} />

            <div>
              <strong>Your next idea? It’s in the comments.</strong>
              <p>A little more connection could go a long way.</p>
            </div>

            <span aria-hidden="true">
              <FontAwesomeIcon icon={faAsterisk} />
            </span>
          </div>

          <div className="preview-theme-heading">
            Here’s what’s coming through <span>Illustrative insights</span>
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
