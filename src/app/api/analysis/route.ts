/* ------------------------------------------------------------
Starts analysis immediately and returns progress for the signed-in owner's current input.
---------------------------------------------------------------*/

import { NextResponse } from 'next/server'

import { getCurrentAccount } from '@/lib/server/session'
import { runAnalysis } from '@/lib/server/run-analysis'
import { getAudienceFeedback } from '@/lib/data/audience'
import { getCurrentAnalysis } from '@/lib/server/saved-analysis'
import { getFanvueAccessToken, ReconnectRequired } from '@/lib/server/fanvue'
import { requireSameOrigin, errorResponse, RequestError } from '@/lib/server/http'

export const maxDuration = 300

// Starts analysis immediately and returns progress for the signed-in owner's current input.
export const GET = async () =>
  Promise.resolve()
    .then(async () => {
      const account = await getCurrentAccount()

      if (!account) {
        throw new RequestError('Please reconnect to continue.', 401)
      }

      const job = await getCurrentAnalysis(account.id, await getAudienceFeedback(account.audience_creator_id))

      const isRunning = job && ['analysing', 'validating'].includes(job.status)
      const isInterrupted = isRunning && (!job.lease_until || Date.parse(job.lease_until) <= Date.now())
      const currentJob = isInterrupted
        ? { ...job, status: 'failed', error: 'Analysis was interrupted. Please try again.' }
        : job

      return NextResponse.json({ job: currentJob }, { headers: { 'Cache-Control': 'no-store' } })
    })
    .catch(errorResponse)

// Runs analysis immediately inside the authenticated request and returns its saved outcome.
export const POST = async (request: Request) =>
  Promise.resolve()
    .then(async () => {
      requireSameOrigin(request)
      const account = await getCurrentAccount()

      if (!account) {
        throw new RequestError('Please reconnect to continue.', 401)
      }

      await getFanvueAccessToken(account.id)
      const job = await runAnalysis(account.id)

      return NextResponse.json(
        { job: { id: job.id, status: job.status, error: job.error } },
        {
          status: job.status === 'complete' || job.status === 'failed' ? 200 : 202,
          headers: { 'Cache-Control': 'no-store' }
        }
      )
    })
    .catch(error =>
      errorResponse(
        error instanceof ReconnectRequired
          ? new RequestError('Your Fanvue connection has expired. Please reconnect to continue.', 401)
          : error
      )
    )
