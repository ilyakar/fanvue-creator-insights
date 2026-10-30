'use client'

/* ------------------------------------------------------------
Shows scoped audience metrics, interactive insight categories and original evidence.
---------------------------------------------------------------*/

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faCommentDots,
  faLayerGroup,
  faShieldHalved,
  faUserGroup,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

import { categoryLabels, formatDate, getDatasetCounts, getInsightCounts } from '@/lib/insights'
import type { AnalysisResult, Category, Dataset, Insight } from '@/lib/types'
import CategoryIcon from '@/app/Components/CategoryIcon/CategoryIcon'
import InsightCard from '@/app/Components/InsightCard/InsightCard'
import InsightDrawer from '@/app/Components/InsightDrawer/InsightDrawer'

// Shows scoped audience metrics, interactive insight categories and original evidence.
const AudienceInsights = ({
  audienceFeedback,
  savedAnalysis,
  scopedPostId,
  isPreview,
  featuredRequest
}: {
  audienceFeedback: Dataset
  savedAnalysis: AnalysisResult
  scopedPostId?: string
  isPreview: boolean
  featuredRequest?: React.ReactNode
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)

  const basePath = isPreview ? '/preview' : '/dashboard'
  const scopedPost = audienceFeedback.posts.find(post => post.id === scopedPostId)
  const scopedComments = audienceFeedback.comments.filter(comment => !scopedPostId || comment.postId === scopedPostId)
  const counts = getDatasetCounts({
    ...audienceFeedback,
    comments: scopedComments,
    posts: scopedPost ? [scopedPost] : audienceFeedback.posts
  })

  const insights = savedAnalysis.insights.filter(
    insight => !scopedPostId || getInsightCounts(insight, audienceFeedback, scopedPostId).comments > 0
  )
  const categories: Category[] = ['love', 'requests', 'improve']

  // Closes the evidence panel while preserving the current filters and scroll position.
  const _handleInsightClose = useCallback(() => setSelectedInsight(null), [])

  // Changes the visible insight categories from the filter control.
  const _handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCategory(event.target.value as Category | 'all')

  return (
    <>
      <div className="metric-strip" aria-label="Analysed sample dataset">
        {[
          { label: 'Comments analysed', value: counts.comments, icon: faCommentDots },
          { label: 'Distinct fans', value: counts.fans, icon: faUserGroup },
          { label: 'Audience themes', value: insights.length, icon: faWandMagicSparkles },
          { label: 'Posts analysed', value: counts.posts, icon: faLayerGroup }
        ].map(metric => (
          <div className="metric" key={metric.label}>
            <span className="metric-label">
              <FontAwesomeIcon icon={metric.icon} />
              {metric.label}
            </span>

            <strong>{metric.value.toLocaleString('en-GB')}</strong>
            <span className="metric-caption">{isPreview ? 'In the sample dataset' : 'From this analysis'}</span>
          </div>
        ))}
      </div>

      {featuredRequest}

      <section className="insights-section" aria-labelledby="audience-themes-title">
        <div className="section-heading">
          <div>
            <h2 id="audience-themes-title">
              {scopedPostId ? 'What this post is telling you' : 'Here’s what’s coming through'}
            </h2>

            <p>Every insight starts with something a fan actually said.</p>
          </div>

          <label className="select-field">
            <span className="sr-only">Filter insight category</span>

            <select value={selectedCategory} onChange={_handleCategoryChange}>
              <option value="all">All insights</option>

              {categories.map(category => (
                <option value={category} key={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>

            <FontAwesomeIcon icon={faChevronDown} />
          </label>
        </div>

        {insights.length === 0 && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faCommentDots} />
            <h3>A little more conversation will help.</h3>
            <p>These comments don’t contain enough recurring feedback to identify useful themes yet.</p>
          </div>
        )}

        <div className={['insight-columns', selectedCategory !== 'all' && 'filtered'].filter(Boolean).join(' ')}>
          {categories
            .filter(category => selectedCategory === 'all' || selectedCategory === category)
            .map(category => {
              const categoryInsights = insights
                .filter(insight => insight.category === category)
                .sort(
                  (firstInsight, secondInsight) =>
                    getInsightCounts(secondInsight, audienceFeedback, scopedPostId).fans -
                    getInsightCounts(firstInsight, audienceFeedback, scopedPostId).fans
                )

              return (
                <section className="insight-column" key={category}>
                  <div className="column-heading">
                    <CategoryIcon category={category} />
                    <h3>{categoryLabels[category]}</h3>
                    <span>{categoryInsights.length}</span>
                  </div>

                  <div className="column-cards">
                    {categoryInsights.map(insight => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        audienceFeedback={audienceFeedback}
                        postId={scopedPostId}
                        onOpen={setSelectedInsight}
                      />
                    ))}

                    {categoryInsights.length === 0 && insights.length > 0 && (
                      <div className="category-empty">No recurring feedback in this category yet.</div>
                    )}
                  </div>
                </section>
              )
            })}
        </div>
      </section>

      <div className="trust-note">
        <FontAwesomeIcon icon={faShieldHalved} />

        <span>
          {isPreview ? 'Illustrative themes for design review. ' : 'AI can miss nuance. '}Explore the original comments
          behind every insight.
        </span>

        <span className="updated-at">
          {isPreview ? 'Sample period' : 'Analysed'} {formatDate(savedAnalysis.analysedAt)}
        </span>
      </div>

      {selectedInsight && (
        <InsightDrawer
          key={selectedInsight.id}
          insight={selectedInsight}
          audienceFeedback={audienceFeedback}
          postId={scopedPostId}
          basePath={basePath}
          onClose={_handleInsightClose}
        />
      )}
    </>
  )
}

export default AudienceInsights
