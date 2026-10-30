/* ------------------------------------------------------------
Runs requested audience analysis immediately and saves owner-scoped progress and results.
---------------------------------------------------------------*/

import { randomUUID } from 'node:crypto'

import { getAnalysisCacheKey } from '@/lib/analysis/cache'
import { analyseAudience, promptVersion } from '@/lib/analysis/service'
import { getAudienceFeedback } from '@/lib/data/audience'
import type { AnalysisJob } from '@/lib/types'

import { getDatabase, unwrapDatabase } from './database'

// Starts inference inside the current request while reusing completed or already-running analysis.
export const runAnalysis = async (userId: string): Promise<AnalysisJob> => {
  const database = getDatabase()
  const account = unwrapDatabase(
    await database.from('app_users').select('audience_creator_id').eq('id', userId).single()
  )

  if (!account) {
    throw new Error('The connected account could not be found.')
  }

  const dataset = await getAudienceFeedback(account.audience_creator_id)
  const cacheKey = getAnalysisCacheKey(userId, dataset, process.env.OPENAI_MODEL || 'gpt-4.1-mini', promptVersion)
  const existing = unwrapDatabase(
    await database.from('analysis_jobs').select('*').eq('user_id', userId).eq('cache_key', cacheKey).maybeSingle()
  ) as AnalysisJob | null
  const isRunning = existing && ['analysing', 'validating'].includes(existing.status)
  const hasActiveRequest = isRunning && existing.lease_until && Date.parse(existing.lease_until) > Date.now()

  if (existing?.status === 'complete' || hasActiveRequest) {
    return existing!
  }

  const requestToken = randomUUID()
  const runningState = {
    status: 'analysing',
    error: null,
    result: null,
    completed_at: null,
    attempts: (existing?.attempts || 0) + 1,
    lease_token: requestToken,
    // Outlast the route's five-minute limit so another request cannot duplicate active inference.
    lease_until: new Date(Date.now() + 360000).toISOString()
  }

  let job: AnalysisJob

  if (existing) {
    let claim = database.from('analysis_jobs').update(runningState).eq('id', existing.id).eq('user_id', userId)

    // Compare the previous request token so simultaneous retries cannot both start inference.
    if (existing.lease_token) {
      claim = claim.eq('lease_token', existing.lease_token)
    } else {
      claim = claim.is('lease_token', null)
    }

    const claimed = unwrapDatabase(
      await claim.eq('status', existing.status).select().maybeSingle()
    ) as AnalysisJob | null

    if (!claimed) {
      return unwrapDatabase(
        await database.from('analysis_jobs').select('*').eq('id', existing.id).eq('user_id', userId).single()
      ) as AnalysisJob
    }

    job = claimed
  } else {
    const inserted = await database
      .from('analysis_jobs')
      .insert({
        ...runningState,
        user_id: userId,
        audience_creator_id: account.audience_creator_id,
        cache_key: cacheKey,
        dataset_version: dataset.version
      })
      .select()
      .single()

    // The unique cache key converges simultaneous starts on the same saved analysis.
    if (inserted.error?.code === '23505') {
      return unwrapDatabase(
        await database.from('analysis_jobs').select('*').eq('user_id', userId).eq('cache_key', cacheKey).single()
      ) as AnalysisJob
    }

    job = unwrapDatabase(inserted) as AnalysisJob
  }

  return analyseAudience(dataset, async () => {
    unwrapDatabase(
      await database
        .from('analysis_jobs')
        .update({ status: 'validating' })
        .eq('id', job.id)
        .eq('user_id', userId)
        .eq('lease_token', requestToken)
    )
  })
    .then(async result => {
      return unwrapDatabase(
        await database
          .from('analysis_jobs')
          .update({
            status: 'complete',
            result,
            completed_at: new Date().toISOString(),
            lease_token: null,
            lease_until: null
          })
          .eq('id', job.id)
          .eq('user_id', userId)
          .eq('lease_token', requestToken)
          .select()
          .single()
      ) as AnalysisJob
    })
    .catch(async () => {
      return unwrapDatabase(
        await database
          .from('analysis_jobs')
          .update({
            status: 'failed',
            error: 'We couldn’t finish your analysis. Please try again.',
            lease_token: null,
            lease_until: null
          })
          .eq('id', job.id)
          .eq('user_id', userId)
          .eq('lease_token', requestToken)
          .select()
          .single()
      ) as AnalysisJob
    })
}
