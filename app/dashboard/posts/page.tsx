/* ------------------------------------------------------------
Lists the source posts available to the authenticated creator.
---------------------------------------------------------------*/

import { requireAccount } from '@/lib/server/session'
import { getDashboardModel } from '@/lib/server/analysis'
import PostsBrowser from '@/app/Components/PostsBrowser/PostsBrowser'

// Lists the source posts available to the authenticated creator.
const PostsPage = async () => <PostsBrowser model={await getDashboardModel(await requireAccount())} />

export default PostsPage
