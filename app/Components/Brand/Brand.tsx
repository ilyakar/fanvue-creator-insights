/* ------------------------------------------------------------
Renders a compact Fanvue wordmark with a distinct insights product label.
---------------------------------------------------------------*/

import Link from 'next/link'

// Renders a compact Fanvue wordmark with a distinct insights product label.
const Brand = ({ href = '/', compact = false }: { href?: string; compact?: boolean }) => (
  <Link
    className={['brand', compact && 'compact'].filter(Boolean).join(' ')}
    href={href}
    aria-label="Fanvue Insights home"
  >
    <span className="wordmark">
      fanvue<span className="mark">✳</span>
    </span>

    {!compact && <span className="product">insights</span>}
  </Link>
)

export default Brand
