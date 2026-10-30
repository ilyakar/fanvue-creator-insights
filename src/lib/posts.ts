/* ------------------------------------------------------------
Prepares source post counts and applies the shared posts search, format and ordering rules.
---------------------------------------------------------------*/

import type { Dataset, Post } from './types'

export interface PostWithCommentCount extends Post {
  commentCount: number
}

// Keeps source comment counting out of individual cards and count displays.
export const getPostsWithCommentCounts = (audienceFeedback: Dataset): PostWithCommentCount[] => {
  const commentCounts = new Map<string, number>()

  for (const comment of audienceFeedback.comments) {
    commentCounts.set(comment.postId, (commentCounts.get(comment.postId) || 0) + 1)
  }

  return audienceFeedback.posts.map(post => ({ ...post, commentCount: commentCounts.get(post.id) || 0 }))
}

// Uses one predicate and ordering for the toolbar count and visible cards without mutating source posts.
export const filterPosts = <SourcePost extends Post>(
  posts: SourcePost[],
  searchQuery: string,
  selectedFormat: string
) => {
  const normalizedSearchQuery = searchQuery.toLowerCase()

  return posts
    .filter(post => {
      const searchablePostText = `${post.title} ${post.caption}`.toLowerCase()
      const matchesSearch = searchablePostText.includes(normalizedSearchQuery)
      const matchesFormat = selectedFormat === 'all' || post.format === selectedFormat

      return matchesSearch && matchesFormat
    })
    .sort((firstPost, secondPost) => secondPost.publishedAt.localeCompare(firstPost.publishedAt))
}
