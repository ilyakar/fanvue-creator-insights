/* ------------------------------------------------------------
Shares the posts heading and persistent controls with explicit count and results slots.
---------------------------------------------------------------*/

import PostsToolbar from '@/app/Components/PostsBrowser/PostsToolbar'

// Defines the posts interface once while its count and cards load from the same audience feedback.
const PostsView = ({ postCount, children }: { postCount: React.ReactNode; children: React.ReactNode }) => (
  <div className="posts-page">
    <div className="page-heading">
      <div>
        <span className="eyebrow">ONE POST. MANY PERSPECTIVES.</span>
        <h1>Every post starts a conversation.</h1>
        <p>Take a closer look at the moments your fans are responding to.</p>
      </div>
    </div>

    <PostsToolbar postCount={postCount} />
    {children}
  </div>
)

export default PostsView
