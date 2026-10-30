/* ------------------------------------------------------------
Checks independent post evidence, overview lineage and source-specific theme rendering.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'

import { buildOverviewInsights, validatePostAnalysis } from '@/lib/analysis/validation'
import { getDisplayInsights, getInsightCounts } from '@/lib/insights'
import type { AnalysisResult, Dataset, Post } from '@/lib/types'
import posts from '@/mock-data/posts.json'
import fans from '@/mock-data/fans.json'

const dataset: Dataset = {
  version: 'independent-subjects',
  posts: posts.slice(0, 4) as Post[],
  fans: fans.slice(0, 2),
  comments: [
    {
      id: 'cats-angle',
      postId: posts[0].id,
      fanId: fans[0].id,
      text: 'Love the camera angle of the kittens.',
      createdAt: posts[0].publishedAt
    },
    {
      id: 'cars-angle',
      postId: posts[1].id,
      fanId: fans[0].id,
      text: 'Great camera angle of this car.',
      createdAt: posts[1].publishedAt
    },
    {
      id: 'building-angle',
      postId: posts[2].id,
      fanId: fans[1].id,
      text: 'Beautiful camera angle of the building.',
      createdAt: posts[2].publishedAt
    },
    {
      id: 'kitten-request',
      postId: posts[0].id,
      fanId: fans[1].id,
      text: 'Please adopt another kitten.',
      createdAt: posts[0].publishedAt
    }
  ]
}

// Supplies one independently scoped appreciation theme for each subject.
const getAngleThemes = () =>
  dataset.comments.slice(0, 3).flatMap(comment =>
    validatePostAnalysis(
      {
        insights: [
          {
            title: `Camera angles on ${comment.postId}`,
            category: 'love',
            summary: comment.text,
            opportunity: null,
            commentIds: [comment.id]
          }
        ]
      },
      dataset,
      comment.postId
    )
  )

// Keeps a concrete request on its original post even if no other post expresses it.
test('post analysis accepts specific single-comment themes and rejects cross-post evidence', () => {
  const request = {
    title: 'Adopt another kitten',
    category: 'requests',
    summary: 'One fan asks for another kitten.',
    opportunity: null,
    commentIds: ['kitten-request']
  }
  assert.equal(validatePostAnalysis({ insights: [request] }, dataset, posts[0].id).length, 1)
  assert.throws(() => validatePostAnalysis({ insights: [request] }, dataset, posts[1].id), /unknown comment/)
  assert.deepEqual(validatePostAnalysis({ insights: [] }, dataset, posts[3].id), [])
})

// Merges shared qualities while deriving exact evidence and distinct-fan counts from source themes.
test('overview groups post themes and retains unmatched specific requests', () => {
  const angles = getAngleThemes()
  const requests = validatePostAnalysis(
    {
      insights: [
        {
          title: 'Adopt another kitten',
          category: 'requests',
          summary: 'One fan asks for another kitten.',
          opportunity: null,
          commentIds: ['kitten-request']
        }
      ]
    },
    dataset,
    posts[0].id
  )
  const postThemes = [...angles, ...requests]
  const insights = buildOverviewInsights(
    {
      groups: [
        {
          title: 'Fans appreciate the camera angles',
          category: 'love',
          summary: 'Fans praise the camera angles across different subjects.',
          opportunity: null,
          postThemeIds: angles.map(theme => theme.id)
        }
      ]
    },
    postThemes
  )
  assert.equal(insights.length, 2)
  assert.deepEqual(insights[0].commentIds, ['cats-angle', 'cars-angle', 'building-angle'])
  assert.deepEqual(getInsightCounts(insights[0], dataset), { comments: 3, fans: 2 })
  assert.equal(insights[1].title, 'Adopt another kitten')

  const analysis: AnalysisResult = {
    insights,
    postThemes,
    analysedAt: '2026-10-30',
    datasetVersion: dataset.version,
    model: 'test',
    promptVersion: 'test'
  }
  assert.equal(getDisplayInsights(analysis, dataset).length, 2)
  assert.equal(getDisplayInsights(analysis, dataset, posts[0].id).length, 2)
  assert.equal(getDisplayInsights(analysis, dataset, posts[1].id)[0].title, angles[1].title)
  assert.deepEqual(getDisplayInsights(analysis, dataset, posts[3].id), [])
})

// Prevents invented source themes, category changes and duplicate grouping from corrupting lineage.
test('overview rejects unknown, category-mismatched and reused theme references', () => {
  const postThemes = getAngleThemes()
  const group = {
    title: 'Camera angles',
    category: 'love',
    summary: 'Camera angles are appreciated.',
    opportunity: null,
    postThemeIds: [postThemes[0].id]
  }
  assert.throws(
    () => buildOverviewInsights({ groups: [{ ...group, postThemeIds: ['invented'] }] }, postThemes),
    /unknown/
  )
  assert.throws(() => buildOverviewInsights({ groups: [{ ...group, category: 'requests' }] }, postThemes), /mismatched/)
  assert.throws(() => buildOverviewInsights({ groups: [group, group] }, postThemes), /already grouped/)
})

// Keeps current and legacy insight copy consistent while preserving original comment evidence.
test('display insights call commenters fans across overview and post views', () => {
  const insight = {
    id: 'fan-terminology',
    title: 'Followers’ favourite themes',
    category: 'requests' as const,
    summary: 'Followers admire your work, and one follower asks for polls.',
    opportunity: "Ask followers to vote on a follower's suggestion.",
    commentIds: ['kitten-request'],
    postSummaries: [
      {
        postId: posts[0].id,
        summary: 'Viewers want polls, and a viewer asks to choose themes.',
        opportunity: null
      }
    ]
  }
  const analysis: AnalysisResult = {
    insights: [insight],
    analysedAt: '2026-10-30T00:00:00Z',
    datasetVersion: dataset.version,
    model: 'test',
    promptVersion: 'legacy'
  }
  const originalAnalysis = structuredClone(analysis)
  const originalComments = structuredClone(dataset.comments)
  const overviewInsight = getDisplayInsights(analysis, dataset)[0]
  const legacyPostInsight = getDisplayInsights(analysis, dataset, posts[0].id)[0]
  const postInsight = getDisplayInsights(
    { ...analysis, postThemes: [{ ...insight, postId: posts[0].id }] },
    dataset,
    posts[0].id
  )[0]

  assert.equal(overviewInsight.title, 'Fans’ favourite themes')
  assert.equal(overviewInsight.summary, 'Fans admire your work, and one fan asks for polls.')
  assert.equal(overviewInsight.opportunity, "Ask fans to vote on a fan's suggestion.")
  assert.equal(legacyPostInsight.summary, 'Fans want polls, and a fan asks to choose themes.')
  assert.equal(legacyPostInsight.opportunity, null)
  assert.equal(postInsight.summary, overviewInsight.summary)
  assert.deepEqual(analysis, originalAnalysis)
  assert.deepEqual(dataset.comments, originalComments)
})
