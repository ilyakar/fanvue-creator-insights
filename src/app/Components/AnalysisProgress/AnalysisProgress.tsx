'use client'

/* ------------------------------------------------------------
Displays saved analysis progress and supports explicit starts and retries.
---------------------------------------------------------------*/

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRotateRight, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

import type { JobStage } from '@/lib/types'

const stageOrder: JobStage[] = ['queued', 'analysing', 'validating', 'complete']

// Displays saved analysis progress and supports explicit starts and retries.
const AnalysisProgress = ({
  initialStage,
  initialError,
  shouldStart
}: {
  initialStage: JobStage | 'idle'
  initialError: string | null
  shouldStart: boolean
}) => {
  const router = useRouter()

  const hasStarted = useRef(false)

  const [analysisStage, setAnalysisStage] = useState(shouldStart ? 'analysing' : initialStage)
  const [errorMessage, setErrorMessage] = useState(initialError)
  const [isRequestingAnalysis, setIsRequestingAnalysis] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  let heading = 'Analysing sample comments'
  let description = 'Keep this page open until your insights are ready.'
  let actionLabel = 'Try again'

  // Invites an explicit analysis request after the previous saved results were cleared.
  if (analysisStage === 'idle') {
    heading = 'Create your insights'
    description = 'Analyse sample comments to find praise, requests and suggestions.'
    actionLabel = 'Prepare my insights'
  }

  // Explains an interrupted analysis without suggesting that source comments were lost.
  else if (analysisStage === 'failed') {
    heading = 'Analysis couldn’t be completed'
    description = 'Try again to analyse the sample comments.'
  }

  // Polls saved processing state; no timing-based simulated progress is used.
  useEffect(() => {
    if (analysisStage === 'complete') {
      router.replace('/dashboard')

      return
    }

    if (analysisStage === 'failed' || analysisStage === 'idle') {
      return
    }

    let isActive = true
    const waitingTimer = setTimeout(() => setIsWaiting(true), 30000)

    // Reads only the current user's job and stops polling after the component unmounts.
    const checkProgress = () =>
      fetch('/api/analysis', { cache: 'no-store' })
        .then(async response => {
          if (response.status === 401) {
            router.replace('/connect?reason=session')

            return null
          }

          if (!response.ok) {
            throw new Error()
          }

          return response.json()
        })
        .then(analysisResponse => {
          if (
            isActive &&
            analysisResponse?.job &&
            analysisResponse.job.status !== 'queued' &&
            !(isRequestingAnalysis && analysisResponse.job.status === 'failed')
          ) {
            setAnalysisStage(analysisResponse.job.status)
            setErrorMessage(analysisResponse.job.error)
          }
        })
        .catch(() => {
          if (isActive) {
            setErrorMessage('We’re having trouble checking progress. We’ll keep trying.')
          }
        })

    const interval = setInterval(checkProgress, 2000)
    void checkProgress()

    return () => {
      isActive = false
      clearInterval(interval)
      clearTimeout(waitingTimer)
    }
  }, [analysisStage, isRequestingAnalysis, router])

  // Holds the analysis request open until inference finishes or returns an existing run.
  const startAnalysis = useCallback(() => {
    setIsRequestingAnalysis(true)
    setAnalysisStage('analysing')
    setErrorMessage(null)
    setIsWaiting(false)

    fetch('/api/analysis', { method: 'POST' })
      .then(async response => {
        const analysisResponse = await response.json()

        if (response.status === 401) {
          window.location.assign('/connect?reason=session')

          return
        }

        if (!response.ok) {
          throw new Error(analysisResponse.error)
        }

        setAnalysisStage(analysisResponse.job.status)
        setErrorMessage(analysisResponse.job.error || null)
        setIsWaiting(false)
      })
      .catch(error => {
        setAnalysisStage('failed')
        setErrorMessage(error.message || 'Please try again in a moment.')
      })
      .finally(() => setIsRequestingAnalysis(false))
  }, [])

  // Starts immediately after sign-in, with a ref preventing duplicate requests during effect replay.
  useEffect(() => {
    if (shouldStart && !hasStarted.current) {
      hasStarted.current = true
      startAnalysis()
    }
  }, [shouldStart, startAnalysis])

  // Retries analysis when the creator presses the action button.
  const _handlePrepareAnalysis = () => startAnalysis()

  return (
    <div className="analysis-card">
      <div
        className={['analysis-symbol', analysisStage !== 'failed' && analysisStage !== 'idle' && 'processing']
          .filter(Boolean)
          .join(' ')}>
        <FontAwesomeIcon icon={faWandMagicSparkles} />
      </div>

      <h1>{heading}</h1>
      <p>{description}</p>

      <ol className="analysis-stages">
        <li className="done">
          <span>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          Connected to Fanvue
        </li>

        {[
          { stage: 'analysing' as const, label: 'Analysing each post and grouping related themes' },
          { stage: 'validating' as const, label: 'Checking the comments behind each insight' },
          { stage: 'complete' as const, label: 'Preparing your insights' }
        ].map(progressStep => {
          const isDone = stageOrder.indexOf(analysisStage as JobStage) > stageOrder.indexOf(progressStep.stage)
          const isCurrent = analysisStage === progressStep.stage

          return (
            <li
              className={[isDone && 'done', isCurrent && 'current'].filter(Boolean).join(' ')}
              key={progressStep.stage}>
              <span>
                {isDone && <FontAwesomeIcon icon={faCheck} />}
                {isCurrent && <span className="loading-indicator" />}
              </span>

              {progressStep.label}
            </li>
          )
        })}
      </ol>

      {isWaiting && analysisStage !== 'failed' && (
        <p className="analysis-notice">
          We’re still analysing your comments. Keep this page open until your insights are ready.
        </p>
      )}

      {errorMessage && (
        <p className="analysis-error" role="status">
          {errorMessage}
        </p>
      )}

      {(analysisStage === 'failed' || analysisStage === 'idle') && (
        <div className="analysis-actions">
          <button className="button primary" onClick={_handlePrepareAnalysis} disabled={isRequestingAnalysis}>
            <FontAwesomeIcon icon={faRotateRight} />
            {isRequestingAnalysis ? 'One moment…' : actionLabel}
          </button>
        </div>
      )}

      <span className="sample-pill">
        <span />
        Sample data · Real AI analysis
      </span>
    </div>
  )
}

export default AnalysisProgress
