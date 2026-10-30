'use client'

/* ------------------------------------------------------------
Lets creators find a source post and explore feedback scoped to that post.
---------------------------------------------------------------*/

import { use } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faComment, faMagnifyingGlass, faPlay } from '@fortawesome/free-solid-svg-icons'

import { formatDate } from '@/lib/insights'
import type { PostWithCommentCount } from '@/lib/posts'
import type { Post } from '@/lib/types'

import { useFilteredPosts, usePostsFilters } from './PostsFilterProvider'

// Lets creators find a source post and explore feedback scoped to that post.
const PostsBrowser = ({
  postsPromise,
  basePath
}: {
  postsPromise: Promise<PostWithCommentCount[]>
  basePath: string
}) => {
  const { setSearchQuery, setSelectedFormat } = usePostsFilters()
  const sourcePosts = use(postsPromise)
  const posts = useFilteredPosts(sourcePosts)

  // Restores the complete posts list after an empty search.
  const _handleReset = () => {
    setSearchQuery('')
    setSelectedFormat('all')
  }

  return (
    <>
      <div className="posts-grid">
        {posts.map(post => (
          <Link className="post-card" href={`${basePath}/posts/${post.id}`} key={post.id}>
            <div className="thumbnail">
              <img src={post.thumbnail} alt={`Sample imagery for ${post.title}`} loading="lazy" />

              <span className="format-badge">
                {post.format === 'Video' && <FontAwesomeIcon icon={faPlay} />}
                {post.format}
              </span>
            </div>

            <div className="post-copy">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, true)}</time>
              <h2>{post.title}</h2>
              <p>{post.caption}</p>

              <div className="post-meta">
                <span>
                  <FontAwesomeIcon icon={faComment} />
                  {post.commentCount} comments
                </span>

                <span>
                  View insights <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <h2>No posts found.</h2>
          <p>Try a different search or show all your posts.</p>

          <button className="button secondary" onClick={_handleReset}>
            Clear filters
          </button>
        </div>
      )}
    </>
  )
}

// Uses the same filtered posts as the cards when displaying the loaded result count.
export const PostsCount = ({ postsPromise }: { postsPromise: Promise<Post[]> }) => {
  const sourcePosts = use(postsPromise)
  const posts = useFilteredPosts(sourcePosts)

  return (
    <span className="post-count">
      {posts.length} {posts.length === 1 ? 'post' : 'posts'}
    </span>
  )
}

export default PostsBrowser
