/* ------------------------------------------------------------
Previews the complete posts browser using fictional source records.
---------------------------------------------------------------*/

import { getPreviewModel } from '@/lib/data/preview'
import PostsBrowser from '@/app/Components/PostsBrowser/PostsBrowser'

// Previews the complete posts browser using fictional source records.
const PreviewPostsPage = async () => <PostsBrowser model={await getPreviewModel()} />

export default PreviewPostsPage
