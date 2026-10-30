'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@redux/stores'
import { addMessage, processDailyAnswer } from '@redux/reducers/DailyCheckIn'
import MirrorLayout from '@components/MirrorLayout'
import { DAILY_CHECK_IN_QUESTIONS } from '@data/dailyCheckInQuestions'
import { useAlert } from '@/app/AlertProvider'

const DailyCheckInPage = () => {
  const dispatch = useAppDispatch()
  const { messages, analysis } = useSelector((state: RootState) => state.DailyCheckIn)
  const showAlert = useAlert()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Injects the first question when the chat is empty
  useEffect(() => {
    if (analysis || messages.length > 0) return

    const timer = setTimeout(() => {
      dispatch(addMessage({ role: 'ai', text: DAILY_CHECK_IN_QUESTIONS[0] }))
    }, 500)
    return () => clearTimeout(timer)
  }, [dispatch, messages.length, analysis])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text: string) => {
    dispatch(addMessage({ role: 'user', text }))
    const loadingTimer = setTimeout(() => {
      dispatch(addMessage({ role: 'ai', text: '', loading: true }))
    }, 200)

    dispatch(processDailyAnswer())
      .then(result => {
        if (!result.ok) {
          showAlert(result.summary || 'Answer was not sufficient.', 'warning')
        }
      })
      .finally(() => clearTimeout(loadingTimer))
  }

  const messagesSection = (
    <section className="messages-section">
      {messages.map((msg, index) => (
        <div key={index} className={`message-container ${msg.role}-message`}>
          <div className="message">
            {msg.loading ? (
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
            ) : (
              msg.text.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </section>
  )

  const auditSection = analysis && (
    <section className="daily-audit-section">
      <h2>Daily Check-In Audit</h2>

      <div className="alignment-progress">
        <div className="progress-text">
          Today's Alignment: <strong>{analysis.alignmentScore}%</strong>
        </div>
        <div className="progress-bar" style={{ width: `${100 - analysis.alignmentScore}%` }} />
      </div>

      <p>{analysis.summary}</p>

      <h3>Moments of Strength</h3>
      <p>{analysis.momentsOfStrength}</p>

      <h3>Flags Raised</h3>
      <p>{analysis.flagsRaised}</p>

      <h3>Drift Signals</h3>
      <p>{analysis.driftSignals}</p>

      <h3>Forecast</h3>
      <p>{analysis.forecast}</p>
    </section>
  )

  return (
    <MirrorLayout onSend={handleSend} placeholder="Type your answer..." hideInput={Boolean(analysis)}>
      {analysis ? auditSection : messagesSection}
    </MirrorLayout>
  )
}

export default DailyCheckInPage
