/* ------------------------------------------------------------
Composes reusable placeholder shapes for insight sections and post cards.
---------------------------------------------------------------*/

import Skeleton from './Skeleton'

// Reserves only the data-dependent section while its surrounding page stays visible.
const ContentSkeleton = ({ variant = 'insights' }: { variant?: 'insights' | 'posts' | 'post' }) => (
  <div className={`content-skeleton ${variant}`} role="status" aria-label="Loading content">
    <div aria-hidden="true">
      {variant === 'post' && (
        <div className="post-placeholder">
          <Skeleton className="title" />
          <Skeleton className="line" />
          <Skeleton className="image" />
        </div>
      )}

      {variant !== 'posts' && (
        <div className="metrics">
          {Array.from({ length: 4 }, (_, position) => (
            <div className="metric-placeholder" key={position}>
              <Skeleton className="line" />
              <Skeleton className="value" />
              <Skeleton className="line short" />
            </div>
          ))}
        </div>
      )}

      <div className="panels">
        {Array.from({ length: variant === 'posts' ? 6 : 3 }, (_, position) => (
          <div className="panel" key={position}>
            {variant === 'posts' && <Skeleton className="thumbnail" />}

            <div className="copy">
              <Skeleton className="line heading" />
              <Skeleton className="line" />
              <Skeleton className="line" />
              <Skeleton className="line short" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default ContentSkeleton
