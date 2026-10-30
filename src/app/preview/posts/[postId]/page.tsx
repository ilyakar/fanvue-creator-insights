/* ------------------------------------------------------------
Streams the requested post's source context and evidence inside its shared page structure.
---------------------------------------------------------------*/

import { getPreviewModel } from '@/lib/data/preview'
import PostDetails from '@/app/Components/DashboardContent/PostDetails'

// Keeps post navigation visible while resolving the requested post and its insights.
const PostPage = ({ params }: { params: Promise<{ postId: string }> }) => (
  <PostDetails model={getPreviewModel()} params={params} basePath="/preview" />
)

export default PostPage
