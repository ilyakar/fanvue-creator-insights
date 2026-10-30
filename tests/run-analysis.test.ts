/* ------------------------------------------------------------
Verifies immediate inference, saved results, concurrent request reuse and failure recovery.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'

import { validatePostAnalysis } from '@/lib/analysis/validation'
import type { Post, PostTheme } from '@/lib/types'
import { runAnalysis } from '@/lib/server/run-analysis'
import type { AnalysisJob } from '@/lib/types'
import posts from '@/mock-data/posts.json'
import comments from '@/mock-data/comments.json'
import fans from '@/mock-data/fans.json'
import previewInsights from '@/mock-data/preview-insights.json'

// Exercises the actual database and OpenAI HTTP clients without calling external services.
test('analysis starts in the request, deduplicates active work and saves completion before returning', async testContext => {
  const previousEnvironment = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
  process.env.SUPABASE_URL = 'https://analysis-storage.test'
  process.env.SUPABASE_SECRET_KEY = 'test-storage-key'
  process.env.OPENAI_API_KEY = 'test-model-key'

  testContext.after(() => {
    for (const [settingName, previousValue] of Object.entries(previousEnvironment)) {
      if (previousValue === undefined) {
        delete process.env[settingName]
      } else {
        process.env[settingName] = previousValue
      }
    }
  })

  let savedJob: AnalysisJob | null = null
  const extractedThemes: PostTheme[] = []
  let inferenceCalls = 0
  let failInference = false
  let releaseInference: () => void = () => {}
  let signalInferenceStarted: () => void = () => {}
  const inferenceStarted = new Promise<void>(resolve => {
    signalInferenceStarted = resolve
  })
  const inferenceReleased = new Promise<void>(resolve => {
    releaseInference = resolve
  })

  // Sends JSON in the same envelope as the storage API.
  const jsonResponse = (payload: unknown) =>
    new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } })

  testContext.mock.method(globalThis, 'fetch', async (input: string, options: RequestInit) => {
    const requestUrl = new URL(input)
    const method = options.method || 'GET'

    if (requestUrl.hostname === 'api.openai.com') {
      inferenceCalls += 1
      signalInferenceStarted()
      await inferenceReleased

      if (failInference) {
        return new Response(JSON.stringify({ error: { message: 'Provider unavailable' } }), { status: 503 })
      }

      const modelRequest = JSON.parse(options.body as string)
      const sourceInput = JSON.parse(modelRequest.input[1].content)
      let modelOutput: unknown

      if (sourceInput.post) {
        const scopedInsights = previewInsights
          .map(insight => ({
            ...insight,
            commentIds: insight.commentIds.filter(identifier =>
              comments.some(comment => comment.id === identifier && comment.postId === sourceInput.post.id)
            )
          }))
          .filter(insight => insight.commentIds.length > 0)

        assert.ok(
          sourceInput.comments.every((comment: { id: string }) =>
            comments.some(source => source.id === comment.id && source.postId === sourceInput.post.id)
          )
        )
        extractedThemes.push(
          ...validatePostAnalysis(
            { insights: scopedInsights },
            { version: 'sample', posts: posts as Post[], comments, fans },
            sourceInput.post.id
          )
        )
        modelOutput = { insights: scopedInsights }
      } else {
        modelOutput = {
          groups: previewInsights
            .filter(insight => insight.category === sourceInput.category)
            .map((insight, index) => ({
              groupId: `group-${index}`,
              title: insight.title,
              category: insight.category,
              summary: insight.summary,
              opportunity: insight.opportunity
            })),
          assignments: Object.fromEntries(
            sourceInput.postThemes.map((theme: { title: string; postThemeId: string }) => [
              theme.postThemeId,
              `group-${previewInsights.filter(insight => insight.category === sourceInput.category).findIndex(insight => insight.title === theme.title)}`
            ])
          )
        }
        extractedThemes.length = 0
      }

      return jsonResponse({
        id: 'response-test',
        object: 'response',
        status: 'completed',
        output: [
          {
            id: 'message-test',
            type: 'message',
            role: 'assistant',
            status: 'completed',
            content: [{ type: 'output_text', text: JSON.stringify(modelOutput), annotations: [] }]
          }
        ]
      })
    }

    if (requestUrl.pathname === '/rest/v1/app_users') {
      assert.equal(requestUrl.searchParams.get('id'), 'eq.owner-one')

      return jsonResponse({ audience_creator_id: 'creator-one' })
    }

    if (requestUrl.pathname === '/rest/v1/rpc/get_audience_dataset') {
      return jsonResponse({ version: 'sample', posts, comments, fans })
    }

    assert.equal(requestUrl.pathname, '/rest/v1/analysis_jobs')

    if (method === 'GET') {
      assert.equal(requestUrl.searchParams.get('user_id'), 'eq.owner-one')

      return jsonResponse(savedJob)
    }

    const changes = JSON.parse(options.body as string)

    if (method === 'POST') {
      assert.equal(changes.status, 'analysing')
      savedJob = { id: 'job-one', ...changes }
    } else {
      assert.equal(requestUrl.searchParams.get('user_id'), 'eq.owner-one')
      assert.equal(
        requestUrl.searchParams.get('lease_token'),
        savedJob!.lease_token ? `eq.${savedJob!.lease_token}` : 'is.null'
      )
      savedJob = { ...savedJob!, ...changes }
    }

    return jsonResponse(savedJob)
  })

  const pendingAnalysis = runAnalysis('owner-one')
  await inferenceStarted
  const activeJob = await runAnalysis('owner-one')
  assert.equal(activeJob.status, 'analysing')
  assert.ok(inferenceCalls >= 1 && inferenceCalls <= 4)

  releaseInference()
  const completedJob = await pendingAnalysis
  assert.equal(completedJob.status, 'complete')
  assert.equal(completedJob.result?.insights.length, previewInsights.length)
  assert.equal(completedJob.lease_token, null)
  const completedCalls = inferenceCalls
  assert.equal(completedCalls, posts.length + 3)
  assert.ok(completedJob.result?.postThemes?.length)
  assert.equal((await runAnalysis('owner-one')).status, 'complete')
  assert.equal(inferenceCalls, completedCalls)

  // An interrupted request is reclaimed immediately when a creator retries after its expiry.
  savedJob = { ...completedJob, status: 'analysing', lease_token: 'expired-request', lease_until: '2020-01-01' }
  failInference = true
  const failedJob = await runAnalysis('owner-one')
  assert.equal(failedJob.status, 'failed')
  assert.ok(failedJob.error)
  assert.equal(failedJob.lease_token, null)
  assert.ok(inferenceCalls > completedCalls)
  const callsAfterFailure = inferenceCalls

  failInference = false
  assert.equal((await runAnalysis('owner-one')).status, 'complete')
  assert.equal(inferenceCalls, callsAfterFailure + posts.length + 3)
})
