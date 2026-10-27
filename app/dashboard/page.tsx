/* ------------------------------------------------------------
Presents completed aggregate insights or resumes genuine analysis progress.
---------------------------------------------------------------*/

import { redirect } from 'next/navigation'
import { requireAccount } from '@/lib/server/session'
import { getDashboardModel } from '@/lib/server/analysis'
import DashboardContent from '../Components/DashboardContent/DashboardContent'

// Presents completed aggregate insights or resumes genuine analysis progress.
const OverviewPage = async () => {
  const model = await getDashboardModel(await requireAccount())
  if (!model.result) redirect('/analysis')
  return <DashboardContent model={model} />
}

export default OverviewPage
