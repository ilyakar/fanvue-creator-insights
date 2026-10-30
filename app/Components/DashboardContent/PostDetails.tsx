/* ------------------------------------------------------------
Keeps post navigation visible while its title, source context and insights are fetched.
---------------------------------------------------------------*/

import { Suspense } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import type { DashboardModel } from '@/lib/types'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

import DashboardContent from './DashboardContent'

// Shares the post page structure between its ready page and navigation fallback.
const PostDetails = ({
  model,
  params,
  basePath
}: {
  model?: Promise<DashboardModel>
  params?: Promise<{ postId: string }>
  basePath: string
}) => (
  <div className="dashboard-content">
    <Link className="back-link" href={`${basePath}/posts`}>
      <FontAwesomeIcon icon={faArrowLeft} /> All posts
    </Link>

    <Suspense fallback={<ContentSkeleton variant="post" />}>
      {model && params ? <PostResult model={model} params={params} /> : <ContentSkeleton variant="post" />}
    </Suspense>
  </div>
)

// Validates the requested post before replacing the data placeholders with its content.
const PostResult = async ({
  model,
  params
}: {
  model: Promise<DashboardModel>
  params: Promise<{ postId: string }>
}) => {
  const [resolvedModel, { postId }] = await Promise.all([model, params])
  const postExists = resolvedModel.dataset.posts.some(post => post.id === postId)

  if (!postExists) {
    notFound()
  }

  // Unknown posts keep their not-found response even if analysis has not finished.
  if (!resolvedModel.isPreview && !resolvedModel.result) {
    redirect('/analysis')
  }

  return <DashboardContent model={resolvedModel} postId={postId} />
}

export default PostDetails
