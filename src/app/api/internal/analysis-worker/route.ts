/* ------------------------------------------------------------
Starts a leased analysis job only for the authenticated database scheduler.
---------------------------------------------------------------*/

import { after, NextResponse } from 'next/server'

import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { processNextAnalysis } from '@/lib/server/analysis-worker'

export const maxDuration = 300

// Verifies the private scheduler secret before allowing a background worker invocation.
export const POST = async (request: Request) => {
  const authorization = request.headers.get('authorization') || ''
  const secret = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''

  if (!/^[a-f0-9]{64}$/.test(secret)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const isAuthorized = unwrapDatabase(
    await getDatabase().rpc('verify_analysis_worker_secret', { supplied_secret: secret })
  )

  if (!isAuthorized) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // The lease makes interrupted work recoverable by a later scheduled invocation.
  after(async () => {
    await processNextAnalysis().catch(() => console.error('Analysis worker invocation failed.'))
  })

  return NextResponse.json({ accepted: true }, { status: 202 })
}
