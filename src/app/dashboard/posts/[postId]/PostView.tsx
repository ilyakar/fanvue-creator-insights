/* ------------------------------------------------------------
Keeps navigation available while the requested post context and insights load.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

// Shares navigation across real, preview and pending post screens.
const PostView = ({ basePath, children }: { basePath: string; children: React.ReactNode }) => (
  <div className="dashboard-content">
    <Link className="back-link" href={`${basePath}/posts`}>
      <FontAwesomeIcon icon={faArrowLeft} /> All posts
    </Link>

    {children}
  </div>
)

export default PostView
