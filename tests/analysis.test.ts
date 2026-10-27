/* ------------------------------------------------------------
Confirms the authored source data is internally consistent and supports repeated fan identities.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'
import { sampleDataProvider, validateDataset } from '../lib/data/provider'
import { validateAnalysis, getAnalysisCacheKey } from '../lib/analysis/validation'
import { getDatasetCounts, getInsightCounts, getEvidence } from '../lib/insights'
import previewInsights from '../mock-data/preview-insights.json'
import type { Insight } from '../lib/types'

// Confirms the authored source data is internally consistent and supports repeated fan identities.
test('sample data has 18 posts, 360 comments and repeated identities', async () => {
  const dataset = await sampleDataProvider.getDataset()
  assert.deepEqual(getDatasetCounts(dataset), { posts: 18, comments: 360, fans: 96 })
  assert.equal(new Set(dataset.comments.map((comment) => comment.id)).size, 360)
  assert.ok(dataset.comments.length > dataset.fans.length)
})

// Ensures a fan posting multiple comments is counted once per insight.
test('theme counts deduplicate fans and comment references', async () => {
  const dataset = await sampleDataProvider.getDataset()
  const insights = validateAnalysis({ insights: previewInsights }, dataset)
  const insight = insights.find(
    (entry) => getInsightCounts(entry, dataset).fans < getInsightCounts(entry, dataset).comments
  )!
  const counts = getInsightCounts(insight, dataset)
  assert.equal(counts.comments, insight.commentIds.length)
  assert.ok(counts.fans < counts.comments)
  const duplicated = { ...insight, commentIds: [...insight.commentIds, insight.commentIds[0]] }
  assert.equal(validateAnalysis({ insights: [duplicated] }, dataset)[0].commentIds.length, counts.comments)
})

// Stops invented references from being accepted as evidence.
test('analysis rejects nonexistent comments', async () => {
  const dataset = await sampleDataProvider.getDataset()
  assert.throws(
    () => validateAnalysis({ insights: [{ ...previewInsights[0], commentIds: ['invented-comment'] }] }, dataset),
    /unknown comment/
  )
})

// Prevents overview summaries from silently becoming unsupported post-specific claims.
test('analysis rejects unsupported or missing post summaries', async () => {
  const dataset = await sampleDataProvider.getDataset()
  assert.throws(
    () => validateAnalysis({ insights: [{ ...previewInsights[0], postSummaries: [] }] }, dataset),
    /post summaries/
  )
  assert.throws(
    () =>
      validateAnalysis(
        {
          insights: [
            {
              ...previewInsights[0],
              postSummaries: [{ postId: 'invented-post', summary: 'Unsupported.', opportunity: null }]
            }
          ]
        },
        dataset
      ),
    /post summaries/
  )
})

// Verifies post-specific counts and original evidence never include another post.
test('post evidence remains inside its source post', async () => {
  const dataset = await sampleDataProvider.getDataset()
  const insight = previewInsights[0] as Insight
  const evidence = getEvidence(insight, dataset, 'post-01')
  assert.ok(evidence.length > 0)
  assert.ok(evidence.every((comment) => comment.postId === 'post-01'))
  assert.equal(getInsightCounts(insight, dataset, 'post-01').comments, evidence.length)
})

// Invalidates saved analysis when ownership, content or analysis configuration changes.
test('cache key includes owner, full content, model and prompt version', async () => {
  const dataset = await sampleDataProvider.getDataset()
  const original = getAnalysisCacheKey('user-one', dataset, 'model-one', 'prompt-one')
  assert.equal(original, getAnalysisCacheKey('user-one', dataset, 'model-one', 'prompt-one'))
  assert.notEqual(original, getAnalysisCacheKey('user-two', dataset, 'model-one', 'prompt-one'))
  assert.notEqual(original, getAnalysisCacheKey('user-one', dataset, 'model-two', 'prompt-one'))
  assert.notEqual(original, getAnalysisCacheKey('user-one', dataset, 'model-one', 'prompt-two'))
  assert.notEqual(original, getAnalysisCacheKey('user-one', { ...dataset, comments: [] }, 'model-one', 'prompt-one'))
})

// Rejects source relationships that would invalidate deterministic metrics.
test('dataset validation rejects duplicate and orphaned records', async () => {
  const dataset = await sampleDataProvider.getDataset()
  assert.throws(() => validateDataset({ ...dataset, fans: [...dataset.fans, dataset.fans[0]] }), /duplicate/)
  assert.throws(
    () => validateDataset({ ...dataset, comments: [{ ...dataset.comments[0], fanId: 'unknown' }] }),
    /missing/
  )
})

// A quiet dataset must remain an empty result rather than producing fabricated themes.
test('empty structured analysis remains empty', async () => {
  assert.deepEqual(validateAnalysis({ insights: [] }, await sampleDataProvider.getDataset()), [])
})
