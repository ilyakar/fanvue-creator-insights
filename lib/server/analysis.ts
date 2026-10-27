/* ------------------------------------------------------------
Creates one durable run per owner and analysis input, reusing completed work.
---------------------------------------------------------------*/

import { getDatabase, unwrapDatabase } from './database'
import { getAnalysisCacheKey } from '../analysis/validation'
import { promptVersion } from '../analysis/service'
import { sampleDataProvider } from '../data/provider'
import type { AnalysisJob, DashboardModel, Account } from '../types'

// Creates one durable run per owner and analysis input, reusing completed work.
export const enqueueAnalysis = async (userId: string, retryFailed = false): Promise<AnalysisJob> => {
  const database = getDatabase()
  const dataset = await sampleDataProvider.getDataset()
  const cacheKey = getAnalysisCacheKey(userId, dataset, process.env.OPENAI_MODEL || 'gpt-4.1-mini', promptVersion)
  const existing = unwrapDatabase(
    await database.from('analysis_jobs').select('*').eq('user_id', userId).eq('cache_key', cacheKey).maybeSingle()
  ) as AnalysisJob | null
  if (existing) {
    if (retryFailed && existing.status === 'failed') {
      return unwrapDatabase(
        await database
          .from('analysis_jobs')
          .update({ status: 'queued', error: null, attempts: 0, lease_token: null, lease_until: null })
          .eq('id', existing.id)
          .eq('status', 'failed')
          .select()
          .single()
      ) as AnalysisJob
    }
    return existing
  }
  const inserted = await database
    .from('analysis_jobs')
    .insert({ user_id: userId, cache_key: cacheKey, dataset_version: dataset.version })
    .select()
    .single()
  // Concurrent onboarding requests converge on the same unique cache key.
  if (inserted.error?.code === '23505')
    return unwrapDatabase(
      await database.from('analysis_jobs').select('*').eq('user_id', userId).eq('cache_key', cacheKey).single()
    ) as AnalysisJob
  return unwrapDatabase(inserted) as AnalysisJob
}

// Looks up the current input's saved run without starting work as a side effect of reading.
export const getCurrentAnalysis = async (userId: string): Promise<AnalysisJob | null> => {
  const dataset = await sampleDataProvider.getDataset()
  const cacheKey = getAnalysisCacheKey(userId, dataset, process.env.OPENAI_MODEL || 'gpt-4.1-mini', promptVersion)
  return unwrapDatabase(
    await getDatabase().from('analysis_jobs').select('*').eq('user_id', userId).eq('cache_key', cacheKey).maybeSingle()
  ) as AnalysisJob | null
}

// Loads private results only after ownership has been established by a server session.
export const getDashboardModel = async (account: Account): Promise<DashboardModel> => {
  const dataset = await sampleDataProvider.getDataset()
  const job = await getCurrentAnalysis(account.id)
  return { dataset, result: job?.status === 'complete' ? job.result : null, account, isPreview: false }
}
