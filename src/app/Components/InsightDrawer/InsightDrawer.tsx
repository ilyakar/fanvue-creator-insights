'use client'

/* ------------------------------------------------------------
Reveals the original evidence in a keyboard-accessible modal with honest source links.
---------------------------------------------------------------*/

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faCheck,
  faChevronDown,
  faLightbulb,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

import type { Dataset, Insight } from '@/lib/types'
import { categoryLabels, formatDate, getEvidence, getInsightCounts } from '@/lib/insights'
import { useAlert } from '@/app/AlertProvider'
import CategoryIcon from '@/app/Components/CategoryIcon/CategoryIcon'

// Reveals the original evidence in a keyboard-accessible modal with honest source links.
const InsightDrawer = ({
  insight,
  dataset,
  postId,
  basePath,
  onClose
}: {
  insight: Insight
  dataset: Dataset
  postId?: string
  basePath: string
  onClose: () => void
}) => {
  const panelReference = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(12)
  const showAlert = useAlert()

  const comments = getEvidence(insight, dataset, postId)
  const counts = getInsightCounts(insight, dataset, postId)
  const scopedSummary = insight.postSummaries.find(entry => entry.postId === postId)
  const summary = postId ? scopedSummary?.summary : insight.summary
  const opportunity = postId ? scopedSummary?.opportunity : insight.opportunity

  // Moves focus into the panel, traps keyboard navigation and restores focus on dismissal.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelReference.current?.focus()

    // Keeps modal keyboard interactions inside the open evidence panel.
    const _handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = panelReference.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, [tabindex="0"]'
      )

      if (!focusable?.length) {
        event.preventDefault()

        return
      }

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (
        event.shiftKey &&
        (document.activeElement === firstElement || document.activeElement === panelReference.current)
      ) {
        event.preventDefault()
        lastElement.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement || document.activeElement === panelReference.current)
      ) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', _handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', _handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

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
                <FontAwesomeIcon icon={faLightbulb} /> A LITTLE IDEA TO TRY
              </span>

              <p>{opportunity}</p>
            </div>
          )}

          <div className="comments-heading">
            <h3>
              The comments behind it <span>{counts.comments}</span>
            </h3>

            <p>
              <FontAwesomeIcon icon={faCheck} /> Original words. Counted once per fan.
            </p>
          </div>

          <div className="comment-list">
            {comments.slice(0, visibleCount).map((comment, position) => {
              const fan = dataset.fans.find(entry => entry.id === comment.fanId)!
              const post = dataset.posts.find(entry => entry.id === comment.postId)!

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
