/* ------------------------------------------------------------
Claims and processes one durable analysis job with a renewable lease.
---------------------------------------------------------------*/

import { randomUUID } from 'node:crypto'

import { getAudienceFeedback } from '@/lib/data/audience'
import { analyseAudience } from '@/lib/analysis/service'
import type { AnalysisJob } from '@/lib/types'

import { getDatabase, unwrapDatabase } from './database'

// Claims one job so scheduled invocations and local workers can safely share the queue.
export const processNextAnalysis = async (): Promise<boolean> => {
  const database = getDatabase()
  const leaseToken = randomUUID()
  const jobs = unwrapDatabase(await database.rpc('claim_analysis_job', { worker_lease: leaseToken })) as AnalysisJob[]
  const job = jobs?.[0]

  if (!job) {
    return false
  }

  // Renew ownership while the external model request is still processing.
  const heartbeat = setInterval(() => {
    void database
      .from('analysis_jobs')
      .update({ lease_until: new Date(Date.now() + 600000).toISOString() })
      .eq('id', job.id)
      .eq('lease_token', leaseToken)
      .then(response => {
        if (response.error) {
          console.error('Analysis lease heartbeat failed.')
        }
      })
  }, 30000)

  // Persist only results completed by this lease holder, then release its heartbeat.
  await getAudienceFeedback(job.audience_creator_id)
    .then(dataset =>
      analyseAudience(dataset, async () => {
        unwrapDatabase(
          await database
            .from('analysis_jobs')
            .update({ status: 'validating' })
            .eq('id', job.id)
            .eq('lease_token', leaseToken)
        )
      })
    )
    .then(async result => {
      unwrapDatabase(
        await database
          .from('analysis_jobs')
          .update({
            status: 'complete',
            result,
            completed_at: new Date().toISOString(),
            lease_token: null,
            lease_until: null
          })
          .eq('id', job.id)
          .eq('lease_token', leaseToken)
      )
    })
    .catch(async () => {
      unwrapDatabase(
        await database
          .from('analysis_jobs')
          .update({
            status: 'failed',
            error: 'We couldn’t finish your analysis. Please try again.',
            lease_token: null,
            lease_until: null
          })
          .eq('id', job.id)
          .eq('lease_token', leaseToken)
      )

      console.error('An analysis run failed. No source comments or credentials were logged.')
    })
    .finally(() => clearInterval(heartbeat))

  return true
}
