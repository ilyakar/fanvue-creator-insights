/* ------------------------------------------------------------
Keeps post filters usable while one audience snapshot streams into the count and cards.
---------------------------------------------------------------*/

import { Suspense } from 'react'

import { getPostsWithCommentCounts } from '@/lib/posts'
import { requireAccount } from '@/lib/server/session'
import { getAudienceFeedback } from '@/lib/data/audience'
import PostsView from '@/app/dashboard/posts/PostsView'
import PostsBrowser, { PostsCount } from '@/app/Components/PostsBrowser/PostsBrowser'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Loads source feedback without requiring saved analysis to browse posts.
const PostsPage = () => {
  const audienceFeedbackPromise = requireAccount().then(account => getAudienceFeedback(account.audience_creator_id))

  const postsPromise = audienceFeedbackPromise.then(getPostsWithCommentCounts)

  return (
    <PostsView
      postCount={
        <Suspense fallback={null}>
          <PostsCount postsPromise={postsPromise} />
        </Suspense>
      }>
      <Suspense fallback={<ContentSkeleton variant="posts" />}>
        <PostsBrowser postsPromise={postsPromise} basePath="/dashboard" />
      </Suspense>
    </PostsView>
  )
}

export default PostsPage
