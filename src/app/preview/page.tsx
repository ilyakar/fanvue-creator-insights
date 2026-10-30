/* ------------------------------------------------------------
Uses the shared overview view with clearly labelled local preview insights.
---------------------------------------------------------------*/

import { getPreviewModel } from '@/lib/data/preview'
import Overview from '@/app/Components/Overview/Overview'

// Renders the shared page structure before waiting for its data sections.
const Page = () => <Overview model={getPreviewModel()} />

export default Page
