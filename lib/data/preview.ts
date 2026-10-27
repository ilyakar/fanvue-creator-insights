/* ------------------------------------------------------------
Supplies explicitly editorial fixtures for the development-only visual preview.
---------------------------------------------------------------*/

import insights from '@/mock-data/preview-insights.json'
import type { DashboardModel, Insight } from '@/lib/types'

import { sampleDataProvider } from './provider'

// Supplies explicitly editorial fixtures for the development-only visual preview.
export const getPreviewModel = async (): Promise<DashboardModel> => ({
  dataset: await sampleDataProvider.getDataset(),
  result: {
    insights: insights as Insight[],
    analysedAt: '2026-10-27T08:00:00Z',
    datasetVersion: 'sample-2026-10-v3',
    model: 'Editorial design fixture. No AI analysis.',
    promptVersion: 'preview-only'
  },
  account: null,
  isPreview: true
})
