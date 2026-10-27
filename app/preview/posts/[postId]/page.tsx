/* ------------------------------------------------------------
Previews post-specific evidence while rejecting unknown source identifiers.
---------------------------------------------------------------*/

import { notFound } from 'next/navigation'
import { getPreviewModel } from '@/lib/data/preview'
import DashboardContent from '@/app/Components/DashboardContent/DashboardContent'

// Previews post-specific evidence while rejecting unknown source identifiers.
const PreviewPostPage = async ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params
  const model = await getPreviewModel()
  if (!model.dataset.posts.some((post) => post.id === postId)) notFound()
  return <DashboardContent model={model} postId={postId} />
}

export default PreviewPostPage
