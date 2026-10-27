/* ------------------------------------------------------------
Rejects duplicate identifiers and broken source relationships before analysis.
---------------------------------------------------------------*/

import { z } from 'zod'
import posts from '@/mock-data/posts.json'
import comments from '@/mock-data/comments.json'
import fans from '@/mock-data/fans.json'
import type { Dataset } from '../types'

const datasetSchema = z.object({
  version: z.string(),
  posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      caption: z.string(),
      publishedAt: z.iso.datetime(),
      thumbnail: z.string(),
      format: z.enum(['Photo', 'Video', 'Live'])
    })
  ),
  comments: z.array(
    z.object({
      id: z.string(),
      postId: z.string(),
      fanId: z.string(),
      text: z.string().min(1),
      createdAt: z.iso.datetime()
    })
  ),
  fans: z.array(z.object({ id: z.string(), username: z.string(), displayName: z.string() }))
})

export interface AudienceDataProvider {
  getDataset: () => Promise<Dataset>
}

// Rejects duplicate identifiers and broken source relationships before analysis.
export const validateDataset = (input: unknown): Dataset => {
  const dataset = datasetSchema.parse(input)
  const postIdentifiers = new Set(dataset.posts.map((post) => post.id))
  const fanIdentifiers = new Set(dataset.fans.map((fan) => fan.id))
  const commentIdentifiers = new Set(dataset.comments.map((comment) => comment.id))
  if (
    postIdentifiers.size !== dataset.posts.length ||
    fanIdentifiers.size !== dataset.fans.length ||
    commentIdentifiers.size !== dataset.comments.length
  ) {
    throw new Error('The dataset contains duplicate identifiers.')
  }
  if (dataset.comments.some((comment) => !postIdentifiers.has(comment.postId) || !fanIdentifiers.has(comment.fanId))) {
    throw new Error('The dataset contains missing posts or fans.')
  }
  return dataset
}

// Supplies versioned sample content behind the future live-data boundary.
export const sampleDataProvider: AudienceDataProvider = {
  getDataset: async () => validateDataset({ version: 'sample-2026-10-v1', posts, comments, fans })
}
