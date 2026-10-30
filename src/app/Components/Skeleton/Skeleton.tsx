/* ------------------------------------------------------------
Provides one animated placeholder shape for content that has not arrived yet.
---------------------------------------------------------------*/

// Reserves visual space without exposing decorative shapes to assistive technology.
const Skeleton = ({ className = '' }: { className?: string }) => (
  <span className={['skeleton', className].filter(Boolean).join(' ')} aria-hidden="true" />
)

export default Skeleton
