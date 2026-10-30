/* ------------------------------------------------------------
Validates the requested source post before showing its context and scoped audience insights.
---------------------------------------------------------------*/

import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'

import { requireAccount } from '@/lib/server/session'
import { getAudienceFeedback } from '@/lib/data/audience'
import { getCurrentAnalysis } from '@/lib/server/saved-analysis'
import PostView from '@/app/dashboard/posts/[postId]/PostView'
import PostContext from '@/app/dashboard/posts/[postId]/PostContext'
import AudienceInsights from '@/app/Components/AudienceInsights/AudienceInsights'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

// Keeps navigation visible while resolving the post and its saved feedback.
const PostDetailsPage = ({ params }: { params: Promise<{ postId: string }> }) => (
  <PostView basePath="/dashboard">
    <Suspense fallback={<ContentSkeleton variant="post" />}>
      <PostInsights params={params} />
    </Suspense>
  </PostView>
)

// Checks post existence before applying the analysis prerequisite.
const PostInsights = async ({ params }: { params: Promise<{ postId: string }> }) => {
  const account = await requireAccount()
  const [audienceFeedback, { postId }] = await Promise.all([getAudienceFeedback(account.audience_creator_id), params])
  const analysisJob = await getCurrentAnalysis(account.id, audienceFeedback)
  const savedAnalysis = analysisJob?.status === 'complete' ? analysisJob.result : null
  const post = audienceFeedback.posts.find(post => post.id === postId)

  if (!post) {
    notFound()
  }

  // Unknown posts retain their not-found response even when analysis is unavailable.
  if (!savedAnalysis) {
    redirect('/analysis')
  }

  return (
    <>
      <PostContext post={post} />

      <AudienceInsights
        audienceFeedback={audienceFeedback}
        savedAnalysis={savedAnalysis}
        scopedPostId={postId}
        isPreview={false}
      />
    </>
  )
}

export default PostDetailsPage
