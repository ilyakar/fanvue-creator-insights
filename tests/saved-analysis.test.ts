/* ------------------------------------------------------------
Checks saved-analysis reads use resolved feedback and owner-scoped cache keys without starting work.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'

import { getCurrentAnalysis } from '@/lib/server/saved-analysis'
import { getAnalysisCacheKey } from '@/lib/analysis/cache'
import { promptVersion } from '@/lib/analysis/service'
import { validateDataset } from '@/lib/data/validation'
import posts from '@/mock-data/posts.json'
import comments from '@/mock-data/comments.json'
import fans from '@/mock-data/fans.json'

// Guards the route boundary against hidden account reloads, duplicate snapshots and read-triggered analysis creation.
test('saved-analysis lookup only reads the job for its owner and resolved feedback', async testContext => {
  const previousStorageUrl = process.env.SUPABASE_URL
  const previousStorageKey = process.env.SUPABASE_SECRET_KEY
  process.env.SUPABASE_URL = 'https://audience-storage.test'
  process.env.SUPABASE_SECRET_KEY = 'test-server-key'

  testContext.after(() => {
    if (previousStorageUrl === undefined) {
      delete process.env.SUPABASE_URL
    } else {
      process.env.SUPABASE_URL = previousStorageUrl
    }

    if (previousStorageKey === undefined) {
      delete process.env.SUPABASE_SECRET_KEY
    } else {
      process.env.SUPABASE_SECRET_KEY = previousStorageKey
    }
  })

  const requests: { url: URL; method: string }[] = []
  testContext.mock.method(globalThis, 'fetch', async (input: string, options: RequestInit) => {
    requests.push({ url: new URL(input), method: options.method || 'GET' })

    return new Response('[]', { headers: { 'Content-Type': 'application/json' } })
  })

  const audienceFeedback = validateDataset({ version: 'sample', posts, comments, fans })
  const analysisJob = await getCurrentAnalysis('signed-in-owner', audienceFeedback)

  assert.equal(analysisJob, null)
  assert.equal(requests.length, 1)
  assert.equal(requests[0].method, 'GET')
  assert.equal(requests[0].url.pathname, '/rest/v1/analysis_jobs')
  assert.equal(requests[0].url.searchParams.get('user_id'), 'eq.signed-in-owner')
  assert.equal(
    requests[0].url.searchParams.get('cache_key'),
    `eq.${getAnalysisCacheKey('signed-in-owner', audienceFeedback, process.env.OPENAI_MODEL || 'gpt-4.1-mini', promptVersion)}`
  )
})
