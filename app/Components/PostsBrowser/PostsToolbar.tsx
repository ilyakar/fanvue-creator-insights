'use client'

/* ------------------------------------------------------------
Shows usable post filters immediately and adds the result count once data is available.
---------------------------------------------------------------*/

import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { usePostsFilters } from './PostsFilterProvider'

// Reuses the same working search and format controls before and after posts arrive.
const PostsToolbar = ({ postCount }: { postCount?: ReactNode }) => {
  const { searchQuery, selectedFormat, setSearchQuery, setSelectedFormat } = usePostsFilters()

  // Filters source posts as the creator types, including while the posts are loading.
  const _handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)

  // Keeps the chosen content format ready for the arriving posts.
  const _handleFormat = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedFormat(event.target.value)

  return (
    <div className="browser-toolbar">
      <label className="search-field">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <span className="sr-only">Search posts</span>
        <input value={searchQuery} onChange={_handleSearch} placeholder="Find a post…" type="search" />
      </label>

      <div>
        {postCount}

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
  )
}

export default PostsToolbar
