/* ------------------------------------------------------------
Lists the source posts available to the authenticated creator.
---------------------------------------------------------------*/

import { requireAccount } from '@/lib/server/session'
import { getDashboardModel } from '@/lib/server/analysis'
import PostsBrowser from '@/app/Components/PostsBrowser/PostsBrowser'

// Lists the source posts available to the authenticated creator.
const PostsPage = async () => {
  const account = await requireAccount()
  const model = await getDashboardModel(account)

  return <PostsBrowser model={model} />
}

export default PostsPage
