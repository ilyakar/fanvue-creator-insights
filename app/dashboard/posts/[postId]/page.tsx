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
  const model = await getDashboardModel(await requireAccount())
  if (!model.dataset.posts.some((post) => post.id === postId)) notFound()
  if (!model.result) redirect('/analysis')
  return <DashboardContent model={model} postId={postId} />
}

export default PostPage
