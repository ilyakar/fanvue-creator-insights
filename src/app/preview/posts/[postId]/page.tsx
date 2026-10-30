/* ------------------------------------------------------------
Validates the requested source post before showing its context and scoped audience insights.
---------------------------------------------------------------*/

import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getPreviewAnalysis } from '@/lib/data/preview'
import PostView from '@/app/dashboard/posts/[postId]/PostView'
import PostContext from '@/app/dashboard/posts/[postId]/PostContext'
import AudienceInsights from '@/app/Components/AudienceInsights/AudienceInsights'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Keeps navigation visible while resolving the post and its saved feedback.
const PreviewPostPage = ({ params }: { params: Promise<{ postId: string }> }) => (
  <PostView basePath="/preview">
    <Suspense fallback={<ContentSkeleton variant="post" />}>
      <PostInsights params={params} />
    </Suspense>
  </PostView>
)

// Checks post existence before applying the analysis prerequisite.
const PostInsights = async ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params
  const { audienceFeedback, savedAnalysis } = await getPreviewAnalysis()
  const post = audienceFeedback.posts.find(post => post.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <>
      <PostContext post={post} />

      <AudienceInsights
        audienceFeedback={audienceFeedback}
        savedAnalysis={savedAnalysis}
        scopedPostId={postId}
        isPreview={true}
      />
    </>
  )
}

export default PreviewPostPage
