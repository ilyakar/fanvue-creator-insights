/* ------------------------------------------------------------
Shows the overview immediately and streams its authenticated insight sections.
---------------------------------------------------------------*/

import { getWorkspaceModel } from '@/lib/server/workspace'
import Overview from '@/app/Components/Overview/Overview'

// Renders the shared page structure before waiting for its data sections.
const Page = () => <Overview model={getWorkspaceModel({ requiresAnalysis: true })} />

export default Page
