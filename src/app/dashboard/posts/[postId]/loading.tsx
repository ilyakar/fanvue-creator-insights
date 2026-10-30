/* ------------------------------------------------------------
Keeps post navigation visible while source context and analysis are pending.
---------------------------------------------------------------*/

import PostView from '@/app/dashboard/posts/[postId]/PostView'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Renders only the pending post sections beneath the persistent back link.
const PostLoading = () => (
  <PostView basePath="/dashboard">
    <ContentSkeleton variant="post" />
  </PostView>
)

export default PostLoading
