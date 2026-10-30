'use client'

/* ------------------------------------------------------------
Shows the source post heading, imagery and caption with an honest sample-link action.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import type { Post } from '@/lib/types'
import { formatDate } from '@/lib/insights'
import { useAlert } from '@/app/AlertProvider'

// Owns the source-post presentation and its sample-link explanation.
const PostContext = ({ post }: { post: Post }) => {
  const showAlert = useAlert()

  // Explains why fictional source records cannot open real Fanvue content.
  const _handleSampleLink = () =>
    showAlert('You’re viewing sample data', 'Links to Fanvue aren’t available in this prototype.')

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A CLOSER LOOK</span>
          <h1>{post.title}</h1>
          <p>Here’s what your fans are saying about this post.</p>
        </div>
      </div>

      <div className="post-context">
        <img src={post.thumbnail} alt={`Sample imagery for ${post.title}`} />

        <div>
          <span className="post-format">
            {post.format} <span>·</span> {formatDate(post.publishedAt, true)}
          </span>

          <p>{post.caption}</p>

          <button className="text-button" onClick={_handleSampleLink}>
            View on Fanvue <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </button>
        </div>
      </div>
    </>
  )
}

export default PostContext
