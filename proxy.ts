/* ------------------------------------------------------------
Provides proxy functionality for audience insights.
---------------------------------------------------------------*/

import { NextResponse, type NextRequest } from 'next/server'
import { sessionCookieName } from '@/lib/server/config'

// Rejects production previews and redirects missing sessions before streaming begins.
export const proxy = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname
  if (pathname === '/preview' || pathname.startsWith('/preview/')) {
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
    }
    return NextResponse.next()
  }

  // This is an early redirect only; protected routes still validate the full database session.
  if (!request.cookies.get(sessionCookieName)?.value) {
    return NextResponse.redirect(new URL('/connect?reason=session', request.url))
  }
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export const config = { matcher: ['/dashboard/:path*', '/analysis', '/preview/:path*'] }
