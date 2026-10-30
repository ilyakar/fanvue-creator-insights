/* ------------------------------------------------------------
Loads the shared demo content and explicitly editorial preview insights from Supabase.
---------------------------------------------------------------*/

import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { validateAnalysis } from '@/lib/analysis/validation'
import type { DashboardModel } from '@/lib/types'

import { audienceDataProvider, demoCreatorId } from './audience'

// Keeps illustrative preview results separate from private AI analysis jobs.
export const getPreviewModel = async (): Promise<DashboardModel> => {
  const dataset = await audienceDataProvider.getDataset(demoCreatorId)
  const preview = unwrapDatabase(
    await getDatabase().from('audience_preview_results').select('*').eq('creator_id', demoCreatorId).single()
  )

  return {
    dataset,
    result: {
      insights: validateAnalysis({ insights: preview.insights }, dataset),
      analysedAt: preview.analysed_at,
      datasetVersion: dataset.version,
      model: preview.model,
      promptVersion: preview.prompt_version
    },
    account: null,
    isPreview: true
  }
}
