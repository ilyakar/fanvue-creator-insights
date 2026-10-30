/* ------------------------------------------------------------
Renders the posts heading and working controls before streaming the count and post cards.
---------------------------------------------------------------*/

import { Suspense } from 'react'

import type { DashboardModel } from '@/lib/types'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

import PostsBrowser, { PostsCount } from './PostsBrowser'
import PostsToolbar from './PostsToolbar'

// Defines the posts interface once while its count and cards wait for the same model.
const PostsWorkspace = ({ model }: { model?: Promise<DashboardModel> }) => (
  <div className="posts-page">
    <div className="page-heading">
      <div>
        <span className="eyebrow">ONE POST. MANY PERSPECTIVES.</span>
        <h1>Every post starts a conversation.</h1>
        <p>Take a closer look at the moments your fans are responding to.</p>
      </div>
    </div>

    <PostsToolbar
      postCount={
        model && (
          <Suspense fallback={null}>
            <PostCountResult model={model} />
          </Suspense>
        )
      }
    />

    <Suspense fallback={<ContentSkeleton variant="posts" />}>
      {model ? <PostResults model={model} /> : <ContentSkeleton variant="posts" />}
    </Suspense>
  </div>
)

// Adds the filtered result count only after the posts have been fetched.
const PostCountResult = async ({ model }: { model: Promise<DashboardModel> }) => <PostsCount model={await model} />

// Populates the interactive post cards without replacing the search or format controls.
const PostResults = async ({ model }: { model: Promise<DashboardModel> }) => <PostsBrowser model={await model} />

export default PostsWorkspace
