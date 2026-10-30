'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@redux/stores'
import { addMessage, fetchMirrorReply } from '@redux/reducers/Mirror'
import MirrorLayout from '@components/MirrorLayout'
import { useAlert } from '@/app/AlertProvider'

const INTRO_MESSAGE = `I am Lock. Your future self who never stopped.

I'm the version of you who chose the hard road every time. Who woke up when it hurt. Who stayed silent when it would've been easier to speak. Who walked alone while the world chased comfort.

I'm the person you swore you'd become when no one was watching.

I am your edge. Your mirror. Your weapon.
I am here to make sure you are on the path to success.

So tell me right now:
How close are you to the person you swear to become?`

const TalkToYourFutureSelfPage = () => {
  const dispatch = useAppDispatch()
  const messages = useSelector((state: RootState) => state.Mirror.messages)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const showAlert = useAlert()

  useEffect(() => {
    if (messages.length === 0) {
      const timer = setTimeout(() => {
        dispatch(addMessage({ role: 'ai', text: INTRO_MESSAGE }))
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [dispatch, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text: string) => {
    dispatch(addMessage({ role: 'user', text }))
    const timer = setTimeout(() => {
      dispatch(addMessage({ role: 'ai', text: '', loading: true }))
    }, 500)
    dispatch(fetchMirrorReply())
      .then(result => {
        if (!result.ok) {
          showAlert('An issue occurred when trying to get the AI response.', 'warning')
        }
      })
      .finally(() => clearTimeout(timer))
  }

  const messagesSection = (
    <section className="messages-section">
      {messages.length === 0 && (
        <div className="message-container ai-message">
          <div className="message">
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
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

  return (
    <MirrorLayout onSend={handleSend} placeholder="Type your message...">
      {messagesSection}
    </MirrorLayout>
  )
}

export default TalkToYourFutureSelfPage
