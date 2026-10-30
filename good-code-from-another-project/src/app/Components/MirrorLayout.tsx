'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import '@styles/theMirrorPage.scss'
import MyFutureSelfCard from './MyFutureSelfCard'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/stores'
import { getArchetype } from '@data/archetypes'
import { supabase } from '@/lib/supabaseClient'
import { useAlert } from '@/app/AlertProvider'

interface MirrorLayoutProps {
  children: React.ReactNode
  onSend: (text: string) => void
  placeholder?: string
  hideInput?: boolean
}

const MirrorLayout = ({
  children,
  onSend,
  placeholder = 'Type your message...',
  hideInput = false
}: MirrorLayoutProps) => {
  const { archetypeName, values, rituals } = useSelector((state: RootState) => state.User)
  const router = useRouter()
  const pathname = usePathname()
  const archetype = getArchetype(archetypeName || 'Stoic')!
  const [inputText, setInputText] = useState('')
  const showAlert = useAlert()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCheckRef = useRef<number | null>(null)
  const detectedAudioRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Redirect visitors without an active session to the account creation page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/onboarding/4-create-account-and-login')
      }
    })
  }, [router])

  const adjustTextareaHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const newHeight = Math.min(el.scrollHeight, 150) + 2
    el.style.height = `${newHeight}px`
  }

  const handleSend = () => {
    const text = inputText.trim()
    if (!text) return
    onSend(text)
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ─── Microphone logic ───────────────────────────────────────────────────────
  const beginSilenceDetection = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyserRef.current = analyser
    source.connect(analyser)
    analyser.fftSize = 2048

    const dataArray = new Uint8Array(analyser.fftSize)
    detectedAudioRef.current = false

    audioCheckRef.current = window.setInterval(() => {
      analyser.getByteTimeDomainData(dataArray)
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += Math.abs(dataArray[i] - 128)
      }
      if (sum / dataArray.length > 2) {
        detectedAudioRef.current = true
      }
    }, 200)
  }

  const endSilenceDetection = () => {
    clearInterval(audioCheckRef.current ?? undefined)
    audioCheckRef.current = null
    analyserRef.current = null
    audioContextRef.current?.close()
    audioContextRef.current = null
  }

  const skipTranscriptionIfNoAudio = (): boolean => {
    if (!detectedAudioRef.current) {
      audioChunksRef.current = []
      return true
    }
    return false
  }

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream)
        mediaStreamRef.current = stream
        beginSilenceDetection(stream)
        audioChunksRef.current = []
        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data)
          }
        }
        recorder.onstop = () => {
          endSilenceDetection()
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          if (skipTranscriptionIfNoAudio()) {
            return
          }
          const formData = new FormData()
          formData.append('file', blob)
          setIsProcessing(true)
          const controller = new AbortController()
          const timeout = window.setTimeout(() => {
            controller.abort()
            showAlert('Sorry, speech-to-text recognition failed. Please try again.', 'warning')
            setIsProcessing(false)
          }, 30000)
          fetch('/api/speechToText', {
            method: 'POST',
            body: formData,
            signal: controller.signal
          })
            .then(res => {
              clearTimeout(timeout)
              return res.json()
            })
            .then(data => {
              if (data.text) {
                setInputText(prev => (prev ? prev + ' ' : '') + data.text)
                adjustTextareaHeight()
              }
            })
            .catch(err => {
              if (err.name !== 'AbortError') {
                console.error('Transcription request failed', err)
                showAlert('Sorry, speech-to-text recognition failed. Please try again.', 'warning')
              }
            })
            .finally(() => {
              setIsProcessing(false)
            })
        }
        mediaRecorderRef.current = recorder
        recorder.start()
        setIsRecording(true)
      })
      .catch(err => {
        console.error('Could not start recording', err)
        showAlert("Voice recording won't work because you didn't allow microphone permission.", 'warning')
      })
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    mediaStreamRef.current?.getTracks().forEach(track => track.stop())
    endSilenceDetection()
    mediaStreamRef.current = null
    setIsRecording(false)
  }

  const handleMicrophone = () => {
    if (isProcessing) {
      return
    }
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputText])

  return (
    <>
      <header className="the-mirror-header">
        <section className="header-left">
          <Image src="/logo-mini.png" alt="Archetype Logo Mini" width={40} height={40} />
          <div className="header-level-progress">
            <div className="progress-text">Stoic Level 3</div>
            <div className="progress-bar" style={{ width: `${100 - 30}%` }} />
          </div>
          <div className="header-pill">
            <Image src="/the-mirror-icons/lightning.png" alt="Streak Icon" width={12} height={24} />
            Streak: 5 Days
          </div>
        </section>
        <section className="header-center">
          <div className="header-pill-toggle">
            <button
              className={`header-pill${pathname?.includes('talk-to-your-future-self') ? 'selected' : ''}`}
              onClick={() => router.push('/the-mirror/talk-to-your-future-self')}>
              <Image src="/the-mirror-icons/bubble.png" alt="Talk To Future Self Icon" width={24} height={24} />
              Talk To Your Future Self
            </button>
            <button
              className={`header-pill${pathname?.includes('daily-check-in') ? 'selected' : ''}`}
              onClick={() => router.push('/the-mirror/daily-check-in')}>
              <Image src="/the-mirror-icons/mirror.png" alt="Daily Check-In Icon" width={24} height={24} />
              Daily Check-In
            </button>
          </div>
        </section>
        <section className="header-right">
          <button className="header-pill">
            <Image src="/the-mirror-icons/brain.png" alt="Memory Icon" width={24} height={24} />
            Memory
          </button>
        </section>
      </header>

      <div className="size-l container">
        <section className="page-content">
          <MyFutureSelfCard archetypeName={archetype.name} values={values} rituals={rituals} alignmentPercent={65} />
          <section className="chat-section">
            {children}
            {!hideInput && (
              <section className="user-input-section">
                <button
                  className={`microphone${isRecording || isProcessing ? 'recording' : ''}${isProcessing ? 'processing' : ''}`}
                  onClick={handleMicrophone}>
                  {isProcessing ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : isRecording ? (
                    <i className="fa-solid fa-stop"></i>
                  ) : (
                    <i className="fa-solid fa-microphone"></i>
                  )}
                </button>
                <button className={`send-message${isRecording || isProcessing ? 'hidden' : ''}`} onClick={handleSend}>
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder={placeholder}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={adjustTextareaHeight}
                />
              </section>
            )}
          </section>
        </section>
      </div>
    </>
  )
}

export default MirrorLayout
