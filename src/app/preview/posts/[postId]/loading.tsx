/* ------------------------------------------------------------
Reuses the destination's JSX view while only its data sections show placeholders.
---------------------------------------------------------------*/

import PostDetails from '@/app/Components/DashboardContent/PostDetails'

// Keeps page copy and controls identical during navigation and after data arrives.
const LoadingPage = () => <PostDetails basePath="/preview" />

export default LoadingPage
