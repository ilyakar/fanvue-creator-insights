/* ------------------------------------------------------------
Sets a clear expectation that private-message analysis is outside the current MVP.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCommentDots, faLock } from '@fortawesome/free-solid-svg-icons'

// Sets a clear expectation that private-message analysis is outside the current MVP.
const MessagesContent = ({ basePath }: { basePath: string }) => (
  <div className="coming-soon">
    <div className="coming-illustration">
      <span />
      <FontAwesomeIcon icon={faCommentDots} />
      <span />
    </div>

    <h1>Message insights</h1>
    <p>Message analysis isn’t available yet.</p>

    <span className="privacy-reassurance">
      <FontAwesomeIcon icon={faLock} /> Your messages aren’t accessed or analysed.
    </span>

    <Link href={basePath} className="button secondary">
      <FontAwesomeIcon icon={faArrowLeft} /> Back to your insights
    </Link>
  </div>
)

export default MessagesContent
