/* ------------------------------------------------------------
Streams the requested post's source context and evidence inside its shared page structure.
---------------------------------------------------------------*/

import { getWorkspaceModel } from '@/lib/server/workspace'
import PostDetails from '@/app/Components/DashboardContent/PostDetails'

// Keeps post navigation visible while resolving the requested post and its insights.
const PostPage = ({ params }: { params: Promise<{ postId: string }> }) => (
  <PostDetails model={getWorkspaceModel()} params={params} basePath="/dashboard" />
)

export default PostPage
