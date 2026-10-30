/* ------------------------------------------------------------
Loads the shared demo content and explicitly editorial preview insights from Supabase.
---------------------------------------------------------------*/

import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { validateAnalysis } from '@/lib/analysis/validation'

import { getAudienceFeedback, demoCreatorId } from './audience'

// Keeps illustrative preview results separate from private AI analysis jobs.
export const getPreviewAnalysis = async () => {
  const audienceFeedback = await getAudienceFeedback(demoCreatorId)
  const preview = unwrapDatabase(
    await getDatabase().from('audience_preview_results').select('*').eq('creator_id', demoCreatorId).single()
  )

  return {
    audienceFeedback,
    savedAnalysis: {
      insights: validateAnalysis({ insights: preview.insights }, audienceFeedback),
      analysedAt: preview.analysed_at,
      datasetVersion: audienceFeedback.version,
      model: preview.model,
      promptVersion: preview.prompt_version
    }
  }
}
