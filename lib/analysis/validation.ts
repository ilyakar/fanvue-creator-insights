/* ------------------------------------------------------------
Validates AI evidence references and post scope before any result is stored.
---------------------------------------------------------------*/

import { createHash } from 'node:crypto'
import { z } from 'zod'
import type { Dataset, Insight } from '../types'

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
  const parsed = analysisSchema.parse(input)
  const commentLookup = new Map(dataset.comments.map((comment) => [comment.id, comment]))
  return parsed.insights.map((insight) => {
    const commentIds = [...new Set(insight.commentIds)]
    if (commentIds.some((identifier) => !commentLookup.has(identifier)))
      throw new Error('Analysis referenced an unknown comment.')
    const supportedPosts = new Set(commentIds.map((identifier) => commentLookup.get(identifier)!.postId))
    const scopedPosts = new Set(insight.postSummaries.map((summary) => summary.postId))
    if (
      scopedPosts.size !== insight.postSummaries.length ||
      scopedPosts.size !== supportedPosts.size ||
      [...scopedPosts].some((postId) => !supportedPosts.has(postId))
    ) {
      throw new Error('Analysis contained missing or unsupported post summaries.')
    }
    const identifier = createHash('sha256')
      .update(JSON.stringify([insight.category, insight.title, [...commentIds].sort()]))
      .digest('hex')
      .slice(0, 16)
    return { ...insight, id: identifier, commentIds }
  })
}

// Includes every input that changes the meaning or ownership of cached analysis.
export const getAnalysisCacheKey = (userId: string, dataset: Dataset, model: string, promptVersion: string) =>
  createHash('sha256')
    .update(JSON.stringify([userId, dataset, model, promptVersion]))
    .digest('hex')
