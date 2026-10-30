/* ------------------------------------------------------------
Loads one authenticated workspace model for the data sections of a page.
---------------------------------------------------------------*/

import { redirect } from 'next/navigation'

import { requireAccount } from './session'
import { getDashboardModel } from './analysis'

// Shares one request's model between streamed sections while preserving account checks.
export const getWorkspaceModel = async ({ requiresAnalysis = false }: { requiresAnalysis?: boolean } = {}) => {
  const account = await requireAccount()
  const model = await getDashboardModel(account)

  if (requiresAnalysis && !model.result) {
    redirect('/analysis')
  }

  return model
}
