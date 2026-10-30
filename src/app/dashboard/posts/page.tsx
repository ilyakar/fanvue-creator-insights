/* ------------------------------------------------------------
Shows post search controls immediately and streams the source post results.
---------------------------------------------------------------*/

import { getWorkspaceModel } from '@/lib/server/workspace'
import PostsWorkspace from '@/app/Components/PostsBrowser/PostsWorkspace'

// Renders the shared page structure before waiting for its data sections.
const Page = () => <PostsWorkspace model={getWorkspaceModel()} />

export default Page
