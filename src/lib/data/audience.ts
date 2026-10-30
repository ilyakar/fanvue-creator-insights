/* ------------------------------------------------------------
Reads and validates a creator-scoped audience snapshot from private storage.
---------------------------------------------------------------*/

import { getDatabase, unwrapDatabase } from '@/lib/server/database'

import { validateDataset } from './validation'

export const demoCreatorId = '00000000-0000-4000-8000-000000000001'

// Reads one atomic snapshot so posts, comments and fans share the same version.
export const getAudienceFeedback = async (creatorId: string) => {
  const audienceFeedback = unwrapDatabase(
    await getDatabase().rpc('get_audience_dataset', { creator_identifier: creatorId })
  )

  return validateDataset(audienceFeedback)
}
