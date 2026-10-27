/* ------------------------------------------------------------
Renders the Creator Insights wordmark with the existing asterisk mark.
---------------------------------------------------------------*/

import Link from 'next/link'

// Renders the Creator Insights wordmark with the existing asterisk mark.
const Brand = ({ href = '/', compact = false }: { href?: string; compact?: boolean }) => (
  <Link
    className={['brand', compact && 'compact'].filter(Boolean).join(' ')}
    href={href}
    aria-label="Creator Insights home">
    <span className="wordmark">
      creator<span className="mark">✳</span>
    </span>

    {!compact && <span className="product">insights</span>}
  </Link>
)

export default Brand
