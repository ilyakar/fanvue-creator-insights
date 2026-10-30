'use client'

/* ------------------------------------------------------------
Reveals the original evidence in a keyboard-accessible modal with honest source links.
---------------------------------------------------------------*/

import { useRef, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faCheck,
  faChevronDown,
  faLightbulb,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

import type { Dataset, Insight, PostTheme } from '@/lib/types'
import { categoryLabels, formatDate, getEvidence, getInsightCounts } from '@/lib/insights'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'
import { useAlert } from '@/app/AlertProvider'
import CategoryIcon from '@/app/Components/CategoryIcon/CategoryIcon'

// Reveals the original evidence in a keyboard-accessible modal with honest source links.
const InsightDrawer = ({
  insight,
  audienceFeedback,
  postId,
  basePath,
  postThemes,
  onClose
}: {
  insight: Insight
  audienceFeedback: Dataset
  postId?: string
  basePath: string
  postThemes?: PostTheme[]
  onClose: () => void
}) => {
  const panelReference = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(12)
  const showAlert = useAlert()

  const comments = getEvidence(insight, audienceFeedback, postId)
  const counts = getInsightCounts(insight, audienceFeedback, postId)
  const summary = insight.summary
  const opportunity = insight.opportunity
  const sourceThemes = postThemes?.filter(theme => insight.postThemeIds?.includes(theme.id)) || []

  useFocusTrap(panelReference, true, onClose, 'container')

  // Explains why synthetic source records do not link to real Fanvue content.
  const _handleSampleLink = () =>
    showAlert('You’re viewing sample data', 'Links to Fanvue aren’t available in this prototype.')

  // Reveals more original comments without changing the supporting evidence counts.
  const _handleShowMore = () => setVisibleCount(previousValue => previousValue + 12)

  return (
    <div className="drawer-backdrop">
      <button className="drawer-dismiss" aria-label="Close insight" onClick={onClose} />

      <div
        className="insight-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-title"
        tabIndex={-1}
        ref={panelReference}>
        <div className="drawer-toolbar">
          <span>THE STORY BEHIND THE INSIGHT</span>

          <button className="icon-button" aria-label="Close insight" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="drawer-content">
          <div className="category-label">
            <CategoryIcon category={insight.category} />
            {categoryLabels[insight.category]}
          </div>

          <h2 id="insight-title">{insight.title}</h2>

          <div className="drawer-counts">
            <strong>{counts.fans} distinct fans</strong>
            <span>·</span>
            <span>{counts.comments} comments</span>
          </div>

          <p className="drawer-summary">{summary}</p>

          {opportunity && (
            <div className="opportunity">
              <span className="eyebrow">
                <FontAwesomeIcon icon={faLightbulb} /> SUGGESTED ACTION
              </span>

              <p>{opportunity}</p>
            </div>
          )}

          {!postId && sourceThemes.length > 0 && (
            <details className="source-themes">
              <summary>From {sourceThemes.length} post themes</summary>

              <ul>
                {sourceThemes.map(theme => {
                  const sourcePost = audienceFeedback.posts.find(post => post.id === theme.postId)!

                  return (
                    <li key={theme.id}>
                      <Link href={`${basePath}/posts/${theme.postId}`} onClick={onClose}>
                        {theme.title}
                      </Link>

                      <p>{sourcePost.title}</p>
                    </li>
                  )
                })}
              </ul>
            </details>
          )}

          <div className="comments-heading">
            <h3>
              Supporting comments <span>{counts.comments}</span>
            </h3>

            <p>
              <FontAwesomeIcon icon={faCheck} /> Original words. Counted once per fan.
            </p>
          </div>

          <div className="comment-list">
            {comments.slice(0, visibleCount).map((comment, position) => {
              const fan = audienceFeedback.fans.find(sourceFan => sourceFan.id === comment.fanId)!
              const post = audienceFeedback.posts.find(sourcePost => sourcePost.id === comment.postId)!

              return (
                <article className="comment-row" key={comment.id}>
                  <span className={`fan-avatar tone-${position % 4}`}>{fan.displayName.slice(0, 1)}</span>

                  <div className="comment-content">
                    <div className="identity">
                      <strong>@{fan.username}</strong>
                      <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
                    </div>

                    <p>{comment.text}</p>

                    <div className="comment-source">
                      <Link href={`${basePath}/posts/${post.id}`} onClick={onClose}>
                        {post.title}
                      </Link>

                      <button aria-label="Open original comment on Fanvue" onClick={_handleSampleLink}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {visibleCount < comments.length && (
            <button className="button secondary load-more" onClick={_handleShowMore}>
              Show more comments <FontAwesomeIcon icon={faChevronDown} />
            </button>
          )}

          <p className="evidence-note">
            One fan can leave several comments. Fan counts use distinct identities, so every voice counts fairly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InsightDrawer
