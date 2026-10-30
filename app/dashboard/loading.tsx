/* ------------------------------------------------------------
Reuses the destination's JSX view while only its data sections show placeholders.
---------------------------------------------------------------*/

import Overview from '@/app/Components/Overview/Overview'

// Keeps page copy and controls identical during navigation and after data arrives.
const LoadingPage = () => <Overview />

export default LoadingPage
