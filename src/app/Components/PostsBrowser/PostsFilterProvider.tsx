'use client'

/* ------------------------------------------------------------
Keeps post filters intact when loading placeholders are replaced with fetched results.
---------------------------------------------------------------*/

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'

import type { Post } from '@/lib/types'
import { filterPosts } from '@/lib/posts'

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

// Reads the shell's temporary post filters without persisting them to storage.
export const usePostsFilters = () => {
  const filters = useContext(PostsFilterContext)

  if (!filters) {
    throw new Error('Post filters require a PostsFilterProvider.')
  }

  return filters
}

// Applies the same filtering and ordering to the result count and the post cards.
export const useFilteredPosts = <SourcePost extends Post>(posts: SourcePost[]) => {
  const { searchQuery, selectedFormat } = usePostsFilters()

  return filterPosts(posts, searchQuery, selectedFormat)
}

export default PostsFilterProvider
