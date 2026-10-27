/* ------------------------------------------------------------
Requests a graceful stop after the current leased run finishes.
---------------------------------------------------------------*/

import { randomUUID } from 'node:crypto'
import { getDatabase, unwrapDatabase } from '../lib/server/database'
import { sampleDataProvider } from '../lib/data/provider'
import { analyseAudience } from '../lib/analysis/service'
import type { AnalysisJob } from '../lib/types'

let isStopping = false

// Requests a graceful stop after the current leased run finishes.
const requestStop = () => {
  isStopping = true
}
process.on('SIGINT', requestStop)
process.on('SIGTERM', requestStop)

// Claims persisted jobs and saves results independently of a browser request.
const runWorker = async () => {
  const database = getDatabase()
  console.info('Audience analysis worker ready.')
  while (!isStopping) {
    const leaseToken = randomUUID()
    const jobs = unwrapDatabase(await database.rpc('claim_analysis_job', { worker_lease: leaseToken })) as AnalysisJob[]
    const job = jobs?.[0]
    if (!job) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      continue
    }
    const heartbeat = setInterval(() => {
      void database
        .from('analysis_jobs')
        .update({ lease_until: new Date(Date.now() + 600000).toISOString() })
        .eq('id', job.id)
        .eq('lease_token', leaseToken)
        .then((response) => {
          if (response.error) console.error('Analysis lease heartbeat failed.')
        })
    }, 30000)
    await sampleDataProvider
      .getDataset()
      .then((dataset) =>
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
      .then(async (result) => {
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
  }
}

void runWorker().catch(() => {
  console.error('Worker stopped. Check server configuration and database availability.')
  process.exitCode = 1
})
