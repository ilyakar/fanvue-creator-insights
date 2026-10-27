/* ------------------------------------------------------------
Returns only the signed-in owner's latest run status for genuine progress reporting.
---------------------------------------------------------------*/

import { NextResponse } from 'next/server'
import { getCurrentAccount } from '@/lib/server/session'
import { enqueueAnalysis } from '@/lib/server/analysis'
import { getDatabase, unwrapDatabase } from '@/lib/server/database'
import { getFanvueAccessToken, ReconnectRequired } from '@/lib/server/fanvue'
import { requireSameOrigin, errorResponse, RequestError } from '@/lib/server/http'

// Returns only the signed-in owner's latest run status for genuine progress reporting.
export const GET = async () =>
  Promise.resolve()
    .then(async () => {
      const account = await getCurrentAccount()

      if (!account) {
        throw new RequestError('Please reconnect to continue.', 401)
      }

      const job = unwrapDatabase(
        await getDatabase()
          .from('analysis_jobs')
          .select('id,status,error,created_at,completed_at')
          .eq('user_id', account.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      )

      return NextResponse.json({ job }, { headers: { 'Cache-Control': 'no-store' } })
    })
    .catch(errorResponse)

// Queues validated sample content for a real model without running work after a response.
export const POST = async (request: Request) =>
  Promise.resolve()
    .then(async () => {
      requireSameOrigin(request)
      const account = await getCurrentAccount()

      if (!account) {
        throw new RequestError('Please reconnect to continue.', 401)
      }

      await getFanvueAccessToken(account.id)
      const job = await enqueueAnalysis(account.id, true)

      return NextResponse.json(
        { job: { id: job.id, status: job.status } },
        { status: 202, headers: { 'Cache-Control': 'no-store' } }
      )
    })
    .catch((error) =>
      errorResponse(
        error instanceof ReconnectRequired
          ? new RequestError('Your Fanvue connection has expired. Please reconnect to continue.', 401)
          : error
      )
    )
