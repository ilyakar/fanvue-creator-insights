'use client'

/* ------------------------------------------------------------
Keeps post filters intact when loading placeholders are replaced with fetched results.
---------------------------------------------------------------*/

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'

import type { Post } from '@/lib/types'

interface PostsFilters {
  searchQuery: string
  selectedFormat: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  setSelectedFormat: Dispatch<SetStateAction<string>>
}

const PostsFilterContext = createContext<PostsFilters | null>(null)

// Shares temporary search and format choices across the loading and ready toolbar.
const PostsFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('all')

  return (
    <PostsFilterContext.Provider value={{ searchQuery, selectedFormat, setSearchQuery, setSelectedFormat }}>
      {children}
    </PostsFilterContext.Provider>
  )
}

// Reads the workspace's temporary post filters without persisting them to storage.
export const usePostsFilters = () => {
  const filters = useContext(PostsFilterContext)

  if (!filters) {
    throw new Error('Post filters require a PostsFilterProvider.')
  }

  return filters
}

// Applies the same filtering and ordering to the result count and the post cards.
export const useFilteredPosts = (posts: Post[]) => {
  const { searchQuery, selectedFormat } = usePostsFilters()

  return posts
    .filter(
      post =>
        `${post.title} ${post.caption}`.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedFormat === 'all' || post.format === selectedFormat)
    )
    .sort((firstPost, secondPost) => secondPost.publishedAt.localeCompare(firstPost.publishedAt))
}

export default PostsFilterProvider
