/* ------------------------------------------------------------
Scopes reusable insights and source evidence to one existing post.
---------------------------------------------------------------*/

import { notFound, redirect } from 'next/navigation'
import { requireAccount } from '@/lib/server/session'
import { getDashboardModel } from '@/lib/server/analysis'
import DashboardContent from '@/app/Components/DashboardContent/DashboardContent'

// Scopes reusable insights and source evidence to one existing post.
const PostPage = async ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params
  const account = await requireAccount()
  const model = await getDashboardModel(account)

  const postExists = model.dataset.posts.some((post) => post.id === postId)

  // Unknown source posts should resolve to the normal not-found experience.
  if (!postExists) {
    notFound()
  }

  // The post cannot display insights until its analysis has finished.
  if (!model.result) {
    redirect('/analysis')
  }

  return <DashboardContent model={model} postId={postId} />
}

export default PostPage
