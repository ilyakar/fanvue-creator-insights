/* ------------------------------------------------------------
Reuses the destination's JSX view while only its data sections show placeholders.
---------------------------------------------------------------*/

import PostsWorkspace from '@/app/Components/PostsBrowser/PostsWorkspace'

// Keeps page copy and controls identical during navigation and after data arrives.
const LoadingPage = () => <PostsWorkspace />

export default LoadingPage
