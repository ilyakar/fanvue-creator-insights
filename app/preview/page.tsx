/* ------------------------------------------------------------
Shows clearly labelled editorial themes for local interface review.
---------------------------------------------------------------*/

import { getPreviewModel } from '@/lib/data/preview'
import DashboardContent from '@/app/Components/DashboardContent/DashboardContent'

// Shows clearly labelled editorial themes for local interface review.
const PreviewPage = async () => <DashboardContent model={await getPreviewModel()} />

export default PreviewPage
