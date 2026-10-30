/* ------------------------------------------------------------
Validates AI evidence references and post scope before any result is stored.
---------------------------------------------------------------*/

import { createHash } from 'node:crypto'
import { z } from 'zod'

import type { Dataset, Insight } from '@/lib/types'

export const analysisSchema = z.object({
  insights: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        category: z.enum(['love', 'requests', 'improve']),
        summary: z.string().min(1).max(650),
        opportunity: z.string().max(650).nullable(),
        commentIds: z.array(z.string()).min(1),
        postSummaries: z.array(
          z.object({
            postId: z.string(),
            summary: z.string().min(1).max(500),
            opportunity: z.string().max(500).nullable()
          })
        )
      })
    )
    .max(18)
})

// Validates AI evidence references and post scope before any result is stored.
export const validateAnalysis = (input: unknown, dataset: Dataset): Insight[] => {
  const parsedAnalysis = analysisSchema.parse(input)
  const commentLookup = new Map(dataset.comments.map(comment => [comment.id, comment]))

  return parsedAnalysis.insights.map(insight => {
    const commentIds = [...new Set(insight.commentIds)]

    const hasUnknownComments = commentIds.some(identifier => !commentLookup.has(identifier))

    if (hasUnknownComments) {
      throw new Error('Analysis referenced an unknown comment.')
    }

    // Each post summary must have evidence in that exact source post.
    const supportedPosts = new Set(commentIds.map(identifier => commentLookup.get(identifier)!.postId))
    const scopedPosts = new Set(insight.postSummaries.map(summary => summary.postId))

    const hasDuplicateSummaries = scopedPosts.size !== insight.postSummaries.length
    const hasMissingSummaries = scopedPosts.size !== supportedPosts.size
    const hasUnsupportedSummaries = [...scopedPosts].some(postId => !supportedPosts.has(postId))

    if (hasDuplicateSummaries || hasMissingSummaries || hasUnsupportedSummaries) {
      throw new Error('Analysis contained missing or unsupported post summaries.')
    }

    // Stable identifiers keep a validated theme consistent across repeated reads.
    const identifier = createHash('sha256')
      .update(JSON.stringify([insight.category, insight.title, [...commentIds].sort()]))
      .digest('hex')
      .slice(0, 16)

    return { ...insight, id: identifier, commentIds }
  })
}
