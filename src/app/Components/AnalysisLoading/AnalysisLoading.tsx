'use client'

/* ------------------------------------------------------------
Displays actual durable job stages and supports retrying failed analysis.
---------------------------------------------------------------*/

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faRotateRight, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

import type { JobStage } from '@/lib/types'

const stageOrder: JobStage[] = ['queued', 'analysing', 'validating', 'complete']

// Displays actual durable job stages and supports retrying failed analysis.
const AnalysisLoading = ({
  initialStage,
  initialError
}: {
  initialStage: JobStage | 'idle'
  initialError: string | null
}) => {
  const router = useRouter()
  const [stage, setStage] = useState(initialStage)
  const [errorMessage, setErrorMessage] = useState(initialError)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  let heading = 'Getting to know your audience.'
  let description = 'We’re looking through sample comments to discover the things that matter most to fans.'
  let actionLabel = 'Try again'

  // Invites an explicit analysis request after the previous saved results were cleared.
  if (stage === 'idle') {
    heading = 'Ready for a fresh perspective?'
    description = 'Prepare a fresh set of insights from our sample comments, whenever you’re ready.'
    actionLabel = 'Prepare my insights'
  }

  // Explains an interrupted analysis without suggesting that source comments were lost.
  else if (stage === 'failed') {
    heading = 'Let’s give that another try.'
    description = 'Your comments are safe. We just couldn’t finish preparing your insights this time.'
  }

  // Polls saved processing state; no timing-based simulated progress is used.
  useEffect(() => {
    if (stage === 'complete') {
      router.replace('/dashboard')

      return
    }

    if (stage === 'failed' || stage === 'idle') {
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
        .then(body => {
          if (isActive && body?.job) {
            setStage(body.job.status)
            setErrorMessage(body.job.error)
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
  }, [stage, router])

  // Requeues a failed run after verifying the account connection on the server.
  const _handleRetry = () => {
    setIsRetrying(true)

    fetch('/api/analysis', { method: 'POST' })
      .then(async response => {
        const body = await response.json()

        if (response.status === 401) {
          window.location.assign('/connect?reason=session')

          return
        }

        if (!response.ok) {
          throw new Error(body.error)
        }

        setStage(body.job.status)
        setErrorMessage(null)
        setIsWaiting(false)
      })
      .catch(error => setErrorMessage(error.message || 'Please try again in a moment.'))
      .finally(() => setIsRetrying(false))
  }

  return (
    <div className="analysis-card">
      <div
        className={['analysis-symbol', stage !== 'failed' && stage !== 'idle' && 'processing']
          .filter(Boolean)
          .join(' ')}>
        <FontAwesomeIcon icon={faWandMagicSparkles} />
      </div>

      <span className="eyebrow">GOOD INSIGHTS TAKE A LITTLE LISTENING</span>
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
          { stage: 'analysing' as const, label: 'Analysing comments and discovering themes' },
          { stage: 'validating' as const, label: 'Checking the comments behind each insight' },
          { stage: 'complete' as const, label: 'Preparing your insights' }
        ].map(entry => {
          const isDone = stageOrder.indexOf(stage as JobStage) > stageOrder.indexOf(entry.stage)
          const isCurrent = stage === entry.stage

          return (
            <li className={[isDone && 'done', isCurrent && 'current'].filter(Boolean).join(' ')} key={entry.stage}>
              <span>{isDone ? <FontAwesomeIcon icon={faCheck} /> : <span />}</span>
              {entry.label}
            </li>
          )
        })}
      </ol>

      {stage === 'queued' && <p className="analysis-notice">Your analysis is queued and waiting to begin.</p>}

      {isWaiting && stage !== 'failed' && (
        <p className="analysis-notice">
          This is taking a little longer. You can return later. Your analysis doesn’t depend on this page staying open.
        </p>
      )}

      {errorMessage && (
        <p className="analysis-error" role="status">
          {errorMessage}
        </p>
      )}

      {(stage === 'failed' || stage === 'idle') && (
        <div className="analysis-actions">
          <button className="button primary" onClick={_handleRetry} disabled={isRetrying}>
            <FontAwesomeIcon icon={faRotateRight} />
            {isRetrying ? 'One moment…' : actionLabel}
          </button>

          <Link className="text-button" href="/dashboard/settings">
            Check connection <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      )}

      <span className="sample-pill">
        <span />
        Sample data · Real AI analysis
      </span>
    </div>
  )
}

export default AnalysisLoading
