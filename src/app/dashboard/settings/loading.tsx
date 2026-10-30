/* ------------------------------------------------------------
Keeps settings copy and account actions visible with an explicit connection status.
---------------------------------------------------------------*/

import SettingsView from '@/app/dashboard/settings/SettingsView'
import FanvueConnectionDetails from '@/app/Components/FanvueConnectionDetails/FanvueConnectionDetails'

// Uses the shared settings composition with pending connection details.
const SettingsLoading = () => (
  <SettingsView isPreview={false} connectionDetails={<FanvueConnectionDetails status="checking" />} />
)

export default SettingsLoading
