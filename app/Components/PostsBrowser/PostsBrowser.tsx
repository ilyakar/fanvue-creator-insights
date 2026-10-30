'use client'

/* ------------------------------------------------------------
Lets creators find a source post and explore feedback scoped to that post.
---------------------------------------------------------------*/

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronDown, faComment, faMagnifyingGlass, faPlay } from '@fortawesome/free-solid-svg-icons'

import { formatDate } from '@/lib/insights'
import type { DashboardModel } from '@/lib/types'

// Lets creators find a source post and explore feedback scoped to that post.
const PostsBrowser = ({ model }: { model: DashboardModel }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('all')

  const basePath = model.isPreview ? '/preview' : '/dashboard'

  const posts = model.dataset.posts
    .filter(
      post =>
        `${post.title} ${post.caption}`.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedFormat === 'all' || post.format === selectedFormat)
    )
    .sort((firstPost, secondPost) => secondPost.publishedAt.localeCompare(firstPost.publishedAt))

  // Filters source posts as the creator types.
  const _handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)

  // Narrows the browser to a chosen content format.
  const _handleFormat = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedFormat(event.target.value)

  // Restores the complete posts list after an empty search.
  const _handleReset = () => {
    setSearchQuery('')
    setSelectedFormat('all')
  }

  return (
    <div className="posts-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ONE POST. MANY PERSPECTIVES.</span>
          <h1>Every post starts a conversation.</h1>
          <p>Take a closer look at the moments your fans are responding to.</p>
        </div>
      </div>

      <div className="browser-toolbar">
        <label className="search-field">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <span className="sr-only">Search posts</span>
          <input value={searchQuery} onChange={_handleSearch} placeholder="Find a post…" type="search" />
        </label>

        <div>
          <span className="post-count">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>

          <label className="select-field">
            <span className="sr-only">Filter post format</span>

            <select value={selectedFormat} onChange={_handleFormat}>
              <option value="all">All formats</option>
              <option>Photo</option>
              <option>Video</option>
              <option>Live</option>
            </select>

            <FontAwesomeIcon icon={faChevronDown} />
          </label>
        </div>
      </div>

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
                  {model.dataset.comments.filter(comment => comment.postId === post.id).length} comments
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
    </div>
  )
}

export default PostsBrowser
