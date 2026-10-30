/* ------------------------------------------------------------
Uses the shared posts view with fictional source records in local development.
---------------------------------------------------------------*/

import { getPreviewModel } from '@/lib/data/preview'
import PostsWorkspace from '@/app/Components/PostsBrowser/PostsWorkspace'

// Renders the shared page structure before waiting for its data sections.
const Page = () => <PostsWorkspace model={getPreviewModel()} />

export default Page
