/* ------------------------------------------------------------
Shares the posts heading and persistent controls with explicit count and results slots.
---------------------------------------------------------------*/

import PostsToolbar from '@/app/Components/PostsBrowser/PostsToolbar'

// Defines the posts interface once while its count and cards load from the same audience feedback.
const PostsView = ({ postCount, children }: { postCount: React.ReactNode; children: React.ReactNode }) => (
  <div className="posts-page">
    <div className="page-heading">
      <div className="heading-content">
        <div className="title-row">
          <h1>Posts</h1>

          <span className="sample-pill">
            <span />
            Sample data
          </span>
        </div>

        <p>Choose a post to view its insights and audience feedback.</p>
      </div>
    </div>

    <PostsToolbar postCount={postCount} />
    {children}
  </div>
)

export default PostsView
