/* ------------------------------------------------------------
Keeps the posts heading and working filters visible while source records load.
---------------------------------------------------------------*/

import PostsView from '@/app/dashboard/posts/PostsView'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Uses the same filter controls during navigation and streaming.
const PostsLoading = () => (
  <PostsView postCount={null}>
    <ContentSkeleton variant="posts" />
  </PostsView>
)

export default PostsLoading
