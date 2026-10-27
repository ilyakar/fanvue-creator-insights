/* ------------------------------------------------------------
Supplies explicitly editorial fixtures for the development-only visual preview.
---------------------------------------------------------------*/

import insights from '@/mock-data/preview-insights.json'
import { sampleDataProvider } from './provider'
import type { DashboardModel, Insight } from '../types'

// Supplies explicitly editorial fixtures for the development-only visual preview.
export const getPreviewModel = async (): Promise<DashboardModel> => ({
  dataset: await sampleDataProvider.getDataset(),
  result: {
    insights: insights as Insight[],
    analysedAt: '2026-10-27T08:00:00Z',
    datasetVersion: 'sample-2026-10-v1',
    model: 'Editorial design fixture — not AI analysis',
    promptVersion: 'preview-only'
  },
  account: null,
  isPreview: true
})
