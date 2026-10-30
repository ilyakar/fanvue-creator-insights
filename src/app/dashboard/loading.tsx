/* ------------------------------------------------------------
Keeps the overview heading visible while only its data sections show placeholders.
---------------------------------------------------------------*/

import Skeleton from '@/app/Components/Skeleton/Skeleton'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'

import DashboardView from './DashboardView'

// Uses explicit pending sections without duplicating overview copy.
const DashboardLoading = () => (
  <DashboardView dateRange={<Skeleton className="date-placeholder" />}>
    <ContentSkeleton />
  </DashboardView>
)

export default DashboardLoading
