'use client'

/* ------------------------------------------------------------
Reuses one insight presentation for the cross-post overview and single-post feedback.
---------------------------------------------------------------*/

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faArrowUpRightFromSquare,
  faCalendarDays,
  faCommentDots,
  faLayerGroup,
  faShieldHalved,
  faUserGroup,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'
import { categoryLabels, formatDate, getDatasetCounts, getEvidence, getInsightCounts } from '@/lib/insights'
import type { Category, DashboardModel, Insight } from '@/lib/types'
import { useAlert } from '@/app/AlertProvider'
import CategoryIcon from '../CategoryIcon/CategoryIcon'
import InsightCard from '../InsightCard/InsightCard'
import InsightDrawer from '../InsightDrawer/InsightDrawer'

// Reuses one insight presentation for the cross-post overview and single-post feedback.
const DashboardContent = ({ model, postId }: { model: DashboardModel; postId?: string }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const showAlert = useAlert()

  const { dataset, result, isPreview } = model
  const basePath = isPreview ? '/preview' : '/dashboard'
  const post = dataset.posts.find((entry) => entry.id === postId)
  const scopedComments = dataset.comments.filter((comment) => !postId || comment.postId === postId)
  const counts = getDatasetCounts({ ...dataset, comments: scopedComments, posts: post ? [post] : dataset.posts })

  const insights = (result?.insights || []).filter(
    (insight) => !postId || getInsightCounts(insight, dataset, postId).comments > 0
  )

  const categories: Category[] = ['love', 'requests', 'improve']

  const featuredInsight = insights
    .filter((insight) => insight.category === 'requests')
    .sort(
      (firstInsight, secondInsight) =>
        getInsightCounts(secondInsight, dataset, postId).fans - getInsightCounts(firstInsight, dataset, postId).fans
    )[0]

  const featuredComment = featuredInsight ? getEvidence(featuredInsight, dataset, postId)[0] : null
  const featuredFan = dataset.fans.find((fan) => fan.id === featuredComment?.fanId)

  // Closes the evidence panel while preserving the current filters and scroll position.
  const _handleInsightClose = useCallback(() => setSelectedInsight(null), [])

  // Changes the visible insight categories from the filter control.
  const _handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCategory(event.target.value as Category | 'all')

  // Opens the most-supported content request as an actionable starting point.
  const _handleFeaturedOpen = () => {
    if (featuredInsight) {
      setSelectedInsight(featuredInsight)
    }
  }

  // Replaces unavailable synthetic source URLs with a consistent explanation.
  const _handleSampleLink = () =>
    showAlert('You’re viewing sample data', 'Links to Fanvue aren’t available in this prototype.')

  return (
    <div className="dashboard-content">
      {post && (
        <Link className="back-link" href={`${basePath}/posts`}>
          <FontAwesomeIcon icon={faArrowLeft} /> All posts
        </Link>
      )}

      <div className="page-heading">
        <div>
          <span className="eyebrow">{post ? 'A CLOSER LOOK' : 'YOUR AUDIENCE, A LITTLE CLEARER'}</span>
          <h1>{post ? post.title : 'Good things start with listening.'}</h1>

          <p>
            {post
              ? 'Here’s what your fans are saying about this post.'
              : 'The little things they love. The ideas they’re hoping for. All in one place.'}
          </p>
        </div>

        {!post && (
          <span className="date-range">
            <FontAwesomeIcon icon={faCalendarDays} />
            {formatDate(dataset.posts[0].publishedAt)} –{' '}
            {formatDate(dataset.posts[dataset.posts.length - 1].publishedAt, true)}
          </span>
        )}
      </div>

      {post && (
        <div className="post-context">
          <img src={post.thumbnail} alt={`Sample imagery for ${post.title}`} />

          <div>
            <span className="post-format">
              {post.format} <span>·</span> {formatDate(post.publishedAt, true)}
            </span>

            <p>{post.caption}</p>

            <button className="text-button" onClick={_handleSampleLink}>
              View on Fanvue <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </button>
          </div>
        </div>
      )}

      <div className="metric-strip" aria-label="Analysed sample dataset">
        {[
          { label: 'Comments analysed', value: counts.comments, icon: faCommentDots },
          { label: 'Distinct fans', value: counts.fans, icon: faUserGroup },
          { label: 'Audience themes', value: insights.length, icon: faWandMagicSparkles },
          { label: 'Posts analysed', value: counts.posts, icon: faLayerGroup }
        ].map((metric) => (
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

      {!post && featuredInsight && (
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

              <span className="spark">✦</span>
            </div>

            <span className="decorative-star">✳</span>
          </div>
        </section>
      )}

      <section className="insights-section" aria-labelledby="audience-themes-title">
        <div className="section-heading">
          <div>
            <h2 id="audience-themes-title">
              {post ? 'What this post is telling you' : 'Here’s what’s coming through'}
            </h2>

            <p>Every insight starts with something a fan actually said.</p>
          </div>

          <label className="category-filter">
            <span className="sr-only">Filter insight category</span>

            <select value={selectedCategory} onChange={_handleCategoryChange}>
              <option value="all">All insights</option>

              {categories.map((category) => (
                <option value={category} key={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
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
            .filter((category) => selectedCategory === 'all' || selectedCategory === category)
            .map((category) => {
              const categoryInsights = insights
                .filter((insight) => insight.category === category)
                .sort(
                  (firstInsight, secondInsight) =>
                    getInsightCounts(secondInsight, dataset, postId).fans -
                    getInsightCounts(firstInsight, dataset, postId).fans
                )

              return (
                <section className="insight-column" key={category}>
                  <div className="column-heading">
                    <CategoryIcon category={category} />
                    <h3>{categoryLabels[category]}</h3>
                    <span>{categoryInsights.length}</span>
                  </div>

                  <div className="column-cards">
                    {categoryInsights.map((insight) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        dataset={dataset}
                        postId={postId}
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

        {result && (
          <span className="updated-at">
            {isPreview ? 'Sample period' : 'Analysed'} {formatDate(result.analysedAt)}
          </span>
        )}
      </div>

      {selectedInsight && (
        <InsightDrawer
          key={selectedInsight.id}
          insight={selectedInsight}
          dataset={dataset}
          postId={postId}
          basePath={basePath}
          onClose={_handleInsightClose}
        />
      )}
    </div>
  )
}

export default DashboardContent
