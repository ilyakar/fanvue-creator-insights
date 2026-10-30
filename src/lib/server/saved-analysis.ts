/* ------------------------------------------------------------
Reads the saved analysis matching an owner and an already-resolved audience snapshot.
---------------------------------------------------------------*/

import { getAnalysisCacheKey } from '@/lib/analysis/cache'
import { promptVersion } from '@/lib/analysis/service'
import type { AnalysisJob, Dataset } from '@/lib/types'

import { getDatabase, unwrapDatabase } from './database'

// Looks up the current input's saved run without starting work as a side effect of reading.
export const getCurrentAnalysis = async (userId: string, audienceFeedback: Dataset): Promise<AnalysisJob | null> => {
  const cacheKey = getAnalysisCacheKey(
    userId,
    audienceFeedback,
    process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    promptVersion
  )

  return unwrapDatabase(
    await getDatabase().from('analysis_jobs').select('*').eq('user_id', userId).eq('cache_key', cacheKey).maybeSingle()
  ) as AnalysisJob | null
}
