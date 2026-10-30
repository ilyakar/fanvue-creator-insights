/* ------------------------------------------------------------
Validates AI evidence references and post scope before any result is stored.
---------------------------------------------------------------*/

import { createHash } from 'node:crypto'
import { z } from 'zod'

import type { Dataset, Insight, PostTheme } from '@/lib/types'

export const analysisSchema = z.object({
  insights: z.array(
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

export const postAnalysisSchema = z.object({
  insights: z.array(
    z.object({
      title: z.string().min(1).max(100),
      category: z.enum(['love', 'requests', 'improve']),
      summary: z.string().min(1).max(500),
      opportunity: z.string().max(500).nullable(),
      commentIds: z.array(z.string()).min(1)
    })
  )
})

export const overviewSchema = z.object({
  groups: z.array(
    z.object({
      title: z.string().min(1).max(100),
      category: z.enum(['love', 'requests', 'improve']),
      summary: z.string().min(1).max(650),
      opportunity: z.string().max(650).nullable(),
      postThemeIds: z.array(z.string()).min(1)
    })
  )
})

// Accepts evidence only from the independently analysed source post.
export const validatePostAnalysis = (input: unknown, dataset: Dataset, postId: string): PostTheme[] => {
  const post = dataset.posts.find(sourcePost => sourcePost.id === postId)

  if (!post) {
    throw new Error('Analysis referenced an unknown post.')
  }

  const parsed = postAnalysisSchema.parse(input)
  const scopedDataset = {
    ...dataset,
    posts: [post],
    comments: dataset.comments.filter(comment => comment.postId === postId)
  }
  const insights = parsed.insights.map(insight => ({
    ...insight,
    postSummaries: [{ postId, summary: insight.summary, opportunity: insight.opportunity }]
  }))

  return validateAnalysis({ insights }, scopedDataset).map(insight => ({ ...insight, postId }))
}

// Derives overview evidence from validated post themes rather than asking the model to invent references.
export const buildOverviewInsights = (input: unknown, postThemes: PostTheme[]): Insight[] => {
  const parsed = overviewSchema.parse(input)
  const sourceLookup = new Map(postThemes.map(theme => [theme.id, theme]))
  const groupedIdentifiers = new Set<string>()

  const insights: Insight[] = parsed.groups.map(group => {
    const sourceIdentifiers = [...new Set(group.postThemeIds)]
    const sources = sourceIdentifiers.map(identifier => {
      const source = sourceLookup.get(identifier)

      if (!source) {
        throw new Error('Overview referenced an unknown post theme.')
      }

      if (source.category !== group.category) {
        throw new Error('Overview referenced a category-mismatched post theme.')
      }

      if (groupedIdentifiers.has(identifier)) {
        throw new Error('Overview referenced an already grouped post theme.')
      }

      groupedIdentifiers.add(identifier)

      return source
    })
    const commentIds = [...new Set(sources.flatMap(source => source.commentIds))]
    const postIds = [...new Set(sources.map(source => source.postId))]
    const postSummaries = postIds.map(postId => {
      const scopedSources = sources.filter(source => source.postId === postId)

      return {
        postId,
        summary: scopedSources.map(source => source.summary).join(' '),
        opportunity:
          scopedSources
            .map(source => source.opportunity)
            .filter(Boolean)
            .join(' ') || null
      }
    })
    const identifier = createHash('sha256')
      .update(JSON.stringify([...sourceIdentifiers].sort()))
      .digest('hex')
      .slice(0, 16)

    return { ...group, id: identifier, postThemeIds: sourceIdentifiers, commentIds, postSummaries }
  })

  // Preserve specific themes that the grouping response leaves unmatched instead of silently losing them.
  for (const theme of postThemes) {
    if (!groupedIdentifiers.has(theme.id)) {
      insights.push({ ...theme, postThemeIds: [theme.id] })
    }
  }

  return insights
}
