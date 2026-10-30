/* ------------------------------------------------------------
Reuses the destination's JSX view while only its data sections show placeholders.
---------------------------------------------------------------*/

import SettingsContent from '@/app/Components/SettingsContent/SettingsContent'

// Keeps page copy and controls identical during navigation and after data arrives.
const LoadingPage = () => <SettingsContent isPreview />

export default LoadingPage
