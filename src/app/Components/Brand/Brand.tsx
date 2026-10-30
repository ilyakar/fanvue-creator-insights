/* ------------------------------------------------------------
Keeps the full Creator Insights name together beside its solid asterisk mark.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'

// Shares one complete wordmark across navigation, footers and static product previews.
const Brand = ({ href = '/', isStatic = false }: { href?: string; isStatic?: boolean }) => {
  const wordmark = (
    <>
      <FontAwesomeIcon className="mark" icon={faAsterisk} />
      <span className="wordmark">Creator Insights</span>
    </>
  )

  if (isStatic) {
    return <span className="brand">{wordmark}</span>
  }

  return (
    <Link className="brand" href={href} aria-label="Creator Insights home">
      {wordmark}
    </Link>
  )
}

export default Brand
