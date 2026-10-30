/* ------------------------------------------------------------
Reuses the destination's JSX view while only its data sections show placeholders.
---------------------------------------------------------------*/

import MessagesContent from '@/app/Components/MessagesContent/MessagesContent'

// Keeps page copy and controls identical during navigation and after data arrives.
const LoadingPage = () => <MessagesContent basePath="/dashboard" />

export default LoadingPage
