/* ------------------------------------------------------------
Keeps settings copy and account actions visible with an explicit connection status.
---------------------------------------------------------------*/

import SettingsView from '@/app/dashboard/settings/SettingsView'
import FanvueConnectionDetails from '@/app/Components/FanvueConnectionDetails/FanvueConnectionDetails'

// Uses the shared settings composition with honest preview details.
const PreviewSettingsPage = () => (
  <SettingsView isPreview={true} connectionDetails={<FanvueConnectionDetails status="preview" />} />
)

export default PreviewSettingsPage
