/* ------------------------------------------------------------
Loads creator-scoped audience snapshots through the private server connection.
---------------------------------------------------------------*/

import { getDatabase, unwrapDatabase } from '@/lib/server/database'

import { validateDataset, type AudienceDataProvider } from './provider'

export const demoCreatorId = '00000000-0000-4000-8000-000000000001'

// Reads an atomic creator snapshot and checks its evidence relationships.
export const audienceDataProvider: AudienceDataProvider = {
  getDataset: async (creatorId: string) => {
    const snapshot = unwrapDatabase(await getDatabase().rpc('get_audience_dataset', { creator_identifier: creatorId }))

    return validateDataset(snapshot)
  }
}
