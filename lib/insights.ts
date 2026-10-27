/* ------------------------------------------------------------
Returns original evidence, scoped to one post when requested.
---------------------------------------------------------------*/

import type { Category, Dataset, Insight } from './types'

export const categoryLabels: Record<Category, string> = {
  love: 'What fans love',
  requests: 'What fans want next',
  improve: 'What could be better'
}

// Returns original evidence, scoped to one post when requested.
export const getEvidence = (insight: Insight, dataset: Dataset, postId?: string) => {
  const commentIdentifiers = new Set(insight.commentIds)

  return dataset.comments.filter(
    (comment) => commentIdentifiers.has(comment.id) && (!postId || comment.postId === postId)
  )
}

// Counts identities rather than treating repeat comments as distinct fans.
export const getInsightCounts = (insight: Insight, dataset: Dataset, postId?: string) => {
  const comments = getEvidence(insight, dataset, postId)

  return { fans: new Set(comments.map((comment) => comment.fanId)).size, comments: comments.length }
}

// Computes overview metrics directly from the source dataset.
export const getDatasetCounts = (dataset: Dataset) => ({
  comments: dataset.comments.length,
  fans: new Set(dataset.comments.map((comment) => comment.fanId)).size,
  posts: dataset.posts.length
})

// Formats dates consistently without depending on the machine timezone.
export const formatDate = (value: string, includeYear = false) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(includeYear ? { year: 'numeric' as const } : {}),
    timeZone: 'UTC'
  }).format(new Date(value))
