/* ------------------------------------------------------------
Runs the durable analysis worker locally until a graceful shutdown is requested.
---------------------------------------------------------------*/

import { processNextAnalysis } from '@/lib/server/analysis-worker'

let isStopping = false

// Requests a graceful stop after the current leased run finishes.
const requestStop = () => {
  isStopping = true
}

process.on('SIGINT', requestStop)
process.on('SIGTERM', requestStop)

// Processes queued jobs without relying on a browser session.
const runWorker = async () => {
  console.info('Audience analysis worker ready.')

  while (!isStopping) {
    const processed = await processNextAnalysis()

    if (!processed) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

void runWorker().catch(() => {
  console.error('Worker stopped. Check server configuration and database availability.')
  process.exitCode = 1
})
