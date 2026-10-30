/* ------------------------------------------------------------
Hashes the complete analysis input and ownership for durable cache reuse.
---------------------------------------------------------------*/

import { createHash } from 'node:crypto'

import type { Dataset } from '@/lib/types'

// Includes every input that changes the meaning or ownership of cached analysis.
export const getAnalysisCacheKey = (userId: string, dataset: Dataset, model: string, promptVersion: string) =>
  createHash('sha256')
    .update(JSON.stringify([userId, dataset, model, promptVersion]))
    .digest('hex')
