/* ------------------------------------------------------------
Protects shared post filtering, ordering and source comment counts across count and card consumers.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'

import { filterPosts, getPostsWithCommentCounts } from '@/lib/posts'
import { validateDataset } from '@/lib/data/validation'
import posts from '@/mock-data/posts.json'
import comments from '@/mock-data/comments.json'
import fans from '@/mock-data/fans.json'

// Ensures narrowing the browser payload preserves every post's original comment count.
test('post browser records retain source counts without account or analysis state', () => {
  const audienceFeedback = validateDataset({ version: 'sample', posts, comments, fans })
  const browserPosts = getPostsWithCommentCounts(audienceFeedback)

  assert.equal(browserPosts.length, posts.length)
  assert.equal(
    browserPosts.reduce((totalComments, post) => totalComments + post.commentCount, 0),
    comments.length
  )

  for (const post of browserPosts) {
    assert.equal(post.commentCount, comments.filter(comment => comment.postId === post.id).length)
  }

  assert.ok(browserPosts.every(post => !('account' in post) && !('savedAnalysis' in post)))
})

// Protects identical search and format behavior for cards and counts without changing the source order.
test('post filters combine title and caption search with format and newest-first ordering', () => {
  const sourcePosts = [
    {
      ...posts[0],
      id: 'older',
      title: 'Morning',
      caption: 'Quiet coffee',
      format: 'Photo' as const,
      publishedAt: '2026-10-01T00:00:00Z'
    },
    {
      ...posts[0],
      id: 'newer',
      title: 'COFFEE chat',
      caption: 'A conversation',
      format: 'Video' as const,
      publishedAt: '2026-10-03T00:00:00Z'
    },
    {
      ...posts[0],
      id: 'other',
      title: 'Studio',
      caption: 'New portraits',
      format: 'Photo' as const,
      publishedAt: '2026-10-02T00:00:00Z'
    }
  ]

  assert.deepEqual(
    filterPosts(sourcePosts, 'CoFfEe', 'all').map(post => post.id),
    ['newer', 'older']
  )
  assert.deepEqual(
    filterPosts(sourcePosts, 'coffee', 'Photo').map(post => post.id),
    ['older']
  )
  assert.deepEqual(
    filterPosts(sourcePosts, '', 'all').map(post => post.id),
    ['newer', 'other', 'older']
  )
  assert.deepEqual(filterPosts(sourcePosts, 'missing', 'all'), [])
  assert.deepEqual(
    sourcePosts.map(post => post.id),
    ['older', 'newer', 'other']
  )
})
