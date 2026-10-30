/* ------------------------------------------------------------
Verifies post headings and controls stream before one shared request fills both result positions.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'
import { PassThrough } from 'node:stream'
import { createElement, Suspense } from 'react'
import { jsx } from 'react/jsx-runtime'
import { renderToPipeableStream } from 'react-dom/server'

import type { PostWithCommentCount } from '@/lib/posts'
import PostsView from '@/app/dashboard/posts/PostsView'
import PostsBrowser, { PostsCount } from '@/app/Components/PostsBrowser/PostsBrowser'
import PostsFilterProvider from '@/app/Components/PostsBrowser/PostsFilterProvider'
import ContentSkeleton from '@/app/Components/Skeleton/ContentSkeleton'
import posts from '@/mock-data/posts.json'

// Exercises the actual pending and resolved composition rather than a duplicated loading fixture.
test('posts stream controls before results and consume one shared post request', async () => {
  let resolvePosts: (sourcePosts: PostWithCommentCount[]) => void = () => undefined
  const postsPromise = new Promise<PostWithCommentCount[]>(resolve => {
    resolvePosts = resolve
  })
  const output = new PassThrough()
  let renderedMarkup = ''

  output.on('data', chunk => {
    renderedMarkup += chunk.toString()
  })

  const finished = new Promise<void>((resolve, reject) => {
    output.on('end', resolve)
    output.on('error', reject)
  })

  let resolveShell: () => void = () => undefined
  const shellReady = new Promise<void>(resolve => {
    resolveShell = resolve
  })
  const rendering = renderToPipeableStream(
    jsx(PostsFilterProvider, {
      children: jsx(PostsView, {
        postCount: createElement(Suspense, { fallback: null }, createElement(PostsCount, { postsPromise })),
        children: createElement(
          Suspense,
          { fallback: createElement(ContentSkeleton, { variant: 'posts' }) },
          createElement(PostsBrowser, { postsPromise, basePath: '/preview' })
        )
      })
    }),
    {
      // Observe the shell before releasing the source records.
      onShellReady: () => {
        rendering.pipe(output)
        resolveShell()
      },
      onError: error => {
        output.destroy(error instanceof Error ? error : new Error(String(error)))
      }
    }
  )

  await shellReady

  assert.match(renderedMarkup, /<h1>Posts<\/h1>/)
  assert.match(renderedMarkup, /type="search"/)
  assert.match(renderedMarkup, /All formats/)
  assert.doesNotMatch(renderedMarkup, /class="post-card"/)

  resolvePosts([{ ...posts[0], format: 'Video', commentCount: 20 }])
  await finished

  assert.match(renderedMarkup, /class="post-card"/)
  assert.match(renderedMarkup, /20<!-- --> comments/)
  assert.match(renderedMarkup, /class="post-count">1<!-- --> <!-- -->post/)
  assert.equal(renderedMarkup.match(/<h1>Posts<\/h1>/g)?.length, 1)
})
